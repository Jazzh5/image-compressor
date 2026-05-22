<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useImageCompressor } from '@/composables/useImageCompressor'
import UploadZone from '@/components/UploadZone.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import PreviewCompare from '@/components/PreviewCompare.vue'
import ThumbnailList from '@/components/ThumbnailList.vue'
import DownloadButtons from '@/components/DownloadButtons.vue'
import { Sparkles, Zap, Shield } from 'lucide-vue-next'

const {
  imageFiles,
  currentIndex,
  currentImage,
  settings,
  hasImages,
  savingsPercent,
  allCompressed,
  applyToAll,
  addFiles,
  removeImage,
  selectImage,
  downloadImage,
  downloadAllAsZip,
  cleanup,
} = useImageCompressor()

const isPngFile = computed(() =>
  currentImage.value?.originalFile.type === 'image/png'
)

function handleFilesSelected(files: FileList | File[]) {
  addFiles(files)
}

function handleDownloadImage() {
  if (currentImage.value) {
    downloadImage(currentImage.value)
  }
}

onMounted(() => {
  document.title = 'Free Online Image Compressor - Compress JPEG, PNG, WebP'
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-200">
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <header class="text-center mb-12">
        <Transition
          appear
          enter-active-class="transition-all duration-700"
          enter-from-class="opacity-0 -translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
              <Sparkles class="w-3.5 h-3.5" />
              Free &amp; Secure
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Compress Images
              <span class="text-emerald-400">Without Losing Quality</span>
            </h1>
            <p class="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
              Compress JPEG, PNG, and WebP images right in your browser.
              No uploads, no servers, 100% private.
            </p>
          </div>
        </Transition>
      </header>

      <main class="space-y-8">
        <Transition
          appear
          enter-active-class="transition-all duration-700 delay-150"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <section>
            <UploadZone @files-selected="handleFilesSelected" />
          </section>
        </Transition>

        <Transition
          appear
          enter-active-class="transition-all duration-700 delay-300"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <section v-if="hasImages">
            <ThumbnailList
              :images="imageFiles"
              :current-index="currentIndex"
              @select="selectImage"
              @remove="removeImage"
            />
          </section>
        </Transition>

        <Transition
          appear
          enter-active-class="transition-all duration-700 delay-450"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <section v-if="hasImages" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <PreviewCompare
                :image="currentImage"
                :savings-percent="savingsPercent"
              />
            </div>

            <div class="space-y-6">
              <SettingsPanel
                v-model:quality="settings.quality"
                v-model:output-format="settings.outputFormat"
                v-model:apply-to-all="applyToAll"
                :disabled="!hasImages"
                :is-png-file="isPngFile"
              />

              <DownloadButtons
                :image="currentImage"
                :all-compressed="allCompressed"
                :has-images="hasImages"
                :multiple-images="imageFiles.length > 1"
                @download-image="handleDownloadImage"
                @download-all="downloadAllAsZip"
              />
            </div>
          </section>
        </Transition>
      </main>

      <footer class="mt-20 pt-10 border-t border-zinc-800">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Zap class="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-zinc-200 mb-1">Lightning Fast</h3>
              <p class="text-xs text-zinc-500">All processing happens locally in your browser. No waiting for uploads.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Shield class="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-zinc-200 mb-1">100% Private</h3>
              <p class="text-xs text-zinc-500">Your images never leave your device. Complete privacy guaranteed.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Sparkles class="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-zinc-200 mb-1">Free Forever</h3>
              <p class="text-xs text-zinc-500">No limits, no sign-ups, no hidden costs. Completely free to use.</p>
            </div>
          </div>
        </div>
        <p class="text-center text-xs text-zinc-600 mt-10">
          Free Online Image Compressor &mdash; Compress JPEG, PNG, WebP images directly in your browser
        </p>
      </footer>
    </div>
  </div>
</template>