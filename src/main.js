// Mobile menu
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// Projects slider
const track = document.getElementById('slider-track');
const dots = Array.from(document.querySelectorAll('.dot'));
const count = document.getElementById('proj-count');
const total = dots.length;
let idx = 0;

function goTo(i) {
    idx = (i + total) % total;
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    dots.forEach((d, j) => d.classList.toggle('on', j === idx));
    count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
}

document.getElementById('prev-btn').addEventListener('click', () => goTo(idx - 1));
document.getElementById('next-btn').addEventListener('click', () => goTo(idx + 1));
dots.forEach((d, j) => d.addEventListener('click', () => goTo(j)));

// Swipe support
let startX = null;
track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? idx + 1 : idx - 1);
    startX = null;
}, { passive: true });

// Hero: halftone cloud deck (the part you don't see)
const deck = document.querySelector('.hero-deck');
if (deck) {
    const hero = deck.parentElement;
    let size = '';

    const hash = (x, y) => {
        let h = x * 374761393 + y * 668265263;
        h = (h ^ (h >>> 13)) * 1274126177;
        return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    };
    const smooth = (t) => t * t * (3 - 2 * t);
    const noise = (x, y) => {
        const xi = Math.floor(x), yi = Math.floor(y);
        const u = smooth(x - xi), v = smooth(y - yi);
        const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
        return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    const fbm = (x, y) => {
        let s = 0, amp = .5, f = 1;
        for (let i = 0; i < 5; i++) { s += amp * noise(x * f, y * f); f *= 2.03; amp *= .5; }
        return s;
    };

    const drawDeck = () => {
        const W = hero.clientWidth, H = hero.clientHeight;
        if (size === W + 'x' + H) return;
        size = W + 'x' + H;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        deck.width = W * dpr;
        deck.height = H * dpr;
        const ctx = deck.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // horizon sits just under the CTAs; the glow sits under the photo
        const box = hero.getBoundingClientRect();
        const cta = hero.querySelector('.cta-row');
        const ring = hero.querySelector('.photo-ring');
        const narrow = W < 900;
        const horizon = Math.max(H * .55, cta ? cta.getBoundingClientRect().bottom - box.top + 28 : H * .7);
        const rb = ring ? ring.getBoundingClientRect() : null;
        const sunX = rb ? rb.left + rb.width / 2 - box.left : W * .7;
        const sunY = horizon - 10;
        const step = narrow ? 5 : 6;
        const ion = [142, 201, 255], ivory = [239, 237, 230];

        for (let row = 0, y = horizon - step * 4; y < H + step; row++, y += step * .866) {
            const off = row % 2 ? step / 2 : 0;
            for (let x = off; x < W + step; x += step) {
                const dx = (x - sunX) / W, dy = (y - sunY) / H;
                const sun = Math.exp(-(dx * dx * 7 + dy * dy * 22));
                let L;
                if (y < horizon) {
                    L = .6 * sun * (1 - (horizon - y) / (step * 4));
                } else {
                    const depth = (y - horizon) / (H - horizon);
                    const z = 1 / (depth + .06);
                    L = (.16 + fbm((x / W - .5) * z * 1.4 + 9, z * .9) * .72) * (.55 + .45 * Math.exp(-depth * 1.4));
                    L += sun * .55 * Math.exp(-depth * 2.5);
                }
                L = Math.min(1, L);
                const r = step * .5 * Math.sqrt(L);
                if (r < .4) continue;
                const w = Math.min(1, Math.exp(-(dx * dx * 9 + dy * dy * 30)) * 1.3);
                const c = ion.map((v, i) => Math.round(v + (ivory[i] - v) * w));
                ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${.18 + L * .42})`;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    };

    drawDeck();
    if (document.fonts) document.fonts.ready.then(() => { size = ''; drawDeck(); });
    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(drawDeck, 150); });
}

// Scroll reveal, staggered within each group
const REVEAL = '.hero-text > *, .photo-ring, .label, .h2, .about-grid p, .about-card, .skills-grid, .proj-controls, .slider, .edu-row, .contact-sub, .contact-card';
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const items = document.querySelectorAll(REVEAL);
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target;
            io.unobserve(el);
            el.classList.add('in');
            const delay = parseInt(el.style.transitionDelay, 10) || 0;
            setTimeout(() => {
                el.classList.remove('rv', 'in');
                el.style.transitionDelay = '';
            }, 850 + delay);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });

    items.forEach((el) => {
        const group = Array.from(el.parentElement.children).filter((c) => c.matches(REVEAL));
        el.classList.add('rv');
        el.style.transitionDelay = Math.min(group.indexOf(el), 6) * 70 + 'ms';
        io.observe(el);
    });
}

// Highlight the nav link for the section in view
const navLinks = Array.from(document.querySelectorAll('.nav-links > a[href^="#"]'));
const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
