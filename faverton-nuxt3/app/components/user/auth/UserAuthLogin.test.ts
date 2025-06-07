import { vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import UserAuthLogin from './UserAuthLogin.vue';

describe(`UserAuthLogin Component`, () => {
  test(`rend le formulaire avec les champs requis`, () => {
    const wrapper = shallowMount(UserAuthLogin, {
      global: { stubs: { UInput: false, UButton: false } },
    });

    const inputs = wrapper.findAll(`input`);

    expect(inputs.length).toBe(2);
    expect(inputs.at(0)?.attributes(`type`)).toBe(`email`);
    expect(inputs.at(1)?.attributes(`type`)).toBe(`password`);
    expect(wrapper.find(`u-link-stub`).attributes(`type`)).toBe(`submit`);
  });

  test(`affiche message d'erreur quand signInWithPassword échoue`, async () => {
    const wrapper = shallowMount(UserAuthLogin);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any;
    vm.email = `wrong@email.com`;
    vm.password = `wrongpassword`;

    await vm.login();
    await flushPromises();

    expect(vm.error).toBe(`Erreur d'authentification`);
    expect(vm.message).toBe(`Login ne peut pas être effectué, une erreur s'est produite`);
  });

  test(`redirige vers /simulator en cas de succès`, async () => {
    const navigateToMock = vi.fn();
    vi.stubGlobal(`navigateTo`, navigateToMock);

    const wrapper = shallowMount(UserAuthLogin);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any;

    const mockSignIn = vi.spyOn(vm.supabase.auth, `signInWithPassword`)
      .mockResolvedValue({ error: null });

    vm.email = `valid@email.com`;
    vm.password = `correctpassword`;

    await vm.login();
    await flushPromises();

    expect(mockSignIn).toHaveBeenCalledWith({
      email: `valid@email.com`,
      password: `correctpassword`,
    });
    expect(vm.error).toBe(``);
    expect(vm.message).toBe(`Connexion réussie`);
    await nextTick();

    // TODO: Erreur à résudre
    expect(navigateToMock).toHaveBeenCalledWith(`/simulator`);
    expect(navigateToMock).toHaveBeenCalledTimes(1);
  });

  test.todo(`transmet les bonnes données à signInWithPassword`, async () => {
  // Action: remplir email/password et soumettre
  // Assertion: signInWithPassword appelé avec { email, password }
  });

  test.todo(`met à jour correctement les variables error et message`, async () => {
  // Cas échec: error = "Erreur d'authentification", message = "Login ne peut pas..."
  // Cas succès: error = "", message = "Connexion réussie"
  });
});
