import { ListIssues200ResponseInner } from "@/api/client";
import { useGetIssueList } from "@/api/useIssue";
import { IssueCard } from "@/components/issue-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserContext } from "@/context/UserContext";
import { MainLayout } from "@/layouts/top-navigation";
import { FilterIcon, PlusIcon } from "lucide-react";
import { useContext, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";

export default function IssuePage() {
  const { data: issues, isSuccess, isLoading, refetch } = useGetIssueList({});
  const [orderedIssues, setOrderedIssues] = useState<
    ListIssues200ResponseInner[]
  >([]);

  const userContext = useContext(UserContext);
  const [isCreateIssueCardOpen, setIsCreateIssueCardOpen] = useState(false);

  // useEffect(() => {
  //   console.log("Use effect");
  //   if (isSuccess && issues) {
  //     setOrderedIssues(issues);
  //   }
  // }, [issues]);
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    const reOrderedIssues = reorder(
      orderedIssues!,
      result.source.index,
      result.destination.index
    );

    setOrderedIssues(reOrderedIssues);

    return;
  };

  const handleCreateIssue = () => {
    setIsCreateIssueCardOpen(true);
  };

  return (
    <MainLayout>
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background px-4 py-3 sm:px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Open</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Closed</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Assigned to me</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Created by me</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-4 ml-auto">
          <Button
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            onClick={handleCreateIssue}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create new issue
          </Button>
        </div>
      </header>
      {isCreateIssueCardOpen && <IssueCard className="bg-card" />}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any, snapshot: any) => (
            <div
              className="list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  {issues?.map((issue, index) => (
                    <Draggable
                      key={issue.id}
                      draggableId={issue.id}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <IssueCard
                            key={issue.id}
                            id={issue.id}
                            title={issue.title}
                            description={issue.description}
                            userEmail={issue.userEmail}
                            subscribers={issue.subscribers}
                            className={snapshot.isDragging ? "bg-amber-50" : ""}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </MainLayout>
  );
}
IssuePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
