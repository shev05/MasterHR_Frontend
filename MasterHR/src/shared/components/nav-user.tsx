import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';
import { removeIsAuth } from '@/store';

import type { FC } from 'react';
import type { GetUser } from '@/api/endpoints/user';

type BaseUserAvatarView = {
  name?: GetUser['name'];
  surname?: GetUser['surname'];
  patronymic?: GetUser['patronymic'];
  email?: GetUser['email'];
  position?: GetUser['position'];
};

const UserAvatar: FC<BaseUserAvatarView> = ({ name, surname, patronymic }) => {
  return (
    <Avatar className={'rounded'}>
      <AvatarFallback className={'rounded'}>
        {name?.charAt(0).toUpperCase()}
        {surname?.charAt(0).toUpperCase()}
        {patronymic?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

const UserInfo: FC<BaseUserAvatarView> = ({ name, surname, patronymic, position, email }) => (
  <div className={`grid flex-1 text-left text-sm leading-tight`}>
    <span className='truncate font-semibold'>
      {name} {surname} {patronymic}
    </span>
    {email && <span className='text-muted-foreground truncate text-[8px]'>{email}</span>}
    {position && <span className='text-muted-foreground truncate text-[8px]'>{position}</span>}
  </div>
);

export type NavUserProps = {
  user?: GetUser;
};

export const NavUser: FC<NavUserProps> = ({ user }) => {
  const navigate = useNavigate();

  const { isMobile } = useSidebar();

  const handleLogout = () => {
    removeIsAuth();
    navigate(ROUTES_META.ROOT_LOGIN.absPath, { replace: true });
  };
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-fit'
              >
                <UserAvatar name={user.name} surname={user.surname} patronymic={user.patronymic} />
                <UserInfo
                  name={user.name}
                  surname={user.surname}
                  patronymic={user.patronymic}
                  email={user.email}
                  position={user.position}
                />
                <ChevronsUpDown className='ml-auto size-4' />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuPositioner align='end' sideOffset={4} className={'z-50'} side={isMobile ? 'bottom' : 'right'}>
            <DropdownMenuContent className='max-w-(--anchor-width) z-60 min-w-56 rounded-lg'>
              <DropdownMenuGroup>
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <UserAvatar name={user.name} surname={user.surname} patronymic={user.patronymic} />
                    <UserInfo
                      name={user.name}
                      surname={user.surname}
                      patronymic={user.patronymic}
                      email={user.email}
                      position={user.position}
                    />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Выход
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
