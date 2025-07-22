/* 
파일명: js/main.js
Pure-Flon PTFE 튜브 B2B 웹사이트 - 메인 자바스크립트
업데이트: 2025-01-22 v3.0.0
개선사항: ES6+ 모듈화, 성능 최적화, 보안 강화, 견적 시스템 완성, PWA 지원
*/

'use strict';

// ========================================================================================
// Global Configuration & State Management
// ========================================================================================

class PureFlonConfig {
    constructor() {
        this.config = window.PURE_FLON_CONFIG || {};
        this.supabaseClient = null;
        this.isProduction = this.config.ENVIRONMENT === 'production';
        this.version = this.config.VERSION || '3.0.0';
        
        // 성능 모니터링 설정
        this.performance = {
            startTime: performance.now(),
            metrics: new Map(),
            vitals: new Map()
        };
    }

    async init() {
        try {
            console.log(`🚀 Pure-Flon App v${this.version} 초기화 시작...`);
            
            // Supabase 초기화 (선택적)
            if (this.config.SUPABASE_URL && this.config.SUPABASE_ANON_KEY) {
                await this.initSupabase();
            } else {
                console.warn('⚠️ Supabase 설정이 필요합니다. 기본 기능만 활성화됩니다.');
            }
            
            // 성능 측정 시작
            this.initPerformanceMonitoring();
            
            console.log('✅ Pure-Flon Config 초기화 완료');
            return true;
        } catch (error) {
            console.error('❌ Config 초기화 실패:', error);
            return false;
        }
    }

    async initSupabase() {
        try {
            if (!window.supabase) {
                console.log('📦 Supabase 라이브러리 로딩 대기 중...');
                await this.waitForSupabase();
            }
            
            this.supabaseClient = window.supabase.createClient(
                this.config.SUPABASE_URL,
                this.config.SUPABASE_ANON_KEY,
                {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: false
                    },
                    realtime: {
                        params: {
                            eventsPerSecond: 10
                        }
                    }
                }
            );
            
            console.log('✅ Supabase 초기화 완료');
            return true;
        } catch (error) {
            console.error('❌ Supabase 초기화 실패:', error);
            return false;
        }
    }

    async waitForSupabase() {
        return new Promise((resolve, reject) => {
            const checkSupabase = () => {
                if (window.supabase) {
                    resolve();
                } else {
                    setTimeout(checkSupabase, 100);
                }
            };
            checkSupabase();
            
            // 10초 타임아웃
            setTimeout(() => reject(new Error('Supabase 로딩 타임아웃')), 10000);
        });
    }

    initPerformanceMonitoring() {
        if (!this.isProduction) return;

        // Core Web Vitals 모니터링
        this.measureLCP();
        this.measureCLS();
        this.measureINP();
        
        // 커스텀 메트릭
        this.performance.metrics.set('init_time', performance.now() - this.performance.startTime);
    }

    measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performance.vitals.set('lcp', lastEntry.startTime);
                
                if (this.isProduction) {
                    this.reportVital('lcp', lastEntry.startTime);
                }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    measureCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.performance.vitals.set('cls', clsValue);
                
                if (this.isProduction) {
                    this.reportVital('cls', clsValue);
                }
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    measureINP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const maxDuration = Math.max(...entries.map(entry => entry.duration));
                this.performance.vitals.set('inp', maxDuration);
                
                if (this.isProduction) {
                    this.reportVital('inp', maxDuration);
                }
            });
            observer.observe({ entryTypes: ['event'] });
        }
    }

    reportVital(name, value) {
        // 프로덕션에서 분석 도구로 데이터 전송
        if (typeof gtag !== 'undefined') {
            gtag('event', name, {
                event_category: 'Web Vitals',
                value: Math.round(name === 'cls' ? value * 1000 : value),
                non_interaction: true
            });
        }
    }
}

// ========================================================================================
// Enhanced Navigation System
// ========================================================================================

class NavigationManager {
    constructor() {
        this.mobileMenu = null;
        this.navToggle = null;
        this.dropdowns = [];
        this.currentPath = window.location.pathname;
        this.isMenuOpen = false;
    }

    init() {
        try {
            this.setupElements();
            this.setupMobileMenu();
            this.setupDropdowns();
            this.setupSmoothScroll();
            this.setupActiveStates();
            this.setupKeyboardNavigation();
            
            // 리사이즈 이벤트 처리 (throttled)
            this.handleResize = this.throttle(this.handleResize.bind(this), 250);
            window.addEventListener('resize', this.handleResize);
            
            console.log('✅ Navigation 초기화 완료');
            return true;
        } catch (error) {
            console.error('❌ Navigation 초기화 실패:', error);
            return false;
        }
    }

    setupElements() {
        this.mobileMenu = document.getElementById('nav-mobile');
        this.navToggle = document.querySelector('.nav-toggle');
        this.dropdowns = document.querySelectorAll('.nav__item--dropdown');
        
        if (!this.mobileMenu || !this.navToggle) {
            throw new Error('필수 네비게이션 요소를 찾을 수 없습니다.');
        }
    }

    setupMobileMenu() {
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // 모바일 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.mobileMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // ESC 키로 메뉴 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.mobileMenu.classList.add('active');
        this.navToggle.classList.add('active');
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.mobileMenu.setAttribute('aria-hidden', 'false');
        
        // 스크롤 방지
        document.body.style.overflow = 'hidden';
        
        // 포커스 트랩
        this.trapFocus(this.mobileMenu);
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.mobileMenu.setAttribute('aria-hidden', 'true');
        
        // 스크롤 복원
        document.body.style.overflow = '';
    }

    setupDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav__link');
            const menu = dropdown.querySelector('.nav__dropdown');
            
            if (!link || !menu) return;

            let hoverTimeout;

