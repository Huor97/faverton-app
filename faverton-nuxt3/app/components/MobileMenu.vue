<script setup lang="ts">
const user = useSupabaseUser();
const userLoaded = ref(false);

const isOpen = ref(false);
const reappear = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const items = [
  {
    title: `Simulateur`,
    link: `/simulator`,
  },
  {
    title: `Énergies Renouvelables`,
    link: `/introduction/green-energy`,
  },
  {
    title: `Gestion de l'Eau`,
    link: `/introduction/organic-waste-recycling`,
  },
  {
    title: `Agriculture Durable`,
    link: `/introduction/sustainable-agriculture`,
  },
  {
    title: `Formation & Sensibilisation`,
    link: `/introduction/education-workshops`,
  },
  {
    title: `Restauration Locale`,
    link: `/introduction/restaurants-cultural-activities`,
  },
  {
    title: `Hébergement Écologique`,
    link: `/introduction/coworking-accommodation`,
  },
];

onMounted(() => {
  if (import.meta.client) {
    watch(user, () => {
      userLoaded.value = true;
    }, { immediate: true });
  }
});
</script>

<template>
  <div class="container">
    <div
      class="burger-wrap m-5"
      :class="{ reappearBurger: reappear }"
    >
      <div
        class="burger"
        :class="{ active: isOpen }"
        @click="toggleMenu"
      >
        <span />
        <span />
        <span />
      </div>
    </div>
    <div
      class="mobile-menu"
      :class="{ open: isOpen }"
    >
      <nav>
        <ul>
          <div class="flex flex-col">
            <NuxtLink
              v-if="!user"
              to="/user/login"
              class="text-l font-bold text-white p-2 w-64"
            >
              Se connecter
            </NuxtLink>
            <NuxtLink
              v-else
              to="/user/profile"
              class="text-l font-bold text-white p-2 w-64"
            >
              Mon Espace
            </NuxtLink>
          </div>
          <FavertonMenuMainItems :items />
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.mobile-menu {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgb(56, 83, 57);
    padding: 30% 10% 16%;
    opacity: 0;
    z-index: 20;
    box-sizing: border-box;
    pointer-events: none;
    transition: opacity 0.5s ease-in-out;
  }

  .mobile-menu.open {
    display: block;
    opacity: 1;
    pointer-events: all;
  }

  .burger-wrap {
    position: absolute;
    z-index: 40;
    transition: 300ms 700ms transform ease-in;
  }

  .burger-wrap.reappearBurger {
    opacity: 0;
    animation: 0.5s 2s fadeAppear ease-out forwards;
  }

  @keyframes fadeAppear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .burger {
    width: 30px;
    height: 27px;
    cursor: pointer;
    z-index: 30;
    transition: transform 1s ease-in;
  }

  .burger span {
    display: block;
    position: absolute;
    height: 2px;
    left: 0;
    background: #ffffff;
    border-radius: 9px;
    opacity: 1;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
  }

  .burger span:nth-child(1) {
    top: 0px;
    width: 50%;
  }

  .burger span:nth-child(2) {
    top: 12px;
    width: 75%;
  }

  .burger span:nth-child(3) {
    top: 24px;
    width: 100%;
  }

  .burger.active span:nth-child(1) {
    width: 100%;
    top: 12px;
    transform: rotate(135deg);
  }

  .burger.active span:nth-child(2) {
    opacity: 0;
  }

  .burger.active span:nth-child(3) {
    top: 12px;
    transform: rotate(-135deg);
  }
</style>
