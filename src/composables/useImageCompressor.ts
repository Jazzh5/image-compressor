import { ref, reactive, computed, watch } from 'vue'
import type { ImageFile, CompressionSettings } from '@/types'
import { compressImage, generateId, isValidImageFile } from '@/utils/imageUtils'
import JSZip from 'jszip'

export function useImageCompressor() {
  const imageFiles = ref<ImageFile[]>([])
  const currentIndex = ref<number>(-1)
  const settings = reactive<CompressionSettings>({
    quality: 0.8,
    outputFormat: 'original',
  })
  const compressingAll = ref(false)
  const applyToAll = ref(false)

  const currentImage = computed<ImageFile | null>(() => {
    if (currentIndex.value >= 0 && currentIndex.value < imageFiles.value.length) {
      return imageFiles.value[currentIndex.value]
    }
    return null
  })

  const hasImages = computed(() => imageFiles.value.length > 0)

  const savingsPercent = computed(() => {
    if (!currentImage.value?.compressedSize) return 0
    const original = currentImage.value.originalSize
    const compressed = currentImage.value.compressedSize
    if (original === 0) return 0
    return parseFloat((((original - compressed) / original) * 100).toFixed(1))
  })

  const allCompressed = computed(() =>
    imageFiles.value.length > 0 && imageFiles.value.every((img) => img.compressedBlob !== null)
  )

  async function addFiles(files: FileList | File[]) {
    const validFiles = Array.from(files).filter(isValidImageFile)
    if (validFiles.length === 0) return

    const newImages: ImageFile[] = validFiles.map((file) => ({
      id: generateId(),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      compressedBlob: null,
      compressedUrl: null,
      originalSize: file.size,
      compressedSize: null,
      quality: settings.quality,
      outputFormat: settings.outputFormat,
      compressing: false,
    }))

    const wasEmpty = imageFiles.value.length === 0
    imageFiles.value = [...imageFiles.value, ...newImages]

    const firstNewIndex = imageFiles.value.length - newImages.length
    for (let i = firstNewIndex; i < imageFiles.value.length; i++) {
      currentIndex.value = i
      await compressCurrentImage()
    }
    currentIndex.value = wasEmpty ? 0 : firstNewIndex
  }

  function removeImage(id: string) {
    const index = imageFiles.value.findIndex((img) => img.id === id)
    if (index === -1) return

    const image = imageFiles.value[index]
    if (image.compressedUrl && image.compressedUrl !== image.originalUrl) {
      URL.revokeObjectURL(image.compressedUrl)
    }
    URL.revokeObjectURL(image.originalUrl)

    imageFiles.value.splice(index, 1)

    if (imageFiles.value.length === 0) {
      currentIndex.value = -1
    } else if (currentIndex.value >= imageFiles.value.length) {
      currentIndex.value = imageFiles.value.length - 1
    } else if (currentIndex.value > index) {
      currentIndex.value--
    }
  }

  async function selectImage(id: string) {
    const index = imageFiles.value.findIndex((img) => img.id === id)
    if (index === -1) return
    currentIndex.value = index
    const image = imageFiles.value[index]
    if (!image.compressedBlob && !image.compressing) {
      await compressCurrentImage()
    }
  }

  async function compressCurrentImage() {
    if (!currentImage.value) return

    const image = currentImage.value
    image.quality = settings.quality
    image.outputFormat = settings.outputFormat

    image.compressing = true

    try {
      const prevUrl = image.compressedUrl
      const result = await compressImage(image.originalFile, settings.quality, settings.outputFormat)

      if (result.blob.size > image.originalSize) {
        if (prevUrl && prevUrl !== image.originalUrl) {
          URL.revokeObjectURL(prevUrl)
        }
        URL.revokeObjectURL(result.url)
        image.compressedBlob = image.originalFile
        image.compressedUrl = image.originalUrl
        image.compressedSize = image.originalSize
      } else {
        image.compressedBlob = result.blob
        image.compressedUrl = result.url
        image.compressedSize = result.blob.size
        if (prevUrl && prevUrl !== image.originalUrl) {
          URL.revokeObjectURL(prevUrl)
        }
      }
    } catch (err) {
      console.error('Compression failed:', err)
    } finally {
      image.compressing = false
    }
  }

  async function compressAllImages() {
    compressingAll.value = true
    const prevIndex = currentIndex.value
    for (let i = 0; i < imageFiles.value.length; i++) {
      currentIndex.value = i
      await compressCurrentImage()
    }
    currentIndex.value = prevIndex
    compressingAll.value = false
  }

  watch(
    [() => settings.quality, () => settings.outputFormat],
    async () => {
      if (applyToAll.value && hasImages.value) {
        await compressAllImages()
      } else if (currentImage.value) {
        await compressCurrentImage()
      }
    }
  )

  function downloadImage(image: ImageFile) {
    if (!image.compressedBlob) return

    const ext = image.outputFormat === 'original'
      ? image.originalFile.name.split('.').pop() || 'png'
      : image.outputFormat === 'jpeg' ? 'jpg' : image.outputFormat

    const fileName = image.originalFile.name.replace(/\.[^.]+$/, '') + '-compressed.' + ext

    const url = URL.createObjectURL(image.compressedBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async function downloadAllAsZip() {
    const zip = new JSZip()

    const validImages = imageFiles.value.filter((img) => img.compressedBlob)
    if (validImages.length === 0) return

    for (const image of validImages) {
      const ext = image.outputFormat === 'original'
        ? image.originalFile.name.split('.').pop() || 'png'
        : image.outputFormat === 'jpeg' ? 'jpg' : image.outputFormat

      const fileName = image.originalFile.name.replace(/\.[^.]+$/, '') + '-compressed.' + ext
      zip.file(fileName, image.compressedBlob!)
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'compressed-images.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function cleanup() {
    for (const image of imageFiles.value) {
      URL.revokeObjectURL(image.originalUrl)
      if (image.compressedUrl && image.compressedUrl !== image.originalUrl) {
        URL.revokeObjectURL(image.compressedUrl)
      }
    }
    imageFiles.value = []
    currentIndex.value = -1
  }

  return {
    imageFiles,
    currentIndex,
    currentImage,
    settings,
    hasImages,
    savingsPercent,
    allCompressed,
    compressingAll,
    applyToAll,
    addFiles,
    removeImage,
    selectImage,
    compressCurrentImage,
    compressAllImages,
    downloadImage,
    downloadAllAsZip,
    cleanup,
  }
}