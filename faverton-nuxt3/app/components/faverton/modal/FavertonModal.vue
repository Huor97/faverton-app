<script setup lang="ts">
import { useDeleteAccount } from '~/composables/useAuth';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isOpen = ref(false);
const isLoading = ref(false);
const error = ref(``);
const softDelete = ref(true);

const confirmDelete = async () => {
  isLoading.value = true;
  error.value = ``;
  try {
    const { success } = await useDeleteAccount(softDelete.value);

    isLoading.value = false;

    if (success) {
      user.value = null;
      await supabase.auth.signOut();
      await navigateTo(`/introduction`, {
        redirectCode: 301,
        replace: true,
      });
    }
  }
  catch (err) {
    error.value = `Échec de la suppression`;
    console.error(err);
  }
  finally {
    isLoading.value = false;
    isOpen.value = false;
  }
};
</script>

<template>
  <div>
    <UButton
      label="Supprimer compte"
      color="red"
      @click="isOpen = true"
    />
    <UModal v-model="isOpen">
      <div class="p-4 flex flex-col gap-2">
        <h2>Supprimer votre compte</h2>
        <p>
          Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
          Cette action est irréversible. Toutes vos données seront supprimées.
          Nous conservons des données anonymisées pendant 3 mois après la suppression.
        </p>
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
