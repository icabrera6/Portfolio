# Portfolio - Isaac Cabrera

Portfolio personal estático e internacionalizado, desarrollado con Vanilla JS y empaquetado con Vite. Desplegado en AWS S3 + CloudFront mediante CI/CD con GitHub Actions.

## 🌟 Características Principales

- **Internacionalización (i18n):** Soporte bilingüe (Español e Inglés) a través de `index.html` e `index-en.html`, con un selector de idioma integrado en la barra de navegación.
- **Slider Interactivo:** Carrusel personalizado para visualizar proyectos.
- **Responsive Design:** Adaptable a todo tipo de pantallas (móvil, tablet, escritorio).
- **Tooling Moderno:** Empaquetado y optimización automática a través de Vite.
- **Despliegue Asistido:** CI/CD automático conectado a AWS S3.

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
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD automático para AWS
├── index.html              # Página principal (Español)
├── index-en.html           # Página principal (Inglés)
├── package.json            # Dependencias y scripts
├── vite.config.js          # Configuración de Vite (Múltiples entradas HTML)
└── src/
    ├── main.js             # Lógica del slider de proyectos y menú móvil
    ├── styles.css          # Estilos globales y utilidades de Tailwind
    └── assets/             # Imágenes, iconos, CV y tipografías
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, Vanilla JavaScript, CSS3
- **Build Tool**: Vite, PostCSS, Autoprefixer
- **Hosting**: AWS S3 + CloudFront
- **CDN / SSL**: CloudFront y AWS Certificate Manager
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

**Setup en AWS:**
1. Configura una pipeline de S3 conectada con un origen de CloudFront.
2. Añade los secretos `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BUCKET_NAME`, etc. a los Secrets del repositorio en GitHub.
3. El despliegue se activa de forma automática tras el commit confirmando la nueva versión compilada.

## 📝 Licencia

© 2026 Isaac Cabrera. Todos los derechos reservados.

## 📧 Contacto

- **Email**: icabrerar06@gmail.com
- **LinkedIn**: [linkedin.com/in/icabrerar](https://www.linkedin.com/in/icabrerar/)
- **GitHub**: [github.com/icabrera6](https://github.com/icabrera6)

---

**Desarrollado con HTML, CSS y JavaScript, empaquetado con Vite y alojado en la nube de AWS.**
