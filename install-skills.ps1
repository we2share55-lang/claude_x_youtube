<#
.SYNOPSIS
  이 저장소의 skills\ 를 ~/.claude/skills 로 설치(복사)한다. (다른 PC 설정용)

.DESCRIPTION
  저장소를 clone 한 PC에서 실행하면, skills\ 아래 폴더들을
  ~/.claude/skills\ 로 복사해 Claude Code 가 인식하도록 한다.
  API 키는 저장소에 없으므로, 실행 후 그 PC에 GEMINI_API_KEY 를 따로 설정해야 한다.

.EXAMPLE
  .\install-skills.ps1
#>
$ErrorActionPreference = "Stop"

$RepoRoot   = $PSScriptRoot
$RepoSkills = Join-Path $RepoRoot "skills"
$DstSkills  = Join-Path $env:USERPROFILE ".claude\skills"

if (-not (Test-Path $RepoSkills)) {
    throw "저장소에 skills 폴더가 없습니다: $RepoSkills"
}
New-Item -ItemType Directory -Force -Path $DstSkills | Out-Null

$skills = Get-ChildItem -Path $RepoSkills -Directory | Select-Object -ExpandProperty Name
foreach ($name in $skills) {
    $src = Join-Path $RepoSkills $name
    $dst = Join-Path $DstSkills  $name
    Write-Host "설치: $name -> ~/.claude/skills/$name" -ForegroundColor Cyan
    robocopy $src $dst /MIR /XD "__pycache__" /XF "*.pyc" /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy 실패 ($name), 종료코드 $LASTEXITCODE" }
}

Write-Host "`n설치 완료. 남은 준비물:" -ForegroundColor Green
Write-Host "  1) GEMINI_API_KEY 환경변수 설정"
Write-Host '     [Environment]::SetEnvironmentVariable("GEMINI_API_KEY","키값","User")'
Write-Host "  2) pip install -U google-genai youtube-transcript-api"
Write-Host "  3) (youtube-digest 사용 시) yt-dlp, ffmpeg 설치"
