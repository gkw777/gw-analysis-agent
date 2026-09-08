// 좌측 GNB — 로고 / 새 채팅 / 핵심질문 / 키워드 / 임계설정 / 사용자정보(footer)로 구성된 패널형 사이드바.
// 각 섹션 사이는 Divider 로 구분한다. (기존 64px 아이콘 전용 레일에서 넓은 패널로 확장)
import { useAtomValue } from 'jotai';
import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import { NEW_CONVERSATION_EVENT } from '@/shared/utils';
import { Button } from '@/shared/components/commons';
import { selectedAgentAtom } from '@/shared/store';
import { AGENTS } from '@/shared/constants';
import { routePaths } from '@/routers/paths';
import GnbCoreQuestions from './GnbCoreQuestions';
import GnbKeywords from './GnbKeywords';
import GnbThresholdSettings from './GnbThresholdSettings';
import GnbProfile from './GnbProfile';
import styles from './Gnb.module.scss';

const Gnb = () => {
  const selectedAgent = useAtomValue(selectedAgentAtom);
  const agent = AGENTS.find((a) => a.id === selectedAgent);
  const AgentIcon = agent?.icon;

  const handleNewConversation = () => {
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
        <GnbCoreQuestions />
        <Divider />
        <GnbKeywords />
        <Divider />
        <GnbThresholdSettings />
      </div>

      <Divider />

      <GnbProfile />
    </nav>
  );
};

export default Gnb;
