export type OutputFormat = 'original' | 'jpeg' | 'png' | 'webp'

export interface CompressionSettings {
  quality: number
  outputFormat: OutputFormat
}

export interface ImageFile {
  id: string
  originalFile: File
  originalUrl: string
  compressedBlob: Blob | null
  compressedUrl: string | null
  originalSize: number
  compressedSize: number | null
  quality: number
  outputFormat: OutputFormat
  compressing: boolean
}

export interface BatchImageState {
  images: ImageFile[]
  currentIndex: number
}