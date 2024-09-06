import { useMutation, useQuery } from "@tanstack/react-query";
import { issueApiClient } from "./useClient.js";

export const useGetIssueList = ({ all }: { all?: boolean }) => {
  const queryRes = useQuery({
    queryKey: ["listIssues"],
    queryFn: () =>
      issueApiClient.listIssues({
        all,
      }),
  });

  return {
    data: queryRes.data,
    isLoading: queryRes.isLoading,
    isSuccess: queryRes.isSuccess,
    isError: queryRes.isError,
    refetch: queryRes.refetch,
  };
};

export const useCreateIssue = () => {
  const mutation = useMutation({
    mutationFn: issueApiClient.createIssue.bind(issueApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useUpdateIssue = () => {
  const mutation = useMutation({
    mutationFn: issueApiClient.updateIssue.bind(issueApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useDeleteIssue = () => {
  const mutation = useMutation({
    mutationFn: issueApiClient.deleteIssue.bind(issueApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useSubscribeIssue = () => {
  const mutation = useMutation({
    mutationFn: issueApiClient.subscribeIssue.bind(issueApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useUnsubscribeIssue = () => {
  const mutation = useMutation({
    mutationFn: issueApiClient.unsubscribeIssue.bind(issueApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
