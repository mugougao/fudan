import type { Ref } from "vue";
import { ref } from "vue";

type UseBooleanReturnType = [
  Ref<boolean>,
  {
    set: (value: boolean) => void;
    setTrue: () => void;
    setFalse: () => void;
    toggle: () => void;
  },
];

export function useBoolean(defaultValue: boolean = false): UseBooleanReturnType {
  const state = ref<boolean>(defaultValue);
  const set = (value: boolean) => (state.value = value);
  const toggle = () => set(!state.value);
  const setTrue = () => set(true);
  const setFalse = () => set(false);
  return [
    state,
    {
      toggle,
      set,
      setTrue,
      setFalse,
    },
  ];
}
