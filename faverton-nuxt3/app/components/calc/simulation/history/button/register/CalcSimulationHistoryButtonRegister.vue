<script setup lang="ts">
const props = defineProps<{
  simulationId: string | null
  surface: number
}>();

interface SimulationHistoryResponse {
  success: boolean
}

const isLoading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const saved = ref(true);

async function saveToHistory() {
  if (!props.simulationId) {
    error.value = `Missing simulation ID`;
    return;
  }

  isLoading.value = true;
  error.value = null;
  success.value = false;

  try {
    const response = await $fetch<SimulationHistoryResponse>(`/api/simulation/history`, {
      method: `POST`,
      body: {
        simulationId: props.simulationId,
        history: saved.value,
        surface: props.surface,
      },
    });

    if (response.success) {
      success.value = true;
      setTimeout(() => {
        success.value = false;
      }, 2000);
    }
    else {
      error.value = `Error while updating`;
    }
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message;
    }
    else {
      error.value = `An error has occurred`;
    }
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UButton
    :loading="isLoading"
    :disabled="isLoading || success"
    :color="success ? 'green' : 'primary'"
    size="xl"
    class="w-64"
    @click="saveToHistory"
  >
    <template v-if="!success">
      Sauvegarder dans l'historique
    </template>
    <template v-else>
      Sauvegardé ✓
    </template>
  </UButton>

  <div
    v-if="error"
    class="mt-2 text-red-500 text-sm"
  >
    {{ error }}
  </div>
</template>
