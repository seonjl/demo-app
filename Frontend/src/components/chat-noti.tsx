/**
 * v0 by Vercel.
 * @see https://v0.dev/t/mzZ7z0xhZAq
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  ListChatrooms200ResponseInner,
  ListChats200ResponseInner,
} from "@/api/client";
import { useListChatRooms } from "@/api/useChat";
import { chatApiClient } from "@/api/useClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserContext } from "@/context/UserContext";
import { WebsocketContext } from "@/context/WebsocketContext";
import { SendIcon } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

export default function ChatNotifi() {
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

  const websocketContext = useContext(WebsocketContext);
  const websocket = websocketContext?.websocket;

  const handleChatroomClick = (chatroom: ListChatrooms200ResponseInner) => {
    setSelectedChatroom(chatroom);
    setIsMessageListOpen(true);
  };
  const handleBackButton = () => {
    setIsMessageListOpen(false);
  };
  const handleSubmitButton = () => {
    websocket?.send(
      JSON.stringify({
        message_type: "$sendchat",
        room_id: selectedChatroom?.roomId,
        message: inputMessage,
        // members: [email, "test@email.io"],
      })
    );
  };
  const handleInputMessageChange = (e: React.SetStateAction<string>) => {
    setInputMessage(e);
  };

  const loadChats = useCallback(
    ({ roomId, createdAt }: { roomId: string; createdAt?: string }) => {
      return chatApiClient.listChats({
        roomId: roomId,
        createdAt: createdAt,
      });
    },
    [chats]
  );

  useEffect(() => {
    if (selectedChatroom) {
      setIsChatLoading(true);
      setChats([]);
      setIsMoreChat(false);
      loadChats({ roomId: selectedChatroom.roomId }).then((newChats) => {
        setIsChatLoading(false);
        setChats(newChats);
      });
      selectedChatroom.badgeCount = 0; // local badge count reset
    }
  }, [selectedChatroom]);

  useEffect(() => {
    if (selectedChatroom && isMoreChat) {
      if (chats.length < 5) return;

      setIsMoreChatLoading(true);
      const lastChat = chats[chats.length - 1];

      loadChats({
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

  const { data: chatrooms } = useListChatRooms();
  const calculateUnreadMessages = () => {
    return (
      chatrooms?.reduce((acc, chatroom) => {
        return acc + chatroom.badgeCount;
      }, 0) || 0
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <MessageSquareIcon className="h-5 w-5" />
          {/* if > 0, bg-pink-600 else bg-primary */}
          {/* <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-xs font-medium text-primary-foreground">
            {calculateUnreadMessages()}
          </span> */}
          <span
            className={
              calculateUnreadMessages() > 0
                ? "absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-xs font-medium text-primary-foreground"
                : "absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
            }
          >
            {calculateUnreadMessages()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        {isMessageListOpen ? (
          // chat messages
          <Card className="shadow-none border-0">
            <CardHeader className="border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleBackButton}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                <CardTitle className="overflow-x-auto">
                  {selectedChatroom?.roomName}
                </CardTitle>
              </div>
              <CardDescription>
                Chat with {selectedChatroom?.roomName}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col max-h-[600px]">
              {isChatLoading ? (
                <div className="flex items-center justify-center min-h-[150px]">
                  <div className="relative inline-block w-16 h-16 animate-spin">
                    <div className="absolute inset-0 rounded-full bg-primary opacity-25" />
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 overflow-y-auto flex-col-reverse gap-4">
                  {chats?.map((chat, index) =>
                    chat.userEmail === email ? (
                      <div
                        className="flex flex-col gap-1 self-end max-w-[65%]"
                        key={index}
                        ref={
                          index === chats.length - 1 ? lastChatElementRef : null
                        }
                      >
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
                          {chat.message}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {chat.userEmail} - {chat.createdAt}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col gap-1 max-w-[65%]"
                        key={index}
                      >
                        <div className="bg-muted rounded-lg px-4 py-2">
                          {chat.message}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {chat.userEmail} - {chat.createdAt}
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
              <div className="border-t pt-4">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    id="message"
                    placeholder="Type your message..."
                    className="flex-1"
                    autoComplete="off"
                    onChange={(e) => handleInputMessageChange(e.target.value)}
                    value={inputMessage}
                  />
                  <Button size="icon" onClick={handleSubmitButton}>
                    <span className="sr-only">Send</span>
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Chatroom list
          <Card className="shadow-none border-0">
            <CardHeader className="border-b">
              <CardTitle>Direct Messages</CardTitle>
              <CardDescription>Click to open chat room.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {chatrooms?.map((chatroom) => (
                <div
                  key={chatroom.roomId}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 cursor-pointer"
                  onClick={() => handleChatroomClick(chatroom)}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={
                        "https://avatar.iran.liara.run/public/boy?username=" +
                        chatroom.roomId
                      }
                    />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">{chatroom.roomName}</p>
                    <p className="text-sm text-muted-foreground">
                      {chatroom.lastMessage.slice(0, 20)}...
                    </p>
                  </div>
                  {chatroom.badgeCount > 0 && (
                    <span className="absolute inset-x-2 end-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-400 text-xs font-medium text-primary-foreground">
                      {chatroom.badgeCount}
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </PopoverContent>
    </Popover>
  );
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
