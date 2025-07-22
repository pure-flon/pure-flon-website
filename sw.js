/* ================================
   Pure-Flon PTFE Website - Service Worker v2.0
   PWA + Offline Support + Caching Strategy
   ================================ */

const CACHE_NAME = 'pureflon-v2.0.1';
const CACHE_VERSION = '2.0.1';

// 즉시 캐시할 중요 리소스
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/images/logo.svg',
  '/offline.html' // 오프라인 페이지
];

// 런타임 캐시할 리소스 패턴
const RUNTIME_CACHE_PATTERNS = [
  /\/products\/.+\.html$/,
  /\/images\/.+\.(jpg|jpeg|png|webp|avif|svg)$/,
  /\.(?:css|js)$/,
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//,
  /^https:\/\/cdnjs\.cloudflare\.com\//
];

// 캐시 전략별 설정
const CACHE_STRATEGIES = {
  // 핵심 앱 셸 - Cache First
  appShell: {
    cacheName: `${CACHE_NAME}-app-shell`,
    strategy: 'cacheFirst',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    maxEntries: 50
  },
  
  // 이미지 - Cache First with Update
  images: {
    cacheName: `${CACHE_NAME}-images`,
    strategy: 'cacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
    maxEntries: 100
  },
  
  // API 응답 - Network First
  api: {
    cacheName: `${CACHE_NAME}-api`,
    strategy: 'networkFirst',
    maxAge: 5 * 60 * 1000, // 5분
    maxEntries: 50
  },
  
  // 외부 리소스 - Stale While Revalidate
  external: {
    cacheName: `${CACHE_NAME}-external`,
    strategy: 'staleWhileRevalidate',
    maxAge: 24 * 60 * 60 * 1000, // 1일
    maxEntries: 30
  }
};

// ================================
// Service Worker 이벤트 핸들러
// ================================

// 설치 이벤트
self.addEventListener('install', event => {
  console.log(`🔧 Service Worker v${CACHE_VERSION} 설치 중...`);
  
  event.waitUntil(
    (async () => {
      try {
        // 앱 셸 캐시 생성
        const cache = await caches.open(CACHE_STRATEGIES.appShell.cacheName);
        
        // 중요 리소스 캐시
        await cache.addAll(CRITICAL_RESOURCES);
        console.log('✅ 중요 리소스 캐시 완료');
        
        // 즉시 활성화
        await self.skipWaiting();
        
      } catch (error) {
        console.error('❌ Service Worker 설치 실패:', error);
      }
    })()
  );
});

// 활성화 이벤트
self.addEventListener('activate', event => {
  console.log(`🚀 Service Worker v${CACHE_VERSION} 활성화 중...`);
  
  event.waitUntil(
    (async () => {
      try {
        // 기존 캐시 정리
        await cleanupOldCaches();
        
        // 모든 클라이언트 제어
        await self.clients.claim();
        
        console.log('✅ Service Worker 활성화 완료');
      } catch (error) {
        console.error('❌ Service Worker 활성화 실패:', error);
      }
    })()
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 특정 요청 제외
  if (shouldSkipRequest(request)) {
    return;
  }
  
  // 요청 유형별 처리
  event.respondWith(handleRequest(request));
});

// 백그라운드 동기화
self.addEventListener('sync', event => {
  console.log('🔄 백그라운드 동기화:', event.tag);
  
  if (event.tag === 'quote-submission') {
    event.waitUntil(syncOfflineQuotes());
  }
});

// 푸시 알림
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    tag: data.tag || 'default',
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const { action, data } = event;
  
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window' });
      
      // 기존 창이 있으면 포커스
      if (clients.length > 0) {
        await clients[0].focus();
        return;
      }
      
      // 새 창 열기
      await self.clients.openWindow(data?.url || '/');
    })()
  );
});

// ================================
// 핵심 함수들
// ================================

