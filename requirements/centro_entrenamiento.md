# Requerimientos del Sistema de Gestión de Centro de Entrenamiento (Bullbox-App)

Este documento detalla las épicas y requerimientos técnicos para el sistema de gestión del centro deportivo.

---

## EPIC 1 — Sistema de Roles y Permisos (RBAC)

### Objetivo
Implementar un sistema de control de acceso basado en roles que permita definir claramente qué acciones puede realizar cada tipo de usuario dentro del sistema.

### Descripción
Se deben soportar los siguientes roles: **Athlete**, **Coach**, **Administrativo** y **Administrador**. Cada rol tendrá permisos específicos asociados a funcionalidades del sistema.

### Criterios de Aceptación
- El sistema permite asignar un rol a cada usuario dentro de un box.
- Los roles disponibles son: `athlete`, `coach`, `administrativo`, `administrador`.
- Los permisos se validan en **backend**, no solo en frontend.
- Cada endpoint valida el rol antes de ejecutar lógica.
- Usuarios sin permisos reciben respuesta **403**.

### Consideraciones Técnicas
- Implementar middleware de autorización.
- Evitar lógica hardcodeada dispersa.
- Centralizar validación de permisos.

---

## EPIC 2 — Multi-Tenancy y Aislamiento por Box

### Objetivo
Asegurar que los datos estén completamente aislados entre distintos centros deportivos (boxes).

### Descripción
Cada usuario puede pertenecer a uno o más boxes, y su rol puede variar por cada uno. Toda la información debe filtrarse por `box_id`.

### Criterios de Aceptación
- Existe una entidad de relación usuario-box (`membership`).
- Cada registro relevante incluye `box_id`.
- No es posible acceder a datos de otro box.
- Todas las consultas filtran por `box_id`.

### Consideraciones Técnicas
- Modelo base: `user`, `box`, `membership`.
- Validación obligatoria en backend.
- Prevención de fuga de datos entre tenants.

---

## EPIC 3 — Restricción de Visibilidad entre Atletas

### Objetivo
Evitar que los atletas puedan acceder a información de otros atletas.

### Descripción
Los usuarios con rol **athlete** solo pueden acceder a su propia información de entrenamiento, rendimiento y perfil.

### Criterios de Aceptación
- Un atleta solo puede consultar su propio perfil.
- Intentos de acceso a otros atletas retornan **403**.
- No existen endpoints que expongan listas de atletas a este rol.
- Validación se realiza en backend.

### Consideraciones Técnicas
- Comparación entre `user_id` y recurso solicitado.
- No confiar en ocultamiento en frontend.

---

## EPIC 4 — Visualización de Atletas para Coaches y Administradores

### Objetivo
Permitir a roles autorizados visualizar información de atletas para gestión deportiva y operativa.

### Descripción
Los coaches y administradores pueden acceder a listados de atletas con información relevante para seguimiento y toma de decisiones.

### Criterios de Aceptación
- Coaches pueden ver atletas de su box.
- Administradores pueden ver todos los atletas del box.
- La vista incluye datos básicos (nombre, nivel, asistencia).
- Acceso restringido a atletas del mismo box.

### Consideraciones Técnicas
- Queries filtradas por `box_id`.
- Diferenciar nivel de detalle según rol.

---

## EPIC 5 — Gestión Operativa para Rol Administrativo

### Objetivo
Permitir que el personal administrativo gestione la operación del negocio sin acceso a información sensible de entrenamiento.

### Descripción
El rol **administrativo** tiene acceso a funcionalidades de pagos, suscripciones y agenda, pero no a datos detallados de rendimiento deportivo.

### Criterios de Aceptación
- Puede ver estado de pagos y suscripciones.
- Puede gestionar agenda y clases.
- Puede ver información básica de atletas (nombre, estado, asistencia).
- No puede acceder a PRs ni métricas de rendimiento.

### Consideraciones Técnicas
- Separación clara entre datos deportivos y administrativos.
- Control de acceso por endpoint y por campo.

---

## EPIC 6 — Control Total para Administrador del Box

### Objetivo
Otorgar control completo del sistema al administrador del centro deportivo.

### Descripción
El administrador tiene acceso total a todas las funcionalidades del sistema, incluyendo configuración, usuarios, métricas y finanzas.

### Criterios de Aceptación
- Puede gestionar usuarios y roles.
- Puede acceder a todos los datos del sistema.
- Puede configurar parámetros del box.
- Puede visualizar métricas completas.

### Consideraciones Técnicas
- Rol con permisos globales dentro del box.
- Validación igualmente aplicada en backend.

---

## EPIC 7 — Middleware de Autorización Centralizado

### Objetivo
Centralizar la lógica de autorización para asegurar consistencia y mantenibilidad.

### Descripción
Implementar un middleware que valide rol y pertenencia al box antes de permitir acceso a cualquier endpoint.

### Criterios de Aceptación
- Todos los endpoints protegidos usan middleware.
- El middleware valida `role` y `box_id`.
- Se rechazan accesos no autorizados con **403**.
- La lógica no está duplicada en múltiples servicios.

### Consideraciones Técnicas
- Inyección de contexto de usuario (`user_id`, `box_id`, `role`).
- Reutilización en toda la API.

---

## EPIC 8 — Seguridad y Prevención de Accesos Indebidos

### Objetivo
Garantizar que no existan vulnerabilidades de acceso a datos entre usuarios o boxes.

### Descripción
Asegurar que todas las rutas, queries y accesos a datos estén protegidos contra accesos indebidos o manipulaciones.

### Criterios de Aceptación
- No se puede acceder a recursos mediante IDs directos sin validación.
- Todas las consultas verifican pertenencia al box.
- Se realizan pruebas de acceso indebido (negative testing).
- No existe filtrado únicamente en frontend.

### Consideraciones Técnicas
- Validación estricta en backend.
- Testing de seguridad básico.
- Revisión de endpoints críticos.
