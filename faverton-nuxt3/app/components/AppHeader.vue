<script setup lang="ts">
const user = useSupabaseUser();

const isMenuOpen = ref(false);

const menuItems = [
  { href: `http://`, text: `Anatomy` },
  { href: `http://`, text: `Ecology` },
  { href: `http://`, text: `Intelligence` },
  { href: `http://`, text: `Mythology` },
  // { href: `http://`, text: `Connexion` },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const goToLogin = () => {
  navigateTo(`/login`);
};
</script>

<template>
  <div class="container">
    <div
      class="menu-background"
      :class="{ 'is-visible': isMenuOpen }"
      @click="toggleMenu"
    />
    <div
      class="card"
      :class="{ 'is-visible': isMenuOpen }"
    >
      <div class="card__header">
        <div class="menu">
          <div
            :class="['menu__icon', { open: isMenuOpen }]"
            @click="toggleMenu"
          >
            <span /><span /><span />
          </div>
          <a
            v-for="(item, index) in menuItems"
            :key="index"
            :href="item.href"
            target="_blank"
            :class="['menu__item', { 'menu__item--is-visible': isMenuOpen }]"
            :style="{ transitionDelay: `${index * 75}ms` }"
          >
            {{ item.text }}
          </a>
          <div>
            <div
              :class="['menu__item', { 'menu__item--is-visible': isMenuOpen }]"
            >
              <button
                v-if="!user"
                class="login-button"
                @click="goToLogin"
              >
                Se connecter
              </button>
              <button
                v-else
                class="login-button"
              >
                Profile
              </button>
            </div>
          </div>
          <UserAuthForms v-if="!user" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.menu-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #00acd4, #6fdde9 66%, #7aeca9);
  opacity: 0;
  visibility: hidden;
  transition: opacity 3s ease, visibility 2s ease;
}

.menu-background.is-visible {
  opacity: 0.5;
  visibility: visible;
}

.card {
  position: relative;
  width: 100%;
  max-width: 1147px;
  border-radius: 17px;
  box-shadow: 0 30px 160px 0 rgba(0, 0, 0, .3), 0 40px 77px 0 rgba(0, 0, 0, .1);
  flex: 0 1 auto;
  left: 5vw;
  /* background: var(--bg-gradient); */
}

.card.is-visible {
    opacity: 1;
    background: linear-gradient(135deg, #00acd4, #6fdde9 66%, #7aeca9);
    left: 5vw;
  }
.card__header {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu {
  display: flex;
  overflow: hidden;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
}

.menu__icon {
  position: relative;
  width: 30px;
  height: 25px;
  margin: 5px 40px 5px 0;
  cursor: pointer;
  transition: .5s ease-in-out;
  transform: rotate(0deg);
}

.menu__icon span {
  position: absolute;
  left: 0;
  display: block;
  width: 100%;
  height: 3px;
  transition: .25s ease-in-out;
  transform: rotate(0deg);
  opacity: 1;
  border-radius: 9px;
  background: #fff;
}

.menu__icon span:nth-child(1) { top: 0; }
.menu__icon span:nth-child(2) { top: 10px; }
.menu__icon span:nth-child(3) { top: 20px; }

.menu__icon.open span:nth-child(1) { transform: rotate(45deg); top: 0; left: 8px; }
.menu__icon.open span:nth-child(2) { width: 0; opacity: 0; }
.menu__icon.open span:nth-child(3) { transform: rotate(-45deg); top: 21px; left: 8px; }

.menu__item {
  visibility: hidden;
  margin: 5px 35px 0 0;
  padding: 0 10px;
  transition: .5s ease-in-out;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 3px;
  opacity: 0;
  color: transparent;
  border-bottom: 2px solid transparent;
  text-shadow: 0 0 3px #fff;
  font: lighter 22px Arial, Helvetica, sans-serif;
  text-rendering: optimizeLegibility;
}

.menu__item:hover {
  transition: .25s ease-in-out;
  color: hsla(0, 0%, 100%, .6);
}

.menu__item--is-visible {
  z-index: 1;
  visibility: visible;
  margin-right: 30px;
  opacity: 1;
  color: #fff;
  text-shadow: 2px 2px 5px transparent;
}

@media screen and (min-width: 320px) {
  .card {
    width: 100vw;
    border-radius: 0;
    box-shadow: none;
  }
  .menu { flex-direction: column; }
  .menu__item { margin-top: 35px; }
}

@media screen and (min-width: 768px) {
  .card { max-height: none; }
}

@media screen and (min-width: 1024px) {
  .card {
    max-height: 775px;
    border-radius: 17px;
    box-shadow:0 30px 160px 0 rgba(0, 0, 0, .3), 0 40px 77px 0 rgba(0, 0, 0, .1);
  }
}

@media screen and (min-width: 1240px) {
  .container { margin-top: 2vh; }
  .menu { flex-direction: row; }
  .menu__item { margin-top: 5px; }
}
</style>

<!-- <script setup lang="ts">
const openConnexion = ref(false);

const accueil = `/`;
const introduction = `/introduction`;
const simulation = `/calculation-tool/`;
const autenfication = `/authentification/connexion`;
const profil = `/profil-settings`;
</script>

<template>
  <div class="bg-blue ">
    <div class="flex itmes-center justify-between w-50">
      <NuxtLink
        :to="accueil"
        text="accueil"
      />
      <NuxtLink
        :to="introduction"
        text="introduction"
      />
      <NuxtLink
        :to="simulation"
        text="simulation"
      />
      <NuxtLink
        :to="autenfication"
        text="autenfication"
      />
      <NuxtLink
        :to="profil"
        text="profil"
      />

      <UButton
        label="Open"
        @click="openConnexion = true"
      />
      <AuthConnexion v-model="openConnexion" />
    </div>
  </div>
</template> -->
