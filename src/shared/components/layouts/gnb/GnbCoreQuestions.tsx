// 핵심 질문 섹션 — 기존 대화내역(GnbHistory) 팝오버를 대체.
// 클릭 시 로컬 선택 상태만 하이라이트한다. 실제 질의 전송 연동은 이번 범위 밖(향후 별도 작업).
import { useState } from 'react';
import classNames from 'classnames';
import { useCoreQuestions } from '@/shared/hooks';
import GnbSection from './GnbSection';
import styles from './Gnb.module.scss';

const GnbCoreQuestions = () => {
  const coreQuestions = useCoreQuestions();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const activeIndex = selectedIndex ?? coreQuestions.length - 1;

  return (
    <GnbSection title="핵심 질문">
      <ul className={styles.questionList}>
        {coreQuestions.map((question, index) => (
          <li key={question}>
            <button
              type="button"
              className={classNames(styles.questionItem, index === activeIndex && styles.questionItemActive)}
              onClick={() => setSelectedIndex(index)}
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </GnbSection>
  );
};

export default GnbCoreQuestions;
