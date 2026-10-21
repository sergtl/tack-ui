"use client";

import { useState } from "react";
import {
  MDXEditor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  ListsToggle,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function MarkdownEditorContent({
  markdown,
  onChange,
  readOnly = false,
}: {
  markdown: string;
  onChange?: (markdown: string) => void;
  readOnly?: boolean;
}) {
  const [overlayContainer, setOverlayContainer] = useState<HTMLDivElement | null>(null);

  return (
    // Keep editor popups inside the dialog's focus trap when used in the modal.
    <div ref={setOverlayContainer}>
      <MDXEditor
        markdown={markdown}
        onChange={(value, initialNormalize) => {
          if (!initialNormalize) {
            onChange?.(value);
          }
        }}
        readOnly={readOnly}
        overlayContainer={overlayContainer}
        placeholder="Describe the issue…"
        contentEditableClassName="issue-markdown"
        plugins={[
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              txt: "Plain text",
              js: "JavaScript",
              ts: "TypeScript",
              json: "JSON",
              css: "CSS",
              html: "HTML",
              sql: "SQL",
              bash: "Shell",
              go: "Go",
              python: "Python",
            },
          }),
          markdownShortcutPlugin(),
          ...(!readOnly
            ? [toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BlockTypeSelect />
                    <BoldItalicUnderlineToggles options={["Bold", "Italic"]} />
                    <CodeToggle />
                    <ListsToggle />
                    <CreateLink />
                    <InsertCodeBlock />
                  </>
                ),
              })]
            : []),
        ]}
      />
    </div>
  );
}
