import { useMutation, useQuery } from "@tanstack/react-query";
import { taskApiClient } from "./useClient.js";

export const useGetTaskList = () => {
  const queryRes = useQuery({
    queryKey: ["listTasks"],
    queryFn: () => taskApiClient.listTasks(),
  });

  return {
    data: queryRes.data,
    isLoading: queryRes.isLoading,
    isSuccess: queryRes.isSuccess,
    isError: queryRes.isError,
  };
};

export const useCreateTask = () => {
  const mutation = useMutation({
    mutationFn: taskApiClient.createTask.bind(taskApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useUpdateTask = () => {
  const mutation = useMutation({
    mutationFn: taskApiClient.updateTask.bind(taskApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useDeleteTask = () => {
  const mutation = useMutation({
    mutationFn: taskApiClient.deleteTask.bind(taskApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
