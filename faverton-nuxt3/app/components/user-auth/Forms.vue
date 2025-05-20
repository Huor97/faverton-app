<script setup lang="ts">
import AuthSectionsConnection from '~/components/user-auth/auth/Login.vue';
import AuthSectionsForgetPass from '~/components/user-auth/auth/ForgetPass.vue';
import AuthSectionsRegister from '~/components/user-auth/auth/Register.vue';

const isOpen = ref(false);
const displayedForm = ref<`connection` | `forgetPass` | `register`>(`connection`);

const formComponent = computed(() => {
  if (displayedForm.value === `forgetPass`) return AuthSectionsForgetPass;
  if (displayedForm.value === `register`) return AuthSectionsRegister;
  return AuthSectionsConnection;
});
</script>

<template>
  <div>
    <UButton
      label="Se connecter"
      @click="isOpen = true"
    />

    <UModal
      v-model="isOpen"
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800 ' }">
        <template #header>
          <div class="flex items-center justify-end">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>
        <component
          :is="formComponent"
          v-model="displayedForm"
        />
      </UCard>
    </UModal>
  </div>
</template>
