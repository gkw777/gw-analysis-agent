import { useEffect, useState } from 'react';
import type { ThresholdGroup } from '@/shared/types';
import { get } from '@/shared/utils';

const useThresholdGroups = () => {
  const [thresholdGroups, setThresholdGroups] = useState<ThresholdGroup[]>([]);

  useEffect(() => {
    get<{ data: ThresholdGroup[] }>('/gnb/threshold-groups').then(({ data }) => setThresholdGroups(data));
  }, []);

  return thresholdGroups;
};

export default useThresholdGroups;
