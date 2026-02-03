import { useContext } from 'react';

import { SidebarContext } from './sidebar-context';

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  if (!context) throw new Error('useSidebar не находится в провайдере');

  return context;
};
