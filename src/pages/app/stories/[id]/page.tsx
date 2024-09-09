import { useCallback } from "react";
import { useList } from "react-use";

import BahaStoryParagraphEditor from "@/components/BahaStoryParagraphEditor";
import useEnhancedCounter from "@/hooks/useEnhancedCounter";
import useKeyboardEffect from "@/hooks/useKeyboardEffect";

type StoryParagraph = {
  lexicalString: string;
};

function StoryLineTextareaCard({
  paragraph,
  active,
}: {
  paragraph: StoryParagraph;
  active: boolean;
}) {
  return (
    <div
      data-active={active}
      className="px-2 py-1 rounded border-l-4 border-gray-700 bg-gray-100 hover:bg-gray-200 data-[active=true]:!bg-green-100"
    >
      <BahaStoryParagraphEditor active={active} />
    </div>
  );
}

export default function StoriesByIdPage() {
  const [paragraphs, { insertAt: createNewParagraph }] =
    useList<StoryParagraph>(
      JSON.parse(sessionStorage.getItem("cached-paragraphs") ?? "[]")
    );
  const [currentIndex, { inc }] = useEnhancedCounter(
    0,
    paragraphs.length - 1,
    0
  );

  const handlePressModEnter = useCallback(() => {
    createNewParagraph(currentIndex, { lexicalString: "" });
    inc(1, true);
  }, [createNewParagraph, currentIndex, inc]);
  useKeyboardEffect("mod+enter", handlePressModEnter);

  return (
    <div className="container mx-auto">
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <StoryLineTextareaCard
            paragraph={paragraph}
            active={currentIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
