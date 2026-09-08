// 좌측 LNB — 로고 / 새 채팅 / 핵심질문 / 키워드 / 임계설정 / 사용자정보(footer)로 구성된 패널형 사이드바.
// 각 섹션 사이는 Divider 로 구분한다. (기존 64px 아이콘 전용 레일에서 넓은 패널로 확장)
import { useAtomValue } from 'jotai';
import { Link, useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import { NEW_CONVERSATION_EVENT } from '@/shared/utils';
import { Button } from '@/shared/components/commons';
import { selectedAgentAtom } from '@/shared/store';
import { AGENTS } from '@/shared/constants';
import { routePaths } from '@/routers/paths';
// 아래 세 섹션은 scrollArea 의 JSX 와 함께 잠시 꺼둔 상태다.
// 되살릴 때 이 import 들도 같이 주석을 푼다. (import 만 살려두면 typecheck 가 미사용으로 잡는다)
// import LnbCoreQuestions from './LnbCoreQuestions';
// import LnbKeywords from './LnbKeywords';
// import LnbThresholdSettings from './LnbThresholdSettings';
import LnbProfile from './LnbProfile';
import styles from './Lnb.module.scss';

const Lnb = () => {
  const navigate = useNavigate();
  const selectedAgent = useAtomValue(selectedAgentAtom);
  const agent = AGENTS.find((a) => a.id === selectedAgent);
  const AgentIcon = agent?.icon;

  const handleNewConversation = () => {
    navigate(routePaths.analysis);
    window.dispatchEvent(new Event(NEW_CONVERSATION_EVENT));
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        {AgentIcon && <AgentIcon fontSize="small" />}
        <span>{agent?.label ?? ''}</span>
      </div>

      <Link to={routePaths.dashboard} className={styles.dashboardMenuItem}>
        <SpaceDashboardOutlinedIcon fontSize="small" />
        대시보드
      </Link>

      <Button
        fullWidth
        startIcon={<AddCommentOutlinedIcon fontSize="small" />}
        onClick={handleNewConversation}
        className={styles.newChatButton}
      >
        새 채팅
      </Button>

      <Divider />

      <div className={styles.scrollArea}>
        {/* <LnbCoreQuestions />
        <Divider />
        <LnbKeywords />
        <Divider />
        <LnbThresholdSettings /> */}
      </div>

      <Divider />

      <LnbProfile />
    </nav>
  );
};

export default Lnb;
