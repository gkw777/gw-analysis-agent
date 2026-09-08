import { useEffect, useState } from 'react';
import { get } from '@/shared/utils';

const useCoreQuestions = () => {
  const [coreQuestions, setCoreQuestions] = useState<string[]>([]);

  useEffect(() => {
    get<{ data: string[] }>('/gnb/core-questions').then(({ data }) => setCoreQuestions(data));
  }, []);

  return coreQuestions;
};

export default useCoreQuestions;
