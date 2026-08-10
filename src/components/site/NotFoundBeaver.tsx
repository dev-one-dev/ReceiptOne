import { useEffect, useRef, useState } from "react";
import beaverVideo from "@/assets/figma/beaver-404-tracking.mp4";
import beaverPoster from "@/assets/figma/beaver-404-poster.png";

/**
 * Source clip is a single continuous 8s take: a smooth head/eye turn from
 * right to left (~0.15s-4.4s), then a blink + wide-eyed "surprised" beat that
 * settles back toward the resting pose (~4.4s-7.85s). Only the first range is
 * spatially meaningful, so cursor tracking scrubs within it; the second range
 * plays once, uninterrupted, as a goodbye flourish when the cursor leaves.
 */
const HEAD_TURN_START = 0.15;
const HEAD_TURN_END = 4.4;
const TAIL_END = 7.85;

export function NotFoundBeaver() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [ready, setReady] = useState(false);
  const playingTailRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pendingXRef = useRef<number | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    setReducedMotion(motionQuery.matches);
    setIsTouch(touchQuery.matches);
    const onMotionChange = () => setReducedMotion(motionQuery.matches);
    const onTouchChange = () => setIsTouch(touchQuery.matches);
    motionQuery.addEventListener("change", onMotionChange);
    touchQuery.addEventListener("change", onTouchChange);
    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      touchQuery.removeEventListener("change", onTouchChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // The SSR-rendered <video> starts loading its metadata as soon as the raw
  // HTML is parsed, well before React hydrates -- so by the time a React
  // onLoadedMetadata prop could attach, the native event has often already
  // fired and won't fire again. Check readyState directly on mount and only
  // fall back to listening if metadata genuinely hasn't arrived yet.
  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const init = () => {
      setReady(true);
      if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
        video.loop = true;
        video.play().catch(() => {});
      } else {
        video.currentTime = HEAD_TURN_START;
      }
    };

    if (video.readyState >= 1) {
      init();
    } else {
      video.addEventListener("loadedmetadata", init, { once: true });
      return () => video.removeEventListener("loadedmetadata", init);
    }
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-[#0d0d14] sm:aspect-[16/10]"
      >
        <img src={beaverPoster} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  const scheduleSeek = (x: number) => {
    pendingXRef.current = x;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const video = videoRef.current;
      if (!video || pendingXRef.current == null) return;
      video.currentTime = HEAD_TURN_START + pendingXRef.current * (HEAD_TURN_END - HEAD_TURN_START);
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouch || !ready || playingTailRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    scheduleSeek(Math.min(1, Math.max(0, x)));
  };

  const handlePointerEnter = () => {
    if (isTouch || !ready) return;
    if (playingTailRef.current) {
      playingTailRef.current = false;
      videoRef.current?.pause();
    }
  };

  const handlePointerLeave = () => {
    if (isTouch || !ready) return;
    const video = videoRef.current;
    if (!video) return;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    playingTailRef.current = true;
    video.currentTime = HEAD_TURN_END;
    video.play().catch(() => {});
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !playingTailRef.current) return;
    if (video.currentTime >= TAIL_END) {
      video.pause();
      video.currentTime = HEAD_TURN_START;
      playingTailRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden
      className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-[#0d0d14] sm:aspect-[16/10]"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        poster={beaverPoster}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={beaverVideo} type="video/mp4" />
      </video>
    </div>
  );
}
