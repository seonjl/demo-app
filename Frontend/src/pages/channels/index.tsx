import { ChannelCard } from "@/components/channel-card";
import { MainLayout } from "@/layouts/top-navigation";
import { useState } from "react";

import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
export default function IssuePage() {
  const {
    data: tasks,
    isSuccess,
    isLoading,
  } = {
    data: null,
    isSuccess: false,
    isLoading: false,
  };
  const [orderedTasks, setOrderedTasks] = useState<any[]>([]);

  // useEffect(() => {
  //   if (isSuccess && tasks) {
  //     setOrderedTasks(tasks!);
  //   }
  // }, [tasks, isSuccess]);

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

    const reOrderedTasks = reorder(
      orderedTasks!,
      result.source.index,
      result.destination.index
    );

    setOrderedTasks(reOrderedTasks);

    return;
  };

  return (
    <MainLayout>
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
                  {orderedTasks?.map((task, index) => (
                    <Draggable
                      key={task.taskId}
                      draggableId={task.taskId}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ChannelCard key={task.taskId} />
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
      <ChannelCard />
    </MainLayout>
  );
}

IssuePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
