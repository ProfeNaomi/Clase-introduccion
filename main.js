// Slide Navigation Logic
const slidesContainer = document.getElementById('slides-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const navContainer = document.getElementById('slide-nav-container');
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');
const currentPageLabel = document.getElementById('current-page-num');

let currentIndex = 0;
const totalSlides = 12;

// Initialize Numbers in Header
function initNavNumbers() {
    for (let i = 0; i < totalSlides; i++) {
        const num = document.createElement('div');
        num.classList.add('nav-num');
        num.textContent = i + 1;
        num.addEventListener('click', () => goToSlide(i));
        navContainer.appendChild(num);
    }
}

// Global Image Change Function (called from HTML)
window.changeImage = function(event, index) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById(`img-${index}`);
            img.src = e.target.result;
            // Save to localStorage for persistence if desired
            saveToStorage(`slide-img-${index}`, e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.warn("Storage full or unavailable. Image not cached.");
    }
}

// Load Cached Images
function loadCachedImages() {
    for (let i = 0; i < totalSlides; i++) {
        const cached = localStorage.getItem(`slide-img-${i}`);
        if (cached) {
            const img = document.getElementById(`img-${i}`);
            if (img) img.src = cached;
        }
    }
}

// Update UI
function updateUI() {
    // Slide transition
    slidesContainer.style.transform = `translateX(-${(currentIndex * 100) / totalSlides}%)`;

    // Button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    // Numbers active state
    document.querySelectorAll('.nav-num').forEach((num, index) => {
        num.classList.toggle('active', index === currentIndex);
    });

    // Update Label
    currentPageLabel.textContent = currentIndex + 1;

    // Trigger Animations
    const activeSlide = document.querySelectorAll('.slide')[currentIndex];
    const content = activeSlide.querySelector('.slide-content');
    const imageContainer = activeSlide.querySelector('.slide-image-container');
    
    [content, imageContainer].forEach(el => {
        if (el) {
            el.classList.remove('animate-in');
            void el.offsetWidth;
            el.classList.add('animate-in');
        }
    });
}

// Navigation Functions
function goToSlide(index) {
    currentIndex = index;
    updateUI();
}

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
});

// Theme Logic
const setDarkTheme = (isDark) => {
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeText.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    setDarkTheme(isDark);
});

// Initialize
initNavNumbers();
loadCachedImages();
updateUI();

// Check saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') setDarkTheme(true);
else if (savedTheme === 'light') setDarkTheme(false);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setDarkTheme(true);
