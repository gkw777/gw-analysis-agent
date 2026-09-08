// 프롬프트 기반 화면(AI 채팅/에이전트 대화 등)의 범용 골격 — 다른 서비스에서도 그대로 재사용 가능하도록
// 대화/결과 영역과, 입력창 + 좌측 보조 액션 + 우측 전송 액션으로 구조화된 하단 프롬프트 바를 슬롯으로 제공하는
// 순수 프레젠테이셔널 레이아웃. 상태나 제출 로직은 갖지 않으며, 사용하는 쪽(feature)이 각 슬롯에 실제 입력
// 컨트롤과 버튼을 조립해 넣는다.
import type { ReactNode, RefObject } from 'react';
import classNames from 'classnames';
import styles from './PromptLayout.module.scss';

interface PromptLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  input: ReactNode;
  leadingActions?: ReactNode;
  trailingActions?: ReactNode;
  /** true 면 대화 시작 전 빈 상태처럼 body+입력창을 하나의 블록으로 묶어 화면 중앙에 배치한다
   * (입력창이 하단에 고정되지 않고 인트로 바로 아래로 올라온다) */
  centered?: boolean;
  /** 스크롤 컨테이너(.body)에 접근하기 위한 ref. useSmoothScroll 의 scrollRef 를 그대로 전달한다. */
  scrollRef?: RefObject<HTMLDivElement>;
}

const PromptLayout = ({
  header,
  children,
  input,
  leadingActions,
  trailingActions,
  centered,
  scrollRef,
}: PromptLayoutProps) => {
  return (
    <div className={classNames(styles.layout, centered && styles.centered)}>
      {header}
      <div ref={scrollRef} className={classNames(styles.body, centered && styles.bodyCentered)}>
        <div className={classNames(styles.bodyInner, centered && styles.bodyInnerCentered)}>{children}</div>
      </div>
      <div className={classNames(styles.promptBar, centered && styles.promptBarCentered)}>
        <div className={styles.promptBarInner}>
          <div className={styles.promptCard}>
            <div className={styles.inputRow}>{input}</div>
            <div className={styles.toolbarRow}>
              <div className={styles.leadingActions}>{leadingActions}</div>
              <div className={styles.trailingActions}>{trailingActions}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptLayout;
