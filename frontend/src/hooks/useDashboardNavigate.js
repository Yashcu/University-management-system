import { useSearchParams } from 'react-router-dom';

export const useDashboardNavigate = () => {
  const [, setSearchParams] = useSearchParams();

  const navigateToPage = (page) => {
    setSearchParams({ page });
  };

  return navigateToPage;
};
