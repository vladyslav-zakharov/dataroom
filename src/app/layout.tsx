import { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';

import { cn } from 'shared/lib';
import { TanStackQueryProvider } from 'shared/providers';

import 'app/styles/global.css';

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Dataroom MVP',
  description: 'A Next.js application for managing and sharing data rooms.',
};

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-white text-gray-600 transition-all duration-1000 ease-in-out dark:bg-gray-600 dark:text-white',
          urbanist.className,
        )}
      >
        <TanStackQueryProvider>{children}</TanStackQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
