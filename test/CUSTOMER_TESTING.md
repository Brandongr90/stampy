# Guía de Pruebas - Rol Cliente (Usuario Final)

Este documento contiene los pasos para probar todas las funcionalidades del sistema desde la perspectiva del cliente/usuario final que se registra a un programa de lealtad.

## Requisitos Previos

- Servidor de desarrollo corriendo: `npm run dev`
- Al menos un programa de lealtad activo creado por un administrador
- ID del programa para construir la URL de registro
- Navegador web moderno (preferiblemente móvil o emulador)

---

## 1. Acceso al Programa de Lealtad

### 1.1 Obtener URL del programa

**Como administrador:**
1. Ir a `/dashboard/programs`
2. Copiar el ID del programa de la URL al hacer click en editar
3. La URL para clientes será: `/card/[ID_DEL_PROGRAMA]`

**Ejemplo:** `http://localhost:3000/es/card/abc123-def456-...`

### 1.2 Acceder a página de registro

1. Abrir la URL del programa en el navegador
2. Verificar que carga la página de registro

**Resultado esperado:**
- [ ] Página muestra información del programa:
  - Nombre del negocio
  - Nombre del programa
  - Tipo (Sellos/Puntos/Visitas)
  - Meta para recompensa
  - Descripción de la recompensa
- [ ] Formulario de registro visible
- [ ] Diseño con colores del programa

---

## 2. Registro de Cliente

### 2.1 Registro exitoso

1. Completar formulario:
   - Nombre completo: "Juan Pérez"
   - Email: `juan@email.com`
   - Teléfono (opcional): "+52 55 1234 5678"
2. Click en "Obtener mi tarjeta"

**Resultado esperado:**
- [ ] Loading mientras procesa
- [ ] Vista cambia a mostrar la tarjeta
- [ ] Tarjeta muestra:
  - Nombre del cliente
  - Progreso inicial (0 sellos/puntos)
  - Número de serie único (STM-XXXXXX)
  - Código QR
- [ ] Botones de "Agregar a Apple Wallet" y "Agregar a Google Wallet" (deshabilitados por ahora)

### 2.2 Validación de campos

1. Intentar enviar sin nombre

**Resultado esperado:**
- [ ] Mensaje "El nombre es requerido"

2. Intentar enviar sin email

**Resultado esperado:**
- [ ] Mensaje "El correo es requerido"

3. Intentar enviar con email inválido

**Resultado esperado:**
- [ ] Mensaje "Correo inválido"

### 2.3 Cliente ya registrado

1. Intentar registrarse con el mismo email en el mismo programa

**Resultado esperado:**
- [ ] Sistema reconoce cliente existente
- [ ] Muestra su tarjeta actual con progreso acumulado
- [ ] No crea duplicado

---

## 3. Vista de Tarjeta Digital

### 3.1 Elementos de la tarjeta

Verificar que la tarjeta muestra:

**Resultado esperado:**
- [ ] Colores personalizados del programa
- [ ] Emoji/icono configurado
- [ ] Nombre del programa
- [ ] Nombre del cliente
- [ ] Barra de progreso visual
- [ ] Texto "X de Y sellos/puntos"
- [ ] Número de serie
- [ ] Código QR escaneable
- [ ] Mensaje "Presenta este código QR en tu próxima visita"

### 3.2 Código QR

1. Escanear el código QR con otra aplicación

**Resultado esperado:**
- [ ] QR contiene el número de serie de la tarjeta
- [ ] QR es legible y escaneable

### 3.3 Programa tipo Sellos - Grid visual

1. Registrarse en programa tipo sellos

**Resultado esperado:**
- [ ] Grid de cuadros representando sellos
- [ ] Cuadros vacíos con borde punteado
- [ ] Cuadros llenos con check mark (después de agregar sellos)

### 3.4 Programa tipo Puntos

1. Registrarse en programa tipo puntos

**Resultado esperado:**
- [ ] Barra de progreso horizontal
- [ ] Número de puntos actuales
- [ ] Meta de puntos para recompensa

---

## 4. Flujo de Acumulación (Perspectiva del Cliente)

### 4.1 Visita al negocio - Recibir sello

**Escenario:** Cliente muestra QR en el negocio

1. Cliente muestra código QR de su tarjeta
2. Empleado escanea/busca en sistema de admin
3. Empleado agrega sello/puntos

**Resultado esperado (en tarjeta del cliente al refrescar):**
- [ ] Progreso actualizado
- [ ] Nuevo sello visible en grid (tipo sellos)
- [ ] Puntos incrementados (tipo puntos)

### 4.2 Alcanzar meta de recompensa

1. Acumular sellos/puntos hasta alcanzar el umbral

**Resultado esperado:**
- [ ] Barra de progreso llena (100%)
- [ ] Indicación visual de que puede canjear

### 4.3 Canjear recompensa

**Escenario:** Administrador canjea recompensa del cliente

1. Empleado busca cliente en sistema
2. Empleado hace click en "Canjear Recompensa"
3. Cliente recibe su recompensa física

**Resultado esperado (después del canje):**
- [ ] Progreso reiniciado (o reducido por el umbral)
- [ ] Puede seguir acumulando para próxima recompensa

---

## 5. Programa Inactivo

### 5.1 Acceder a programa desactivado

1. Administrador desactiva el programa
2. Cliente intenta acceder a URL del programa

**Resultado esperado:**
- [ ] Mensaje "Programa no encontrado" o "no está activo"
- [ ] No permite registro

### 5.2 Cliente existente con programa inactivo

1. Cliente ya registrado intenta acceder

