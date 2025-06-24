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
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { Header } from "./components/Header";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchTree()
      .then((data) => driveSubject.setTree(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="p-6 relative ">
      <SignedIn>
        <Header />
        <Breadcrumbs />
        {/* <ViewToggle /> */}
        {/* <FileActions setIsLoading={setIsLoading} /> */}
        <FolderView setIsLoading={setIsLoading} />
        <PreviewPanel />

        {isLoading && <LoadingOverlay />}
      </SignedIn>

      <SignedOut>
          <SignIn routing="hash" />
      </SignedOut>    
  </main>
  );
}
