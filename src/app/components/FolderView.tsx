"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DriveNode } from "../types/drive";
import { driveSubject } from "../observer/DriveSubject";
import { removeFile, removeFolder } from "../services/storageApi";
import { refreshTree } from "../utils/refreshTree";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import FolderIcon from '@mui/icons-material/Folder';
import ArticleIcon from '@mui/icons-material/Article';
import { FileActions } from "./FileActions";

type Props = {
  setIsLoading: (loading: boolean) => void;
};

export const FolderView = ({ setIsLoading }: Props) => {
  const [folder, setFolder] = useState<DriveNode | null>(driveSubject.getCurrentNode());
  const [viewMode, setViewMode] = useState<"grid" | "list">(driveSubject.getViewMode());
  const [sortMode, setSortMode] = useState<"name" | "type">("name");

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

  const sortedItems = [...(folder?.children ?? [])].sort((a, b) => {
    if (sortMode === "type") {
      return Number(b.isDirectory) - Number(a.isDirectory);
    }
    return a.name.localeCompare(b.name);
  });

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (viewMode === "grid" ? 160 : 70),
  });

  return (
    <>
    <div className="flex items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-3">
          <span>Ordernar por:</span>
          <button 
            onClick={() => setSortMode("name")}
            className="mb-2 flex gap-3 text-sm items-center bg-[#29235c] text-white px-4 py-2 rounded-xl hover:bg-[#d29d46] cursor-pointer transition-all duration-300 hover:text-black hover:scale-102 hover:rounded-4xl hover:text-white">
            Nombre
          </button>
          <button 
            onClick={() => setSortMode("type")}
            className="mb-2 flex gap-3 text-sm items-center bg-[#29235c] text-white px-4 py-2 rounded-xl hover:bg-[#d29d46] cursor-pointer transition-all duration-300 hover:text-black hover:scale-102 hover:rounded-4xl hover:text-white">
            Tipo
          </button>
        </div>
        <FileActions setIsLoading={setIsLoading} />
    </div>
    

    <div ref={parentRef} className="overflow-auto h-[70vh] mt-4 rounded-4xl border shadow-xl shadow-[#29235c]">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = sortedItems[virtualRow.index];

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
              <div className="p-6 pl-3 text-5xl font-bold rounded w-full flex justify-between items-center hover:bg-[#29235c] transition-all duration-300 hover:text-black hover:scale-102 hover:cursor-pointer hover:rounded-4xl hover:text-white">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() =>
                    item.isDirectory
                      ? driveSubject.openFolderByPath(item.path)
                      : driveSubject.openFilePreview(item)
                  }
                >
                  {item.isDirectory ? <FolderIcon fontSize="large"/> : <ArticleIcon fontSize="large"/>} {item.name}
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
                        color: '#d29d46',
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
    </>
  );
};
