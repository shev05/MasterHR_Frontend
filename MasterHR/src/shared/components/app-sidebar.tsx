import { Workflow } from 'lucide-react';

import { useIsMobile } from '@/shared/hooks';
import { AUTHENTICATED_MENU_ITEMS } from '@/shared/constants';

import {
  buttonVariants,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  Sidebar,
  SuspenseWrapper,
  SidebarFooter,
  SidebarTrigger,
} from './ui';
import { NavMenu } from './nav-menu';

import type { ComponentProps } from 'react';

type AppSideBarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSideBarProps) {
  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenuButton>
          <div className={buttonVariants({ size: 'icon-sm' })}>
            <Workflow />
          </div>
        </SidebarMenuButton>
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
