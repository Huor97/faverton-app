<script setup lang="ts">
const props = defineProps<{
  simulationId?: string | null
  surface?: number
}>();

const user = useSupabaseUser();
const saved = ref(true);

const historyStore = useSimulationHistoryStore();

async function saveToHistory() {
  if (!props.simulationId) return;

  await historyStore.addHistory({
    simulationId: props.simulationId,
    history: saved.value,
    surface: props.surface,
    userId: user.value?.id ?? null,
  });
}
</script>

<template>
  <UButton
    :loading="historyStore.isLoading"
    :disabled="historyStore.isLoading || historyStore.success"
    :color="historyStore.success ? 'green' : 'primary'"
    size="xl"
    class="w-64"
    @click="saveToHistory"
  >
    {{ historyStore.success ? 'Sauvegardé ✓' : `Sauvegarder dans l'historique` }}
  </UButton>
</template>
