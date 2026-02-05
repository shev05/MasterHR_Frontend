import { User } from 'lucide-react';

import { useIsMobile } from '@/shared/hooks';
import { AUTHENTICATED_MENU_ITEMS } from '@/shared/constants';

import {
  SidebarContent,
  SidebarHeader,
  Sidebar,
  SuspenseWrapper,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from './ui';
import { NavMenu } from './nav-menu';

import type { ComponentProps } from 'react';

type AppSideBarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSideBarProps) {
  const isMobile = useIsMobile();
  const { state } = useSidebar();

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
        <NavMenu items={AUTHENTICATED_MENU_ITEMS} />
      </SidebarContent>
      <SidebarFooter className='border-t'>
        <SuspenseWrapper condition={!isMobile}>
          <SidebarTrigger />
        </SuspenseWrapper>
      </SidebarFooter>
    </Sidebar>
  );
}
