export const useMapStore = defineStore(`map`, {
  state: () => ({
    activateDrawing: false,
    drawnArea: 0,
  }),
  actions: {
    startDrawing() {
      this.activateDrawing = true;
    },
    setDrawnArea(area: number) {
      this.drawnArea = area;
    },
    resetDrawing() {
      this.activateDrawing = false;
    },
  },
});
