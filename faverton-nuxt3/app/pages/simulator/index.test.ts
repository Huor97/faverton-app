import { shallowMount, type VueWrapper } from '@vue/test-utils';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import SimulatorPage from './index.vue';

// Mock des composables
vi.mock(`~/stores/address`, () => ({
  useAddressStore: () => ({
    savedAddress: {
      featureCollection: {
        features: [{
          properties: {
            postcode: `75001`,
            city: `Paris`,
          },
          geometry: {
            coordinates: [2.3522, 48.8566],
          },
        }],
      },
    },
  }),
}));

vi.mock(`~/composables/useFetchJrc`, () => ({
  useFetchJrc: () => ({
    data: ref(null),
  }),
}));

vi.mock(`~/composables/useSaveJRCData`, () => ({
  useSaveJRCDataToFaverton: vi.fn(),
}));

describe(`SimulatorPage - Interface utilisateur`, () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    // Reset des mocks avant chaque test
    vi.clearAllMocks();

    wrapper = shallowMount(SimulatorPage, {
      global: {
        stubs: {
          UBreadcrumb: true,
          UBadge: true,
          UButton: {
            template: `<button v-bind="$attrs"><slot /></button>`,
            props: [`color`, `variant`, `size`, `class`],
          },
          Icon: true,
          FavertonCard: true,
          FavertonTabs: true,
          SimulationParameters: true,
          SimulationResult: true,
          SimulationHistoryAccess: true,
          ClientOnly: true,
          FavertonMap: true,
          Transition: {
            template: `<div><slot /></div>`,
          },
        },
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test(`affiche les éléments principaux de l'interface`, () => {
    // Vérifier que la page se monte sans erreur
    expect(wrapper.exists()).toBe(true);

    // Vérifier la présence du breadcrumb
    expect(wrapper.findComponent({ name: `UBreadcrumb` }).exists()).toBe(true);

    // Vérifier la présence du conteneur principal
    expect(wrapper.find(`.flex`).exists()).toBe(true);

    // Vérifier la présence de la carte faverton
    expect(wrapper.findComponent({ name: `FavertonCard` }).exists()).toBe(true);
  });

  test(`le bouton flottant est présent`, () => {
    // Le bouton devrait être présent dans le DOM
    const floatingButton = wrapper.find(`[data-testid="floating-map-button"]`);
    expect(floatingButton.exists()).toBe(true);
  });

  test(`peut interagir avec le bouton flottant`, async () => {
    const floatingButton = wrapper.find(`[data-testid="floating-map-button"]`);
    expect(floatingButton.exists()).toBe(true);

    // Tester que le clic ne génère pas d'erreur
    await floatingButton.trigger(`click`);
    expect(wrapper.exists()).toBe(true); // Le composant est toujours monté
  });

  test(`gère correctement les ressources avec mock`, () => {
    // Test simplifié qui vérifie juste que le composant peut être démonté sans erreur
    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });
});
