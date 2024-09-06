import { useMutation, useQuery } from "@tanstack/react-query";
import { fileApiClient } from "./useClient.js";

export const useGetFileList = () => {
  const queryRes = useQuery({
    queryKey: ["listFiles"],
    queryFn: () => fileApiClient.listFiles(),
  });

  return {
    data: queryRes.data,
    isLoading: queryRes.isLoading,
    isSuccess: queryRes.isSuccess,
    isError: queryRes.isError,
    refetch: queryRes.refetch,
  };
};

export const useUploadFile = () => {
  const mutation = useMutation({
    mutationFn: fileApiClient.uploadFile.bind(fileApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useDownloadFile = () => {
  const mutation = useMutation({
    mutationFn: fileApiClient.downloadFile.bind(fileApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

// export const useUpdateFile = () => {
//   const mutation = useMutation({
//     mutationFn: fileApiClient.updateFile.bind(fileApiClient),
//   });

//   return {
//     mutate: mutation.mutate,
//     data: mutation.data,
//     isPending: mutation.isPending,
//     isSuccess: mutation.isSuccess,
//     isError: mutation.isError,
//   };
// };

// export const useDeleteFile = () => {
//   const mutation = useMutation({
//     mutationFn: fileApiClient.deleteFile.bind(fileApiClient),
//   });

//   return {
//     mutate: mutation.mutate,
//     data: mutation.data,
//     isPending: mutation.isPending,
//     isSuccess: mutation.isSuccess,
//     isError: mutation.isError,
//   };
// };
