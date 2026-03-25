# CLAUDE.md — pure-flon-website (AI Product Factory)

## Mission
AI Product Factory: 게임/밈/퀴즈 콘텐츠를 빠르게 만들어서 트래픽 → 수익화.
디자인 문서: `~/.gstack/projects/pure-flon-aurora/ben-main-design-20260325-163349.md`

## 배포
- Platform: Vercel
- Regions: icn1, nrt1, hnd1, sin1 (아시아 최적화)
- 배포: `git push` → 자동 배포
- URL: pure-flon.com

## 수익 채널 (2026-03-25 세팅 완료)

| 채널 | URL | 상태 | 용도 |
|------|-----|------|------|
| GitHub Sponsors | github.com/sponsors/pure-flon | 활성 | 월간 후원 (OSS) |
| Ko-fi | ko-fi.com/pureflon | 활성 | 마이크로 후원 |
| PayPal | paypal.me/pureflon | 활성 | 직접 결제 |
| Gumroad | — | 미가입 | 템플릿/보고서 판매 (추후) |
| AdSense | — | 미신청 | 트래픽 기반 광고 (P0 신청 필요) |
| Stripe | — | 미연동 | 인앱 프리미엄 해제 (추후) |

크리덴셜: `~/Documents/CREDENTIALS_VAULT/README.md` (chmod 0600)
채널 JSON: `~/.aurora/revenue_channels.json` (chmod 0600)

## 라이브 제품

| 제품 | URL | 배포일 | 상태 |
|------|-----|--------|------|
| AI 스무고개 | /games/twenty-questions/ | 2026-03-25 | LIVE |
| 밈 퀴즈 | /games/meme-quiz/ | — | PLANNED |
| 스피드 퀴즈 | /games/speed-quiz/ | — | PLANNED |

## Kill/Scale 기준

| 판정 | 기준 (2주 후) |
|------|---------------|
| Kill | PV < 500 AND 수익 $0 → 유지비 0으로 방치 |
| Hold | 중간 성과 → 1주 더 관찰 |
| Scale | PV > 2,000 OR 수익 > $10 → SEO + 소셜 프로모션 |

Kill 전 Layer 2 개선 1회 필수 (A/B 변형 테스트 후 최종 판정).

## 피드백 루프 (3-Layer)

- **L1**: 일일 GA4 수집 (PV, 이탈률, 체류시간)
- **L2**: Kill 전 1회 진단+개선 (헤드라인/CTA/수익화 변형)
- **L3**: Post-Mortem DB (사인+원인+교훈 → 다음 제품 반영)

## Sprint (gstack)
1. /office-hours — 제품 방향 점검
2. /plan-design-review — 디자인 스코어
3. Build (game/quiz/meme)
4. /review — pre-landing 코드 리뷰
5. /qa-only — QA 보고
6. Deploy (git push)
7. Measure (GA4 + traffic)
8. Kill/Scale (2주 후)

## TODO

### P0 (이번 주)
- [ ] GA4 스크립트 삽입 (모든 게임 페이지)
- [ ] AdSense 신청 (승인 2-4주)
- [ ] AI 스무고개 트래픽 소스 확보 (Reddit/Twitter 공유)
- [ ] 2번째 게임: 밈 퀴즈 배포

### P1 (다음 주)
- [ ] AI 스무고개 Kill/Scale 판정 (배포 2주 후)
- [ ] 3번째 게임 배포
- [ ] 수익화 인프라: AdSense 또는 대안 (Carbon Ads)
- [ ] Ko-fi/PayPal 후원 버튼 게임 페이지에 삽입

### P2 (월 단위)
- [ ] Gumroad 가입 → 템플릿 판매
- [ ] Stripe 연동 → 인앱 프리미엄 해제
- [ ] 다국어 (영어) → Scale 제품에만 적용
- [ ] 게임 10개 달성 → 포트폴리오 효과
