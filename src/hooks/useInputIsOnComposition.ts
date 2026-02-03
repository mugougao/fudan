import type { MaybeRefOrGetter } from "vue";
import { useState } from "./useState";

export function useInputIsOnComposition(target: MaybeRefOrGetter<HTMLInputElement | null | undefined>) {
  const [isOnComposition, setIsOnComposition] = useState(false);
  useEventListener(target, "compositionstart", () => {
    setIsOnComposition(true);
  });
  useEventListener(target, "compositionend", () => {
    setIsOnComposition(false);
  });
  return isOnComposition;
}
