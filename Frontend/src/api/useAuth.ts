import { useQuery } from "@tanstack/react-query";
import { authApiClient } from "./useClient.js";

export const useGetToken = (code: string) => {
  const mutation = useQuery({
    queryKey: ["token"],
    queryFn: () =>
      authApiClient.googleAuthorize({
        googleAuthorizeRequest: {
          code,
        },
      }),
  });

  return {
    data: mutation.data,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
