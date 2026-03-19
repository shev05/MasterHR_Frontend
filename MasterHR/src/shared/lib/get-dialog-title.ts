type GetDialogTitleProps = {
  isViewMode?: boolean;
  isEditMode?: boolean;
};

export const getDialogTitle = ({ isViewMode, isEditMode }: GetDialogTitleProps) => {
  if (isViewMode) return 'Просмотр ';
  if (isEditMode) return 'Редактирование ';
  return 'Создание ';
};
