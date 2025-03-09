<script setup lang="ts">
import type { Panel } from '~/types/panel';

defineProps<{
  panel: Panel
}>();

const emit = defineEmits([`panel-clicked`]);

function onPanelClick(model: string) {
  emit(`panel-clicked`, model);
}
</script>

<template>
  <div>
    <div
      class="flex flex-col cursor-pointer p-4 border m-3"
      @click="onPanelClick(panel.model)"
    >
      <div class="flex gap-3">
        <h1>
          <b>
            Model:
          </b>
          {{ panel.model }}
        </h1>
        <p>
          <b>
            Efficaciter :
          </b>
          {{ panel.efficiency }}
        </p>
      </div>
      <div>Details: {{ panel.detail }}</div>
    </div>
  </div>
</template>
