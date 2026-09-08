// 임계 설정 섹션 — 금액형/비율형/지수형 그룹별로 토글 가능한 pill 버튼을 노출한다.
// 그룹당 단일 선택(로컬 상태) — 실제 임계값 적용 로직은 이번 범위 밖.
import { useState } from 'react';
import classNames from 'classnames';
import { Typography } from '@mui/material';
import { useThresholdGroups } from '@/shared/hooks';
import LnbSection from './LnbSection';
import styles from './Lnb.module.scss';

const LnbThresholdSettings = () => {
  const thresholdGroups = useThresholdGroups();
  const [selected, setSelected] = useState<Record<number, number | null>>({});

  const handleToggle = (groupIndex: number, optionIndex: number) => {
    setSelected((prev) => ({
      ...prev,
      [groupIndex]: prev[groupIndex] === optionIndex ? null : optionIndex,
    }));
  };

  return (
    <LnbSection title="임계 설정">
      <div className={styles.thresholdGroups}>
        {thresholdGroups.map((group, groupIndex) => (
          <div key={group.label} className={styles.thresholdGroup}>
            <Typography variant="caption" className={styles.thresholdGroupLabel}>
              {group.label}
            </Typography>
            <div className={styles.thresholdOptions}>
              {group.options.map((option, optionIndex) => (
                <button
                  key={option}
                  type="button"
                  className={classNames(styles.thresholdOption, selected[groupIndex] === optionIndex && styles.thresholdOptionActive)}
                  onClick={() => handleToggle(groupIndex, optionIndex)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LnbSection>
  );
};

export default LnbThresholdSettings;
