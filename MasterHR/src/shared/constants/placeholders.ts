export const PLACEHOLDERS = {
  dialog: 'Внесите изменения. Нажмите «Сохранить», когда закончите.',
  empty: 'Выберите значение',
  access: 'Нет прав доступа !',
  sidebarError: 'Произошла ошибка в навигации',
  dialogError: 'Произошла ошибка в модальном окне',
  filtersError: 'Произошла ошибка в фильтрах',
  tableError: 'Произошла ошибка в таблице',
  headerError: 'Произошла ошибка в шапке',
  mediaError: 'Произошла ошибка в медиа',
};

export const getControlPlaceholder = (hasAccess?: boolean) => {
  return hasAccess ? PLACEHOLDERS.empty : PLACEHOLDERS.access;
};
