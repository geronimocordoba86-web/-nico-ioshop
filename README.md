# nico.ioshop — versión servidor

Incluye:
- Tienda web responsive.
- API de productos.
- Base de datos SQLite.
- Panel /admin.html para cargar productos.
- Login de administrador.
- Catálogo, búsqueda y categorías.
- Stock y precios administrables.
- WhatsApp y Plan Canje.
- Preparado para deploy en un servidor Node.js.

## Cómo levantarlo
1. Instalar Node.js 20+.
2. Copiar `.env.example` a `.env`.
3. Cambiar ADMIN_USER, ADMIN_PASSWORD, SESSION_SECRET y WHATSAPP_NUMBER.
4. Ejecutar `npm install`.
5. Ejecutar `npm start`.
6. Abrir `http://localhost:3000`.

## Para publicar
Subir el proyecto a un hosting que soporte Node.js (por ejemplo Render, Railway, VPS o similar), configurar las variables de entorno y conectar el dominio.

IMPORTANTE: el número de WhatsApp del ejemplo es un placeholder y debe reemplazarse por el real antes de publicar.

## Publicación rápida

La carpeta ya incluye `Dockerfile` y `render.yaml` para desplegar en un hosting compatible con Docker/Node.
Antes de publicar:
- Configurá `ADMIN_USER`.
- Configurá `ADMIN_PASSWORD`.
- Configurá `WHATSAPP_NUMBER` con el número real de nico.ioshop.
- Configurá un `SESSION_SECRET` fuerte si el proveedor no lo genera.
- Configurá el dominio personalizado cuando el hosting lo permita.

### Importante sobre la base de datos
La versión usa SQLite y necesita almacenamiento persistente. El archivo `render.yaml` incluye un disco persistente de 1 GB como ejemplo. Si el proveedor elegido no ofrece disco persistente, conviene migrar la base a PostgreSQL/Supabase antes de producción.

### Dominio
El dominio `www.nicoioshop.com` no queda registrado automáticamente desde este proyecto. Hay que registrar el dominio y apuntar sus DNS al hosting.
