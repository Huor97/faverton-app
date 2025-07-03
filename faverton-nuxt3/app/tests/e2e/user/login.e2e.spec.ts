import { test, expect } from '@playwright/test';

test.describe('Page de Login - Workflows utilisateur', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/user/login');
    await page.waitForLoadState('networkidle');
  });

  test('éléments de la page de login sont présents', async ({ page }) => {
    // Vérifier que nous sommes sur la page de login
    await expect(page).toHaveURL(/.*\/user\/login/);

    // Vérifier que les éléments sont présents avec des sélecteurs robustes
    await expect(page.getByTestId('login-email-input')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();

    // Vérifier également le lien "Continuer sans compte" séparément
    await expect(page.getByRole('link', { name: 'Continuer sans compte' })).toBeVisible();

    // Vérifier le titre de la page
    await expect(page.locator('h1:has-text("Se connecter")')).toBeVisible();

    // Vérifier le breadcrumb
    await expect(page.getByRole('link', { name: 'Accueil' })).toBeVisible();
  });

  test('interaction avec les champs de saisie', async ({ page }) => {
    const email = 'test@example.com';
    const password = 'monPassword123';

    // Test de saisie dans le champ email
    await page.getByTestId('login-email-input').fill(email);
    await expect(page.getByTestId('login-email-input')).toHaveValue(email);

    // Test de saisie dans le champ password
    await page.getByTestId('login-password-input').fill(password);
    await expect(page.getByTestId('login-password-input')).toHaveValue(password);

    // Vérifier que le bouton reste cliquable
    await expect(page.getByTestId('login-submit-button')).toBeEnabled();
  });

  test('soumission du formulaire et affichage du message', async ({ page }) => {
    // Remplir le formulaire
    await page.getByTestId('login-email-input').fill('test@example.com');
    await page.getByTestId('login-password-input').fill('password123');

    // Soumettre le formulaire en utilisant un sélecteur spécifique
    await page.getByTestId('login-submit-button').click();

    // Attendre qu'un message apparaisse (peu importe succès ou erreur)
    await expect(page.locator('p').last()).toBeVisible({ timeout: 5000 });

    // Vérifier qu'on reste sur la page login
    await expect(page).toHaveURL(/.*\/user\/login/);
  });

  test('navigation vers register', async ({ page }) => {
    await page.getByRole('link', { name: 'Pas encore de compte ? Inscrivez-vous' }).click();
    await expect(page).toHaveURL(/.*\/user\/register/);
  });

  test('navigation vers introduction', async ({ page }) => {
    await page.getByRole('link', { name: 'Accueil' }).click();
    await expect(page).toHaveURL(/.*\/introduction/);
  });

  test('test responsive sur mobile', async ({ page }) => {
    // Changer la taille d'écran pour mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Vérifier que tous les éléments sont encore visibles
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
    
    // Vérifier spécifiquement le titre de connexion
    await expect(page.getByRole('heading', { name: 'Se connecter' })).toBeVisible();
  });

  test('test des placeholders et labels', async ({ page }) => {
    // Vérifier les placeholders
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Mot de passe"]')).toBeVisible();
  });
});
