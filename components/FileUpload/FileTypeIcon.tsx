import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileArchive,
  File,
} from "lucide-react";

interface FileTypeIconProps {
  mimeType: string;
  className?: string;
}

export default function FileTypeIcon({
  mimeType,
  className,
}: FileTypeIconProps) {
  // Handle main MIME type categories
  switch (true) {
    case mimeType.startsWith("image/"):
      return <FileImage className={className} />;
    case mimeType.startsWith("video/"):
      return <FileVideo className={className} />;
    case mimeType.startsWith("audio/"):
      return <FileAudio className={className} />;
    case mimeType.startsWith("text/"):
      return <FileText className={className} />;
    case mimeType.includes("pdf"):
      return <FilePdf className={className} />;
    case mimeType.includes("spreadsheet") || mimeType.includes("excel"):
      return <FileSpreadsheet className={className} />;
    case mimeType.includes("zip") || mimeType.includes("compressed"):
      return <FileArchive className={className} />;
    case mimeType.includes("javascript") || mimeType.includes("code"):
      return <FileCode className={className} />;
    default:
      return <File className={className} />;
  }
}
