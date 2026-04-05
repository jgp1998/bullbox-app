# Plan de Implementación: Skeleton y Spinner de Carga

Este plan detalla los pasos para integrar estados de carga visualmente atractivos (Skeletons y Spinners) en BullBox, mejorando la Percepción de Rendimiento y la UX.

## 1. Componentes Base en `/src/shared/components/ui`

### 1.1 `Skeleton.tsx` (Nuevo)
Crear un componente base altamente reutilizable con animaciones de "pulso".
- **Props**: `className`, `width`, `height`, `variant` (circle, rect, text).
- **Estilo**: Usar colores del sistema (`var(--input)`) con un degradado animado.

### 1.2 `Spinner.tsx` (Refactorización)
Asegurar que el Spinner existente sea el estándar para toda la app.
- Reemplazar implementaciones manuales (como en `App.tsx`) con `<Spinner />`.
- Añadir variants de color (primary, white, muted).

## 2. Componentes de Skeleton Específicos

Para evitar "layout shifts", crearemos placeholders que imiten la estructura real:

### 2.1 `RecordCardSkeleton.tsx`
Replica la estructura de las tarjetas en `PersonalBests`:
- Círculo o rectángulo redondeado para el valor central.
- Líneas de texto para el nombre del ejercicio y la fecha.
- Contenedor con el mismo padding y bordes que `Card`.

### 2.2 `HistoryItemSkeleton.tsx`
Replica las filas de `WorkoutHistory`:
- Rectángulo largo y delgado con bordes redondeados.
- Placeholder para los iconos laterales.

## 3. Integración en Features

### 3.1 `Auth` (Login/Register)
- Mostrar `<Spinner />` dentro del botón de Submit cuando `isSubmitting` sea true.
- Mostrar la pantalla de carga global con `Spinner` al inicializar Firebase (ya existe, pero se puede mejorar con un logo).

### 3.2 `Records` (Personal Bests)
- Usar `isLoading` de `useRecords()` para mostrar una rejilla de `RecordCardSkeleton`.

### 3.3 `Workout` (History)
- Usar `isLoading` de `useWorkouts()` para mostrar una lista de `HistoryItemSkeleton`.

### 3.4 `Schedule` (Agenda)
- Implementar skeletons para las sesiones programadas.

## 4. Mejoras de UX (Micro-interacciones)

- **Transiciones**: Añadir sutiles animaciones de `fade-in` cuando el contenido real reemplaza a los skeletons.
- **Threshold**: No mostrar skeletons si la carga dura menos de 200ms para evitar parpadeos innecesarios (opcional).

## Checklist de Tareas

- [ ] Crear `src/shared/components/ui/Skeleton.tsx`
- [ ] Crear `src/features/records/components/RecordCardSkeleton.tsx`
- [ ] Crear `src/features/workout/components/HistoryItemSkeleton.tsx`
- [ ] Refactorizar `App.tsx` para usar el componente `Spinner`
- [ ] Integrar lógica de `isLoading` en `App.tsx` para `PersonalBests` y `WorkoutHistory`
- [ ] Añadir estados de carga a los botones de `LoginScreen`
