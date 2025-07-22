/* ================================
   Pure-Flon PTFE Website - Enhanced JavaScript v2.0
   Modern Modal System + PWA + Performance Optimized
   ================================ */

'use strict';

// Supabase 클라이언트 초기화
let supabaseClient = null;

// 환경 변수 설정
const SUPABASE_URL = window.SUPABASE_URL || 'https://wdyhdqjgmoycxxvhwxgd.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkeWhkcWpnbW95Y3h4dmh3eGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDYzODQsImV4cCI6MjA2ODA4MjM4NH0.3peI1J6-Ms70YnxepjgibSBj0jHAmElyC87mgaD9woc';

// 글로벌 앱 객체
const PureFlonApp = {
  // 앱 설정
  config: {
    supabase: {
      url: SUPABASE_URL,
      anonKey: SUPABASE_ANON_KEY
    },
    isProduction: window.location.hostname !== 'localhost',
    performance: {
      enableAnalytics: true,
      enableErrorTracking: true,
      cacheQuotes: true
    }
  },

  // 앱 상태 관리
  state: {
    currentModal: null,
    isOnline: navigator.onLine,
    pendingQuotes: JSON.parse(localStorage.getItem('offline_quotes') || '[]'),
    user: null,
    performance: {
      navigationStart: performance.navigationStart,
      metrics: {}
    }
  },

  // 메인 초기화 함수
  async init() {
    try {
      console.log('🚀 Pure-Flon App v2.0 초기화 시작...');
      
      // 성능 측정 시작
      this.performance.measureInitStart();
      
      // DOM 준비 체크
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initApp());
      } else {
        this.initApp();
      }
    } catch (error) {
      console.error('❌ App 초기화 실패:', error);
      this.errorHandler.handleError(error, 'initialization');
    }
  },

  async initApp() {
    try {
      // 기본 모듈 초기화
      this.navigation.init();
      this.animations.init();
      this.imageHandling.init();
      this.accessibility.init();
      this.performance.init();
      
      // 향상된 모달 시스템 초기화
      this.modalSystem.init();
      
      // PWA 기능 초기화
      this.pwa.init();
      
      // 네트워크 상태 모니터링
      this.networkMonitor.init();
      
      // Supabase 초기화 (선택적)
      if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        await this.initSupabase();
      }
      
      // 성능 측정 완료
      this.performance.measureInitEnd();
      
      console.log('✅ Pure-Flon App v2.0 초기화 완료');
    } catch (error) {
      console.error('❌ App 초기화 실패:', error);
      this.errorHandler.handleError(error, 'app_initialization');
    }
  },

  // Supabase 초기화
  async initSupabase() {
    try {
      if (!window.supabase) {
        console.log('📦 Supabase 라이브러리 로딩 중...');
        await this.utils.loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      }
      
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

  // ================================
  // 향상된 모달 시스템
  // ================================
  modalSystem: {
    currentStep: 1,
    totalSteps: 4,
    formData: {},
    validationRules: {},

    init() {
      this.setupModalTriggers();
      this.setupModalEvents();
      this.setupFormValidation();
      this.setupKeyboardNavigation();
    },

    setupModalTriggers() {
      // 모든 모달 트리거 버튼 처리
      const triggers = document.querySelectorAll('[data-modal-target]');
      triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const modalId = trigger.getAttribute('data-modal-target');
          this.openModal(modalId);
        });
      });

      // 기존 견적 버튼들 처리
      const quoteButtons = document.querySelectorAll('.quote-btn, .btn-quote, [href="#quote"]');
      quoteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.openModal('quote-modal');
        });
      });
    },

    setupModalEvents() {
      // 모달 닫기 이벤트
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-modal-close]') || 
            e.target.closest('[data-modal-close]')) {
          this.closeModal();
        }
      });

      // ESC 키로 모달 닫기
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && PureFlonApp.state.currentModal) {
          this.closeModal();
        }
      });

      // 단계 네비게이션 버튼들
      this.setupStepNavigation();
    },

    setupStepNavigation() {
      const nextBtn = document.getElementById('next-step');
      const prevBtn = document.getElementById('prev-step');
      const submitBtn = document.getElementById('submit-quote');

      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextStep());
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.prevStep());
      }

      if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.submitQuote();
        });
      }
    },

    setupFormValidation() {
      // 실시간 폼 검증
      const form = document.getElementById('quote-form');
      if (!form) return;

      form.addEventListener('input', (e) => {
        this.validateField(e.target);
      });

      form.addEventListener('change', (e) => {
        this.validateField(e.target);
      });
    },

    setupKeyboardNavigation() {
      // 모달 내에서 탭 포커스 트랩
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && PureFlonApp.state.currentModal) {
          this.trapFocus(e);
        }
      });
    },

    async openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      // 성능 측정
      const startTime = performance.now();

      try {
        // 모달 상태 설정
        PureFlonApp.state.currentModal = modal;
        
        // 애니메이션 준비
        modal.style.display = 'flex';
        
        // 접근성 설정
        this.setModalA11y(modal, true);
        
        // 스크롤 방지
        document.body.style.overflow = 'hidden';
        
        // 애니메이션 실행
        requestAnimationFrame(() => {
          modal.classList.add('is-open');
          this.focusFirstElement(modal);
        });

        // 초기 상태 설정
        this.resetModalState();
        
        // 성능 로깅
        const duration = performance.now() - startTime;
        console.log(`📊 모달 열기 성능: ${duration.toFixed(2)}ms`);

        // 이벤트 발송
        this.dispatchEvent('modalOpened', { modalId, duration });

      } catch (error) {
        console.error('❌ 모달 열기 실패:', error);
        PureFlonApp.errorHandler.handleError(error, 'modal_open');
      }
    },

    closeModal() {
      const modal = PureFlonApp.state.currentModal;
      if (!modal) return;

      try {
        // 애니메이션 시작
        modal.classList.remove('is-open');
        
        // 접근성 설정
        this.setModalA11y(modal, false);
        
        // 스크롤 복원
        document.body.style.overflow = '';
        
        // 애니메이션 완료 후 정리
        setTimeout(() => {
          modal.style.display = 'none';
          PureFlonApp.state.currentModal = null;
          
          // 포커스 복원
          this.restoreFocus();
        }, 300);

        // 이벤트 발송
        this.dispatchEvent('modalClosed', { modalId: modal.id });

      } catch (error) {
        console.error('❌ 모달 닫기 실패:', error);
        PureFlonApp.errorHandler.handleError(error, 'modal_close');
      }
    },

    nextStep() {
      if (this.currentStep >= this.totalSteps) return;

      // 현재 단계 검증
      if (!this.validateCurrentStep()) {
        this.showValidationErrors();
        return;
      }

      // 현재 단계 데이터 저장
      this.saveStepData();

      // 다음 단계로 이동
      this.currentStep++;
      this.updateStepDisplay();
      this.updateProgress();
      this.updateButtons();

      // 애니메이션 효과
      this.animateStepTransition();
    },

    prevStep() {
      if (this.currentStep <= 1) return;

      this.currentStep--;
      this.updateStepDisplay();
      this.updateProgress();
      this.updateButtons();
      this.animateStepTransition();
    },

    updateStepDisplay() {
      // 모든 단계 숨기기
      document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
      });

      // 현재 단계 표시
      const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"]`);
      if (currentStepEl) {
        currentStepEl.classList.add('active');
      }

      // 진행 표시기 업데이트
      document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < this.currentStep) {
          step.classList.add('completed');
        } else if (stepNum === this.currentStep) {
          step.classList.add('active');
        }
      });
    },

    updateProgress() {
      const progressFill = document.querySelector('.progress-fill');
      if (progressFill) {
        const percentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
      }
    },

    updateButtons() {
      const nextBtn = document.getElementById('next-step');
      const prevBtn = document.getElementById('prev-step');
      const submitBtn = document.getElementById('submit-quote');
      const closeBtn = document.getElementById('close-modal');

      // 이전 버튼
      if (prevBtn) {
        prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
      }

      // 다음/제출 버튼
      if (this.currentStep < this.totalSteps) {
        if (nextBtn) nextBtn.style.display = 'flex';
        if (submitBtn) submitBtn.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'none';
      } else if (this.currentStep === this.totalSteps - 1) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'flex';
        if (closeBtn) closeBtn.style.display = 'none';
      } else {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'flex';
      }
    },

    validateCurrentStep() {
      const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"].active`);
      if (!currentStepEl) return true;

      const requiredFields = currentStepEl.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      return isValid;
    },

    validateField(field) {
      const value = field.value.trim();
      const type = field.type;
      const name = field.name;

      // 필수 필드 검증
      if (field.hasAttribute('required') && !value) {
        this.showFieldError(field, '이 필드는 필수입니다.');
        return false;
      }

      // 타입별 검증
      switch (type) {
        case 'email':
          if (value && !this.isValidEmail(value)) {
            this.showFieldError(field, '올바른 이메일 주소를 입력하세요.');
            return false;
          }
          break;
        
        case 'number':
          const min = parseFloat(field.getAttribute('min'));
          const max = parseFloat(field.getAttribute('max'));
          const numValue = parseFloat(value);
          
          if (value && isNaN(numValue)) {
            this.showFieldError(field, '숫자를 입력하세요.');
            return false;
          }
          
          if (!isNaN(min) && numValue < min) {
            this.showFieldError(field, `최소값은 ${min}입니다.`);
            return false;
          }
          
          if (!isNaN(max) && numValue > max) {
            this.showFieldError(field, `최대값은 ${max}입니다.`);
            return false;
          }
          break;
        
        case 'tel':
          if (value && !this.isValidPhone(value)) {
            this.showFieldError(field, '올바른 전화번호를 입력하세요.');
            return false;
          }
          break;
      }

      // 사용자 정의 검증
      if (name === 'innerDiameter' && value) {
        const wallThickness = document.querySelector('[name="wallThickness"]').value;
        if (wallThickness && parseFloat(value) >= parseFloat(wallThickness) * 10) {
          this.showFieldError(field, '내경이 벽두께에 비해 너무 큽니다.');
          return false;
        }
      }

      // 검증 통과
      this.clearFieldError(field);
      return true;
    },

    showFieldError(field, message) {
      // 기존 에러 메시지 제거
      this.clearFieldError(field);
      
      // 필드 스타일 업데이트
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      
      // 에러 메시지 요소 생성
      const errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      errorEl.textContent = message;
      errorEl.setAttribute('role', 'alert');
      
      // 에러 메시지 삽입
      field.parentNode.appendChild(errorEl);
      
      // 접근성을 위한 aria-describedby 설정
      const errorId = `error-${field.name || Date.now()}`;
      errorEl.id = errorId;
      field.setAttribute('aria-describedby', errorId);
    },

    clearFieldError(field) {
      field.classList.remove('error');
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      
      const existingError = field.parentNode.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }
    },

    saveStepData() {
      const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"].active`);
      if (!currentStepEl) return;

      const formData = new FormData();
      const inputs = currentStepEl.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        if (input.type === 'radio' && !input.checked) return;
        if (input.type === 'checkbox' && !input.checked) return;
        
        this.formData[input.name] = input.value;
      });
    },

    async submitQuote() {
      try {
        // 로딩 상태 표시
        this.showSubmitLoading(true);
        
        // 최종 데이터 수집
        this.saveStepData();
        
        // 최종 검증
        if (!this.validateAllSteps()) {
          this.showSubmitLoading(false);
          return;
        }

        // 견적 데이터 구성
        const quoteData = {
          customer: {
            companyName: this.formData.companyName,
            contactName: this.formData.contactName,
            email: this.formData.email,
            phone: this.formData.phone
          },
          product: {
            application: this.formData.application,
            innerDiameter: parseFloat(this.formData.innerDiameter),
            wallThickness: parseFloat(this.formData.wallThickness),
            length: parseFloat(this.formData.length),
            quantity: parseInt(this.formData.quantity),
            specialRequirements: this.formData.specialRequirements,
            deliveryDate: this.formData.deliveryDate
          },
          timestamp: new Date().toISOString(),
          source: 'website_modal'
        };

        // 견적 제출
        const result = await PureFlonApp.saveQuote(quoteData);
        
        if (result.success) {
          // 성공 단계로 이동
          this.currentStep = this.totalSteps;
          this.updateStepDisplay();
          this.updateProgress();
          this.updateButtons();
          
          // 성공 애니메이션
          this.showSuccessAnimation();
          
          // 이벤트 발송
          this.dispatchEvent('quoteSubmitted', { data: quoteData, result });
          
        } else {
          throw new Error(result.error?.message || '견적 제출 실패');
        }

      } catch (error) {
        console.error('❌ 견적 제출 실패:', error);
        this.showSubmitError(error.message);
        PureFlonApp.errorHandler.handleError(error, 'quote_submission');
      } finally {
        this.showSubmitLoading(false);
      }
    },

    showSubmitLoading(show) {
      const submitBtn = document.getElementById('submit-quote');
      if (!submitBtn) return;

      if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="btn__icon spin" width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
          처리 중...
        `;
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg class="btn__icon" width="16" height="16" viewBox="0 0 16 16">
            <path d="M14 2L6 10L2 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
          견적 요청 제출
        `;
      }
    },

    showSuccessAnimation() {
      const completionIcon = document.querySelector('.completion-icon svg');
      if (completionIcon) {
        completionIcon.style.animation = 'successPulse 2s ease-in-out';
      }
    },

    resetModalState() {
      this.currentStep = 1;
      this.formData = {};
      this.updateStepDisplay();
      this.updateProgress();
      this.updateButtons();
      
      // 폼 초기화
      const form = document.getElementById('quote-form');
      if (form) {
        form.reset();
      }
      
      // 에러 메시지 제거
      document.querySelectorAll('.field-error').forEach(error => error.remove());
      document.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
      });
    },

    // 유틸리티 함수들
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidPhone(phone) {
      return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    setModalA11y(modal, isOpen) {
      modal.setAttribute('aria-hidden', !isOpen);
      if (isOpen) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
      }
    },

    focusFirstElement(modal) {
      const focusableElements = modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    },

    trapFocus(e) {
      const modal = PureFlonApp.state.currentModal;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },

    dispatchEvent(eventName, detail) {
      const event = new CustomEvent(eventName, { detail });
      document.dispatchEvent(event);
    }
  },

  // ================================
  // PWA 기능
  // ================================
  pwa: {
    init() {
      this.registerServiceWorker();
      this.setupInstallPrompt();
      this.setupOfflineSupport();
    },

    async registerServiceWorker() {
      if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('✅ Service Worker 등록 성공:', registration);
          
          // 업데이트 확인
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker 업데이트 발견');
            this.handleSWUpdate(registration);
          });
          
        } catch (error) {
          console.error('❌ Service Worker 등록 실패:', error);
        }
      }
    },

    setupInstallPrompt() {
      let deferredPrompt;
      
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        this.showInstallBanner();
      });

      // 설치 버튼 이벤트
      document.addEventListener('click', async (e) => {
        if (e.target.matches('.install-app-btn')) {
          e.preventDefault();
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`PWA 설치 결과: ${outcome}`);
            deferredPrompt = null;
            this.hideInstallBanner();
          }
        }
      });
    },

    showInstallBanner() {
      // PWA 설치 배너 표시 (필요시 구현)
      console.log('📱 PWA 설치 가능');
    },

    hideInstallBanner() {
      // PWA 설치 배너 숨기기
      console.log('📱 PWA 설치 배너 숨김');
    },

    setupOfflineSupport() {
      // 오프라인 견적 요청 처리
      document.addEventListener('quoteSubmitted', (e) => {
        if (!navigator.onLine) {
          this.saveOfflineQuote(e.detail.data);
        }
      });
    },

    saveOfflineQuote(quoteData) {
      const offlineQuotes = JSON.parse(localStorage.getItem('offline_quotes') || '[]');
      offlineQuotes.push({
        ...quoteData,
        id: Date.now(),
        offline: true
      });
      localStorage.setItem('offline_quotes', JSON.stringify(offlineQuotes));
      console.log('💾 오프라인 견적 저장됨');
    }
  },

  // ================================
  // 네트워크 모니터링
  // ================================
  networkMonitor: {
    init() {
      this.setupNetworkListeners();
      this.checkConnectivity();
    },

    setupNetworkListeners() {
      window.addEventListener('online', () => {
        PureFlonApp.state.isOnline = true;
        this.handleOnline();
      });

      window.addEventListener('offline', () => {
        PureFlonApp.state.isOnline = false;
        this.handleOffline();
      });
    },

    handleOnline() {
      console.log('🌐 온라인 상태');
      this.syncOfflineData();
      this.showConnectivityStatus('온라인', 'success');
    },

    handleOffline() {
      console.log('📴 오프라인 상태');
      this.showConnectivityStatus('오프라인 - 데이터가 로컬에 저장됩니다', 'warning');
    },

    async syncOfflineData() {
      const offlineQuotes = JSON.parse(localStorage.getItem('offline_quotes') || '[]');
      if (offlineQuotes.length === 0) return;

      console.log(`📤 ${offlineQuotes.length}개의 오프라인 견적 동기화 중...`);
      
      for (const quote of offlineQuotes) {
        try {
          await PureFlonApp.saveQuote(quote);
          // 성공한 견적 제거
          const updatedQuotes = offlineQuotes.filter(q => q.id !== quote.id);
          localStorage.setItem('offline_quotes', JSON.stringify(updatedQuotes));
        } catch (error) {
          console.error('❌ 견적 동기화 실패:', error);
        }
      }
    },

    showConnectivityStatus(message, type) {
      // 연결 상태 알림 표시 (토스트 등)
      console.log(`📡 ${message}`);
    }
  },

  // ================================
  // 성능 모니터링
  // ================================
  performance: {
    metrics: {},

    init() {
      this.measurePageLoad();
      this.measureInteractions();
      this.measureCoreWebVitals();
    },

    measureInitStart() {
      this.metrics.initStart = performance.now();
    },

    measureInitEnd() {
      this.metrics.initEnd = performance.now();
      this.metrics.initDuration = this.metrics.initEnd - this.metrics.initStart;
      console.log(`📊 앱 초기화 시간: ${this.metrics.initDuration.toFixed(2)}ms`);
    },

    measurePageLoad() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          this.metrics.pageLoad = {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            totalTime: perfData.loadEventEnd - perfData.fetchStart
          };
          console.log('📊 페이지 로드 성능:', this.metrics.pageLoad);
        }, 0);
      });
    },

    measureInteractions() {
      // 클릭 응답 시간 측정
      document.addEventListener('click', (e) => {
        const startTime = performance.now();
        setTimeout(() => {
          const duration = performance.now() - startTime;
          if (duration > 100) {
            console.warn(`⚠️ 느린 상호작용 감지: ${duration.toFixed(2)}ms`);
          }
        }, 0);
      });
    },

    measureCoreWebVitals() {
      // Core Web Vitals 측정 (간소화된 버전)
      if ('PerformanceObserver' in window) {
        // LCP 측정
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lcp = entries[entries.length - 1];
          this.metrics.lcp = lcp.startTime;
          console.log(`📊 LCP: ${lcp.startTime.toFixed(2)}ms`);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID 측정
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            console.log(`📊 FID: ${this.metrics.fid.toFixed(2)}ms`);
          });
        }).observe({ entryTypes: ['first-input'] });
      }
    }
  },

  // ================================
  // 접근성 향상
  // ================================
  accessibility: {
    init() {
      this.setupKeyboardNavigation();
      this.setupScreenReaderSupport();
      this.setupFocusManagement();
    },

    setupKeyboardNavigation() {
      // 키보드 전용 사용자를 위한 향상된 네비게이션
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
      });
    },

    setupScreenReaderSupport() {
      // 동적 콘텐츠 변경 시 스크린 리더에게 알림
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'aria-announcer';
      document.body.appendChild(announcer);
    },

    announce(message) {
      const announcer = document.getElementById('aria-announcer');
      if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
          announcer.textContent = '';
        }, 1000);
      }
    },

    setupFocusManagement() {
      // 포커스 관리 개선
      let lastFocusedElement = null;

      document.addEventListener('focusin', (e) => {
        lastFocusedElement = e.target;
      });

      // 모달 닫힐 때 포커스 복원
      document.addEventListener('modalClosed', () => {
        if (lastFocusedElement && document.body.contains(lastFocusedElement)) {
          lastFocusedElement.focus();
        }
      });
    }
  },

  // ================================
  // 에러 처리
  // ================================
  errorHandler: {
    handleError(error, context) {
      console.error(`❌ 에러 [${context}]:`, error);
      
      // 에러 로깅 (프로덕션에서는 외부 서비스로 전송)
      if (PureFlonApp.config.isProduction) {
        this.logError(error, context);
      }
      
      // 사용자에게 친화적인 에러 메시지 표시
      this.showUserFriendlyError(context);
    },

    logError(error, context) {
      // 실제 프로덕션에서는 Sentry, LogRocket 등으로 전송
      const errorData = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.log('📡 에러 로깅:', errorData);
    },

    showUserFriendlyError(context) {
      let message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      
      switch (context) {
        case 'quote_submission':
          message = '견적 요청 처리 중 오류가 발생했습니다. 직접 연락주시거나 잠시 후 다시 시도해주세요.';
          break;
        case 'modal_open':
          message = '화면을 열 수 없습니다. 페이지를 새로고침해주세요.';
          break;
      }
      
      // 에러 메시지 표시 (간단한 alert 대신 토스트 메시지로 개선 가능)
      alert(message);
    }
  },

  // ================================
  // 유틸리티 함수들
  // ================================
  utils: {
    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    }
  },

  // ================================
  // 기존 기능들 (유지)
  // ================================
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
          const isOpen = menu.classList.contains('active');
          menu.classList.toggle('active');
          toggle.classList.toggle('active');
          toggle.setAttribute('aria-expanded', !isOpen);
        });

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
      const dropdowns = document.querySelectorAll('.nav__item--dropdown');
      dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav__link');
        if (link) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
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
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.add('animate-in');
        });
      }
    },

    setupFloatingCards() {
      const cards = document.querySelectorAll('.floating-card');
      cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
        
        card.addEventListener('mouseenter', () => {
          card.style.animationPlayState = 'paused';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.animationPlayState = 'running';
        });
      });
    }
  },

  imageHandling: {
    init() {
      this.setupImageErrorHandling();
      this.setupLazyLoading();
    },

    setupImageErrorHandling() {
      document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', (e) => {
          const alt = e.target.alt || 'Pure-Flon PTFE';
          const width = e.target.width || 400;
          const height = e.target.height || 300;
          
          const placeholderUrl = `https://via.placeholder.com/${width}x${height}/1e5cb3/ffffff?text=${encodeURIComponent(alt)}`;
          
          if (e.target.src !== placeholderUrl) {
            console.warn(`이미지 로딩 실패: ${e.target.src}`);
            e.target.src = placeholderUrl;
          }
        });
      });
    },

    setupLazyLoading() {
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

  // 견적 저장 함수 (개선된 버전)
  async saveQuote(quoteData) {
    try {
      if (!supabaseClient) {
        console.warn('⚠️ Supabase 미연결 - 오프라인 저장');
        this.handleOfflineQuote(quoteData);
        return { success: true, offline: true };
      }

      const { data, error } = await supabaseClient
        .from('quotes')
        .insert([{
          customer_info: quoteData.customer,
          product_config: quoteData.product,
          metadata: {
            source: quoteData.source,
            timestamp: quoteData.timestamp,
            userAgent: navigator.userAgent
          },
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
      this.handleOfflineQuote(quoteData);
      return { success: false, error, offline: true };
    }
  },

  handleOfflineQuote(quoteData) {
    const quotes = JSON.parse(localStorage.getItem('offline_quotes') || '[]');
    quotes.push({
      ...quoteData,
      id: Date.now(),
      offline: true
    });
    localStorage.setItem('offline_quotes', JSON.stringify(quotes));
    console.log('💾 오프라인 견적 저장됨');
  }
};

// 앱 시작
PureFlonApp.init();

// 전역 노출 (디버깅용)
window.PureFlonApp = PureFlonApp;

// 전역 에러 처리
window.addEventListener('error', (e) => {
  PureFlonApp.errorHandler.handleError(e.error, 'global_error');
});

window.addEventListener('unhandledrejection', (e) => {
  PureFlonApp.errorHandler.handleError(e.reason, 'unhandled_promise');
});

// CSS 스타일 추가 (스피너 애니메이션)
const style = document.createElement('style');
style.textContent = `
  .spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .field-error {
    color: var(--error-red, #e74c3c);
    font-size: var(--text-xs, 0.75rem);
    margin-top: var(--space-1, 0.25rem);
    display: flex;
    align-items: center;
    gap: var(--space-1, 0.25rem);
  }
  
  .field-error::before {
    content: '⚠️';
    font-size: 0.8em;
  }
  
  .form-input.error,
  .form-textarea.error {
    border-color: var(--error-red, #e74c3c);
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
  }
  
  .keyboard-navigation *:focus {
    outline: 2px solid var(--primary-blue, #1e5cb3) !important;
    outline-offset: 2px !important;
  }
`;
document.head.appendChild(style);