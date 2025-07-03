<template>
  <div class="w-full flex flex-col items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <img
        src="~/assets/logo.png"
        alt="Faverton"
        class="w-64 p-5"
      >
      <h1 class="text-center text-5xl font-bold">
        Accédez à vos simulations
      </h1>
      <p class="text-center text-2xl">
        Sauvegardez et compare vos évaluations solaires
      </p>
    </div>
    <FavertonCard>
      <h1 class="text-center p-5 text-2xl font-bold">
        Avec un compte, vous pouvez:
      </h1>
      <p class="p-2 text-xl">
        <span class="bg-green-300 p-2 rounded-full">💾</span> Sauvegarder toutes vos simulations
      </p>
      <p class="p-2 text-xl">
        <span class="bg-green-300 p-2 rounded-full">📊</span> Comparer différents scénarios
      </p>
      <p class="p-2 text-xl">
        <span class="bg-green-300 p-2 rounded-full">📧</span> Recevoir des mises à jour
      </p>
    </FavertonCard>
  </div>
</template>
