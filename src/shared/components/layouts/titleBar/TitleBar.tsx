// 콘텐츠 컬럼 상단의 얇은 타이틀바 — GNB 가 꽉 찬 높이로 바뀌면서, 기존 전체 폭 네이비 헤더 대신
// 콘텐츠 영역 위에만 걸치는 단순한 바로 역할이 바뀌었다.
import type { ReactNode } from 'react';
import { Toolbar, Typography } from '@mui/material';
import styles from './TitleBar.module.scss';

interface TitleBarProps {
  title: ReactNode;
  /** 우측 정렬 액션 영역 — 지금은 쓰지 않지만 향후 확장(내보내기 등) 대비 유지 */
  actions?: ReactNode;
}

const TitleBar = ({ title, actions }: TitleBarProps) => (
  <Toolbar variant="dense" className={styles.titleBar}>
    <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1, letterSpacing: '-0.01em' }}>
      {title}
    </Typography>
    {actions}
  </Toolbar>
);

export default TitleBar;
