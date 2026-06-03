export const AVATAR_CROP_VIEWPORT = 280
export const AVATAR_CROP_OUTPUT = 256

export type AvatarCropState = {
  offsetX: number
  offsetY: number
  scale: number
}

export function computeCoverScale(
  imageWidth: number,
  imageHeight: number,
  viewport: number,
): number {
  return Math.max(viewport / imageWidth, viewport / imageHeight)
}

export function clampCropOffset(
  offsetX: number,
  offsetY: number,
  imageWidth: number,
  imageHeight: number,
  scale: number,
  viewport: number,
): { offsetX: number; offsetY: number } {
  const width = imageWidth * scale
  const height = imageHeight * scale

  return {
    offsetX: Math.min(0, Math.max(viewport - width, offsetX)),
    offsetY: Math.min(0, Math.max(viewport - height, offsetY)),
  }
}

/** Top-aligned for tall portraits; centered otherwise. */
export function getInitialCropOffset(
  imageWidth: number,
  imageHeight: number,
  scale: number,
  viewport: number,
): { offsetX: number; offsetY: number } {
  const width = imageWidth * scale
  const height = imageHeight * scale
  const offsetX = (viewport - width) / 2
  const offsetY =
    height > viewport ? 0 : (viewport - height) / 2

  return clampCropOffset(offsetX, offsetY, imageWidth, imageHeight, scale, viewport)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('تعذّر تحميل الصورة'))
    img.src = src
  })
}

export async function cropAvatarToDataUrl(
  imageSrc: string,
  crop: AvatarCropState,
  viewport = AVATAR_CROP_VIEWPORT,
  outputSize = AVATAR_CROP_OUTPUT,
): Promise<string> {
  const img = await loadImage(imageSrc)
  const ratio = outputSize / viewport
  const canvas = document.createElement('canvas')
  canvas.width = outputSize
  canvas.height = outputSize
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('تعذّر معالجة الصورة')

  ctx.beginPath()
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()

  ctx.drawImage(
    img,
    crop.offsetX * ratio,
    crop.offsetY * ratio,
    img.width * crop.scale * ratio,
    img.height * crop.scale * ratio,
  )

  let quality = 0.88
  let dataUrl = canvas.toDataURL('image/jpeg', quality)
  while (dataUrl.length > 800_000 && quality > 0.45) {
    quality -= 0.08
    dataUrl = canvas.toDataURL('image/jpeg', quality)
  }

  if (dataUrl.length > 800_000) {
    throw new Error('حجم الصورة كبير جداً بعد القص — جرّب صورة أصغر')
  }

  return dataUrl
}
