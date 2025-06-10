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
const svgURL = `Faverton logo.svg`;

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
</script>

<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera :position="[0, 0, 5]" />
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
        <Suspense>
          <SVG
            :src="svgURL"
            :position="[-0.4, -0.4, 1.13]"
            :scale="0.001"
          />
        </Suspense>
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
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :intensity="1" />
    </TresGroup>
  </TresCanvas>
</template>
