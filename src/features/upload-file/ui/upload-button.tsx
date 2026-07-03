'use client';

import { useRef, useState, type FC } from 'react';

import { UploadIcon } from 'lucide-react';

import { Button } from 'shared/ui';

import useUploadFile from '../lib/use-upload-file';

interface Props {
  dataroomId: string;
  parentId: string | null;
}

const UploadButton: FC<Props> = ({ dataroomId, parentId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { processFile } = useUploadFile({ dataroomId, parentId });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploading(true);
    await processFile(file);
    setUploading(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleFileChange}
      />
      <Button
        variant="default"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Upload PDF file"
      >
        <UploadIcon className="h-4 w-4" aria-hidden="true" />
        {uploading ? 'Uploading…' : 'Upload PDF'}
      </Button>
    </>
  );
};

export default UploadButton;
