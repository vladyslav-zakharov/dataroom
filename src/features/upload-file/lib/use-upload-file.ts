'use client';

import { useCallback } from 'react';

import { toast } from 'sonner';

import { DataroomError, useDataroomStore } from 'entities';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_LABEL } from 'shared/constants';

interface UseUploadFileParams {
  dataroomId: string;
  parentId: string | null;
}

interface UseUploadFileResult {
  processFile: (file: File) => Promise<void>;
}

const useUploadFile = ({ dataroomId, parentId }: UseUploadFileParams): UseUploadFileResult => {
  const uploadFile = useDataroomStore((state) => state.uploadFile);

  const processFile = useCallback(
    async (file: File) => {
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        toast.error('Only PDF files are supported', {
          description: `"${file.name}" is not a PDF file.`,
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error('File too large', {
          description: `"${file.name}" exceeds the ${MAX_FILE_SIZE_LABEL} limit.`,
        });
        return;
      }

      try {
        const node = await uploadFile(dataroomId, parentId, file);
        const wasRenamed =
          (node as unknown as Record<string, unknown>)['_wasRenamed'] === true;
        if (wasRenamed) {
          toast.success(`Uploaded as "${node.name}"`, {
            description: 'Renamed to avoid a conflict with an existing file.',
          });
        } else {
          toast.success(`"${node.name}" uploaded`);
        }
      } catch (error) {
        if (error instanceof DataroomError && error.code === 'INVALID_FILE_TYPE') {
          toast.error('Only PDF files are supported', {
            description: `"${file.name}" could not be uploaded.`,
          });
        } else {
          toast.error('Upload failed', {
            description: 'An unexpected error occurred. Please try again.',
          });
        }
      }
    },
    [dataroomId, parentId, uploadFile],
  );

  return { processFile };
};

export default useUploadFile;
