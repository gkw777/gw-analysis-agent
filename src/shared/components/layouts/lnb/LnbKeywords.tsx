// 키워드 섹션 — 관련 키워드를 칩 형태로 노출한다.
import { Chip } from '@mui/material';
import { useKeywords } from '@/shared/hooks';
import LnbSection from './LnbSection';
import styles from './Lnb.module.scss';

const LnbKeywords = () => {
  const keywords = useKeywords();

  return (
    <LnbSection title="키워드">
      <div className={styles.keywordList}>
        {keywords.map((keyword) => (
          <Chip key={keyword} label={keyword} size="small" className={styles.keywordChip} />
        ))}
      </div>
    </LnbSection>
  );
};

export default LnbKeywords;
