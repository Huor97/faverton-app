<script setup lang="ts">
import { deleteAccount } from '~/composables/useAuth';

const isOpen = ref(false);
const isLoading = ref(false);
const error = ref(``);
const softDelete = ref(true);

const confirmDelete = async () => {
  isLoading.value = true;
  error.value = ``;

  const { success, error: deleteError } = await deleteAccount(softDelete.value);

  isLoading.value = false;

  if (success) {
    await navigateTo(`/user/login`);
  }
  else {
    error.value = deleteError || `Une erreur est survenue`;
  }
};
</script>

<template>
  <div>
    <UButton
      label="Suprimer compte"
      color="red"
      @click="isOpen = true"
    />

    <UModal v-model="isOpen">
      <div class="p-4 flex flex-col gap-2">
        <h2>Supprimer votre compte</h2>
        <p>
          Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
          Cette action est irréversible. Toutes vos données seront supprimées.
        </p>
        <div class="options">
          <label>
            <input
              v-model="softDelete"
              type="checkbox"
            >
            Suppression douce (conserve des données anonymisées)
          </label>
        </div>
        <div>
          <UButton
            color="red"
            :disabled="isLoading"
            @click="confirmDelete"
          >
            {{ isLoading ? 'Suppression en cours...' : 'Supprimer mon compte' }}
          </UButton>
        </div>
        <p
          v-if="error"
          class="error"
        >
          {{ error }}
        </p>
      </div>
    </UModal>
  </div>
</template>
