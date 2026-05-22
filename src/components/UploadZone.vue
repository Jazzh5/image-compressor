<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Image } from 'lucide-vue-next'

const emit = defineEmits<{
  filesSelected: [files: FileList | File[]]
}>()

const dragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }
  dragOver.value = true
}

function onDragLeave() {
  dragOver.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    emit('filesSelected', e.dataTransfer.files)
  }
}

function onFileInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('filesSelected', target.files)
    target.value = ''
  }
}

function openFileDialog() {
  fileInput.value?.click()
}
</script>

<template>
  <div
    class="relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer"
    :class="
      dragOver
        ? 'border-emerald-400 bg-emerald-400/10 scale-[1.02] shadow-lg shadow-emerald-500/20'
        : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
    "
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="openFileDialog"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="onFileInputChange"
    />

    <div class="flex flex-col items-center justify-center py-16 px-8">
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
        :class="dragOver ? 'bg-emerald-500/20 scale-110' : 'bg-zinc-800'"
      >
        <Upload
          class="w-7 h-7 transition-colors duration-300"
          :class="dragOver ? 'text-emerald-400' : 'text-zinc-400'"
        />
      </div>

      <p class="text-lg font-semibold text-zinc-200 mb-2">
        Drop your images here
      </p>
      <p class="text-sm text-zinc-500 mb-4">
        or click to browse files
      </p>

      <div class="flex items-center gap-2 text-xs text-zinc-600">
        <Image class="w-3.5 h-3.5" />
        <span>Supports JPEG, PNG, WebP, AVIF, BMP, TIFF</span>
      </div>
    </div>
  </div>
</template>