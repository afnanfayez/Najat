/**
 * Cache Storage bucket names — shared between the app and the Service Worker.
 *
 * ⚠️  public/sw.js cannot import this module (it runs in the SW global scope),
 * so it declares the SAME string literals. If you change a value here, update
 * public/sw.js to match (SHELL_CACHE / IMAGE_CACHE / MAP_TILES_CACHE).
 *
 * Versioning policy:
 *  - SHELL_CACHE and DOC_CACHE are bumped on every deploy (BUILD_VERSION).
 *  - IMAGE_CACHE and MAP_TILES_CACHE are durable and survive deploys so that
 *    images and map tiles are NOT re-downloaded on every release.
 *
 * SHELL_CACHE (hashed /_next/static) and DOC_CACHE (page shells + RSC payloads)
 * are separate so each can carry its own entry cap. Mixed in one bucket, FIFO
 * eviction let a burst of RSC prefetches push out the static chunks needed to
 * boot offline — and the combined cache had no cap at all.
 */
const BUILD_VERSION = 'v29'

export const SHELL_CACHE = `najat-shell-${BUILD_VERSION}`
export const DOC_CACHE = `najat-docs-${BUILD_VERSION}`
export const IMAGE_CACHE = 'najat-images-v1'
export const MAP_TILES_CACHE = 'najat-map-tiles-v1'
