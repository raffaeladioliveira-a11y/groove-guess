import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface YouTubeClipPlayerProps {
  youtubeId: string;
  playing: boolean;
  clipDurationSec: number;
  onEnded?: () => void;
}

export function YouTubeClipPlayer({ youtubeId, playing, clipDurationSec, onEnded }: YouTubeClipPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const post = (command: 'playVideo' | 'pauseVideo' | 'stopVideo') => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*');
  };

  const stopTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    timeoutRef.current = window.setTimeout(() => {
      post('pauseVideo');
      onEnded && onEnded();
    }, Math.max(0, clipDurationSec) * 1000);
  };

  useEffect(() => {
    if (!hasInteracted) return;
    if (playing) {
      post('playVideo');
      startTimer();
    } else {
      post('pauseVideo');
      stopTimer();
    }
    return () => {
      stopTimer();
    };
  }, [playing, hasInteracted]);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const handlePlayClick = () => {
    setHasInteracted(true);
    post('playVideo');
    startTimer();
  };

  const src = `https://www.youtube.com/embed/${youtubeId}?autoplay=0&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-xl aspect-video bg-black/60 rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={src}
          title="YouTube player"
          className="w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {!hasInteracted && (
        <Button onClick={handlePlayClick} variant="musical">
          Tocar clipe
        </Button>
      )}
    </div>
  );
}

