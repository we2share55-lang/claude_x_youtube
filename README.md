# claude_x_youtube

Claude Code용 유튜브 기반 워크플로우(스킬)와 릴스 제작 프로젝트 모음.

## 스킬

| 스킬 | 설명 |
|------|------|
| [`skills/watch-youtube`](skills/watch-youtube) | Gemini 영상 이해 API로 유튜브 영상을 분석(요약·타임스탬프·Q&A). 자막 폴백 포함. 기본 모델 `gemini-3.5-flash`. |
| [`skills/youtube-digest`](skills/youtube-digest) | 유튜브 링크 → 자막·핵심 장면·5줄 요약. |
| [`skills/youtube-to-reels`](skills/youtube-to-reels) | 유튜브 링크 → 60초 이내 세로 릴스(mp4) + 썸네일 + 캡션. Gemini로 핵심 정리, 복제 음성 나레이션, Remotion 렌더. |
| [`skills/qwen3-tts`](skills/qwen3-tts) | Qwen3-TTS 음성 복제(CPU 가능) CLI. youtube-to-reels의 음성 단계. |
| [`skills/value-investing-coach`](skills/value-investing-coach) | 버핏식 가치투자 관점의 교육용 비서. |
| `skills/notion-*` (4개) | Notion 연동 문서화·리서치·회의·스펙 스킬. |

## 릴스 프로젝트

[`reels-remotion`](reels-remotion): Remotion 프로젝트 (한글 폰트 Jua, 코드로 그린 만화 일러스트, 동전 캐릭터, 단어 하이라이트 자막).
`plans/`에 만든 영상의 대본(plan) 파일이 있습니다. 영상 파일명은 `YYYY-MM-DD-NNN`.

## 요구사항

- Python: `google-genai`, `youtube-transcript-api`, `pillow`, `numpy`, `imageio-ffmpeg`, `faster-whisper`
- Node 20+, `reels-remotion`에서 `npm i`, Remotion 스킬: `npx skills add remotion-dev/skills -g -a claude-code -y`
- 환경변수: `GEMINI_API_KEY` (키 값은 저장소에 커밋하지 말 것)

## 저장소에 일부러 넣지 않은 것 (공개 저장소)

- **참조 음성**(`ref_voice.wav/txt`)과 **원본 캐릭터 사진**: 본인 자료는 각 PC에서 직접 넣습니다 (`skills/youtube-to-reels/assets/`).
- 인스타그램 토큰/계정 ID, API 키 등 비밀값 (`.env`는 `.gitignore`).

## 설치 / 동기화

- 다른 PC: `git clone` → `.\install-skills.ps1` (남은 준비물 안내가 출력됩니다)
- 스킬을 고친 뒤: `.\sync-skills.ps1` (`~/.claude/skills` → 저장소 복사 → 커밋 → push)