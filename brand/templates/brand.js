// Shared pieces for the brand asset templates.

// The iC mark (viewBox 0 0 120 120): ring with a horizontal gate around a lowercase i whose dot is the core.
export const MARK_PATHS = `
    <path class="shape" d="M108 40 A52 52 0 1 0 108 80 L89.93 80 A36 36 0 1 1 89.93 40 Z"/>
    <rect class="shape" x="47" y="56" width="16" height="30"/>
    <circle class="core" cx="55" cy="42.5" r="9"/>`;

export function mark(className = '') {
    return `<svg class="mark ${className}" viewBox="0 0 120 120" aria-hidden="true">${MARK_PATHS}</svg>`;
}

// URL parameters, e.g. ?lang=es&variant=light
export const params = new URLSearchParams(location.search);

// Halftone "cloud deck" seen from above: dots below the horizon, a soft glow at (sunX, horizon).
export function drawDeck(canvas, { horizon, sunX, step = 6, alpha = [.2, .45] }) {
    const W = canvas.clientWidth, H = canvas.clientHeight, dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const hash = (x, y) => {
        let h = x * 374761393 + y * 668265263;
        h = (h ^ (h >>> 13)) * 1274126177;
        return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    };
    const smooth = (t) => t * t * (3 - 2 * t);
    const noise = (x, y) => {
        const xi = Math.floor(x), yi = Math.floor(y), u = smooth(x - xi), v = smooth(y - yi);
        const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
        return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    const fbm = (x, y) => {
        let s = 0, amp = .5, f = 1;
        for (let i = 0; i < 5; i++) { s += amp * noise(x * f, y * f); f *= 2.03; amp *= .5; }
        return s;
    };

    const sunY = horizon - 10, ion = [142, 201, 255], ivory = [239, 237, 230];
    for (let row = 0, y = horizon - step * 4; y < H + step; row++, y += step * .866) {
        const off = row % 2 ? step / 2 : 0;
        for (let x = off; x < W + step; x += step) {
            const dx = (x - sunX) / W, dy = (y - sunY) / H;
            const sun = Math.exp(-(dx * dx * 7 + dy * dy * 22));
            let L;
            if (y < horizon) {
                L = .6 * sun * (1 - (horizon - y) / (step * 4));
            } else {
                const depth = (y - horizon) / (H - horizon), z = 1 / (depth + .06);
                L = (.16 + fbm((x / W - .5) * z * 1.4 + 9, z * .9) * .72) * (.55 + .45 * Math.exp(-depth * 1.4)) + sun * .55 * Math.exp(-depth * 2.5);
            }
            L = Math.min(1, L);
            const r = step * .5 * Math.sqrt(L);
            if (r < .4) continue;
            const w = Math.min(1, Math.exp(-(dx * dx * 9 + dy * dy * 30)) * 1.3);
            const c = ion.map((v, i) => Math.round(v + (ivory[i] - v) * w));
            ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha[0] + L * alpha[1]})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Lets render.sh know fonts and drawing are done before the screenshot.
export async function ready() {
    await document.fonts.ready;
    document.documentElement.dataset.ready = '1';
}
