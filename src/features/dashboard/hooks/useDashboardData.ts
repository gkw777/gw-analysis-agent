import { useEffect, useState } from 'react';
import { get } from '@/shared/utils';
import type { DashboardData } from '@/features/dashboard/types';

const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    get<{ data: DashboardData }>('/dashboard').then(({ data }) => setData(data));
  }, []);

  return data;
};

export default useDashboardData;
