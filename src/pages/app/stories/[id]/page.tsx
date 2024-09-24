import { useCallback } from "react";
import { Button, Card } from "react-daisyui";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { useList } from "react-use";

import useStory from "@/hooks/useStory";
import { StoryParagraphGroup } from "@/schemas/Story";
import { generateId } from "@/utils/string.util";

import ParagraphGroupDiv from "./components/ParagraphGroupDiv";

export async function StoryByIdPageLoader({
  params,
}: LoaderFunctionArgs<{ storyId: string }>) {
  return { storyId: params.storyId };
}

export default function StoriesByIdPage() {
  const { storyId } = useLoaderData() as { storyId: string };
  const { data: story } = useStory(storyId);

  const [
    paragraphGroups,
    {
      insertAt: createNewParagraphGroup,
      updateAt: updateParagraphGroup,
      push: pushNewParagraphGroup,
    },
  ] = useList<StoryParagraphGroup>(story?.paragraphGroups ?? []);

  const handleClickCreateParagraphGroup = useCallback(() => {
    if (!story) {
      return;
    }

    pushNewParagraphGroup({
      id: generateId(),
      paragraphs: [
        {
          id: generateId(),
          lexicalString: "",
        },
      ],
    });
  }, [pushNewParagraphGroup, story]);

  const handleChangeParagraphGroup = useCallback(
    (newParagraphGroup: StoryParagraphGroup) => {
      if (!story) {
        return;
      }

      const index = story.paragraphGroups.findIndex(
        (item) => item.id === newParagraphGroup.id
      );
      if (index === -1) {
        return;
      }

      updateParagraphGroup(index, newParagraphGroup);
    },
    [story, updateParagraphGroup]
  );

  const handleClickSave = useCallback(() => {}, []);

  return (
    <div className="container max-w-screen-lg mx-auto">
      <div className="relative grid grid-cols-3 gap-4">
        <div className="relative">
          <div className="sticky top-16">
            <Card className="bg-secondary">
              <Card.Body>
                <p>
                  <strong>總段落數：</strong>
                </p>
                <Card.Actions>
                  <Button fullWidth color="primary" onClick={handleClickSave}>
                    存檔
                  </Button>
                  <Button fullWidth color="primary" onClick={handleClickSave}>
                    匯出成檔案
                  </Button>
                </Card.Actions>
              </Card.Body>
            </Card>
          </div>
        </div>
        <div className="col-span-2">
          <div className="space-y-4">
            <div className="space-y-2">
              {paragraphGroups.map((paragraphGroup) => (
                <ParagraphGroupDiv
                  key={paragraphGroup.id}
                  paragraphGroup={paragraphGroup}
                  onChange={handleChangeParagraphGroup}
                />
              ))}
            </div>
            <div>
              <Button onClick={handleClickCreateParagraphGroup}>
                開新群組
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
