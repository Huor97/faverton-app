<script setup lang="ts">
import type { Database } from '~/types/supabase';

const supabase = useSupabaseClient<Database>();

const router = useRouter();

const loading = ref(true);
const username = ref(``);
const avatar_path = ref(``);

loading.value = true;
const user = useSupabaseUser();

if (user.value) {
  const { data, error } = await supabase
    .from(`profiles`)
    .select(`username, avatar_url`)
    .eq(`id`, user.value.id)
    .single();

  if (error) {
    console.error(error.message);
  }
  else if (data) {
    username.value = data.username ?? ``;
    avatar_path.value = data.avatar_url ?? ``;
  }
}

loading.value = false;

async function updateProfile() {
  try {
    loading.value = true;
    const user = useSupabaseUser();

    if (!user.value) {
      throw new Error(`User is not authenticated`);
    }

    const updates: Database[`public`][`Tables`][`profiles`][`Update`] = {
      id: user.value.id as string,
      username: username.value ?? ``,
      avatar_url: avatar_path.value ?? ``,
      updated_at: new Date().toISOString() as string ?? ``,
    };

    const { error } = await supabase
      .from(`profiles`)
    // @ts-expect-error: TypeScript does not recognize the select method on upsert
      .upsert(updates)
      .select(`minimal`)
      .single();

    if (error) throw error;
  }
  catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
  finally {
    loading.value = false;
  }
}

async function signOut() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
    router.push(`/`);
  }
  catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <form
    class="flex flex-col gap-4 justify-center h-screen bg-blue-200 items-center"
    @submit.prevent="updateProfile"
  >
    <UserAuthProfileAvatar
      v-model:path="avatar_path"
      @upload="updateProfile"
    />
    <div>
      <label for="email">Email</label>
      <UInput
        id="email"
        type="text"
        :placeholder="user?.email"
        disabled
      />
    </div>
    <div>
      <label for="username">Name</label>
      <UInput
        id="username"
        v-model="username"
        color="primary"
        variant="outline"
        placeholder="Votre nom"
      />
    </div>
    <div>
      <input
        type="submit"
        class="button primary block"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      >
    </div>

    <div>
      <button
        class="button block"
        :disabled="loading"
        @click="signOut"
      >
        Sign Out
      </button>
    </div>
  </form>
</template>
