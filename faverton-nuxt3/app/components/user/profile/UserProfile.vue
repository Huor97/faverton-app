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
const { isMobile } = useDevice();
const isSmallScreen = computed(() => isMobile);
</script>

<template>
  <div class="bg-yellow-100 h-screen flex flex-col justify-center items-center">
    <div
      class="z-[999] fixed top-4"
      :class="!isSmallScreen? 'left-32':'left-16'"
    >
      <UBreadcrumb
        :links="[{ label: 'Accueil', to: '/introduction' }, { label: 'Mon Espace' }]"
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
    <form
      class="flex flex-col gap-4 md:w-1/4"
      @submit.prevent="updateProfile"
    >
      <div class="flex flex-col items-center gap-2 justify-center">
        <UserProfileAvatar
          v-model:path="avatar_path"
          @upload="updateProfile"
        />
        <div>
          <label
            class="cursor-pointer bg-green-500 text-white text-center p-2 rounded"
            for="single"
          >
            {{ uploading ? "Téléchargement en cours ..." : "Choisir photo" }}
          </label>
        </div>
      </div>

      <div>
        <label
          for="email"
          class="flex items-center gap-2"
        >
          Votre email est :
        </label>

        <div class="bg-gray-50 p-2 border border-gray-300 rounded-md flex items-center">
          <UIcon
            name="i-heroicons-lock-closed"
            class="text-gray-400 w-5 h-5"
          />
          <span class="text-gray-700 flex-grow">{{ user?.email }}</span>

          <UTooltip text="L'adresse email ne peut pas être modifiée">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-information-circle"
            />
          </UTooltip>
        </div>
      </div>

      <label for="username">Nom du profil :</label>
      <UInput
        id="username"
        v-model="username"
        placeholder="Choisir votre nom"
        type="text"
        class="focus:outline-hidden"
        size="xl"
      />
      <div>
        <UButton
          type="submit"
          class="cursor-pointer bg-green-500 text-white text-center py-2 rounded"
          :disabled="loading"
          size="xl"
        >
          {{ loading ? 'Chargement ...' : 'Enregistrer' }}
        </UButton>
      </div>
    </form>
    <div class="flex gap-2 mt-0 md:mt-10 p-10">
      <UButton
        label="Déconnexion"
        @click="signOut"
      />
      <FavertonModal />
    </div>
  </div>
</template>
