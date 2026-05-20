"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, FileImage, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  preview: string;
}

interface FileUploadProps {
  label: string;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  type: "image" | "video";
  onChange?: (files: File[]) => void;
}

export function FileUpload({
  label,
  accept,
  multiple = true,
  maxFiles = 5,
  type,
  onChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const remaining = maxFiles - files.length;
      const toAdd = Array.from(newFiles).slice(0, remaining);

      const uploaded: UploadedFile[] = toAdd.map((file) => ({
        file,
        preview: type === "image" ? URL.createObjectURL(file) : "",
      }));

      const updated = [...files, ...uploaded];
      setFiles(updated);
      onChange?.(updated.map((f) => f.file));
    },
    [files, maxFiles, type, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      onChange?.(updated.map((f) => f.file));
      return updated;
    });
  }, [onChange]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const Icon = type === "image" ? FileImage : FileVideo;

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
        {label}
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative w-full rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors duration-200",
          isDragging
            ? "border-vert-neon/60 bg-vert-neon/5"
            : "border-white/10 hover:border-white/20 bg-gris-anthracite/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="h-8 w-8 mx-auto mb-2 text-blanc-casse/40" />
        <p className="text-sm text-blanc-casse/60">
          Glissez vos fichiers ici ou{" "}
          <span className="text-vert-neon">cliquez pour parcourir</span>
        </p>
        <p className="text-xs text-blanc-casse/40 mt-1">
          {type === "image" ? "JPG, PNG, WEBP" : "MP4, MOV, AVI"} - Max{" "}
          {maxFiles} fichier{maxFiles > 1 ? "s" : ""}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {files.map((f, index) => (
            <div
              key={index}
              className="relative rounded-lg border border-white/10 bg-gris-anthracite p-2 flex items-center gap-2"
            >
              {f.preview ? (
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <Icon className="w-10 h-10 p-2 text-blanc-casse/40" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blanc-casse/80 truncate">
                  {f.file.name}
                </p>
                <p className="text-xs text-blanc-casse/40">
                  {formatSize(f.file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 rounded hover:bg-red-500/20 text-blanc-casse/40 hover:text-red-400 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