// 요청 처리 라우터
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // HTML 페이지 처리
    if (request.mode === 'navigate') {
      return await handleNavigationRequest(request);
    }
    
    // 이미지 처리
    if (isImageRequest(request)) {
      return await handleWithStrategy(request, CACHE_STRATEGIES.images);
    }
    
    // CSS/JS 처리
    if (isStaticAssetRequest(request)) {
      return await handleWithStrategy(request, CACHE_STRATEGIES.appShell);
    }
    
    // API 요청 처리
    if (isApiRequest(request)) {
      return await handleWithStrategy(request, CACHE_STRATEGIES.api);
    }
    
    // 외부 리소스 처리
    if (isExternalRequest(request)) {
      return await handleWithStrategy(request, CACHE_STRATEGIES.external);
    }
    
    // 기본 네트워크 요청
    return await fetch(request);
    
  } catch (error) {
    console.error('❌ 요청 처리 실패:', error);
    return await handleRequestError(request, error);
  }
}

// 네비게이션 요청 처리 (HTML 페이지)
async function handleNavigationRequest(request) {
  try {
    // 네트워크 우선 시도
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 성공한 응답은 캐시에 저장
      const cache = await caches.open(CACHE_STRATEGIES.appShell.cacheName);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
    
  } catch (error) {
    console.log('🌐 네트워크 실패, 캐시에서 찾는 중...');
    
    // 캐시에서 찾기
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 오프라인 페이지 반환
    return await caches.match('/offline.html') || 
           await caches.match('/') ||
           new Response('페이지를 찾을 수 없습니다.', { 
             status: 404, 
             statusText: 'Not Found' 
           });
  }
}

// 캐시 전략 실행
async function handleWithStrategy(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  
  switch (strategy.strategy) {
    case 'cacheFirst':
      return await cacheFirstStrategy(request, cache, strategy);
    
    case 'networkFirst':
      return await networkFirstStrategy(request, cache, strategy);
    
    case 'staleWhileRevalidate':
      return await staleWhileRevalidateStrategy(request, cache, strategy);
    
    default:
      return await fetch(request);
  }
}

// Cache First 전략
async function cacheFirstStrategy(request, cache, strategy) {
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // 캐시 만료 확인
    if (isCacheExpired(cachedResponse, strategy.maxAge)) {
      // 백그라운드에서 업데이트
      updateCacheInBackground(request, cache);
    }
    return cachedResponse;
  }
  
  // 캐시에 없으면 네트워크에서 가져오기
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await putInCache(cache, request, networkResponse.clone(), strategy);
    }
    return networkResponse;
  } catch (error) {
    return new Response('리소스를 로드할 수 없습니다.', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Network First 전략
async function networkFirstStrategy(request, cache, strategy) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await putInCache(cache, request, networkResponse.clone(), strategy);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isCacheExpired(cachedResponse, strategy.maxAge)) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate 전략
async function staleWhileRevalidateStrategy(request, cache, strategy) {
  const cachedResponse = await cache.match(request);
  
  // 백그라운드에서 네트워크 요청
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      putInCache(cache, request, response.clone(), strategy);
    }
    return response;
  }).catch(() => null);
  
  // 캐시된 응답이 있으면 즉시 반환
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // 캐시된 응답이 없으면 네트워크 응답 대기
  return await networkResponsePromise;
}

// ================================
// 유틸리티 함수들
// ================================

// 요청 타입 확인
function shouldSkipRequest(request) {
  const url = new URL(request.url);
  
  // 크롬 확장 프로그램 요청 제외
  if (url.protocol === 'chrome-extension:') return true;
  
  // POST 요청 제외 (폼 제출 등)
  if (request.method !== 'GET') return true;
  
  // 특정 경로 제외
  if (url.pathname.includes('/admin/')) return true;
  if (url.pathname.includes('/api/auth/')) return true;
  
  return false;
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname);
}

function isStaticAssetRequest(request) {
  const url = new URL(request.url);
  return /\.(css|js)$/i.test(url.pathname);
}

function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('supabase.co');
}

function isExternalRequest(request) {
  const url = new URL(request.url);
  return url.origin !== self.location.origin;
}

// 캐시 관리
async function putInCache(cache, request, response, strategy) {
  // 캐시 크기 제한 확인
  await enforceCacheLimit(cache, strategy.maxEntries);
  
  // 응답에 캐시 메타데이터 추가
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.set('sw-cached-at', Date.now().toString());
  
  const modifiedResponse = new Response(clonedResponse.body, {
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers: headers
  });
  
  await cache.put(request, modifiedResponse);
}

