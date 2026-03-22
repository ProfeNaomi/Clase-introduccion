// --- Configuración Inicial ---
let currentIdx = 0;
let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
let isEditing = false;

// --- Datos Originales (Siempre disponibles como respaldo) ---
const originalSlides = [
    { title: "Matemáticas", h3: "El lenguaje para entender el universo.", p: "", media: "/images/slide1.png", type: "image", alternate: false },
    { title: "Naomi Urrea", h3: "", p: "Profesora de matemáticas e ingeniera en ejecución industrial, pero antes que todo eso, una amante de las matemáticas, las ciencias y, por sobre todo, el conocimiento.", media: "/images/slide2.png", type: "image", alternate: true },
    { title: "Y a ti ¿Que te gusta?", h3: "Más allá del aula y los exámenes.", p: "¿Te has preguntado cómo funciona tu videojuego favorito o cómo se construyen los rascacielos? Las matemáticas son la herramienta secreta detrás de todo lo que amas.", media: "/images/slide3.png", type: "image", alternate: false },
    { title: "Preguntar es de valientes", h3: "Ninguna duda es demasiado pequeña.", p: "Este es un espacio seguro. Si algo no está claro, ¡levanta la mano! Cada pregunta nos ayuda a todos a entender mejor el tema de hoy.", media: "/images/slide4.png", type: "image", alternate: true },
    { title: "Participación", h3: "Tú eres el protagonista aquí.", p: "Aprender matemáticas es como aprender un deporte: para mejorar, ¡hay que jugar! Tu participación es vital para que la clase sea dinámica y divertida.", media: "/images/slide5.png", type: "image", alternate: false },
    { title: "Espacio Seguro", h3: "Respeto, empatía y colaboración.", p: "Aquí nos apoyamos unos a otros. El error no es un fracaso, es solo una parte necesaria del aprendizaje. ¡Equivocarse está permitido!", media: "/images/slide6.png", type: "image", alternate: true },
    { title: "Disciplina y Equipo", h3: "Juntos llegamos más lejos.", p: "Llegar a tiempo nos permite aprovechar cada minuto. El éxito en matemáticas suele ser el resultado de un buen trabajo en equipo.", media: "/images/slide7.png", type: "image", alternate: false },
    { title: "Argumentar y comunicar", h3: "Pensar antes de actuar.", p: "Argumentar: Justificar pasos lógicos, defender una postura, evaluar el razonamiento de otros y usar contraejemplos. Comunicar: Usar el lenguaje matemático adecuado (tanto oral como escrito) para presentar soluciones, ideas y hallazgos con orden y claridad.", media: "/images/slide8.png", type: "image", alternate: true },
    { title: "Representar", h3: "Concreto – Pictórico – Simbólico", p: "Es la capacidad de transitar y hacer conexiones entre diferentes formas de mostrar un mismo concepto matemático. Las matemáticas no son solo números; también son dibujos, gráficos, tablas y símbolos.", media: "/images/slide9.png", type: "image", alternate: false },
    { title: "Modelar", h3: "Traducir el mundo a números.", p: "El proceso cíclico de: 1) Identificar un problema real. 2) Crear un modelo matemático. 3) Trabajar matemáticamente con ese modelo. 4) Interpretar los resultados matemáticos de vuelta en el contexto real para ver si tienen sentido.", media: "/images/slide10.png", type: "image", alternate: true },
    { title: "Resolver problemas", h3: "Tu cerebro es un músculo.", p: "Analizar la situación, identificar la información relevante, diseñar una estrategia, aplicar conocimientos matemáticos, verificar su respuesta y, si es necesario, cambiar de estrategia. Se busca desarrollar la perseverancia y la capacidad de enfrentar desafíos.", media: "/images/slide11.png", type: "image", alternate: false },
    { title: "¿Por qué debemos estudiar matemáticas?", h3: "¿Qué te gustaría hacer cuando seas grande?", p: "", media: "/images/slide12.png", type: "image", alternate: true },
    { title: "Nueva Diapositiva", h3: "", p: "", media: "/images/slide1.png", type: "image", alternate: false }
];

// Cargamos de LocalStorage o usamos lo original
let savedData = JSON.parse(localStorage.getItem('presentationData'));
let slides = (savedData && savedData.length > 0) ? savedData : [...originalSlides];

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

// --- Funciones del Sistema ---

function save() {
    localStorage.setItem('presentationData', JSON.stringify(slides));
}

