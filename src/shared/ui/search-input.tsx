'use client';

import { type FC } from 'react';

import { SearchIcon } from 'lucide-react';

import { cn } from 'shared/lib';

import { Input } from './shadcn';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: FC<Props> = ({
  value,
  onChange,
  placeholder = 'Search',
  className,
}) => (
  <div className={cn('relative', className)}>
    <SearchIcon
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
    <Input
      type="search"
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="bg-muted pl-9"
    />
  </div>
);
