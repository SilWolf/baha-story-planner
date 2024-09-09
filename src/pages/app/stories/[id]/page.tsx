import { MouseEvent, useCallback } from "react";
import { useBoolean, useList } from "react-use";

import BahaStoryParagraphEditor from "@/components/BahaStoryParagraphEditor";
import useEnhancedCounter from "@/hooks/useEnhancedCounter";
import useKeyboardEffect from "@/hooks/useKeyboardEffect";
import { generateId } from "@/utils/string.util";

type StoryParagraph = {
  id: string;
  lexicalString: string;
};

function StoryLineTextareaCard({
  paragraph,
  selected,
  focused,
  onArrowUp,
  onArrowDown,
}: {
  paragraph: StoryParagraph;
  selected: boolean;
  focused: boolean;
  onArrowUp: (e: KeyboardEvent) => void;
  onArrowDown: (e: KeyboardEvent) => void;
}) {
  return (
    <div
      data-selected={selected}
      data-focused={focused}
      className="px-2 py-1 rounded border-l-4 border-gray-700 bg-gray-100 hover:bg-gray-200 data-[selected=true]:!bg-green-100 data-[focused=true]:!ring-2 data-[focused=true]:!ring-primary"
    >
      <BahaStoryParagraphEditor
        id={paragraph.id}
        active={focused}
        onArrowUp={onArrowUp}
        onArrowDown={onArrowDown}
      />
    </div>
  );
}

export default function StoriesByIdPage() {
  const [paragraphs, { insertAt: createNewParagraph }] =
    useList<StoryParagraph>(
      JSON.parse(sessionStorage.getItem("cached-paragraphs") ?? "[]")
    );
  const [currentIndex, { inc, dec, set }] = useEnhancedCounter(
    0,
    paragraphs.length - 1,
    0
  );
  const [isFocusOnSelected, setFocusOnSelected] = useBoolean(false);

  const handleClickParagraph = useCallback(
    (e: MouseEvent) => {
      const newIndex = parseInt(
        e.currentTarget.getAttribute("data-index") as string
      );
      if (isNaN(newIndex)) {
        return;
      }

      set(newIndex);
      setFocusOnSelected(true);
    },
    [set, setFocusOnSelected]
  );

  const handlePressModEnter = useCallback(() => {
    createNewParagraph(currentIndex + 1, {
      id: generateId(),
      lexicalString: "",
    });
    inc(1, true);
    setFocusOnSelected(true);
  }, [createNewParagraph, currentIndex, inc, setFocusOnSelected]);
  useKeyboardEffect("mod+enter", handlePressModEnter);

  const handlePressModUp = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      dec();
      setFocusOnSelected(false);
    },
    [dec, setFocusOnSelected]
  );
  useKeyboardEffect("mod+up", handlePressModUp);

  const handlePressModDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      inc();
      setFocusOnSelected(false);
    },
    [inc, setFocusOnSelected]
  );
  useKeyboardEffect("mod+down", handlePressModDown);

  const handlePressEnter = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      setFocusOnSelected(true);
    },
    [setFocusOnSelected]
  );
  useKeyboardEffect("enter", handlePressEnter);

  return (
    <div className="container mx-auto">
      <p>currentIndex: {currentIndex}</p>
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <div
            key={paragraph.id}
            data-index={index}
            onClick={handleClickParagraph}
          >
            #{index}
            <StoryLineTextareaCard
              paragraph={paragraph}
              selected={currentIndex === index}
              focused={currentIndex === index && isFocusOnSelected}
              onArrowUp={handlePressModUp}
              onArrowDown={handlePressModDown}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