            // 마우스 이벤트
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                this.openDropdown(dropdown);
            });

            dropdown.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    this.closeDropdown(dropdown);
                }, 300);
            });

            // 키보드 이벤트
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(dropdown);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.openDropdown(dropdown);
                    this.focusFirstMenuItem(menu);
                }
            });

            // 메뉴 항목 키보드 네비게이션
            const menuItems = menu.querySelectorAll('a');
            menuItems.forEach((item, index) => {
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextItem = menuItems[index + 1] || menuItems[0];
                        nextItem.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                        prevItem.focus();
                    } else if (e.key === 'Escape') {
                        this.closeDropdown(dropdown);
                        link.focus();
                    }
                });
            });
        });
    }

    openDropdown(dropdown) {
        const menu = dropdown.querySelector('.nav__dropdown');
        const link = dropdown.querySelector('.nav__link');
        
        menu.classList.add('active');
        link.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
    }

    closeDropdown(dropdown) {
        const menu = dropdown.querySelector('.nav__dropdown');
        const link = dropdown.querySelector('.nav__link');
        
        menu.classList.remove('active');
        link.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
    }

    toggleDropdown(dropdown) {
        const menu = dropdown.querySelector('.nav__dropdown');
        if (menu.classList.contains('active')) {
            this.closeDropdown(dropdown);
        } else {
            this.openDropdown(dropdown);
        }
    }

    focusFirstMenuItem(menu) {
        const firstItem = menu.querySelector('a');
        if (firstItem) firstItem.focus();
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (!target) return;
                
                e.preventDefault();
                
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // 포커스 관리
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.addEventListener('blur', () => {
                    target.removeAttribute('tabindex');
                }, { once: true });
            });
        });
    }

    setupActiveStates() {
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === this.currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    setupKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        // Tab 키 순서 최적화
        focusableElements.forEach((el, index) => {
            if (!el.hasAttribute('tabindex') || el.getAttribute('tabindex') === '0') {
                el.setAttribute('tabindex', '0');
            }
        });
    }

    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement.focus();
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
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
            }
        });
    }

    handleResize() {
        if (window.innerWidth >= 1024 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

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
}

// ========================================================================================
// Advanced Quote System
// ========================================================================================

class QuoteSystem {
    constructor(config) {
        this.config = config;
        this.currentStep = 1;
        this.maxSteps = 4;
        this.quoteData = {
            customer: {},
            products: [],
            specifications: {},
            specialRequirements: '',
            estimatedValue: 0
        };
        this.modal = null;
        this.form = null;
        this.isSubmitting = false;
    }

    init() {
        try {
            this.setupQuoteButtons();
            this.createQuoteModal();
            console.log('✅ Quote System 초기화 완료');
            return true;
        } catch (error) {
            console.error('❌ Quote System 초기화 실패:', error);
            return false;
        }
    }

    setupQuoteButtons() {
        const selectors = [
            '[onclick*="showQuoteModal"]',
            '.quote-btn',
            '.btn-quote',
            '[href="#quote"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(button => {
                // onclick 속성 제거하고 이벤트 리스너 추가
                button.removeAttribute('onclick');
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productType = button.dataset.productType || 'general';
                    this.showQuoteModal(productType);
                });
            });
        });
    }

    createQuoteModal() {
        const modalHTML = `
            <div id="quote-modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
                <div class="modal__backdrop"></div>
                <div class="modal__container">
                    <div class="modal__header">
                        <h2 id="modal-title" class="modal__title">PTFE 튜브 견적 요청</h2>
                        <button type="button" class="modal__close" aria-label="모달 닫기">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="modal__progress">
                        <div class="progress-bar">
                            <div class="progress-bar__fill" style="width: 25%"></div>
                        </div>
                        <div class="progress-steps">
                            <span class="step active">1. 제품 선택</span>
                            <span class="step">2. 사양 입력</span>
                            <span class="step">3. 고객 정보</span>
                            <span class="step">4. 확인</span>
                        </div>
                    </div>
                    
                    <div class="modal__content">
                        <form id="quote-form" class="quote-form" novalidate>
                            <!-- Step 1: 제품 선택 -->
                            <div class="form-step active" data-step="1">
                                <h3 class="step-title">어떤 PTFE 튜브가 필요하신가요?</h3>
                                <div class="product-grid">
                                    <label class="product-option">
                                        <input type="radio" name="productType" value="medical" required>
                                        <div class="product-card-mini">
                                            <div class="product-icon">🏥</div>
                                            <h4>의료용 PTFE 튜브</h4>
                                            <p>FDA 승인, 생체적합성</p>
                                            <div class="product-specs">
                                                <span>내경: 0.5-50mm</span>
                                                <span>순도: 99.9%</span>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label class="product-option">
                                        <input type="radio" name="productType" value="semiconductor" required>
                                        <div class="product-card-mini">
                                            <div class="product-icon">💾</div>
                                            <h4>반도체용 PTFE 튜브</h4>
                                            <p>초고순도, 정전기 방지</p>
                                            <div class="product-specs">
                                                <span>내경: 1-30mm</span>
                                                <span>순도: 99.99%</span>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label class="product-option">
                                        <input type="radio" name="productType" value="chemical" required>
                                        <div class="product-card-mini">
                                            <div class="product-icon">⚗️</div>
                                            <h4>화학용 PTFE 튜브</h4>
                                            <p>내화학성, 고압 지원</p>
                                            <div class="product-specs">
                                                <span>내경: 2-100mm</span>
                                                <span>압력: 150 bar</span>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label class="product-option">
                                        <input type="radio" name="productType" value="industrial" required>
                                        <div class="product-card-mini">
                                            <div class="product-icon">🏭</div>
                                            <h4>산업용 PTFE 튜브</h4>
                                            <p>범용, 고온 내성</p>
                                            <div class="product-specs">
                                                <span>내경: 1-200mm</span>
                                                <span>온도: -50~200°C</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Step 2: 사양 입력 -->
                            <div class="form-step" data-step="2">
                                <h3 class="step-title">필요한 사양을 입력해주세요</h3>
                                <div class="spec-grid">
                                    <div class="form-group">
                                        <label for="innerDiameter">내경 (mm) *</label>
                                        <input type="number" id="innerDiameter" name="innerDiameter" step="0.1" min="0.1" max="200" required>
                                        <div class="input-help">소수점 가능 (예: 12.5)</div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="outerDiameter">외경 (mm)</label>
                                        <input type="number" id="outerDiameter" name="outerDiameter" step="0.1" min="0.1" max="220">
                                        <div class="input-help">미입력 시 표준 벽두께 적용</div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="length">길이 (m) *</label>
                                        <input type="number" id="length" name="length" step="1" min="1" max="5000" required>
                                        <div class="input-help">최소 주문: 10m</div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="quantity">수량 *</label>
                                        <input type="number" id="quantity" name="quantity" step="1" min="1" max="10000" required>
                                        <div class="input-help">개수 단위</div>
                                    </div>
                                    
                                    <div class="form-group full-width">
                                        <label for="workingTemperature">작동 온도 범위</label>
                                        <div class="temp-range">
                                            <input type="number" name="minTemp" placeholder="최소 온도 (°C)" step="1">
                                            <span>~</span>
                                            <input type="number" name="maxTemp" placeholder="최대 온도 (°C)" step="1">
                                        </div>
                                    </div>
                                    
                                    <div class="form-group full-width">
                                        <label for="workingPressure">작동 압력 (bar)</label>
                                        <input type="number" id="workingPressure" name="workingPressure" step="0.1" min="0" max="300">
                                    </div>
                                    
                                    <div class="form-group full-width">
                                        <label>화학물질 접촉 여부</label>
                                        <div class="checkbox-group">
                                            <label class="checkbox-item">
                                                <input type="checkbox" name="chemicals" value="acids">
                                                <span>강산 (HCl, H2SO4 등)</span>
                                            </label>
                                            <label class="checkbox-item">
                                                <input type="checkbox" name="chemicals" value="bases">
                                                <span>강염기 (NaOH, KOH 등)</span>
                                            </label>
                                            <label class="checkbox-item">
                                                <input type="checkbox" name="chemicals" value="solvents">
                                                <span>유기용매</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Step 3: 고객 정보 -->
                            <div class="form-step" data-step="3">
                                <h3 class="step-title">연락처 정보를 입력해주세요</h3>
                                <div class="customer-grid">
                                    <div class="form-group">
                                        <label for="companyName">회사명 *</label>
                                        <input type="text" id="companyName" name="companyName" required maxlength="100">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="contactName">담당자명 *</label>
                                        <input type="text" id="contactName" name="contactName" required maxlength="50">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="email">이메일 *</label>
                                        <input type="email" id="email" name="email" required maxlength="100">
                                        <div class="input-help">견적서가 발송될 이메일</div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="phone">연락처</label>
                                        <input type="tel" id="phone" name="phone" maxlength="20">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="country">국가 *</label>
                                        <select id="country" name="country" required>
                                            <option value="">선택하세요</option>
                                            <option value="KR">🇰🇷 대한민국</option>
                                            <option value="JP">🇯🇵 일본</option>
                                            <option value="TW">🇹🇼 대만</option>
                                            <option value="CN">🇨🇳 중국</option>
                                            <option value="TH">🇹🇭 태국</option>
                                            <option value="VN">🇻🇳 베트남</option>
                                            <option value="ID">🇮🇩 인도네시아</option>
                                            <option value="MY">🇲🇾 말레이시아</option>
                                            <option value="SG">🇸🇬 싱가포르</option>
                                            <option value="US">🇺🇸 미국</option>
                                            <option value="OTHER">기타</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="urgency">납기 요구사항</label>
                                        <select id="urgency" name="urgency">
                                            <option value="standard">표준 (2-3주)</option>
                                            <option value="fast">신속 (1-2주)</option>
                                            <option value="urgent">긴급 (1주 이내)</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group full-width">
                                        <label for="specialRequirements">특수 요구사항</label>
                                        <textarea id="specialRequirements" name="specialRequirements" rows="4" maxlength="500" 
                                                  placeholder="특별한 인증서, 테스트, 포장 요구사항 등이 있으시면 기재해 주세요."></textarea>
                                        <div class="char-count">0/500</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Step 4: 확인 -->
                            <div class="form-step" data-step="4">
                                <h3 class="step-title">견적 요청 내용을 확인해주세요</h3>
                                <div id="quote-summary" class="quote-summary">
                                    <!-- 자동으로 생성됨 -->
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal__footer">
                        <button type="button" class="btn btn--outline" id="prev-step" style="display: none;">이전</button>
                        <button type="button" class="btn btn--primary" id="next-step">다음</button>
                        <button type="submit" form="quote-form" class="btn btn--primary" id="submit-quote" style="display: none;">
                            <span class="btn-text">견적 요청하기</span>
                            <div class="btn-spinner" style="display: none;">
                                <svg class="spinner" width="20" height="20" viewBox="0 0 50 50">
                                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('quote-modal');
        this.form = document.getElementById('quote-form');
        
        this.setupModalEvents();
    }

    setupModalEvents() {
        if (!this.modal) return;

        // 모달 닫기
        const closeBtn = this.modal.querySelector('.modal__close');
        const backdrop = this.modal.querySelector('.modal__backdrop');
        
        closeBtn?.addEventListener('click', () => this.hideQuoteModal());
        backdrop?.addEventListener('click', () => this.hideQuoteModal());
        
        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.hidden) {
                this.hideQuoteModal();
            }
        });

        // 스텝 네비게이션
        const nextBtn = document.getElementById('next-step');
        const prevBtn = document.getElementById('prev-step');
        
        nextBtn?.addEventListener('click', () => this.nextStep());
        prevBtn?.addEventListener('click', () => this.prevStep());

        // 폼 제출
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitQuote();
        });

        // 실시간 유효성 검사
        this.setupFormValidation();
        
        // 자동 계산
        this.setupAutoCalculation();
    }

    setupFormValidation() {
        const inputs = this.form?.querySelectorAll('input, select, textarea') || [];
        
        inputs.forEach(input => {
            // 실시간 유효성 검사
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
            
            // 특수 처리
            if (input.name === 'specialRequirements') {
                input.addEventListener('input', this.updateCharCount.bind(this));
            }
            
            if (input.name === 'outerDiameter') {
                input.addEventListener('input', this.calculateWallThickness.bind(this));
            }
        });
    }

    setupAutoCalculation() {
        const calculationFields = ['innerDiameter', 'length', 'quantity', 'productType'];
        
        calculationFields.forEach(fieldName => {
            const field = this.form?.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('input', this.debounce(() => {
                    this.calculateEstimate();
                }, 500));
            }
        });
    }

    showQuoteModal(productType = 'general') {
        if (!this.modal) return;

        // 제품 타입 사전 선택
        if (productType !== 'general') {
            const productInput = this.modal.querySelector(`[name="productType"][value="${productType}"]`);
            if (productInput) {
                productInput.checked = true;
                this.updateProductSpecs(productType);
            }
        }

        // 모달 표시
        this.modal.hidden = false;
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // 첫 번째 입력 필드에 포커스
        const firstInput = this.modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }

        // 포커스 트랩
        this.trapFocus(this.modal);
    }

    hideQuoteModal() {
        if (!this.modal) return;

        this.modal.hidden = true;
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        
        // 초기화
        this.resetQuoteForm();
    }

    nextStep() {
        if (this.currentStep >= this.maxSteps) return;
        
        if (!this.validateCurrentStep()) return;
        
        this.currentStep++;
        this.updateStepDisplay();
        
        if (this.currentStep === this.maxSteps) {
            this.generateSummary();
        }
    }

    prevStep() {
        if (this.currentStep <= 1) return;
        
        this.currentStep--;
        this.updateStepDisplay();
    }

    updateStepDisplay() {
        // 스텝 표시 업데이트
        const steps = this.modal?.querySelectorAll('.form-step') || [];
        const stepIndicators = this.modal?.querySelectorAll('.progress-steps .step') || [];
        const progressBar = this.modal?.querySelector('.progress-bar__fill');
        
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });
        
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 <= this.currentStep);
            indicator.classList.toggle('completed', index + 1 < this.currentStep);
        });
        
        if (progressBar) {
            progressBar.style.width = `${(this.currentStep / this.maxSteps) * 100}%`;
        }

        // 버튼 표시 업데이트
        const nextBtn = document.getElementById('next-step');
        const prevBtn = document.getElementById('prev-step');
        const submitBtn = document.getElementById('submit-quote');
        
        if (nextBtn) nextBtn.style.display = this.currentStep < this.maxSteps ? 'inline-flex' : 'none';
        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
        if (submitBtn) submitBtn.style.display = this.currentStep === this.maxSteps ? 'inline-flex' : 'none';
    }

    validateCurrentStep() {
        const currentStepElement = this.modal?.querySelector(`[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return false;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // 필수 필드 검사
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = '필수 입력 항목입니다.';
        }
        
        // 타입별 유효성 검사
        if (value) {
            switch (field.type) {
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        isValid = false;
                        errorMessage = '올바른 이메일 형식을 입력해주세요.';
                    }
                    break;
                    
                case 'number':
                    const num = parseFloat(value);
                    if (isNaN(num)) {
                        isValid = false;
                        errorMessage = '숫자를 입력해주세요.';
                    } else if (field.hasAttribute('min') && num < parseFloat(field.min)) {
                        isValid = false;
                        errorMessage = `최소값은 ${field.min}입니다.`;
                    } else if (field.hasAttribute('max') && num > parseFloat(field.max)) {
                        isValid = false;
                        errorMessage = `최대값은 ${field.max}입니다.`;
                    }
                    break;
                    
                case 'tel':
                    if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
                        isValid = false;
                        errorMessage = '올바른 전화번호 형식을 입력해주세요.';
                    }
                    break;
            }
        }
        
        // 특수 검사
        if (field.name === 'innerDiameter' && value) {
            const productType = this.form?.querySelector('[name="productType"]:checked')?.value;
            const diameter = parseFloat(value);
            
            if (productType === 'medical' && (diameter < 0.5 || diameter > 50)) {
                isValid = false;
                errorMessage = '의료용 튜브 내경은 0.5-50mm 범위입니다.';
            } else if (productType === 'semiconductor' && (diameter < 1 || diameter > 30)) {
                isValid = false;
                errorMessage = '반도체용 튜브 내경은 1-30mm 범위입니다.';
            }
        }
        
        // 에러 표시
        this.showFieldError(field, isValid ? '' : errorMessage);
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.id = `${field.id || field.name}-error`;
            field.setAttribute('aria-describedby', errorElement.id);
            
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    updateCharCount() {
        const textarea = this.form?.querySelector('[name="specialRequirements"]');
        const counter = this.modal?.querySelector('.char-count');
        
        if (textarea && counter) {
            const count = textarea.value.length;
            const max = parseInt(textarea.getAttribute('maxlength') || '500');
            counter.textContent = `${count}/${max}`;
            counter.classList.toggle('warning', count > max * 0.9);
        }
    }

    calculateWallThickness() {
        const innerDiameter = parseFloat(this.form?.querySelector('[name="innerDiameter"]')?.value || '0');
        const outerDiameter = parseFloat(this.form?.querySelector('[name="outerDiameter"]')?.value || '0');
        
        if (innerDiameter && outerDiameter && outerDiameter > innerDiameter) {
            const wallThickness = (outerDiameter - innerDiameter) / 2;
            const display = this.modal?.querySelector('.wall-thickness-display');
            
            if (display) {
                display.textContent = `벽두께: ${wallThickness.toFixed(2)}mm`;
                display.style.display = 'block';
            }
        }
    }

    calculateEstimate() {
        const formData = this.getFormData();
        if (!formData.productType || !formData.innerDiameter || !formData.length || !formData.quantity) {
            return;
        }
        
        // 간단한 견적 계산 로직 (실제로는 서버에서 계산)
        const basePrice = this.getBasePrice(formData.productType);
        const sizeMultiplier = this.getSizeMultiplier(formData.innerDiameter);
        const quantityDiscount = this.getQuantityDiscount(formData.quantity);
        
        const unitPrice = basePrice * sizeMultiplier;
        const totalLength = formData.length * formData.quantity;
        const subtotal = unitPrice * totalLength;
        const discount = subtotal * quantityDiscount;
        const estimated = subtotal - discount;
        
        this.quoteData.estimatedValue = estimated;
        
        // 실시간 견적 표시 (옵션)
        this.updateEstimateDisplay(estimated);
    }

    getBasePrice(productType) {
        const basePrices = {
            'medical': 15000,     // KRW per meter
            'semiconductor': 25000,
            'chemical': 12000,
            'industrial': 8000
        };
        return basePrices[productType] || 10000;
    }

    getSizeMultiplier(diameter) {
        if (diameter < 5) return 1.0;
        if (diameter < 10) return 1.2;
        if (diameter < 25) return 1.5;
        if (diameter < 50) return 2.0;
        return 3.0;
    }

    getQuantityDiscount(quantity) {
        if (quantity >= 1000) return 0.15;
        if (quantity >= 500) return 0.10;
        if (quantity >= 100) return 0.05;
        return 0;
    }

    updateEstimateDisplay(amount) {
        const estimateElement = this.modal?.querySelector('.estimate-display');
        if (estimateElement) {
            const formatted = new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW'
            }).format(amount);
            estimateElement.textContent = `예상 견적: ${formatted}`;
            estimateElement.style.display = 'block';
        }
    }

    generateSummary() {
        const formData = this.getFormData();
        const summaryElement = document.getElementById('quote-summary');
        
        if (!summaryElement) return;
        
        const productTypeNames = {
            'medical': '의료용 PTFE 튜브',
            'semiconductor': '반도체용 PTFE 튜브', 
            'chemical': '화학용 PTFE 튜브',
            'industrial': '산업용 PTFE 튜브'
        };
        
        summaryElement.innerHTML = `
            <div class="summary-section">
                <h4>제품 정보</h4>
                <div class="summary-item">
                    <span class="label">제품 유형:</span>
                    <span class="value">${productTypeNames[formData.productType] || '선택되지 않음'}</span>
                </div>
                <div class="summary-item">
                    <span class="label">내경:</span>
                    <span class="value">${formData.innerDiameter}mm</span>
                </div>
                ${formData.outerDiameter ? `
                    <div class="summary-item">
                        <span class="label">외경:</span>
                        <span class="value">${formData.outerDiameter}mm</span>
                    </div>
                ` : ''}
                <div class="summary-item">
                    <span class="label">길이:</span>
                    <span class="value">${formData.length}m × ${formData.quantity}개</span>
                </div>
                <div class="summary-item">
                    <span class="label">총 길이:</span>
                    <span class="value">${formData.length * formData.quantity}m</span>
                </div>
            </div>
            
            <div class="summary-section">
                <h4>고객 정보</h4>
                <div class="summary-item">
                    <span class="label">회사명:</span>
                    <span class="value">${formData.companyName}</span>
                </div>
                <div class="summary-item">
                    <span class="label">담당자:</span>
                    <span class="value">${formData.contactName}</span>
                </div>
                <div class="summary-item">
                    <span class="label">이메일:</span>
                    <span class="value">${formData.email}</span>
                </div>
                <div class="summary-item">
                    <span class="label">국가:</span>
                    <span class="value">${this.getCountryName(formData.country)}</span>
                </div>
            </div>
            
            ${this.quoteData.estimatedValue > 0 ? `
                <div class="summary-section estimate-section">
                    <h4>예상 견적</h4>
                    <div class="estimate-amount">
                        ${new Intl.NumberFormat('ko-KR', {
                            style: 'currency',
                            currency: 'KRW'
                        }).format(this.quoteData.estimatedValue)}
                    </div>
                    <div class="estimate-note">
                        * 실제 견적은 정확한 사양 검토 후 제공됩니다.
                    </div>
                </div>
            ` : ''}
            
            <div class="summary-notice">
                <div class="notice-icon">ℹ️</div>
                <div class="notice-content">
                    <p>견적 요청을 제출하시면 24시간 내에 담당자가 연락드립니다.</p>
                    <p>정확한 견적을 위해 추가 정보가 필요할 수 있습니다.</p>
                </div>
            </div>
        `;
    }

    getCountryName(countryCode) {
        const countries = {
            'KR': '🇰🇷 대한민국',
            'JP': '🇯🇵 일본',
            'TW': '🇹🇼 대만',
            'CN': '🇨🇳 중국',
            'TH': '🇹🇭 태국',
            'VN': '🇻🇳 베트남',
            'ID': '🇮🇩 인도네시아',
            'MY': '🇲🇾 말레이시아',
            'SG': '🇸🇬 싱가포르',
            'US': '🇺🇸 미국',
            'OTHER': '기타'
        };
        return countries[countryCode] || countryCode;
    }

    async submitQuote() {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        this.updateSubmitButton(true);
        
        try {
            const formData = this.getFormData();
            
            // 클라이언트 유효성 검사
            if (!this.validateQuoteData(formData)) {
                throw new Error('입력 정보를 확인해주세요.');
            }
            
            // 견적 데이터 준비
            const quoteData = {
                ...formData,
                estimatedValue: this.quoteData.estimatedValue,
                submittedAt: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                sessionId: this.generateSessionId()
            };
            
            // 서버로 전송
            const result = await this.sendQuoteToServer(quoteData);
            
            if (result.success) {
                this.showSuccessMessage(result.quoteId);
                this.hideQuoteModal();
                
                // 분석 추적
                this.trackQuoteSubmission(quoteData);
            } else {
                throw new Error(result.message || '견적 요청 처리 중 오류가 발생했습니다.');
            }
            
        } catch (error) {
            console.error('견적 제출 실패:', error);
            this.showErrorMessage(error.message);
        } finally {
            this.isSubmitting = false;
            this.updateSubmitButton(false);
        }
    }

    async sendQuoteToServer(quoteData) {
        try {
            // Supabase를 사용한 견적 저장
            if (this.config.supabaseClient) {
                const { data, error } = await this.config.supabaseClient
                    .from('quote_requests')
                    .insert([{
                        customer_info: {
                            company: quoteData.companyName,
                            contact: quoteData.contactName,
                            email: quoteData.email,
                            phone: quoteData.phone,
                            country: quoteData.country
                        },
                        product_config: {
                            type: quoteData.productType,
                            innerDiameter: quoteData.innerDiameter,
                            outerDiameter: quoteData.outerDiameter,
                            length: quoteData.length,
                            quantity: quoteData.quantity,
                            workingPressure: quoteData.workingPressure,
                            temperatureRange: {
                                min: quoteData.minTemp,
                                max: quoteData.maxTemp
                            },
                            chemicals: quoteData.chemicals,
                            specialRequirements: quoteData.specialRequirements
                        },
                        estimated_value: quoteData.estimatedValue,
                        urgency: quoteData.urgency,
                        status: 'pending',
                        source: 'website',
                        created_at: quoteData.submittedAt
                    }]);
                
                if (error) throw error;
                
                return {
                    success: true,
                    quoteId: data[0]?.id || 'QT' + Date.now()
                };
            } else {
                // Fallback: 로컬 저장 및 이메일 전송 요청
                this.saveQuoteLocally(quoteData);
                await this.sendQuoteByEmail(quoteData);
                
                return {
                    success: true,
                    quoteId: 'QT' + Date.now()
                };
            }
        } catch (error) {
            console.error('서버 전송 실패:', error);
            
            // 실패 시 로컬 저장
            this.saveQuoteLocally(quoteData);
            
            return {
                success: true,
                quoteId: 'QT' + Date.now(),
                offline: true
            };
        }
    }

    saveQuoteLocally(quoteData) {
        try {
            const quotes = JSON.parse(localStorage.getItem('pure_flon_quotes') || '[]');
            quotes.push({
                ...quoteData,
                id: 'QT' + Date.now(),
                savedAt: new Date().toISOString()
            });
            localStorage.setItem('pure_flon_quotes', JSON.stringify(quotes));
            console.log('💾 견적 로컬 저장 완료');
        } catch (error) {
            console.error('로컬 저장 실패:', error);
        }
    }

    async sendQuoteByEmail(quoteData) {
        // mailto 링크를 통한 이메일 전송 (fallback)
        const subject = encodeURIComponent(`[Pure-Flon] 견적 요청 - ${quoteData.companyName}`);
        const body = encodeURIComponent(this.generateEmailBody(quoteData));
        
        window.open(`mailto:sales@pure-flon.com?subject=${subject}&body=${body}`, '_blank');
    }

    generateEmailBody(quoteData) {
        return `
견적 요청 정보:

■ 고객 정보
- 회사명: ${quoteData.companyName}
- 담당자: ${quoteData.contactName}
- 이메일: ${quoteData.email}
- 전화: ${quoteData.phone || 'N/A'}
- 국가: ${this.getCountryName(quoteData.country)}

■ 제품 정보
- 제품 유형: ${quoteData.productType}
- 내경: ${quoteData.innerDiameter}mm
- 외경: ${quoteData.outerDiameter || '표준'}mm
- 길이: ${quoteData.length}m
- 수량: ${quoteData.quantity}개
- 총 길이: ${quoteData.length * quoteData.quantity}m

■ 운용 조건
- 작동 압력: ${quoteData.workingPressure || 'N/A'} bar
- 온도 범위: ${quoteData.minTemp || 'N/A'}°C ~ ${quoteData.maxTemp || 'N/A'}°C
- 화학물질: ${(quoteData.chemicals || []).join(', ') || 'N/A'}

■ 기타
- 납기 요구: ${quoteData.urgency || '표준'}
- 특수 요구사항: ${quoteData.specialRequirements || 'N/A'}

■ 예상 견적
- ${this.quoteData.estimatedValue > 0 ? new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
}).format(this.quoteData.estimatedValue) : 'N/A'}

요청 시간: ${new Date().toLocaleString('ko-KR')}
        `.trim();
    }

    validateQuoteData(data) {
        const required = ['productType', 'innerDiameter', 'length', 'quantity', 'companyName', 'contactName', 'email', 'country'];
        
        for (const field of required) {
            if (!data[field]) {
                console.error(`필수 필드 누락: ${field}`);
                return false;
            }
        }
        
        // 이메일 형식 확인
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            console.error('잘못된 이메일 형식');
            return false;
        }
        
        // 숫자 필드 확인
        const numericFields = ['innerDiameter', 'length', 'quantity'];
        for (const field of numericFields) {
            if (isNaN(parseFloat(data[field])) || parseFloat(data[field]) <= 0) {
                console.error(`잘못된 숫자 필드: ${field}`);
                return false;
            }
        }
        
        return true;
    }

    getFormData() {
        if (!this.form) return {};
        
        const formData = new FormData(this.form);
        const data = {};
        
        // 기본 필드
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // 체크박스 배열 처리
        const chemicals = formData.getAll('chemicals');
        data.chemicals = chemicals;
        
        // 숫자 필드 변환
        const numericFields = ['innerDiameter', 'outerDiameter', 'length', 'quantity', 'workingPressure', 'minTemp', 'maxTemp'];
        numericFields.forEach(field => {
            if (data[field]) {
                data[field] = parseFloat(data[field]);
            }
        });
        
        return data;
    }

    updateSubmitButton(isLoading) {
        const button = document.getElementById('submit-quote');
        const text = button?.querySelector('.btn-text');
        const spinner = button?.querySelector('.btn-spinner');
        
        if (button && text && spinner) {
            button.disabled = isLoading;
            text.style.display = isLoading ? 'none' : 'inline';
            spinner.style.display = isLoading ? 'inline-flex' : 'none';
            
            if (isLoading) {
                button.setAttribute('aria-busy', 'true');
            } else {
                button.removeAttribute('aria-busy');
            }
        }
    }

    showSuccessMessage(quoteId) {
        const message = `
            견적 요청이 성공적으로 접수되었습니다!
            
            견적 번호: ${quoteId}
            
            24시간 내에 담당자가 연락드리겠습니다.
            감사합니다.
        `;
        
        alert(message); // 실제로는 toast 알림이나 모달로 대체
        
        // 성공 페이지로 리다이렉트 (옵션)
        // window.location.href = `/quote-success?id=${quoteId}`;
    }

    showErrorMessage(message) {
        const errorMessage = `
            견적 요청 처리 중 문제가 발생했습니다.
            
            ${message}
            
            직접 연락 주시기 바랍니다:
            📧 sales@pure-flon.com
            📞 +82-32-123-4567
        `;
        
        alert(errorMessage); // 실제로는 toast 알림이나 모달로 대체
    }

    trackQuoteSubmission(quoteData) {
        // Google Analytics 추적
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quote_request', {
                event_category: 'engagement',
                event_label: quoteData.productType,
                value: Math.round(quoteData.estimatedValue || 0)
            });
        }
        
        // 내부 분석 (선택적)
        if (this.config.isProduction) {
            console.log('📊 Quote tracking:', {
                productType: quoteData.productType,
                country: quoteData.country,
                estimatedValue: quoteData.estimatedValue
            });
        }
    }

    resetQuoteForm() {
        this.currentStep = 1;
        this.quoteData = {
            customer: {},
            products: [],
            specifications: {},
            specialRequirements: '',
            estimatedValue: 0
        };
        
        if (this.form) {
            this.form.reset();
        }
        
        this.updateStepDisplay();
        
        // 에러 메시지 클리어
        const errorElements = this.modal?.querySelectorAll('.field-error') || [];
        errorElements.forEach(el => el.remove());
        
        const errorFields = this.modal?.querySelectorAll('.error') || [];
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        });
    }

    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

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

    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
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
            }
        });
    }
}

