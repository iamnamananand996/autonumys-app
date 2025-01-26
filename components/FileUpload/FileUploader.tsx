"use client";

import * as React from "react";
import { X, Upload } from "lucide-react";

import FileTypeIcon from "./FileTypeIcon";
import Button from "../Button";
import Progress from "../Progress";
import Spinner from "../Spinner";
import toast from "react-hot-toast";

interface FileUploaderProps {
  maxSize?: number; // in MB
}

export default function FileUploader({
  maxSize = 25, // Default max size in MB
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const buffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(buffer);
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/storage/upload", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Event listener to track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded / event.total) * 100);
        setProgress(percentCompleted);
      }
    };

    // Event listener for successful upload
    xhr.onload = () => {
      if (xhr.status === 200) {
        const { cid } = JSON.parse(xhr.responseText);
        toast.success(`File uploaded successfully. CID: ${cid}`);
        setProgress(100);
        clearFile();
      } else {
        console.error("Upload failed:", xhr.statusText);
        toast.error("File upload failed.");
      }
      setIsUploading(false);
      setProgress(0);
    };

    // Event listener for errors
    xhr.onerror = () => {
      console.error("Upload failed.");
      toast.error("File upload failed.");
      setIsUploading(false);
      setProgress(0);
    };

    // Prepare the request body
    const body = JSON.stringify({
      fileBuffer: Array.from(fileBuffer),
      fileName: file.name,
    });

    // Send the request
    xhr.send(body);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size should not exceed ${maxSize}MB`);
      return false;
    }
    return true;
  };

  const generatePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;
    setFile(file);
    generatePreview(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setIsUploading(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="w-[800px]">
        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-8 ${
            isDragging ? "border-primary bg-primary/10" : "border-muted"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p>Drag and Drop file here or</p>
              <Button
                variant="link"
                className="px-1"
                onClick={() => inputRef.current?.click()}
              >
                Choose file
              </Button>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        <div className="flex justify-end text-sm text-muted-foreground mt-1">
          <p>Maximum size: {maxSize}MB</p>
        </div>

        {file && (
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="relative flex-shrink-0">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview || "/placeholder.svg"}
                  alt="File preview"
                  className="h-16 w-16 rounded object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded bg-background flex items-center justify-center">
                  <FileTypeIcon
                    mimeType={file.type}
                    className="h-8 w-8 text-primary"
                  />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {Math.round(file.size / 1024)} KB
              </p>
              {isUploading && (
                <Progress value={progress} className="h-1 mt-2" />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearFile}>
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={!file || isUploading}
              variant="default"
              onClick={() => file && handleFileUpload(file)}
            >
              {isUploading ? <Spinner size="sm" /> : "Upload"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
