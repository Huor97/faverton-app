import { test, expect } from '@playwright/test';

test.describe(`Page de Login`, () => {
  test.beforeEach(async ({ page }) => {
    // S'assurer qu'aucune session n'existe
    await page.context().clearCookies();
    await page.goto(`/user/login`);
  });

  test.only(`devrait afficher le composant UserAuthLogin`, async ({ page }) => {
    // Attendre que la page soit chargée
    await page.waitForLoadState(`networkidle`);

    // Vérifier que le composant de login est présent
    await expect(page.locator(`form`)).toBeVisible();
    await expect(page.locator(`input[type="email"]`)).toBeVisible();
    await expect(page.locator(`input[type="password"]`)).toBeVisible();
  });

  //   test(`devrait rester sur login si utilisateur non connecté`, async ({ page }) => {
  //     // S'assurer qu'aucun utilisateur n'est connecté
  //     await page.context().clearCookies();

  //     await page.goto(`/user/login`);

  //     // Vérifier qu'on reste sur la page login
  //     await expect(page).toHaveURL(`/user/login`);
  //     await expect(page.locator(`form`)).toBeVisible();
  //   });

  //   test(`devrait rediriger vers login depuis la page d'accueil si non connecté`, async ({ page }) => {
  //     // S'assurer qu'aucun utilisateur n'est connecté
  //     await page.context().clearCookies();

  //     // Essayer d'aller sur la page d'accueil
  //     await page.goto(`/`);

  //     // Devrait être redirigé vers login
  //     await expect(page).toHaveURL(`/user/login`);
  //   });

  //   test(`devrait rediriger vers profile si utilisateur connecté essaie d'accéder au login`, async ({ page }) => {
  //     // Simuler un utilisateur connecté avec Supabase
  //     // Vous devrez adapter ces cookies selon votre configuration Supabase
  //     await page.context().addCookies([
  //       {
  //         name: `sb-access-token`, // Cookie Supabase typique
  //         value: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjkwMDAwMDAwLCJzdWIiOiIxMjM0NTY3OC05MGFiLWNkZWYtMTIzNC01Njc4OTBhYmNkZWYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIn0.fake-signature`,
  //         domain: `localhost`,
  //         path: `/`,
  //       },
  //       {
  //         name: `sb-refresh-token`,
  //         value: `fake-refresh-token`,
  //         domain: `localhost`,
  //         path: `/`,
  //       },
  //     ]);

  //     await page.goto(`/user/login`);

  //     // Devrait être redirigé vers profile
  //     await expect(page).toHaveURL(`/user/profile`);
  //   });

  //   // Test de base sans middleware
  //   test.skip(`devrait permettre la connexion avec identifiants valides`, async ({ page }) => {
  //     // Remplir le formulaire
  //     await page.fill(`input[type="email"]`, `test@example.com`);
  //     await page.fill(`input[type="password"]`, `password123`);

  //     // Soumettre le formulaire
  //     await page.click(`button[type="submit"]`);

//     // Attendre la redirection après connexion réussie
//     await page.waitForURL(`/user/profile`, { timeout: 10000 });
//     await expect(page).toHaveURL(`/user/profile`);
//   });
});
