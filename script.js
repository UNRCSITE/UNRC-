const CONFIG = {
  email: "",
  tutorLabel: "tutor/a"
};

function updateHeaderOffset() {
  const header = document.querySelector('.app-header');
  if (!header) return;
  const height = header.offsetHeight;
  document.documentElement.style.setProperty('--app-header-height', `${height}px`);
}

function goBackToBrujula() {
  document.getElementById('calculator-view').classList.add('hidden');
  document.getElementById('emotional-view').classList.add('hidden');
  document.getElementById('tech-kit-view').classList.add('hidden');
  document.getElementById('main-view').classList.remove('hidden');

  if (typeof stopBreathing === 'function') stopBreathing();
  resetMood();
}

function showEmotionalCompass() {
  document.getElementById('main-view').classList.add('hidden');
  const emotionalView = document.getElementById('emotional-view');
  emotionalView.classList.remove('hidden');
  emotionalView.classList.add('flex');
  goToStep(1);
}

function showTechKit() {
  document.getElementById('main-view').classList.add('hidden');
  document.getElementById('tech-kit-view').classList.remove('hidden');
  techKit.render();
}

window.goBackToBrujulaGlobal = goBackToBrujula;

function showResponse(mood) {
  const selectionView = document.getElementById('selection-view');
  const responseView = document.getElementById('response-view');
  const feedbackText = document.getElementById('feedback-text');
  const resourceContainer = document.getElementById('resource-container');

  let icon = "";
  let msg = "";
  let items = [];

  if (mood === 'abrumado') {
    icon = "❤️‍🩹";
    msg = "<strong>Es válido pausar.</strong> Reconocer que estás saturado/a es el primer paso para retomar. No tienes que resolver todo el semestre hoy; solo necesitas recuperar el aliento y la calma.";
    items = [
      { label: "Brújula interior (contención emocional)", action: "showEmotionalCompass()", icon: "🫶" }
    ];
  } else if (mood === 'problemas') {
    icon = "🟡";
    msg = "Lamentamos lo sucedido. Recuerda que el modelo de la UNRC es flexible y estamos aquí para apoyarte en tu reingreso.";
    items = [
      { label: "Kit de supervivencia digital", action: "showTechKit()", icon: "🛠️" }
    ];
  } else if (mood === 'listo') {
    icon = "🟢";
    msg = "¡Excelente impulso! Tu determinación es el primer paso al éxito. Usa la herramienta de planificación para proyectar tu acreditación.";
    items = [
      { label: "🚀 Plan de acción y calculadora UNRC", action: "openCalculator()", icon: "➡️" }
    ];
  }

  selectionView.classList.add('hidden');
  responseView.classList.remove('hidden');
  feedbackText.innerHTML = `<span class="block text-4xl mb-3">${icon}</span> ${msg}`;

  resourceContainer.innerHTML = "";
  items.forEach(item => {
    resourceContainer.innerHTML += `
      <button type="button" onclick="${item.action}" class="w-full p-4 bg-white border-2 rounded-2xl text-11 font-black text-guinda transition-all flex justify-between items-center shadow-sm">
        <span class="flex items-center gap-2">${item.icon} ${item.label}</span>
        <span>›</span>
      </button>
    `;
  });
}

function openCalculator() {
  document.getElementById('main-view').classList.add('hidden');
  document.getElementById('calculator-view').classList.remove('hidden');
  setPlan('2023');
}

function resetMood() {
  document.getElementById('response-view').classList.add('hidden');
  document.getElementById('selection-view').classList.remove('hidden');
}

function contactTutor() {
  const body = `Hola, soy estudiante de la UNRC y me gustaría conversar sobre mi plan de reenganche.`;
  window.location.href = `mailto:?subject=Consulta: Brújula de Reenganche UNRC&body=${encodeURIComponent(body)}`;
}

let currentPlan = '2023';
let tieneExamen = true;

