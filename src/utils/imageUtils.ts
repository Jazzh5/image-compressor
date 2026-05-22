import type { OutputFormat } from '@/types'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getMimeType(format: OutputFormat): string {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    default:
      return ''
  }
}

export function getFileExtension(format: OutputFormat, originalName: string): string {
  const extMap: Record<OutputFormat, string> = {
    original: originalName.split('.').pop() || 'png',
    jpeg: 'jpg',
    png: 'png',
    webp: 'webp',
  }
  return extMap[format]
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

export function isValidImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

function applyPngQuantization(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  quality: number
) {
  const imageData = ctx.getImageData(0, 0, width, height)
  if (!imageData) return

  const step = Math.max(1, Math.round((1 - quality) * 25))
  if (step <= 1) return

  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step
    data[i + 1] = Math.round(data[i + 1] / step) * step
    data[i + 2] = Math.round(data[i + 2] / step) * step
  }

  ctx.putImageData(imageData, 0, 0)
}

function isPngType(file: File, outputFormat: OutputFormat): boolean {
  if (outputFormat === 'png') return true
  if (outputFormat === 'original' && file.type === 'image/png') return true
  return false
}

export function compressImage(
  file: File,
  quality: number,
  outputFormat: OutputFormat
): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const fileUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(fileUrl)

      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0)

      if (isPngType(file, outputFormat)) {
        applyPngQuantization(ctx, canvas.width, canvas.height, quality)
      }

      const mimeType = outputFormat === 'original' ? file.type : getMimeType(outputFormat)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'))
            return
          }
          const compressedUrl = URL.createObjectURL(blob)
          resolve({ blob, url: compressedUrl })
        },
        mimeType,
        outputFormat === 'png' ? undefined : quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(fileUrl)
      reject(new Error('Failed to load image'))
    }

    img.src = fileUrl
  })
}