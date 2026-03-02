

# Analisis UX de Ventry -- Plan de Mejoras

## Resumen del analisis

Despues de revisar todas las paginas y flujos del producto, identifique las siguientes areas de mejora organizadas por impacto y esfuerzo.

---

## 1. Feedback de errores en formularios y mutaciones

**Problema**: Ninguna pagina muestra toasts de exito/error despues de acciones (crear servicio, guardar horarios, cancelar reserva, etc.). El usuario no sabe si la accion funciono o fallo.

**Solucion**: Agregar `toast.success()` y `toast.error()` en los callbacks `onSuccess`/`onError` de todas las mutaciones existentes (servicios, clientes, bookings, horarios, notificaciones, settings, whatsapp).

---

## 2. Login/Register: mostrar errores del servidor

**Problema**: Si el backend devuelve "credenciales invalidas" o "email ya existe", no se muestra ningun mensaje. El boton deja de girar y no pasa nada.

**Solucion**: Capturar el error de la mutacion y mostrar un alert/toast con el mensaje del backend debajo del formulario.

---

## 3. Confirmacion antes de acciones destructivas

**Problema**: Los botones de "Confirm", "Complete" y "No Show" en BookingsPage ejecutan la accion inmediatamente sin pedir confirmacion. Un clic accidental puede marcar una reserva como completada.

**Solucion**: Usar el `ConfirmDialog` que ya existe en el proyecto para envolver estas acciones criticas.

---

## 4. Paginacion en tablas

**Problema**: Las tablas de bookings y clientes cargan todo sin paginacion. Con muchos datos, la experiencia se degrada.

**Solucion**: Agregar paginacion simple (anterior/siguiente) en BookingsPage y ClientsPage, limitando a 10-15 items por pagina del lado del cliente.

---

## 5. Estado vacio con CTA contextual

**Problema**: Los empty states son genericos. Cuando no hay servicios, por ejemplo, deberian guiar al usuario directamente a crear uno.

**Solucion**: Agregar un boton de accion en cada `EmptyState` (ej: "Add your first service", "Create your first booking") que abra el dialog correspondiente.

---

## 6. Dashboard: grafico de tendencia semanal

**Problema**: El dashboard solo muestra 4 KPIs numericos. Para un negocio, ver la tendencia de reservas en la semana es mas util.

**Solucion**: Agregar un mini grafico de barras con recharts (ya instalado) debajo de los KPIs mostrando bookings por dia de la semana actual.

---

## 7. Booking detail drawer: mas acciones y mejor layout

**Problema**: El drawer de detalle de reserva tiene informacion basica pero no permite cancelar directamente desde ahi, y el layout es plano.

**Solucion**: Agregar boton de cancelar en el drawer, mejorar la disposicion visual con separadores y iconos para cada campo.

---

## 8. Mobile: sidebar responsive mejorada

**Problema**: El sidebar mobile se cierra con click en el overlay pero no tiene un boton de cerrar explicito ni animacion de entrada/salida.

**Solucion**: Agregar animacion de slide con framer-motion (ya instalado) y un boton X visible para cerrar.

---

## 9. Settings: timezone como select, no input libre

**Problema**: El campo de timezone en SettingsPage es un input de texto libre. El usuario puede escribir cualquier cosa.

**Solucion**: Reemplazar con un `Select` con las zonas horarias mas comunes de LATAM (America/Bogota, America/Mexico_City, America/Lima, etc.).

---

## 10. Breadcrumbs en paginas internas

**Problema**: No hay breadcrumbs. Cuando el usuario navega a una sub-pagina (ej: detalle de tenant en plataforma), no tiene contexto visual de donde esta.

**Solucion**: Agregar un breadcrumb simple en el header de las paginas que tienen jerarquia (TenantDetailPage, WhatsAppSetupPage, OnboardingPage).

---

## Orden de implementacion sugerido

| Prioridad | Mejora | Esfuerzo |
|-----------|--------|----------|
| 1 | Toasts de exito/error en mutaciones | Bajo |
| 2 | Errores del servidor en login/register | Bajo |
| 3 | Confirmacion en acciones destructivas | Bajo |
| 4 | Empty states con CTA | Bajo |
| 5 | Timezone como select | Bajo |
| 6 | Sidebar mobile animada | Medio |
| 7 | Grafico semanal en dashboard | Medio |
| 8 | Paginacion en tablas | Medio |
| 9 | Breadcrumbs | Medio |
| 10 | Booking drawer mejorado | Bajo |

---

## Detalles tecnicos

- **Toasts**: Usar `sonner` (ya instalado) con `toast.success(t('common:saved'))` y `toast.error(err.message)`.
- **Grafico**: Usar `recharts` `BarChart` con datos agrupados por dia desde el array de bookings.
- **Animaciones sidebar**: `framer-motion` `AnimatePresence` + `motion.aside` con `initial/animate/exit` para slide-in.
- **Paginacion**: Estado local `page` + slice del array filtrado. Componente `Pagination` de shadcn/ui ya existe.
- **Timezone select**: Array hardcodeado de ~10 zonas LATAM con `Select` de shadcn/ui.
- **ConfirmDialog**: Ya existe en `src/components/molecules/ConfirmDialog.tsx`, solo hay que usarlo.