function switchTab(tab) {
  document.getElementById('content-estrategia').classList.toggle('hidden', tab !== 'estrategia');
  document.getElementById('content-calculadora').classList.toggle('hidden', tab !== 'calculadora');

  document.getElementById('tab-estrategia').className = tab === 'estrategia' ? 'tab-active' : 'tab-inactive';
  document.getElementById('tab-calculadora').className = tab === 'calculadora' ? 'tab-active' : 'tab-inactive';

  if (tab === 'calculadora') renderInputs();
}

function setPlan(plan) {
  currentPlan = plan;
  const is2023 = plan === '2023';

  document.getElementById('btn-2023').className = is2023 ? 'plan-active' : 'plan-inactive';
  document.getElementById('btn-2020').className = !is2023 ? 'plan-active' : 'plan-inactive';

  const actName = is2023 ? 'Tareas Auténticas' : 'Experiencias de aprendizaje';

  document.getElementById('card-act-title').innerText = actName;
  document.getElementById('term-act-guia').innerText = actName.toLowerCase();
  document.getElementById('input-label-act').innerText = `3. ${actName} (40% Peso)`;
  document.getElementById('int-perc-text').innerText = is2023 ? '30%' : (tieneExamen ? '25%' : '40%');
  document.getElementById('foro-perc-text').innerText = is2023 ? '30%' : '20%';
  document.getElementById('input-label-foros').innerText = `4. Participación en Foros (${is2023 ? '30%' : '20%'})`;
  document.getElementById('label-integradora-perc').innerText = `Actividad Integradora (${is2023 ? '30%' : (tieneExamen ? '25%' : '40%')})`;

  document.getElementById('card-examen').classList.toggle('hidden', is2023 || !tieneExamen);
  document.getElementById('examen-toggle-div').classList.toggle('hidden', is2023);

  document.getElementById('numTareas').value = is2023 ? 4 : 3;
  document.getElementById('numForos').value = is2023 ? 5 : 6;

  renderInputs();
}

function toggleExamen() {
  tieneExamen = !tieneExamen;
  document.getElementById('btn-toggle-examen').className = tieneExamen
    ? 'btn-toggle-examen'
    : 'btn-toggle-examen bg-white text-slate-400 border border-slate-200 shadow-sm';
  document.getElementById('examen-toggle-icon').innerText = tieneExamen ? 'ON' : 'OFF';
  setPlan(currentPlan);
}

function renderInputs() {
  const nT = parseInt(document.getElementById('numTareas').value, 10);
  const nF = parseInt(document.getElementById('numForos').value, 10);
  const tCont = document.getElementById('tareas-container');
  const fCont = document.getElementById('foros-container');

  tCont.innerHTML = '';
  fCont.innerHTML = '';

  for (let i = 1; i <= nT; i += 1) {
    tCont.innerHTML += `<div><label class="text-10 text-slate-400 block mb-2 text-center font-bold uppercase">Entrega ${i}</label><input type="number" oninput="calculate()" class="tarea-val w-full p-3 border border-slate-200 rounded-xl text-center font-bold text-sm shadow-sm" placeholder="0"></div>`;
  }
  for (let i = 1; i <= nF; i += 1) {
    fCont.innerHTML += `<div><label class="text-10 text-slate-400 block mb-2 text-center font-bold uppercase">Foro ${i}</label><input type="number" oninput="calculate()" class="foro-val w-full p-3 border border-slate-200 rounded-xl text-center font-bold text-sm shadow-sm" placeholder="0"></div>`;
  }

  document.getElementById('val-examen-div').classList.toggle('hidden', currentPlan === '2023' || !tieneExamen);
  calculate();
}

