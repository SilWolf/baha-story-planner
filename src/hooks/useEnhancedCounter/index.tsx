import { useMemo } from "react";
import { useGetSet } from "react-use";
import {
  IHookStateInitAction,
  IHookStateSetAction,
  resolveHookState,
} from "react-use/lib/misc/hookState";

export interface CounterActions {
  inc: (delta?: number) => void;
  dec: (delta?: number) => void;
  get: () => number;
  set: (value: IHookStateSetAction<number>) => void;
  reset: (value?: IHookStateSetAction<number>) => void;
}

export default function useEnhancedCounter(
  initialValue: IHookStateInitAction<number> = 0,
  max: number | null = null,
  min: number | null = null
): [number, CounterActions] {
  let init = resolveHookState(initialValue);

  if (typeof init !== "number") {
    console.error(
      "initialValue has to be a number, got " + typeof initialValue
    );
  }

  if (typeof min === "number") {
    init = Math.max(init, min);
  } else if (min !== null) {
    console.error("min has to be a number, got " + typeof min);
  }

  if (typeof max === "number") {
    init = Math.min(init, max);
  } else if (max !== null) {
    console.error("max has to be a number, got " + typeof max);
  }

  const [get, setInternal] = useGetSet(init);

  return [
    get(),
    useMemo(() => {
      const set = (newState: IHookStateSetAction<number>, force?: boolean) => {
        const prevState = get();
        let rState = resolveHookState(newState, prevState);

        if (prevState !== rState) {
          if (!force) {
            if (typeof min === "number") {
              rState = Math.max(rState, min);
            }
            if (typeof max === "number") {
              rState = Math.min(rState, max);
            }
          }

          if (prevState !== rState) {
            setInternal(rState);
          }
        }
      };

      return {
        get,
        set,
        inc: (delta: IHookStateSetAction<number> = 1, force?: boolean) => {
          const rDelta = resolveHookState(delta, get());

          if (typeof rDelta !== "number") {
            console.error(
              "delta has to be a number or function returning a number, got " +
                typeof rDelta
            );
          }

          set((num: number) => num + rDelta, force);
        },
        dec: (delta: IHookStateSetAction<number> = 1, force?: boolean) => {
          const rDelta = resolveHookState(delta, get());

          if (typeof rDelta !== "number") {
            console.error(
              "delta has to be a number or function returning a number, got " +
                typeof rDelta
            );
          }

          set((num: number) => num - rDelta, force);
        },
        reset: (value: IHookStateSetAction<number> = init, force?: boolean) => {
          const rValue = resolveHookState(value, get());

          if (typeof rValue !== "number") {
            console.error(
              "value has to be a number or function returning a number, got " +
                typeof rValue
            );
          }

          // eslint-disable-next-line react-hooks/exhaustive-deps
          init = rValue;
          set(rValue, force);
        },
      };
    }, [init, min, max]),
  ];
}
