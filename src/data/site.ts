// Content that is the same in every language. Copy lives in src/i18n/*.json.
import type { ImageMetadata } from 'astro';
import type { IconName } from '../components/icons';
import portfolioDiagram from '../assets/Diagrama_Portfolio_AWS.png';
import armarioDiagram from '../assets/Armario.svg?url';
import mynotesDiagram from '../assets/MyNotes.svg?url';

export const SITE_URL = 'https://icabrera-portfolio.com';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const person = {
    name: 'Isaac Cabrera',
    givenName: 'Isaac',
    familyName: 'Cabrera',
    handle: 'isaac.cabrera',
    jobTitle: 'Backend & Cloud Developer',
    email: 'icabrerar06@gmail.com',
    linkedin: 'https://linkedin.com/in/icabrerar',
    github: 'https://github.com/icabrera6',
    sameAs: ['https://www.linkedin.com/in/icabrerar/', 'https://github.com/icabrera6'],
    address: { '@type': 'PostalAddress', addressLocality: 'York', addressCountry: 'GB' },
    affiliation: { '@type': 'CollegeOrUniversity', name: 'York St John University', url: 'https://www.yorksj.ac.uk/' },
    alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Sant Josep Obrer',
        address: { '@type': 'PostalAddress', addressLocality: 'Palma', addressCountry: 'ES' },
    },
    knowsAbout: ['Amazon Web Services', 'Serverless', 'Backend development', 'Cyber security', 'TypeScript', 'Python', 'Java', 'DynamoDB', 'AWS CDK'],
    knowsLanguage: ['es', 'en'],
};

export const copyright = '© 2026 isaac.cabrera';
export const cvPath = '/CV_Isaac_Cabrera.pdf';

export const sections = ['about', 'skills', 'projects', 'education', 'contact'] as const;

export const heroChips = ['AWS', 'Python', 'Node.js', 'Docker', 'MySQL'];

export const focusAreas: { id: 'cloud' | 'backend' | 'databases' | 'devops'; icon: IconName }[] = [
    { id: 'cloud', icon: 'cloud' },
    { id: 'backend', icon: 'server' },
    { id: 'databases', icon: 'database' },
    { id: 'devops', icon: 'settings' },
];

export const skills: { id: 'backend' | 'cloud' | 'databases' | 'devops'; icon: IconName; items: string[] }[] = [
    { id: 'backend', icon: 'server', items: ['Python', 'Node.js', 'FastAPI'] },
    { id: 'cloud', icon: 'cloud', items: ['AWS', 'Docker'] },
    { id: 'databases', icon: 'database', items: ['MySQL', 'DynamoDB'] },
    { id: 'devops', icon: 'settings', items: ['Git & GitHub', 'CI/CD', 'Bash Scripting'] },
];

export const projects: {
    id: 'portfolio' | 'armario' | 'mynotes';
    repo: string;
    language: string;
    tags: string[];
    // Raster diagrams go through <Picture> (resized, WebP); SVGs are served as they are
    image: { kind: 'raster'; meta: ImageMetadata } | { kind: 'svg'; src: string; width: number; height: number };
}[] = [
    {
        id: 'portfolio',
        repo: 'https://github.com/icabrera6/Portfolio',
        language: 'JavaScript',
        tags: ['AWS', 'GitHub Actions', 'CI/CD'],
        image: { kind: 'raster', meta: portfolioDiagram },
    },
    {
        id: 'armario',
        repo: 'https://github.com/icabrera6/Armario',
        language: 'TypeScript',
        tags: ['React', 'TypeScript', 'AWS Lambda', 'Bedrock', 'DynamoDB', 'AWS CDK'],
        image: { kind: 'svg', src: armarioDiagram, width: 1530, height: 1078 },
    },
    {
        id: 'mynotes',
        repo: 'https://github.com/icabrera6/mynotes',
        language: 'TypeScript',
        tags: ['React', 'TypeScript', 'Hono', 'Cognito', 'DynamoDB', 'AWS CDK'],
        image: { kind: 'svg', src: mynotesDiagram, width: 1365, height: 920 },
    },
];
