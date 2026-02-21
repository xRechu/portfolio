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
  const isInViewRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const container = useRef(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const total = refs.length;
    isPageVisibleRef.current = !document.hidden;
    order.current = Array.from({ length: total }, (_, i) => i);
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const shouldRun = () => isPageVisibleRef.current && isInViewRef.current && (!pauseOnHover || !isHoveringRef.current);

    const stopAutoSwap = () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    };

    const startAutoSwap = () => {
      stopAutoSwap();
      if (!shouldRun()) return;
      intervalRef.current = window.setInterval(() => swap('next'), delay);
    };

    const animateNext = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

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
      });
    };

    const animatePrev = () => {
      if (order.current.length < 2) return;

      const currentOrder = order.current;
      const back = currentOrder[currentOrder.length - 1];
      const rest = currentOrder.slice(0, -1);
      const nextOrder = [back, ...rest];

      const elBack = refs[back].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

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
      });
    };

    const swap = direction => {
      tlRef.current?.kill();
      if (direction === 'prev') {
        animatePrev();
        return;
      }
      animateNext();
    };

    const step = direction => {
      swap(direction);
      if (shouldRun()) {
        startAutoSwap();
      }
    };

    onReadyRef.current({
      next: () => step('next'),
      prev: () => step('prev')
    });

    swap('next');
    startAutoSwap();

    const node = container.current;
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
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (pauseOnHover && node) {
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
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        stopAutoSwap();
        tlRef.current?.kill();
      };
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      stopAutoSwap();
      tlRef.current?.kill();
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
