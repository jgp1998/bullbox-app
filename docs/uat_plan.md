# Plan de Pruebas de Aceptación de Usuario (UAT) - BullBox App

## 1. Introducción
Este documento define el plan de pruebas de aceptación de usuario (UAT) para **BullBox App**, una plataforma de seguimiento de entrenamientos. El objetivo es validar que la aplicación cumple con las necesidades de los usuarios finales y asegurar una experiencia fluida y libre de errores críticos antes de despliegues mayores.

## 2. Alcance
El UAT cubrirá las funcionalidades principales de la aplicación accesibles para el usuario deportista:
- Autenticación y acceso.
- Registro y gestión de entrenamientos.
- Uso de herramientas (Calculadoras de peso y RM).
- Seguimiento de récords personales (PRs) y análisis.
- Planificación de entrenamientos (Agenda).
- Historial de actividad.

## 3. Roles y Responsabilidades
- **Usuario Probador (Betatester):** Ejecuta los casos de prueba, reporta errores y ofrece feedback sobre la usabilidad.
- **QA/Product Owner:** Supervisa las pruebas, valida los reportes y decide la resolución de bugs.
- **Equipo de Desarrollo:** Corrige los bugs detectados durante el proceso.

## 4. Escenarios de Prueba

### 4.1 Autenticación y Perfil
| ID | Caso de Prueba | Acción | Resultado Esperado |
|:---|:---|:---|:---|
| AUTH-01 | Inicio de Sesión | Ingresar credenciales válidas. | El usuario accede al dashboard principal. |
| AUTH-02 | Error de Login | Ingresar credenciales inválidas. | Se muestra un mensaje de error claro y no se permite el acceso. |
| AUTH-03 | Persistencia | Recargar la página tras iniciar sesión. | La sesión se mantiene activa sin pedir login nuevamente. |

### 4.2 Gestión de Entrenamientos
| ID | Caso de Prueba | Acción | Resultado Esperado |
|:---|:---|:---|:---|
| WRK-01 | Registrar Ejercicio | Completar el formulario con ejercicio, peso, reps y series. | El registro aparece inmediatamente en el historial y actualiza el PR si corresponde. |
| WRK-02 | Gestionar Catálogo | Añadir un nuevo tipo de ejercicio desde el modal de gestión. | El nuevo ejercicio aparece en el selector del formulario principal. |
| WRK-03 | Eliminar Ejercicio | Borrar un ejercicio del catálogo. | Deja de estar disponible en el selector (no afecta registros históricos). |

### 4.3 Herramientas de Cálculo
| ID | Caso de Prueba | Acción | Resultado Esperado |
|:---|:---|:---|:---|
| CALC-01 | Convertidor de Placas | Ingresar un peso objetivo en el calculador. | Se muestra el desglose exacto de discos necesarios por lado de la barra. |
| CALC-02 | Calculador de RM | Ver porcentajes basados en el PR de un ejercicio. | Los porcentajes (50%, 75%, 90%, etc.) se calculan correctamente según el récord actual. |

### 4.4 Seguimiento y Récords (PRs)
| ID | Caso de Prueba | Acción | Resultado Esperado |
|:---|:---|:---|:---|
| PR-01 | Visualización de PRs | Consultar la lista de mejores marcas. | Se muestran los récords más recientes y pesados para cada ejercicio. |
| PR-02 | Detalle de Ejercicio | Hacer clic en un ejercicio para ver detalles. | Se abre un modal con el análisis de progreso y detalles específicos. |

### 4.5 Agenda y Planificación
| ID | Caso de Prueba | Acción | Resultado Esperado |
|:---|:---|:---|:---|
| SCH-01 | Programar Sesión | Añadir un entrenamiento a una fecha futura en la agenda. | La sesión aparece listada en la sección "Próximos Entrenamientos". |
| SCH-02 | Editar/Eliminar | Modificar o borrar una sesión programada. | Los cambios se reflejan instantáneamente en la lista de la agenda. |

### 4.6 Interfaz y Usabilidad (UX/UI)
| ID | Caso de Prueba | Acción | Resultado Esperado |
|:---|:---|:---|:---|
| UI-01 | Cambio de Tema | Cambiar entre modo claro y oscuro. | La interfaz cambia de color suavemente y persiste tras recargar. |
| UI-02 | Responsividad | Usar la app en dispositivos móviles y escritorio. | El diseño se adapta (grid de columnas cambia a lista vertical en móvil). |
| UI-03 | Feedback de Carga | Simular latencia en red. | Se muestran esqueletos de carga (Skeletons) o Spinners en lugar de espacios vacíos. |

## 5. Criterios de Aceptación
Para considerar el UAT como exitoso:
1. El **100%** de las pruebas de nivel "Crítico" (Auth, Registro de Entreno) deben pasar.
2. No debe haber bugs abiertos de severidad "Alta".
3. El tiempo de respuesta percibido para acciones críticas (añadir registro) debe ser < 2 segundos.
4. La persistencia de datos (Firebase) debe estar validada.

## 6. Reporte de Incidencias
Cualquier fallo o sugerencia debe reportarse con:
- Pasos para reproducir.
- Captura de pantalla (si aplica).
- Comportamiento esperado vs. observado.
