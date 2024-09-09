import { HashtagNode } from "@lexical/hashtag";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";

import styles from "./index.module.css";
import { MentionNode } from "./nodes/MentionNode";
import MentionPlugin from "./plugins/MentionPlugin";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";

const placeholder = "Enter some rich text...";

const theme = {
  // Theme styling goes here
  //...
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(error: any) {
  console.error(error);
}

export default function BahaStoryParagraphEditor({
  active,
}: {
  active?: boolean;
}) {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    nodes: [HashtagNode, MentionNode],
    onError,
    editable: active,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={styles["editor-container"]}>
        <div className={styles["editor-inner"]}>
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                className={styles["editor-input"]}
                aria-placeholder={placeholder}
                placeholder={
                  <div className={styles["editor-placeholder"]}>
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <HashtagPlugin />
        <MentionPlugin />

        {/* <TreeViewPlugin /> */}
      </div>
    </LexicalComposer>
  );
}
