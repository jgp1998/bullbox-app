# 🚀 Plan de Mejora: PageSpeed Insights

Este documento detalla el plan de implementación para optimizar el rendimiento, la accesibilidad y el SEO de BULLBOX, basado en el informe de [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-bullbox-jorncloud-com/4gz5t1v3ol?hl=es-419&form_factor=mobile).

## 📊 Estado Actual
*   **Rendimiento:** 92
*   **Accesibilidad:** 77 ⚠️
*   **SEO:** 82 ⚠️
*   **Prácticas Recomendadas:** 100 ✅

---

## 🛠️ Plan de Acción

### 1. Rendimiento (Performance)
*Objetivo: Alcanzar > 95 optimizando la entrega de recursos y el thread principal.*

- [ ] **Optimización de Caché:** 
    - Configurar políticas de caché eficientes en `firebase.json` (headers `Cache-Control`) para assets estáticos (fuentes, iconos, imágenes). Se recomienda un año (31536000).
- [ ] **Reducción de JavaScript sin usar:**
    - Auditar paquetes pesados. 
    - Implementar splitting más agresivo en rutas y componentes pesados (ej. Chart.js, Firebase Admin features).
- [ ] **Eliminar recursos que bloquean el renderizado:**
    - Asegurar que todos los scripts externos sean `async` o `defer`.
    - Verificar la carga de fuentes (ya iniciada en `lcp-optimization-plan.md`).
- [ ] **Mitigación de tareas largas (Main Thread):**
    - Desglosar procesos pesados en pequeños micro-tasks usando `setTimeout(0)` o `requestIdleCallback`.

### 2. Accesibilidad (Accessibility)
*Objetivo: Alcanzar > 90 eliminando barreras de usuario.*

- [x] **Corrección del Viewport (Prioridad Alta):**
    - Cambiar `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />`
    - Por `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` en `index.html`. 
    - *Nota: Permitir el zoom es un requerimiento crítico de accesibilidad.*
- [x] **Estructura Semántica (Landmarks):**
    - Asegurar que todo el contenido principal esté dentro de una etiqueta `<main>`.
    - Verificar que cada página tenga un `<h1>` único y descriptivo.
- [x] **Contraste de Color:**
    - Auditar elementos de texto sobre fondos oscuros/claros.
    - Especial atención a estados deshabilitados y textos secundarios.

### 3. SEO (Search Engine Optimization)
*Objetivo: Alcanzar > 90 aumentando el tráfico orgánico.*

- [x] **Meta Descripción:**
    - Añadir `<meta name="description" content="Bullbox - La plataforma premium para registrar y trackear tus entrenamientos de forma inteligente. Optimiza tu progreso con analíticas avanzadas.">` en `index.html`.
- [x] **Corrección de robots.txt:**
    - Crear un archivo `public/robots.txt` válido que guíe correctamente a los rastreadores.
    - Ejemplo:
      ```text
      User-agent: *
      Allow: /
      Disallow: /admin/
      Sitemap: https://bullbox-jorncloud.com/sitemap.xml
      ```
- [x] **Idioma del documento:**
    - Cambiar `<html lang="en">` a `<html lang="es">` en `index.html` ya que el contenido es mayoritariamente en español.

---

## 📈 Próximos Pasos (Inmediatos)

1.  **Modificar `index.html`**: Corregir viewport, añadir meta-descripción y cambiar `lang`.
2.  **Crear `public/robots.txt`**: Resolver los errores reportados.
3.  **Configurar `firebase.json`**: Implementar los headers de caché recomendados.
4.  **Auditoría de Componentes**: Revisar contrastes en los componentes UI compartidos (Button, Card, Input).
