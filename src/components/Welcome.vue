<script setup lang="ts">
import { shallowRef } from "vue";
import { TresCanvas, useRenderLoop } from "@tresjs/core";
import {
  RoundedBox,
  MeshGlassMaterial,
  GLTFModel,
  MouseParallax,
  Text3D,
  Levioso,
  Html,
} from "@tresjs/cientos";
import { BackSide } from "three";

const pathEarh = "/models/earth.glb";

const boxRef = shallowRef();

const { onLoop } = useRenderLoop();

onLoop(({ elapsed }) => {
  if (boxRef.value) {
    boxRef.value.rotation.y = elapsed * 0.1;
  }
});
</script>
<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera :position="[0, -0.4, 5]" />
    <Suspense>
      <Text3D
        :position="[0, 0, -3]"
        :scale="[3, 7, 2]"
        font="/fonts/Concert.json"
      >
        FAVERTON
        <TresMeshStandardMaterial color="#00acd4" />
      </Text3D>
    </Suspense>

    <Suspense>
      <TresMesh ref="boxRef">
        <GLTFModel
          :position="[0, -1, 0.1]"
          :path="pathEarh"
          :scale="[0.03, 0.03, 0.03]"
        />
      </TresMesh>
    </Suspense>

    <Levioso ref="groupRef">
      <TresMesh>
        <RoundedBox :scale="[1.5, 1.5, 1.5]" :args="[1.5, 1.5, 1.5, 2, 0.03]">
          <MeshGlassMaterial :side="BackSide" />
        </RoundedBox>
      </TresMesh>

      <Html
        center
        transform
        :distance-factor="4"
        :position="[0, 0, 0.65]"
        :scale="[0.75, 0.75, 0.75]"
      >
        <h1 class="bg-white dark:bg-dark text-xs p-1 rounded">START</h1>
      </Html>
    </Levioso>

    <TresDirectionalLight :intensity="1" :position="[-10, -6, 50]" />
    <TresAmbientLight :intensity="1" />
    <MouseParallax :factor="1" :ease="3" />
  </TresCanvas>
</template>

<style scoped>
h1 {
  cursor: pointer;
}
</style>