function calculate() {
  const tareas = Array.from(document.querySelectorAll('.tarea-val')).map(i => parseFloat(i.value) || 0);
  const foros = Array.from(document.querySelectorAll('.foro-val')).map(i => parseFloat(i.value) || 0);
  const intValue = parseFloat(document.getElementById('val-integradora').value) || 0;
  const exam = parseFloat(document.getElementById('val-examen')?.value) || 0;

  const avgT = tareas.length ? tareas.reduce((a, b) => a + b, 0) / tareas.length : 0;
  const avgF = foros.length ? foros.reduce((a, b) => a + b, 0) / foros.length : 0;

  let total = 0;
  if (currentPlan === '2023') {
    total = (avgT * 0.4) + (avgF * 0.3) + (intValue * 0.3);
  } else {
    const base = (avgT * 0.4) + (avgF * 0.2);
    total = tieneExamen ? base + (exam * 0.15) + (intValue * 0.25) : base + (intValue * 0.4);
  }

  const res = total.toFixed(2);
  const aprobado = Number(res) >= 60;

  document.getElementById('final-score').innerText = `${res}%`;
  const finalScore = document.getElementById('final-score');
  finalScore.classList.toggle('score-pass', aprobado);
  finalScore.classList.toggle('score-fail', !aprobado);

  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${Math.min(Number(res), 100)}%`;
  progressBar.classList.toggle('progress-pass', aprobado);
  progressBar.classList.toggle('progress-fail', !aprobado);

  const topBar = document.getElementById('top-bar');
  topBar.classList.toggle('top-bar-pass', aprobado);
  topBar.classList.toggle('top-bar-fail', !aprobado);

  const sBox = document.getElementById('status-box');
  sBox.className = aprobado
    ? 'w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-4 bg-green-50 text-green-700'
    : 'w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-4 bg-red-50 text-guinda';
  sBox.textContent = aprobado ? '✅' : '⏰';

  const mBox = document.getElementById('msg-box');
  if (aprobado) {
    mBox.className = 'bg-green-50 text-green-700 p-5 rounded-2xl border border-green-100 mb-6 font-black text-lg text-center';
    mBox.innerText = '¡Acreditación lograda!';
  } else {
    mBox.className = 'bg-amber-50 text-amber-800 p-5 rounded-2xl border border-amber-100 mb-6 font-black text-lg text-center';
    mBox.innerText = 'Meta: 60%';
  }
}

function goToStep(step) {
  document.querySelectorAll('.step-content').forEach(el => el.classList.add('hidden'));

  const progressBar = document.getElementById('emotional-progress-bar');
  let progressWidth = '0%';
  let stepId = '';

  if (step === 1) {
    stepId = 'step-1';
    progressWidth = '25%';
  } else if (step === 2) {
    stepId = 'step-2';
    progressWidth = '50%';
    stopBreathing();
  } else if (step === 3) {
    stepId = 'step-3';
    progressWidth = '75%';
  } else if (step === 'final') {
    stepId = 'step-final';
    progressWidth = '100%';
  }

  document.getElementById(stepId).classList.remove('hidden');
  progressBar.style.width = progressWidth;
}

let isBreathing = false;
let breathInterval;

function toggleBreathing() {
  if (isBreathing) stopBreathing();
  else startBreathing();
}

function startBreathing() {
  const circle = document.getElementById('breathCircle');
  const text = document.getElementById('breathText');
  const btn = document.getElementById('toggleBreathBtn');

  isBreathing = true;
  btn.textContent = 'Detener';
  btn.classList.remove('bg-blue-600', 'hover-bg-blue-700');
  btn.classList.add('bg-slate-400', 'hover-bg-slate-500');
  text.textContent = 'Inhala';
  circle.classList.add('inhale');

  breathInterval = setInterval(() => {
    if (circle.classList.contains('inhale')) {
      text.textContent = 'Exhala';
      circle.classList.remove('inhale');
      circle.classList.add('exhale');
    } else {
      text.textContent = 'Inhala';
      circle.classList.remove('exhale');
      circle.classList.add('inhale');
    }
  }, 4000);
}

function stopBreathing() {
  const circle = document.getElementById('breathCircle');
  const text = document.getElementById('breathText');
  const btn = document.getElementById('toggleBreathBtn');

  isBreathing = false;
  clearInterval(breathInterval);
  if (btn) {
    btn.textContent = 'Iniciar Respiración';
    btn.classList.remove('bg-slate-400', 'hover-bg-slate-500');
    btn.classList.add('bg-blue-600', 'hover-bg-blue-700');
  }
  if (text) text.textContent = 'Listo';
  if (circle) circle.classList.remove('inhale', 'exhale');
}

const adviceDatabase = {
  ansiedad: {
    title: 'Calma la Tormenta',
    text: "<p class='mb-3 font-semibold text-slate-700'>La ansiedad es tu mente viajando al futuro para resolver problemas que aún no existen.</p><p>Es un mecanismo de defensa primitivo, pero agotador. Tu cuerpo está aquí, en el presente.</p>",
    action: "<p class='mb-2 font-bold'>Técnica de Aterrizaje 5-4-3-2-1:</p><ul class='list-none space-y-2 pl-1'><li>👀 Encuentra <strong>5</strong> cosas que puedas ver.</li><li>✋ Toca <strong>4</strong> cosas con texturas distintas.</li><li>👂 Identifica <strong>3</strong> sonidos.</li><li>👃 Identifica <strong>2</strong> olores.</li><li>👅 Siente <strong>1</strong> sabor.</li></ul>",
    colors: { header: 'bg-orange-100', accent: 'border-orange-300' }
  },
  agotamiento: {
    title: 'Permiso para Pausar',
    text: "<p class='mb-3 font-semibold text-slate-700'>No eres una máquina; tu batería biológica es real y finita.</p><p>El agotamiento no es debilidad, es física pura.</p>",
    action: "<p class='mb-2 font-bold'>La Pausa Sagrada de 1 Minuto:</p><ul class='list-disc pl-4 space-y-1'><li>Cierra los ojos.</li><li>Suelta la mandíbula.</li><li>Baja los hombros.</li></ul>",
    colors: { header: 'bg-purple-100', accent: 'border-purple-300' }
  },
  bloqueo: {
    title: 'Desatar el Nudo',
    text: "<p class='mb-3 font-semibold text-slate-700'>Cuando sientes que no tienes control, recupera el control sobre las cosas pequeñas.</p>",
    action: "<p class='mb-2 font-bold'>Victorias Pequeñas y Reales:</p><ul class='list-disc pl-4 space-y-1'><li>Haz tu cama.</li><li>Lava un plato.</li><li>Ordena un cajón.</li></ul>",
    colors: { header: 'bg-slate-200', accent: 'border-slate-400' }
  },
  soledad: {
    title: 'Conexión Humana',
    text: "<p class='mb-3 font-semibold text-slate-700'>No necesitas estar siempre fuerte o disponible.</p><p>Recordar que hay gente a tu alrededor es el primer paso.</p>",
    action: "<p class='mb-2 font-bold'>Un Gesto Simple:</p><ul class='list-disc pl-4 space-y-1'><li>Piensa en alguien seguro/a.</li><li>Mándale un 'Hola'.</li></ul>",
    colors: { header: 'bg-teal-100', accent: 'border-teal-300' }
  }
};

function showAdvice(emotion) {
  const data = adviceDatabase[emotion];
  if (!data) return;

  document.getElementById('advice-title').textContent = data.title;
  document.getElementById('advice-text').innerHTML = data.text;
  document.getElementById('advice-action').innerHTML = data.action;

  document.getElementById('advice-header').className = `p-5 rounded-t-2xl flex justify-between items-start shrink-0 ${data.colors.header} bg-orange-100`;
  document.getElementById('advice-action-box').className = `bg-slate-50 p-4 rounded-xl border-l-4 ${data.colors.accent}`;

  document.getElementById('emotion-selector').classList.add('hidden');
  const panel = document.getElementById('advice-panel');
  panel.classList.remove('hidden');
  panel.classList.add('flex');
}

function resetCompass() {
  document.getElementById('advice-panel').classList.add('hidden');
  document.getElementById('advice-panel').classList.remove('flex');
  document.getElementById('emotion-selector').classList.remove('hidden');
}

function clearMind() {
  const textarea = document.getElementById('worry-input');
  if (textarea.value.trim() === '') return;

  textarea.style.transition = 'all 0.8s';
  textarea.style.opacity = '0';
  textarea.style.transform = 'scale(0.9)';

  setTimeout(() => {
    textarea.value = '';
    textarea.style.opacity = '1';
    textarea.style.transform = 'scale(1)';
    textarea.placeholder = '✨ Espacio liberado.';
    setTimeout(() => {
      textarea.placeholder = 'Escribe aquí lo que te preocupa para sacarlo de tu sistema...';
    }, 2000);
  }, 800);
}

const techKit = {
  activeCategory: 'all',
  selectedTipId: null,
  mobileOpen: false,
  categories: [
    { id: 'all', label: 'Todos' },
    { id: 'moodle', label: 'Plataforma Moodle' },
    { id: 'technical', label: 'Técnico y Archivos' },
    { id: 'mobile', label: 'Móvil y Offline' },
    { id: 'wellness', label: 'Ergonomía y Bienestar' }
  ],
  tips: [
    { id: 1, title: 'Limpieza del Navegador (Cookies e Historial)', category: 'technical', content: '<p>Ve a borrar datos de navegación, selecciona "Todos", marca cookies y caché, borra y reinicia navegador.</p>' },
    { id: 2, title: 'Reducir peso de archivos (Menos de 1MB)', category: 'technical', content: '<p>Comprime PDF (ILovePDF/SmallPDF), comprime imágenes en Word o usa TinyPNG antes de enviar.</p>' },
    { id: 3, title: 'Participar en un Foro de Moodle', category: 'moodle', content: '<p>Entra al foro, crea tema o responde hilo usando "Responder" y luego "Enviar".</p>' },
    { id: 4, title: 'Subir Tareas y Archivos', category: 'moodle', content: '<p>Abre actividad, "Agregar entrega", sube archivo y confirma con "Guardar cambios".</p>' },
    { id: 5, title: 'Problemas de Acceso y Contacto', category: 'moodle', content: '<p>Contacta a tu tutor/a con nombre, matrícula, grupo y captura del error.</p>' },
    { id: 6, title: 'Mensajería y Perfil', category: 'moodle', content: '<p>Usa mensajería interna y actualiza tu foto en perfil > editar perfil.</p>' },
    { id: 7, title: 'Estudio sin Internet y Móvil', category: 'mobile', content: '<p>Descarga materiales cuando tengas internet, trabaja offline y sube cuando regrese conexión.</p>' },
    { id: 8, title: 'Capturas de Pantalla y Recuperación', category: 'technical', content: '<p>Windows: Win+Shift+S. Recupera borrados en papelera o documentos no guardados de Word.</p>' },
    { id: 9, title: 'Ergonomía y Salud', category: 'wellness', content: '<p>Aplica regla 20-20-20, postura estable y buena iluminación para reducir fatiga.</p>' },
    { id: 10, title: 'Fallas Técnicas (Modem/Luz)', category: 'technical', content: '<p>Reinicia módem, usa hotspot móvil en urgencia y documenta fallas con evidencia.</p>' },
    { id: 11, title: 'No tengo Office / Word', category: 'technical', content: '<p>Alternativas gratis: Google Docs, LibreOffice, Office Online.</p>' },
    { id: 12, title: 'Internet Lento / Compartido', category: 'technical', content: '<p>Sube archivos en horarios valle, reduce consumo en casa y acércate al router.</p>' },
    { id: 13, title: 'Archivo no carga / "Cargando..."', category: 'technical', content: '<p>Verifica tamaño, refresca sesión y prueba otro navegador o incógnito.</p>' },
    { id: 14, title: 'Subí el archivo equivocado', category: 'moodle', content: '<p>Entra a editar envío, borra archivo incorrecto, sube correcto y guarda cambios.</p>' },
    { id: 15, title: '¿Ya entregué mi actividad?', category: 'moodle', content: '<p>Verde = enviado; amarillo = borrador no confirmado; sin estado = no enviado.</p>' },
    { id: 16, title: 'Nombres de Archivos (Nomenclatura)', category: 'technical', content: '<p>Usa nomenclatura pedida, evita caracteres especiales y separa con guiones bajos.</p>' },
    { id: 17, title: 'Ansiedad Tecnológica', category: 'wellness', content: '<p>Explorar menús no rompe la plataforma; apóyate en deshacer (Ctrl+Z) cuando sea necesario.</p>' },
    { id: 18, title: 'Herramientas Básicas (¿Qué es qué?)', category: 'technical', content: '<p>Word para editar, PDF para entregar, nube para respaldar.</p>' },
    { id: 19, title: '¿Cómo ver mis Calificaciones?', category: 'moodle', content: '<p>Consulta por actividad en retroalimentación o en el reporte general de calificaciones.</p>' }
  ],

  get filteredTips() {
    return this.tips.filter(t => this.activeCategory === 'all' || t.category === this.activeCategory);
  },

  get selectedTip() {
    return this.tips.find(t => t.id === this.selectedTipId) || null;
  },

  setCategory(cat) {
    this.activeCategory = cat;
    this.selectedTipId = null;
    this.mobileOpen = false;
    this.render();
  },

  selectTip(id) {
    this.selectedTipId = id;
    this.render();
  },

  closeModal() {
    this.selectedTipId = null;
    this.render();
  },

  toggleMobile(open) {
    this.mobileOpen = open;
    this.render();
  },

  render() {
    const root = document.getElementById('tech-kit-app');
    if (!root) return;

    const categoryButtons = this.categories.map(cat => `
      <button class="tech-cat-btn ${this.activeCategory === cat.id ? 'active' : ''}" onclick="techKit.setCategory('${cat.id}')">${cat.label}</button>
    `).join('');

    const cards = this.filteredTips.map(tip => `
      <article class="tech-card" onclick="techKit.selectTip(${tip.id})">
        <span class="tech-badge">${this.categories.find(c => c.id === tip.category)?.label || 'General'}</span>
        <h3 class="tech-card-title mt-2 mb-2">${tip.title}</h3>
        <p class="text-slate-500 text-sm">Haz clic para ver los pasos detallados y la solución completa.</p>
      </article>
    `).join('');

    const intro = this.activeCategory === 'all' && !this.selectedTipId
      ? `<div class="tech-intro"><h2 class="tech-intro-title text-2xl font-bold mb-2">¡Bienvenido/a a tu Kit de Supervivencia Digital!</h2><p>Aquí encontrarás soluciones rápidas a los problemas más comunes al estudiar en línea.</p></div>`
      : '';

    const modal = this.selectedTip ? `
      <div class="tech-modal" onclick="techKit.closeModal()">
        <div class="tech-modal-body" onclick="event.stopPropagation()">
          <div class="tech-modal-head">
            <h2 class="tech-title">${this.selectedTip.title}</h2>
            <button class="tech-close" onclick="techKit.closeModal()">✕</button>
          </div>
          <div class="tech-modal-content">${this.selectedTip.content}</div>
          <div class="p-4 border-top-slate" style="text-align:right;">
            <button class="btn btn-dark" onclick="techKit.closeModal()">Entendido</button>
          </div>
        </div>
      </div>
    ` : '';

    root.innerHTML = `
      <div class="tech-layout">
        <aside class="tech-sidebar ${this.mobileOpen ? 'open' : ''}">
          <div class="tech-header-title">Guía Estudiantil</div>
          <button class="tech-back-btn" onclick="goBackToBrujula()">← Volver al Menú</button>
          <div class="tech-sidebar-separator"></div>
          ${categoryButtons}
          <div class="tech-footer-note">© Universidad Nacional Rosario Castellanos<br/>Recurso Educativo Digital<br/><strong>VRC</strong></div>
        </aside>

        <main class="tech-main">
          <header class="tech-top-mobile">
            <button class="btn btn-sm btn-outline-dark" onclick="techKit.toggleMobile(true)">☰</button>
            <strong class="tech-mobile-title">Ayuda Estudiante</strong>
            <button class="btn btn-sm btn-outline-secondary ms-auto" onclick="goBackToBrujula()">Volver</button>
          </header>

          <section class="tech-content">
            ${intro}
            <div class="tech-grid">${cards || '<p class="text-slate-400">No encontramos consejos en esta categoría.</p>'}</div>
          </section>
        </main>
      </div>
      ${modal}
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderOffset();
  resetMood();
  techKit.render();
  window.addEventListener('resize', updateHeaderOffset);
  window.addEventListener('orientationchange', updateHeaderOffset);
});
