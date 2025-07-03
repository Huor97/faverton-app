<template>
  <div class="w-full  flex flex-col items-center justify-center">
    <div class="flex bg-green-600 p-10 w-full flex-col items-center gap-4">
      <div
        class="bg-gradient-to-br mt-5 sm:mt-0 from-blue-50 to-green-50 border border-blue-200 p-2 rounded-2xl shadow-lg overflow-hidden"
      >
        <img
          src="~/assets/logo.png"
          alt="Faverton"
          class="w-40"
        >
      </div>
      <h1 class="text-center text-4xl font-bold text-white">
        Accédez à vos simulations
      </h1>
      <p class="text-center text-xl text-white font-bold">
        Sauvegardez et comparez vos évaluations solaires
      </p>
    </div>
    <FavertonCard class="sm:w-1/4">
      <h1 class="text-center p-5 text-2xl font-bold">
        Avec un compte, vous pouvez:
      </h1>
      <p class="p-2 text-xl">
        <span class="bg-green-300 p-1 rounded-full">💾</span> Sauvegarder toutes vos simulations
      </p>
      <p class="p-2 text-xl">
        <span class="bg-green-300 p-1 rounded-full">📊</span> Comparer différents scénarios
      </p>
      <p class="p-2 text-xl">
        <span class="bg-green-300 p-1 rounded-full">📧</span> Recevoir des mises à jour
      </p>
    </FavertonCard>
  </div>
</template>
