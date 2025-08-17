import type { PlayAlertOptions } from './sound.types';

let defaultSrc: string | null = null;
let baseAudio: HTMLAudioElement | null = null;

export function setAlertSrc(src: string) {
  defaultSrc = src;
  baseAudio = createAudio(src);
}

function createAudio(src: string): HTMLAudioElement {
  const a = new Audio(src);
  a.preload = 'auto';
  // If the file is on a different domain, you can expose it:
  // a.crossOrigin = 'anonymous';
  return a;
}

// Preload: prepare the main element
export function preloadAlert(src?: string) {
  const s = src ?? defaultSrc;
  if (!s || typeof window === 'undefined' || typeof Audio === 'undefined')
    return;
  if (!baseAudio || baseAudio.src !== s) baseAudio = createAudio(s);
  baseAudio.load();
}

export function stopAllAlerts() {
  if (baseAudio && !baseAudio.paused) {
    baseAudio.pause();
    baseAudio.currentTime = 0;
  }
}

export async function playTestAlert(
  opts: PlayAlertOptions = {}
): Promise<void> {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

  const src = opts.src ?? defaultSrc;
  if (!src) {
    // No known source
    return;
  }

  let el: HTMLAudioElement;
  if (opts.allowOverlap) {
    el = (
      baseAudio && baseAudio.src === src
        ? baseAudio.cloneNode(true)
        : createAudio(src)
    ) as HTMLAudioElement;
  } else {
    if (!baseAudio || baseAudio.src !== src) baseAudio = createAudio(src);
    el = baseAudio;
  }

  // Volume and reset position
  const vol =
    typeof opts.volume === 'number' ? Math.min(Math.max(opts.volume, 0), 1) : 1;
  el.volume = vol;

  // If overlap is disabled, restart from the beginning
  if (!opts.allowOverlap) {
    try {
      el.pause();
    } catch {
      // ignore
    }
    el.currentTime = 0;
  }

  // Abort playback
  let aborted = false;
  const onAbort = () => {
    aborted = true;
    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      // ignore
    }
  };
  if (opts.signal) {
    if (opts.signal.aborted) return;
    opts.signal.addEventListener('abort', onAbort, { once: true });
  }

  try {
    await el.play();
  } catch {
    // Ignore NotAllowedError / AbortError – common on mobile without an explicit gesture
  } finally {
    if (opts.signal) opts.signal.removeEventListener('abort', onAbort);

    if (aborted && !el.paused) {
      try {
        el.pause();
      } catch {
        // ignore
      }
    }
  }
}
