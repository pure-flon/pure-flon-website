# 🚀 Pure-Flon PTFE 튜브 웹사이트

<div align="center">
  <img src="images/logo.svg" alt="Pure-Flon Logo" width="200" height="60"/>
  
  **동아시아 시장을 선도하는 프리미엄 산업용 PTFE 튜브 제조업체**
  
  [![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://pure-flon.com)
  [![Lighthouse](https://img.shields.io/badge/lighthouse-95%2B-brightgreen)](https://pagespeed.web.dev/)
  [![Version](https://img.shields.io/badge/version-3.0.0-blue)](https://github.com/pure-flon/website)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
  [![PWA](https://img.shields.io/badge/PWA-enabled-purple)](https://web.dev/pwa/)
</div>

## 📋 목차

- [🎯 프로젝트 소개](#-프로젝트-소개)
- [✨ 주요 기능](#-주요-기능)
- [🛠️ 기술 스택](#️-기술-스택)
- [🚀 빠른 시작](#-빠른-시작)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🎨 디자인 시스템](#-디자인-시스템)
- [🔧 개발 가이드](#-개발-가이드)
- [📊 성능 및 SEO](#-성능-및-seo)
- [🌐 다국어 지원](#-다국어-지원)
- [📱 PWA 기능](#-pwa-기능)
- [🧪 테스트](#-테스트)
- [🚀 배포](#-배포)
- [🤝 기여하기](#-기여하기)
- [📞 지원](#-지원)

## 🎯 프로젝트 소개

Pure-Flon은 의료용, 반도체용, 화학용 PTFE 튜브를 제조하는 동아시아 선도 기업입니다. 이 웹사이트는 고객들에게 최고의 사용자 경험을 제공하며, 실시간 3D 제품 구성기와 견적 시스템을 통해 효율적인 비즈니스 프로세스를 구현합니다.

### 🎪 라이브 데모
- **프로덕션**: [https://pure-flon.com](https://pure-flon.com)
- **스테이징**: [https://staging.pure-flon.com](https://staging.pure-flon.com)
- **개발**: [https://dev.pure-flon.com](https://dev.pure-flon.com)

## ✨ 주요 기능

### 🎯 3D 제품 구성기
- **실시간 3D 시각화**: Three.js 기반 PTFE 튜브 3D 모델
- **인터랙티브 설정**: 내경, 벽두께, 길이 실시간 조정
- **즉석 가격 계산**: 설정 변경 시 실시간 가격 업데이트
- **스마트 추천**: AI 기반 최적 사양 제안

### 📋 지능형 견적 시스템
- **원클릭 견적**: 3D 구성기에서 바로 견적 요청
- **자동 데이터 수집**: 사용자 설정 자동 전달
- **실시간 알림**: 24시간 내 응답 보장
- **오프라인 지원**: 네트워크 오류 시 로컬 저장

### 🌍 글로벌 시장 지원
- **9개 언어**: 한국어, 일본어, 영어, 중국어(간체/번체), 태국어, 베트남어, 인도네시아어, 말레이시아어
- **지역별 맞춤**: 현지 규격 및 인증 정보 제공
- **현지 지원팀**: 각 지역별 전문 기술팀 연결

### 📱 PWA 기능
- **오프라인 지원**: Service Worker 기반 오프라인 브라우징
- **앱 설치**: 모바일/데스크톱 앱처럼 설치 가능
- **푸시 알림**: 견적 상태 및 신제품 정보 알림
- **백그라운드 동기화**: 오프라인 데이터 자동 동기화

## 🛠️ 기술 스택

### 🎨 프론트엔드
- **HTML5**: 시맨틱 마크업 및 웹 표준 준수
- **CSS3**: 모던 CSS (Grid, Flexbox, Custom Properties)
- **Vanilla JavaScript**: 프레임워크 없는 순수 JavaScript
- **Three.js**: 3D 그래픽 및 제품 시각화
- **Web APIs**: Intersection Observer, Web Workers, IndexedDB

### 🔧 백엔드 & 데이터베이스
- **Supabase**: PostgreSQL 기반 백엔드 서비스
- **Vercel Functions**: 서버리스 API 엔드포인트
- **PostgreSQL**: 견적 및 고객 데이터 저장
- **Redis**: 캐싱 및 세션 관리

### 🚀 배포 및 인프라
- **Vercel**: 메인 호스팅 플랫폼
- **Cloudflare**: CDN 및 보안
- **GitHub Actions**: CI/CD 파이프라인
- **Lighthouse CI**: 자동 성능 모니터링

### 📊 분석 및 모니터링
- **Google Analytics 4**: 웹 분석
- **Microsoft Clarity**: 사용자 행동 분석
- **Sentry**: 에러 추적 및 모니터링
- **Vercel Analytics**: 실시간 성능 지표

## 🚀 빠른 시작

### 📋 사전 요구사항
- **Node.js**: 18.0.0 이상
- **npm**: 8.0.0 이상
- **Git**: 최신 버전
- **Python**: 3.8+ (로컬 서버용)

### 🔧 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/pure-flon/website.git
cd pure-flon-website

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 실제 값으로 수정

# 4. 개발 서버 실행
npm run dev
# 또는
python -m http.server 8000

# 5. 브라우저에서 확인
open http://localhost:8000
```

### 🔑 환경 변수 설정

```bash
# .env.local 파일 생성
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MICROSOFT_CLARITY_ID=your-clarity-id
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📁 프로젝트 구조

```
pure-flon-website/
├── 📄 index.html              # 메인 페이지
├── 📄 sw.js                   # Service Worker
├── 📄 robots.txt              # SEO 크롤러 가이드
├── 📄 sitemap.xml             # 사이트맵
├── 📄 site.webmanifest        # PWA 매니페스트
├── 📁 css/
│   └── 📄 main.css            # 통합 스타일시트
├── 📁 js/
│   └── 📄 main.js             # 통합 JavaScript
├── 📁 images/
│   ├── 📄 logo.svg            # 로고
│   └── 📁 products/           # 제품 이미지
├── 📁 products/
│   ├── 📄 medical.html        # 의료용 제품
│   ├── 📄 semiconductor.html  # 반도체용 제품
│   └── 📄 chemical.html       # 화학용 제품
├── 📁 api/                    # Vercel Functions
├── 📁 tests/                  # 테스트 파일
└── 📁 scripts/                # 빌드 스크립트
```

## 🎨 디자인 시스템

### 🎨 색상 팔레트
```css
/* 브랜드 컬러 */
--primary-blue: #1e5cb3;      /* 메인 파란색 */
--secondary-blue: #0d2e5c;    /* 진한 파란색 */
--accent-orange: #ff6b35;     /* 강조 주황색 */

/* 기능 컬러 */
--success-green: #27ae60;     /* 성공 */
--warning-amber: #f39c12;     /* 경고 */
--error-red: #e74c3c;         /* 오류 */

/* 뉴트럴 컬러 */
--gray-50: #f8fafc;           /* 가장 밝은 회색 */
--gray-900: #0f172a;          /* 가장 진한 회색 */
```

### 📝 타이포그래피
```css
/* 폰트 패밀리 */
--font-primary: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* 폰트 크기 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-xl: 1.25rem;    /* 20px */
--text-5xl: 3rem;      /* 48px */
```

### 🎭 애니메이션
```css
/* 트랜지션 */
--transition-fast: 150ms ease-in-out;
--transition-normal: 300ms ease-in-out;
--transition-slow: 500ms ease-in-out;

/* 이징 */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

## 🔧 개발 가이드

### 📝 코딩 규칙
- **JavaScript**: ES6+ 문법 사용
- **CSS**: BEM 네이밍 컨벤션
- **HTML**: 시맨틱 마크업 필수
- **접근성**: WCAG 2.1 AA 준수

### 🧪 코드 품질
```bash
# 코드 포맷팅
npm run format

# 린팅
npm run lint

# 타입 체크
npm run type-check
```

### 🔄 Git 워크플로우
```bash
# 새 기능 개발
git checkout -b feature/new-feature
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/new-feature

# 커밋 메시지 규칙
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 업무 수정
```

## 📊 성능 및 SEO

### ⚡ 성능 지표
- **Lighthouse 점수**: 95+ (모든 영역)
- **First Contentful Paint**: < 1.5초
- **Largest Contentful Paint**: < 2.5초
- **Cumulative Layout Shift**: < 0.1

### 🔍 SEO 최적화
- **메타 태그**: 완전한 메타 태그 설정
- **구조화된 데이터**: Schema.org 구현
- **사이트맵**: 자동 생성 및 업데이트
- **robots.txt**: 검색 엔진 최적화

### 🌐 다국어 SEO
- **Hreflang 태그**: 9개 언어 지원
- **현지화된 콘텐츠**: 각 지역별 맞춤 콘텐츠
- **지역별 도메인**: 향후 확장 계획

## 🌐 다국어 지원

### 🗣️ 지원 언어
- 🇰🇷 **한국어** (기본)
- 🇯🇵 **日本語**
- 🇺🇸 **English**
- 🇹🇼 **繁體中文**
- 🇨🇳 **简体中文**
- 🇹🇭 **ไทย**
- 🇻🇳 **Tiếng Việt**
- 🇮🇩 **Bahasa Indonesia**
- 🇲🇾 **Bahasa Melayu**

### 🔄 번역 시스템
```javascript
// 언어 변경
changeLanguage('ja'); // 일본어로 변경
changeLanguage('en'); // 영어로 변경

// 현재 언어 감지
const currentLang = detectLanguage();
```

## 📱 PWA 기능

### 🔧 주요 기능
- **오프라인 지원**: 캐시된 페이지 오프라인 조회
- **앱 설치**: 홈 화면에 앱 아이콘 추가
- **푸시 알림**: 견적 상태 및 뉴스 알림
- **백그라운드 동기화**: 오프라인 데이터 자동 동기화

### 📲 설치 방법
1. **Android**: 브라우저 메뉴 → "홈 화면에 추가"
2. **iOS**: Safari 공유 → "홈 화면에 추가"
3. **Desktop**: 주소창 설치 버튼 클릭

## 🧪 테스트

### 🔬 테스트 유형
```bash
# 전체 테스트 실행
npm test

# 성능 테스트
npm run test:performance

# 접근성 테스트
npm run test:accessibility

# 크로스 브라우저 테스트
npm run test:browsers

# E2E 테스트
npm run test:e2e
```

### 📊 테스트 커버리지
- **기능 테스트**: 95%+
- **접근성 테스트**: WCAG 2.1 AA 준수
- **성능 테스트**: Core Web Vitals 모든 지표 Good

## 🚀 배포

### 🌍 배포 환경
- **Production**: https://pure-flon.com
- **Staging**: https://staging.pure-flon.com
- **Development**: https://dev.pure-flon.com

### 🔄 자동 배포
```bash
# 프로덕션 배포
git push origin main

# 스테이징 배포
git push origin staging

# 개발 배포
git push origin develop
```

### 📋 배포 체크리스트
- [ ] 모든 테스트 통과
- [ ] Lighthouse 점수 95+ 확인
- [ ] 크로스 브라우저 테스트 완료
- [ ] 보안 검사 통과
- [ ] 성능 지표 확인

## 🤝 기여하기

### 📝 기여 가이드
1. **이슈 확인**: [GitHub Issues](https://github.com/pure-flon/website/issues)
2. **브랜치 생성**: `git checkout -b feature/your-feature`
3. **개발 및 테스트**: 코드 작성 및 테스트 실행
4. **Pull Request**: 변경사항 PR 생성

### 👥 기여자

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/contributor1">
        <img src="https://github.com/contributor1.png" width="100px;" alt=""/>
        <br />
        <sub><b>김개발</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/contributor2">
        <img src="https://github.com/contributor2.png" width="100px;" alt=""/>
        <br />
        <sub><b>이디자인</b></sub>
      </a>
    </td>
  </tr>
</table>

## 📞 지원

### 🆘 문제 해결
- **일반 문의**: [support@pure-flon.com](mailto:support@pure-flon.com)
- **기술 지원**: [tech@pure-flon.com](mailto:tech@pure-flon.com)
- **버그 리포트**: [GitHub Issues](https://github.com/pure-flon/website/issues)

### 📚 추가 자료
- **API 문서**: [docs.pure-flon.com](https://docs.pure-flon.com)
- **디자인 가이드**: [design.pure-flon.com](https://design.pure-flon.com)
- **개발자 블로그**: [blog.pure-flon.com](https://blog.pure-flon.com)

### 🔗 유용한 링크
- **회사 웹사이트**: [pure-flon.com](https://pure-flon.com)
- **LinkedIn**: [linkedin.com/company/pure-flon](https://linkedin.com/company/pure-flon)
- **YouTube**: [youtube.com/c/pureflon](https://youtube.com/c/pureflon)

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

---

<div align="center">
  <p>Made with ❤️ by Pure-Flon Team</p>
  <p>© 2025 Pure-Flon. All rights reserved.</p>
</div>
