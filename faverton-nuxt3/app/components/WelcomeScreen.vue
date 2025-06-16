<script setup lang="ts">
import { DoubleSide } from "three";

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
</script>

<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera :position="!isSmallScreen? [0, 0, 5] : [0, 0, 8]" />
    <TresGroup>
      <TresGroup ref="boxGroupRef">
        <RoundedBox
          :scale="[1.8, 1.8, 1.8]"
          :args="[1.5, 1.5, 1.5, 2, 0.03]"
        >
          <MeshGlassMaterial
            :side="DoubleSide"
            :metalness="0.05"
            :color="0xff6feff"
          />
        </RoundedBox>
      </TresGroup>
      <Suspense>
        <TresGroup ref="earthRef">
          <GLTFModel
            :position="[0.1, -1.4, 0]"
            :scale="[0.04, 0.04, 0.04]"
            :path="earth"
          />
        </TresGroup>
      </Suspense>
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight
        :intensity="1"
        :position="[5, 10, 7]"
      />
    </TresGroup>
  </TresCanvas>
</template>
