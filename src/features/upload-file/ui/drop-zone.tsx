'use client';

import { useState, useRef, type FC, type ReactNode, type DragEvent } from 'react';

import { UploadIcon } from 'lucide-react';

import { MAX_FILE_SIZE_LABEL } from 'shared/constants';

import useUploadFile from '../lib/use-upload-file';

interface Props {
  dataroomId: string;
  parentId: string | null;
  children: ReactNode;
}

const DropZone: FC<Props> = ({ dataroomId, parentId, children }) => {
  const [dragging, setDragging] = useState(false);
  const dragCounterRef = useRef(0);
  const { processFile } = useUploadFile({ dataroomId, parentId });

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current++;
    if (dragCounterRef.current === 1) {
      setDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setDragging(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current = 0;
    setDragging(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) {
      return;
    }

    for (const file of files) {
      await processFile(file);
    }
  };

  return (
    <div
      className="relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {dragging && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary bg-primary/5 backdrop-blur-[1px]"
          aria-hidden="true"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadIcon className="h-7 w-7" />
          </div>
          <div className="text-center">
            <p className="font-medium text-primary">Drop PDF files here</p>
            <p className="text-sm text-muted-foreground">Maximum {MAX_FILE_SIZE_LABEL} per file</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
