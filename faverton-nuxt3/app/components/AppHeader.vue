<template>
  <div>
    <div
      id="menu"
      :class="{ expanded: menuExpanded }"
    >
      <div
        class="hamburger"
        :style="{ transform: `translateY(${curveY}px)` }"
        @mouseenter="expandMenu"
        @mouseleave="collapseMenu"
      >
        <div class="line" />
        <div class="line" />
        <div class="line" />
      </div>
      <div
        class="menu-inner"
        @mouseenter="expandMenu"
        @mouseleave="collapseMenu"
      >
        <ul>
          <li>Menu Item</li>
          <li>Menu Item</li>
          <li>Menu Item</li>
          <li>Menu Item</li>
          <li>Menu Item</li>
          <li>Menu Item</li>
        </ul>
      </div>
      <svg
        id="blob"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          id="blob-path"
          :d="blobPath"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
const height = ref(0); // Initialiser à 0 par défaut
const x = ref(0);
const y = ref(0);
const curveX = ref(10);
const curveY = ref(0);
const targetX = ref(0);
const xitteration = ref(0);
const yitteration = ref(0);
const menuExpanded = ref(false);
const blobPath = ref(`M60,500H58V0h1c0,0,20,172,20,250S60,900,60,500z`);

const handleMouseMove = (e) => {
  x.value = e.pageX;
  y.value = e.pageY - window.scrollY;
};

const expandMenu = () => {
  menuExpanded.value = true;
};

const collapseMenu = () => {
  menuExpanded.value = false;
};

const easeOutExpo = (currentIteration, startValue, changeInValue, totalIterations) => {
  return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
};

const svgCurve = () => {
  if (import.meta.client) {
    const hoverZone = 150;
    const expandAmount = 20;

    if (Math.abs(curveX.value - x.value) < 1) {
      xitteration.value = 0;
    }
    else {
      if (menuExpanded.value) {
        targetX.value = 0;
      }
      else {
        xitteration.value = 0;
        if (x.value > hoverZone) {
          targetX.value = 0;
        }
        else {
          targetX.value = -(((60 + expandAmount) / 100) * (x.value - hoverZone));
        }
      }
      xitteration.value++;
    }

    if (Math.abs(curveY.value - y.value) < 1) {
      yitteration.value = 0;
    }
    else {
      yitteration.value = 0;
      yitteration.value++;
    }

    curveX.value = easeOutExpo(xitteration.value, curveX.value, targetX.value - curveX.value, 100);
    curveY.value = easeOutExpo(yitteration.value, curveY.value, y.value - curveY.value, 100);

    curveY.value = Math.min(Math.max(0, curveY.value), window.innerHeight - 100);

    const anchorDistance = 200;
    const curviness = anchorDistance - 40;

    blobPath.value = `M60,${height.value}H59V0h1v${curveY.value - anchorDistance}c0,${curviness},${curveX.value},${curviness},${curveX.value},${anchorDistance}S60,${curveY.value},60,${curveY.value + anchorDistance * 2}V${height.value}z`;

    requestAnimationFrame(svgCurve);
  }
};

onMounted(() => {
  if (import.meta.client) {
    height.value = window.innerHeight;
    y.value = window.innerHeight / 2;
    window.addEventListener(`mousemove`, handleMouseMove);
    svgCurve();
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener(`mousemove`, handleMouseMove);
  }
});
</script>

<style scoped>
#menu {
  height: 100vh;
  position: fixed;
  background-color: #fecf572c;
  width: 300px;
  transition: 1000ms all cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(-100%);
  left: 60px;
}

#menu.expanded {
  transform: translateX(0%);
  left: 0px;
}

.menu-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

#blob {
  top: 0;
  z-index: -1;
  right: 60px;
  transform: translateX(100%);
  height: 100%;
  position: absolute;
}

#blob-path {
  height: 100%;
  fill: #ffffff;
}

.hamburger {
  right: 20px;
  position: absolute;
  width: 20px;
  height: 20px;
  margin-top: -10px;
}

.hamburger .line {
  width: 100%;
  height: 4px;
  background-color: #fff;
  position: absolute;
}

.hamburger .line:nth-child(2) {
  top: 50%;
  margin-top: -2px;
}

.hamburger .line:nth-child(3) {
  bottom: 0;
}

h1 {
  position: fixed;
  right: 0;
  margin: 0;
}

ul {
  padding: 0;
  list-style: none;
  width: 80%;
  margin-left: 10%;
  position: absolute;
  top: 10px;
}

ul li {
  color: #fff;
  font-family: sans-serif;
  padding: 20px 0;
}

h2 {
  position: absolute;
  left: 50%;
  color: #fff;
  margin: 0;
  font-size: 16px;
  font-family: sans-serif;
  font-weight: 100;
}
</style>

<!-- <script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const isMenuOpen = ref(false);
const avatarUrl = ref(``);
const name = ref(``);

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
const goToProfile = () => {
  navigateTo(`/profile`);
};
const goToSimulator = () => {
  navigateTo(`/simulator`);
};
onMounted(async () => {
  if (user.value) {
    // Récupérez l'URL de l'avatar depuis votre base de données ou API
    // Ceci est un exemple, adaptez-le à votre structure de données
    const { data, error } = await supabase
      .from(`profiles`)
      .select(`username, avatar_url`)
      .eq(`id`, user.value.id)
      .single();

    if (data && !error) {
      avatarUrl.value = data.avatar_url;
      name.value = data.username;
    }
  }
});
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
        <div class="flex items-center">
          <div
            :class="['menu__icon', { open: isMenuOpen }]"
            @click="toggleMenu"
          >
            <span /><span /><span />
          </div>
          <div>
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
          </div>
          <div :class="['menu__item', { 'menu__item--is-visible': isMenuOpen }]">
            <div
              v-if="!user"
            >
              <UButton
                label="Login"
                type="submit"
                @click="goToLogin"
              />
              <UButton
                label="Simulateur"
                type="submit"
                class="ml-2"
                @click="goToSimulator"
              />
            </div>

            <div
              v-else
              class="w-10 h-10 cursor-pointer"
              @click="goToProfile"
            >
              <UserAuthProfileAvatar
                v-if="user"
                :path="avatarUrl"
                size="large"
                :alt="`Avatar de ${name}`"
              />
            </div>
          </div>
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

 <script setup lang="ts">
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
