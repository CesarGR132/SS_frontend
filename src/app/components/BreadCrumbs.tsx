"use client";

import { useEffect, useState } from "react";
import { driveSubject } from "../observer/DriveSubject";
import { DriveNode } from "../types/drive";

export const Breadcrumbs = () => {
  const [path, setPath] = useState<DriveNode[]>(driveSubject.getPath());

  useEffect(() => {
    const update = () => setPath(driveSubject.getPath());
    driveSubject.subscribe(update);
    return () => driveSubject.unsubscribe(update);
  }, []);

  return (
    <div className="flex items-center w-fit h-fit rounded-3xl space-x-2 text-lg text-black mt-2 px-6 py-3 hover:scale-105 hover:bg-[#d29d46] hover:text-white transition-all duration-300">
      {path.map((node, index) => (
        <span key={node.path} className="flex items-center">
          {index > 0 && <span className="mx-1 text-gray-400">/</span>}
          <button
            className="hover:underline"
            onClick={() => driveSubject.openFolderByPath(node.path)}
          >
            {node.name}
          </button>
        </span>
      ))}
    </div>
  );
};
