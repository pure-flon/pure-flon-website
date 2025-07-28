# 🚀 Pure-Flon PTFE 튜브 웹사이트

<div align="center">
  <img src="images/logo.svg" alt="Pure-Flon Logo" width="200" height="60"/>
  
  **동아시아 시장을 선도하는 프리미엄 산업용 PTFE 튜브 제조업체**
  
  [![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://pure-flon.com)
  [![Lighthouse](https://img.shields.io/badge/lighthouse-95%2B-brightgreen)](https://pagespeed.web.dev/)
  [![Version](https://img.shields.io/badge/version-4.0.0-blue)](https://github.com/pure-flon/website)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
  [![PWA](https://img.shields.io/badge/PWA-enabled-purple)](https://web.dev/pwa/)
</div>

## 📋 목차

- [🎯 프로젝트 소개](#-프로젝트-소개)
- [✨ 주요 기능](#-주요-기능)
- [🛠️ 기술 스택](#️-기술-스택)
- [🚀 빠른 시작](#-빠른-시작)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🔧 개발 가이드](#-개발-가이드)
- [📊 성능 및 SEO](#-성능-및-seo)
- [🌐 다국어 지원](#-다국어-지원)
- [🚀 배포](#-배포)

## 🎯 프로젝트 소개

Pure-Flon은 의료용, 반도체용, 화학용 PTFE 튜브를 제조하는 동아시아 선도 기업입니다. 이 웹사이트는 고객들에게 최고의 사용자 경험을 제공하며, 실시간 견적 시스템을 통해 효율적인 비즈니스 프로세스를 구현합니다.

### 🎪 라이브 데모
- **프로덕션**: [https://pure-flon.com](https://pure-flon.com)
- **개발**: [http://localhost:8000](http://localhost:8000)

## ✨ 주요 기능

### 📋 지능형 견적 시스템
- **원클릭 견적**: 제품 페이지에서 바로 견적 요청
- **자동 데이터 수집**: 사용자 설정 자동 전달
- **실시간 알림**: 24시간 내 응답 보장
- **오프라인 지원**: 네트워크 오류 시 로컬 저장

### 🌍 글로벌 시장 지원
- **5개 언어**: 한국어, 일본어, 영어, 중국어(간체/번체)
- **지역별 맞춤**: 현지 규격 및 인증 정보 제공
- **현지 지원팀**: 각 지역별 전문 기술팀 연결

### 📱 PWA 기능
- **오프라인 지원**: Service Worker 기반 오프라인 브라우징
- **앱 설치**: 모바일/데스크톱 앱처럼 설치 가능
- **푸시 알림**: 견적 상태 및 신제품 정보 알림

## 🛠️ 기술 스택

### 🎨 프론트엔드
- **HTML5**: 시맨틱 마크업 및 웹 표준 준수
- **CSS3**: 모던 CSS (Grid, Flexbox, Custom Properties)
- **Vanilla JavaScript**: 프레임워크 없는 순수 JavaScript
- **Web APIs**: Intersection Observer, Web Workers

### 🚀 배포 및 인프라
- **Vercel**: 메인 호스팅 플랫폼
- **GitHub Actions**: CI/CD 파이프라인
- **Lighthouse CI**: 자동 성능 모니터링

## 🚀 빠른 시작

### 📋 사전 요구사항
- **Python**: 3.8+ (로컬 서버용)
- **Git**: 최신 버전
- **모던 브라우저**: Chrome, Firefox, Safari, Edge

### 🔧 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/pure-flon/website.git
cd pure-flon-website

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일을 실제 값으로 수정

# 3. 개발 서버 실행
npm run dev
# 또는
python -m http.server 8000

# 4. 브라우저에서 확인
# http://localhost:8000 으로 접속
```

### 🔑 환경 변수 설정

```bash
# .env 파일 생성
CONTACT_EMAIL=contact@pure-flon.com
ANALYTICS_ID=G-XXXXXXXXXX
SUPPORT_PHONE=+82-2-1234-5678
```

## 📁 프로젝트 구조

```
pure-flon-website/
├── 📄 index.html                    # 메인 홈페이지
├── 📄 package.json                  # NPM 설정
├── 📄 .gitignore                    # Git 무시 파일
├── 📄 README.md                     # 프로젝트 설명서
├── 📄 vercel.json                   # Vercel 배포 설정
├── 📄 robots.txt                    # SEO 크롤러 정책
├── 📄 sitemap.xml                   # XML 사이트맵
│
├── 📁 css/
│   ├── 📄 main.css                  # 메인 스타일시트
│   └── 📄 customer-portal.css       # 고객 포털 스타일
│
├── 📁 js/
│   ├── 📄 main.js                   # 메인 JavaScript
│   ├── 📄 quote-system.js           # 견적 시스템
│   └── 📄 customer-portal.js        # 고객 포털
│
├── 📁 images/                       # 이미지 파일들
├── 📁 products/                     # 제품 페이지들
├── 📁 company/                      # 회사 소개 페이지들
├── 📁 quote/                        # 견적 관련 페이지들
├── 📁 customer/                     # 고객 포털 페이지들
├── 📁 api/                          # API 엔드포인트
│   └── 📁 quotes/
│       └── 📄 submit.js             # 견적 제출 API
└── 📁 .github/
    └── 📁 workflows/
        └── 📄 ci-cd.yml             # GitHub Actions
```

## 🔧 개발 가이드

### 📝 코딩 컨벤션
- **HTML**: 시맨틱 태그 사용, 접근성 준수
- **CSS**: BEM 방법론, 모바일 퍼스트
- **JavaScript**: ES6+, 모듈 방식 사용

### 🧪 테스트
```bash
# HTML 검증
npm run validate:html

# CSS 검증
npm run validate:css

# JavaScript 검증
npm run lint:js
```

## 📊 성능 및 SEO

- **Lighthouse 점수**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: 모든 지표 통과
- **SEO 최적화**: 메타 태그, 구조화된 데이터, 사이트맵

## 🌐 다국어 지원

### 지원 언어
- 🇰🇷 한국어 (기본)
- 🇯🇵 일본어
- 🇺🇸 영어
- 🇨🇳 중국어 (간체)
- 🇹🇼 중국어 (번체)

### 번역 파일 구조
```
locales/
├── ko.json      # 한국어
├── ja.json      # 일본어
├── en.json      # 영어
├── zh-CN.json   # 중국어 간체
└── zh-TW.json   # 중국어 번체
```

## 🚀 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 수동 배포
1. GitHub에 푸시
2. Vercel에서 자동 배포
3. 도메인 연결

## 📞 지원 및 연락처

- **기술 지원**: tech@pure-flon.com
- **영업 문의**: sales@pure-flon.com
- **전화**: +82-2-1234-5678
- **웹사이트**: [https://pure-flon.com](https://pure-flon.com)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 확인하세요.

---

<div align="center">
  Made with ❤️ by Pure-Flon Team
</div>