import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { chatApiClient } from "./useClient.js";

export const useListChats = ({ roomId }: { roomId: string }) => {
  const queryRes = useQuery({
    queryKey: ["listChats", roomId],
    queryFn: () =>
      chatApiClient.listChats({
        roomId: roomId,
      }),
    enabled: false,
  });

  return {
    data: queryRes.data,
    isLoading: queryRes.isLoading,
    isSuccess: queryRes.isSuccess,
    isError: queryRes.isError,
    refetch: queryRes.refetch,
  };
};

export const test = (chatrooms: any) => {
  const { data: chatsOfChatrooms, pending } = useQueries({
    queries: (chatrooms || []).map((chatroom) => ({
      queryKey: ["listChats", chatroom.roomId],
      queryFn: () =>
        chatApiClient.listChats({
          roomId: chatroom.roomId,
        }),
    }))!,
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isLoading),
      };
    },
  });
};

export const useListChatRooms = () => {
  const queryRes = useQuery({
    queryKey: ["listChatrooms"],
    queryFn: () => chatApiClient.listChatrooms(),
  });

  return {
    data: queryRes.data?.sort((a, b) => {
      return a.lastChattedAt < b.lastChattedAt ? 1 : -1;
    }),
    isLoading: queryRes.isLoading,
    isSuccess: queryRes.isSuccess,
    isError: queryRes.isError,
  };
};

export const useCreateChat = () => {
  const mutation = useMutation({
    mutationFn: chatApiClient.createChat.bind(chatApiClient),
  });

  return {
    mutate: mutation.mutate,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};
