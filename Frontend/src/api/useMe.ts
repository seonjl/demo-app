import { useQuery } from "@tanstack/react-query";
import { meApiClient } from "./useClient";

export const useGetMe = () => {
  const queryRes = useQuery({
    retryOnMount: true,
    queryKey: ["getMe"],
    queryFn: () => meApiClient.getMe(),
  });

  return {
    data: queryRes.data,
    isLoading: queryRes.isLoading,
    isSuccess: queryRes.isSuccess,
    isError: queryRes.isError,
  };
};