// ========================================================================================
// Enhanced Animation System
// ========================================================================================

class AnimationManager {
    constructor() {
        this.observer = null;
        this.animatedElements = new WeakSet();
        this.counterElements = new Map();
    }

    init() {
        try {
            this.setupScrollAnimations();
            this.setupCounterAnimations();
            this.setupParallaxEffects();
            console.log('✅ Animation Manager 초기화 완료');
            return true;
        } catch (error) {
            console.error('❌ Animation Manager 초기화 실패:', error);
            return false;
        }
    }

    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: 모든 애니메이션 요소를 즉시 표시
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('animate-in');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animatedElements.add(entry.target);
                    
                    // 딜레이 적용 (옵션)
                    const delay = entry.target.dataset.delay || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                        
                        // 카운터 애니메이션 트리거
                        if (entry.target.querySelector('[data-count]')) {
                            this.triggerCounterAnimation(entry.target);
                        }
                    }, parseInt(delay));
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }

    setupCounterAnimations() {
        document.querySelectorAll('[data-count]').forEach(element => {
            const target = parseFloat(element.dataset.count);
            this.counterElements.set(element, {
                target,
                current: 0,
                hasAnimated: false
            });
        });
    }

    triggerCounterAnimation(container) {
        const counterElements = container.querySelectorAll('[data-count]');
        
        counterElements.forEach(element => {
            const data = this.counterElements.get(element);
            if (!data || data.hasAnimated) return;
            
            data.hasAnimated = true;
            this.animateCounter(element, data.target);
        });
    }

    animateCounter(element, target) {
        const duration = 2000; // 2초
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            
            if (step >= steps) {
                current = target;
                clearInterval(timer);
            }
            
            // 숫자 포맷팅
            if (target >= 1000) {
                element.textContent = new Intl.NumberFormat('ko-KR').format(Math.floor(current)) + '+';
            } else {
                element.textContent = current.toFixed(target < 10 ? 1 : 0) + (target < 10 ? '%' : '+');
            }
        }, stepDuration);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed || 0.5);
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.animatedElements = new WeakSet();
        this.counterElements.clear();
    }
}

