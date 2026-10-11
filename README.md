# moneystudy

쉬운 경제 공부 릴스 프로젝트 (인스타그램 계정 "돈병상련").
경제 내용을 정리하고(노션), 그 내용으로 60초 이내 세로 릴스를 만듭니다.

## 구성

| 경로 | 내용 |
|------|------|
| [`reels-remotion`](reels-remotion) | Remotion 프로젝트: 한글 폰트 Jua, 코드로 그린 만화 일러스트, 동전 캐릭터, 단어 하이라이트 자막, 썸네일 |
| [`reels-remotion/plans`](reels-remotion/plans) | 만든 영상의 대본(plan) 파일. 영상 파일명은 `YYYY-MM-DD-NNN` |

## 만드는 순서 (요약)

1. 유튜브 소스 분석·기획: `plan.py` (Gemini가 영상 분석, 일시적 오류는 재시도)
2. 음성(복제) + 타임라인: `export_remotion.py`
3. Remotion으로 영상·썸네일 렌더
4. 캡션 작성 → 인스타그램 업로드

유튜브 읽기, 음성, 릴스 제작 스킬은 별도 저장소 **`youtube-skills`** 에 있습니다 (어떤 주제 프로젝트에서도 공통으로 사용).

## 준비물

- `youtube-skills` 저장소를 받아 `.\install-skills.ps1` 실행 (스킬이 `~/.claude/skills`에 설치됨)
- Node 20+, `reels-remotion`에서 `npm i`, Remotion 스킬: `npx skills add remotion-dev/skills -g -a claude-code -y`
- 환경변수 `GEMINI_API_KEY`
- 본인 참조 음성(`ref_voice.wav/txt`)은 저장소에 없습니다. 각 PC에서 직접 넣습니다.

## 공개 저장소 주의

참조 음성, 원본 얼굴 사진, 토큰/키는 올리지 않습니다 (`.gitignore` 참고).
