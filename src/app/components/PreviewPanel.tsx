"use client";

import { useEffect, useState } from "react";
import { PreviewToolbar } from "./PreviewToolbar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { duotoneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRef } from "react"; // Para pantalla completa y copiar
import { driveSubject } from "../observer/DriveSubject";
import { DriveNode } from "../types/drive";
import { fetchFileBlob } from "../utils/fetchFileBlob";

const extensionToLanguage: Record<string, string> = {
  js: "javascript", ts: "typescript", tsx: "tsx", py: "python", java: "java",
  cpp: "cpp", c: "c", cs: "csharp", html: "html", css: "css", json: "json",
  md: "markdown", sh: "bash", go: "go", rb: "ruby", php: "php", xml: "xml",
  yml: "yaml", yaml: "yaml", sql: "sql", swift: "swift", kt: "kotlin"
};

const codeThemes = {
  oneDark: { label: "One Dark", style: oneDark },
  duotoneLight: { label: "Duotone Light", style: duotoneLight },
  solarizedlight: { label: "Solarized Light", style: solarizedlight },
};

export const PreviewPanel = () => {
  const [file, setFile] = useState<DriveNode | null>(driveSubject.getPreviewFile());
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("oneDark");
  const [copied, setCopied] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const newFile = driveSubject.getPreviewFile();
      setFile(newFile);
      setBlobUrl(null);
      setPreviewText(null);

      if (newFile && !newFile.isDirectory) {
        fetchFileBlob(newFile.path)
          .then(async ({ blob, blobUrl }) => {
            setBlobUrl(blobUrl);
            const ext = newFile.name.split(".").pop()?.toLowerCase() ?? "";
            const isCode = Object.keys(extensionToLanguage).includes(ext);
            const isText = /\.(txt|log|csv|md)$/i.test(ext);

            // Permitir .txt y .md como texto plano si no son código
            if (isCode || isText) {
              const text = await blob.text();
              setPreviewText(text.length > 50000 ? text.slice(0, 50000) + "\n\n...archivo truncado" : text);
            }
          })
          .catch(() => setBlobUrl("error"));
      }
    };
    update();
    driveSubject.subscribe(update);
    return () => driveSubject.unsubscribe(update);
  }, []);

  if (!file) return null;
  if (blobUrl === "error") return <div>Error al cargar archivo.</div>;

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isImage = /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.name);
  const isPDF = ext === "pdf";
  const isCode = Object.keys(extensionToLanguage).includes(ext);
  const isTextPlain = /\.(txt|md)$/i.test(ext);
  const isOffice = ["docx", "xlsx", "pptx"].includes(ext);

  const renderPreview = () => {
    if (isImage) return (
      <div className="relative max-h-[80vh] flex flex-col items-center">
        <PreviewToolbar
          blobUrl={blobUrl}
          fileName={file.name}
          showCopy={false}
          showOpen={true}
          showFullscreen={false}
        />
        <img src={blobUrl!} alt={file.name} className="max-h-[70vh] mx-auto" />
      </div>
    );
    if (isPDF) return (
      <div className="relative max-h-[80vh] flex flex-col items-center">
        <PreviewToolbar
          blobUrl={blobUrl}
          fileName={file.name}
          showCopy={false}
          showOpen={true}
          showFullscreen={false}
        />
        <iframe src={blobUrl!} className="w-full h-[70vh]" />
      </div>
    );
    if (isOffice && blobUrl) {
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(blobUrl)}`;
      return (
        <div className="relative max-h-[80vh] flex flex-col items-center">
          <PreviewToolbar
            blobUrl={blobUrl}
            fileName={file.name}
            showCopy={false}
            showOpen={true}
            showFullscreen={false}
          />
          <iframe
            src={officeViewerUrl}
            className="w-full h-[70vh] border rounded"
            title={file.name}
          />
        </div>
      );
    }
    if (isCode && previewText)
      return (
        <div className="max-h-[80vh] overflow-auto w-auto text-sm rounded bg-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="border rounded-lg px-2 py-1 mr-2 bg-white text-md"
              style={{ minWidth: 120 }}
            >
              {Object.entries(codeThemes).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <PreviewToolbar
              blobUrl={blobUrl}
              fileName={file.name}
              showCopy={true}
              copied={copied}
              onCopy={() => {
                if (previewText) {
                  navigator.clipboard.writeText(previewText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }
              }}
              // showOpen={true}
              showFullscreen={true}
              previewRef={previewRef as React.RefObject<HTMLElement>}
            />
          </div>
          <div ref={previewRef}>
            <SyntaxHighlighter
              language={extensionToLanguage[ext] || "text"}
              style={codeThemes[theme as keyof typeof codeThemes].style}
              wrapLongLines
            >
              {previewText}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    if (previewText && (isTextPlain || !isCode))
      return (
        <div className="max-h-[80vh] overflow-auto text-sm rounded border bg-gray-100">
          <PreviewToolbar
            blobUrl={blobUrl}
            fileName={file.name}
            showCopy={true}
            copied={copied}
            onCopy={() => {
              if (previewText) {
                navigator.clipboard.writeText(previewText);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
            showOpen={true}
            showFullscreen={true}
            previewRef={previewRef as React.RefObject<HTMLElement>}
          />
          <pre ref={previewRef as any} className="w-full h-[70vh] bg-gray-100 p-4 font-mono text-black overflow-auto">{previewText}</pre>
        </div>
      );
    return <p className="text-center text-gray-600">No se puede previsualizar este tipo de archivo.</p>;
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative shadow-xl shadow-black hover:scale-102 transition-all duration-300">
        <button
          className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-xl cursor-pointer"
          onClick={() => driveSubject.closePreview()}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-2 text-gray-700">{file.name}</h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
            <span className="text-gray-500">Cargando vista previa...</span>
          </div>
        ) : (
          renderPreview()
        )}
        {/* Barra de estado */}
        <div className="mt-4 px-2 py-1 bg-gray-50 rounded flex flex-wrap gap-4 text-xs text-gray-500 border-t border-black">
          <span><b>Nombre:</b> {file.name}</span>
          {('size' in file) && file.size && <span><b>Tamaño:</b> {(file.size/1024).toFixed(2)} KB</span>}
          {('type' in file) && file.type && <span><b>Tipo:</b> {file.type}</span>}
          {('modified' in file) && file.modified && <span><b>Modificado:</b> {new Date(file.modified).toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );
};