"use client";

import { useEffect, useState } from "react";
import { driveSubject } from "../observer/DriveSubject";

export const ViewToggle = () => {
  const [mode, setMode] = useState<"grid" | "list">(driveSubject.getViewMode());

  useEffect(() => {
    const update = () => setMode(driveSubject.getViewMode());
    driveSubject.subscribe(update);
    return () => driveSubject.unsubscribe(update);
  }, []);

  return (
    <div className="mb-4 flex gap-2">
      <button
        className={`px-4 py-1 rounded border ${mode === "grid" ? "bg-blue-500 text-white" : "bg-white"}`}
        onClick={() => driveSubject.setViewMode("grid")}
      >
        🗃️ Grilla
      </button>
      <button
        className={`px-4 py-1 rounded border ${mode === "list" ? "bg-blue-500 text-white" : "bg-white"}`}
        onClick={() => driveSubject.setViewMode("list")}
      >
        📄 Lista
      </button>
    </div>
  );
};
