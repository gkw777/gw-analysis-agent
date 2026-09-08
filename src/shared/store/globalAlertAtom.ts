// Jotai 전역 상태 — axios unhandledrejection 등에서 띄우는 전역 Alert 모달
import type { ReactNode } from 'react';
import { atomWithReset } from 'jotai/utils';

export interface GlobalAlertState {
  /** 모달 오픈 여부 */
  open: boolean;
  /** 타이틀 */
  title?: string | ReactNode;
  /** 메시지 */
  message: string | ReactNode;
  /** 확인 버튼을 비활성화하여 사용자가 반드시 닫기 버튼을 눌러야 모달이 닫히도록 한다. */
  disableOkBtn?: boolean;
  /** 확인 버튼 콜백 */
  ok?: () => Promise<void> | void;
  /** 확인 버튼 텍스트 */
  okText?: string;
  /** 닫기 아이콘을 비활성화하여 사용자가 반드시 확인 버튼을 눌러야 모달이 닫히도록 한다. */
  disableCloseIcon?: boolean;
  /** 닫기 버튼을 비활성화하여 사용자가 반드시 확인 버튼을 눌러야 모달이 닫히도록 한다. */
  disableCloseBtn?: boolean;
  /** 닫기 버튼 콜백 */
  close?: () => Promise<void> | void;
  /** 닫기 버튼 텍스트 */
  closeText?: string;
  /** 확인 또는 닫기 버튼 클릭 시 이동할 경로. navigateTo 가 있으면 ok 또는 close 콜백이 호출된 후 해당 경로로 이동한다. */
  navigateTo?: string;
}

export const globalAlertAtom = atomWithReset<GlobalAlertState>({
  open: false,
  title: '오류',
  message: '',
  okText: '확인',
  closeText: '닫기',
  navigateTo: '',
  disableCloseIcon: false,
  disableCloseBtn: false,
  disableOkBtn: false,
});