async function enforceCacheLimit(cache, maxEntries) {
  const keys = await cache.keys();
  
  if (keys.length >= maxEntries) {
    // 오래된 항목부터 삭제
    const deleteCount = keys.length - maxEntries + 1;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

function isCacheExpired(response, maxAge) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return false;
  
  const age = Date.now() - parseInt(cachedAt);
  return age > maxAge;
}

async function updateCacheInBackground(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response);
    }
  } catch (error) {
    console.log('백그라운드 캐시 업데이트 실패:', error);
  }
}

// 에러 처리
async function handleRequestError(request, error) {
  console.error('요청 에러:', error);
  
  // 네비게이션 요청인 경우 오프라인 페이지 반환
  if (request.mode === 'navigate') {
    return await caches.match('/offline.html') ||
           new Response('오프라인입니다.', { 
             status: 503, 
             statusText: 'Service Unavailable' 
           });
  }
  
  // 다른 요청의 경우 기본 에러 응답
  return new Response('리소스를 로드할 수 없습니다.', { 
    status: 503, 
    statusText: 'Service Unavailable' 
  });
}

// 백그라운드 동기화
async function syncOfflineQuotes() {
  try {
    console.log('📤 오프라인 견적 동기화 시작...');
    
    // 클라이언트에게 동기화 요청
    const clients = await self.clients.matchAll();
    for (const client of clients) {
      client.postMessage({
        type: 'SYNC_OFFLINE_QUOTES'
      });
    }
    
  } catch (error) {
    console.error('❌ 오프라인 견적 동기화 실패:', error);
  }
}

// 캐시 정리
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('pureflon-') && name !== CACHE_NAME && 
    !Object.values(CACHE_STRATEGIES).some(strategy => 
      strategy.cacheName === name
    )
  );
  
  await Promise.all(
    oldCaches.map(cacheName => {
      console.log(`🗑️ 오래된 캐시 삭제: ${cacheName}`);
      return caches.delete(cacheName);
    })
  );
}

// ================================
// 클라이언트 메시지 처리
// ================================

self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      event.ports[0].postMessage({
        version: CACHE_VERSION,
        caches: Object.keys(CACHE_STRATEGIES)
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('알 수 없는 메시지:', type);
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name.startsWith('pureflon-'))
      .map(name => caches.delete(name))
  );
  console.log('🗑️ 모든 캐시 삭제 완료');
}

// ================================
// 오프라인 페이지 생성
// ================================

// 오프라인 페이지가 없으면 동적 생성
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STRATEGIES.appShell.cacheName)
      .then(cache => cache.match('/offline.html'))
      .then(response => {
        if (!response) {
          // 오프라인 페이지 동적 생성
          const offlineHTML = createOfflinePage();
          return caches.open(CACHE_STRATEGIES.appShell.cacheName)
            .then(cache => cache.put('/offline.html', new Response(offlineHTML, {
              headers: { 'Content-Type': 'text/html' }
            })));
        }
      })
  );
});

function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>오프라인 - Pure-Flon</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                min-height: 100vh;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .offline-container {
                max-width: 500px;
                background: white;
                padding: 3rem;
                border-radius: 1rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .offline-title {
                font-size: 1.5rem;
                font-weight: bold;
                color: #1e293b;
                margin-bottom: 1rem;
            }
            .offline-message {
                color: #64748b;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .retry-button {
                background: #1e5cb3;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.3s;
            }
            .retry-button:hover {
                background: #0d2e5c;
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">📡</div>
            <h1 class="offline-title">인터넷 연결이 없습니다</h1>
            <p class="offline-message">
                현재 오프라인 상태입니다. 인터넷 연결을 확인하고 다시 시도해주세요.
                Pure-Flon의 일부 콘텐츠는 오프라인에서도 이용 가능합니다.
            </p>
            <button class="retry-button" onclick="window.location.reload()">
                다시 시도
            </button>
        </div>
        
        <script>
            // 온라인 상태 복구 시 자동 새로고침
            window.addEventListener('online', () => {
                window.location.reload();
            });
        </script>
    </body>
    </html>
  `;
}

console.log(`📱 Pure-Flon Service Worker v${CACHE_VERSION} 로드 완료`);
