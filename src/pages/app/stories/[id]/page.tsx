import { MouseEvent, useCallback } from "react";
import { Button, Card } from "react-daisyui";
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
      className="px-2 py-1 rounded border-l-4 border-transparent bg-gray-100 hover:bg-gray-200 data-[selected=true]:!bg-base-200 data-[focused=true]:!border-primary"
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

  const handlePressRightOrModUp = useCallback(
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
  useKeyboardEffect(["up", "mod+up"], handlePressRightOrModUp);

  const handlePressRightOrModLeft = useCallback(
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
  useKeyboardEffect(["left", "mod+left"], handlePressRightOrModLeft);

  const handlePressRightOrModDown = useCallback(
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
  useKeyboardEffect(["down", "mod+down"], handlePressRightOrModDown);

  const handlePressRightOrModRight = useCallback(
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
  useKeyboardEffect(["right", "mod+right"], handlePressRightOrModRight);

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
    <div className="container max-w-screen-lg mx-auto">
      <div className="relative grid grid-cols-3 gap-4">
        <div className="relative">
          <div className="sticky top-16">
            <Card className="bg-secondary">
              <Card.Body>
                <p>
                  <strong>總段落數：</strong>
                  {paragraphs.length}
                </p>
                <Card.Actions>
                  <Button fullWidth color="primary">
                    存檔
                  </Button>
                </Card.Actions>
              </Card.Body>
            </Card>
          </div>
        </div>
        <div className="col-span-2">
          <div className="space-y-2">
            {paragraphs.map((paragraph, index) => (
              <div
                key={paragraph.id}
                data-index={index}
                onClick={handleClickParagraph}
                className="flex gap-x-2 animate-fade"
              >
                <span className="flex-shrink-0 mt-1 min-w-[40px]">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <StoryLineTextareaCard
                    paragraph={paragraph}
                    selected={currentIndex === index}
                    focused={currentIndex === index && isFocusOnSelected}
                    onPressArrowUp={handlePressRightOrModUp}
                    onPressArrowDown={handlePressRightOrModDown}
                    onPressEsc={handlePressEsc}
                    onPressEnter={handlePressModEnter}
                  />
                </div>
              </div>
            ))}
          </div>
          {paragraphs.length === 0 && (
            <div className="bg-neutral text-base-100 p-12 text-center">
              按 Ctrl + Enter 來新增第一段段落。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
