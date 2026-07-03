import type { FC } from 'react';

import Link from 'next/link';

import type { Dataroom, DataroomNode } from 'entities';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'shared/ui';

interface Props {
  dataroom: Dataroom;
  /** Ancestor path from getPath — root-to-current, inclusive. Empty when at dataroom root. */
  path: DataroomNode[];
}

const ExplorerBreadcrumb: FC<Props> = ({ dataroom, path }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Dashboard home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Datarooms</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dataroom root */}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {path.length === 0 ? (
            <BreadcrumbPage>{dataroom.name}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={`/dataroom/${dataroom.id}`}>{dataroom.name}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {/* Folder ancestors */}
        {path.map((node, index) => {
          const isLast = index === path.length - 1;
          return (
            <span key={node.id} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{node.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={`/dataroom/${dataroom.id}/folder/${node.id}`}>
                      {node.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ExplorerBreadcrumb;
