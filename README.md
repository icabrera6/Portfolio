# Portfolio - Isaac Cabrera

Portfolio personal estático e internacionalizado, desarrollado con Vanilla JS y empaquetado con Vite. Desplegado en AWS S3 + CloudFront mediante CI/CD con GitHub Actions.

## 🌟 Características Principales

- **Internacionalización (i18n):** Soporte bilingüe (Español e Inglés) con selector de idioma en la barra de navegación.
- **Slider Interactivo:** Carrusel personalizado para visualizar proyectos destacados con imágenes ilustrativas.
- **Responsive Design:** Diseño moderno y adaptable (móvil, tablet, escritorio).
- **Tooling Moderno:** Empaquetado optimizado con Vite y Tailwind CSS.
- **Despliegue Seguro:** CI/CD automático conectado a AWS S3 (Privado) + CloudFront con **Origin Access Control (OAC)**.

## 🚀 Quick Start

### Desarrollo Local

Instala las dependencias de Node e inicia el servidor de desarrollo de Vite:

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build de Producción

Empaqueta ambos idiomas (ES/EN) y optimiza recursos:

```bash
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
Portfolio/
├── .github/workflows/
│   └── deploy.yml          # CI/CD para AWS
├── public/                 # Archivos estáticos (CV, etc.)
├── index.html              # Página principal (ES)
├── index-en.html           # Página principal (EN)
├── package.json            # Scripts y dependencias
├── vite.config.js          # Configuración de Vite
└── src/
    ├── main.js             # Lógica JS (ES Modules)
    ├── styles.css          # Estilos (Tailwind CSS)
    └── assets/             # Imágenes, logos e ilustraciones de proyectos
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, Vanilla JavaScript, CSS3
- **Build Tool**: Vite, PostCSS, Autoprefixer
- **Hosting**: AWS S3 (Bucket Privado)
- **CDN / SSL**: CloudFront con **Origin Access Control (OAC)** y ACM
- **CI/CD**: GitHub Actions

## 📊 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo local (Vite) |
| `npm run build` | Contruye la carpeta `dist/` optimizada para producción |
| `npm run preview` | Previsualiza en un servidor local el build de `dist/` |

## 🤖 Automated Deployment (GitHub Actions)

El portfolio está configurado con CI/CD automático usando GitHub Actions:

- ✅ **Auto-deploy** en cada push a las ramas principales.
- ✅ Construcción del proyecto, sincronización a S3 y purga / invalidación de caché de CloudFront automática.
- ✅ **Seguridad Reforzada:** El bucket de S3 es privado y solo accesible a través de CloudFront mediante OAC.

**Setup en AWS:**
1. Configura una distribución de CloudFront con un origen S3.
2. Activa **Origin Access Control (OAC)** para el origen S3 y actualiza la política del bucket.
3. Bloquea todo el acceso público en las opciones de S3.
4. Añade los secretos `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BUCKET_NAME`, etc. a los Secrets del repositorio en GitHub.
5. El despliegue se activa de forma automática tras el commit confirmando la nueva versión compilada.

## 📝 Licencia

© 2026 Isaac Cabrera. Todos los derechos reservados.

## 📧 Contacto

- **Email**: icabrerar06@gmail.com
- **LinkedIn**: [linkedin.com/in/icabrerar](https://www.linkedin.com/in/icabrerar/)
- **GitHub**: [github.com/icabrera6](https://github.com/icabrera6)

---

**Desarrollado con HTML, CSS y JavaScript, empaquetado con Vite y alojado en la nube de AWS.**
