import { useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

type MessagePayload = {
  content: string;
  senderType: "admin" | "user";
  receiverUuid: string;
  isNotification: boolean;
};

type ReceivedMessage = {
  senderType: string;
  receiverUuid: string;
  content: string;
  [key: string]: any;
};

type MessageCallback = (msg: ReceivedMessage) => void;

export const useChatSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [userMessages, setUserMessages] = useState<{
    [uuid: string]: ReceivedMessage[];
  }>({});
  const messageCallbackRef = useRef<MessageCallback | null>(null);

  const connectSocket = (token: string) => {
    if (!socketRef.current) {
      const socket = getSocket(token);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected to socket:", socket.id);
      });

      socket.on("receiveMessage", (msg: ReceivedMessage) => {
        setUserMessages((prev) => {
          const updated = { ...prev };
          const list = updated[msg.receiverUuid] || [];

          const alreadyExists = list.some(
            (m) =>
              m.uuid === msg.uuid ||
              (m.content === msg.content &&
                m.senderType === msg.senderType &&
                m.timestamp === msg.timestamp)
          );

          if (!alreadyExists) {
            updated[msg.receiverUuid] = [...list, msg];
          }

          return updated;
        });

        if (messageCallbackRef.current) {
          messageCallbackRef.current(msg);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected from socket");
      });
    }
  };

  const subscribeToMessages = (cb: MessageCallback) => {
    messageCallbackRef.current = cb;
  };

  const sendMessage = (
    token: string,
    receiverUuid: string,
    content: string
  ) => {
    if (!socketRef.current) {
      connectSocket(token);
    }

    const payload: MessagePayload = {
      content,
      senderType: "admin", // or "user"
      receiverUuid,
      isNotification: false,
    };

    socketRef.current?.emit("sendMessage", payload);
  };

  return { userMessages, sendMessage, connectSocket, subscribeToMessages };
};
