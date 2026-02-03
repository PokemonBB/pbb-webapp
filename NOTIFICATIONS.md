# Sistema de Notificaciones

El sistema de notificaciones permite mostrar mensajes al usuario con diferentes tipos, duraciones y acciones.

## Componentes

### 1. Store: `notificationStore`

Ubicación: `/src/lib/stores/notifications.ts`

Maneja el estado de todas las notificaciones activas.

### 2. Componente: `Notification.svelte`

Ubicación: `/src/lib/components/common/Notification.svelte`

Renderiza una notificación individual con soporte para:

- Diferentes tipos (alert, info, warning, error, success)
- Icono específico según el tipo
- Botón para cerrar manualmente
- Acción clickeable opcional

### 3. Componente: `NotificationsContainer.svelte`

Ubicación: `/src/lib/components/common/NotificationsContainer.svelte`

Contenedor que renderiza todas las notificaciones en la esquina superior derecha de la pantalla.

## Uso

### Instalación

1. Importar el `NotificationsContainer` en el layout principal (`+layout.svelte`):

```typescript
import NotificationsContainer from '$lib/components/common/NotificationsContainer.svelte';
```

2. Agregarlo al template (debajo de otros componentes globales):

```svelte
<NotificationsContainer />
```

### API del Store

#### Agregar una notificación

```typescript
import { notificationStore } from '$lib/stores/notifications';

const notificationId = notificationStore.add(
	message, // string: texto de la notificación
	type, // NotificationType: 'alert' | 'info' | 'warning' | 'error' | 'success'
	duration, // number: milisegundos (0 = permanente)
	isClickable, // boolean: si es interactiva
	onClick // function: acción al hacer click (opcional)
);
```

#### Ejemplos

**Notificación simple de info (5 segundos):**

```typescript
notificationStore.add('¡Bienvenido!', 'info');
```

**Notificación de error permanente:**

```typescript
notificationStore.add('Error al conectar con el servidor', 'error', 0);
```

**Notificación interactiva clickeable:**

```typescript
notificationStore.add('Nueva solicitud de amistad', 'info', 10000, true, () => {
	console.log('Ir a solicitudes de amistad');
});
```

**Notificación de éxito:**

```typescript
notificationStore.add('¡Amigo agregado!', 'success', 3000);
```

#### Remover una notificación

```typescript
notificationStore.remove(notificationId);
```

#### Limpiar todas las notificaciones

```typescript
notificationStore.clear();
```

## Tipos de Notificaciones

| Tipo      | Color   | Icono | Uso                  |
| --------- | ------- | ----- | -------------------- |
| `info`    | Azul    | Info  | Información general  |
| `success` | Verde   | Check | Operaciones exitosas |
| `warning` | Naranja | Alert | Advertencias         |
| `error`   | Rojo    | Alert | Errores              |
| `alert`   | Rojo    | Alert | Alertas críticas     |

## Características

✅ **Animaciones suaves** - Entrada y salida con transiciones
✅ **Tema dinámico** - Se adapta al tema claro/oscuro del usuario
✅ **Traducciones** - Usa el sistema de traducciones del proyecto
✅ **Accesibilidad** - ARIA labels y keyboard navigation
✅ **Auto-cierre** - Las notificaciones se cierran automáticamente tras la duración
✅ **Cierre manual** - Botón X para cerrar antes de tiempo
✅ **Interactividad** - Soporte para funciones callback
✅ **Stack** - Múltiples notificaciones se apilan ordenadamente
