import Mousetrap, { ExtendedKeyboardEvent } from "mousetrap";
import { useEffect } from "react";

export default function useKeyboardEffect(
  keyCombo: string | string[],
  fn: (e: ExtendedKeyboardEvent, combo: string) => boolean | void
) {
  return useEffect(() => {
    Mousetrap.bind(keyCombo, fn);

    return () => {
      Mousetrap.unbind(keyCombo);
    };
  }, [keyCombo, fn]);
}
