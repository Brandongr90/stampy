import { test, expect } from "@playwright/test";

test.describe("1. Autenticación", () => {
  test("1.1 Registro de nuevo negocio", async ({ page }) => {
    // 1. Ir a register
    await page.goto("/es/register");

    // 2. Completar formulario
    await page.fill('input[name="businessName"]', "Café Test");
    await page.fill('input[name="email"]', `test_${Date.now()}@example.com`); // Email único
    await page.fill('input[type="password"]', "password123");
    await page.fill('input[name="confirmPassword"]', "password123");

    // 3. Marcar checkbox (asumiendo que hay uno con nombre 'terms' o similar, o buscamos por label)
    // Ajustar selector según implementación real
    const checkbox = page.locator('input[type="checkbox"]');
    if (await checkbox.isVisible()) {
      await checkbox.check();
    }

    // 4. Click Crear Cuenta
    await page.click('button[type="submit"]');

    // Resultado esperado
    await expect(page).toHaveURL(/\/dashboard/);
    // Verificación adicional de creación de usuario/negocio requeriría acceso a BD o API,
    // por ahora confiamos en la redirección exitosa.
  });

  test("1.2 Cerrar sesión", async ({ page }) => {
    // Pre-requisito: estar logueado.
    // En un escenario real, podríamos usar un fixture para loguear,
    // pero aquí seguiremos el flujo manual o nos logueamos primero.

    // Login rápido para probar logout
    await page.goto("/es/login");
    await page.fill('input[name="email"]', "test@example.com"); // Asumiendo usuario existente o creado en setup global
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    // 3. Click Cerrar Sesión
    await page.click("text=Cerrar Sesión"); // O selector específico del sidebar

    // Resultado esperado
    await expect(page).toHaveURL(/\/login/);

    // Intentar acceder a dashboard
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("1.3 Iniciar sesión", async ({ page }) => {
    await page.goto("/es/login");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
    // Verificar sidebar
    await expect(page.locator("nav")).toBeVisible();
  });

  test("1.4 Prueba de credenciales inválidas", async ({ page }) => {
    await page.goto("/es/login");
    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpass");
    await page.click('button[type="submit"]');

    // Mensaje de error
    await expect(page.locator("text=Credenciales incorrectas")).toBeVisible(); // Ajustar texto exacto
    await expect(page).toHaveURL(/\/login/);
  });
});
