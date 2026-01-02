# Guía de Despliegue en Easypanel

Este repositorio contiene dos aplicaciones de inicio para ChatKit. Ambas han sido preparadas con un `Dockerfile` optimizado para desplegarse fácilmente en Easypanel (u otra plataforma compatible con Docker).

Puedes elegir desplegar cualquiera de las dos opciones según tus necesidades.

## Opción 1: Managed ChatKit (Recomendado)

Esta opción utiliza los **Flujos de Trabajo Gestionados** (Managed Workflows) de OpenAI. Es la opción ideal si has diseñado tu agente utilizando el "Agent Builder" de OpenAI y quieres incrustarlo en una web moderna.

### Requisitos previos
1.  Un **Workflow ID** creado en OpenAI Agent Builder.
2.  Una **API Key** de OpenAI.

### Pasos en Easypanel
1.  Crea un nuevo **Service** (App) de tipo **App** (Build from Source / Github).
2.  **Source**: Conecta este repositorio.
3.  **Build Settings**:
    *   **Build Context / Path**: `managed-chatkit`
    *   (El Dockerfile se detectará automáticamente dentro de esa carpeta).
4.  **Environment Variables**:
    *   `OPENAI_API_KEY`: `sk-...` (Tu clave de OpenAI).
    *   `CHATKIT_WORKFLOW_ID`: `wf_...` (El ID de tu flujo de trabajo).
5.  **Deploy**: Haz clic en "Create" o "Deploy".

### ¿Cómo chatear?
Una vez desplegado:
1.  Abre la URL pública que te proporciona Easypanel (ej. `https://mi-app.easypanel.host`).
2.  Verás la interfaz de chat.
3.  Al escribir un mensaje, el frontend pedirá una sesión segura a tu propio backend (`/api/create-session`), el cual usará tus credenciales para conectar con OpenAI.
4.  ¡Listo! Estás hablando con tu Agente configurado en OpenAI.

---

## Opción 2: ChatKit (Self-hosted)

Esta opción te da control total sobre el backend. El "cerebro" del chat es un script de Python (`server.py`) que puedes modificar completamente. Por defecto, actúa como un asistente simple.

### Requisitos previos
1.  Una **API Key** de OpenAI.

### Pasos en Easypanel
1.  Crea un nuevo **Service** (App).
2.  **Source**: Este repositorio.
3.  **Build Settings**:
    *   **Build Context / Path**: `chatkit`
4.  **Environment Variables**:
    *   `OPENAI_API_KEY`: `sk-...`
5.  **Deploy**.

### ¿Cómo personalizar el asistente?
Para cambiar cómo se comporta este asistente, debes editar el archivo:
`chatkit/backend/app/server.py`

Busca la sección:
```python
assistant_agent = Agent(
    model="gpt-4.1-mini",
    name="Starter Assistant",
    instructions="You are a concise, helpful assistant..."
)
```
Cambia las `instructions` o el `model` y vuelve a desplegar.

## Solución de Problemas

### Verificar que el servidor funciona
Visita `https://tu-app.easypanel.host/health` - deberías ver:
```json
{"status": "ok"}
```

### Problemas comunes

*   **Pantalla negra o en blanco**:
    1.  Verifica `/health` para confirmar que el servidor responde.
    2.  Revisa que `CHATKIT_WORKFLOW_ID` esté configurado correctamente en Easypanel.
    3.  Abre las DevTools del navegador (F12) y revisa la consola para ver errores de JavaScript.

*   **Error 500 / Connection Failed**: Verifica que `OPENAI_API_KEY` sea correcta y tenga saldo.

*   **Error "Missing workflow id" (Managed)**: Asegúrate de haber configurado la variable `CHATKIT_WORKFLOW_ID` en Easypanel.

*   **Error "Missing OPENAI_API_KEY"**: Configura la variable `OPENAI_API_KEY` en Easypanel.

### Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `OPENAI_API_KEY` | Tu clave de API de OpenAI | Sí |
| `CHATKIT_WORKFLOW_ID` | ID del workflow (managed-chatkit) | Sí (managed) |
| `ENVIRONMENT` | Establecer a `production` para cookies seguras | No |
