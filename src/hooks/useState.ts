import type { Ref } from "vue";
import { ref } from "vue";

type UseStateReturnType<T> = [
  Ref<T>, // state 状态值
  (value: T) => void, // setState 修改状态值
  () => void, // resetState 重置状态值
] & {
  state: Ref<T>;
  setState: (value: T) => void;
  resetState: () => void;
};

export function useState<T>(defaultValue: T | (() => T), cloneFn?: ((value: T) => T)): UseStateReturnType<T> {
  cloneFn = cloneFn || ((value: T) => JSON.parse(JSON.stringify(value)) as T);

  const getState
      = typeof defaultValue === "function"
        ? (defaultValue as () => T)
        : () => cloneFn(defaultValue);

  const state = ref(getState()) as Ref<T>;
  const setState = (value: T | ((prevValue: T) => T)) => {
    state.value
        = typeof value === "function"
        ? (value as (value: T) => T)(cloneFn(state.value))
        : value;
  };
  const resetState = () => (state.value = getState());

  return Object.assign(
    [state, setState, resetState],
    { state, setState, resetState },
  ) as unknown as UseStateReturnType<T>;
}
