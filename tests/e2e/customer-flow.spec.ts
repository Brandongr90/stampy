import { test, expect } from "@playwright/test";

test.describe("Flujo Cliente", () => {
  // Necesitamos un ID de programa válido.
  // En un entorno ideal, lo creamos via API antes del test.
  // Hack: Usaremos una variable o buscaremos uno existente logueandonos como admin primero.
  let programUrl = "";

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    // Login admin para obtener link
    await page.goto("http://localhost:3000/es/login");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("http://localhost:3000/dashboard/programs");

    // Obtener el ID del primer programa o crear uno si no existe
    // Simplificación: ir a editar el primero y sacar ID de URL
    await page.click('button[aria-label="Opciones"]');
    await page.click("text=Editar");
    // URL será .../dashboard/programs/[ID]
    const url = page.url();
    const programId = url.split("/").pop();

    programUrl = `/es/card/${programId}`;
    await page.close();
  });

  test("1.2 & 2.1 Registro de Cliente", async ({ page }) => {
    if (!programUrl) test.skip(true, "No se pudo obtener URL del programa");

    await page.goto(programUrl);

    // Verificar elementos
    await expect(page.locator("form")).toBeVisible();

    // Llenar form
    const email = `juan_${Date.now()}@email.com`;
    await page.fill('input[name="name"]', "Juan Pérez");
    await page.fill('input[name="email"]', email);

    await page.click("text=Obtener mi tarjeta");

    // Verificación tarjeta
    await expect(page.locator("text=Juan Pérez")).toBeVisible();
    await expect(page.locator("text=0 de")).toBeVisible(); // Progreso inicial
    // Verificar QR
    await expect(page.locator("canvas")).toBeVisible(); // O img dependiendo de lib
  });

  test("2.2 Validaciones", async ({ page }) => {
    if (!programUrl) test.skip(true, "No se pudo obtener URL del programa");
    await page.goto(programUrl);

    await page.click("text=Obtener mi tarjeta");
    await expect(page.locator("text=El nombre es requerido")).toBeVisible();
  });
});
