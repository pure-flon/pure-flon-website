/*
파일명: main.js
Pure-Flon PTFE 튜브 B2B 웹사이트 메인 JavaScript
업데이트: 2025-01-28 v3.0.0
개선사항: ES2025 모던 문법, 성능 최적화, 접근성 개선, 모바일 최적화
*/

// ===== MODERN JAVASCRIPT UTILITIES =====
class PureFlonApp {
  constructor() {
    this.isLoaded = false;
    this.observers = new Map();
    this.animations = new Map();
    this.mobileBreakpoint = 768;
    
    this.init();
  }

  // 초기화
  async init() {
    try {
      await this.waitForDOM();
      this.setupEventListeners();
      this.initializeComponents();
      this.setupIntersectionObserver();
      this.setupPerformanceMonitoring();
      this.isLoaded = true;
      
      console.log('✅ Pure-Flon App initialized successfully');
    } catch (error) {
      console.error('❌ App initialization failed:', error);
    }
  }

  // DOM 로딩 대기
  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 모바일 메뉴 토글
    this.setupMobileMenu();
    
    // 스크롤 이벤트
    this.setupScrollEvents();
    
    // 폼 이벤트
    this.setupFormHandlers();
    
    // 키보드 네비게이션
    this.setupKeyboardNavigation();
    
