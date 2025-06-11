<script setup lang="ts">
import { DoubleSide } from "three";

const router = useRouter();

const {
  targetRotation,
  needsUpdate,
  initializeMouse,
  cleanup,
} = useMouse3D();

const { updateRotation } = use3DRotation();
const { updateEarthRotation } = useEarthRotation();

const boxGroupRef = ref();
const earthRef = ref();

const earth = `/models/earth.glb`;

const { onLoop } = useRenderLoop();

onLoop(({ elapsed }) => {
  updateRotation(targetRotation, boxGroupRef, needsUpdate);
  updateEarthRotation(earthRef, elapsed);
});

onMounted(() => {
  initializeMouse();
});

onUnmounted(() => {
  cleanup();
});

const { isMobile } = useDevice();
const isSmallScreen = computed(() => isMobile);

const handlePointerEnter = () => {
  document.body.style.cursor = `pointer`;
};

const handlePointerLeave = () => {
  document.body.style.cursor = `default`;
};

const handleClick = () => {
  router.push(`/introduction`);
};
</script>

<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera :position="!isSmallScreen? [0, 0, 5] : [0, 0, 8]" />
    <TresGroup>
      <TresGroup ref="boxGroupRef">
        <RoundedBox
          :scale="[1.5, 1.5, 1.5]"
          :args="[1.5, 1.5, 1.5, 2, 0.03]"
        >
          <MeshGlassMaterial
            :side="DoubleSide"
            :metalness="0.05"
          />
        </RoundedBox>
      </TresGroup>
      <Suspense>
        <TresGroup ref="earthRef">
          <GLTFModel
            :position="[0, -1, 0.1]"
            :scale="[0.03, 0.03, 0.03]"
            :path="earth"
          />
        </TresGroup>
      </Suspense>
      <Suspense>
        <Text3D
          :text="'ENTRÉE'"
          :font="'/fonts/Concert.json'"
          :size="0.3"
          :position="[0, 0, 1]"
          :curve-segments="12"
          :height="0.05"
          @pointer-enter="handlePointerEnter"
          @pointer-leave="handlePointerLeave"
          @click="handleClick"
        >
          <MeshStandardMaterial color="#16A34A" />
        </Text3D>
      </Suspense>
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :intensity="1" />
    </TresGroup>
  </TresCanvas>
</template>
