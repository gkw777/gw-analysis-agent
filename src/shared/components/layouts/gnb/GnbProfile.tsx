// GNB 맨 아래 프로필(footer) — 아바타 옆에 이름/직급을 인라인 텍스트로 노출하고,
// 클릭 시 로그아웃이 담긴 팝오버 메뉴를 보여준다.
import { useState, type MouseEvent } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Avatar, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { authAtom } from '@/shared/store';
import { saveAuth, LOGOUT_EVENT } from '@/shared/utils';
import styles from './Gnb.module.scss';

const GnbProfile = () => {
  const auth = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    saveAuth(null);
    setAuth(null);
    // feature 들이 자신의 세션 상태(메시지/보고서 등)를 리셋하도록 이벤트 발행
    window.dispatchEvent(new Event(LOGOUT_EVENT));
  };

  if (!auth) return null;

  return (
    <>
      <button
        type="button"
        className={styles.profileButton}
        onClick={(e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}
        aria-label="프로필"
      >
        <Avatar sx={{ width: 32, height: 32, fontSize: '0.85rem' }}>{auth.name.slice(0, 1)}</Avatar>
        <span className={styles.profileInfo}>
          <span className={styles.profileName}>{auth.name}</span>
          <span className={styles.profileRole}>{auth.role}</span>
        </span>
      </button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem disabled sx={{ opacity: '1 !important' }}>
          <div>
            <Typography variant="body2" fontWeight={700}>
              {auth.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {auth.role}
            </Typography>
          </div>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>로그아웃</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default GnbProfile;
