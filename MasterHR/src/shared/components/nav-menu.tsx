import { Link, useMatches } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib';

import { isAccordionItemGuard } from './app-sidebar.lib';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from './ui';

import type { MenuItem } from './app-sidebar.lib';
import type { FC, JSX } from 'react';

type NavMenuProps = { items: MenuItem[] };

export const NavMenu: FC<NavMenuProps> = ({ items }) => {
  const matches = useMatches();
  const currentPagePath = matches.at(-1)?.pathname;

  const renderMenuItem = (item: MenuItem, level = 0): JSX.Element | null => {
    if (!item) return null;

    const isActiveLink = currentPagePath?.includes(item.to);

    if (!isAccordionItemGuard(item)) {
      return (
        <SidebarMenuItem key={`${item.title}-${level}`}>
          <Link to={item.to} className='cursor-pointer! w-full'>
            <SidebarMenuButton tooltip={item.title} className={cn('', isActiveLink && 'bg-sidebar-accent')}>
              {item.icon && level === 0 && <item.icon />}
              {item.title}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={`${item.title}-${level}`}>
        <Collapsible className='group/collapsible'>
          <CollapsibleTrigger
            render={
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
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
      <SidebarMenu>{items.map((item) => renderMenuItem(item))}</SidebarMenu>
    </SidebarGroup>
  );
};
