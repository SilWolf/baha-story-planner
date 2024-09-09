import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  KEY_ESCAPE_COMMAND,
  KEY_MODIFIER_COMMAND,
} from "lexical";
import { useEffect } from "react";

export default function KeyboardControlPlugin({
  onArrowUp,
  onArrowDown,
}: {
  onArrowUp?: (e: KeyboardEvent) => void;
  onArrowDown?: (e: KeyboardEvent) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        editor.blur();
        return true;
      },
      0
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        // console.log(event);
        if (
          event.metaKey &&
          (event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Enter")
        ) {
          // if (event.key === 'ArrowUp' && editor.getEditorState())
          const root = $getRoot();
          const selection = $getSelection()?.getStartEndPoints();

          if (!selection) {
            return true;
          }

          if (
            selection[0].key !== selection[1].key ||
            selection[0].offset !== selection[1].offset
          ) {
            return true;
          }

          if (event.key === "ArrowUp") {
            const descendant = root.getFirstDescendant();
            if (!descendant) {
              return true;
            }

            if (
              selection[0].key === descendant.getKey() &&
              selection[0].offset === 0
            ) {
              onArrowUp?.(payload);
              return true;
            }
          } else if (event.key === "ArrowDown" || event.key === "Enter") {
            console.log("1");
            const descendant = root.getLastDescendant();
            if (!descendant) {
              return true;
            }

            console.log("2");
            console.log(selection);
            console.log(descendant.getKey());
            console.log(descendant.getTextContentSize());
            if (
              selection[0].key === descendant.getKey() &&
              selection[0].offset >= descendant.getTextContentSize()
            ) {
              console.log("3");
              onArrowDown?.(payload);
              return true;
            }
          }
        }

        return true;
      },
      0
    );
  }, [editor, onArrowDown, onArrowUp]);

  return null;
}
