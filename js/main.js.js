/* ================================
   Pure-Flon PTFE Website - Main JavaScript (수정된 버전)
   Version: 2.1.1 (이미지 및 에러 처리 개선)
   ================================ */

'use strict';

// Supabase 클라이언트 초기화
let supabaseClient = null;

// ✅ 수정: 환경 변수 - 실제 값으로 교체 필요
const SUPABASE_URL = window.SUPABASE_URL || 'YOUR_SUPABASE_URL'; // Vercel 환경변수에서 가져오기
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'; // Vercel 환경변수에서 가져오기

// Global App Object
const PureFlonApp = {
  // Configuration
  config: {
    supabase: {
      url: SUPABASE_URL,
      anonKey: SUPABASE_ANON_KEY
    },
    isProduction: window.location.hostname !== 'localhost'
  },

  // Initialize app
  async init() {
    // DOM Ready 체크
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initApp());
    } else {
      this.initApp();
    }
  },

  async initApp() {
    try {
      console.log('🚀 Pure-Flon App 초기화 시작...');
      
      // 기본 기능들 먼저 초기화 (Supabase 없이도 작동하도록)
      this.navigation.init();
      this.quoteSystem.init();
      this.animations.init();
      this.imageHandling.init();
      
      // Supabase 초기화 (선택적)
      if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        await this.initSupabase();
      } else {
        console.warn('⚠️ Supabase 설정이 필요합니다. 기본 기능만 활성화됩니다.');
      }
      
      console.log('✅ Pure-Flon App 초기화 완료 (v2.1.1)');
    } catch (error) {
      console.error('❌ App 초기화 실패:', error);
      // 에러가 발생해도 기본 기능은 작동하도록 함
    }
  },

  // Supabase 초기화 (에러 처리 강화)
  async initSupabase() {
    try {
      // Supabase 라이브러리 확인
      if (!window.supabase) {
        console.log('📦 Supabase 라이브러리 로딩 중...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Supabase 라이브러리 로딩 실패'));
          document.head.appendChild(script);
        });
      }
      
      // 클라이언트 생성
      supabaseClient = window.supabase.createClient(
        this.config.supabase.url,
        this.config.supabase.anonKey
      );
      
      console.log('✅ Supabase 초기화 완료');
      return true;
    } catch (error) {
      console.error('❌ Supabase 초기화 실패:', error);
      return false;
    }
  },

  // 견적 저장 함수 (에러 처리 강화)
  async saveQuote(quoteData) {
    try {
      if (!supabaseClient) {
        console.warn('⚠️ Supabase 미연결 - 로컬 저장');
        // Supabase가 없어도 작동하도록 로컬 처리
        this.handleOfflineQuote(quoteData);
        return { success: true, offline: true };
      }

      const { data, error } = await supabaseClient
        .from('quotes')
        .insert([{
          customer_info: quoteData.customer,
          product_config: quoteData.product,
          total_price: quoteData.totalPrice,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (error) {
        throw error;
      }

      console.log('✅ 견적 저장 성공:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ 견적 저장 실패:', error);
      // 실패 시 로컬 처리
      this.handleOfflineQuote(quoteData);
      return { success: false, error, offline: true };
    }
  },

  // 오프라인 견적 처리
  handleOfflineQuote(quoteData) {
    const quotes = JSON.parse(localStorage.getItem('offline_quotes') || '[]');
    quotes.push({
      ...quoteData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('offline_quotes', JSON.stringify(quotes));
    console.log('💾 오프라인 견적 저장됨');
  },

  // Navigation module (수정됨)
  navigation: {
    init() {
      this.setupMobileMenu();
      this.setupSmoothScroll();
      this.setupDropdowns();
    },
    
    setupMobileMenu() {
      const toggle = document.querySelector('.nav-toggle');
      const menu = document.querySelector('.nav-mobile');
      
      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          menu.classList.toggle('active');
          toggle.classList.toggle('active');
          toggle.setAttribute('aria-expanded', menu.classList.contains('active'));
        });

        // 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
          if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      }
    },

    setupDropdowns() {
      // 드롭다운 메뉴 처리
      const dropdowns = document.querySelectorAll('.nav__item--dropdown');
      dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav__link');
        if (link) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            // 모바일에서는 서브메뉴 토글
            if (window.innerWidth < 1024) {
              const submenu = dropdown.querySelector('.nav__dropdown');
              if (submenu) {
                submenu.classList.toggle('active');
              }
            }
          });
        }
      });
    },
    
    setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  },

  // 견적 시스템 (개선됨)
  quoteSystem: {
    init() {
      this.setupQuoteButtons();
      this.setupQuoteForm();
    },
    
    setupQuoteButtons() {
      // 다양한 견적 버튼들 처리
      const selectors = [
        '[href="#quote"]', 
        '.quote-btn', 
        '.btn-quote',
        'a[href*="견적"]'
      ];
      
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            this.showQuoteModal();
          });
        });
      });
    },
    
    setupQuoteForm() {
      const quoteForm = document.querySelector('#quote-form');
      if (quoteForm) {
        quoteForm.addEventListener('submit', this.handleQuoteSubmit.bind(this));
      }
    },
    
    showQuoteModal() {
      // 간단한 견적 요청 모달
      const customerInfo = this.collectCustomerInfo();
      if (customerInfo) {
        this.submitQuoteRequest(customerInfo);
      }
    },

    collectCustomerInfo() {
      const name = prompt('성함을 입력해주세요:');
      if (!name) return null;

      const email = prompt('이메일을 입력해주세요:');
      if (!email || !this.isValidEmail(email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return null;
      }

      const company = prompt('회사명을 입력해주세요 (선택사항):') || '';
      
      return { name, email, company };
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    async submitQuoteRequest(customerInfo) {
      try {
        const quoteData = {
          customer: customerInfo,
          product: { type: 'general_inquiry', timestamp: Date.now() },
          totalPrice: 0,
          status: 'inquiry'
        };

        const result = await PureFlonApp.saveQuote(quoteData);
        
        if (result.success) {
          if (result.offline) {
            alert(`견적 요청이 임시 저장되었습니다.\n담당자가 ${customerInfo.email}로 연락드리겠습니다.`);
          } else {
            alert('견적 요청이 성공적으로 접수되었습니다!\n24시간 내에 연락드리겠습니다.');
          }
        } else {
          throw new Error('견적 요청 처리 중 오류 발생');
        }
      } catch (error) {
        console.error('견적 요청 실패:', error);
        alert(`견적 요청 중 오류가 발생했습니다.\n직접 연락주세요: contact@pure-flon.com`);
      }
    }
  },

  // 이미지 처리 모듈 (새로 추가)
  imageHandling: {
    init() {
      this.setupImageErrorHandling();
      this.setupLazyLoading();
    },

    setupImageErrorHandling() {
      // 이미지 로딩 실패 시 플레이스홀더로 교체
      document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', (e) => {
          const alt = e.target.alt || 'Pure-Flon PTFE';
          const width = e.target.width || 400;
          const height = e.target.height || 300;
          
          // 플레이스홀더 URL 생성
          const placeholderUrl = `https://via.placeholder.com/${width}x${height}/1e5cb3/ffffff?text=${encodeURIComponent(alt)}`;
          
          if (e.target.src !== placeholderUrl) {
            console.warn(`이미지 로딩 실패: ${e.target.src}`);
            e.target.src = placeholderUrl;
          }
        });
      });
    },

    setupLazyLoading() {
      // Intersection Observer를 사용한 지연 로딩
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
              }
            }
          });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    }
  },

  // 애니메이션 (개선됨)
  animations: {
    init() {
      this.setupScrollAnimations();
      this.setupFloatingCards();
    },
    
    setupScrollAnimations() {
      if ('IntersectionObserver' in window) {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        }, observerOptions);
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          observer.observe(el);
        });
      } else {
        // Intersection Observer 미지원 시 즉시 표시
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.add('animate-in');
        });
      }
    },

    setupFloatingCards() {
      // 플로팅 카드 애니메이션 강화
      const cards = document.querySelectorAll('.floating-card');
      cards.forEach((card, index) => {
        // 개별 애니메이션 딜레이 설정
        card.style.animationDelay = `${index * 2}s`;
        
        // 호버 효과 추가
        card.addEventListener('mouseenter', () => {
          card.style.animationPlayState = 'paused';
          card.style.transform = 'translateY(-10px) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.animationPlayState = 'running';
          card.style.transform = '';
        });
      });
    }
  }
};

// 앱 시작
PureFlonApp.init();

// 전역 노출 (디버깅용)
window.PureFlonApp = PureFlonApp;

// 에러 처리
window.addEventListener('error', (e) => {
  console.error('JavaScript 에러:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Promise 에러:', e.reason);
});

// PWA Service Worker (선택적)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('✅ SW registered'))
      .catch(error => console.log('❌ SW registration failed:', error));
  });
}