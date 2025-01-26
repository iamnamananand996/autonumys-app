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
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file || !title || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsUploading(true); // Start loader
    setProgress(0); // Reset progress

    const readFileAsBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };

    const fileContent = await readFileAsBase64(file);

    const payload = {
      taskName: title,
      taskDescription: description,
      file: fileContent,
      fileName: file.name,
      rewardPoints: 100, // Replace with actual reward points if needed
    };

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/tasks/create", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded / event.total) * 100);
        setProgress(percentCompleted); // Update progress bar
      }
    };

    // Handle successful upload
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        toast.success(`Task created successfully. CID: ${response.task.cid}`);
        setProgress(100); // Complete progress
        clearFile();
        clearInputs();
      } else {
        console.error("Upload failed:", xhr.statusText);
        toast.error("Task creation failed.");
      }
      setIsUploading(false); // Stop loader
    };

    // Handle upload error
    xhr.onerror = () => {
      console.error("Upload failed.");
      toast.error("Task creation failed.");
      setIsUploading(false);
    };

    // Send the payload
    xhr.send(JSON.stringify(payload));
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

  const clearInputs = () => {
    setTitle("");
    setDescription("");
  };

  return (
    <div className="flex justify-center my-10">
      <div className="w-[800px]">
        {/* Input Fields for Title and Description */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* File Dropzone */}
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
              disabled={!file || !title || !description || isUploading}
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
