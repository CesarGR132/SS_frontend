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
    <div className="flex items-center space-x-2 text-lg text-white mt-2 mb-2">
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
