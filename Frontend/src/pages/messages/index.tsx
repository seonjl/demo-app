import {
  ListChatrooms200ResponseInner,
  ListChats200ResponseInner,
} from "@/api/client";
import { useCreateChat, useListChatRooms } from "@/api/useChat";
import { chatApiClient } from "@/api/useClient";
import { XIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserContext } from "@/context/UserContext";
import { MainLayout } from "@/layouts/top-navigation";
import { isoStringToNdaysAgoOrHoursAgoOrMinutesAgo } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function chatPage() {
  const queryClient = useQueryClient();
  const [selectedChatroom, setSelectedChatroom] =
    useState<ListChatrooms200ResponseInner | null>(null);
  const [isMessageListOpen, setIsMessageListOpen] = useState(false);
  const [chats, setChats] = useState<ListChats200ResponseInner[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isMoreChat, setIsMoreChat] = useState(false);
  const [isMoreChatLoading, setIsMoreChatLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const userContext = useContext(UserContext);
  const email = userContext?.user?.email;

  const { mutate: createChat } = useCreateChat();

  const { data: chatrooms } = useListChatRooms();

  useQuery({
    queryKey: ["listChats", selectedChatroom?.roomId],
    queryFn: async () => {
      const res = await chatApiClient.listChats({
        roomId: selectedChatroom?.roomId!,
        limit: "10",
      });
      setChats(res);
      return res;
    },
  });

  const loadMoreChats = useCallback(
    ({ roomId, createdAt }: { roomId: string; createdAt?: string }) => {
      return chatApiClient.listChats({
        roomId: roomId,
        createdAt: createdAt,
      });
    },
    [chats]
  );

  const handleChatroomClick = (chatroom: ListChatrooms200ResponseInner) => {
    setSelectedChatroom(chatroom);
    chatroom.badgeCount = 0; // local badge count reset
    setIsMessageListOpen(true);
    setIsMoreChat(false);
  };
  const handleXButton = () => {
    setIsMessageListOpen(false);
  };
  const handleSubmitButton = () => {
    createChat(
      {
        roomId: selectedChatroom?.roomId!,
        createChatRequest: {
          message: inputMessage,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["listChats", selectedChatroom?.roomId],
          });
          queryClient.invalidateQueries({
            queryKey: ["listChatrooms"],
          });
          setInputMessage("");
        },
      }
    );
  };
  const handleInputMessageChange = (e: React.SetStateAction<string>) => {
    setInputMessage(e);
  };

  // useEffect(() => {
  //   if (selectedChatroom) {
  //     setIsChatLoading(true);
  //     setIsMoreChat(false);
  //     // loadChats?.();
  //     selectedChatroom.badgeCount = 0; // local badge count reset
  //   }
  // }, [selectedChatroom]);

  useEffect(() => {
    if (selectedChatroom && isMoreChat) {
      if (chats.length < 10) return;

      setIsMoreChatLoading(true);
      const lastChat = chats[chats.length - 1];

      loadMoreChats({
        roomId: selectedChatroom.roomId,
        createdAt: lastChat.createdAt,
      }).then((newChats) => {
        setIsMoreChatLoading(false);
        setChats((prevChats) => [...prevChats, ...newChats]);
      });
    }
  }, [isMoreChat]);

  const lastChatElementRef = useCallback((node: any) => {
    if (isChatLoading) return; // Stop observing if loading or no more posts
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("intersecting");
          setIsMoreChat(true);
        }
      },
      {
        threshold: 0.9,
      }
    );

    if (node) observer.current.observe(node);
  }, []);

  const calculateUnreadMessages = () => {
    return (
      chatrooms?.reduce((acc, chatroom) => {
        return acc + chatroom.badgeCount;
      }, 0) || 0
    );
  };

  return (
    <MainLayout>
      <div className="grid min-h-screen max-h-screen w-full grid-cols-[280px_1fr]">
        <div className="flex flex-col border-r bg-muted/40">
          <div className="flex h-[60px] items-center justify-between border-b p-6">
            <div className="font-medium">Direct messages</div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <div className="flex-row gap-2 px-4">
              {chatrooms?.map((chatroom) => (
                <div
                  key={chatroom.roomId}
                  className="flex flex-1 w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  onClick={() => handleChatroomClick(chatroom)}
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={
                        "https://avatar.iran.liara.run/public/boy?username=" +
                        chatroom.roomName
                      }
                    />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <div className="flex font-medium">
                        {chatroom.roomName?.slice(0, 5)}
                        {chatroom.badgeCount > 0 && (
                          <span className="flex ml-1 h-4 w-4 items-center justify-center rounded-full bg-pink-400 text-xs font-medium text-primary-foreground mt-1">
                            {chatroom.badgeCount}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isoStringToNdaysAgoOrHoursAgoOrMinutesAgo(
                          chatroom.lastChattedAt
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate">
                        {chatroom.lastMessage}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {isMessageListOpen && (
          <div className="flex flex-col">
            <div className="flex h-[60px] items-center border-b bg-muted/40 px-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={
                      "https://avatar.iran.liara.run/public/boy?username=" +
                      selectedChatroom?.roomId
                    }
                  />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="font-medium">
                    {selectedChatroom?.roomName}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {isoStringToNdaysAgoOrHoursAgoOrMinutesAgo(
                        selectedChatroom?.lastChattedAt
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                <XIcon className="h-4 w-4" onClick={handleXButton} />
                <span className="sr-only">Open options</span>
              </Button>
            </div>
            <div className="flex max-h-[720px] p-4 ">
              {isChatLoading ? (
                <div className="flex flex-1 min-h-[660px] items-center justify-center">
                  <div className="justify-center items-center relative w-16 h-16 animate-spin">
                    <div className="absolute inset-0 rounded-full bg-primary opacity-25" />
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 overflow-y-auto flex-col-reverse gap-4">
                  {chats?.map((chat, index) =>
                    chat.userEmail === email ? (
                      <div
                        className="flex items-start gap-4 justify-end self-end"
                        key={index}
                        ref={
                          index === chats.length - 1 ? lastChatElementRef : null
                        }
                      >
                        <div className="grid gap-1 rounded-lg bg-muted p-3 text-sm bg-slate-300">
                          <div className="font-medium">You</div>
                          <div> {chat.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {isoStringToNdaysAgoOrHoursAgoOrMinutesAgo(
                              chat.createdAt
                            )}
                          </div>
                        </div>
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage
                            src={
                              "https://avatar.iran.liara.run/public/boy?username=" +
                              chat.userEmail
                            }
                          />
                          <AvatarFallback>AC</AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4" key={index}>
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage
                            src={
                              "https://avatar.iran.liara.run/public/boy?username=" +
                              chat.userEmail
                            }
                          />
                          <AvatarFallback>AC</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1 rounded-lg bg-muted p-3 text-sm">
                          <div className="font-medium">{chat.userEmail}</div>
                          <div> {chat.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {isoStringToNdaysAgoOrHoursAgoOrMinutesAgo(
                              chat.createdAt
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  {isMoreChatLoading && (
                    <div className="flex items-center justify-center h-full my-3">
                      <span className="relative flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-gray-200"></span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-1 absolute bottom-0 min-w-[60%] items-center gap-2 border-t bg-muted/40 p-4">
              <Textarea
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-lg border-0 bg-transparent px-4 py-2 text-sm focus:ring-0"
                onChange={(e) => handleInputMessageChange(e.target.value)}
                value={inputMessage}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full"
                onClick={handleSubmitButton}
              >
                <SendIcon className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function MoveHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
