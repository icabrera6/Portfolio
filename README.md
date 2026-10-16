# Portfolio - Isaac Cabrera

Portfolio personal estático y bilingüe (español / inglés), construido con Astro. Desplegado en AWS S3 + CloudFront mediante CI/CD con GitHub Actions.

## 🌟 Características Principales

- **Internacionalización (i18n):** una sola plantilla y un archivo de traducción por idioma. Astro genera una página estática por idioma: español en `/` e inglés en `/en/`, con `hreflang`, canonical y sitemap por idioma.
- **Slider Interactivo:** Carrusel personalizado para visualizar proyectos destacados con imágenes ilustrativas.
- **Responsive Design:** Diseño moderno y adaptable (móvil, tablet, escritorio).
- **Sin JavaScript de framework:** Astro genera HTML estático; solo se envía el script del slider y las animaciones.
- **Despliegue Seguro:** CI/CD automático conectado a AWS S3 (Privado) + CloudFront con **Origin Access Control (OAC)**, cabeceras de seguridad (CSP, HSTS…) y redirecciones canónicas (ver `infra/cloudfront/`).

## 🚀 Quick Start

### Desarrollo Local

Requiere Node 24 (fijado en `.nvmrc`):

```bash
nvm use
npm install
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) (español) o [http://localhost:4321/en/](http://localhost:4321/en/) (inglés).

### Build de Producción

```bash
npm run build
npm run preview
```

## 🌍 Traducciones

Todos los textos de la página están en `src/i18n/`:

- `src/i18n/es.json`: textos en español
- `src/i18n/en.json`: textos en inglés

Los dos archivos tienen exactamente las mismas claves. Para cambiar un texto, edítalo en ambos. Lo que no se traduce (tecnologías, enlaces, repositorios, imágenes) está en `src/data/site.ts`.

Para añadir un idioma nuevo: crea `src/i18n/<código>.json` con las mismas claves, añádelo en `src/i18n/index.ts` y en `astro.config.mjs` (`i18n.locales` y el sitemap), y crea `src/pages/<código>/index.astro`.

## 📁 Estructura del Proyecto

```
Portfolio/
├── .github/workflows/
│   └── deploy.yml          # CI/CD para AWS
├── infra/cloudfront/       # Función de redirecciones, cabeceras de seguridad y script apply.sh
├── public/                 # Archivos estáticos (CV, robots, imagen OG…)
├── astro.config.mjs        # Configuración de Astro (i18n, sitemap)
└── src/
    ├── pages/              # index.astro (es), en/index.astro (en) y 404.astro
    ├── layouts/Base.astro  # <head>: SEO, Open Graph, hreflang y JSON-LD
    ├── components/         # Secciones de la página (Hero, Projects, Contact…)
    ├── i18n/               # es.json, en.json y utilidades de idioma
    ├── data/site.ts        # Datos comunes a todos los idiomas
    ├── scripts/main.js     # Slider, menú móvil y animaciones
    ├── styles/             # global.css, fonts.css (@font-face) y 404.css
    └── assets/             # Imágenes, iconos, diagramas y fuentes autoalojadas (assets/fonts)
```

## 🛠️ Tecnologías

- **Frontend**: Astro, HTML5, JavaScript, CSS3
- **Hosting**: AWS S3 (Bucket Privado)
- **CDN / SSL**: CloudFront con **Origin Access Control (OAC)**, ACM y CloudFront Functions
- **CI/CD**: GitHub Actions

## 📊 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo local (Astro) |
| `npm run build` | Construye la carpeta `dist/` optimizada para producción |
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
