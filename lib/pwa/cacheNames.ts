/**
 * Cache Storage bucket names — shared between the app and the Service Worker.
 *
 * ⚠️  public/sw.js cannot import this module (it runs in the SW global scope),
 * so it declares the SAME string literals. If you change a value here, update
 * public/sw.js to match (SHELL_CACHE / IMAGE_CACHE / MAP_TILES_CACHE).
 *
 * Versioning policy:
 *  - SHELL_CACHE is bumped on every deploy (holds shells, RSC, hashed /_next/static).
 *  - IMAGE_CACHE and MAP_TILES_CACHE are durable and survive deploys so that
 *    images and map tiles are NOT re-downloaded on every release.
 */
export const SHELL_CACHE = 'najat-shell-v27'
export const IMAGE_CACHE = 'najat-images-v1'
export const MAP_TILES_CACHE = 'najat-map-tiles-v1'
