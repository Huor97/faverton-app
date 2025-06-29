import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMapPreferences } from './useMapPreferences';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock global pour tester les fonctionnalités du navigateur
Object.defineProperty(window, `localStorage`, {
  value: localStorageMock,
});

describe(`useMapPreferences`, () => {
  beforeEach(() => {
    // Reset tous les mocks avant chaque test
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test(`initialise avec les valeurs par défaut`, () => {
    const { isMapVisible, mapSize, mapSizeClasses } = useMapPreferences();

    expect(isMapVisible.value).toBe(true);
    expect(mapSize.value).toBe(`small`);
    expect(mapSizeClasses.value).toBe(`h-[30vh]`);
  });

  test(`calcule correctement les classes CSS pour chaque taille`, () => {
    const { mapSizeClasses, setMapSize } = useMapPreferences();

    const testCases = [
      { size: `small` as const, expected: `h-[30vh]` },
      { size: `medium` as const, expected: `h-[50vh]` },
      { size: `large` as const, expected: `h-[70vh]` },
    ];

    testCases.forEach(({ size, expected }) => {
      setMapSize(size);
      expect(mapSizeClasses.value).toBe(expected);
    });
  });

  test(`toggle la visibilité de la carte`, () => {
    const { isMapVisible, toggleMapVisibility } = useMapPreferences();

    expect(isMapVisible.value).toBe(true);

    toggleMapVisibility();
    expect(isMapVisible.value).toBe(false);

    toggleMapVisibility();
    expect(isMapVisible.value).toBe(true);
  });

  test(`change la taille de la carte`, () => {
    const { mapSize, setMapSize } = useMapPreferences();

    expect(mapSize.value).toBe(`small`);

    setMapSize(`medium`);
    expect(mapSize.value).toBe(`medium`);

    setMapSize(`large`);
    expect(mapSize.value).toBe(`large`);
  });

  test(`affiche la carte automatiquement quand on change la taille si elle était cachée`, () => {
    const { isMapVisible, mapSize, toggleMapVisibility, setMapSize } = useMapPreferences();

    // Cacher la carte
    toggleMapVisibility();
    expect(isMapVisible.value).toBe(false);

    // Changer la taille devrait réafficher la carte
    setMapSize(`medium`);
    expect(isMapVisible.value).toBe(true);
    expect(mapSize.value).toBe(`medium`);
  });

  test(`sauvegarde les préférences dans localStorage`, () => {
    const { toggleMapVisibility, setMapSize } = useMapPreferences();

    toggleMapVisibility();

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `faverton-map-preferences`,
      JSON.stringify({
        isMapVisible: false,
        mapSize: `small`,
      }),
    );

    setMapSize(`large`);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `faverton-map-preferences`,
      JSON.stringify({
        isMapVisible: true, // Devient true car setMapSize affiche la carte
        mapSize: `large`,
      }),
    );
  });

  test(`charge les préférences sauvegardées depuis localStorage`, () => {
    const savedPreferences = {
      isMapVisible: false,
      mapSize: `large`,
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPreferences));

    const { isMapVisible, mapSize, loadPreferences } = useMapPreferences();

    loadPreferences();

    expect(localStorageMock.getItem).toHaveBeenCalledWith(`faverton-map-preferences`);
    expect(isMapVisible.value).toBe(false);
    expect(mapSize.value).toBe(`large`);
  });

  test(`gère les erreurs de parsing du localStorage gracieusement`, () => {
    const consoleSpy = vi.spyOn(console, `warn`).mockImplementation(() => {});
    localStorageMock.getItem.mockReturnValue(`invalid-json`);

    const { isMapVisible, mapSize, loadPreferences } = useMapPreferences();

    loadPreferences();

    // Doit utiliser les valeurs par défaut
    expect(isMapVisible.value).toBe(true);
    expect(mapSize.value).toBe(`small`);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Erreur lors du chargement des préférences de carte:`,
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  test(`gère l'absence de localStorage gracieusement`, () => {
    // Simuler l'absence de localStorage
    const originalLocalStorage = window.localStorage;
    // @ts-expect-error - Intentionally setting to undefined for testing
    delete window.localStorage;

    const { isMapVisible, mapSize, savePreferences, loadPreferences } = useMapPreferences();

    // Ne devrait pas lancer d'erreur
    expect(() => {
      loadPreferences();
      savePreferences();
    }).not.toThrow();

    // Doit utiliser les valeurs par défaut
    expect(isMapVisible.value).toBe(true);
    expect(mapSize.value).toBe(`small`);

    // Restaurer localStorage
    window.localStorage = originalLocalStorage;
  });

  test(`utilise les valeurs par défaut si les préférences sauvegardées sont partielles`, () => {
    const partialPreferences = {
      mapSize: `medium`,
      // isMapVisible manquant
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(partialPreferences));

    const { isMapVisible, mapSize, loadPreferences } = useMapPreferences();

    loadPreferences();

    expect(isMapVisible.value).toBe(true); // Valeur par défaut
    expect(mapSize.value).toBe(`medium`); // Valeur sauvegardée
  });
});
