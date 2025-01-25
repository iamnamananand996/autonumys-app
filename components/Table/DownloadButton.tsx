import { useState } from "react";

import { Download, Loader2 } from "lucide-react";
import Button from "../Button";

export type DownloadButtonProps = {
  cid: string;
  fileName: string;
  fileType: string;
};

const DownloadButton = ({ cid, fileName, fileType }: DownloadButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (
    cid: string,
    fileName: string,
    fileType: string
  ) => {
    setIsLoading(true);
    try {
      const downloadUrl = `/api/storage/download?cid=${encodeURIComponent(
        cid
      )}&fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(
        fileType
      )}`;

      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = fileName; // Optional: triggers direct download in some browsers
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <Button
      size="sm"
      className="h-7"
      variant="outline"
      onClick={() => handleDownload(cid, fileName, fileType)}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Downloading..." : "Download"}
    </Button>
  );
};

export default DownloadButton;
