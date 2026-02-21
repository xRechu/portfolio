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
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const isHoveringRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const isInViewRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const queueRef = useRef([]);
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
    queueRef.current = [];
    isAnimatingRef.current = false;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const shouldRun = () => isPageVisibleRef.current && isInViewRef.current && (!pauseOnHover || !isHoveringRef.current);
    const emitFrontCardChange = () => {
      const frontCardIndex = order.current[0];
      if (typeof frontCardIndex !== 'number') return;
      onFrontCardChangeRef.current(frontCardIndex);
    };

    const stopAutoSwap = () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    };

    const startAutoSwap = () => {
      stopAutoSwap();
      if (!shouldRun()) return;
      intervalRef.current = window.setInterval(() => enqueueSwap('next'), delay);
    };

    const createNextTimeline = () => {
      if (order.current.length < 2) return null;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
        emitFrontCardChange();
      });
      return tl;
    };

    const createPrevTimeline = () => {
      if (order.current.length < 2) return null;

      const currentOrder = order.current;
      const back = currentOrder[currentOrder.length - 1];
      const rest = currentOrder.slice(0, -1);
      const nextOrder = [back, ...rest];

      const elBack = refs[back].current;
      const tl = gsap.timeline();

      tl.to(elBack, {
        y: '-=120',
        duration: Math.max(0.25, config.durDrop * 0.45),
        ease: config.ease
      });

      tl.addLabel('reflow', `-=${Math.max(0.1, config.durDrop * 0.2)}`);
      nextOrder.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'reflow');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `reflow+=${i * 0.08}`
        );
      });

      tl.call(() => {
        order.current = nextOrder;
        emitFrontCardChange();
      });
      return tl;
    };

    const processQueue = () => {
      if (isAnimatingRef.current) {
        return;
      }

      const direction = queueRef.current.shift();
      if (!direction) {
        return;
      }

      const nextTimeline = direction === 'prev' ? createPrevTimeline() : createNextTimeline();
      if (!nextTimeline) {
        return;
      }

      isAnimatingRef.current = true;
      tlRef.current = nextTimeline;

      const onTimelineFinish = () => {
        if (tlRef.current === nextTimeline) {
          tlRef.current = null;
        }
        isAnimatingRef.current = false;
        processQueue();
      };

      nextTimeline.eventCallback('onComplete', onTimelineFinish);
      nextTimeline.eventCallback('onInterrupt', onTimelineFinish);
    };

    const enqueueSwap = direction => {
      if (!direction) return;
      if (queueRef.current.length >= 16) return;
      queueRef.current.push(direction);
      processQueue();
    };

    const step = (direction, options = { restartAuto: true }) => {
      enqueueSwap(direction);
      if (shouldRun()) {
        if (options.restartAuto) {
          startAutoSwap();
        }
      }
    };

    onReadyRef.current({
      next: () => step('next'),
      prev: () => step('prev')
    });

    emitFrontCardChange();
    step('next', { restartAuto: false });
    startAutoSwap();

    const node = container.current;
    if (!node) {
      return () => {
        stopAutoSwap();
        tlRef.current?.kill();
        isAnimatingRef.current = false;
        queueRef.current = [];
      };
    }
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        isInViewRef.current = entry?.isIntersecting ?? true;
        if (!shouldRun()) {
          tlRef.current?.pause();
          stopAutoSwap();
          return;
        }
        tlRef.current?.play();
        startAutoSwap();
        processQueue();
      },
      { threshold: 0.1 }
    );
    observer.observe(node);

    const onVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      if (!shouldRun()) {
        tlRef.current?.pause();
        stopAutoSwap();
        return;
      }
      tlRef.current?.play();
      startAutoSwap();
      processQueue();
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
        tlRef.current?.pause();
        stopAutoSwap();
      };
      const resume = () => {
        isHoveringRef.current = false;
        tlRef.current?.play();
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
        tlRef.current?.kill();
        isAnimatingRef.current = false;
        queueRef.current = [];
      };
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchend', onTouchEnd);
      node.removeEventListener('touchcancel', onTouchCancel);
      stopAutoSwap();
      tlRef.current?.kill();
      isAnimatingRef.current = false;
      queueRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

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
