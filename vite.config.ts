import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3001,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
          VitePWA({
          registerType: 'prompt',
          includeAssets: ['icon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'],
          workbox: {
            cleanupOutdatedCaches: true,
            skipWaiting: false,
            clientsClaim: true,
            navigateFallback: '/index.html',
            navigateFallbackDenylist: [/^\/api\//],
            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            globIgnores: ['**/*.map', '**/node_modules/**/*'],
            offlineGoogleAnalytics: false,
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache-v1',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365
                  },
                  cacheableResponse: {
                    statuses: [200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache-v1',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365
                  },
                  cacheableResponse: {
                    statuses: [200]
                  }
                }
              },
              {
                urlPattern: ({ url }) => url.pathname === '/' || url.pathname === '/index.html',
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'index-cache-v1',
                  networkTimeoutSeconds: 3,
                  matchOptions: {
                    ignoreSearch: true
                  },
                  expiration: {
                    maxEntries: 1,
                    maxAgeSeconds: 60 * 5 // 5 minutes
                  },
                  cacheableResponse: {
                    statuses: [200]
                  }
                }
              },
              {
                // Firebase Storage (Images, assets)
                urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'storage-cache-v1',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  },
                  cacheableResponse: {
                    statuses: [200]
                  }
                }
              },
              {
                // Firestore (Real-time data - handled by SDK)
                urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
                handler: 'NetworkOnly'
              }
            ]
          },
          manifest: {
            name: 'BULLBOX record',
            short_name: 'BullBox',
            description: 'Your ultimate workout record app',
            theme_color: '#e63946',
            background_color: '#121212',
            icons: [
              {
                src: 'icon.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              },
              {
                src: 'icon-192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'icon-512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ],
      define: {},
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
              'vendor-charts': ['recharts'],
              'vendor-react': ['react', 'react-dom'],
              'vendor-ai': ['@mlc-ai/web-llm', 'jsonrepair'],
            },
          },
        },
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './setupTests.ts',
        exclude: ['**/node_modules/**', '**/dist/**', '**/qa/**', '**/e2e/**'],
        server: {
          deps: {
            inline: ['@asamuzakjp/css-color']
          }
        }
      },
    };
});
