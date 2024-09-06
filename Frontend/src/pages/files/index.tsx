import { useGetFileList } from "@/api/useFile";
import { FileCard, FileUploadCard } from "@/components/file-page";
import { MainLayout } from "@/layouts/top-navigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function FilePage() {
  const {
    data: files,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetFileList();

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          )}
        >
          {files?.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
        <FileUploadCard />
      </div>
    </MainLayout>
  );
}

FilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
