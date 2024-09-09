import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  $isElementNode,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_MODIFIER_COMMAND,
  Point,
} from "lexical";
import { useEffect } from "react";

function isAtNodeStart(point: Point): boolean {
  return point.offset === 0;
}

function isAtNodeEnd(point: Point): boolean {
  if (point.type === "text") {
    return point.offset === point.getNode().getTextContentSize();
  }
  const node = point.getNode();
  if ($isElementNode(node)) {
    return point.offset === node.getChildrenSize();
  }

  return false;
}

export default function KeyboardControlPlugin({
  onPressEsc,
  onPressArrowUp,
  onPressArrowDown,
  onPressEnter,
}: {
  onPressEsc?: (e: KeyboardEvent) => void;
  onPressArrowUp?: (e: KeyboardEvent) => void;
  onPressArrowDown?: (e: KeyboardEvent) => void;
  onPressEnter?: (e: KeyboardEvent) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onPressEsc) {
      return;
    }

    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      (payload) => {
        onPressEsc?.(payload);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onPressEsc]);

  useEffect(() => {
    if (!onPressArrowUp) {
      return;
    }

    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (event: KeyboardEvent) => {
        if (!event.metaKey) {
          return false;
        }

        if (event.key !== "ArrowUp") {
          return false;
        }

        const root = $getRoot();
        const selection = $getSelection()?.getStartEndPoints();

        if (!selection) {
          return false;
        }

        if (
          selection[0].key !== selection[1].key ||
          selection[0].offset !== selection[1].offset
        ) {
          return false;
        }

        const point = selection[0];

        const descendant = root.getFirstDescendant();
        if (!descendant) {
          return false;
        }

        if (
          [descendant.getKey(), ...descendant.getParentKeys()].indexOf(
            selection[0].key
          ) === -1
        ) {
          return false;
        }

        if (!isAtNodeStart(point)) {
          return false;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        editor.blur();
        onPressArrowUp?.(event);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onPressArrowUp]);

  useEffect(() => {
    if (!onPressArrowDown) {
      return;
    }

    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (event: KeyboardEvent) => {
        if (!event.metaKey) {
          return false;
        }

        if (event.key !== "ArrowDown") {
          return false;
        }

        const root = $getRoot();
        const selection = $getSelection()?.getStartEndPoints();

        if (!selection) {
          return false;
        }

        if (
          selection[0].key !== selection[1].key ||
          selection[0].offset !== selection[1].offset
        ) {
          return false;
        }

        const point = selection[0];

        const descendant = root.getLastDescendant();
        if (!descendant) {
          return false;
        }

        if (
          [descendant.getKey(), ...descendant.getParentKeys()].indexOf(
            selection[0].key
          ) === -1
        ) {
          return false;
        }

        if (!isAtNodeEnd(point)) {
          return false;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        editor.blur();
        onPressArrowDown?.(event);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onPressArrowDown]);

  useEffect(() => {
    if (!onPressEnter) {
      return;
    }

    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        if (!event.metaKey) {
          return false;
        }

        const root = $getRoot();
        const selection = $getSelection()?.getStartEndPoints();

        if (!selection) {
          return false;
        }

        if (
          selection[0].key !== selection[1].key ||
          selection[0].offset !== selection[1].offset
        ) {
          return false;
        }

        const point = selection[0];

        const descendant = root.getLastDescendant();
        if (!descendant) {
          return false;
        }

        if (
          [descendant.getKey(), ...descendant.getParentKeys()].indexOf(
            selection[0].key
          ) === -1
        ) {
          return false;
        }

        if (!isAtNodeEnd(point)) {
          return false;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        editor.blur();
        onPressEnter?.(event);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onPressEnter]);

  return null;
}
