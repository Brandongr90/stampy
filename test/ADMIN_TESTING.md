# Guía de Pruebas - Rol Administrador (Negocio)

Este documento contiene los pasos para probar todas las funcionalidades del sistema desde la perspectiva del administrador/dueño del negocio.

## Requisitos Previos

- Servidor de desarrollo corriendo: `npm run dev`
- Acceso a la base de datos de Supabase
- Navegador web moderno

---

## 1. Autenticación

### 1.1 Registro de nuevo negocio

1. Ir a `http://localhost:3000/es/register`
2. Completar el formulario:
   - Nombre del negocio: "Café Test"
   - Email: `test@example.com`
   - Contraseña: `password123`
   - Confirmar contraseña: `password123`
3. Marcar checkbox de términos
4. Click en "Crear Cuenta"

**Resultado esperado:**
- [ ] Redirección automática a `/dashboard`
- [ ] Usuario creado en Supabase Auth
- [ ] Registro en tabla `businesses` con el nombre ingresado

### 1.2 Cerrar sesión

1. En el sidebar, click en "Cerrar Sesión"

**Resultado esperado:**
- [ ] Redirección a `/login`
- [ ] Sesión terminada (no puede acceder a `/dashboard`)

### 1.3 Iniciar sesión

1. Ir a `http://localhost:3000/es/login`
2. Ingresar email y contraseña del registro anterior
3. Click en "Iniciar Sesión"

**Resultado esperado:**
- [ ] Redirección a `/dashboard`
- [ ] Sidebar muestra el plan actual

### 1.4 Prueba de credenciales inválidas

1. Intentar login con email incorrecto
2. Intentar login con contraseña incorrecta

**Resultado esperado:**
- [ ] Mensaje de error "Credenciales incorrectas"
- [ ] No se permite acceso

---

## 2. Dashboard

### 2.1 Vista inicial sin datos

1. Acceder a `/dashboard` con cuenta nueva

**Resultado esperado:**
- [ ] Mensaje de bienvenida
- [ ] Estado vacío indicando crear primer programa
- [ ] Botón CTA "Crear Programa"

### 2.2 Vista con datos

1. Crear al menos un programa y un cliente
2. Volver al dashboard

**Resultado esperado:**
- [ ] Estadísticas mostrando datos reales:
  - Total Clientes
  - Tarjetas Activas
  - Programas Activos
  - Sellos Otorgados
- [ ] Sección "Actividad Reciente" con eventos

---

## 3. Programas de Lealtad

### 3.1 Crear programa tipo Sellos

1. Ir a `/dashboard/programs`
2. Click en "Crear Programa"
3. **Paso 1 - Tipo:** Seleccionar "Sellos"
4. Click "Siguiente"
5. **Paso 2 - Recompensa:**
   - Nombre: "Club del Café"
   - Descripción: "Acumula sellos con cada compra"
   - Sellos necesarios: 10
   - Recompensa: "1 café gratis"
6. Click "Siguiente"
7. **Paso 3 - Diseño:**
   - Seleccionar color azul
   - Seleccionar icono de café ☕
8. Click "Siguiente"
9. **Paso 4 - Preview:** Verificar vista previa
10. Click "Crear Programa"

**Resultado esperado:**
- [ ] Programa creado y visible en listado
- [ ] Badge "Activo" en verde
- [ ] Diseño con colores seleccionados

### 3.2 Crear programa tipo Puntos

1. Repetir proceso seleccionando "Puntos"
2. Configurar: 100 puntos = $50 de descuento

**Resultado esperado:**
- [ ] Programa tipo puntos creado
- [ ] Icono de estrella en la card

### 3.3 Editar programa

1. En el listado, click en botón "..." del programa
2. Seleccionar "Editar"
3. Cambiar nombre a "Club VIP del Café"
4. Cambiar color a verde
5. Click "Guardar Cambios"

**Resultado esperado:**
- [ ] Cambios guardados exitosamente
- [ ] Listado actualizado con nuevo nombre/color

### 3.4 Desactivar programa

1. Click en "..." → "Desactivar"

**Resultado esperado:**
- [ ] Badge cambia a "Inactivo"
- [ ] Programa no disponible para nuevos registros

### 3.5 Activar programa

1. Click en "..." → "Activar"

**Resultado esperado:**
- [ ] Badge cambia a "Activo"

### 3.6 Eliminar programa

1. Click en "..." → "Eliminar"
2. Confirmar en modal

**Resultado esperado:**
- [ ] Modal de confirmación aparece
- [ ] Programa eliminado del listado
- [ ] Mensaje de advertencia sobre tarjetas asociadas

---

## 4. Sistema de Escaneo (Agregar Sellos)

### 4.1 Buscar cliente por email

1. Ir a `/dashboard/scan`
2. Ingresar email de un cliente registrado
3. Click "Buscar"

**Resultado esperado:**
- [ ] Tarjeta del cliente aparece con:
  - Nombre del cliente
  - Nombre del programa
  - Progreso actual (sellos/puntos)
  - Número de serie

### 4.2 Buscar cliente por número de serie

1. Ingresar número de serie de tarjeta (ej: `STM-XXXXXX`)
2. Click "Buscar"

**Resultado esperado:**
- [ ] Misma tarjeta encontrada

### 4.3 Agregar sello (programa tipo Sellos)

1. Buscar cliente con programa de sellos
2. Click "Agregar Sello"

**Resultado esperado:**
- [ ] Mensaje "Sello agregado exitosamente"
- [ ] Contador de sellos incrementa en 1
- [ ] Barra de progreso actualizada
- [ ] Grid de sellos muestra nuevo check

### 4.4 Agregar puntos (programa tipo Puntos)

