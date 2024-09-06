import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationApiClient } from "./useClient";

export const useGetNotificationList = () => {
  const queryRes = useQuery({
    retryOnMount: true,
    queryKey: ["listNotifications"],
    queryFn: () => notificationApiClient.listNotifications(),
  });

  return {
    data: queryRes.data,
    isLoading: queryRes.isLoading,
    isSuccess: queryRes.isSuccess,
    isError: queryRes.isError,
    refetch: queryRes.refetch,
  };
};

export const useReadNotification = () => {
  const mutation = useMutation({
    mutationFn: notificationApiClient.readNotification.bind(
      notificationApiClient
    ),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
