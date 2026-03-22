// --- Configuración Inicial ---
let currentIdx = 0;
let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
let isEditing = false;

// --- Datos Originales (Siempre disponibles como respaldo) ---
const originalSlides = [{"title":"       Matemáticas","h3":"         El lenguaje para entender el universo.","p":"\n","media":"data:image/jpeg;base64,...(contenido truncado por brevedad)...","type":"image","alternate":false},{"title":"Conóceme","h3":"¡Hola! Soy tu guía en este viaje.","p":"Me apasiona enseñar y ver cómo mis alumnos descubren su propio potencial. Aquí no solo aprenderemos fórmulas, sino nuevas formas de pensar juntos.","media":"https://images.unsplash.com/photo-1544717297-fa154da09f5b?auto=format&fit=crop&q=80","type":"image","alternate":true},{"title":"¿Para qué sirven?","h3":"Más allá del aula y los exámenes.","p":"¿Te has preguntado cómo funciona tu videojuego favorito o cómo se construyen los rascacielos? Las matemáticas son la herramienta secreta detrás de todo lo que amas.","media":"https://images.unsplash.com/photo-1551033413-5b87cc250269?auto=format&fit=crop&q=80","type":"image","alternate":false},{"title":"Preguntar es de valientes","h3":"Ninguna duda es demasiado pequeña.","p":"Este es un espacio seguro. Si algo no está claro, ¡levanta la mano! Cada pregunta nos ayuda a todos a entender mejor el tema de hoy.","media":"https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80","type":"image","alternate":true}];

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
                    <button onclick="changeMedia(${idx})">📸 Cambiar Imagen</button>
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
