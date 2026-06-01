# 🌺 Lirio Store — Boutique de Belleza Premium

Tienda online de maquillaje y skincare para Popayán, Colombia. Stack MERN (MongoDB, Express, React + Vite, Node.js).

### Prerrequisitos

- **Node.js** (v16 o superior)
- **MongoDB** (Servicio local en ejecución por el puerto `27017` o una URI de Mongo Atlas)

### Instalación

1. **Clonar/Descargar el repositorio**
2. **Instalar dependencias del servidor (Backend)**:
   Abre una terminal en la raíz del proyecto y ejecuta:
   ```bash
   npm install
   ```

3. **Instalar dependencias del cliente (Frontend)**:
   Navega a la carpeta `client` y ejecuta:
   ```bash
   cd client
   npm install
   ```

### Configuración del Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto (junto a `server.js`) con las siguientes variables (ajusta los valores si usas producción):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lirio
JWT_SECRET=tu_secreto_seguro_para_jwt
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Inicialización de la Base de Datos (Seeding)

Para poblar la base de datos con el catálogo inicial, el administrador maestro y los anuncios de ejemplo, ejecuta el siguiente comando desde la raíz del proyecto:

```bash
npm run seed
```

### Ejecutar el Entorno de Desarrollo

Desde la raíz del proyecto, puedes iniciar simultáneamente tanto el servidor (backend) como el cliente (frontend) usando el siguiente comando:

```bash
npm run dev
```

Esto iniciará:
- **Backend (API)** en `http://localhost:5000`
- **Frontend (Vite)** en `http://localhost:5173`

---

## Credenciales de Acceso Administrador

El script de *seeding* (`npm run seed`) crea automáticamente un usuario administrador por defecto para que puedas gestionar la tienda.

- **URL de Acceso Admin:** `http://localhost:5173/admin/login` (O tu dominio de producción + `/admin/login`)
- **Email:** `admin@lirio.com`
- **Contraseña:** `lirio2026`

---

## 🛡️ Seguridad

- **Helmet**: Configura headers HTTP de seguridad (X-Content-Type-Options, X-Frame-Options, HSTS, etc.)
- **CORS**: Solo acepta requests desde orígenes permitidos (localhost dev y `CLIENT_URL` de producción)
- **JWT**: Autenticación con tokens para el panel de administración
- **Bcrypt**: Contraseñas hasheadas en la base de datos

