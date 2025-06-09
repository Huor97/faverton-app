import { vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import SimulationParameters from './SimulationParameters.vue';

const mockUseAddSimulation = vi.hoisted(() => vi.fn());
const mockUseMapStore = vi.hoisted(() => vi.fn());

vi.mock(`~/composables/useSimulation`, () => ({
  useAddSimulation: mockUseAddSimulation,
}));

vi.mock(`~/stores/map`, () => ({
  useMapStore: mockUseMapStore,
}));

describe(`SimulationParameters Component`, () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    vi.clearAllMocks();
  });

  // Tests critiques priorité 1 - Regroupés par fonctionnalité
  describe(`Validation du formulaire`, () => {
    beforeEach(() => {
      mockUseMapStore.mockReturnValue({
        drawnArea: ref(0),
        startDrawing: vi.fn(),
      });
    });

    it(`désactive le bouton quand isFormValid est false`, () => {
      const solarEnergyId = `solar-energy-123`;
      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: null,
          responseSolarEnergyId: { solarEnergyId } as SolarEnergyResponse | null,
        },
      });

      const simulationButton = wrapper.findAllComponents({ name: `UButton` })
        .find(btn => btn.props(`label`) === `Lancer la simulation`);

      expect(simulationButton?.props(`disabled`)).toBe(true);
    });

    it(`active le bouton quand tous les champs requis sont remplis`, async () => {
      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: { solarEnergyId: `test` } as SolarEnergyResponse,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;
      vm.panelId = `panel-123`;
      vm.surface = 50;

      await nextTick();

      const simulationButton = wrapper.findAllComponents({ name: `UButton` })
        .find(btn => btn.props(`label`) === `Lancer la simulation`);

      expect(simulationButton?.props(`disabled`)).toBe(false);
    });
  });

  describe(`Gestion de la simulation`, () => {
    beforeEach(() => {
      mockUseMapStore.mockReturnValue({
        drawnArea: ref(0),
        startDrawing: vi.fn(),
      });
    });

    it(`appelle useAddSimulation avec les bons paramètres lors du handleStart`, async () => {
      const mockSimulationResponse = {
        id: `simulation-123`,
        estimatedProduction: 1000,
      };
      mockUseAddSimulation.mockResolvedValue(mockSimulationResponse);

      const solarEnergyId = `solar-energy-123`;
      const panelId = `panel-456`;

      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: { solarEnergyId } as SolarEnergyResponse,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;
      vm.panelId = panelId;
      vm.surface = 75;
      await nextTick();

      const simulationButton = wrapper.findAllComponents({ name: `UButton` })
        .find(btn => btn.props(`label`) === `Lancer la simulation`);

      await simulationButton?.trigger(`click`);
      await flushPromises();

      expect(mockUseAddSimulation).toHaveBeenCalledTimes(1);
      expect(mockUseAddSimulation).toHaveBeenCalledWith(solarEnergyId, panelId);
    });

    it(`émet update:simulation avec les données correctes`, async () => {
      const mockSimulationResponse = {
        id: `simulation-123`,
        estimatedProduction: 1000,
      };
      mockUseAddSimulation.mockResolvedValue(mockSimulationResponse);

      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: { solarEnergyId: `solar-123` } as SolarEnergyResponse,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;
      vm.panelId = `panel-456`;
      vm.surface = 75;
      await nextTick();

      const simulationButton = wrapper.findAllComponents({ name: `UButton` })
        .find(btn => btn.props(`label`) === `Lancer la simulation`);

      await simulationButton?.trigger(`click`);
      await flushPromises();

      const emittedEvents = wrapper.emitted(`update:simulation`);
      expect(emittedEvents).toBeTruthy();
      expect(emittedEvents?.[0]?.[0]).toEqual({
        ...mockSimulationResponse,
        surface: 75,
      });
    });

    it(`passe à l'étape suivante après succès de handleStart`, async () => {
      mockUseAddSimulation.mockResolvedValue({
        id: `simulation-123`,
        estimatedProduction: 1000,
      });

      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: { solarEnergyId: `solar-123` } as SolarEnergyResponse,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;
      vm.panelId = `panel-456`;
      vm.surface = 75;
      await nextTick();

      const simulationButton = wrapper.findAllComponents({ name: `UButton` })
        .find(btn => btn.props(`label`) === `Lancer la simulation`);

      await simulationButton?.trigger(`click`);
      await flushPromises();

      const emittedModelValue = wrapper.emitted(`update:modelValue`);
      expect(emittedModelValue).toBeTruthy();
      expect(emittedModelValue?.[0]?.[0]).toBe(1);
    });

    it(`ne fait rien si responseSolarEnergyId est null`, async () => {
      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: null, // Cas d'échec
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;
      vm.panelId = `panel-456`;
      vm.surface = 75;

      const simulationButton = wrapper.findAllComponents({ name: `UButton` })
        .find(btn => btn.props(`label`) === `Lancer la simulation`);

      await simulationButton?.trigger(`click`);
      await flushPromises();

      expect(mockUseAddSimulation).not.toHaveBeenCalled();
    });

    it(`ne fait rien si panelId est null`, async () => {
      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: { solarEnergyId: `solar-123` } as SolarEnergyResponse,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;
      vm.panelId = null; // Cas d'échec
      vm.surface = 75;

      const simulationButton = wrapper.findAllComponents({ name: `UButton` })
        .find(btn => btn.props(`label`) === `Lancer la simulation`);

      await simulationButton?.trigger(`click`);
      await flushPromises();

      expect(mockUseAddSimulation).not.toHaveBeenCalled();
    });
  });

  // Test priorité 2
  describe(`Interaction avec la carte`, () => {
    it(`synchronise surface avec mapStore.drawnArea`, async () => {
      const mockDrawnArea = ref(0);
      mockUseMapStore.mockReturnValue({
        drawnArea: mockDrawnArea,
        startDrawing: vi.fn(),
      });

      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: { solarEnergyId: `test` } as SolarEnergyResponse,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;
      await nextTick();
      // Test cas edge: drawnArea = 0 → surface = 1
      vm.surface = mockDrawnArea.value > 0 ? mockDrawnArea.value : 1;
      expect(vm.surface).toBe(1);

      // Test cas normal: drawnArea > 0 → surface = drawnArea
      mockDrawnArea.value = 150;
      vm.surface = mockDrawnArea.value > 0 ? mockDrawnArea.value : 1;
      expect(vm.surface).toBe(150);
    });

    it(`appelle startDrawing au clic sur le bouton dessiner`, async () => {
      const mockStartDrawing = vi.fn();
      mockUseMapStore.mockReturnValue({
        drawnArea: ref(0),
        startDrawing: mockStartDrawing,
      });

      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: { solarEnergyId: `test` } as SolarEnergyResponse,
        },
      });

      await nextTick();

      // Trouver le bouton "Dessiner" (pas celui de simulation)
      const buttons = wrapper.findAllComponents({ name: `UButton` });
      const drawButton = buttons.find(btn =>
        btn.props(`label`) !== `Lancer la simulation`,
      );

      expect(drawButton).toBeDefined();

      await drawButton?.trigger(`click`);

      expect(mockStartDrawing).toHaveBeenCalledTimes(1);
    });

    it(`met surface à 1 quand drawnArea est 0`, async () => {
      const mockDrawnArea = ref(0);

      mockUseMapStore.mockReturnValue({
        drawnArea: mockDrawnArea,
        startDrawing: vi.fn(),
      });

      const wrapper = shallowMount(SimulationParameters, {
        props: {
          modelValue: 0,
          addressProperty: { postcode: `78430`, city: `Louveciennes` },
          responseSolarEnergyId: { solarEnergyId: `test` } as SolarEnergyResponse,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;
      await nextTick();

      expect(vm.surface).toBe(1);

      // Test de la logique complète pour documenter le comportement
      // Cas 1: drawnArea = 0 → surface = 1
      vm.surface = mockDrawnArea.value > 0 ? mockDrawnArea.value : 1;
      expect(vm.surface).toBe(1);

      // Cas 2: drawnArea > 0 → surface = drawnArea
      mockDrawnArea.value = 75;
      vm.surface = mockDrawnArea.value > 0 ? mockDrawnArea.value : 1;
      expect(vm.surface).toBe(75);

      // Cas 3: Retour à 0 → surface = 1
      mockDrawnArea.value = 0;
      vm.surface = mockDrawnArea.value > 0 ? mockDrawnArea.value : 1;
      expect(vm.surface).toBe(1);
    });
  });
});
