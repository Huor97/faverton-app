<script setup lang="ts">
const user = useSupabaseUser();
const userLoaded = ref(false);

const height = ref<number>(0);
const x = ref<number>(0);
const y = ref<number>(0);
const curveX = ref<number>(0);
const curveY = ref<number>(0);
const targetX = ref<number>(0);
const xitteration = ref<number>(0);
const yitteration = ref<number>(0);
const menuExpanded = ref(false);
const blobPath = ref(`M60,500H58V0h1c0,0,20,172,20,250S60,900,60,500z`);

const handleMouseMove = (e: MouseEvent) => {
  x.value = e.pageX;
  y.value = e.pageY - window.scrollY;
};

const expandMenu = () => {
  menuExpanded.value = true;
};

const collapseMenu = () => {
  menuExpanded.value = false;
};

const easeOutExpo = (currentIteration: number, startValue: number, changeInValue: number, totalIterations: number) => {
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
  <div>
    <div
      id="menu"
      class="w-[300px] max-md:w-[130px] sm:left-[6.25%] xl:left-[5%]"
      :class="{ expanded: menuExpanded }"
    >
      <div
        class="hamburger sm:w-[30px] sm:mr-[4%] md:w-[40px] md:mr-[2.5%] lg:mr-[4%] xl:mr-[6%] 2xl:mr-[10%]"
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
        <div class="flex flex-col mt-10">
          <NuxtLink
            v-if="!user"
            to="/user/login"
            class="text-l font-bold text-white p-2 w-64"
          >
            Login
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

<style scoped>
#menu {
  height: 100vh;
  position: fixed;
  background-color: #fecf572c;
  transition: 1000ms all cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(-100%);
}

#menu.expanded {
  transform: translateX(0%);
  left: 0px;
}

.menu-inner {
  width: 100%;
  height: 100%;
  position: relative;
  top: 5%;
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
  right: 0;
  position: absolute;
  height: 30px;
  margin-top: -10px;
}

.hamburger .line {
  width: 100%;
  height: 5px;
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
