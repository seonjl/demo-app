import { getAccessToken } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, createContext, useEffect } from "react";

export interface WebsocketContextProps {
  websocket: WebSocket | null;
  setWebsocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  messages: WebsocketMessage[];
  setMessages: React.Dispatch<React.SetStateAction<WebsocketMessage[]>>;
}

export const WebsocketContext = createContext<
  WebsocketContextProps | undefined
>({
  websocket: null,
  setWebsocket: () => {},
  messages: [],
  setMessages: () => {},
});

interface WebsocketProviderProps {
  children: ReactNode;
}

interface WebsocketMessage {
  message_type: string;
  isRead: boolean;
}
export const WebsocketProvider = ({ children }: WebsocketProviderProps) => {
  const [websocket, setWebsocket] = React.useState<WebSocket | null>(null);
  const [messages, setMessages] = React.useState<WebsocketMessage[]>([]);
  const accessToken = getAccessToken();
  const queryClient = useQueryClient();

  const onHandleMessage = (message: WebsocketMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...message, isRead: false },
    ]);
    if (message.message_type === "refetch_notification") {
      queryClient.invalidateQueries({
        queryKey: ["listNotifications"],
      });
    }

    if (message.message_type === "refetch_chatroom") {
      queryClient.invalidateQueries({
        queryKey: ["listChatrooms"],
      });
    }
  };

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    setupWebSocket(accessToken).then((ws) => {
      setWebsocket(ws);
      ws.onmessage = (event: any) => {
        console.log(event);
        onHandleMessage(JSON.parse(event.data));
      };
    });
  }, []);

  return (
    <WebsocketContext.Provider
      value={{ websocket, setWebsocket, messages, setMessages }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};

async function setupWebSocket(token: string) {
  const wsUrl =
    "wss://g0db2wt8e1.execute-api.ap-northeast-2.amazonaws.com/production" +
    `?token=${token}`;
  const ows = new WebSocket(wsUrl);

  return await new Promise<WebSocket>((resolve) => {
    ows.onopen = () => {
      console.log("ws opened");
      resolve(ows);
    };
    ows.onmessage = (event: any) => {
      console.log(event);
    };

    ows.onerror = (error) => {
      console.error(error);
    };

    ows.onclose = () => {
      console.log("ws closed");
    };
  });
}