**Resultado esperado:**
- [ ] Debería poder ver su tarjeta existente
- [ ] No puede registrarse si no tenía tarjeta

---

## 6. Múltiples Programas

### 6.1 Registrarse en múltiples programas del mismo negocio

1. Cliente se registra en Programa A
2. Cliente se registra en Programa B (mismo negocio)

**Resultado esperado:**
- [ ] Dos tarjetas separadas creadas
- [ ] Cada una con su propio progreso
- [ ] Mismo customer_id en la BD

### 6.2 Registrarse en programas de diferentes negocios

1. Cliente se registra en programa de Negocio A
2. Cliente se registra en programa de Negocio B

**Resultado esperado:**
- [ ] Registros separados en cada negocio
- [ ] Diferentes customer_ids (uno por negocio)

---

## 7. Interfaz de Usuario

### 7.1 Responsive - Móvil

1. Acceder desde dispositivo móvil real o emulador (375px)

**Resultado esperado:**
- [ ] Formulario de registro usable
- [ ] Tarjeta se ve correctamente
- [ ] QR es de tamaño adecuado para escanear
- [ ] Botones son suficientemente grandes para tap

### 7.2 Responsive - Tablet

1. Acceder desde tablet o emulador (768px)

**Resultado esperado:**
- [ ] Layout centrado y proporcionado
- [ ] No hay elementos cortados

### 7.3 Colores personalizados

1. Probar con diferentes programas con diferentes colores

**Resultado esperado:**
- [ ] Cada tarjeta refleja colores configurados
- [ ] Texto siempre legible (contraste adecuado)

---

## 8. Idioma

### 8.1 Español

1. Acceder a `/es/card/[programId]`

**Resultado esperado:**
- [ ] Todos los textos en español
- [ ] Labels del formulario en español
- [ ] Mensajes de error en español

### 8.2 Inglés

1. Acceder a `/en/card/[programId]`

**Resultado esperado:**
- [ ] Todos los textos en inglés
- [ ] Labels del formulario en inglés
- [ ] Mensajes de error en inglés

---

## 9. Casos de Error

### 9.1 Programa no existe

1. Acceder a URL con ID de programa inválido

**Resultado esperado:**
- [ ] Mensaje "Programa no encontrado"
- [ ] UI amigable, no error técnico

### 9.2 Error de red durante registro

1. Simular fallo de conexión durante envío

**Resultado esperado:**
- [ ] Mensaje de error apropiado
- [ ] Posibilidad de reintentar

### 9.3 Email ya usado en otro registro del mismo programa

1. Intentar registrar mismo email

**Resultado esperado:**
- [ ] Sistema reconoce y muestra tarjeta existente
- [ ] No crea registro duplicado

---

## 10. Wallet Passes (Futuro)

### 10.1 Botón Apple Wallet

1. Click en "Agregar a Apple Wallet"

**Resultado esperado actual:**
- [ ] Botón visible pero muestra "Próximamente"

**Resultado esperado futuro:**
- [ ] Descarga archivo .pkpass
- [ ] Se abre Apple Wallet
- [ ] Tarjeta agregada al wallet

### 10.2 Botón Google Wallet

1. Click en "Agregar a Google Wallet"

**Resultado esperado actual:**
- [ ] Botón visible pero muestra "Próximamente"

**Resultado esperado futuro:**
- [ ] Redirige a Google Wallet
- [ ] Tarjeta agregada al wallet

---

## Checklist Final - Cliente

### Registro
- [ ] Puede acceder a página de programa vía URL
- [ ] Ve información correcta del programa
- [ ] Puede completar formulario de registro
- [ ] Validaciones de campos funcionan
- [ ] Registro crea tarjeta con QR único

### Tarjeta Digital
- [ ] Muestra diseño personalizado del programa
- [ ] Muestra progreso actual (sellos/puntos)
- [ ] QR es escaneable
- [ ] Número de serie visible

### Acumulación
- [ ] Al agregar sellos (desde admin), progreso se actualiza
- [ ] Al canjear recompensa, progreso se reinicia
- [ ] Historial de recompensas se mantiene

### UI/UX
- [ ] Funciona en móvil
- [ ] Funciona en tablet
- [ ] Funciona en desktop
- [ ] Idiomas ES/EN funcionan

### Casos Límite
- [ ] Programa inactivo muestra mensaje apropiado
- [ ] Cliente existente ve su tarjeta, no crea duplicado
- [ ] Errores de red muestran mensajes amigables

---

## Notas para Testing

### URLs de prueba
```
Registro cliente (ES): http://localhost:3000/es/card/[PROGRAM_ID]
Registro cliente (EN): http://localhost:3000/en/card/[PROGRAM_ID]
```

### Datos de prueba sugeridos

**Cliente 1:**
- Nombre: Juan Pérez
- Email: juan@test.com
- Teléfono: +52 55 1111 1111

**Cliente 2:**
- Nombre: María García
- Email: maria@test.com
- Teléfono: +52 55 2222 2222

**Cliente 3 (sin teléfono):**
- Nombre: Carlos López
- Email: carlos@test.com

### Verificar en Base de Datos

Después de registros, verificar en Supabase:

```sql
-- Ver clientes creados
SELECT * FROM customers ORDER BY created_at DESC;

-- Ver tarjetas creadas
SELECT
  lc.serial_number,
  lc.current_stamps,
  lc.current_points,
  c.name as customer_name,
  lp.name as program_name
FROM loyalty_cards lc
JOIN customers c ON c.id = lc.customer_id
JOIN loyalty_programs lp ON lp.id = lc.program_id;

-- Ver eventos de analytics
SELECT * FROM analytics_events ORDER BY created_at DESC;
```
