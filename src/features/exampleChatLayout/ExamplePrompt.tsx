// 예제 분석 프롬프트 화면 — PromptLayout 셸 위에 실제 입력 상태와 메시지 목록을 조립한 구현체.

import { useState, useRef, useLayoutEffect, useEffect, type KeyboardEvent } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { PromptLayout, PromptIntro } from '@/shared/components/layouts';
import { Input } from '@/shared/components/commons';
import { useSmoothScroll } from '@/shared/hooks';
import styles from './ExamplePrompt.module.scss';

interface IExamplePromptMessage {
  id: string;
  text: string;
}

const ExamplePrompt = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<IExamplePromptMessage[]>([]);

  const { scrollRef, scrollToTarget } = useSmoothScroll();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [dummySpacerHeight, setDummySpacerHeight] = useState(0);

  const canSubmit = value.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: value.trim() }]);
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  // 마지막 질의를 상단에 고정하려면 그 아래로 "한 화면만큼"의 스크롤 여유가 필요한데,
  // 질문 버블 하나는 컨테이너보다 훨씬 작아서(답변은 ReportPanel 에 별도 표시) 그 여유가 없다.
  // 그래서 부족한 만큼 더미 여백을 깐다. 이때 여백을 딱 부족분만큼만 두는 게 핵심 — 그래야
  // "스크롤을 끝까지 내렸을 때 도달하는 위치 = 마지막 질의가 상단에 붙는 위치"가 되어,
  // 수동으로 끝까지 내려도 질의가 상단 밖으로 밀려 올라가지 않는다.
  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    const contentEl = contentRef.current;
    const lastEl = lastMessageRef.current;
    if (!scrollEl || !contentEl || !lastEl) {
      setDummySpacerHeight(0);
      return;
    }
    const { paddingBottom } = getComputedStyle(contentEl);
    const room = scrollEl.clientHeight - parseFloat(paddingBottom) - lastEl.offsetHeight;
    setDummySpacerHeight(Math.max(0, room));
  }, [messages, scrollRef]);

  useEffect(() => {
    const target = lastMessageRef.current;
    if (!target) return;
    const raf = requestAnimationFrame(() => scrollToTarget(target));
    return () => cancelAnimationFrame(raf);
  }, [messages, scrollToTarget]);

  return (
    <section className={`${styles.left} ${styles.leftFull}`}>
      <PromptLayout
        centered={messages.length === 0}
        scrollRef={scrollRef}
        input={
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="분석하고 싶은 내용을 입력하세요..."
            multiline
            minRows={1}
            maxRows={6}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
            }}
          />
        }
        trailingActions={
          <IconButton
            aria-label="전송"
            disabled={!canSubmit}
            onClick={handleSubmit}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: 'primary.main',
              color: '#fff',
              '&:hover': { bgcolor: 'primary.light' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        }
      >
        {messages.length === 0 ? (
          <PromptIntro
            icon={<QueryStatsIcon />}
            title="예제 분석 자동화에 방문하신 것을 환영합니다."
            description="서비스를 사용할 때 민감 정보 취급에 유의해 주세요."
            notices={['AI로부터 생성된 정보는 부정확할 수 있습니다.']}
          />
        ) : (
          // 스크롤은 PromptLayout(.body)이 소유하므로, 이 Stack 은 좌우/상하 여백만 담당하는
          // 콘텐츠 컨테이너다. contentRef 는 dummySpacerHeight 계산 시 paddingBottom 을 읽는 용도.
          <Stack ref={contentRef} sx={{ px: 2.5, py: 1.25 }}>
            {messages.map((message, index) => (
              // 메시지 간격을 Stack spacing(margin) 이 아니라 각 wrapper 의 padding 으로 준다.
              // 스크롤 목표가 wrapper 의 top 이므로, 여백이 wrapper 안에 있어야 위쪽 메시지가
              // 완전히 잘리면서도 상단에 숨쉴 공간이 남는다. margin 이면 그만큼 이전 메시지가 딸려 보인다.
              <Box
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                sx={{ display: 'flex', justifyContent: 'flex-end', py: 1.25, flexShrink: 0 }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    px: 2,
                    py: 1.25,
                    borderRadius: 2.5,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Box>
              </Box>
            ))}
            <Box sx={{ height: dummySpacerHeight, flexShrink: 0 }} />
          </Stack>
        )}
      </PromptLayout>
    </section>
  );
};

export default ExamplePrompt;