// ========================================================================================
// Image Optimization Manager
// ========================================================================================

class ImageManager {
    constructor() {
        this.lazyImages = [];
        this.imageObserver = null;
        this.loadedImages = new WeakSet();
    }

    init() {
        try {
            this.setupLazyLoading();
            this.setupErrorHandling();
            this.setupProgressiveLoading();
            console.log('✅ Image Manager 초기화 완료');
            return true;
        } catch (error) {
            console.error('❌ Image Manager 초기화 실패:', error);
            return false;
        }
    }

    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: 모든 이미지를 즉시 로드
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.loadImage(img);
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            this.lazyImages.push(img);
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        if (this.loadedImages.has(img)) return;
        
        const src = img.dataset.src || img.src;
        if (!src) return;

        // 프리로더 생성
        const preloader = new Image();
        
        preloader.onload = () => {
            this.loadedImages.add(img);
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            
            // 페이드 인 효과
            img.style.opacity = '0';
            requestAnimationFrame(() => {
                img.style.transition = 'opacity 0.3s ease-in-out';
                img.style.opacity = '1';
            });
        };

        preloader.onerror = () => {
            this.handleImageError(img);
        };

        preloader.src = src;
    }

    setupErrorHandling() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.dataset.errorHandled) {
                img.addEventListener('error', (e) => this.handleImageError(e.target));
                img.dataset.errorHandled = 'true';
            }
        });
    }

    handleImageError(img) {
        if (img.dataset.fallbackSrc && img.src !== img.dataset.fallbackSrc) {
            img.src = img.dataset.fallbackSrc;
            return;
        }

        // 플레이스홀더 이미지 생성
        const alt = img.alt || 'Pure-Flon PTFE';
        const width = img.width || 400;
        const height = img.height || 300;
        const placeholderUrl = `https://via.placeholder.com/${width}x${height}/1e5cb3/ffffff?text=${encodeURIComponent(alt)}`;
        
        if (img.src !== placeholderUrl) {
            console.warn(`이미지 로딩 실패, 플레이스홀더로 교체: ${img.src}`);
            img.src = placeholderUrl;
            img.classList.add('placeholder-image');
        }
    }

    setupProgressiveLoading() {
        // Progressive JPEG 및 WebP 지원
        const supportsWebP = this.checkWebPSupport();
        const supportsAVIF = this.checkAVIFSupport();

        document.querySelectorAll('picture').forEach(picture => {
            const sources = picture.querySelectorAll('source');
            sources.forEach(source => {
                const srcset = source.srcset;
                if (srcset) {
                    if (!supportsWebP && srcset.includes('.webp')) {
                        source.remove();
                    } else if (!supportsAVIF && srcset.includes('.avif')) {
                        source.remove();
                    }
                }
            });
        });
    }

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    checkAVIFSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    }

    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
            this.imageObserver = null;
        }
        this.lazyImages = [];
        this.loadedImages = new WeakSet();
    }
}

