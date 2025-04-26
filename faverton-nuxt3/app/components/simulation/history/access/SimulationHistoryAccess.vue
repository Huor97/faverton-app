<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-8 px-6 text-white">
    <UIcon
      name="i-heroicons-lock-closed"
      class="w-16 h-16 mb-4"
    />

    <h2 class="text-2xl font-medium mb-3">
      Accès à votre historique
    </h2>
    <div
      v-if="!user?.id"
      class="flex flex-col items-center justify-center text-white"
    >
      <p class="text-center mb-6 max-w-md">
        Pour consulter l'historique de vos simulations solaires et suivre l'évolution de vos projets, veuillez vous connecter à votre compte Faverton. Si vous n'avez pas encore de compte, quelques secondes suffisent pour en créer un.
      </p>

      <div class="flex gap-4">
        <UButton
          to="/user/login"
          color="white"
          variant="solid"
          class="font-medium"
        >
          Se connecter
        </UButton>
        <UButton
          to="/user/register"
          color="white"
          variant="outline"
          class="font-medium"
        >
          Créer un compte
        </UButton>
      </div>
    </div>
    <SimulationHistoryButton v-else />
  </div>
</template>
