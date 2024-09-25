import { useMutation, useQuery } from "@tanstack/react-query";

import {
  bStorageDownload,
  bStorageUpload,
} from "@/functions/firebase.functions";
import { StorySchemaV1 } from "@/schemas/Story";

const getStoryPath = (id: string) => `/stories/${id}/master.json`;

export default function useStory(id: string) {
  const queryResult = useQuery({
    queryKey: ["stories", id],
    queryFn: () =>
      bStorageDownload(getStoryPath(id))
        .then((blob: Blob) => blob.text())
        .then((text) => JSON.parse(text) as StorySchemaV1),
    enabled: !!id,
  });

  const storyMutation = useMutation({
    mutationFn: async (data: Blob): Promise<boolean> => {
      return bStorageUpload(getStoryPath(id), data).then(() => {
        return true;
      });
    },
  });

  return {
    ...queryResult,
    storyMutation,
    saveStory: storyMutation.mutateAsync,
  };
}
