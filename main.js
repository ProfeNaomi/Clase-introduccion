// Slide Management logic
const slidesContainer = document.getElementById('slides-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const navContainer = document.getElementById('slide-nav-container');
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');
const currentPageLabel = document.getElementById('current-page-num');
const totalPageLabel = document.getElementById('total-page-num');
const addSlideBtn = document.getElementById('add-slide-btn');

let currentIndex = 0;
let slides = [];

const defaultSlides = [
    { title: "Matemáticas", subtitle: "El lenguaje para entender el universo.", text: "Descubre la belleza oculta en cada rincón de la realidad a través de los números y las formas.", media: "image", src: "images/slide1.png" },
    { title: "¡Hola! Soy Naomi Urrea", subtitle: "", text: "Profesora de matemáticas e ingeniera industrial. Pero por sobre todo, una amante de las ciencias y las matemáticas. Levantamiento de pesas, videojuegos, anime, yoga, baile y ciencia... ¡Todo mezclado!", media: "image", src: "images/slide2.png" },
    { title: "¿Y a ti, qué te gusta?", subtitle: "", text: "Este espacio es de ustedes. Quiero conocerlas para organizar nuestras clases según sus intereses. Manga, deportes, música, tecnología... ¡El mundo es suyo!", media: "image", src: "images/slide3.png" },
    { title: "Acuerdo 1: Preguntar es de Valientes", subtitle: "", text: "Si no entiendes, levanta la mano. No hay preguntas tontas, lo único malo es quedarse con la duda. Yo te explicaré de mil formas distintas hasta que lo entiendas.", media: "image", src: "images/slide4.png" },
    { title: "Nuestra Propia \"Academia\"", subtitle: "", text: "Al igual que en la antigua Grecia, aquí el conocimiento se construye en grupo. Si entiendes algo, ofrece ayuda a tu compañera. Avanzamos todas juntas.", media: "image", src: "images/slide5.png" },
    { title: "Acuerdo 2: Un Espacio 100% Seguro", subtitle: "", text: "Cero burlas. Cuidamos la confianza de nuestras compañeras. No seas la persona que hace que otra no quiera estar aquí. Nos reímos CON la gente, no DE la gente.", media: "image", src: "images/slide6.png" },
    { title: "Acuerdo 3: Disciplina y Trabajo", subtitle: "", text: "La magia no existe, la disciplina sí. Mi compromiso es estar aquí y dar lo mejor; el suyo es intentar no faltar. Usaremos aplicaciones y juegos. Nadie se queda atrás.", media: "image", src: "images/slide7.png" },
    { title: "Habilidad 1: Argumentar", subtitle: "", text: "Pregúntate siempre \"¿Por qué?\". Las cosas tienen una razón lógica. Aprende a justificar tus decisiones con seguridad.", media: "image", src: "images/slide8.png" },
    { title: "Habilidad 2: Representar", subtitle: "", text: "Diferentes puntos de vista: números, geometría, álgebra. Encuentra la forma de ver el mundo que mejor calce con tu cerebro.", media: "image", src: "images/slide9.png" },
    { title: "Habilidad 3: Modelar", subtitle: "", text: "Tomar un problema del mundo real, llevarlo al mundo de las matemáticas para resolverlo. Y aplicar esa solución en tu vida diaria.", media: "image", src: "images/slide10.png" },
    { title: "Habilidad 4: Resolver", subtitle: "", text: "La vida está llena de problemas. Busca soluciones lógicas. Ningún obstáculo será demasiado grande si sabes articular la información.", media: "image", src: "images/slide11.png" },
    { title: "¿Para qué sirve?", subtitle: "", text: "Medicina, música, celulares, química, deporte... La matemática está en todo. Cuéntenme sus sueños y buscaremos el lugar de la matemática en ellos.", media: "image", src: "images/slide12.png" }
];

// Helper to extract YouTube ID and return embed URL
function getYouTubeEmbedUrl(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
}

function loadSlides() {
    const saved = localStorage.getItem('mate-slides');
    slides = saved ? JSON.parse(saved) : defaultSlides.map(s => ({...s}));
    renderSlides();
}

function saveSlides() {
    localStorage.setItem('mate-slides', JSON.stringify(slides));
}

function renderSlides() {
    slidesContainer.innerHTML = '';
    navContainer.innerHTML = '';
    
    // Set dynamic widths
    const total = slides.length;
    document.documentElement.style.setProperty('--container-width', `${total * 100}%`);
    totalPageLabel.textContent = total;

    slides.forEach((slide, i) => {
        // Nav Buttons
        const num = document.createElement('div');
        num.classList.add('nav-num');
        num.textContent = i + 1;
        num.addEventListener('click', () => goToSlide(i));
        navContainer.appendChild(num);

        // Slide Element
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slide');
        if (i % 2 !== 0) slideDiv.classList.add('reverse');
        slideDiv.style.width = `${100 / total}%`;

        let mediaHtml = '';
        if (slide.media === 'image') {
            mediaHtml = `<img src="${slide.src}" class="slide-img" alt="slide-image">`;
        } else if (slide.media === 'youtube') {
            mediaHtml = `<iframe class="slide-video" src="${slide.src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }

        slideDiv.innerHTML = `
            <div class="slide-content">
                <h2 contenteditable="true" spellcheck="true" oninput="updateSlideData(${i}, 'title', this.innerText)">${slide.title}</h2>
                ${slide.subtitle ? `<h3 contenteditable="true" spellcheck="true" oninput="updateSlideData(${i}, 'subtitle', this.innerText)">${slide.subtitle}</h3>` : ''}
                <p contenteditable="true" spellcheck="true" oninput="updateSlideData(${i}, 'text', this.innerText)">${slide.text}</p>
            </div>
            <div class="slide-media-container">
                ${mediaHtml}
                <div class="media-overlay">
                    <p>Gestionar Multimedia</p>
                    <div class="overlay-actions">
                        <button class="overlay-btn" onclick="document.getElementById('file-img-${i}').click()">Cargar Imagen</button>
                        <button class="overlay-btn" onclick="addYouTubeVideo(${i})">Agregar Link YouTube</button>
                        <button class="overlay-btn" onclick="deleteSlide(${i})">Eliminar Diapositiva</button>
                    </div>
                </div>
                <input type="file" id="file-img-${i}" hidden accept="image/*" onchange="uploadImage(${i}, event)">
            </div>
        `;
        slidesContainer.appendChild(slideDiv);
    });
    updateUI();
}

// Global functions
window.updateSlideData = (index, field, value) => {
    slides[index][field] = value;
    saveSlides();
}

window.uploadImage = (index, event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            slides[index].media = 'image';
            slides[index].src = e.target.result;
            saveSlides();
            renderSlides();
        };
        reader.readAsDataURL(file);
    }
}

window.addYouTubeVideo = (index) => {
    const url = prompt("Ingresa el link de YouTube:");
    if (url) {
        const embedUrl = getYouTubeEmbedUrl(url);
        if (embedUrl) {
            slides[index].media = 'youtube';
            slides[index].src = embedUrl;
            saveSlides();
            renderSlides();
        } else {
            alert("Link de YouTube no válido.");
        }
    }
}

window.deleteSlide = (index) => {
    if (slides.length <= 1) return alert("Debe haber al menos una diapositiva.");
    if (confirm("¿Estás segura de eliminar esta diapositiva?")) {
        slides.splice(index, 1);
        if (currentIndex >= slides.length) currentIndex = slides.length - 1;
        saveSlides();
        renderSlides();
    }
}

function updateUI() {
    slidesContainer.style.transform = `translateX(-${(currentIndex * 100) / (slides.length || 1)}%)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === slides.length - 1;
    document.querySelectorAll('.nav-num').forEach((num, index) => num.classList.toggle('active', index === currentIndex));
    currentPageLabel.textContent = currentIndex + 1;

    const activeSlide = slidesContainer.querySelectorAll('.slide')[currentIndex];
    if (activeSlide) {
        const c = activeSlide.querySelector('.slide-content');
        const m = activeSlide.querySelector('.slide-media-container');
        [c, m].forEach(el => {
            if (el) {
                el.classList.remove('animate-in');
                void el.offsetWidth;
                el.classList.add('animate-in');
            }
        });
    }
}

function goToSlide(index) {
    currentIndex = index;
    updateUI();
}

prevBtn.addEventListener('click', () => currentIndex > 0 && goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => currentIndex < slides.length - 1 && goToSlide(currentIndex + 1));

addSlideBtn.addEventListener('click', () => {
    slides.push({
        title: "Nueva Diapositiva",
        subtitle: "",
        text: "Escribe aquí tu contenido...",
        media: "image",
        src: "https://via.placeholder.com/800"
    });
    saveSlides();
    renderSlides();
    goToSlide(slides.length - 1);
});

// Theme Logic
const setDarkTheme = (isDark) => {
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeText.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

themeBtn.addEventListener('click', () => setDarkTheme(!document.body.classList.contains('dark')));
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
});

// Init
loadSlides();
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') setDarkTheme(true);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setDarkTheme(true);
else setDarkTheme(false);
