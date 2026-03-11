import { useMemo } from 'react';
import { User } from 'lucide-react';

import { useIsMobile } from '@/shared/hooks';

import { NavMenu } from './nav-menu';
import {
  SidebarContent,
  SidebarHeader,
  Sidebar,
  SuspenseWrapper,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from './ui';
import { filterAllowedItems } from './app-sidebar.lib';

import type { ComponentProps } from 'react';
import type { GetPermission } from '@/api/endpoints/permission';

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  userPermissions: Array<GetPermission['name']>;
};
export function AppSidebar({ userPermissions, ...props }: AppSidebarProps) {
  const isMobile = useIsMobile();

  const { state } = useSidebar();

  const ALLOWED_ITEMS = useMemo(() => filterAllowedItems(userPermissions), [userPermissions]);

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='m-1 flex-row justify-center gap-0 rounded-lg border p-2'>
        {state === 'collapsed' ? (
          'HR'
        ) : (
          <>
            <User />
            <span className='ml-2'>MasterHR</span>
          </>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMenu items={ALLOWED_ITEMS} />
      </SidebarContent>
      <SidebarFooter className='border-t'>
        <SuspenseWrapper condition={!isMobile}>
          <SidebarTrigger />
        </SuspenseWrapper>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
