# Plan de Implementación: Refactorización y Escalabilidad - Bullbox App

Este plan describe los pasos necesarios para limpiar la arquitectura actual, eliminar el monolito `App.tsx` y consolidar la estructura de archivos según los principios de Clean Architecture y Feature-Sliced Design (FSD).

---

## Fase 1: Consolidación de Directorios y Limpieza de Raíz
**Objetivo:** Eliminar la fragmentación entre la raíz y `src/`, unificando todo el código fuente en un solo lugar.

- [x] 1. **Reorganización de Código compartido:**
   - [x] Mover `hooks/` de la raíz a `src/shared/hooks/`.
   - [x] Mover `services/` de la raíz a `src/shared/services/`.
   - [x] Mover `utils/` de la raíz a `src/shared/utils/`.
   - [x] Mover `store/` de la raíz a `src/shared/store/`.
   - [x] Mover `context/` de la raíz a `src/shared/context/`.
   - [x] Mover `constants.ts` y `types.ts` a `src/shared/constants/` y `src/shared/types/`.

- [x] 2. **Unificación de Punto de Entrada:**
   - [x] Mover `App.tsx`, `index.tsx` e `index.css` a `src/`.
   - [x] Actualizar las referencias de archivos en `index.html`.

- [x] 3. **Actualización de Imports:**
   - [x] Corregir todos los paths que ahora han cambiado.
   - [x] Forzar el uso del alias `@/*` para que siempre apunte a `src/`.

---

## Fase 2: Descomposición del Monolito `App.tsx`
**Objetivo:** Aplicar el principio de Responsabilidad Única (**S**) al punto de entrada de la aplicación.

- [x] 1. **Creación de Layouts:**
   - [x] Extraer el `Header` y la estructura de `<main>` a un `MainLayout.tsx` en `src/shared/components/layout/`.

- [x] 2. **Implementación de un `AppInitializer`:**
   - [x] Crear un componente que maneje las suscripciones globales (auth, records) y los efectos iniciales (temas), dejando `App.tsx` limpio.

- [x] 3. **Sistema de Gestión de Modales:**
   - [x] Actualmente, `App.tsx` tiene 4+ modales declarados.
   - [x] Refactorizar para usar un `GlobalModalContainer` que renderice el modal activo basado en un ID del `useUIStore`.
   - [x] Esto permitirá abrir modales desde cualquier parte del código sin pasar props por toda la jerarquía.

---

## Fase 3: Estandarización de Infraestructura y PWA
**Objetivo:** Modernizar las herramientas de soporte.

- [x] 1. **Configuración de Aliases:**
   - [x] Ajustar `tsconfig.json` y `vite.config.ts` para resolver `@/` de forma consistente.

- [x] 2. **Migración a `vite-plugin-pwa`:**
   - [x] Eliminar el registro manual de Service Worker en `index.tsx`.
   - [x] Implementar el plugin para un manejo robusto de versiones, banners de instalación y modo offline.

- [x] 3. **Tipado Estricto:**
   - [x] Mover tipos de dominio a `src/core/domain/models`.
   - [x] Mover tipos compartidos de UI a `src/shared/types`.

---

## Fase 4: Sincronización Core ↔ Features
**Objetivo:** Asegurar que las features no "atajen" la arquitectura.

- [x] 1. **Auditoría de Hooks:**
   - [x] Asegurar que hooks como `useWorkouts` solo se comuniquen con la capa de aplicación (`use-cases`) y no directamente con la infraestructura (Firebase).
- [x] 2. **Eliminación de Redundancias:**
   - [x] Borrar cualquier lógica duplicada entre `src/shared/utils` y las utilidades específicas de features si estas últimas pueden ser generalizadas. (Movidos cálculos de RM a shared).

---

## Cronograma Sugerido

| Semana | Actividad | Riesgo |
|--------|-----------|--------|
| **1** | Fase 1: Limpieza y reorganización de carpetas. | Alto (rompe todos los imports). |
| **2** | Fase 2: Refactorización de App.tsx y Modales. | Medio (lógica de UI). |
| **3** | Fase 3: Tipado, Aliases y PWA. | Bajo. |
| **4** | Fase 4: Pulido final y validación de Core. | Bajo. |

---
*Plan propuesto por Antigravity AI - 2026-04-05*
