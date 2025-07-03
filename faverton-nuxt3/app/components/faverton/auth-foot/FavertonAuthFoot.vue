<template>
  <div class="flex flex-col w-full items-center">
    <div class="p-2">
      <UButton
        label="Continuer sans compte"
        color="white"
        variant="solid"
        to="/simulator"
      />
    </div>
    <p class="text-center">
      Vos simulations ne seront pas sauvegardées
    </p>
    <FavertonCard class="flex flex-col items-center sm:w-1/4 gap-2 text-center">
      <div class="p-3">
        <UIcon
          name="i-lucide-lock"
          class="size-10"
        />
      </div>
      <p>
        Vos données sont protégées et ne seront jamais partagées.
      </p>
      <p>Authentification sécurisée.</p>
    </FavertonCard>
  </div>
</template>