1. Buscar cliente con programa de puntos
2. Usar selector +/- para elegir cantidad (ej: 25)
3. Click "Agregar 25 Puntos"

**Resultado esperado:**
- [ ] Mensaje "25 puntos agregados exitosamente"
- [ ] Contador de puntos incrementa

### 4.5 Canjear recompensa

1. Buscar cliente que tenga sellos/puntos >= umbral
2. Verificar que aparece botón "Canjear Recompensa"
3. Click en "Canjear Recompensa"

**Resultado esperado:**
- [ ] Mensaje "Recompensa canjeada exitosamente"
- [ ] Sellos/puntos reducidos (se resta el umbral)
- [ ] Contador "Total Canjeado" incrementa

### 4.6 Cliente no encontrado

1. Buscar email que no existe
2. Buscar número de serie inválido

**Resultado esperado:**
- [ ] Mensaje "Cliente no encontrado"

---

## 5. Clientes

### 5.1 Ver listado de clientes

1. Ir a `/dashboard/customers`

**Resultado esperado:**
- [ ] Tabla con clientes registrados
- [ ] Columnas: Cliente, Programa, Progreso, Estado, Registro
- [ ] Contador de total de clientes

### 5.2 Buscar cliente

1. Escribir nombre o email en búsqueda

**Resultado esperado:**
- [ ] Filtrado en tiempo real
- [ ] Si no hay resultados, mensaje apropiado

### 5.3 Acciones de cliente

1. Click en "..." de un cliente
2. Probar "Ver detalles" (TODO)
3. Probar "Enviar email"

**Resultado esperado:**
- [ ] "Enviar email" abre cliente de correo

---

## 6. Cupones

### 6.1 Crear cupón porcentaje

1. Ir a `/dashboard/coupons`
2. Click "Crear Cupón"
3. Seleccionar tipo "Porcentaje"
4. Configurar:
   - Valor: 20%
   - Título: "Descuento de Bienvenida"
   - Descripción: "20% en tu primera compra"
   - Válido hasta: fecha futura
   - Máximo canjes: 100
5. Click "Crear Cupón"

**Resultado esperado:**
- [ ] Cupón creado y visible en listado
- [ ] Muestra "20%" prominente
- [ ] Badge "Activo"

### 6.2 Crear cupón monto fijo

1. Crear cupón con tipo "Monto fijo"
2. Valor: $50

**Resultado esperado:**
- [ ] Muestra "$50" prominente
- [ ] Icono de dólar

### 6.3 Editar cupón

1. Click "..." → "Editar"
2. Cambiar título y valor
3. Guardar

**Resultado esperado:**
- [ ] Cambios reflejados en listado

### 6.4 Desactivar/Activar cupón

1. Probar toggle de estado

**Resultado esperado:**
- [ ] Badge cambia entre Activo/Inactivo

### 6.5 Eliminar cupón

1. Click "..." → "Eliminar"
2. Confirmar

**Resultado esperado:**
- [ ] Cupón eliminado del listado

### 6.6 Cupón expirado

1. Crear cupón con fecha de expiración pasada
2. Verificar en listado

**Resultado esperado:**
- [ ] Badge muestra "Expirado"

---

## 7. Configuración (Settings)

### 7.1 Ver información actual

1. Ir a `/dashboard/settings`

**Resultado esperado:**
- [ ] Campos pre-llenados con datos del negocio
- [ ] Nombre, email, teléfono, tipo, dirección

### 7.2 Actualizar información

1. Cambiar nombre del negocio
2. Agregar teléfono
3. Seleccionar tipo de negocio
4. Agregar dirección
5. Click "Guardar Cambios"

**Resultado esperado:**
- [ ] Mensaje "Cambios guardados exitosamente"
- [ ] Datos persisten al recargar página

### 7.3 Toggles de notificaciones

1. Alternar switches de notificaciones

**Resultado esperado:**
- [ ] UI responde al toggle
- [ ] (Nota: funcionalidad de email pendiente)

---

## 8. Navegación y UI

### 8.1 Sidebar

1. Verificar todos los links del sidebar:
   - Dashboard
   - Programas
   - Escanear
   - Cupones
   - Clientes
   - Notificaciones
   - Analytics
   - Configuración

**Resultado esperado:**
- [ ] Cada link navega correctamente
- [ ] Item activo resaltado

### 8.2 Cambio de idioma

1. Cambiar idioma a English en landing
2. Navegar por la app

**Resultado esperado:**
- [ ] Todos los textos en inglés
- [ ] Rutas cambian a `/en/...`

### 8.3 Responsive

1. Probar en viewport móvil (375px)
2. Probar en tablet (768px)
3. Probar en desktop (1280px+)

**Resultado esperado:**
- [ ] Layout se adapta correctamente
- [ ] No hay overflow horizontal
- [ ] Elementos interactivos son accesibles

---

## 9. Casos de Error

### 9.1 Sin conexión a BD

1. Desconectar Supabase o invalidar keys

**Resultado esperado:**
- [ ] Mensajes de error apropiados
- [ ] No crashes de la aplicación

### 9.2 Sesión expirada

1. Eliminar cookies de sesión manualmente
2. Intentar acceder a `/dashboard`

**Resultado esperado:**
- [ ] Redirección a `/login`

---

## Checklist Final

- [ ] Todos los flujos de autenticación funcionan
- [ ] CRUD completo de programas
- [ ] CRUD completo de cupones
- [ ] Sistema de escaneo funcional
- [ ] Listado de clientes con datos reales
- [ ] Dashboard con estadísticas reales
- [ ] Settings guarda cambios correctamente
- [ ] Internacionalización funciona (ES/EN)
- [ ] UI responsive en todos los breakpoints
