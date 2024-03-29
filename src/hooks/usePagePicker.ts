import { useState, useCallback } from 'react';

const usePagePicker = (
  defaultComponent: JSX.Element,
  defaultMenuItem: string,
) => {
  const [page, setPage] = useState(defaultComponent);
  const [activeMenuItem, setActiveMenuItem] = useState(defaultMenuItem);

  const toggleComponent = useCallback(
    (component: JSX.Element, menuItem: string) => {
      setPage(component);
      setActiveMenuItem(menuItem);
    },
    [],
  );

  return { page, toggleComponent, activeMenuItem };
};

export default usePagePicker;
