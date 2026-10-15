# 돈병상련 릴스 자동화 운영 메모

Instagram `@donbyeong.sangryeon`에 쉬운 경제 릴스를 하루 한 편씩 자동으로 올리는 구성입니다.
(비밀 값은 이 문서에 없습니다. 토큰은 로컬 `.env`와 저장소 Secrets에만 있습니다.)

## 자동 게시 (GitHub Actions)

- 워크플로: `.github/workflows/publish-reel.yml`, 스크립트: `reels-remotion/scripts/publish_queued.py`
- 실행: 15분마다(매시 7,22,37,52분) 확인하고, 마지막 게시 후 24시간이 지났을 때만 1개 게시 (24시간 간격)
  - 첫 실행이 성공하면 나머지는 "20시간 안에 이미 올렸음" 규칙으로 건너뜁니다.
  - GitHub 예약 실행은 가끔 누락/지연됩니다. 첫 예약 실행(2026-10-13 11:00 UTC, 정시)은 실제로 실행되지 않았습니다.
- **대기열** = 이 저장소의 *초안(Draft) 릴리스* `reel-<이름>`. 이름순으로 하나씩 게시하고, 올린 뒤 릴리스와 태그는 삭제됩니다.
  실패하면 초안으로 되돌아가 다음 실행에서 다시 시도합니다.
- 영상 추가: `python reels-remotion/scripts/queue_reel.py <out/날짜-순번>` (저장소 폴더에서 실행)
- 수동 실행: GitHub > Actions > publish-reel > Run workflow (dry run 체크 해제). PC 없이 휴대폰에서도 가능.
- **상태 확인**: `python reels-remotion/scripts/check_status.py`
  - 대기열, 최근 워크플로 실행, 인스타 최근 게시물(시각/링크)을 보여 줍니다.

### 게시 일정 (2026-10-14 기준 대기열 순서)

| 예정일 (20:13) | 영상 |
|---|---|
| 10/14 | 2026-10-13-001 기회비용 |
| 10/15 | 2026-10-13-002 중앙은행과 연준 |
| 10/16 | 2026-10-13-003 IPO 기업공개 |
| 10/17 | 2026-10-14-001 레버리지 |
| 10/18 | 2026-10-14-002 선물 |
| 10/19 | 2026-10-14-003 코스피와 코스닥 |

이미 게시됨: 2026-10-11-002 배당 vs 자사주 소각 (10/13), 2026-10-11-001 펀드 vs ETF (10/13).
원본 유튜브: https://youtu.be/oUDSWlsaRiU (채널 강지영의 동그라미, 제목 "슈카가 떠먹여주는 진짜 쉬운 경제 용어 특강").
이 영상에서 뽑은 주제는 모두 영상으로 만들었습니다. 새 영상을 만들려면 다른 유튜브 링크가 필요합니다.

## 토큰

- 인스타 토큰은 2026-10-12 발급, 약 60일 후 만료 → **2026-12-초 갱신 필요**.
- 갱신 후 두 곳을 모두 바꿉니다: 로컬 `D:\Claude\moneystudy\.env`(`IG_ACCESS_TOKEN`)와 저장소 Secrets(`IG_ACCESS_TOKEN`).
  Secrets 설정은 `gh secret set IG_ACCESS_TOKEN --body <값>` (파이프 입력은 줄바꿈이 섞여 실패함).

## 노션

- 페이지: https://app.notion.com/p/3f7550b01cec803388d4f8cf0c134167 ("테스트 페이지")
- 영상 목록 DB: data source `collection://966550b0-1cec-822c-b5eb-073e6670e506`
  (이전 DB `cb1550b0-…`는 휴지통이라 사용 불가)
- 열 구성(사용자가 직접 조정함 — 이 상태를 유지): 원본 영상, 유튜버, 주제, 상태, 유튜브 제목, 캡션, 파일명, 길이(초), 인스타 링크, 제작일, 해시태그, 제목
  - `인스타 업로드` 체크박스 열은 사용자가 삭제함 → 쓰지 말고 `상태`("업로드 완료")와 `인스타 링크`로 표시.
  - 제작일 형식 YYYY/MM/DD.
- 업데이트 규칙: 올라간 영상은 상태를 "업로드 완료"로, 인스타 링크를 채웁니다. 페이지의 "영상 목록과 파일명" 표도 같이 맞춥니다.
  새 영상 3편(레버리지/선물/코스피·코스닥)의 대본 토글은 페이지에 아직 없습니다.

## 영상 제작 파이프라인 (로컬 PC)

- 프로젝트: `D:\Claude\moneystudy\reels-remotion` (렌더 작업용, node_modules 포함), git 사본은 `D:\Claude\moneystudy\repo\reels-remotion`
  - 렌더링에서 바꾼 `src/` 파일은 git 사본으로 복사한 뒤 커밋합니다.
- 기획: `youtube-to-reels` 스킬 `plan.py`(Gemini, 무료 한도 하루 20회 — 한 번에 하나씩 실행). 계획 파일은 `reels-remotion/plans/`.
- 음성: `export_remotion.py` → qwen3-tts(CPU, 영상 한 편에 약 10~15분).
- 렌더: `npx remotion render src/index.ts Reel-<이름> out/<이름>.mp4`, 썸네일: `npx remotion still ... Thumb-<이름> --frame=110`.
- 화면 하단(viewBox y≈590 아래)은 제목 카드에 가려지므로 라벨은 그 위에 둡니다.
