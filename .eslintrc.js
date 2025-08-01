/**
 * 파일명: .eslintrc.js
 * Pure-Flon PTFE 튜브 B2B 웹사이트 ESLint 설정
 * 업데이트: 2025-07-31 v3.1.0
 * 목적: 코드 품질 향상, 일관성 유지, 버그 예방
 */

module.exports = {
  // 실행 환경 설정
  env: {
    browser: true,        // 브라우저 환경
    es2025: true,         // ES2025 문법 지원
    node: true,           // Node.js 환경
    jest: true            // Jest 테스트 환경
  },

  // 파서 옵션
  parserOptions: {
    ecmaVersion: 2025,           // ECMAScript 2025
    sourceType: 'module',        // ES6 모듈 사용
    ecmaFeatures: {
      jsx: false,               // JSX는 사용하지 않음 (현재 vanilla JS)
      impliedStrict: true       // strict mode 기본 적용
    }
  },

  // 확장 설정
  extends: [
    'eslint:recommended'         // ESLint 권장 규칙
  ],

  // 전역 변수 설정
  globals: {
    // 라이브러리 전역 변수
    'THREE': 'readonly',         // Three.js
    'gsap': 'readonly',          // GSAP
    'Swiper': 'readonly',        // Swiper
    'gtag': 'readonly',          // Google Analytics
    
    // 프로젝트 전역 변수
    'PureFlonApp': 'readonly',   // 메인 앱 인스턴스
    'CONFIG': 'readonly'         // 설정 객체
  },

  // 규칙 설정
  rules: {
    // ===== 오류 방지 =====
    'no-console': ['warn', { allow: ['warn', 'error'] }],  // console.log 경고
    'no-debugger': 'error',                                 // debugger 사용 금지
    'no-alert': 'warn',                                     // alert 사용 경고
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',                              // _로 시작하는 매개변수 무시
      varsIgnorePattern: '^_'                               // _로 시작하는 변수 무시
    }],
    'no-undef': 'error',                                    // 정의되지 않은 변수 사용 금지
    'no-redeclare': 'error',                                // 변수 재선언 금지
    
    // ===== 코드 스타일 =====
    'indent': ['error', 2, { SwitchCase: 1 }],             // 들여쓰기 2칸
    'quotes': ['error', 'single', { 
      avoidEscape: true,                                    // 이스케이프 회피
      allowTemplateLiterals: true                           // 템플릿 리터럴 허용
    }],
    'semi': ['error', 'always'],                            // 세미콜론 필수
    'comma-dangle': ['error', 'never'],                     // 마지막 쉼표 금지
    'comma-spacing': ['error', { before: false, after: true }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'space-before-blocks': 'error',                         // 블록 앞 공백
    'space-before-function-paren': ['error', {
      anonymous: 'always',                                   // 익명 함수: 공백
      named: 'never',                                       // 이름 있는 함수: 공백 없음
      asyncArrow: 'always'                                  // async 화살표 함수: 공백
    }],
    'arrow-spacing': ['error', { before: true, after: true }],
    'object-curly-spacing': ['error', 'always'],            // 객체 중괄호 내 공백
    'array-bracket-spacing': ['error', 'never'],            // 배열 대괄호 내 공백 없음
    
    // ===== ES6+ 기능 =====
    'prefer-const': ['error', {                             // const 사용 권장
      destructuring: 'any',
      ignoreReadBeforeAssign: false
    }],
    'no-var': 'error',                                      // var 사용 금지
    'prefer-arrow-callback': 'error',                       // 화살표 함수 권장
    'prefer-template': 'error',                             // 템플릿 리터럴 권장
    'prefer-destructuring': ['warn', {
      array: false,
      object: true
    }],
    'no-duplicate-imports': 'error',                        // 중복 import 금지
    
    // ===== 보안 규칙 =====
    'no-eval': 'error',                                     // eval 사용 금지
    'no-implied-eval': 'error',                             // 암시적 eval 금지
    'no-new-func': 'error',                                 // Function 생성자 금지
    'no-script-url': 'error',                               // javascript: URL 금지
    
    // ===== 성능 규칙 =====
    'no-loop-func': 'error',                                // 루프 내 함수 생성 금지
    'no-await-in-loop': 'warn',                             // 루프 내 await 경고
    
    // ===== 접근성 규칙 =====
    'jsx-a11y/alt-text': 'off',                            // 현재 JSX 미사용
    
    // ===== 주석 규칙 =====
    'spaced-comment': ['error', 'always', {
      line: {
        markers: ['/'],
        exceptions: ['-', '+']
      },
      block: {
        markers: ['!'],
        exceptions: ['*'],
        balanced: true
      }
    }],
    
    // ===== 네이밍 규칙 =====
    'camelcase': ['error', { 
      properties: 'never',                                  // 속성은 예외
      ignoreDestructuring: true,                            // 구조 분해는 예외
      allow: ['^UNSAFE_']                                   // UNSAFE_ 접두사 허용
    }],
    
    // ===== 복잡도 규칙 =====
    'max-depth': ['warn', 4],                               // 최대 중첩 깊이 4
    'max-lines': ['warn', {
      max: 500,
      skipBlankLines: true,
      skipComments: true
    }],
    'max-lines-per-function': ['warn', {
      max: 100,
      skipBlankLines: true,
      skipComments: true
    }],
    'complexity': ['warn', 15],                             // 순환 복잡도 15 이하
    
    // ===== 기타 규칙 =====
    'eqeqeq': ['error', 'always'],                         // === 사용 강제
    'curly': ['error', 'all'],                             // 중괄호 항상 사용
    'dot-notation': 'error',                                // 점 표기법 권장
    'no-multi-spaces': 'error',                             // 다중 공백 금지
    'no-multiple-empty-lines': ['error', { max: 2 }],      // 최대 빈 줄 2개
    'no-trailing-spaces': 'error',                          // 후행 공백 금지
    'eol-last': ['error', 'always'],                       // 파일 끝 개행
    'no-mixed-operators': 'error',                          // 연산자 혼용 금지
    'no-nested-ternary': 'warn',                           // 중첩 삼항 연산자 경고
    'no-unneeded-ternary': 'error',                        // 불필요한 삼항 연산자 금지
    'no-whitespace-before-property': 'error',              // 속성 앞 공백 금지
    'space-in-parens': ['error', 'never'],                 // 괄호 내 공백 금지
    'space-infix-ops': 'error',                            // 연산자 주변 공백
    'space-unary-ops': ['error', { words: true, nonwords: false }],
    'keyword-spacing': 'error',                            // 키워드 주변 공백
    'no-shadow': 'error',                                   // 변수 섀도잉 금지
    'no-use-before-define': ['error', {                    // 정의 전 사용 금지
      functions: false,
      classes: true,
      variables: true
    }]
  },

  // 파일별 규칙 오버라이드
  overrides: [
    {
      // 설정 파일들
      files: ['*.config.js', '*.conf.js'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      // 테스트 파일들
      files: ['*.test.js', '*.spec.js'],
      env: {
        jest: true,
        mocha: true
      },
      rules: {
        'no-console': 'off',
        'max-lines': 'off',
        'max-lines-per-function': 'off'
      }
    },
    {
      // 빌드 스크립트
      files: ['scripts/*.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ],

  // 무시할 파일 패턴
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.min.js',
    'vendor/',
    'public/lib/',
    '*.config.js'
  ]
};