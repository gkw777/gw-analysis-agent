// 페이지 골격 — 사이드바(꽉 찬 높이) + 콘텐츠 컬럼(헤더/메인 세로 배치)를 담당하는 범용 레이아웃.
// 헤더/사이드바는 슬롯으로 받아 조립하고, 콘텐츠는 children 으로 Main 영역에 채운다.
import type { ReactNode } from 'react';
import styles from './AppLayout.module.scss';
import { Main, Sidebar } from '@/shared/components/layouts';

interface AppLayoutProps {
  sidebar?: ReactNode;
  children: ReactNode;
}

const AppLayout = ({ sidebar, children }: AppLayoutProps) => {
  return (
    <div className={styles.layout}>
      {sidebar && <Sidebar>{sidebar}</Sidebar>}
      <div className={styles.contentColumn}>
        <Main>{children}</Main>
      </div>
    </div>
  );
};

export default AppLayout;
