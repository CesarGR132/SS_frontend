export async function fetchFileBlob(filePath: string): Promise<{ blobUrl: string, type: string }> {
    console.log('fetching file');
    const response = await fetch('http://localhost:5000/api/storage/getFile', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: filePath }),
    });
  
    if (!response.ok) {
      throw new Error("Error al obtener el archivo");
    }
  
    const contentType = response.headers.get("Content-Type") || "application/octet-stream";
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
  
    return { blobUrl, type: contentType };
  }
  