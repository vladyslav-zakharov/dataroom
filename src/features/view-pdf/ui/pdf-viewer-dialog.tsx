'use client';

import { useState, useEffect, useRef, useCallback, type FC, type ReactNode } from 'react';

import { AlertCircleIcon, DownloadIcon } from 'lucide-react';

import { useDataroomStore } from 'entities';
import type { FileNode } from 'entities';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'shared/ui';

interface Props {
  node: FileNode;
  children: ReactNode;
}

type ViewerState =
  | { status: 'loading' }
  | { status: 'ready'; url: string; fileName: string }
  | { status: 'error'; message: string };

export const PdfViewerDialog: FC<Props> = ({ node, children }) => {
  const [open, setOpen] = useState(false);
  const getFileBlob = useDataroomStore((store) => store.getFileBlob);
  const [viewerState, setViewerState] = useState<ViewerState>({ status: 'loading' });

  // Keep a stable reference to the last node so the dialog title doesn't flash
  // "PDF Viewer" during the close animation.
  const nodeRef = useRef<FileNode>(node);
  nodeRef.current = node;
  const displayNode = nodeRef.current;

  useEffect(() => {
    if (!open) {
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    setViewerState({ status: 'loading' });

    getFileBlob(node.id)
      .then((blob) => {
        if (cancelled) {
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setViewerState({ status: 'ready', url: objectUrl, fileName: node.name });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setViewerState({
          status: 'error',
          message:
            'The file could not be loaded. It may have been corrupted or failed to save.',
        });
      });

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [open, node, getFileBlob]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && viewerState.status === 'ready') {
        URL.revokeObjectURL(viewerState.url);
        setViewerState({ status: 'loading' });
      }
      setOpen(next);
    },
    [viewerState],
  );

  const handleDownload = () => {
    if (viewerState.status !== 'ready') {
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = viewerState.url;
    anchor.download = viewerState.fileName.endsWith('.pdf')
      ? viewerState.fileName
      : `${viewerState.fileName}.pdf`;
    anchor.click();
  };

  const title = displayNode.name;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-3xl h-[90vh] max-h-[90vh] p-0 gap-0">
        <DialogHeader className="flex-row items-center justify-between gap-3 px-4 py-3 border-b border-border">
          <DialogTitle className="truncate text-sm font-medium">{title}</DialogTitle>
          {viewerState.status === 'ready' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="shrink-0 mr-8"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              Download
            </Button>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-muted/30">
          {viewerState.status === 'loading' && (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin"
                  role="status"
                  aria-label="Loading PDF"
                />
                <p className="text-sm text-muted-foreground">Loading PDF…</p>
              </div>
            </div>
          )}

          {viewerState.status === 'error' && (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center px-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertCircleIcon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground">Unable to display PDF</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {viewerState.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {viewerState.status === 'ready' && (
            <iframe
              src={viewerState.url}
              title={title}
              className="h-full w-full border-0"
              aria-label={`PDF viewer for ${title}`}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
