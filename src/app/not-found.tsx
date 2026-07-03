import Link from 'next/link';

import { Button, Threads } from 'shared/ui';

const NotFound = () => {
  return (
    <div className="relative isolate flex min-h-[70vh] items-center justify-end">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Threads color={[0.28, 0.33, 0.41]} amplitude={1} distance={0} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Frosted panel: open + transparent on the left (borderless, no radius),
            solid rounded border on the right. The mask fades the whole panel —
            background, blur, and borders — in from the left so the threads flow
            through it smoothly. Kept separate from the text so content stays crisp. */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-r-xl border-y border-r border-border backdrop-blur-md [-webkit-mask-image:linear-gradient(to_right,transparent,#000_40%)] [mask-image:linear-gradient(to_right,transparent,#000_40%)]"
        />

        <div className="relative py-10 pl-8 pr-8 text-center sm:pl-24">
          <p className="text-5xl font-bold tracking-tight text-foreground">
            404
          </p>
          <h1 className="mt-3 text-lg font-semibold text-foreground">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find the page you&apos;re looking for. It may have
            been moved, renamed, or removed.
          </p>
          <Button asChild className="mt-5">
            <Link href="/">Back to datarooms</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
