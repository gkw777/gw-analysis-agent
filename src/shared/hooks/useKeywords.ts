import { useEffect, useState } from 'react';
import { get } from '@/shared/utils';

const useKeywords = () => {
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    get<{ data: string[] }>('/gnb/keywords').then(({ data }) => setKeywords(data));
  }, []);

  return keywords;
};

export default useKeywords;
