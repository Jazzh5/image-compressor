<script setup lang="ts">
import type { OutputFormat } from '@/types'
import { SlidersHorizontal, Lightbulb } from 'lucide-vue-next'
import { computed } from 'vue'

const quality = defineModel<number>('quality', { required: true })
const outputFormat = defineModel<OutputFormat>('outputFormat', { required: true })
const applyToAll = defineModel<boolean>('applyToAll', { default: false })

const props = defineProps<{
  disabled: boolean
  isPngFile: boolean
}>()

const formatOptions: { value: OutputFormat; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
]

const showPngHint = computed(() =>
  props.isPngFile && (outputFormat.value === 'original' || outputFormat.value === 'png')
)
</script>

<template>
  <div
    class="rounded-2xl p-6 transition-opacity duration-300"
    :class="disabled ? 'opacity-40 pointer-events-none' : 'bg-zinc-900/80 border border-zinc-800'"
  >
    <div class="flex items-center gap-2.5 mb-6">
      <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
        <SlidersHorizontal class="w-4 h-4 text-emerald-400" />
      </div>
      <h2 class="text-base font-semibold text-zinc-200">Compression Settings</h2>
    </div>

    <div class="space-y-5">
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm text-zinc-400">Quality</label>
          <span class="text-sm font-mono font-medium tabular-nums px-2.5 py-1 rounded-lg bg-zinc-800 text-emerald-400">
            {{ quality.toFixed(1) }}
          </span>
        </div>
        <input
          v-model.number="quality"
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          class="w-full h-2 rounded-full appearance-none cursor-pointer bg-zinc-800 accent-emerald-500 outline-none"
        />
        <div class="flex justify-between mt-1.5">
          <span class="text-xs text-zinc-600">0.1</span>
          <span class="text-xs text-zinc-600">1.0</span>
        </div>
      </div>

      <div>
        <label class="text-sm text-zinc-400 block mb-3">Output Format</label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="opt in formatOptions"
            :key="opt.value"
            type="button"
            class="py-2.5 px-2 rounded-xl text-xs font-medium transition-all duration-200 border"
            :class="
              outputFormat === opt.value
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-sm shadow-emerald-500/10'
                : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
            "
            @click="outputFormat = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 -translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
        >
          <div
            v-if="showPngHint"
            class="mt-3 flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <Lightbulb class="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p class="text-xs text-amber-300/80">
              PNG compression uses color quantization in the browser. For better results, try
              <button
                type="button"
                class="underline font-medium text-amber-400 hover:text-amber-300 transition-colors"
                @click="outputFormat = 'webp'"
              >
                WebP
              </button>
              format — it supports transparency and compresses much smaller.
            </p>
          </div>
        </Transition>
      </div>

      <div class="pt-2 border-t border-zinc-800">
        <label class="flex items-center gap-3 cursor-pointer group">
          <div class="relative">
            <input
              v-model="applyToAll"
              type="checkbox"
              class="sr-only peer"
            />
            <div
              class="w-9 h-5 rounded-full transition-colors duration-200 bg-zinc-700 peer-checked:bg-emerald-500/60"
            ></div>
            <div
              class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-4"
            ></div>
          </div>
          <span class="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
            Apply settings to all images
          </span>
        </label>
      </div>
    </div>
  </div>
</template>