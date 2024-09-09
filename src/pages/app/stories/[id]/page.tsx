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

const scrollToParagraph = (id: string) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
};

function StoryLineTextareaCard({
  paragraph,
  selected,
  focused,
  onPressArrowUp,
  onPressArrowDown,
  onPressEsc,
  onPressEnter,
}: {
  paragraph: StoryParagraph;
  selected: boolean;
  focused: boolean;
  onPressArrowUp: (e: KeyboardEvent) => void;
  onPressArrowDown: (e: KeyboardEvent) => void;
  onPressEsc: (e: KeyboardEvent) => void;
  onPressEnter: (e: KeyboardEvent) => void;
}) {
  return (
    <div
      id={paragraph.id}
      data-selected={selected}
      data-focused={focused}
      className="px-2 py-1 rounded border-l-4 border-gray-700 bg-gray-100 hover:bg-gray-200 data-[selected=true]:!bg-green-100 data-[focused=true]:!ring-2 data-[focused=true]:!ring-primary"
    >
      <BahaStoryParagraphEditor
        id={paragraph.id}
        active={focused}
        onPressArrowUp={onPressArrowUp}
        onPressArrowDown={onPressArrowDown}
        onPressEsc={onPressEsc}
        onPressEnter={onPressEnter}
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
    const newId = generateId();
    createNewParagraph(currentIndex + 1, {
      id: newId,
      lexicalString: "",
    });
    inc(1, true);
    setFocusOnSelected(true);

    setTimeout(() => {
      scrollToParagraph(newId);
    }, 0);
  }, [createNewParagraph, currentIndex, inc, setFocusOnSelected]);
  useKeyboardEffect("mod+enter", handlePressModEnter);

  const handlePressModUp = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      const newIndex = dec();
      setFocusOnSelected(false);

      setTimeout(() => {
        scrollToParagraph(paragraphs[newIndex]?.id);
      }, 0);
    },
    [dec, paragraphs, setFocusOnSelected]
  );
  useKeyboardEffect("mod+up", handlePressModUp);

  const handlePressModLeft = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      const newIndex = dec(10);
      setFocusOnSelected(false);

      setTimeout(() => {
        scrollToParagraph(paragraphs[newIndex]?.id);
      }, 0);
    },
    [dec, paragraphs, setFocusOnSelected]
  );
  useKeyboardEffect("mod+left", handlePressModLeft);

  const handlePressModDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      const newIndex = inc();
      setFocusOnSelected(false);

      setTimeout(() => {
        scrollToParagraph(paragraphs[newIndex]?.id);
      }, 0);
    },
    [inc, paragraphs, setFocusOnSelected]
  );
  useKeyboardEffect("mod+down", handlePressModDown);

  const handlePressModRight = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      const newIndex = inc(10);
      setFocusOnSelected(false);

      setTimeout(() => {
        scrollToParagraph(paragraphs[newIndex]?.id);
      }, 0);
    },
    [inc, paragraphs, setFocusOnSelected]
  );
  useKeyboardEffect("mod+right", handlePressModRight);

  const handlePressEsc = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      setFocusOnSelected(false);
    },
    [setFocusOnSelected]
  );
  useKeyboardEffect("esc", handlePressEsc);

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
              onPressArrowUp={handlePressModUp}
              onPressArrowDown={handlePressModDown}
              onPressEsc={handlePressEsc}
              onPressEnter={handlePressModEnter}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
