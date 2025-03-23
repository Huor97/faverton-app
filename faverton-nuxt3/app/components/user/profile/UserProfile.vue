<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

definePageMeta({
  middleware: [`auth`],
});

const router = useRouter();
const loading = ref(false);
const username = ref(``);
const uploading = ref(false);
const avatar_path = ref(``);

onMounted(async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from(`profiles`)
      .select(`username, avatar_url`)
      // @ts-expect-error: user.value.id might be null
      .eq(`id`, user.value.id)
      .single();

    if (error) throw error;

    if (data) {
      username.value = data.username ?? ``;
      avatar_path.value = data.avatar_url ?? ``;
    }
  }
  catch (error) {
    // @ts-expect-error: error.message is a string
    console.error(`Error fetching profile:`, error.message);
  }
  finally {
    loading.value = false;
  }
});

const updateProfile = async () => {
  try {
    loading.value = true;
    if (!user.value) throw new Error(`Pas d'utilisateur`);

    const updates = {
      id: user.value.id,
      username: username.value,
      avatar_url: avatar_path.value,
      updated_at: new Date(),
    };

    // @ts-expect-error: user.value.id might be null
    const { error } = await supabase.from(`profiles`).upsert(updates, {
      returning: `minimal`, // Don't return the value after inserting
    });
    if (error) throw error;
  }
  catch (error) {
    // @ts-expect-error: error.message is a string
    alert(error.message);
  }
  finally {
    loading.value = false;
  }
};

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push(`/introduction`);
  }
  catch (error) {
    // @ts-expect-error: error.message is a string
    console.error(`Erreur lors de la déconnexion:`, error.message);
  }
  finally {
    loading.value = false;
  }
};
</script>

<template>
  <UContainer class="h-screen flex flex-col justify-center items-center">
    <form
      class="flex flex-col gap-4"
      @submit.prevent="updateProfile"
    >
      <div class="w-48 h-48">
        <UserProfileAvatar
          v-model:path="avatar_path"
          @upload="updateProfile"
        />
      </div>
      <label
        class="cursor-pointer bg-green-500 text-white text-center py-2 rounded"
        for="single"
      >
        {{ uploading ? "Uploading ..." : "Change photo" }}
      </label>
      <label for="email">Email</label>
      <!-- @vue-expect-error -->
      <input
        id="email"
        type="text"
        :value="user.email"
        disabled
      >
      <label for="username">Profile name</label>
      <input
        id="username"
        v-model="username"
        type="text"
        class="focus:outline-hidden"
      >
      <input
        type="submit"
        class="cursor-pointer bg-green-500 text-white text-center py-2 rounded"
        :value="loading ? 'Loading ...' : 'Enregistrer'"
        :disabled="loading"
      >
    </form>
    <UButton
      label="Déconnexion"
      class="mt-4"
      @click="signOut"
    />
  </UContainer>
</template>
