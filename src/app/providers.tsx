'use client';

import { useEffect, type FC, type ReactNode } from 'react';

import { useDataroomStore } from 'entities';
import { Toaster, TooltipProvider } from 'shared/ui';

interface Props {
  children: ReactNode;
}

const AppProviders: FC<Props> = ({ children }) => {
  const hydrate = useDataroomStore((state) => state.hydrate);
  const isHydrated = useDataroomStore((state) => state.isHydrated);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <TooltipProvider>
      {isHydrated ? (
        children
      ) : (
        <div className="min-h-svh flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin"
              role="status"
              aria-label="Loading"
            />
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        </div>
      )}
      <Toaster richColors closeButton />
    </TooltipProvider>
  );
};

export default AppProviders;
