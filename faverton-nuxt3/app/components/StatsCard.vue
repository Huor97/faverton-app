<script setup lang="ts">
interface Props {
  title: string
  type: 'production' | 'revenue' | 'performance'
  value?: string
  unit?: string
  trend?: string
  positionClass?: string
  simulation?: boolean
}

defineProps<Props>()
</script>

<template>
  <div :class="['absolute z-20 pointer-events-none transform scale-75 md:scale-100', positionClass]">
    <div class="relative bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-64 shadow-2xl">
      <!-- Header with Badge -->
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-3">
          <div v-if="type === 'production'" class="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
          <span class="text-xs text-white/60 uppercase tracking-wider leading-tight">{{ title }}</span>
        </div>
        
        <!-- Simulation Badge -->
        <div v-if="simulation" class="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 border border-white/5 uppercase tracking-wider ml-2 whitespace-nowrap shrink-0">
          Simulation
        </div>
      </div>

      <!-- Content based on type -->
      
      <!-- Production -->
      <template v-if="type === 'production'">
        <div class="text-2xl font-light text-white">{{ value }} <span class="text-sm text-white/40">{{ unit }}</span></div>
        <div class="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-green-500/50 w-[75%]"></div>
        </div>
      </template>

      <!-- Revenue -->
      <template v-if="type === 'revenue'">
        <div class="text-2xl font-light text-white">{{ value }}</div>
        <div class="text-xs text-green-400 mt-1 flex items-center gap-1">
          <span class="text-[10px]" aria-hidden="true">▲</span> {{ trend }}
        </div>
      </template>

      <!-- Performance -->
      <template v-if="type === 'performance'">
        <div class="flex gap-2 items-end">
          <div class="h-8 w-2 bg-white/20 rounded-t-sm"></div>
          <div class="h-12 w-2 bg-white/40 rounded-t-sm"></div>
          <div class="h-10 w-2 bg-white/30 rounded-t-sm"></div>
          <div class="h-16 w-2 bg-white/80 rounded-t-sm"></div>
          <div class="h-14 w-2 bg-white/60 rounded-t-sm"></div>
        </div>
      </template>
    </div>
  </div>
</template>
