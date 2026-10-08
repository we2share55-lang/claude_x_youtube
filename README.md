# claude_x_youtube

Claude Code용 유튜브 기반 워크플로우(스킬) 모음.

## 스킬

| 스킬 | 설명 |
|------|------|
| [`skills/watch-youtube`](skills/watch-youtube) | Gemini 영상 이해 API로 유튜브 영상을 분석(요약·타임스탬프·Q&A). 자막 폴백 포함. 기본 모델 `gemini-3.8-flash`. |
| [`skills/youtube-digest`](skills/youtube-digest) | 유튜브 링크 → 자막·핵심 장면·5줄 요약. 자막이 부족하면 watch-youtube(Gemini 영상 분석)로 폴백. |
| [`skills/value-investing-coach`](skills/value-investing-coach) | 버핏식 가치투자 관점의 기업 분석·자료 요약을 돕는 교육용 비서. 작업 절차 + 검수 체크리스트 내장. |

## 요구사항

- Python 패키지: `google-genai`, `youtube-transcript-api`
- 환경변수: `GEMINI_API_KEY` (또는 `GOOGLE_API_KEY`). **키 값은 저장소에 커밋하지 말 것** — 환경변수로만 관리.

## 설치

`skills/` 아래 각 폴더를 `~/.claude/skills/` 로 복사하면 Claude Code에서 사용할 수 있습니다.
