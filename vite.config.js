import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

const escapeRegExp = (source) => source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizePath = (id) => id.replace(/\\/g, '/');

const manualChunkGroups = [
  { name: 'vendor-tauri', patterns: ['@tauri-apps'] },
  { name: 'vendor-tiptap', patterns: ['@tiptap', 'prosemirror'] },
  { name: 'vendor-charts', patterns: ['chart.js', 'd3-scale', 'd3-shape', 'layerchart'] },
  { name: 'vendor-motion', patterns: ['motion', 'motion-start', 'svelte-motion'] },
  { name: 'vendor-pdf-export', patterns: ['jspdf', 'jspdf-autotable', 'pdfjs-dist', 'file-saver', 'ics'] },
  { name: 'vendor-qr', patterns: ['html5-qrcode', 'jsqr'] },
  { name: 'vendor-sanitization', patterns: ['dompurify', 'marked'] },
  { name: 'vendor-ui', patterns: ['bits-ui', '@lucide'] },
  { name: 'vendor-datetime', patterns: ['dayjs', '@internationalized/date'] },
];

function matchesPattern(id, pattern) {
  const regex = new RegExp(`/node_modules/${escapeRegExp(pattern)}(/|$)`);
  return regex.test(id);
}

// Custom plugin to import CSS as text when developing
function cssAsText() {
  return {
    name: 'css-as-text',
    /**
     * @param {string} id
     */
    load(id) {
      if (id.endsWith('.css?text')) {
        const cssPath = id.replace('?text', '');
        const css = fs.readFileSync(cssPath, 'utf-8');
        return `export default ${JSON.stringify(css)}`;
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  const enableDebugSourceMaps = process.env.TAURI_ENV_DEBUG === 'true';

  return {
    plugins: [
      sveltekit(),
      ...(isDev ? [cssAsText()] : []),
    ],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: 'ws',
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ['**/src-tauri/**'],
      },
    },
    envPrefix: ['VITE_', 'TAURI_ENV_*', 'TAURI_'],

    // Dependency optimization
    optimizeDeps: {
      // Pre-bundle frequently used dependencies
      include: [
        'dayjs',
        'dompurify',
        'marked',
        'js-base64',
        'clsx',
        'tailwind-merge',
        'svelte-i18n',
        '@tauri-apps/api',
        '@tauri-apps/api/core',
        '@tauri-apps/plugin-dialog',
        '@tauri-apps/plugin-notification',
        '@tauri-apps/plugin-opener',
      ],
      // Exclude heavyweight lazy-loaded modules so they stay out of the main chunk
      exclude: [
        'chart.js',
        'd3-scale',
        'd3-shape',
        'layerchart',
        'motion',
        'motion-start',
        'svelte-motion',
        'jspdf',
        'jspdf-autotable',
        'pdfjs-dist',
        'file-saver',
        'ics',
        'html5-qrcode',
        'jsqr',
      ],
    },

    // Production build optimizations
    build: {
      // Target modern Chromium/WebKit versions used by Tauri
      target: ['es2021', 'chrome114'],
      // Enable CSS code splitting for better browser caching
      cssCodeSplit: true,
      // Use hidden source maps when explicitly debugging
      sourcemap: enableDebugSourceMaps ? 'hidden' : false,
      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug'],
        },
      },
      rollupOptions: {
        treeshake: {
          preset: 'recommended',
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
        output: {
          // Consistent chunk naming for long-lived caching
          entryFileNames: 'entries/[name]-[hash].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks(id) {
            const normalized = normalizePath(id);
            if (!normalized.includes('/node_modules/')) {
              return undefined;
            }

            for (const group of manualChunkGroups) {
              if (group.patterns.some((pattern) => matchesPattern(normalized, pattern))) {
                return group.name;
              }
            }

            return 'vendor';
          },
        },
      },
      // Slightly tighter warning limit encourages keeping chunks lean
      chunkSizeWarningLimit: 800,
    },
  };
});
