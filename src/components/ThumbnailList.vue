<script setup lang="ts">
import type { ImageFile } from '@/types'
import { formatFileSize } from '@/utils/imageUtils'
import { X, GripVertical } from 'lucide-vue-next'

defineProps<{
  images: ImageFile[]
  currentIndex: number
}>()

const emit = defineEmits<{
  select: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="images.length > 0"
      class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
    >
      <button
        v-for="(image, index) in images"
        :key="image.id"
        type="button"
        class="group relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200"
        :class="
          index === currentIndex
            ? 'border-emerald-400 shadow-md shadow-emerald-500/20'
            : 'border-zinc-700/50 hover:border-zinc-500 opacity-70 hover:opacity-100'
        "
        @click="emit('select', image.id)"
      >
        <img
          :src="image.originalUrl"
          :alt="image.originalFile.name"
          class="w-full h-full object-cover"
        />

        <button
          type="button"
          class="absolute top-1 right-1 w-5 h-5 rounded-md bg-zinc-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
          @click.stop="emit('remove', image.id)"
        >
          <X class="w-3 h-3 text-zinc-300" />
        </button>

        <div
          v-if="image.compressing"
          class="absolute inset-0 bg-zinc-900/60 flex items-center justify-center"
        >
          <div class="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </button>
    </div>
  </Transition>
</template>