import { test, expect } from "@playwright/test";

test.describe("2. Dashboard & 3. Programas", () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto("/es/login");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
  });

  test("2.1 Vista inicial", async ({ page }) => {
    await expect(page.locator("text=Bienvenido")).toBeVisible();
    // Verificar botón CTA si no hay programas (esto depende del estado de la DB)
  });

  test("3.1 Crear programa tipo Sellos", async ({ page }) => {
    await page.goto("/dashboard/programs");
    await page.click("text=Crear Programa");

    // Paso 1
    await page.click("text=Sellos"); // Ajustar selector de tipo
    await page.click("text=Siguiente");

    // Paso 2
    await page.fill('input[name="name"]', "Club del Café Automated");
    await page.fill('textarea[name="description"]', "Acumula sellos");
    await page.fill('input[name="stampsRequired"]', "10");
    await page.fill('input[name="reward"]', "1 café gratis");
    await page.click("text=Siguiente");

    // Paso 3
    // Seleccionar color e icono (ajustar selectores)
    await page.click("text=Siguiente");

    // Paso 4
    await page.click("text=Crear Programa");

    // Verificación
    await expect(page.locator("text=Club del Café Automated")).toBeVisible();
    await expect(page.locator("text=Activo")).toBeVisible();
  });

  test("3.3 Editar programa", async ({ page }) => {
    await page.goto("/dashboard/programs");
    // Asumimos que existe el programa creado
    await page.click('button[aria-label="Opciones"]'); // Ajustar selector "..."
    await page.click("text=Editar");

    await page.fill('input[name="name"]', "Club VIP del Café");
    await page.click("text=Guardar Cambios");

    await expect(page.locator("text=Club VIP del Café")).toBeVisible();
  });

  test("7.2 Actualizar configuración", async ({ page }) => {
    await page.goto("/dashboard/settings");

    await page.fill('input[name="businessName"]', "Café Test Updated");
    // llenar otros campos
    await page.click("text=Guardar Cambios");

    await expect(
      page.locator("text=Cambios guardados exitosamente"),
    ).toBeVisible();
  });
});
