"use client";

import { useEffect, useState } from "react";
import { driveSubject } from "./observer/DriveSubject";
import { FolderView } from "./components/FolderView";
import { Breadcrumbs } from "./components/BreadCrumbs";
// import { ViewToggle } from "./components/ViewToggle";
import { FileActions } from "./components/FileActions";
import { PreviewPanel } from "./components/PreviewPanel";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { fetchTree } from "./services/storageApi";
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchTree()
      .then((data) => driveSubject.setTree(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="p-6 relative">
      <div className="flex flex-row justify-evenly items-center">
        <Image 
        src="/img/logo_UNEDL.png"
        width={250}
        height={250}
        alt="Logo UNEDL"
        title="UNEDL"
        className="mb-4 border-2" 
        />
        <div className="w-11/12" />
        <h1 className="text-4xl text-center font-bold mb-4">PROYECTOS INGENIERIA</h1>
      </div>

    <Breadcrumbs />
    {/* <ViewToggle /> */}
    <FileActions setIsLoading={setIsLoading} />
    <FolderView setIsLoading={setIsLoading} />
    <PreviewPanel />

    {isLoading && <LoadingOverlay />}
  </main>
  );
}
