// 로그인 페이지 — 뼈대 단계: 백엔드 연동 전 임시 mock 로그인.
// TODO: services/authAPI.ts 를 만들어 handleLogin 의 mock 을 실제 로그인 API 호출로 교체한다.
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { authAtom } from '@/shared/store';
import { saveAuth } from '@/shared/utils';
import type { Auth } from '@/shared/types';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const setAuth = useSetAtom(authAtom);
  const [id, setId] = useState('gkw777');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!id.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    // mock 인증 — 입력한 아이디를 그대로 사용자명으로 사용한다
    const auth: Auth = { token: 'mock-token', name: id.trim(), role: '이사' };
    saveAuth(auth);
    setAuth(auth);
  };

  return (
    <Box className={styles.wrapper}>
      {/* 은은한 블러 블롭 — 배경에 깊이감을 주는 장식용 (클릭 불가) */}
      <span className={styles.blobA} aria-hidden />
      <span className={styles.blobB} aria-hidden />
      <Card className={styles.card} elevation={0}>
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <span className={styles.iconBadge}>
              <QueryStatsIcon sx={{ fontSize: 26, color: '#fff' }} />
            </span>
            <div className={styles.titleBlock}>
              <Typography variant="h5" fontWeight={700}>
                경영 분석 AI 에이전트
              </Typography>
              <Typography variant="body2" color="text.secondary">
                이사진 전용
              </Typography>
            </div>
            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}
            <TextField label="아이디" value={id} fullWidth size="small" onChange={(e) => setId(e.target.value)} />
            <TextField
              label="비밀번호"
              type="password"
              value={password}
              fullWidth
              size="small"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button variant="contained" fullWidth size="large" onClick={handleLogin}>
              로그인
            </Button>
            <Typography variant="caption" color="text.secondary">
              임시 로그인 — 아무 아이디/비밀번호나 입력하면 됩니다
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
