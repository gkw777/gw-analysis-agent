import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Stack } from '@mui/material';

import { Modal, Button } from '@/shared/components/commons';
import { globalAlertAtom } from '@/shared/store';
import styles from './GlobalAlertModal.module.scss';

/**
 * ### 전역 Alert 모달 컴포넌트
 * @returns
 *
 * @example
 *```tsx
 * // 전역 Alert 모달을 띄우는 예시
 * import { useGlobalAlert } from '@/shared/hooks';
 *
 * const { showGlobalAlert } = useGlobalAlert();
 *
 * showGlobalAlert({
 *   open: true,
 *   title: '오류',
 *   message: '에러 메시지',
 *   ok: () => console.log('확인'),
 *   close: () => console.log('닫기'),
 *   navigateTo: '/home',
 * });
 * ```
 */
const GlobalAlertModal = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useAtom(globalAlertAtom);

  // 확인 버튼 클릭 시 ok 콜백을 호출하고 모달을 닫는다. navigateTo 가 있으면 해당 경로로 이동한다.
  const handleOk = useCallback(async () => {
    const { navigateTo, ok } = alert;
    try {
      await ok?.();
    } finally {
      setAlert((prev) => ({ ...prev, open: false }));
      if (navigateTo) navigate(navigateTo);
    }
  }, [alert, setAlert, navigate]);

  // 닫기 버튼 클릭 시 close 콜백을 호출하고 모달을 닫는다. navigateTo 가 있으면 해당 경로로 이동한다.
  const handleClose = useCallback(async () => {
    const { navigateTo, close } = alert;
    try {
      await close?.();
    } finally {
      setAlert((prev) => ({ ...prev, open: false }));
      if (navigateTo) navigate(navigateTo);
    }
  }, [alert, setAlert, navigate]);

  return (
    <Modal
      className={styles.alertModal}
      disableEscapeKeyDown
      disableBackdropClick
      fullWidth
      maxWidth="xs"
      open={alert.open}
      title={alert.title}
      onClose={!alert.disableCloseIcon ? handleClose : undefined}
      actions={
        !(alert.disableOkBtn && alert.disableCloseBtn) ? (
          <Stack direction="row" spacing={1}>
            {!alert.disableOkBtn && <Button onClick={handleOk}>{alert.okText}</Button>}
            {!alert.disableCloseBtn && (
              <Button variant="outlined" onClick={handleClose}>
                {alert.closeText}
              </Button>
            )}
          </Stack>
        ) : undefined
      }
    >
      {alert.message}
    </Modal>
  );
};

export default GlobalAlertModal;
