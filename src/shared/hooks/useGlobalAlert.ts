import { HttpStatus } from '@/shared/constants';
import { globalAlertAtom, type GlobalAlertState } from '@/shared/store';
import { errorMessage } from '@/shared/utils';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

/** 전역 알림 상태를 관리하는 커스텀 훅 */
const useGlobalAlert = () => {
  const [globalAlert, setGlobalAlert] = useAtom(globalAlertAtom);
  const resetGlobalAlert = useResetAtom(globalAlertAtom);

  const showGlobalAlert = (alertState: GlobalAlertState) => {
    // 기존 상태를 초기화하고 새로운 상태를 설정한다.
    resetGlobalAlert();
    setGlobalAlert((prev) => ({ ...prev, ...alertState }));
  };

  const hideGlobalAlert = () => {
    resetGlobalAlert();
  };

  return { globalAlert, showGlobalAlert, hideGlobalAlert };
};

export default useGlobalAlert;

/** 전역 Rejection 알림을 관리하는 커스텀 훅 */
export const useGlobalRejectionAlert = () => {
  const { showGlobalAlert } = useGlobalAlert();

  const handleRejection = useCallback(
    (event: PromiseRejectionEvent) => {
      const { reason } = event;

      if (axios.isAxiosError(reason) && reason.response?.status !== HttpStatus.Unauthorized) {
        showGlobalAlert({
          open: true,
          message: errorMessage(reason, `${reason.response?.status} 에러가 발생했습니다.`),
          navigateTo: '/',
          disableOkBtn: true,
        });
      }
    },
    [showGlobalAlert]
  );

  // catch 되지 않은 axios 에러를 감지해 전역 Alert 모달로 알린다.
  useEffect(() => {
    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, [handleRejection]);
};
