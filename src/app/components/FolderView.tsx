"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DriveNode } from "../types/drive";
import { driveSubject } from "../observer/DriveSubject";
import { removeFile, removeFolder } from "../services/storageApi";
import { refreshTree } from "../utils/refreshTree";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';


type Props = {
  setIsLoading: (loading: boolean) => void;
};

export const FolderView = ({ setIsLoading }: Props) => {
  const [folder, setFolder] = useState<DriveNode | null>(driveSubject.getCurrentNode());
  const [viewMode, setViewMode] = useState<"grid" | "list">(driveSubject.getViewMode());

  useEffect(() => {
    const update = () => {
      setFolder(driveSubject.getCurrentNode());
      setViewMode(driveSubject.getViewMode());
    };
    driveSubject.subscribe(update);
    return () => driveSubject.unsubscribe(update);
  }, []);

  const parentRef = useRef<HTMLDivElement | null>(null);
  const items = folder?.children ?? [];

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (viewMode === "grid" ? 160 : 70),
  });

  const currentPath = folder?.path ?? "";

  const handleDelete = async (item: DriveNode) => {
    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar "${item.name}"?`);
    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      if (item.isDirectory) {
        await removeFolder(item.name, currentPath);
      } else {
        await removeFile(item.name, currentPath);
      }  

      await refreshTree();
    } catch (err) {
      alert("Something went wrong when deleting the file");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={parentRef} className="overflow-auto h-[70vh] border rounded">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={item.path}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translateY(${virtualRow.start}px)`,
                width: "100%",
              }}
              className={`px-4 py-2 ${
                viewMode === "grid" ? "md:w-1/3 inline-block" : "flex items-center"
              }`}
            >
              <div className="p-6 pl-3 text-5xl font-bold rounded w-full hover:bg-gray-100 hover:text-black flex justify-between items-center">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() =>
                    item.isDirectory
                      ? driveSubject.openFolderByPath(item.path)
                      : driveSubject.openFilePreview(item)
                  }
                >
                  {item.isDirectory ? "📁" : "📄"} {item.name}
                </div>

                <button
                  className="text-red-600 hover:underline text-sm ml-2 cursor-pointer"
                  onClick={() => handleDelete(item)}
                >
                  <DeleteSharpIcon 
                    fontSize="large" 
                    sx={{ 
                      color: "gray",
                      '&:hover': {
                        color: 'red',
                        transform: 'scale(1.1)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
