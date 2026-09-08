// 좌측 사이드바 영역 래퍼 — nav 등 도메인 컴포넌트를 children 으로 받는다
import type { ReactNode } from 'react';
import styles from './Sidebar.module.scss';

const Sidebar = ({ children }: { children: ReactNode }) => {
  return <aside className={styles.sidebar}>{children}</aside>;
};

export default Sidebar;
