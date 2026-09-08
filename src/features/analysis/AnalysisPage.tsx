// 분석 화면 콘텐츠 — 좌측 GNB 는 shared/components/layouts/appShell 에서 제공하므로,
// 여기는 채팅/보고서 분할뷰 콘텐츠만 렌더링한다. (revenue-agent/frontend 의 분할뷰 패턴을 이식)
// 타이틀바는 대화 시작 전 첫 화면(빈 상태)에는 없고, 분할뷰로 전환된 뒤에만 상단에 노출한다.
import { useAtomValue } from 'jotai';
import { Group, Panel, Separator, useDefaultLayout } from 'react-resizable-panels';
import { selectedAgentAtom } from '@/shared/store';
import { AGENTS } from '@/shared/constants';
import { TitleBar } from '@/shared/components/layouts';
import { splitViewAtom } from '@/features/analysis/store';
import AnalysisPrompt from '@/features/analysis/components/AnalysisPrompt';
import ReportPanel from '@/features/analysis/components/report/ReportPanel';
import { useConversationReset } from '@/features/analysis/hooks';
import styles from './AnalysisPage.module.scss';

const AnalysisPage = () => {
  const splitView = useAtomValue(splitViewAtom);
  const selectedAgent = useAtomValue(selectedAgentAtom);
  const agentLabel = AGENTS.find((a) => a.id === selectedAgent)?.label ?? '';

  // GNB "새 채팅" 클릭 · 로그아웃 · 토큰 만료 시 대화를 비우고 첫 화면으로 되돌린다
  useConversationReset();

  // 좌/우 분할 비율을 로컬스토리지에 기억해 새로고침해도 유지한다
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'analysis-agent-split',
    storage: localStorage,
  });

  return splitView ? (
    <div className={styles.splitPage}>
      <TitleBar title={`${agentLabel} AI 에이전트`} />
      <Group
        orientation="horizontal"
        className={styles.split}
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
      >
        <Panel id="chat" defaultSize="42%" minSize="28%" className={styles.panel}>
          <section className={styles.left}>
            <AnalysisPrompt />
          </section>
        </Panel>
        <Separator className={styles.resizeHandle}>
          <span className={styles.resizeGrip} />
        </Separator>
        <Panel id="report" minSize="30%" className={styles.panel}>
          <section className={styles.right}>
            <ReportPanel />
          </section>
        </Panel>
      </Group>
    </div>
  ) : (
    <section className={`${styles.left} ${styles.leftFull}`}>
      <AnalysisPrompt />
    </section>
  );
};

export default AnalysisPage;
