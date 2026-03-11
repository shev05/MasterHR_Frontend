import { ChevronDown } from 'lucide-react';
import { Link, useMatches } from 'react-router-dom';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';

import { isAccordionItemGuard, type MenuItem } from './app-sidebar.lib';

import type { FC, JSX } from 'react';

type NavMenuProps = { items: MenuItem[] | undefined };

export const NavMenu: FC<NavMenuProps> = ({ items }) => {
  const matches = useMatches();
  const currentPagePath = matches.at(-1)?.pathname;

  const renderMenuItem = (item: MenuItem, level = 0): JSX.Element | null => {
    if (!item || !item.path || !item.label) return null;

    const isActiveLink = currentPagePath?.includes(item.path);

    if (!isAccordionItemGuard(item)) {
      return (
        <SidebarMenuItem key={`${item.label}-${level}`}>
          <Link to={item.path} className='cursor-pointer! w-full'>
            <SidebarMenuButton tooltip={item.label} className={cn('', isActiveLink && 'bg-sidebar-accent')}>
              {item.icon && level === 0 && <item.icon />}
              {item.label}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={`${item.label}-${level}`}>
        <Collapsible className='group/collapsible'>
          <CollapsibleTrigger
            render={
              <SidebarMenuButton tooltip={item.label}>
                {item.icon && <item.icon />}
                <span>{item.label}</span>
                <ChevronDown className='ml-auto size-3 transition-all ease-out group-data-[panel-open]:rotate-180' />
              </SidebarMenuButton>
            }
          />
          <CollapsibleContent>
            <SidebarMenuSub>{item.items?.map((subItem) => renderMenuItem(subItem, level + 1))}</SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarGroup>
      <SidebarMenu>{items?.map((item) => renderMenuItem(item))}</SidebarMenu>
    </SidebarGroup>
  );
};
