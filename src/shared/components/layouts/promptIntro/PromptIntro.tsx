// 첫 챗 화면(빈 상태)의 인트로 블록 — PromptLayout 의 children 슬롯에 넣어 쓰는 공통 컴포넌트.
// 아이콘/타이틀/설명/안내문구(notices)를 서비스별로 props 로 주입해 재사용한다.
import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import styles from './PromptIntro.module.scss';

interface PromptIntroProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  notices?: string[];
}

const PromptIntro = ({ icon, title, description, notices }: PromptIntroProps) => (
  <div className={styles.intro}>
    <div className={styles.body}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </div>
    {notices && notices.length > 0 && (
      <div className={styles.notices}>
        {notices.map((notice) => (
          <Typography key={notice} variant="caption" className={styles.notice}>
            {notice}
          </Typography>
        ))}
      </div>
    )}
  </div>
);

export default PromptIntro;
