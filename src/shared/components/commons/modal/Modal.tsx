// MUI Dialog 를 감싸는 공용 모달 wrapper — title/actions 슬롯과 닫기(X) 버튼을 표준화한다.
// onClose 는 MUI 의 (event, reason) 시그니처 대신 단순 콜백으로 좁혀 호출부를 간결하게 한다.
// 확장 포인트: 추후 권한·조건 로직(예: role 별 표시 제한)을 이 파일에 추가하면 전 화면에 일괄 적용된다.
import { useCallback, type ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  type DialogProps as MuiDialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface IModalProps extends Omit<MuiDialogProps, 'onClose' | 'title'> {
  /** 모달 상단 제목 영역 */
  title?: ReactNode;
  /** 모달 하단 버튼 영역 (DialogActions 로 렌더링) */
  actions?: ReactNode;
  /** 닫기 콜백 — 백드롭 클릭/ESC/X 버튼 모두 이 콜백 하나로 전달된다 */
  onClose?: () => void;
  /**   모달 닫기 방지 옵션 — ESC 키 입력 시 모달이 닫히지 않도록 한다.   */
  disableEscapeKeyDown?: boolean;
  /**   모달 닫기 방지 옵션 — 백드롭 클릭 시 모달이 닫히지 않도록 한다.   */
  disableBackdropClick?: boolean;
}

const Modal = ({
  title,
  actions,
  onClose,
  children,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  ...props
}: IModalProps) => {
  const handleClose = useCallback(
    (_: React.MouseEvent<HTMLButtonElement>, reason?: 'backdropClick' | 'escapeKeyDown') => {
      if (disableBackdropClick && reason === 'backdropClick') return;

      onClose?.();
    },
    [disableBackdropClick, onClose]
  );

  return (
    <Dialog disableEscapeKeyDown={disableEscapeKeyDown} fullWidth maxWidth="sm" onClose={handleClose} {...props}>
      {(title || onClose) && (
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: title ? 'space-between' : 'flex-end', pr: 1.5 }}
        >
          {title}
          {onClose && (
            <IconButton aria-label="닫기" size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default Modal;
