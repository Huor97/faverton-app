import { defineStore } from 'pinia';

interface AddHistoryPayload {
  simulationId: string
  history: boolean
  surface?: number
  userId?: string | null
}

export const useSimulationHistoryStore = defineStore('simulationHistory', () => {
  // États
  const historyList = ref<SimulationHistory[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false);

  // Actions
  async function fetchHistory() {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<{ simulations: SimulationHistory[] }>('/api/simulation/history');
      historyList.value = data?.simulations || [];
    }
    catch (err) {
      console.error('❌ Erreur lors de la récupération:', err);
      handleError(err);
    }
    finally {
      isLoading.value = false;
    }
  }

  async function addHistory(payload: AddHistoryPayload) {
    if (!payload.simulationId) {
      error.value = 'Missing simulation ID';
      return;
    }

    isLoading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await $fetch<{ success: boolean }>('/api/simulation/history', {
        method: 'POST',
        body: payload,
      });

      if (response.success) {
        success.value = true;
        await fetchHistory(); // Rafraîchit la liste après l'ajout
        setTimeout(() => success.value = false, 2000);
      }
      else {
        error.value = 'Error while updating';
      }
    }
    catch (err) {
      handleError(err);
    }
    finally {
      isLoading.value = false;
    }
  }

  // Utilitaire pour la gestion d'erreurs
  function handleError(err: unknown) {
    error.value = err instanceof Error ? err.message : 'An error has occurred';
  }

  return {
    historyList,
    isLoading,
    error,
    success,
    fetchHistory,
    addHistory,
  };
});
