import { test, expect } from '@playwright/test';

test.describe(`Page de Login - Workflows utilisateur`, () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(`/user/login`);
    await page.waitForLoadState(`networkidle`);
  });

  test(`éléments de la page de login sont présents`, async ({ page }) => {
    // Vérifier que nous sommes sur la page de login
    await expect(page).toHaveURL(/.*\/user\/login/);

    // Vérifier que les éléments sont présents
    await expect(page.locator(`input[type="email"]`)).toBeVisible();
    await expect(page.locator(`input[type="password"]`)).toBeVisible();
    await expect(page.locator(`button[type="submit"]`)).toBeVisible();
    await expect(page.locator(`text=Continuer`)).toBeVisible();

    // Vérifier le titre de la page
    await expect(page.locator(`h1:has-text("Se connecter")`)).toBeVisible();

    // Vérifier le breadcrumb
    await expect(page.locator(`text=Introduction`)).toBeVisible();
  });

  test(`interaction avec les champs de saisie`, async ({ page }) => {
    const email = `test@example.com`;
    const password = `monPassword123`;

    // Test de saisie dans le champ email
    await page.fill(`input[type="email"]`, email);
    await expect(page.locator(`input[type="email"]`)).toHaveValue(email);

    // Test de saisie dans le champ password
    await page.fill(`input[type="password"]`, password);
    await expect(page.locator(`input[type="password"]`)).toHaveValue(password);

    // Vérifier que le bouton reste cliquable
    await expect(page.locator(`button[type="submit"]`)).toBeEnabled();
  });

  test(`soumission du formulaire et affichage du message`, async ({ page }) => {
    // Remplir le formulaire
    await page.fill(`input[type="email"]`, `test@example.com`);
    await page.fill(`input[type="password"]`, `password123`);

    // Soumettre le formulaire
    await page.click(`button[type="submit"]`);

    // Attendre qu'un message apparaisse (peu importe succès ou erreur)
    await expect(page.locator(`p`).last()).toBeVisible({ timeout: 5000 });

    // Vérifier qu'on reste sur la page login
    await expect(page).toHaveURL(/.*\/user\/login/);
  });

  test(`navigation vers register`, async ({ page }) => {
    await page.click(`text=Inscrivez-vous`);
    await expect(page).toHaveURL(/.*\/user\/register/);
  });

  test(`navigation vers introduction`, async ({ page }) => {
    await page.click(`text=Introduction`);
    await expect(page).toHaveURL(/.*\/introduction/);
  });

  test(`test responsive sur mobile`, async ({ page }) => {
    // Changer la taille d'écran pour mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Vérifier que tous les éléments sont encore visibles
    await expect(page.locator(`input[type="email"]`)).toBeVisible();
    await expect(page.locator(`input[type="password"]`)).toBeVisible();
    await expect(page.locator(`button[type="submit"]`)).toBeVisible();
    await expect(page.locator(`h1`)).toBeVisible();
  });

  test(`test des placeholders et labels`, async ({ page }) => {
    // Vérifier les placeholders
    await expect(page.locator(`input[placeholder="Email"]`)).toBeVisible();
    await expect(page.locator(`input[placeholder="Password"]`)).toBeVisible();
  });
});
