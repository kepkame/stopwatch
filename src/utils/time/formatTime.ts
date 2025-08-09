export function formatTime(ms: number) {
  const totalHundredths = Math.floor(ms / 10);
  const hundredths = totalHundredths % 100;
  const totalSeconds = Math.floor(totalHundredths / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}.${String(hundredths).padStart(2, '0')}`;
}
