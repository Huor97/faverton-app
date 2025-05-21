<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref(``);
const password = ref(``);
const message = ref(``);

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    message.value = `Login ne peut pas être effectué, une erreur s'est produite`;
  }
  else {
    message.value = `Login successful`;
    navigateTo(`/profile`);
  }
};

const gotToRegister = () => {
  navigateTo(`/register`);
};
</script>

<template>
  <UContainer class="h-screen flex flex-col justify-center items-center">
    <div class="z-index-[999] fixed left-32 top-4">
      <UBreadcrumb
        :links="[{ label: 'Introduction', to: '/introduction' }, { label: 'Se connecter' }]"
      >
        <template #default="{ link, isActive }">
          <UBadge
            :color="isActive ? 'primary' : 'gray'"
            class="rounded-full truncate"
          >
            {{ link.label }}
          </UBadge>
        </template>
      </UBreadcrumb>
    </div>
    <div>
      <h1 class=" h-10">
        Se connecter
      </h1>

      <form
        class="gap-4 flex"
        @submit.prevent="login"
      >
        <UInput
          v-model="email"
          color="primary"
          variant="outline"
          type="email"
          placeholder="Email"
        />
        <UInput
          v-model="password"
          color="primary"
          variant="outline"
          type="password"
          placeholder="Password"
        />
        <UButton
          label="Continuer"
          type="submit"
        />
      </form>
      <p
        class="text-red-500 text-xs"
      >
        {{ message }}
      </p>
      <UButton
        variant="link"
        label="Register"
        type="submit"
        @click="gotToRegister"
      />
    </div>
  </UContainer>
</template>