// ========================================================================================
// Main Application Class
// ========================================================================================

class PureFlonApp {
    constructor() {
        this.config = new PureFlonConfig();
        this.navigation = new NavigationManager();
        this.quoteSystem = null;
        this.animations = new AnimationManager();
        this.imageManager = new ImageManager();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            console.log('🚀 Pure-Flon Application 초기화 시작...');

            // Config 초기화 (Supabase 포함)
            await this.config.init();

            // Quote System 초기화 (Config 필요)
            this.quoteSystem = new QuoteSystem(this.config);
            
            // 모든 매니저 초기화
            const managers = [
                this.navigation,
                this.quoteSystem,
                this.animations,
                this.imageManager
            ];

            const results = await Promise.allSettled(
                managers.map(manager => Promise.resolve(manager.init()))
            );

            // 초기화 결과 확인
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Manager ${index} 초기화 실패:`, result.reason);
                }
            });

            // 글로벌 이벤트 리스너
            this.setupGlobalEvents();
            
            // 성능 모니터링 시작
            this.startPerformanceMonitoring();

            this.isInitialized = true;
            console.log('✅ Pure-Flon Application 초기화 완료');

        } catch (error) {
            console.error('❌ Application 초기화 실패:', error);
        }
    }

    setupGlobalEvents() {
        // 전역 에러 처리
        window.addEventListener('error', (e) => {
            console.error('전역 에러:', e.error);
            this.reportError('JavaScript Error', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('처리되지 않은 Promise 에러:', e.reason);
            this.reportError('Promise Rejection', e.reason);
        });

        // 페이지 가시성 변경
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onPageVisible();
            } else {
                this.onPageHidden();
            }
        });

        // 온라인/오프라인 상태
        window.addEventListener('online', () => this.onOnline());
        window.addEventListener('offline', () => this.onOffline());
    }

    onPageVisible() {
        // 페이지가 다시 보일 때 필요한 작업
        console.log('📱 페이지가 활성화됨');
    }

    onPageHidden() {
        // 페이지가 숨겨질 때 필요한 작업
        console.log('📱 페이지가 비활성화됨');
    }

    onOnline() {
        console.log('🌐 온라인 상태');
        // 오프라인 중 저장된 데이터 동기화
        this.syncOfflineData();
    }

    onOffline() {
        console.log('📴 오프라인 상태');
        // 오프라인 모드 알림
        this.showOfflineNotification();
    }

    async syncOfflineData() {
        try {
            const offlineQuotes = JSON.parse(localStorage.getItem('pure_flon_quotes') || '[]');
            
            if (offlineQuotes.length > 0 && this.config.supabaseClient) {
                for (const quote of offlineQuotes) {
                    await this.config.supabaseClient
                        .from('quote_requests')
                        .insert([quote]);
                }
                
                localStorage.removeItem('pure_flon_quotes');
                console.log('✅ 오프라인 데이터 동기화 완료');
            }
        } catch (error) {
            console.error('❌ 오프라인 데이터 동기화 실패:', error);
        }
    }

    showOfflineNotification() {
        // 오프라인 알림 표시 (실제로는 toast나 banner로 구현)
        console.log('📴 오프라인 모드입니다. 데이터는 연결 복구 시 전송됩니다.');
    }

    reportError(type, error) {
        if (!this.config.isProduction) return;

        // 에러 리포팅 서비스에 전송 (Sentry 등)
        console.log(`📊 Error Report: ${type}`, error);
        
        // Google Analytics에도 전송
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: error.toString(),
                fatal: false
            });
        }
    }

    startPerformanceMonitoring() {
        if (!this.config.isProduction) return;

        // 주기적 성능 체크
        setInterval(() => {
            if (performance.memory) {
                const memoryInfo = performance.memory;
                const memoryUsage = (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100;
                
                if (memoryUsage > 80) {
                    console.warn('⚠️ 높은 메모리 사용량 감지:', memoryUsage.toFixed(2) + '%');
                }
            }
        }, 30000); // 30초마다 체크
    }

    destroy() {
        this.animations?.destroy();
        this.imageManager?.destroy();
        this.isInitialized = false;
        console.log('🛑 Pure-Flon Application 종료');
    }
}

// ========================================================================================
// Application Bootstrap
// ========================================================================================

// 전역 앱 인스턴스 생성
const PureFlonAppInstance = new PureFlonApp();

// DOM 준비 상태에 따른 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PureFlonAppInstance.init());
} else {
    PureFlonAppInstance.init();
}

// 전역 객체로 노출 (기존 코드 호환성)
window.PureFlonApp = {
    quoteSystem: {
        showQuoteModal: (productType) => {
            if (PureFlonAppInstance.quoteSystem) {
                PureFlonAppInstance.quoteSystem.showQuoteModal(productType);
            }
        }
    }
};

// 디버깅용 전역 노출 (개발 환경에서만)
if (!PureFlonAppInstance.config.isProduction) {
    window.__PureFlonApp = PureFlonAppInstance;
}

// 성능 측정 완료
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ 페이지 로드 완료: ${loadTime.toFixed(2)}ms`);
    
    // Core Web Vitals 최종 측정
    setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            console.log('📊 Navigation Timing:', {
                DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
                Connect: navigation.connectEnd - navigation.connectStart,
                TTFB: navigation.responseStart - navigation.requestStart,
                Download: navigation.responseEnd - navigation.responseStart,
                DOM: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                Load: navigation.loadEventEnd - navigation.loadEventStart
            });
        }
    }, 0);
});

// Hot Module Replacement (개발용)
if (module && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        PureFlonAppInstance.destroy();
    });
}