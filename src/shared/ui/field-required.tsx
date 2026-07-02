import { FC, ReactNode } from 'react';

import { cn } from 'shared/lib';

interface Props {
  children?: ReactNode;
  className?: string;
}

export const FieldRequired: FC<Props> = ({ children = '*', className }) => (
  <span className={cn('text-destructive', className)} aria-hidden="true">
    {children}
  </span>
);
