<script setup lang="ts">
import type { ImageFile } from '@/types'
import { Download, Archive } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  image: ImageFile | null
  allCompressed: boolean
  hasImages: boolean
  multipleImages: boolean
}>()

const emit = defineEmits<{
  downloadImage: []
  downloadAll: []
}>()

const zipping = ref(false)

async function handleDownloadAll() {
  zipping.value = true
  emit('downloadAll')
  setTimeout(() => {
    zipping.value = false
  }, 1500)
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 delay-200"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
  >
    <div v-if="hasImages" class="flex flex-wrap gap-3">
      <button
        type="button"
        :disabled="!image?.compressedBlob"
        class="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-emerald-500 text-zinc-900 hover:bg-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
        @click="emit('downloadImage')"
      >
        <Download class="w-4 h-4" />
        Download Compressed Image
      </button>

      <button
        v-if="multipleImages"
        type="button"
        :disabled="!allCompressed || zipping"
        class="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 active:scale-[0.98]"
        @click="handleDownloadAll"
      >
        <Archive class="w-4 h-4" />
        {{ zipping ? 'Packing...' : 'Download All (ZIP)' }}
      </button>
    </div>
  </Transition>
</template>