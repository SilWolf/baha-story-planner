import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function EditablePlugin({
  active = true,
}: {
  active?: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(active);
    if (active) {
      setTimeout(() => editor.focus(), 0);
    }
  }, [active, editor]);

  return null;
}
