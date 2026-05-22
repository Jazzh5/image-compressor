<script setup lang="ts">
import type { ImageFile } from '@/types'
import { formatFileSize } from '@/utils/imageUtils'
import { Image, FileImage, ArrowDown, Loader2 } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  image: ImageFile | null
  savingsPercent: number
}>()

const savingsColor = computed(() => {
  if (props.savingsPercent > 30) return 'text-emerald-400'
  if (props.savingsPercent > 10) return 'text-yellow-400'
  if (props.savingsPercent > 0) return 'text-amber-400'
  return 'text-red-400'
})
</script>

<template>
  <div v-if="!image" class="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-12">
    <div class="flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-5">
        <Image class="w-7 h-7 text-zinc-600" />
      </div>
      <p class="text-zinc-500 text-sm">Upload an image to see the preview</p>
    </div>
  </div>

  <div v-else class="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden">
    <div class="grid grid-cols-2 divide-x divide-zinc-800">
      <div class="p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
            <FileImage class="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <span class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Original</span>
        </div>

        <div class="aspect-square rounded-xl bg-zinc-800/50 overflow-hidden mb-3 flex items-center justify-center">
          <img
            :src="image.originalUrl"
            :alt="image.originalFile.name"
            class="w-full h-full object-contain"
          />
        </div>

        <div class="space-y-1">
          <p class="text-xs text-zinc-500 truncate" :title="image.originalFile.name">
            {{ image.originalFile.name }}
          </p>
          <p class="text-sm font-mono font-semibold text-zinc-300">
            {{ formatFileSize(image.originalSize) }}
          </p>
        </div>
      </div>

      <div class="p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
            <ArrowDown class="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span class="text-xs font-medium text-emerald-400 uppercase tracking-wider">Compressed</span>
        </div>

        <div class="aspect-square rounded-xl bg-zinc-800/50 overflow-hidden mb-3 relative flex items-center justify-center">
          <div v-if="image.compressing" class="absolute inset-0 bg-zinc-900/60 flex items-center justify-center z-10">
            <Loader2 class="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
          <img
            v-if="image.compressedUrl"
            :src="image.compressedUrl"
            :alt="image.originalFile.name + ' compressed'"
            class="w-full h-full object-contain"
            :class="{ 'opacity-40': image.compressing }"
          />
          <div v-else class="flex items-center justify-center w-full h-full text-zinc-600 text-xs">
            Processing...
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-xs text-zinc-500 truncate">
            {{ image.originalFile.name.replace(/\.[^.]+$/, '') }}-compressed.{{
              image.outputFormat === 'original'
                ? image.originalFile.name.split('.').pop()
                : image.outputFormat === 'jpeg' ? 'jpg' : image.outputFormat
            }}
          </p>
          <div class="flex items-center gap-2">
            <p class="text-sm font-mono font-semibold text-zinc-300">
              {{ image.compressedSize ? formatFileSize(image.compressedSize) : '--' }}
            </p>
            <span
              v-if="image.compressedSize && savingsPercent !== 0"
              class="text-xs font-semibold px-1.5 py-0.5 rounded-md"
              :class="`${savingsColor} bg-current/10`"
            >
              {{ savingsPercent > 0 ? '-' : '+' }}{{ Math.abs(savingsPercent) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>