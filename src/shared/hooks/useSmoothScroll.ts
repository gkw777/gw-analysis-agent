import { useCallback, useRef } from 'react';

interface UseSmoothScrollProps {
  duration?: number;
}

// 채팅 등 스크롤 컨테이너에서 부드럽게(rAF 기반 tween) 특정 위치/엘리먼트로 스크롤하기 위한 범용 훅.
// feature 에 종속된 로직이 없어 shared/hooks 에 둔다.
const useSmoothScroll = (props?: UseSmoothScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { duration } = props ?? { duration: 500 };

  // 위 -> 아래로 스크롤
  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const start = el.scrollTop;
    const end = el.scrollHeight;
    const distance = end - start;

    let startTime: number | null = null;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration!, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.scrollTop = start + distance * ease;
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [duration]);

  // 아래 -> 위 스크롤
  const scrollToTop = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const start = el.scrollTop;
    const end = 0;
    const distance = end - start;

    let startTime: number | null = null;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration!, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.scrollTop = start + distance * ease;
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [duration]);

  // target 의 top 을 스크롤 컨테이너 뷰포트 맨 위에 맞춘다 (scrollTop = target.offsetTop).
  // offsetTop 은 offsetParent 기준이므로, scrollRef 를 붙인 컨테이너에 position: relative 가
  // 반드시 있어야 한다. 없으면 상위 조상 기준으로 측정돼 헤더 높이만큼 더 스크롤된다.
  const scrollToTarget = useCallback(
    (target: HTMLElement | null) => {
      const el = scrollRef.current;
      if (!el || !target) return;

      const start = el.scrollTop;
      const end = Math.max(target.offsetTop, 0);
      const distance = end - start;

      let startTime: number | null = null;
      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration!, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.scrollTop = start + distance * ease;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    },
    [duration],
  );

  return { scrollRef, scrollToBottom, scrollToTop, scrollToTarget } as const;
};

export default useSmoothScroll;