    // 리사이즈 이벤트
    this.setupResizeHandler();
  }

  // ===== MOBILE MENU =====
  setupMobileMenu() {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    const overlay = document.createElement('div');
    
    if (!toggle || !menu) return;

    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    // 메뉴 토글 함수
    const toggleMenu = (isOpen) => {
      const expanded = isOpen ?? !menu.classList.contains('active');
      
      menu.classList.toggle('active', expanded);
      overlay.classList.toggle('active', expanded);
      toggle.setAttribute('aria-expanded', expanded);
      
      // 애니메이션 효과
      this.animateHamburger(toggle, expanded);
      
      // 바디 스크롤 제어
      document.body.style.overflow = expanded ? 'hidden' : '';
      
      // 포커스 관리
      if (expanded) {
        menu.querySelector('.nav-link')?.focus();
      }
    };

    // 이벤트 리스너
    toggle.addEventListener('click', () => toggleMenu());
    overlay.addEventListener('click', () => toggleMenu(false));
    
    // ESC 키로 메뉴 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        toggleMenu(false);
        toggle.focus();
      }
    });

    // 메뉴 링크 클릭 시 메뉴 닫기
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= this.mobileBreakpoint) {
          toggleMenu(false);
        }
      });
    });

    // 리사이즈 시 메뉴 정리
    window.addEventListener('resize', () => {
      if (window.innerWidth > this.mobileBreakpoint) {
        toggleMenu(false);
      }
    });
  }

  // 햄버거 메뉴 애니메이션
  animateHamburger(toggle, isOpen) {
    const lines = toggle.querySelectorAll('.hamburger-line');
    
    if (isOpen) {
      lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  }

  // ===== SCROLL EVENTS =====
  setupScrollEvents() {
    let ticking = false;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 헤더 스타일 변경
      this.updateHeaderOnScroll(currentScrollY);
      
      // 스크롤 방향 감지
      this.updateScrollDirection(currentScrollY, lastScrollY);
      
      // 맨 위로 버튼 표시/숨김
      this.updateScrollToTopButton(currentScrollY);
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    });

    // 맨 위로 버튼 설정
    this.setupScrollToTop();
  }

  // 헤더 스크롤 효과
  updateHeaderOnScroll(scrollY) {
    const header = document.querySelector('.header');
    if (!header) return;

    if (scrollY > 100) {
      header.classList.add('scrolled');
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.classList.remove('scrolled');
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = 'none';
    }
  }

  // 스크롤 방향 감지
  updateScrollDirection(current, last) {
    const header = document.querySelector('.header');
    if (!header) return;

    const direction = current > last ? 'down' : 'up';
    const distance = Math.abs(current - last);

    if (distance > 10) { // 최소 이동 거리
      if (direction === 'down' && current > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
  }

  // 맨 위로 버튼
  updateScrollToTopButton(scrollY) {
    const button = document.getElementById('scroll-to-top');
    if (!button) return;

    if (scrollY > 500) {
      button.style.display = 'flex';
      button.style.opacity = '1';
      button.style.transform = 'translateY(0)';
    } else {
      button.style.opacity = '0';
      button.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (button.style.opacity === '0') {
          button.style.display = 'none';
        }
      }, 300);
    }
  }

  // 맨 위로 스크롤 기능
  setupScrollToTop() {
    const button = document.getElementById('scroll-to-top');
    if (!button) return;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.smoothScrollTo(0);
    });
  }

  // 부드러운 스크롤
  smoothScrollTo(target, duration = 800) {
    const start = window.pageYOffset;
    const distance = target - start;
    const startTime = performance.now();

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, start + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }

  // ===== INTERSECTION OBSERVER =====
  setupIntersectionObserver() {
    // 요소가 뷰포트에 들어올 때 애니메이션 실행
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 애니메이션할 요소들 관찰
    document.querySelectorAll('.fade-in, .slide-up, .feature-card, .product-card, .stat').forEach(el => {
      observer.observe(el);
    });

    this.observers.set('main', observer);
  }

  // 요소 애니메이션
  animateElement(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });

    // 숫자 카운트 애니메이션
    if (element.classList.contains('stat')) {
      this.animateCounter(element);
    }
  }

  // 숫자 카운트 애니메이션
  animateCounter(element) {
    const counter = element.querySelector('[data-count]');
    if (!counter) return;

    const target = parseFloat(counter.dataset.count);
    const duration = 2000;
    const start = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = target * this.easeOutQuart(progress);
      
      if (target % 1 === 0) {
        counter.textContent = Math.floor(current).toLocaleString();
      } else {
        counter.textContent = current.toFixed(1);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        counter.textContent = target % 1 === 0 ? target.toLocaleString() : target.toFixed(1);
      }
    };

    requestAnimationFrame(animate);
  }

  // 이징 함수
  easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
  }

  // ===== FORM HANDLERS =====
  setupFormHandlers() {
    // 견적 요청 폼
    const quoteForm = document.getElementById('quick-quote-form');
    if (quoteForm) {
      this.setupQuoteForm(quoteForm);
    }

    // 일반 폼 검증
    document.querySelectorAll('form').forEach(form => {
      this.setupFormValidation(form);
    });
  }

  // 실시간 견적 계산
  setupQuoteForm(form) {
    const calculateBtn = document.getElementById('calculate-quote');
    const resultDiv = document.getElementById('quote-result');
    
    if (!calculateBtn || !resultDiv) return;

    // 실시간 입력 감지
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', this.debounce(() => {
        this.validateInput(input);
      }, 300));
    });

    // 견적 계산 버튼
    calculateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.calculateQuote(form, resultDiv);
    });
  }

  // 견적 계산 로직
  async calculateQuote(form, resultDiv) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // 유효성 검사
    if (!this.validateQuoteForm(data)) {
      this.showError(resultDiv, '모든 필수 항목을 입력해주세요.');
      return;
    }

    // 로딩 표시
    this.showLoading(resultDiv);

    try {
      // 견적 계산 (실제 API 연동 시 교체)
      const quote = await this.mockCalculateQuote(data);
      this.displayQuoteResult(resultDiv, quote);
      
      // 정식 견적서 요청 버튼 표시
      const requestBtn = form.querySelector('.btn-request-quote');
      if (requestBtn) {
        requestBtn.style.display = 'inline-flex';
      }
      
    } catch (error) {
      this.showError(resultDiv, '견적 계산 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Quote calculation error:', error);
    }
  }

  // 모의 견적 계산 (실제 API로 교체 필요)
  async mockCalculateQuote(data) {
    // 실제 계산 로직 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { productType, innerDiameter, outerDiameter, length, quantity, deliveryLocation } = data;
    
    // 기본 단가 (USD per meter)
    const basePrices = {
      medical: 15.0,
      semiconductor: 25.0,
      chemical: 12.0,
      'food-grade': 18.0
    };

    const basePrice = basePrices[productType] || 15.0;
    const diameter = parseFloat(outerDiameter);
    const len = parseFloat(length);
    const qty = parseInt(quantity);

    // 직경에 따른 가격 조정
    const diameterMultiplier = Math.max(1, diameter / 10);
    
    // 수량 할인
    const quantityDiscount = qty >= 100 ? 0.15 : qty >= 50 ? 0.10 : qty >= 20 ? 0.05 : 0;
    
    // 배송비
    const shippingCosts = {
      korea: 0,
      japan: 50,
      china: 80,
      taiwan: 60
    };

    const unitPrice = basePrice * diameterMultiplier * (1 - quantityDiscount);
    const totalMaterialCost = unitPrice * len * qty;
    const shippingCost = shippingCosts[deliveryLocation] || 100;
    const totalPrice = totalMaterialCost + shippingCost;

    return {
      productType,
      specifications: { innerDiameter, outerDiameter, length, quantity },
      pricing: {
        unitPrice: unitPrice.toFixed(2),
        materialCost: totalMaterialCost.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        discount: (quantityDiscount * 100).toFixed(0),
        currency: 'USD'
      },
      leadTime: this.calculateLeadTime(qty),
      validUntil: this.getValidUntilDate()
    };
  }

  // 납기일 계산
  calculateLeadTime(quantity) {
    const baseDays = 7;
    const additionalDays = Math.ceil(quantity / 100) * 3;
    return Math.min(baseDays + additionalDays, 30);
  }

  // 견적 유효기간
  getValidUntilDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('ko-KR');
  }

  // 견적 결과 표시
  displayQuoteResult(container, quote) {
    const { pricing, leadTime, validUntil } = quote;
    
    container.innerHTML = `
      <div class="quote-result-card">
        <div class="quote-header">
          <h3>💰 견적 결과</h3>
          <span class="quote-valid">유효기간: ${validUntil}까지</span>
        </div>
        
        <div class="quote-breakdown">
          <div class="quote-row">
            <span>단가 (USD/m):</span>
            <strong>$${pricing.unitPrice}</strong>
          </div>
          <div class="quote-row">
            <span>재료비:</span>
            <strong>$${pricing.materialCost}</strong>
          </div>
          <div class="quote-row">
            <span>배송비:</span>
            <strong>$${pricing.shippingCost}</strong>
          </div>
          ${pricing.discount > 0 ? `
            <div class="quote-row discount">
              <span>수량 할인:</span>
              <strong>-${pricing.discount}%</strong>
            </div>
          ` : ''}
          <div class="quote-row total">
            <span>총 금액:</span>
            <strong>$${pricing.totalPrice}</strong>
          </div>
        </div>
        
        <div class="quote-info">
          <div class="info-item">
            <span class="info-icon">🚚</span>
            <span>예상 납기: ${leadTime}일</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📞</span>
            <span>24시간 기술지원 포함</span>
          </div>
        </div>
        
        <div class="quote-actions">
          <button type="button" class="btn btn-primary" onclick="window.print()">
            📄 견적서 출력
          </button>
          <a href="/quote/request.html" class="btn btn-secondary">
            📋 정식 견적서 요청
          </a>
        </div>
      </div>
    `;

    // 애니메이션 효과
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    });
  }

  // 로딩 표시
  showLoading(container) {
    container.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>견적 계산 중...</p>
      </div>
    `;
  }

  // 에러 표시
  showError(container, message) {
    container.innerHTML = `
      <div class="error-message">
        <span class="error-icon">⚠️</span>
        <p>${message}</p>
      </div>
    `;
  }

  // 견적 폼 유효성 검사
  validateQuoteForm(data) {
    const required = ['productType', 'innerDiameter', 'outerDiameter', 'length', 'quantity', 'deliveryLocation'];
    return required.every(field => data[field] && data[field].trim() !== '');
  }

  // 입력 필드 유효성 검사
  validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let message = '';

    // 필수 필드 검사
    if (input.required && !value) {
      isValid = false;
      message = '이 필드는 필수입니다.';
    }

    // 숫자 필드 검사
    if (type === 'number' && value) {
      const num = parseFloat(value);
      const min = parseFloat(input.min);
      const max = parseFloat(input.max);

      if (isNaN(num)) {
        isValid = false;
        message = '올바른 숫자를 입력해주세요.';
      } else if (min && num < min) {
        isValid = false;
        message = `최소값은 ${min}입니다.`;
      } else if (max && num > max) {
        isValid = false;
        message = `최대값은 ${max}입니다.`;
      }
    }

    // 이메일 검사
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = '올바른 이메일 형식을 입력해주세요.';
      }
    }

    // 전화번호 검사
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        message = '올바른 전화번호를 입력해주세요.';
      }
    }

    this.updateInputValidation(input, isValid, message);
    return isValid;
  }

  // 입력 필드 검증 UI 업데이트
  updateInputValidation(input, isValid, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    // 기존 에러 메시지 제거
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // 클래스 업데이트
    formGroup.classList.toggle('error', !isValid);
    formGroup.classList.toggle('valid', isValid && input.value.trim());

    // 에러 메시지 추가
    if (!isValid && message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      formGroup.appendChild(errorDiv);
    }
  }

  // 폼 검증 설정
  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // 실시간 검증
      input.addEventListener('blur', () => this.validateInput(input));
      input.addEventListener('input', this.debounce(() => this.validateInput(input), 300));
    });

    form.addEventListener('submit', (e) => {
      let isFormValid = true;
      
      inputs.forEach(input => {
        if (!this.validateInput(input)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        e.preventDefault();
        const firstError = form.querySelector('.form-group.error input');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }

  // ===== KEYBOARD NAVIGATION =====
  setupKeyboardNavigation() {
    // Tab 키 네비게이션 개선
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // 드롭다운 메뉴 키보드 네비게이션
    this.setupDropdownKeyboard();
  }

  // 드롭다운 키보드 네비게이션
  setupDropdownKeyboard() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.nav-link');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (!toggle || !menu) return;

      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          menu.classList.toggle('active');
          const firstLink = menu.querySelector('a');
          if (firstLink) firstLink.focus();
        }
      });

      menu.addEventListener('keydown', (e) => {
        const links = menu.querySelectorAll('a');
        const currentIndex = Array.from(links).indexOf(document.activeElement);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % links.length;
            links[nextIndex].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
            links[prevIndex].focus();
            break;
          case 'Escape':
            menu.classList.remove('active');
            toggle.focus();
            break;
        }
      });
    });
  }

  // ===== PERFORMANCE MONITORING =====
  setupPerformanceMonitoring() {
    // Web Vitals 측정
    if ('PerformanceObserver' in window) {
      this.measureLCP();
      this.measureFID();
      this.measureCLS();
    }

    // 이미지 지연 로딩
    this.setupLazyLoading();
  }

  // Largest Contentful Paint 측정
  measureLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // First Input Delay 측정
  measureFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    observer.observe({ entryTypes: ['first-input'] });
  }

  // Cumulative Layout Shift 측정
  measureCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  }

  // 이미지 지연 로딩
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ===== RESIZE HANDLER =====
  setupResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    // 모바일 메뉴 정리
    if (window.innerWidth > this.mobileBreakpoint) {
      const menu = document.querySelector('.navbar-menu');
      const overlay = document.querySelector('.mobile-menu-overlay');
      
      if (menu) menu.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // 헤더 높이 재계산
    this.updateHeaderHeight();
  }

  updateHeaderHeight() {
    const header = document.querySelector('.header');
    if (header) {
      const height = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    }
  }

  // ===== COMPONENT INITIALIZATION =====
  initializeComponents() {
    // 스무스 스크롤 링크
    this.setupSmoothScrollLinks();
    
    // 툴팁
    this.setupTooltips();
    
    // 모달
    this.setupModals();
    
    // 탭
    this.setupTabs();
  }

  // 스무스 스크롤 링크
  setupSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight;
          
          this.smoothScrollTo(targetPosition);
        }
      });
    });
  }

  // 툴팁 설정
  setupTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, e.target.dataset.tooltip);
      });

      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.transform = 'translateX(-50%)';
  }

  hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  // 모달 설정
  setupModals() {
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) {
          this.openModal(modal);
        }
      });
    });

    document.querySelectorAll('.modal-close, .modal-overlay').forEach(closer => {
      closer.addEventListener('click', (e) => {
        const modal = closer.closest('.modal');
        if (modal) {
          this.closeModal(modal);
        }
      });
    });
  }

  openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 포커스 관리
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 탭 설정
  setupTabs() {
    document.querySelectorAll('.tab-nav').forEach(nav => {
      const buttons = nav.querySelectorAll('.tab-button');
      const panels = nav.closest('.tabs').querySelectorAll('.tab-panel');

      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          // 모든 버튼과 패널 비활성화
          buttons.forEach(btn => btn.classList.remove('active'));
          panels.forEach(panel => panel.classList.remove('active'));

          // 선택된 버튼과 패널 활성화
          button.classList.add('active');
          if (panels[index]) {
            panels[index].classList.add('active');
          }
        });
      });
    });
  }

  // ===== UTILITY FUNCTIONS =====
  
  // 디바운스 함수
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
  }

  // 쓰로틀 함수
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
    };
  }

  // 요소가 뷰포트에 있는지 확인
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // 로컬 스토리지 헬퍼
  storage = {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('localStorage not available');
      }
    },
    
    get: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn('localStorage not available');
        return null;
      }
    },
    
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('localStorage not available');
      }
    }
  };
}

// ===== CSS 스타일 추가 (JavaScript로 동적 생성) =====
const addDynamicStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* 견적 결과 스타일 */
    .quote-result-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }

    .quote-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .quote-header h3 {
      margin: 0;
      color: #1e5cb3;
      font-size: 20px;
    }

    .quote-valid {
      font-size: 14px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 4px 12px;
      border-radius: 20px;
    }

    .quote-breakdown {
      margin-bottom: 20px;
    }

    .quote-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .quote-row.discount {
      color: #10b981;
    }

    .quote-row.total {
      font-size: 18px;
      font-weight: 600;
      color: #1e5cb3;
      border-bottom: 2px solid #1e5cb3;
      margin-top: 12px;
      padding-top: 12px;
    }

    .quote-info {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #4b5563;
    }

    .info-icon {
      font-size: 16px;
    }

    .quote-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* 로딩 스피너 */
    .loading-spinner {
      text-align: center;
      padding: 40px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #1e5cb3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* 에러 메시지 */
    .error-message {
      color: #ef4444;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      margin-top: 8px;
    }

    .error-icon {
      font-size: 16px;
    }

    /* 폼 검증 스타일 */
    .form-group.error input,
    .form-group.error select {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-group.valid input,
    .form-group.valid select {
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    /* 모바일 메뉴 오버레이 */
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .mobile-menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* 키보드 네비게이션 */
    .keyboard-navigation *:focus {
      outline: 2px solid #1e5cb3 !important;
      outline-offset: 2px !important;
    }

    /* 툴팁 */
    .tooltip {
      position: absolute;
      background: #1f2937;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 1000;
      pointer-events: none;
      white-space: nowrap;
    }

    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: #1f2937;
    }

    /* 반응형 조정 */
    @media (max-width: 768px) {
      .quote-actions {
        flex-direction: column;
      }

      .quote-info {
        flex-direction: column;
        gap: 12px;
      }

      .quote-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `;
  
  document.head.appendChild(style);
};

// ===== 애플리케이션 시작 =====
document.addEventListener('DOMContentLoaded', () => {
  addDynamicStyles();
  window.pureFlonApp = new PureFlonApp();
});

// ===== 전역 유틸리티 함수 (다른 스크립트에서 사용 가능) =====
window.PureFlon = {
  // 부드러운 스크롤
  scrollTo: (target, duration = 800) => {
    if (window.pureFlonApp) {
      window.pureFlonApp.smoothScrollTo(target, duration);
    }
  },

  // 툴팁 표시
  showTooltip: (element, text) => {
    if (window.pureFlonApp) {
      window.pureFlonApp.showTooltip(element, text);
    }
  },

  // 모달 열기
  openModal: (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal && window.pureFlonApp) {
      window.pureFlonApp.openModal(modal);
    }
  },

  // 스토리지 헬퍼
  storage: {
    set: (key, value) => {
      if (window.pureFlonApp) {
        window.pureFlonApp.storage.set(key, value);
      }
    },
    get: (key) => {
      return window.pureFlonApp ? window.pureFlonApp.storage.get(key) : null;
    }
  }
};