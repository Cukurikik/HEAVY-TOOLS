"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelect: (files: File[]) => void;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  children?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  onClick?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function FileDropzone({
  onFileSelect,
  className,
  activeClassName,
  inactiveClassName,
  children,
  accept,
  multiple = false,
  onClick,
  inputRef,
}: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  const defaultInputRef = React.useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef || defaultInputRef;

  return (
    <div
      className={cn(
        className,
        dragActive ? activeClassName : inactiveClassName
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onClick || (() => resolvedInputRef.current?.click())}
    >
      <input
        ref={resolvedInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
      {children}
    </div>
  );
}
