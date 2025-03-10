<script setup>
const user = useSupabaseUser();
const userLoaded = ref(false);

const height = ref(0);
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

const items = [
  {
    title: `Simulator`,
    link: `/simulator`,
  },
  {
    title: `Solutions d'Énergie Durable`,
    link: `/introduction/green-energy`,
  },
  {
    title: `Pratiques de Conservation de l'Eau`,
    link: `/introduction/organic-waste-recycling`,
  },
  {
    title: `Des Récoltes Fraîches et Durables`,
    link: `/introduction/sustainable-agriculture`,
  },
  {
    title: `Apprendre et Inspirer`,
    link: `/introduction/education-workshops`,
  },
  {
    title: `Restaurant and Cultural Activities`,
    link: `/introduction/restaurants-cultural-activities`,
  },
  {
    title: `Travailler, Séjourner, Se Connecter`,
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
        <div class="flex flex-col">
          <NuxtLink
            v-if="!user"
            to="/login"
            class="text-l font-bold text-white p-2 w-64"
          >
            Login
          </NuxtLink>
          <NuxtLink
            v-else
            to="/profile"
            class="text-l font-bold text-white p-2 w-64"
          >
            Profile
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
