import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});
const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick = _cardIndex => {},
  onFrontCardChange = _cardIndex => {},
  onReady = _controls => {},
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const motion =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          duration: 0.95
        }
      : {
          ease: 'power2.out',
          duration: 0.55
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const intervalRef = useRef();
  const isHoveringRef = useRef(false);
  const isInViewRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const touchStartRef = useRef({ x: 0, y: 0, active: false });
  const container = useRef(null);
  const onReadyRef = useRef(onReady);
  const onFrontCardChangeRef = useRef(onFrontCardChange);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onFrontCardChangeRef.current = onFrontCardChange;
  }, [onFrontCardChange]);

  useEffect(() => {
    const total = refs.length;
    isPageVisibleRef.current = !document.hidden;
    order.current = Array.from({ length: total }, (_, i) => i);
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const shouldRun = () => isPageVisibleRef.current && isInViewRef.current && (!pauseOnHover || !isHoveringRef.current);
    const emitFrontCardChange = () => {
      const frontCardIndex = order.current[0];
      if (typeof frontCardIndex !== 'number') return;
      onFrontCardChangeRef.current(frontCardIndex);
    };

    const animateToOrder = animate => {
      order.current.forEach((cardIndex, slotIndex) => {
        const el = refs[cardIndex]?.current;
        if (!el) return;

        const slot = makeSlot(slotIndex, cardDistance, verticalDistance, refs.length);
        gsap.killTweensOf(el);
        gsap.set(el, { zIndex: slot.zIndex });

        const target = {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          skewY: skewAmount
        };

        if (!animate) {
          gsap.set(el, target);
          return;
        }

        gsap.to(el, {
          ...target,
          duration: motion.duration,
          ease: motion.ease
        });
      });
    };

    const rotateOrder = direction => {
      if (order.current.length < 2) return false;

      if (direction === 'prev') {
        const currentOrder = order.current;
        const back = currentOrder[currentOrder.length - 1];
        const rest = currentOrder.slice(0, -1);
        order.current = [back, ...rest];
        return true;
      }

      const [front, ...rest] = order.current;
      order.current = [...rest, front];
      return true;
    };

    const stopAutoSwap = () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    };

    const step = (direction, options = { restartAuto: true }) => {
      if (!rotateOrder(direction)) return;
      emitFrontCardChange();
      animateToOrder(true);
      if (options.restartAuto && shouldRun()) {
        startAutoSwap();
      }
    };

    const startAutoSwap = () => {
      stopAutoSwap();
      if (!shouldRun()) return;
      intervalRef.current = window.setInterval(() => step('next', { restartAuto: false }), delay);
    };

    onReadyRef.current({
      next: () => step('next'),
      prev: () => step('prev')
    });

    emitFrontCardChange();
    animateToOrder(false);
    startAutoSwap();

    const node = container.current;
    if (!node) {
      return () => {
        stopAutoSwap();
        refs.forEach(r => r.current && gsap.killTweensOf(r.current));
      };
    }
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        isInViewRef.current = entry?.isIntersecting ?? true;
        if (!shouldRun()) {
          stopAutoSwap();
          return;
        }
        startAutoSwap();
      },
      { threshold: 0.1 }
    );
    observer.observe(node);

    const onVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      if (!shouldRun()) {
        stopAutoSwap();
        return;
      }
      startAutoSwap();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onTouchStart = event => {
      if (event.touches.length !== 1) {
        touchStartRef.current.active = false;
        return;
      }
      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        active: true
      };
    };

    const onTouchEnd = event => {
      const touchStart = touchStartRef.current;
      if (!touchStart.active || event.changedTouches.length === 0) return;
      touchStartRef.current.active = false;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const isHorizontalSwipe = absX > 42 && absX > absY * 1.2;
      if (!isHorizontalSwipe) return;

      if (deltaX < 0) {
        step('next');
        return;
      }
      step('prev');
    };

    const onTouchCancel = () => {
      touchStartRef.current.active = false;
    };
    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('touchend', onTouchEnd, { passive: true });
    node.addEventListener('touchcancel', onTouchCancel, { passive: true });

    if (pauseOnHover) {
      const pause = () => {
        isHoveringRef.current = true;
        stopAutoSwap();
      };
      const resume = () => {
        isHoveringRef.current = false;
        startAutoSwap();
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        isHoveringRef.current = false;
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        node.removeEventListener('touchstart', onTouchStart);
        node.removeEventListener('touchend', onTouchEnd);
        node.removeEventListener('touchcancel', onTouchCancel);
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        stopAutoSwap();
        refs.forEach(r => r.current && gsap.killTweensOf(r.current));
      };
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchend', onTouchEnd);
      node.removeEventListener('touchcancel', onTouchCancel);
      stopAutoSwap();
      refs.forEach(r => r.current && gsap.killTweensOf(r.current));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, motion.duration, motion.ease]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
