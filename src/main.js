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
