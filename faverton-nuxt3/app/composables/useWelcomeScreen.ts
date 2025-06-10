import type { Ref } from 'vue';

export function useMouse3D() {
  const mouse = ref({ x: 0, y: 0 });
  const targetRotation = ref({ x: 0, y: 0 });
  const needsUpdate = ref(false);

  let rafId: number | null = null;

  const updateMousePosition = (event: MouseEvent) => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      const newX = event.clientX;
      const newY = event.clientY;

      if (mouse.value.x === newX && mouse.value.y === newY) {
        rafId = null;
        return;
      }

      mouse.value.x = newX;
      mouse.value.y = newY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const normalizedX = (newX - centerX) / centerX;
      const normalizedY = (newY - centerY) / centerY;

      targetRotation.value.x = normalizedY * 0.3;
      targetRotation.value.y = normalizedX * 0.3;
      needsUpdate.value = true;

      rafId = null;
    });
  };

  const initializeMouse = () => {
    mouse.value.x = window.innerWidth / 2;
    mouse.value.y = window.innerHeight / 2;
    window.addEventListener(`mousemove`, updateMousePosition);
  };

  const cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    window.removeEventListener(`mousemove`, updateMousePosition);
  };

  return {
    mouse: readonly(mouse),
    targetRotation: readonly(targetRotation),
    needsUpdate,
    initializeMouse,
    cleanup,
  };
}

interface RotationTarget {
  x: number
  y: number
}

export function use3DRotation() {
  const currentRotation = ref({ x: 0, y: 0 });

  const updateRotation = (
    targetRotation: Ref<RotationTarget>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boxRef: Ref<any>,
    needsUpdate: Ref<boolean>,
  ) => {
    if (!needsUpdate.value || !boxRef.value) return;

    const lerpSpeed = 0.05;
    const threshold = 0.001;

    currentRotation.value.x += (targetRotation.value.x - currentRotation.value.x) * lerpSpeed;
    currentRotation.value.y += (targetRotation.value.y - currentRotation.value.y) * lerpSpeed;

    boxRef.value.rotation.x = currentRotation.value.x;
    boxRef.value.rotation.y = currentRotation.value.y;

    // Arrêter quand proche de la cible
    if (Math.abs(targetRotation.value.x - currentRotation.value.x) < threshold
      && Math.abs(targetRotation.value.y - currentRotation.value.y) < threshold) {
      needsUpdate.value = false;
    }
  };

  return {
    currentRotation: readonly(currentRotation),
    updateRotation,
  };
}

export function useEarthRotation() {
  const rotationSpeed = ref(0.1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateEarthRotation = (earthRef: Ref<any>, elapsed: number) => {
    if (!earthRef.value) return;
    earthRef.value.rotation.y = elapsed * rotationSpeed.value;
  };

  const setRotationSpeed = (speed: number) => {
    rotationSpeed.value = speed;
  };

  return {
    rotationSpeed: readonly(rotationSpeed),
    updateEarthRotation,
    setRotationSpeed,
  };
}
