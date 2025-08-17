import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clampNumber,
  normalizeBounds,
  normalizeStep,
  snapToStep,
  tryParseNumberWithLocale,
} from '../utils/numberUtils';

type useStepperValueParams = {
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;

  min?: number;
  max?: number;
  step?: number;

  disabled?: boolean;
};

export const useStepperValue = ({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step,
  disabled,
}: useStepperValueParams) => {
  // Normalize bounds and step
  const { min: normMin, max: normMax } = useMemo(
    () => normalizeBounds(min, max),
    [min, max]
  );
  const s = useMemo(() => normalizeStep(step), [step]);

  // Controlled mode if `value` is provided
  const isControlled = typeof value === 'number';

  // Initial value selection with clamping
  const initial = useMemo(() => {
    const base = isControlled
      ? (value as number)
      : typeof defaultValue === 'number'
      ? defaultValue
      : typeof normMin === 'number'
      ? normMin
      : 0;
    return clampNumber(base, normMin, normMax);
  }, [isControlled, value, defaultValue, normMin, normMax]);

  // Internal state (only used if uncontrolled)
  const [internal, setInternal] = useState<number>(initial);
  const current = isControlled ? (value as number) : internal;

  // Input editing state
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>(String(current));

  // Synchronize draft with value when not editing
  useEffect(() => {
    if (!focused) setDraft(String(current));
  }, [current, focused]);

  // Parse and commit draft to numeric value
  const commit = useCallback(
    (raw: string): number => {
      const parsed = tryParseNumberWithLocale(raw);
      if (parsed === null) {
        setDraft(String(current));
        return current;
      }
      const next = clampNumber(parsed, normMin, normMax);
      if (!isControlled) setInternal(next);
      if (next !== current) onChange?.(next);
      setDraft(String(next));
      return next;
    },
    [current, isControlled, normMax, normMin, onChange]
  );

  // Get next stepped value from draft or current
  const nextFromDraftOrCurrent = useCallback(
    (dir: 1 | -1) => {
      const parsed = tryParseNumberWithLocale(draft);
      const base = parsed ?? current;
      return snapToStep(base, dir, s, normMin, normMax);
    },
    [draft, current, s, normMin, normMax]
  );

  const inc = useCallback(() => {
    if (disabled) return;
    const next = nextFromDraftOrCurrent(1);
    if (!isControlled) setInternal(next);
    if (next !== current) onChange?.(next);
    setDraft(String(next));
  }, [current, disabled, isControlled, nextFromDraftOrCurrent, onChange]);

  const dec = useCallback(() => {
    if (disabled) return;
    const next = nextFromDraftOrCurrent(-1);
    if (!isControlled) setInternal(next);
    if (next !== current) onChange?.(next);
    setDraft(String(next));
  }, [current, disabled, isControlled, nextFromDraftOrCurrent, onChange]);

  // Keyboard shortcuts: arrows, page up/down, enter
  const onKeyDown = useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (disabled) return;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          inc();
          break;
        case 'ArrowDown':
          e.preventDefault();
          dec();
          break;
        case 'PageUp':
          e.preventDefault();
          // fast step ×10
          for (let i = 0; i < 10; i += 1) inc();
          break;
        case 'PageDown':
          e.preventDefault();
          for (let i = 0; i < 10; i += 1) dec();
          break;
        case 'Enter':
          e.preventDefault();
          commit(draft);
          (e.currentTarget as HTMLInputElement).blur();
          break;
        default:
      }
    },
    [commit, dec, disabled, draft, inc]
  );

  // Disable controls if at min/max or disabled
  const canDec =
    !disabled && !(typeof normMin === 'number' && current <= normMin);
  const canInc =
    !disabled && !(typeof normMax === 'number' && current >= normMax);

  return {
    current,
    draft,
    canDec,
    canInc,

    setDraft,
    setFocused,
    commit,
    inc,
    dec,
    onKeyDown,
  };
};
