"use client";

import { ProjectState } from "@/app/types";
import ReactMarkdown from "react-markdown";

export default function DocumentTab({ state = {} }: { state?: ProjectState }) {
  const { planDoc = "", techDoc = "", productDoc = "" } = state;

  return (
    <>
      {productDoc && (
        <>
          <h2 className="text-lg font-semibold mb-4 text-center">
            {"项目产品文档"}
          </h2>
          <div className="rounded-lg p-6 border">
            <div className="space-y-4">
              <ReactMarkdown>{productDoc}</ReactMarkdown>
            </div>
          </div>
        </>
      )}

      {techDoc && (
        <>
          <h2 className="text-lg font-semibold my-4 text-center">
            {"架构设计文档"}
          </h2>
          <div className="rounded-lg p-6 border">
            <div className="space-y-4">
              <ReactMarkdown>{techDoc}</ReactMarkdown>
            </div>
          </div>
        </>
      )}

      {planDoc && (
        <>
          <h2 className="text-lg font-semibold my-4 text-center">
            {"项目开发计划书"}
          </h2>
          <div className="rounded-lg p-6 border">
            <div className="space-y-4">
              <ReactMarkdown>{planDoc}</ReactMarkdown>
            </div>
          </div>
        </>
      )}
    </>
  );
}
