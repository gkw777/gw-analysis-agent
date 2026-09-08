// 메인 콘텐츠 영역 래퍼 — 사이드바를 제외한 남은 폭 전체를 차지한다
import type { ReactNode } from 'react';
import styles from './Main.module.scss';

const Main = ({ children }: { children: ReactNode }) => {
  return <main className={styles.main}>{children}</main>;
};

export default Main;
