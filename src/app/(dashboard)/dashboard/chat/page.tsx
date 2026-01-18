"use client";

import { useContextConsumer } from "@/context/Context";
import {
  useGetUserList,
  useMarkAsReadMessage,
  useUserMessagesHistory,
} from "@/hooks/apis/useChat";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useEffect, useRef, useState } from "react";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";

export default function ChatBox() {
  const { token } = useContextConsumer();
  const [selectedUserUuid, setSelectedUserUuid] = useState<string>("");
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { data: usersList, isLoading: usersLoading } = useGetUserList(token);
  const {
    data: messagesHistory,
    isLoading: historyLoading,
    refetch,
  } = useUserMessagesHistory(selectedUserUuid, token);
  const { mutate: markAllMessageRead } = useMarkAsReadMessage();

  const { userMessages, sendMessage, connectSocket, subscribeToMessages } =
    useChatSocket();

  const handleUserSelect = (uuid: string) => {
    setSelectedUserUuid(uuid);
    const payload = {
      data: { uuid },
      token,
    };
    markAllMessageRead(payload);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !selectedUserUuid) return;

    sendMessage(token, selectedUserUuid, input);
    setInput("");
  };

  useEffect(() => {
    connectSocket(token);
    subscribeToMessages((msg: any) => {
      if (
        msg.senderUuid === selectedUserUuid ||
        msg.receiverUuid === selectedUserUuid
      ) {
        refetch();
      }
    });
  }, [token, selectedUserUuid, connectSocket, refetch, subscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesHistory, userMessages, selectedUserUuid]);

  const mergedMessages = (() => {
    const history = messagesHistory?.data?.messages || [];
    const realtime = userMessages[selectedUserUuid] || [];

    const seen = new Set();
    const uniqueMessages: any[] = [];

    [...history, ...realtime].forEach((msg) => {
      const key =
        msg.uuid || `${msg.content}-${msg.senderType}-${msg.timestamp}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMessages.push(msg);
      }
    });

    return uniqueMessages.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.timestamp).getTime();
      const bTime = new Date(b.createdAt || b.timestamp).getTime();
      return aTime - bTime;
    });
  })();

  return (
    <div className="flex border rounded-lg h-[80vh] w-full max-w-6xl overflow-hidden shadow-sm">
      {/* User List */}
      <div className="w-1/4 border-r p-4 bg-zinc-50 dark:bg-zinc-800 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-primary">Users</h2>
        {usersLoading ? (
          <SkeletonCard className="w-full h-10 mb-2" />
        ) : (
          <ul className="space-y-2">
            {usersList?.data?.map((user: any) => (
              <li
                key={user.uuid}
                onClick={() => handleUserSelect(user.uuid)}
                className={cn(
                  "cursor-pointer px-3 py-2 rounded-md hover:bg-primary/10 flex items-center justify-between",
                  selectedUserUuid === user.uuid &&
                    "bg-primary text-white dark:text-white"
                )}
              >
                <span>{user.username}</span>
                {user.unreadCount > 0 && selectedUserUuid !== user.uuid && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-white dark:bg-zinc-900">
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {historyLoading ? (
            <SkeletonCard className="w-full h-40" />
          ) : (
            mergedMessages.map((msg: any, idx: number) => (
              <div
                key={msg.uuid || `merged-msg-${idx}`}
                className={cn(
                  "max-w-[80%] p-3 rounded-xl text-sm break-words",
                  msg.senderType === "admin" || msg.senderUsername === "Admin"
                    ? "ml-auto bg-red-500 text-white"
                    : "mr-auto bg-gray-200 text-gray-900"
                )}
              >
                {msg.content}
              </div>
            ))
          )}
          <div ref={messageEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 mt-4 border-t pt-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800 dark:text-white"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 flex items-center justify-center"
          >
            <SendHorizonal className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
