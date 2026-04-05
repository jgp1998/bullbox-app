# Plan de Ejecución de Pruebas E2E (Playwright)

Este plan está diseñado para ser procesado por un agente IA para automatizar el UAT de **BullBox App**.

## 1. Configuración del Entorno
Ejecutar los siguientes comandos en la terminal desde el directorio raíz:

1.  **Instalar dependencias de Playwright:**
    ```bash
    npx playwright install --with-deps
    ```

2.  **Inicializar configuración básica:** (Si no existe `playwright.config.ts`)
    Crear el archivo `playwright.config.ts` con soporte para TypeScript y Vite.

## 2. Estructura de Archivos
El agente debe organizar los tests en:
- `tests/e2e/auth.spec.ts` (Login y permanencia)
- `tests/e2e/workout.spec.ts` (Registros y gestión de ejercicios)
- `tests/e2e/tools.spec.ts` (Calculadoras)
- `tests/e2e/schedule.spec.ts` (Agenda)

## 3. Guía de Implementación para el Agente

### Paso 3.1: Pruebas de Autenticación
- **Objetivo:** Verificar que el usuario puede entrar y la sesión persiste.
- **Acciones:**
  - Ir a `/`.
  - Esperar a que `LoginScreen` sea visible.
  - Mockear respuesta de Firebase Auth (o usar credenciales de test si están en `.env`).
  - Verificar que tras el login aparece el `Header`.

### Paso 3.2: Pruebas de Gestión de Entrenamientos
- **Objetivo:** Registrar un levantamiento.
- **Acciones:**
  - Localizar `WorkoutForm`.
  - Seleccionar un ejercicio (ej: "Sentadilla").
  - Rellenar Peso, Reps y Series.
  - Hacer clic en "Añadir Registro".
  - Verificar que el nuevo registro aparece en `WorkoutHistory`.

### Paso 3.3: Pruebas de Calculadoras
- **Objetivo:** Validar lógica de discos y porcentajes.
- **Acciones:**
  - Interactuar con `WeightConverter`.
  - Cambiar el peso a `100kg`.
  - Verificar que el resultado de discos es correcto.
  - Interactuar con `PercentageCalculator`.

### Paso 3.4: Pruebas de Agenda
- **Objetivo:** Programar un entreno.
- **Acciones:**
  - Abrir `ScheduleModal`.
  - Seleccionar fecha y ejercicio.
  - Guardar y verificar en `TrainingAgenda`.

## 4. Ejecución y Reporte
El agente debe ejecutar los tests usando:
```bash
npx playwright test
```
O con reporte visual para depurar:
```bash
npx playwright test --ui
```

## 5. Consideraciones Importantes
- **Firebase:** Se recomienda usar el **Firebase Emulator Suite** para las pruebas E2E para evitar polucionar datos de producción y asegurar tests deterministas.
- **Selectores:** Utilizar `data-testid` donde sea posible. Si no están presentes, añadirlos a los componentes correspondientes.
