'use client';

import type { FC, ReactNode } from 'react';

import Link from 'next/link';

import { BriefcaseBusiness } from 'lucide-react';

import { DarkVeil } from 'shared/ui';

interface Props {
  children: ReactNode;
}

const AppShell: FC<Props> = ({ children }) => {
  return (
    <div className="relative flex min-h-svh flex-col text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
        <DarkVeil hueShift={25} speed={0.6} warpAmount={0.1} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-background/70"
      />
      <header className="sticky top-0 z-50 border-b border-border backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-foreground/80"
          >
            <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
            <span>Dataroom</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
    </div>
  );
};

export default AppShell;
