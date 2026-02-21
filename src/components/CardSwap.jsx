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

const MAX_QUEUED_STEPS = 6;

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
          durDrop: 0.82,
          durMove: 0.74,
          durReturn: 0.8,
          promoteOverlap: 0.6,
          returnDelay: 0.1,
          durLift: 0.24,
          promoteStagger: 0.09
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.66,
          durMove: 0.62,
          durReturn: 0.66,
          promoteOverlap: 0.46,
          returnDelay: 0.16,
          durLift: 0.2,
          promoteStagger: 0.08
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const queueRef = useRef([]);
  const isAnimatingRef = useRef(false);
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
    let isDisposed = false;
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

    const stopAllTweens = () => {
      tlRef.current?.kill();
      tlRef.current = null;
      queueRef.current = [];
      isAnimatingRef.current = false;
      refs.forEach(r => {
        if (!r.current) return;
        gsap.killTweensOf(r.current);
      });
    };

    const moveCardsToCurrentOrder = ({ timeline, startAt = 0, skipCardIndex = null, stagger = motion.promoteStagger }) => {
      let animatedIndex = 0;
      order.current.forEach((cardIndex, slotIndex) => {
        if (skipCardIndex !== null && cardIndex === skipCardIndex) return;

        const el = refs[cardIndex]?.current;
        if (!el) return;
        const slot = makeSlot(slotIndex, cardDistance, verticalDistance, refs.length);
        const position =
          typeof startAt === 'string' ? `${startAt}+=${animatedIndex * stagger}` : startAt + animatedIndex * stagger;

        timeline.set(el, { zIndex: slot.zIndex }, position);
        timeline.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            skewY: skewAmount,
            duration: motion.durMove,
            ease: motion.ease
          },
          position
        );
        animatedIndex += 1;
      });
    };

    const createTimelineForCurrentOrder = (direction, movedCardIndex) => {
      const timeline = gsap.timeline();

      if (direction === 'next' && typeof movedCardIndex === 'number') {
        const movedEl = refs[movedCardIndex]?.current;
        if (!movedEl) {
          moveCardsToCurrentOrder({ timeline, startAt: 0, stagger: motion.promoteStagger * 0.85 });
          return timeline;
        }

        const dropDistance = Math.max(height * 1.45, 420);
        const movedSlotIndex = order.current.indexOf(movedCardIndex);
        const movedSlot = makeSlot(Math.max(movedSlotIndex, 0), cardDistance, verticalDistance, refs.length);

        timeline.to(
          movedEl,
          {
            y: `+=${dropDistance}`,
            duration: motion.durDrop,
            ease: motion.ease
          },
          0
        );

        timeline.addLabel('promote', `-=${motion.durDrop * motion.promoteOverlap}`);
        moveCardsToCurrentOrder({
          timeline,
          startAt: 'promote',
          skipCardIndex: movedCardIndex,
          stagger: motion.promoteStagger
        });

        timeline.addLabel('return', `promote+=${motion.durMove * motion.returnDelay}`);
        timeline.set(movedEl, { zIndex: movedSlot.zIndex }, 'return');
        timeline.to(
          movedEl,
          {
            x: movedSlot.x,
            y: movedSlot.y,
            z: movedSlot.z,
            skewY: skewAmount,
            duration: motion.durReturn,
            ease: motion.ease
          },
          'return'
        );
        return timeline;
      }

      if (direction === 'prev' && typeof movedCardIndex === 'number') {
        const movedEl = refs[movedCardIndex]?.current;
        if (movedEl) {
          timeline.to(
            movedEl,
            {
              y: '-=120',
              duration: motion.durLift,
              ease: motion.ease
            },
            0
          );
        }
        timeline.addLabel('reflow', `-=${Math.max(0.1, motion.durLift * 0.25)}`);
        moveCardsToCurrentOrder({
          timeline,
          startAt: 'reflow',
          stagger: motion.promoteStagger * 0.8
        });
        return timeline;
      }

      moveCardsToCurrentOrder({ timeline, startAt: 0, stagger: motion.promoteStagger * 0.85 });
      return timeline;
    };

    const rotateOrder = direction => {
      if (order.current.length < 2) return null;

      if (direction === 'prev') {
        const currentOrder = order.current;
        const movedCardIndex = currentOrder[currentOrder.length - 1];
        const rest = currentOrder.slice(0, -1);
        order.current = [movedCardIndex, ...rest];
        return movedCardIndex;
      }

      const [movedCardIndex, ...rest] = order.current;
      order.current = [...rest, movedCardIndex];
      return movedCardIndex;
    };

    const startAutoSwap = () => {
      stopAutoSwap();
      if (!shouldRun()) return;
      intervalRef.current = window.setInterval(() => requestStep('next', { restartAuto: false }), delay);
    };

    const runStep = direction => {
      const movedCardIndex = rotateOrder(direction);
      if (movedCardIndex === null) return false;

      emitFrontCardChange();
      const timeline = createTimelineForCurrentOrder(direction, movedCardIndex);
      tlRef.current = timeline;
      isAnimatingRef.current = true;

      const onTimelineFinish = () => {
        if (isDisposed) return;
        if (tlRef.current === timeline) {
          tlRef.current = null;
        }
        isAnimatingRef.current = false;
        processQueuedSteps();
      };

      timeline.eventCallback('onComplete', onTimelineFinish);
      timeline.eventCallback('onInterrupt', onTimelineFinish);
      return true;
    };

    const processQueuedSteps = () => {
      if (isDisposed || isAnimatingRef.current) return;
      const queuedDirection = queueRef.current.shift();
      if (!queuedDirection) return;
      runStep(queuedDirection);
    };

    const requestStep = (direction, options = { restartAuto: true }) => {
      if (!direction) return;

      if (options.restartAuto && shouldRun()) {
        startAutoSwap();
      }

      if (isAnimatingRef.current) {
        if (queueRef.current.length < MAX_QUEUED_STEPS) {
          queueRef.current.push(direction);
        }
        return;
      }

      runStep(direction);
    };

    onReadyRef.current({
      next: () => requestStep('next'),
      prev: () => requestStep('prev')
    });

    emitFrontCardChange();
    startAutoSwap();

    const node = container.current;
    if (!node) {
      return () => {
        isDisposed = true;
        stopAutoSwap();
        stopAllTweens();
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
        processQueuedSteps();
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
      processQueuedSteps();
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
        requestStep('next');
        return;
      }
      requestStep('prev');
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
        processQueuedSteps();
      };

      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);

      return () => {
        isDisposed = true;
        isHoveringRef.current = false;
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        node.removeEventListener('touchstart', onTouchStart);
        node.removeEventListener('touchend', onTouchEnd);
        node.removeEventListener('touchcancel', onTouchCancel);
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        stopAutoSwap();
        stopAllTweens();
      };
    }

    return () => {
      isDisposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchend', onTouchEnd);
      node.removeEventListener('touchcancel', onTouchCancel);
      stopAutoSwap();
      stopAllTweens();
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
