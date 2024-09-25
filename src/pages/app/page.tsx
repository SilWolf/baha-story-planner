import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { Button, Table } from "react-daisyui";

import { bDatabaseGetItemsFromCollection } from "@/functions/firebase.functions";
import { useSessionAuth } from "@/providers/SessionAuthProvider";
import { StoryBriefSchemaV1 } from "@/schemas/Story";

const fetchStories = async ({ queryKey, pageParam }: QueryFunctionContext) => {
  return bDatabaseGetItemsFromCollection<StoryBriefSchemaV1>(
    ["users", queryKey[1] as string, "stories"],
    25,
    pageParam as any
  );
};

export default function DashboardPage() {
  const { user } = useSessionAuth();

  const { data } = useInfiniteQuery({
    queryKey: ["users", user?.id as string, "stories"],
    enabled: !!user,
    queryFn: fetchStories,
    initialPageParam: null,
    getNextPageParam: (
      lastPage: Awaited<ReturnType<typeof bDatabaseGetItemsFromCollection>>
    ) => lastPage.pagination.last,
  });

  console.log(data);

  return (
    <div className="container mx-auto text-center">
      <div className="space-y-4">
        <div className="text-right">
          <Button>新增</Button>
        </div>
        <div>
          <Table>
            <Table.Head>
              <span>標題</span>
              <span>最後修改時間</span>
              <span>操作</span>
            </Table.Head>
            <Table.Body></Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
