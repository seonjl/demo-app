import { ChannelPage } from "@/components/channel-page";
import { MainLayout } from "@/layouts/top-navigation";
import { useState } from "react";

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

  return (
    <MainLayout>
      <div className="list">
        {isLoading ? <div>Loading...</div> : <ChannelPage />}
      </div>
    </MainLayout>
  );
}

IssuePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
