# 🚀 Plan de Optimización de Performance: LCP (Largest Contentful Paint)

El objetivo es reducir el **LCP de 3.08s a menos de 1.2s** optimizando la carga de fuentes, el renderizado inicial y el manejo de estados de carga.

## 📊 Diagnóstico Actual
- **LCP Element:** `h2` en `TrainingAgenda.tsx` (Título de agenda).
- **Causa probable:** Renderizado 100% en cliente (Vite), falta de precarga de fuentes pesadas (`font-black`), y bloqueo por estado de carga global de Auth en `App.tsx`.

---

## 🛠️ Fases de Implementación

### Fase 1: Optimización de Recursos Críticos (index.html)
- [x] **Precarga de Fuentes (Inter):** Añadir `preconnect` y `link rel="stylesheet"` con los pesos específicos (400, 700, 900) para evitar que el navegador espere a descargar el JS para saber qué fuente necesita.
- [x] **DNS Prefetch:** Añadir prefetching para los assets de Firebase.
- [x] **Font-Display Swap:** Asegurar que el texto sea visible inmediatamente incluso con fuentes del sistema mientras carga la fuente final.

### Fase 2: Reducción de "Time to First Paint"
- [x] **HTML Shell/Skeleton:** Inyectar un esqueleto HTML mínimo dentro de `<div id="root"></div>` en `index.html`. Esto permite que el navegador pinte el fondo oscuro y la barra superior antes de que React se cargue.
- [x] **CSS Crítico en Línea:** Mover las variables de color CSS (especialmente `--background`) a un bloque `<style>` en el head para evitar el "flash" de blanco.

### Fase 3: Refactorización de App.tsx (Hidratación)
- [x] **Sustituir Spinner Global:** Cambiar el `Spinner` de pantalla completa en `App.tsx` por un **Layout Skeleton**. 
  - *Razón:* Si mostramos un Spinner, el elemento LCP (`h2`) no existe en el DOM por varios segundos. Al usar un esqueleto con la misma estructura, el LCP ocurre mucho antes.
- [x] **Lazy Loading de Componentes:** Implementar `React.lazy` y `Suspense` para componentes pesados en `App.tsx`.
- [ ] **Priorizar TrainingAgenda:** Asegurar que los datos de la agenda se carguen en paralelo con otras features.

### Fase 4: Code Splitting y Bundling
- [x] **Lazy Loading de Modales y Secciones:** Usar `React.lazy` para el `GlobalModalContainer` y otros componentes secundarios.
- [ ] **Análisis de Bundle:** Verificar que librerías grandes (como Chart.js o Firebase SDK) no estén bloqueando el thread principal al inicio.

---

## ✅ Checklist de Validación
- [ ] **Lighthouse Mobile Score:** > 90 en Performance.
- [ ] **LCP local:** < 1.5s.
- [ ] **Web Vitals en Consola:** No mostrar advertencias de "Preload key requests".
- [ ] **Render Blocking Resources:** Sin CSS innecesario en el head.

---

## 📈 Siguientes Pasos
1. Modificar `index.html` con las fuentes y el esqueleto base.
2. Actualizar `App.tsx` para mejorar la transición del estado `authLoading`.
3. Validar con Chrome DevTools (Performance tab).
