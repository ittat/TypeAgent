"use client";
import { BaseMessage } from "@/app/types";
import ReactMarkdown from "react-markdown";
export default function ChatTab({ messages }: { messages: BaseMessage[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">项目讨论</h2>
      <div className="space-y-4">
        {messages.map((item, index) => (
          <div className="flex space-x-3" key={index}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">
                  {item.role[0]}
                </span>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.role}</span>
                <span className="text-sm text-gray-500">
                  {new Date(item.time).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1 text-gray-600 overflow-scroll">
                <ReactMarkdown>{item.message.kwargs.content}</ReactMarkdown>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
