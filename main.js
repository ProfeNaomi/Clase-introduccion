// --- Configuración Inicial ---
let currentIdx = 0;
let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
let isEditing = false;

// --- Datos Predeterminados (Respaldo) ---
const defaultSlides = [
    { title: "Matemáticas", h3: "El lenguaje para entender el universo.", p: "¡Bienvenidos a su primera clase de matemáticas! Hoy descubriremos cómo los números cuentan historias sobre todo lo que nos rodea, desde las estrellas hasta la música que escuchan.", media: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80", type: "image", alternate: false },
    { title: "Conóceme", h3: "¡Hola! Soy tu guía en este viaje.", p: "Me apasiona enseñar y ver cómo mis alumnos descubren su propio potencial. Aquí no solo aprenderemos fórmulas, sino nuevas formas de pensar juntos.", media: "https://images.unsplash.com/photo-1544717297-fa154da09f5b?auto=format&fit=crop&q=80", type: "image", alternate: true },
    { title: "¿Para qué sirven?", h3: "Más allá del aula y los exámenes.", p: "¿Te has preguntado cómo funciona tu videojuego favorito o cómo se construyen los rascacielos? Las matemáticas son la herramienta secreta detrás de todo lo que amas.", media: "https://images.unsplash.com/photo-1551033413-5b87cc250269?auto=format&fit=crop&q=80", type: "image", alternate: false },
    { title: "Preguntar es de valientes", h3: "Ninguna duda es demasiado pequeña.", p: "Este es un espacio seguro. Si algo no está claro, ¡levanta la mano! Cada pregunta nos ayuda a todos a entender mejor el tema de hoy.", media: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80", type: "image", alternate: true },
    { title: "Participación", h3: "Tú eres el protagonista aquí.", p: "Aprender matemáticas es como aprender un deporte: para mejorar, ¡hay que jugar! Tu participación es vital para que la clase sea dinámica y divertida.", media: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80", type: "image", alternate: false },
    { title: "Espacio Seguro", h3: "Respeto, empatía y colaboración.", p: "Aquí nos apoyamos unos a otros. El error no es un fracaso, es solo una parte necesaria del aprendizaje. ¡Equivocarse está permitido!", media: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80", type: "image", alternate: true },
    { title: "Disciplina y Equipo", h3: "Juntos llegamos más lejos.", p: "Llegar a tiempo y traer tus materiales listos nos permite aprovechar cada minuto. El éxito en matemáticas suele ser el resultado de un buen trabajo en equipo.", media: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80", type: "image", alternate: false },
    { title: "Lógica y Argumentos", h3: "Pensar antes de actuar.", p: "Aprenderás a defender tus ideas con lógica y a encontrar soluciones creativas a problemas que parecen imposibles al primer vistazo.", media: "https://images.unsplash.com/photo-1454165833222-7d8866187ee7?auto=format&fit=crop&q=80", type: "image", alternate: true },
    { title: "Perspectivas", h3: "Diferentes caminos, un mismo destino.", p: "En matemáticas, a menudo hay muchas formas de llegar a la solución. Compartiremos nuestras estrategias para enriquecer el conocimiento del grupo.", media: "https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?auto=format&fit=crop&q=80", type: "image", alternate: false },
    { title: "Modelado", h3: "Traducir el mundo a números.", p: "Aprenderemos a crear modelos simples para entender situaciones complejas, como el crecimiento de una población o el diseño de un puente.", media: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80", type: "image", alternate: true },
    { title: "Resolución de Problemas", h3: "Tu cerebro es un músculo.", p: "Enfrentar desafíos matemáticos entrena tu mente para ser más aguda, paciente y perseverante. Son habilidades para toda la vida.", media: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80", type: "image", alternate: false },
    { title: "¿Alguna pregunta?", h3: "El viaje apenas comienza.", p: "¿Tienes curiosidad por algo específico? Este es el momento perfecto para compartir tus pensamientos iniciales antes de empezar con los números.", media: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80", type: "image", alternate: true }
];

let savedData = JSON.parse(localStorage.getItem('presentationData'));
let slides = (savedData && savedData.length > 0) ? savedData : defaultSlides;

// --- Elementos del DOM ---
const slidesContainer = document.getElementById('slides-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentNumEl = document.getElementById('current-page-num');
const totalNumEl = document.getElementById('total-page-num');
const navContainer = document.getElementById('slide-nav-container');
const themeBtn = document.getElementById('theme-btn');
const addSlideBtn = document.getElementById('add-slide-btn');
const resetBtn = document.getElementById('reset-btn');
const editModeBtn = document.getElementById('edit-mode-btn');
const editModeStatus = document.getElementById('edit-mode-status');

// --- Funciones de Lógica ---

function savePresentation() {
    localStorage.setItem('presentationData', JSON.stringify(slides));
}

function getYouTubeId(url) {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function renderSlides() {
    slidesContainer.innerHTML = '';
    const total = slides.length;
    
    // El contenedor debe medir la suma de todos los anchos de las diapositivas
    slidesContainer.style.width = `${total * 100}vw`;

    slides.forEach((slide, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${slide.alternate ? 'alternate' : ''}`;
        
        let mediaHtml = '';
        if (slide.type === 'youtube') {
            mediaHtml = `<iframe src="https://www.youtube.com/embed/${getYouTubeId(slide.media)}?rel=0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" class="animate-in"></iframe>`;
        } else {
            mediaHtml = `<img src="${slide.media}" alt="${slide.title}" class="animate-in">`;
        }

        slideDiv.innerHTML = `
            <div class="slide-description animate-in">
                <h2 contenteditable="${isEditing}" oninput="updateText(${idx}, 'title', this.innerText)">${slide.title}</h2>
                <h3 contenteditable="${isEditing}" oninput="updateText(${idx}, 'h3', this.innerText)">${slide.h3}</h3>
                <p contenteditable="${isEditing}" oninput="updateText(${idx}, 'p', this.innerText)">${slide.p}</p>
            </div>
            <div class="media-container">
                ${mediaHtml}
                <div class="media-overlay">
                    <button onclick="changeMedia(${idx})">📁 Cambiar Imagen</button>
                    <button onclick="addYoutube(${idx})">🌐 Link YouTube</button>
                    <button style="background: #ef4444; color: white;" onclick="deleteSlide(${idx})">🗑️ Eliminar</button>
                </div>
            </div>
        `;
        slidesContainer.appendChild(slideDiv);
    });

    totalNumEl.innerText = total;
    initNavNumbers();
}

function initNavNumbers() {
    navContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const span = document.createElement('span');
        span.className = `nav-num ${i === currentIdx ? 'active' : ''}`;
        span.innerText = i + 1;
        span.onclick = () => goToSlide(i);
        navContainer.appendChild(span);
    });
}

function updateUI() {
    // Calculamos el desplazamiento exacto en VW
    slidesContainer.style.transform = `translateX(-${currentIdx * 100}vw)`;
    currentNumEl.innerText = currentIdx + 1;
    
    prevBtn.disabled = currentIdx === 0;
    nextBtn.disabled = currentIdx === slides.length - 1;

    document.querySelectorAll('.nav-num').forEach((num, i) => {
        num.classList.toggle('active', i === currentIdx);
    });
}

function goToSlide(idx) {
    if (idx < 0 || idx >= slides.length) return;
    currentIdx = idx;
    updateUI();
}

// --- Acciones del Usuario ---

window.updateText = (idx, field, text) => {
    slides[idx][field] = text;
    savePresentation();
};

window.changeMedia = (idx) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            slides[idx].media = reader.result;
            slides[idx].type = 'image';
            savePresentation();
            renderSlides();
            updateUI();
        };
        reader.readAsDataURL(file);
    };
    input.click();
};

window.addYoutube = (idx) => {
    const url = prompt("Introduce el enlace de YouTube:");
    const id = getYouTubeId(url);
    if (id) {
        slides[idx].media = url;
        slides[idx].type = 'youtube';
        savePresentation();
        renderSlides();
        updateUI();
    } else if (url) {
        alert("Enlace de YouTube no válido.");
    }
};

window.deleteSlide = (idx) => {
    if (slides.length <= 1) return alert("Mínimo debe haber una diapositiva.");
    if (confirm("¿Eliminar esta diapositiva?")) {
        slides.splice(idx, 1);
        if (currentIdx >= slides.length) currentIdx = slides.length - 1;
        savePresentation();
        renderSlides();
        updateUI();
    }
};

window.resetToDefault = () => {
    if (confirm("¿Restaurar las 12 diapositivas originales? (Se perderán tus cambios)")) {
        slides = [...defaultSlides];
        localStorage.removeItem('presentationData');
        location.reload();
    }
};

addSlideBtn.addEventListener('click', () => {
    slides.push({
        title: "Nueva Diapositiva",
        h3: "Subtítulo de ejemplo",
        p: "Texto de la nueva diapositiva...",
        media: "https://images.unsplash.com/photo-1544717297-fa154da09f5b?auto=format&fit=crop&q=80",
        type: "image",
        alternate: slides.length % 2 !== 0
    });
    savePresentation();
    renderSlides();
    goToSlide(slides.length - 1);
});

// --- Gestión de Modo de Edición ---
editModeBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    document.body.classList.toggle('is-editing', isEditing);
    editModeBtn.classList.toggle('editing', isEditing);
    editModeStatus.innerText = isEditing ? 'ON' : 'OFF';
    
    addSlideBtn.style.display = isEditing ? 'flex' : 'none';
    resetBtn.style.display = isEditing ? 'flex' : 'none';
    
    // Aplicamos los cambios visuales y editables
    renderSlides();
    updateUI();
});

// --- Tema ---
function setTheme(dark) {
    isDark = dark;
    document.body.classList.toggle('dark', isDark);
    themeBtn.querySelector('#theme-icon').innerText = isDark ? '☀️' : '🌙';
    themeBtn.querySelector('#theme-text').innerText = isDark ? 'Claro' : 'Oscuro';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

themeBtn.addEventListener('click', () => setTheme(!isDark));

// --- Navegación ---
document.addEventListener('keydown', (e) => {
    if (document.activeElement.hasAttribute('contenteditable')) return;
    if (e.key === 'ArrowRight') goToSlide(currentIdx + 1);
    if (e.key === 'ArrowLeft') goToSlide(currentIdx - 1);
});

prevBtn.onclick = () => goToSlide(currentIdx - 1);
nextBtn.onclick = () => goToSlide(currentIdx + 1);

// --- Inicio ---
setTheme(isDark);
renderSlides();
updateUI();