function getYouTubeId(url) {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function render() {
    slidesContainer.innerHTML = '';
    
    slides.forEach((slide, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${slide.alternate ? 'alternate' : ''} ${idx === currentIdx ? 'active' : ''}`;
        
        let mediaHtml = '';
        if (slide.type === 'youtube') {
            const id = getYouTubeId(slide.media);
            mediaHtml = `<iframe src="https://www.youtube.com/embed/${id}?rel=0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
        } else {
            mediaHtml = `<img src="${slide.media}" alt="${slide.title}">`;
        }

        slideDiv.innerHTML = `
            <div class="slide-description">
                <h2 contenteditable="${isEditing}" oninput="update(${idx}, 'title', this.innerText)">${slide.title}</h2>
                <h3 contenteditable="${isEditing}" oninput="update(${idx}, 'h3', this.innerText)">${slide.h3}</h3>
                <p contenteditable="${isEditing}" oninput="update(${idx}, 'p', this.innerText)">${slide.p}</p>
            </div>
            <div class="media-container">
                ${mediaHtml}
                <div class="media-overlay">
                    <button onclick="addYoutubeLink(${idx})">🎥 Link YouTube</button>
                    <button style="background: #ef4444; color: white;" onclick="deleteSlide(${idx})">🗑️ Eliminar</button>
                </div>
            </div>
        `;
        slidesContainer.appendChild(slideDiv);
    });

    totalNumEl.innerText = slides.length;
    currentNumEl.innerText = currentIdx + 1;
    updateNav();
    updateControls();
}

function updateNav() {
    navContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const span = document.createElement('span');
        span.className = `nav-num ${i === currentIdx ? 'active' : ''}`;
        span.innerText = i + 1;
        span.onclick = () => goTo(i);
        navContainer.appendChild(span);
    });
}

function updateControls() {
    prevBtn.disabled = currentIdx === 0;
    nextBtn.disabled = currentIdx === slides.length - 1;
}

function goTo(idx) {
    if (idx < 0 || idx >= slides.length) return;
    
    // Quitamos la clase active de la actual y la ponemos en la nueva
    const existingSlides = document.querySelectorAll('.slide');
    if (existingSlides[currentIdx]) existingSlides[currentIdx].classList.remove('active');
    
    currentIdx = idx;
    
    if (existingSlides[currentIdx]) existingSlides[currentIdx].classList.add('active');
    
    // Actualizamos UI
    currentNumEl.innerText = currentIdx + 1;
    updateNav();
    updateControls();
}

// --- Métodos de Edición ---

window.update = (idx, field, text) => {
    slides[idx][field] = text;
    save();
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
            save();
            render();
        };
        reader.readAsDataURL(file);
    };
    input.click();
};

window.addYoutubeLink = (idx) => {
    const url = prompt("Introduce el link del video de YouTube:");
    if (getYouTubeId(url)) {
        slides[idx].media = url;
        slides[idx].type = 'youtube';
        save();
        render();
    } else if (url) {
        alert("Enlace no válido de YouTube.");
    }
};

window.deleteSlide = (idx) => {
    if (slides.length <= 1) return alert("Mínimo una diapositiva.");
    if (confirm("¿Segura que quieres eliminarla?")) {
        slides.splice(idx, 1);
        if (currentIdx >= slides.length) currentIdx = slides.length - 1;
        save();
        render();
    }
};

window.resetToDefault = () => {
    if (confirm("¿Quieres restaurar la presentación original? Esto borrará tus cambios.")) {
        localStorage.removeItem('presentationData');
        location.reload();
    }
};

// --- Iniciar App ---

themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    themeBtn.querySelector('#theme-icon').innerText = isDark ? '☀️' : '🌙';
    themeBtn.querySelector('#theme-text').innerText = isDark ? 'Claro' : 'Oscuro';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

editModeBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    document.body.classList.toggle('is-editing', isEditing);
    editModeBtn.classList.toggle('editing', isEditing);
    editModeStatus.innerText = isEditing ? 'ON' : 'OFF';
    addSlideBtn.style.display = isEditing ? 'flex' : 'none';
    resetBtn.style.display = isEditing ? 'flex' : 'none';
    render(); // Refrescamos para activar/desactivar contenteditable
});

addSlideBtn.addEventListener('click', () => {
    slides.push({
        title: "Nueva Diapositiva",
        h3: "Subtítulo de la clase",
        p: "Contenido de la diapositiva...",
        media: originalSlides[0].media,
        type: "image",
        alternate: slides.length % 2 !== 0
    });
    save();
    render();
    goTo(slides.length - 1);
});

// Teclado
document.addEventListener('keydown', (e) => {
    if (document.activeElement.hasAttribute('contenteditable')) return;
    if (e.key === 'ArrowRight') goTo(currentIdx + 1);
    if (e.key === 'ArrowLeft') goTo(currentIdx - 1);
});

prevBtn.onclick = () => goTo(currentIdx - 1);
nextBtn.onclick = () => goTo(currentIdx + 1);

// Carga Inicial
document.body.classList.toggle('dark', isDark);
render();
