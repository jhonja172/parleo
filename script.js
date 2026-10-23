// --- NUEVA FUNCIÓN PARA LEER CON RESALTADO (KARAOKE) ---
function leerHistoriaConResaltado(texto) {
  window.speechSynthesis.cancel();
  const contenedor = document.getElementById('historia-texto');
  if (!contenedor) return;
  
  contenedor.innerHTML = '';
  const palabras = texto.split(' ');
  palabras.forEach((palabra, index) => {
    const span = document.createElement('span');
    span.innerText = palabra + ' ';
    span.id = `palabra-${index}`;
    span.style.transition = 'background-color 0.2s, color 0.2s';
    contenedor.appendChild(span);
  });

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'fr-FR'; 
  
  // Obtener velocidad
  const botonVelocidad = document.querySelector('.speed-button.is-selected');
  const velocidad = botonVelocidad ? parseFloat(botonVelocidad.getAttribute('data-rate')) : 1.0;
  utterance.rate = velocidad;

  utterance.onboundary = (event) => {
    if (event.name === 'word') {
      const charIndex = event.charIndex;
      const textoHastaAqui = texto.substring(0, charIndex);
      const numeroPalabra = textoHastaAqui.split(' ').length - 1;

      document.querySelectorAll('#historia-texto span').forEach(span => {
        span.style.backgroundColor = 'transparent';
        span.style.color = 'inherit';
        span.style.fontWeight = 'normal';
      });

      const palabraActual = document.getElementById(`palabra-${numeroPalabra}`);
      if (palabraActual) {
        palabraActual.style.backgroundColor = '#e8f0e8';
        palabraActual.style.color = '#1e4d2b';
        palabraActual.style.fontWeight = 'bold';
      }
    }
  };

  window.speechSynthesis.speak(utterance);
}
const GEMINI_ENDPOINT = "/api/gemini";
const SUPABASE_URL = "https://ugmfpvvpvkylclesltyx.supabase.co";
const SUPABASE_KEY = "sb_publishable_3sjXn1GV4ayWLGgmpuqdkQ_dCRj6sIo";
const supabaseClient =
  window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY) ?? null;
const STORAGE_KEY = "parleoStories.v1";
const VAULT_STORAGE_KEY = "parleoVault.v1";
const VAULT_SPEED_STORAGE_KEY = "parleoVaultSpeed.v1";
const READ_STORIES_STORAGE_KEY = "parleoReadStories.v1";
const STORY_PROGRESS_GOAL = 10;
const VAULT_PLAYBACK_RATES = [0.75, 0.85, 1];
const LEVEL_CONFIG = {
  A1: {
    words: 150,
    minWords: 142,
    maxWords: 158,
    guidance: "vocabulario muy básico y frases cortas",
  },
  A2: {
    words: 250,
    minWords: 237,
    maxWords: 263,
    guidance:
      "conectores simples (et, mais, parce que) y tiempos como passé composé e imparfait",
  },
  B1: {
    words: 450,
    minWords: 427,
    maxWords: 473,
    guidance: "incluye subjonctif, conditionnel y vocabulario más amplio",
  },
  B2: {
    words: 550,
    minWords: 522,
    maxWords: 578,
    guidance: "vocabulario avanzado, expresiones idiomáticas y estructuras formales",
  },
  C1: {
    words: 650,
    minWords: 617,
    maxWords: 683,
    guidance:
      "vocabulario experto, expresiones literarias y estructuras complejas",
  },
};
const LEVEL_ORDER = Object.keys(LEVEL_CONFIG);
const AVATAR_OPTIONS = [
  { style: "adventurer", seed: "Felix", label: "Aventurero Félix" },
  { style: "avataaars", seed: "Mia", label: "Mia" },
  { style: "micah", seed: "Leo", label: "Leo" },
  { style: "lorelei", seed: "Sofia", label: "Sofía" },
  { style: "notionists", seed: "Amara", label: "Amara" },
  { style: "adventurer-neutral", seed: "Noah", label: "Noah" },
  { style: "avataaars", seed: "Aisha", label: "Aisha" },
  { style: "micah", seed: "Mateo", label: "Mateo" },
  { style: "lorelei", seed: "Camille", label: "Camille" },
  { style: "notionists", seed: "Yuki", label: "Yuki" },
  { style: "adventurer", seed: "Rafael", label: "Rafael" },
  { style: "adventurer-neutral", seed: "Alex", label: "Alex" },
].map((avatar) => ({
  ...avatar,
  url: `https://api.dicebear.com/7.x/${avatar.style}/svg?seed=${encodeURIComponent(avatar.seed)}`,
}));

const mainView = document.querySelector("#main-view");
const readerView = document.querySelector("#reader-view");
const application = document.querySelector("#application");
const loginView = document.querySelector("#login-view");
const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginStatus = document.querySelector("#login-status");
const registerButton = document.querySelector("#register-button");
const registrationForm = document.querySelector("#registration-form");
const registrationName = document.querySelector("#registration-name");
const registrationLevel = document.querySelector("#registration-level");
const registrationEmail = document.querySelector("#registration-email");
const registrationStatus = document.querySelector("#registration-status");
const cancelRegistrationButton = document.querySelector("#cancel-registration-button");
const registrationAvatarGrid = document.querySelector("#registration-avatar-grid");
const primaryNav = document.querySelector("#primary-nav");
const primaryTabs = document.querySelectorAll(".primary-tab");
const primaryViews = document.querySelectorAll(".feature-view, #main-view");
const createTab = document.querySelector("#create-tab");
const libraryTab = document.querySelector("#library-tab");
const createPanel = document.querySelector("#create-panel");
const libraryPanel = document.querySelector("#library-panel");
const storyCount = document.querySelector("#story-count");
const storyForm = document.querySelector("#story-form");
const storyTheme = document.querySelector("#story-theme");
const storyLevel = document.querySelector("#story-level");
const storyType = document.querySelector("#story-type");
const formStatus = document.querySelector("#form-status");
const libraryStatus = document.querySelector("#library-status");
const retryShortStoryButton = document.querySelector("#retry-short-story-button");
const storyList = document.querySelector("#story-list");
const julieView = document.querySelector("#julie-view");
const buildStoryContext = document.querySelector("#build-story-context");
const studentSummary = document.querySelector("#student-summary");
const evaluateSummaryButton = document.querySelector("#evaluate-summary-button");
const askJulieButton = document.querySelector("#ask-julie-button");
const buildFeedback = document.querySelector("#build-feedback");
const buildFeedbackTitle = document.querySelector("#build-feedback-title");
const buildFeedbackText = document.querySelector("#build-feedback-text");
const julieChatHistory = document.querySelector("#julie-chat-history");
const julieChatStatus = document.querySelector("#julie-chat-status");
const julieChatForm = document.querySelector("#julie-chat-form");
const julieMessage = document.querySelector("#julie-message");
const julieSendButton = document.querySelector("#julie-send-button");
const julieMicrophoneButton = document.querySelector("#julie-microphone-button");
const julieMicrophoneLabel = document.querySelector("#julie-microphone-label");
const julieSpeedButtons = document.querySelectorAll(".julie-speed-button");
const vaultList = document.querySelector("#vault-list");
const vaultStatus = document.querySelector("#vault-status");
const vaultSpeedButtons = document.querySelectorAll(".vault-global-speed");
const progressStatus = document.querySelector("#progress-status");
const progressStoriesCount = document.querySelector("#progress-stories-count");
const progressStoriesTrack = document.querySelector("#progress-stories-track");
const progressStoriesBar = document.querySelector("#progress-stories-bar");
const progressStoriesCaption = document.querySelector("#progress-stories-caption");
const progressVocabularyCount = document.querySelector("#progress-vocabulary-count");
const progressVocabularyCaption = document.querySelector("#progress-vocabulary-caption");
const progressCorrectionsCount = document.querySelector("#progress-corrections-count");
const progressCorrectionsCaption = document.querySelector("#progress-corrections-caption");
const progressImprovementsText = document.querySelector("#progress-improvements-text");
const profileForm = document.querySelector("#profile-form");
const profileAvatar = document.querySelector("#profile-avatar");
const profileName = document.querySelector("#profile-name");
const profileNameInput = document.querySelector("#profile-name-input");
const profileLevel = document.querySelector("#profile-level");
const exerciseDifficulty = document.querySelector("#exercise-difficulty");
const profileLevelSummary = document.querySelector("#profile-level-summary");
const profileStatus = document.querySelector("#profile-status");
const changeAvatarButton = document.querySelector("#change-avatar-button");
const profileAvatarPicker = document.querySelector("#profile-avatar-picker");
const profileAvatarGrid = document.querySelector("#profile-avatar-grid");
const logoutButton = document.querySelector("#logout-button");
const headerLogoutButton = document.querySelector("#header-logout-button");
const headerLogoutStatus = document.querySelector("#header-logout-status");
const headerAvatar = document.querySelector("#header-avatar");
const backButton = document.querySelector("#back-button");
const readerTitle = document.querySelector("#reader-title");
const readerSummary = document.querySelector("#reader-summary");
const audioTab = document.querySelector("#audio-tab");
const readingTab = document.querySelector("#reading-tab");
const questionsTab = document.querySelector("#questions-tab");
const audioPanel = document.querySelector("#audio-panel");
const readingPanel = document.querySelector("#reading-panel");
const questionsPanel = document.querySelector("#questions-panel");
const questionList = document.querySelector("#question-list");
const questionLoadStatus = document.querySelector("#question-load-status");
const frenchStory = document.querySelector("#historia-texto");
const spanishTranslation = document.querySelector("#spanish-translation");
const translationToggle = document.querySelector("#translation-toggle");
const translationContainer = document.querySelector("#translation-container");
const wordCountLabel = document.querySelector("#word-count");
const speedButtons = document.querySelectorAll(".speed-button");
const listenButtons = document.querySelectorAll(".listen-button");
const speechStatuses = document.querySelectorAll(".speech-status");
const wordModal = document.querySelector("#word-modal");
const modalClose = document.querySelector("#modal-close");
const modalWord = document.querySelector("#modal-word");
const modalMeaning = document.querySelector("#modal-meaning");
const modalSaveStatus = document.querySelector("#modal-save-status");
const saveWordButton = document.querySelector("#save-word-button");

let stories = [];
let vocabularyCards = [];
let storageError = "";
let currentStory = null;
let selectedVocabularyCard = null;
let selectedRate = 0.85;
let vaultPlaybackRate = 0.75;
let isSpeaking = false;
let translationRequestId = 0;
let currentUser = null;
let pendingShortStoryRequest = null;
let julieRecognitionFailed = false;
let activePronunciationPractice = null;
let selectedRegistrationAvatar = AVATAR_OPTIONS[0].url;
let activeVaultSpeech = null;
let julieConversation = [];
let julieRecognition = null;
let isJulieSpeaking = false;
let isJulieReplyPending = false;
let julieSelectedRate = 0.85;
let julieDictationPending = false;

async function guardarProgreso(datos) {
  if (!currentUser) {
    throw new Error("No hay un usuario activo para guardar el progreso.");
  }
  if (!supabaseClient) {
    throw new Error("El cliente de Supabase no está disponible.");
  }
  if (datos === null || typeof datos !== "object" || Array.isArray(datos)) {
    throw new Error("Los datos de progreso deben ser un objeto.");
  }

  const allowedKeys = new Set([
    "historias",
    "perfil",
    "avatar",
    "difficulty",
  ]);
  const unexpectedKeys = Object.keys(datos).filter((key) => !allowedKeys.has(key));
  if (unexpectedKeys.length > 0) {
    throw new Error(
      `Campos de progreso no admitidos: ${unexpectedKeys.join(", ")}.`,
    );
  }

  const usuarioActual = currentUser;
  const readCollection = (key) => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return [];
    }
    const parsedValue = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      throw new Error(`Los datos guardados en ${key} no tienen un formato válido.`);
    }
    return parsedValue;
  };
  const payload = {
    user_id: usuarioActual.id,
    historias: datos.historias ?? stories,
    baul: readCollection(`${VAULT_STORAGE_KEY}.${usuarioActual.id}`),
    perfil: datos.perfil || {
      name: usuarioActual.name,
      level: usuarioActual.level,
    },
    avatar: datos.avatar ?? usuarioActual.avatar ?? "",
    difficulty: datos.difficulty ?? usuarioActual.difficulty ?? "Normal",
  };
  const { error } = await supabaseClient
    .from("user_progress")
    .upsert(payload, { onConflict: "user_id" });
  if (error) {
    throw new Error(`No se pudo guardar el progreso en Supabase: ${error.message}`);
  }
  if (datos.historias !== undefined) {
    stories = datos.historias;
  }
}

async function cargarProgreso() {
  if (!currentUser) {
    throw new Error("No hay un usuario activo para cargar el progreso.");
  }
  if (!supabaseClient) {
    throw new Error("El cliente de Supabase no está disponible.");
  }

  const usuarioActual = currentUser;
  const { data, error } = await supabaseClient
    .from("user_progress")
    .select("*")
    .eq("user_id", usuarioActual.id)
    .maybeSingle();
  if (error) {
    throw new Error(`No se pudo cargar el progreso de Supabase: ${error.message}`);
  }
  return data;
}

async function loadAuthenticatedProfile(authUser) {
  const metadata = authUser.user_metadata || {};
  const emailName = (authUser.email || "")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();
  currentUser = {
    id: authUser.id,
    email: authUser.email || "",
    name:
      typeof metadata.name === "string" && metadata.name.trim()
        ? metadata.name.trim()
        : emailName || "Estudiante",
    avatar: typeof metadata.avatar === "string" ? metadata.avatar : "",
    level: typeof metadata.level === "string" ? metadata.level : "A1",
    difficulty:
      typeof metadata.difficulty === "string" ? metadata.difficulty : "Normal",
  };

  const profile = await cargarProgreso();
  if (profile) {
    const savedProfile =
      profile.perfil && typeof profile.perfil === "object"
        ? profile.perfil
        : {};
    currentUser = {
      ...currentUser,
      name:
        typeof savedProfile.name === "string"
          ? savedProfile.name
          : currentUser.name,
      avatar:
        typeof profile.avatar === "string" ? profile.avatar : currentUser.avatar,
      level:
        typeof savedProfile.level === "string"
          ? savedProfile.level
          : currentUser.level,
      difficulty:
        typeof profile.difficulty === "string"
          ? profile.difficulty
          : currentUser.difficulty,
    };
  }

  await loadStories(profile);

  return currentUser;
}

function userStoriesStorageKey(userId) {
  return `${STORAGE_KEY}.${userId}`;
}

function readUserScopedValue(legacyKey, scopedKey) {
  const scopedValue = window.localStorage.getItem(scopedKey);
  if (scopedValue !== null) {
    return scopedValue;
  }

  const legacyValue = window.localStorage.getItem(legacyKey);
  if (legacyValue === null) {
    return null;
  }

  window.localStorage.setItem(scopedKey, legacyValue);
  window.localStorage.removeItem(legacyKey);
  return legacyValue;
}

function createUserDataBoxes(userId) {
  window.localStorage.setItem(`${VAULT_STORAGE_KEY}.${userId}`, "[]");
  window.localStorage.setItem(`${READ_STORIES_STORAGE_KEY}.${userId}`, "[]");
  window.localStorage.setItem(`${VAULT_SPEED_STORAGE_KEY}.${userId}`, "0.75");
}

function showApplication(user) {
  currentUser = user;
  storageError = "";
  setAllLevelOptions(storyLevel, currentUser.level);
  renderHeaderAvatar(user);
  loginView.hidden = true;
  application.hidden = false;
  loadVaultPlaybackRate();
  setPrimaryView("main-view");
  renderStories();
}

async function authenticate() {
  loginStatus.textContent = "";
  if (!loginForm.reportValidity()) {
    return;
  }
  if (!supabaseClient) {
    loginStatus.textContent = "No se pudo conectar con el servicio de autenticación.";
    return;
  }

  try {
    const email = loginEmail.value.trim().toLocaleLowerCase("es");
    const password = loginPassword.value;
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    if (!data.user) {
      throw new Error("Supabase no devolvió el usuario autenticado.");
    }

    const user = await loadAuthenticatedProfile(data.user);
    if (!user) {
      loginStatus.textContent = "No se pudo cargar el perfil de la cuenta.";
      return;
    }
    showApplication(user);
  } catch (error) {
    loginStatus.textContent = `No se pudo iniciar sesión: ${error.message}`;
  }
}

function openRegistration() {
  loginStatus.textContent = "";
  if (!loginForm.reportValidity()) {
    return;
  }

  selectedRegistrationAvatar = AVATAR_OPTIONS[0].url;
  renderAvatarGrid(
    registrationAvatarGrid,
    selectedRegistrationAvatar,
    updateRegistrationAvatarSelection,
  );
  registrationStatus.textContent = "";
  registrationEmail.textContent = loginEmail.value.trim();
  loginForm.hidden = true;
  registrationForm.hidden = false;
  registrationName.focus();
}

function updateRegistrationAvatarSelection(avatarUrl) {
  selectedRegistrationAvatar = avatarUrl;
  renderAvatarGrid(
    registrationAvatarGrid,
    selectedRegistrationAvatar,
    updateRegistrationAvatarSelection,
  );
}

async function registerUser(event) {
  event.preventDefault();
  registrationStatus.textContent = "";
  if (!supabaseClient) {
    registrationStatus.textContent =
      "No se pudo conectar con el servicio de autenticación.";
    return;
  }

  if (!loginEmail.checkValidity() || !loginEmail.value.trim() || !loginPassword.value) {
    registrationStatus.textContent =
      "Completa el correo y la contraseña en la pantalla anterior para crear esta cuenta.";
    return;
  }

  const name = registrationName.value.trim();
  if (!name) {
    registrationName.focus();
    return;
  }

  try {
    const email = loginEmail.value.trim().toLocaleLowerCase("es");
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password: loginPassword.value,
      options: {
        data: {
          name,
          avatar: selectedRegistrationAvatar,
          level: registrationLevel.value,
          difficulty: "Normal",
        },
      },
    });
    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Supabase no devolvió la cuenta creada.");
    }

    currentUser = {
      id: data.user.id,
      email: data.user.email || email,
      name,
      avatar: selectedRegistrationAvatar,
      level: registrationLevel.value,
      difficulty: "Normal",
    };
    stories = [];
    createUserDataBoxes(currentUser.id);

    if (!data.session) {
      currentUser = null;
      registrationStatus.textContent =
        "La cuenta se creó. Confirma tu correo electrónico y luego inicia sesión.";
      return;
    }

    try {
      await guardarProgreso({
        perfil: {
          name,
          level: registrationLevel.value,
        },
        avatar: selectedRegistrationAvatar,
        difficulty: "Normal",
      });
    } catch (profileError) {
      console.error("No se pudo guardar el perfil en Supabase:", profileError);
      showApplication(currentUser);
      setPrimaryView("profile-view");
      profileStatus.textContent =
        `La cuenta se creó, pero no se pudo guardar el perfil: ${profileError.message}`;
      return;
    }

    registrationForm.reset();
    showApplication(currentUser);
  } catch (error) {
    registrationStatus.textContent = `No se pudo crear la cuenta: ${error.message}`;
  }
}

function closeRegistration() {
  registrationForm.hidden = true;
  loginForm.hidden = false;
  registrationStatus.textContent = "";
}

function renderAvatarGrid(container, selectedUrl, onSelect) {
  container.replaceChildren();
  AVATAR_OPTIONS.forEach((avatar) => {
    const option = document.createElement("button");
    option.className = "avatar-option";
    option.type = "button";
    option.setAttribute("role", "radio");
    option.setAttribute("aria-label", avatar.label);
    option.setAttribute("aria-checked", String(avatar.url === selectedUrl));
    option.classList.toggle("is-selected", avatar.url === selectedUrl);

    const image = document.createElement("img");
    image.src = avatar.url;
    image.alt = "";
    image.loading = "lazy";
    option.append(image);
    option.addEventListener("click", () => onSelect(avatar.url));
    container.append(option);
  });
}

function renderProfile(user) {
  const avatarUrl = user.avatar || AVATAR_OPTIONS[0].url;
  profileName.textContent = user.name;
  profileNameInput.value = user.name;
  setLevelOptions(profileLevel, user.level);
  profileLevel.value = user.level;
  exerciseDifficulty.value = user.difficulty;
  profileLevelSummary.textContent = `Nivel actual: ${user.level}`;
  profileAvatar.src = avatarUrl;
  profileAvatar.alt = `Avatar de ${user.name}`;
  renderHeaderAvatar(user);
  renderAvatarGrid(profileAvatarGrid, avatarUrl, saveProfileAvatar);
  profileStatus.textContent = "";
}

function renderHeaderAvatar(user) {
  headerAvatar.src = user.avatar || AVATAR_OPTIONS[0].url;
  headerAvatar.alt = `Avatar de ${user.name}`;
}

function availableLevels(currentLevel) {
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel);
  if (currentIndex < 0) {
    return ["A1"];
  }

  const firstIndex = currentIndex >= 2 ? currentIndex - 1 : currentIndex;
  const lastIndex = Math.min(currentIndex + 1, LEVEL_ORDER.length - 1);
  return LEVEL_ORDER.slice(firstIndex, lastIndex + 1);
}

function setLevelOptions(select, currentLevel) {
  const levels = availableLevels(currentLevel);
  select.replaceChildren(
    ...levels.map((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      return option;
    }),
  );
  select.value = levels.includes(currentLevel) ? currentLevel : levels[0];
}

function setAllLevelOptions(select, selectedLevel) {
  select.replaceChildren(
    ...LEVEL_ORDER.map((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      return option;
    }),
  );
  select.value = LEVEL_CONFIG[selectedLevel] ? selectedLevel : LEVEL_ORDER[0];
}

async function saveProfileAvatar(avatarUrl) {
  if (!currentUser || !AVATAR_OPTIONS.some((avatar) => avatar.url === avatarUrl)) {
    profileStatus.textContent = "Selecciona un avatar disponible.";
    return;
  }

  try {
    const updatedUser = { ...currentUser, avatar: avatarUrl };
    await guardarProgreso({
      perfil: {
        name: updatedUser.name,
        level: updatedUser.level,
      },
      avatar: updatedUser.avatar,
      difficulty: updatedUser.difficulty,
    });
    currentUser = updatedUser;
    profileAvatar.src = avatarUrl;
    profileAvatar.alt = `Avatar de ${updatedUser.name}`;
    renderHeaderAvatar(updatedUser);
    renderAvatarGrid(profileAvatarGrid, avatarUrl, saveProfileAvatar);
    profileAvatarPicker.hidden = true;
    changeAvatarButton.setAttribute("aria-expanded", "false");
    profileStatus.textContent = "Avatar actualizado correctamente.";
  } catch (error) {
    profileStatus.textContent = `No se pudo guardar el avatar: ${error.message}`;
  }
}

function getVaultStorageKey() {
  return `${VAULT_STORAGE_KEY}.${currentUser.id}`;
}

function getVaultSpeedStorageKey() {
  return `${VAULT_SPEED_STORAGE_KEY}.${currentUser.id}`;
}

function getStoriesStorageKey() {
  return userStoriesStorageKey(currentUser.id);
}

function getReadStoriesStorageKey() {
  return `${READ_STORIES_STORAGE_KEY}.${currentUser.id}`;
}

function loadReadStoryIds() {
  if (!currentUser) {
    throw new Error("No se encontró el usuario actual.");
  }

  const storedIds = readUserScopedValue(
    READ_STORIES_STORAGE_KEY,
    getReadStoriesStorageKey(),
  );
  if (storedIds === null) {
    return [];
  }

  const parsedIds = JSON.parse(storedIds);
  if (!Array.isArray(parsedIds) || !parsedIds.every((id) => typeof id === "string")) {
    throw new Error("El registro de historias leídas tiene un formato no válido.");
  }
  return [...new Set(parsedIds)];
}

function markStoryAsRead(storyId) {
  if (!currentUser) {
    return;
  }

  try {
    const readStoryIds = loadReadStoryIds();
    if (!readStoryIds.includes(storyId)) {
      window.localStorage.setItem(
        getReadStoriesStorageKey(),
        JSON.stringify([...readStoryIds, storyId]),
      );
    }
  } catch (error) {
    progressStatus.textContent = `No se pudo registrar la lectura: ${error.message}`;
  }
}

function isCorrectionVocabularyCard(card) {
  return (
    card.tipo === "correccion" ||
    /^pregunta(?:\s+\d+)?$/i.test(card.palabra.trim()) ||
    /^\s*(?:corrección|correction)\s*:/i.test(card.contexto) ||
    /^\s*(?:corrección|correction)\s*:/i.test(card.traduccion)
  );
}

function updateProgress() {
  progressStatus.textContent = "";
  let readCount = 0;
  try {
    const readIds = loadReadStoryIds();
    const existingStoryIds = new Set(stories.map((story) => story.id));
    readCount = readIds.filter((id) => existingStoryIds.has(id)).length;
  } catch (error) {
    progressStatus.textContent = `No se pudo cargar el progreso de lectura: ${error.message}`;
  }

  const goalProgress = Math.min(readCount, STORY_PROGRESS_GOAL);
  const percentage = Math.round((goalProgress / STORY_PROGRESS_GOAL) * 100);
  progressStoriesCount.textContent = `${goalProgress} de ${STORY_PROGRESS_GOAL}`;
  progressStoriesTrack.setAttribute("aria-valuenow", String(goalProgress));
  progressStoriesTrack.setAttribute(
    "aria-valuetext",
    `${goalProgress} de ${STORY_PROGRESS_GOAL} historias leídas`,
  );
  progressStoriesBar.style.width = `${percentage}%`;
  progressStoriesCaption.textContent =
    `Has leído ${readCount} ${readCount === 1 ? "historia" : "historias"}.`;

  if (!loadVocabularyCards()) {
    progressStatus.textContent = vaultStatus.textContent;
    progressVocabularyCount.textContent = "—";
    progressVocabularyCaption.textContent = "No se pudieron cargar las tarjetas.";
    progressCorrectionsCount.textContent = "—";
    progressCorrectionsCaption.textContent = "No se pudieron cargar las tarjetas.";
    progressImprovementsText.textContent =
      "No se pudieron analizar tus áreas de mejora porque falló la carga del Baúl.";
    return;
  }

  const correctionsCount = vocabularyCards.filter(isCorrectionVocabularyCard).length;
  const vocabularyCount = vocabularyCards.length - correctionsCount;
  progressVocabularyCount.textContent = String(vocabularyCount);
  progressVocabularyCaption.textContent =
    `Has aprendido ${vocabularyCount} ${vocabularyCount === 1 ? "palabra" : "palabras"}.`;
  progressCorrectionsCount.textContent = String(correctionsCount);
  progressCorrectionsCaption.textContent =
    `Has corregido ${correctionsCount} ${correctionsCount === 1 ? "error" : "errores"}.`;

  if (correctionsCount > vocabularyCount) {
    progressImprovementsText.textContent =
      "Has guardado más correcciones que palabras nuevas. Practica con frecuencia las tarjetas del Baúl para afianzar tus aprendizajes.";
  } else if (readCount >= 3 && vocabularyCount < readCount) {
    progressImprovementsText.textContent =
      "Has leído varias historias y guardado poco vocabulario. Al leer, toca las palabras nuevas y guarda las que quieras repasar en el Baúl.";
  } else {
    progressImprovementsText.textContent =
      "Sigue leyendo historias, guardando palabras nuevas y repasando tus tarjetas para mantener un buen equilibrio.";
  }
}

function isStoredVocabularyCard(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.palabra === "string" &&
    typeof value.traduccion === "string" &&
    typeof value.contexto === "string" &&
    (value.contextoEspanol === undefined || typeof value.contextoEspanol === "string") &&
    (value.velocidad === undefined || VAULT_PLAYBACK_RATES.includes(value.velocidad))
  );
}

function loadVocabularyCards() {
  try {
    const storedCards = readUserScopedValue(
      VAULT_STORAGE_KEY,
      getVaultStorageKey(),
    );
    if (storedCards === null) {
      vocabularyCards = [];
      vaultStatus.textContent = "";
      return true;
    }

    const parsedCards = JSON.parse(storedCards);
    if (!Array.isArray(parsedCards) || !parsedCards.every(isStoredVocabularyCard)) {
      throw new Error("Las tarjetas guardadas no tienen el formato esperado.");
    }
    vocabularyCards = parsedCards;
    vaultStatus.textContent = "";
    return true;
  } catch (error) {
    vaultStatus.textContent = `No se pudo cargar el Baúl: ${error.message}`;
    return false;
  }
}

function loadVaultPlaybackRate() {
  try {
    const storedRate = readUserScopedValue(
      VAULT_SPEED_STORAGE_KEY,
      getVaultSpeedStorageKey(),
    );
    const parsedRate = storedRate === null ? 0.75 : Number(storedRate);
    if (!VAULT_PLAYBACK_RATES.includes(parsedRate)) {
      throw new Error("La velocidad guardada no es válida.");
    }
    vaultPlaybackRate = parsedRate;
    vaultSpeedButtons.forEach((button) => {
      const selected = Number(button.dataset.rate) === vaultPlaybackRate;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    return true;
  } catch (error) {
    vaultStatus.textContent = `No se pudo cargar la velocidad del Baúl: ${error.message}`;
    return false;
  }
}

function saveVocabularyCards(updatedCards) {
  try {
    window.localStorage.setItem(getVaultStorageKey(), JSON.stringify(updatedCards));
    vocabularyCards = updatedCards;
    vaultStatus.textContent = "";
    return true;
  } catch (error) {
    vaultStatus.textContent = `No se pudieron guardar las tarjetas: ${error.message}`;
    modalSaveStatus.textContent = `No se pudo guardar en el Baúl: ${error.message}`;
    return false;
  }
}

function renderVault() {
  loadVocabularyCards();
  vaultList.replaceChildren();

  if (vocabularyCards.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-library";
    emptyMessage.textContent = "Aquí se guardarán tus frases";
    vaultList.append(emptyMessage);
    return;
  }

  vocabularyCards.forEach((card) => {
    const item = document.createElement("li");
    item.className = "vault-card";

    const heading = document.createElement("div");
    heading.className = "vault-card-heading";
    const vocabulary = document.createElement("div");
    vocabulary.className = "vault-vocabulary";
    const word = document.createElement("h2");
    word.className = "vault-word";
    word.textContent = card.palabra;
    const translation = document.createElement("p");
    translation.className = "vault-translation";
    translation.textContent = card.traduccion;
    vocabulary.append(word, translation);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "X";
    deleteButton.setAttribute("aria-label", `Eliminar tarjeta: ${card.palabra}`);
    heading.append(vocabulary, deleteButton);

    const contextLabel = document.createElement("span");
    contextLabel.className = "vault-context-label";
    contextLabel.textContent = "CONTEXTO";
    const context = document.createElement("p");
    context.className = "vault-context";
    context.lang = "fr";
    context.textContent = card.contexto;

    const translationToggle = document.createElement("button");
    translationToggle.className = "vault-translation-toggle";
    translationToggle.type = "button";
    translationToggle.textContent = "Ver Traducción";
    translationToggle.setAttribute("aria-expanded", "false");
    const translatedContext = document.createElement("p");
    translatedContext.className = "vault-context-translation";
    translatedContext.lang = "es";
    translatedContext.hidden = true;

    const actions = document.createElement("div");
    actions.className = "vault-card-actions";
    const listenButton = document.createElement("button");
    listenButton.className = "vault-listen-button";
    listenButton.type = "button";
    listenButton.textContent = "Écouter";
    listenButton.setAttribute("aria-label", `Escuchar frase: ${card.contexto}`);
    const speechStatus = document.createElement("span");
    speechStatus.className = "vault-speech-status";
    speechStatus.setAttribute("role", "status");
    speechStatus.setAttribute("aria-live", "polite");
    actions.append(listenButton, speechStatus);

    listenButton.addEventListener("click", () => {
      speakVaultContext(card.contexto, listenButton, speechStatus);
    });
    translationToggle.addEventListener("click", async () => {
      if (!translatedContext.hidden) {
        translatedContext.hidden = true;
        translationToggle.textContent = "Ver Traducción";
        translationToggle.setAttribute("aria-expanded", "false");
        return;
      }

      translationToggle.disabled = true;
      translationToggle.textContent = "Buscando traducción…";
      if (card.contextoEspanol) {
        translatedContext.textContent = card.contextoEspanol;
      } else {
        try {
          const fullTranslation = findStoryContextTranslation(card.contexto);
          const translation =
            fullTranslation || (await fetchMyMemoryTranslation(card.contexto));
          const updatedCards = vocabularyCards.map((itemCard) =>
            itemCard.id === card.id
              ? { ...itemCard, contextoEspanol: translation }
              : itemCard,
          );
          if (!saveVocabularyCards(updatedCards)) {
            throw new Error(vaultStatus.textContent);
          }
          translatedContext.textContent = translation;
        } catch {
          translatedContext.textContent = "Traducción no disponible";
        }
      }

      translatedContext.hidden = false;
      translationToggle.textContent = "Ocultar Traducción";
      translationToggle.setAttribute("aria-expanded", "true");
      translationToggle.disabled = false;
    });
    deleteButton.addEventListener("click", () => {
      const updatedCards = vocabularyCards.filter((itemCard) => itemCard.id !== card.id);
      if (saveVocabularyCards(updatedCards)) {
        renderVault();
      }
    });

    item.append(
      heading,
      contextLabel,
      context,
      translationToggle,
      translatedContext,
      actions,
    );
    vaultList.append(item);
  });
}

function speakVaultContext(context, button, status) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    status.textContent = "La síntesis vocal no está disponible.";
    return;
  }

  if (activeVaultSpeech?.button === button) {
    window.speechSynthesis.cancel();
    activeVaultSpeech = null;
    button.textContent = "Écouter";
    status.textContent = "";
    return;
  }

  if (activeVaultSpeech) {
    activeVaultSpeech.button.textContent = "Écouter";
    activeVaultSpeech.status.textContent = "";
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(context);
  utterance.lang = "fr-FR";
  utterance.rate = vaultPlaybackRate;
  const speech = { button, status, utterance };
  activeVaultSpeech = speech;
  button.textContent = "Arrêter";
  status.textContent = "Lecture en cours…";

  const finishSpeech = () => {
    if (activeVaultSpeech !== speech) {
      return;
    }
    activeVaultSpeech = null;
    button.textContent = "Écouter";
    status.textContent = "";
  };

  utterance.addEventListener("end", finishSpeech);
  utterance.addEventListener("error", (event) => {
    if (activeVaultSpeech !== speech) {
      return;
    }
    activeVaultSpeech = null;
    button.textContent = "Écouter";
    status.textContent =
      event.error === "canceled" || event.error === "interrupted"
        ? ""
        : `La lectura falló: ${event.error}.`;
  });
  window.speechSynthesis.speak(utterance);
}

function isStoredStory(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.tema === "string" &&
    typeof value.nivel === "string" &&
    typeof value.tipo === "string" &&
    typeof value.textoFrances === "string" &&
    typeof value.textoEspanol === "string" &&
    (value.advertencia === undefined || typeof value.advertencia === "string") &&
    (value.demasiadoCorta === undefined ||
      typeof value.demasiadoCorta === "boolean")
  );
}

async function loadStories(profile = null) {
  if (!currentUser) {
    throw new Error("No hay una sesión activa.");
  }

  const progress = profile || (await cargarProgreso());
  const cloudStories = progress?.historias ?? [];
  if (!Array.isArray(cloudStories) || !cloudStories.every(isStoredStory)) {
    throw new Error("Las historias de Supabase no tienen el formato esperado.");
  }

  const legacyValue = readUserScopedValue(STORAGE_KEY, getStoriesStorageKey());
  const legacyStories = legacyValue === null ? [] : JSON.parse(legacyValue);
  if (!Array.isArray(legacyStories) || !legacyStories.every(isStoredStory)) {
    throw new Error("Las historias guardadas localmente no tienen el formato esperado.");
  }

  const knownIds = new Set(cloudStories.map((story) => story.id));
  const migratedStories = legacyStories.filter((story) => !knownIds.has(story.id));
  stories = [...cloudStories, ...migratedStories];
  if (migratedStories.length > 0 || !Array.isArray(progress?.historias)) {
    await guardarProgreso({ historias: stories });
  }
  window.localStorage.removeItem(getStoriesStorageKey());
  storageError = "";
  return stories;
}

async function saveStories(updatedStories) {
  try {
    if (!currentUser) {
      throw new Error("No hay una sesión activa.");
    }
    if (!Array.isArray(updatedStories) || !updatedStories.every(isStoredStory)) {
      throw new Error("La lista de historias no tiene el formato esperado.");
    }
    await guardarProgreso({ historias: updatedStories });
    storageError = "";
    return true;
  } catch (error) {
    formStatus.textContent = `No se pudo guardar la historia: ${error.message}`;
    libraryStatus.textContent = `No se pudieron actualizar las historias: ${error.message}`;
    return false;
  }
}

function countWords(text) {
  const trimmedText = text.trim();
  return trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;
}

function normalizeWord(word) {
  return word
    .toLocaleLowerCase("fr-FR")
    .replace(/[’]/g, "'")
    .replace(/^[^\p{L}']+|[^\p{L}']+$/gu, "");
}

async function fetchMyMemoryTranslation(text) {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", "fr|es");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`La API respondió con el estado ${response.status}.`);
  }

  const result = await response.json();
  const translation = result.responseData?.translatedText?.trim();
  if (result.responseStatus !== 200 || !translation) {
    throw new Error("La API no devolvió una traducción.");
  }
  return translation;
}

async function translateWord(word, requestId) {
  modalMeaning.textContent = "Buscando traducción…";

  try {
    const translation = await fetchMyMemoryTranslation(word);

    if (requestId === translationRequestId && wordModal.open) {
      modalMeaning.textContent = translation;
      selectedVocabularyCard.traduccion = translation;
      saveWordButton.disabled = false;
    }
  } catch {
    if (requestId === translationRequestId && wordModal.open) {
      modalMeaning.textContent = "Traducción no disponible";
      selectedVocabularyCard.traduccion = "";
      saveWordButton.disabled = true;
    }
  }
}

function findWordContext(storyText, word) {
  const sentences = storyText.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [storyText];
  return (
    sentences.find((sentence) =>
      sentence.split(/\s+/).some((part) => normalizeWord(part) === word),
    )?.trim() || storyText
  );
}

function splitSentences(text) {
  return text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g)?.map((sentence) => sentence.trim()) || [];
}

function findStoryContextTranslation(context) {
  if (!currentStory) {
    return "";
  }

  const frenchSentences = splitSentences(currentStory.textoFrances);
  const sentenceIndex = frenchSentences.findIndex((sentence) => sentence === context);
  if (sentenceIndex < 0) {
    return "";
  }
  return splitSentences(currentStory.textoEspanol)[sentenceIndex] || "";
}

function renderInteractiveStory(text) {
  const fragment = document.createDocumentFragment();
  const parts = text.split(/(\s+)/);

  parts.forEach((part) => {
    if (/^\s+$/.test(part)) {
      fragment.append(document.createTextNode(part));
      return;
    }

    const wordButton = document.createElement("button");
    wordButton.className = "word-button";
    wordButton.type = "button";
    wordButton.textContent = part;
    const normalizedWord = normalizeWord(part);
    wordButton.setAttribute(
      "aria-label",
      `${part}, consultar significado`,
    );
    wordButton.addEventListener("click", () => {
      const word = normalizedWord || part;
      const context = findWordContext(text, word);
      selectedVocabularyCard = {
        palabra: word,
        traduccion: "",
        contexto: context,
        contextoEspanol: findStoryContextTranslation(context),
      };
      modalWord.textContent = word;
      modalSaveStatus.textContent = "";
      saveWordButton.textContent = "Guardar en Baúl";
      saveWordButton.disabled = true;
      const requestId = ++translationRequestId;
      wordModal.showModal();
      translateWord(word, requestId);
    });
    fragment.append(wordButton);
  });

  frenchStory.replaceChildren(fragment);
}

async function createStory(theme, level, type) {
  const validTypes = [
    "Narración",
    "Diálogo",
    "Situación cotidiana",
    "Noticia",
  ];
  const levelRules = LEVEL_CONFIG[level];
  if (!levelRules || !validTypes.includes(type)) {
    throw new Error("El tipo o nivel seleccionado no es válido.");
  }

  const previousStories = stories
    .slice(0, 5)
    .map(
      (story, index) =>
        `${index + 1}. Tema: ${story.tema}; tipo: ${story.tipo}\n${story.textoFrances.slice(0, 1600)}`,
    )
    .join("\n\n");
  const previousContext = previousStories
    ? `Historias anteriores. No reutilices sus personajes, sucesos, frases ni estructuras:\n${previousStories}`
    : "No hay historias anteriores.";
  const storyText = await requestGeminiText(
    "Eres un escritor creativo de historias en francés. " +
      `Escribe una historia completamente original en francés sobre ${theme} para el nivel ${level}. ` +
      `La historia debe ser concisa y coherente. No repitas frases. Escribe de forma natural. ` +
      `Tipo: ${type}. Usa ${levelRules.guidance}. ` +
      "Desarrolla un inicio, un nudo y un desenlace claros, sin frases de relleno. " +
      `${previousContext}\n\n` +
      "Devuelve únicamente un JSON válido con las propiedades textoFrances y " +
      "textoEspanol; la primera debe contener la historia en francés y la segunda " +
      "su traducción natural al español.",
    {
      generationConfig: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: "MINIMAL" },
      },
    },
  );

  let generated;
  try {
    generated = JSON.parse(storyText);
  } catch {
    throw new Error("Gemini no devolvió una historia en formato JSON válido.");
  }
  if (
    typeof generated.textoFrances !== "string" ||
    !generated.textoFrances.trim() ||
    typeof generated.textoEspanol !== "string" ||
    !generated.textoEspanol.trim()
  ) {
    throw new Error("Gemini devolvió una historia incompleta.");
  }

  const frenchText = generated.textoFrances.trim();
  const storyWordCount = frenchText.replace(/\s+/g, " ").split(" ").length;
  const lengthWarning =
    storyWordCount < levelRules.words * 0.95 ||
    storyWordCount > levelRules.words * 1.05
      ? `Nota: La historia tiene ${storyWordCount} palabras (objetivo: ${levelRules.words}). Puedes practicar con ella igualmente.`
      : "";

  if (
    frenchText.toLocaleLowerCase("fr-FR").includes("la journée est belle") ||
    hasRepeatedLongSentence(frenchText)
  ) {
    throw new Error(
      "La historia se ha generado con errores. Por favor, intenta de nuevo",
    );
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    tema: theme,
    nivel: level,
    tipo: type,
    textoFrances: frenchText,
    textoEspanol: generated.textoEspanol.trim(),
    ...(lengthWarning ? { advertencia: lengthWarning } : {}),
    ...(storyWordCount < levelRules.words * 0.7
      ? { demasiadoCorta: true }
      : {}),
  };
}

function hasRepeatedLongSentence(text) {
  const sentenceCounts = new Map();
  const sentences = text.match(/[^.!?…]+[.!?…]?/gu) || [];
  for (const sentence of sentences) {
    const normalized = sentence
      .toLocaleLowerCase("fr-FR")
      .replace(/[^\p{L}\p{N}\s']/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!normalized || normalized.split(/\s+/).length <= 5) {
      continue;
    }
    const count = (sentenceCounts.get(normalized) || 0) + 1;
    if (count > 2) {
      return true;
    }
    sentenceCounts.set(normalized, count);
  }
  return false;
}

function setMainTab(selectedTab) {
  const showCreate = selectedTab === "create";
  createTab.classList.toggle("is-active", showCreate);
  libraryTab.classList.toggle("is-active", !showCreate);
  createTab.setAttribute("aria-selected", String(showCreate));
  libraryTab.setAttribute("aria-selected", String(!showCreate));
  createPanel.hidden = !showCreate;
  libraryPanel.hidden = showCreate;
}

function setPrimaryView(viewId) {
  if (viewId !== "julie-view") {
    activePronunciationPractice = null;
    julieChatHistory
      .querySelectorAll(".julie-pronunciation-target.is-practicing")
      .forEach((element) => element.classList.remove("is-practicing"));
    stopJulieRecognition();
    stopJulieSpeech();
  }

  if (viewId === "build-view") {
    const story = getBuildStory();
    buildStoryContext.textContent = story
      ? `Historia seleccionada: ${story.tema}`
      : "Crea una historia en Historias para poder practicar aquí.";
  }

  if (viewId === "progress-view") {
    updateProgress();
  }

  if (viewId === "profile-view") {
    if (!currentUser) {
      currentUser = null;
      application.hidden = true;
      loginView.hidden = false;
      return;
    }
    renderProfile(currentUser);
  }

  if (viewId === "vault-view" && currentUser) {
    loadVaultPlaybackRate();
    renderVault();
  }

  primaryViews.forEach((view) => {
    view.hidden = view.id !== viewId;
  });
  primaryTabs.forEach((tab) => {
    const selected = tab.dataset.view === viewId;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
}

function setReaderTab(selectedTab) {
  const showAudio = selectedTab === "audio";
  const showReading = selectedTab === "reading";
  audioTab.classList.toggle("is-active", showAudio);
  readingTab.classList.toggle("is-active", showReading);
  questionsTab.classList.toggle("is-active", !showAudio && !showReading);
  audioTab.setAttribute("aria-selected", String(showAudio));
  readingTab.setAttribute("aria-selected", String(showReading));
  questionsTab.setAttribute("aria-selected", String(!showAudio && !showReading));
  audioPanel.hidden = !showAudio;
  readingPanel.hidden = !showReading;
  questionsPanel.hidden = showAudio || showReading;
}

function renderStories() {
  storyList.replaceChildren();
  storyCount.textContent = String(stories.length);
  libraryStatus.textContent = storageError;

  if (stories.length === 0 && !storageError) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-library";
    emptyMessage.textContent = "Todavía no tienes historias. ¡Crea la primera!";
    storyList.append(emptyMessage);
    return;
  }

  stories.forEach((story) => {
    const item = document.createElement("li");
    item.className = "story-item";

    const openButton = document.createElement("button");
    openButton.className = "story-open";
    openButton.type = "button";
    openButton.setAttribute("aria-label", `Abrir historia: ${story.tema}`);

    const title = document.createElement("span");
    title.className = "story-item-title";
    title.textContent = story.tema;

    const details = document.createElement("span");
    details.className = "story-item-details";
    details.textContent = [
      `${story.nivel} · ${countWords(story.textoFrances)} palabras · ${story.tipo}`,
      story.advertencia || "",
    ]
      .filter(Boolean)
      .join(" · ");

    openButton.append(title, details);
    openButton.addEventListener("click", () => openStory(story));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "X";
    deleteButton.setAttribute("aria-label", `Eliminar historia: ${story.tema}`);
    deleteButton.addEventListener("click", async () => {
      const updatedStories = stories.filter((itemStory) => itemStory.id !== story.id);
      deleteButton.disabled = true;
      if (await saveStories(updatedStories)) {
        renderStories();
      } else {
        deleteButton.disabled = false;
      }
    });

    item.append(openButton, deleteButton);
    storyList.append(item);
  });
}

function openStory(story) {
  currentStory = story;
  markStoryAsRead(story.id);
  readerTitle.textContent = story.tema;
  readerSummary.textContent = [
    story.nivel,
    story.tipo,
    story.advertencia || "",
  ]
    .filter(Boolean)
    .join(" · ");
  renderInteractiveStory(story.textoFrances);
  spanishTranslation.textContent = story.textoEspanol;
  translationContainer.hidden = true;
  translationToggle.textContent = "Mostrar Traducción";
  translationToggle.setAttribute("aria-expanded", "false");
  wordCountLabel.textContent = `${countWords(story.textoFrances)} PALABRAS`;
  setReaderTab("reading");
  primaryNav.hidden = true;
  mainView.hidden = true;
  readerView.hidden = false;
  loadQuestionsForStory(story);
}

async function checkQuestionAnswer(question, answer, status, nextButton) {
  status.textContent = "Julie está evaluando tu respuesta…";
  status.className = "question-status";
  nextButton.hidden = true;

  try {
    const result = await fetchGeminiAnswer(currentStory, question, answer);
    if (result.correcto) {
      status.textContent = "Respuesta correcta. ¡Bien hecho!";
      status.className = "question-status is-success";
    } else {
      status.replaceChildren();
      status.append(
        document.createTextNode(
          `Respuesta incorrecta. Corrección: ${result.correccion} Frase en francés: `,
        ),
      );
      const frenchAnswer = document.createElement("strong");
      frenchAnswer.textContent = result.fraseFrances;
      status.append(frenchAnswer);
      status.className = "question-status is-error is-correction";
    }
    nextButton.hidden = false;
    return result;
  } catch (error) {
    console.error("No se pudo evaluar la respuesta con Julie:", error);
    status.textContent = "No se pudo evaluar la respuesta. Comprueba tu conexión e inténtalo de nuevo.";
    status.className = "question-status is-error";
    return null;
  }
}

async function fetchGeminiAnswer(story, question, answer) {
  const prompt =
    "Actúa como un profesor de francés y evalúa la respuesta del estudiante. " +
    "Decide si responde correctamente a la pregunta según la historia; acepta " +
    "respuestas equivalentes aunque no usen las mismas palabras. Devuelve solo " +
    'un objeto JSON con este formato exacto: {"correcto": true, "correccion": "...", "frase_frances": "..."}. ' +
    "Si es incorrecta, escribe en correccion una explicación breve en español, " +
    "y en frase_frances la respuesta correcta o frase completa en francés. Si es " +
    "correcta, usa una felicitación breve en francés en correccion y deja frase_frances " +
    "como una cadena vacía.\n\n" +
    `Historia:\n${story.textoFrances}\n\nPregunta:\n${question}\n\n` +
    `Respuesta del estudiante:\n${answer}`;
  const responseText = await requestGeminiText(prompt, {
    generationConfig: { responseMimeType: "application/json" },
  });

  let evaluation;
  try {
    evaluation = JSON.parse(responseText);
  } catch {
    throw new Error("Gemini no devolvió un objeto JSON válido.");
  }
  if (
    typeof evaluation.correcto !== "boolean" ||
    typeof evaluation.correccion !== "string" ||
    evaluation.correccion.trim().length === 0 ||
    typeof evaluation.frase_frances !== "string" ||
    (!evaluation.correcto && evaluation.frase_frances.trim().length === 0)
  ) {
    throw new Error("Gemini devolvió una evaluación incompleta.");
  }

  return {
    correcto: evaluation.correcto,
    correccion: evaluation.correccion.trim(),
    fraseFrances: evaluation.frase_frances.trim(),
  };
}

async function requestGeminiText(prompt, options = {}) {
  const requestBody = {
    systemInstruction: options.systemInstruction,
    generationConfig: options.generationConfig,
  };
  if (options.contents) {
    requestBody.contents = options.contents;
  } else {
    requestBody.prompt = prompt;
  }

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("El servicio de IA devolvió una respuesta no válida.");
  }

  if (!response.ok) {
    throw new Error(
      payload.error || `El servicio de Julie respondió con HTTP ${response.status}.`,
    );
  }
  if (typeof payload.text !== "string" || payload.text.trim().length === 0) {
    throw new Error("El servicio de IA devolvió una respuesta vacía.");
  }
  return payload.text.trim();
}

function getBuildStory() {
  return (
    (currentStory && stories.find((story) => story.id === currentStory.id)) ||
    stories[0] ||
    null
  );
}

function showBuildFeedback(title, message, type) {
  buildFeedbackTitle.textContent = title;
  buildFeedbackText.textContent = message;
  buildFeedback.className = `build-feedback is-${type}`;
  buildFeedback.hidden = false;
}

function appendJulieMessage(role, text) {
  const isStudent = role === "user";
  const message = document.createElement("p");
  message.className = `julie-chat-bubble is-${isStudent ? "student" : "julie"}`;
  message.textContent = text;
  julieChatHistory.append(message);
  julieChatHistory.scrollTop = julieChatHistory.scrollHeight;
  return message;
}

function appendSlowCorrectionButton(phrase) {
  const button = document.createElement("button");
  button.className = "julie-slow-correction-button";
  button.type = "button";
  button.textContent = "Escuchar corrección lenta";
  button.addEventListener("click", () => {
    speakJulieReply(phrase, 0.6);
  });
  julieChatHistory.append(button);
  julieChatHistory.scrollTop = julieChatHistory.scrollHeight;
}

function appendPronunciationPractice(target) {
  const phrase = document.createElement("p");
  phrase.className = "julie-pronunciation-target";
  phrase.textContent = target;

  const button = document.createElement("button");
  button.className = "julie-practice-pronunciation-button";
  button.type = "button";
  button.textContent = "🎤 Practicar esta palabra";
  button.setAttribute("aria-label", `Practicar pronunciación: ${target}`);
  button.addEventListener("click", () => {
    julieChatHistory
      .querySelectorAll(".julie-pronunciation-target.is-practicing")
      .forEach((element) => element.classList.remove("is-practicing"));
    const practice = { target };
    activePronunciationPractice = practice;
    phrase.classList.add("is-practicing");
    julieChatStatus.textContent = "";
    void runPronunciationPractice(practice, phrase);
  });

  julieChatHistory.append(phrase, button);
  julieChatHistory.scrollTop = julieChatHistory.scrollHeight;
}

function updateJulieControls() {
  const isListening = julieRecognition !== null;
  const micBlocked = isJulieSpeaking || isJulieReplyPending;
  julieMicrophoneButton.disabled = micBlocked;
  julieMicrophoneButton.classList.toggle("is-listening", isListening);
  julieMicrophoneButton.setAttribute("aria-pressed", String(isListening));
  julieMicrophoneButton.setAttribute(
    "aria-label",
    isListening ? "Detener reconocimiento de voz" : "Hablar en francés",
  );
  julieMicrophoneLabel.textContent = isListening ? "Escuchando…" : "Hablar";
  julieSendButton.disabled = isJulieReplyPending;
  julieMessage.disabled = isJulieReplyPending;
  julieChatHistory
    .querySelectorAll(
      ".julie-slow-correction-button, .julie-practice-pronunciation-button",
    )
    .forEach((button) => {
      button.disabled = micBlocked;
    });
}

function stopJulieRecognition() {
  if (!julieRecognition) {
    return;
  }

  const recognition = julieRecognition;
  julieRecognition = null;
  try {
    recognition.stop();
  } catch (error) {
    console.error("No se pudo detener el reconocimiento de voz:", error);
  }
  updateJulieControls();
}

function stopJulieSpeech() {
  if (!isJulieSpeaking || !("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  isJulieSpeaking = false;
  updateJulieControls();
}

async function requestJulieReply(userMessage, isDictation) {
  const systemPrompt =
    "Eres Julie, una profesora de francés amable y paciente. Habla con el " +
    "estudiante en francés (nivel principiante) para practicar. Corrige sus " +
    "errores suavemente y hazle preguntas para mantener la conversación. Si " +
    "corriges una frase o el estudiante pide que la repitas, incluye la frase " +
    "francesa correcta en el campo phrase_corrigee. Devuelve siempre únicamente " +
    'un objeto JSON con el formato {"reponse": "Tu respuesta en francés", "phrase_corrigee": ""}. ' +
    "Deja phrase_corrigee vacío si no hay frase que corregir ni repetir. Para " +
    "incluir comillas dobles dentro de los valores JSON, escápalas correctamente.";
  const userPrompt = isDictation
    ? "El estudiante intentó decir esta frase: " +
      `${userMessage}. Compara si es correcto en francés. Si hay errores de ` +
      "pronunciación o gramática, corrígelo de forma amable y sugiérele que repita " +
      "la frase correcta lentamente. Si es perfecto, felicítalo y sigue la conversación."
    : userMessage;
  const contents = [
    ...julieConversation,
    { role: "user", parts: [{ text: userPrompt }] },
  ];
  const responseText = await requestGeminiText("", {
    systemInstruction: systemPrompt,
    contents,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  let reply;
  try {
    reply = JSON.parse(responseText);
  } catch {
    throw new Error("Julie no devolvió una respuesta JSON válida.");
  }
  if (
    typeof reply.reponse !== "string" ||
    reply.reponse.trim().length === 0 ||
    typeof reply.phrase_corrigee !== "string"
  ) {
    throw new Error("Julie devolvió una respuesta incompleta.");
  }
  return {
    reply: reply.reponse.trim(),
    correctedPhrase: reply.phrase_corrigee.trim(),
    userPrompt,
  };
}

function cleanMarkdownForSpeech(text) {
  return text
    .replace(/```[\s\S]*?```/g, (block) =>
      block.replace(/```[\w-]*\s?|```/g, " "),
    )
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s?|[-+*]\s+|\d+[.)]\s+)/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/[*_~#>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function speakJulieReply(text, rate = julieSelectedRate) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    julieChatStatus.textContent =
      "La síntesis de voz no está disponible en este navegador.";
    return Promise.resolve();
  }

  stopJulieRecognition();
  window.speechSynthesis.cancel();
  const speechText = cleanMarkdownForSpeech(text);
  if (!speechText) {
    return Promise.resolve();
  }
  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.lang = "fr-FR";
  utterance.rate = rate;

  return new Promise((resolve) => {
    let finished = false;
    const finish = (error) => {
      if (finished) {
        return;
      }
      finished = true;
      isJulieSpeaking = false;
      if (error && error !== "canceled" && error !== "interrupted") {
        julieChatStatus.textContent = `La lectura de Julie falló: ${error}.`;
      }
      updateJulieControls();
      resolve();
    };

    utterance.addEventListener("start", () => {
      isJulieSpeaking = true;
      julieChatStatus.textContent = "Julie está hablando…";
      updateJulieControls();
    });
    utterance.addEventListener("end", () => finish(""));
    utterance.addEventListener("error", (event) => finish(event.error));
    isJulieSpeaking = true;
    julieChatStatus.textContent = "Julie está hablando…";
    updateJulieControls();
    window.speechSynthesis.speak(utterance);
  });
}

async function sendJulieMessage(message) {
  if (isJulieReplyPending) {
    return;
  }

  const wasDictation = julieDictationPending;
  julieDictationPending = false;
  isJulieReplyPending = true;
  julieChatStatus.textContent = "Julie está preparando su respuesta…";
  updateJulieControls();
  appendJulieMessage("user", message);

  try {
    const response = await requestJulieReply(message, wasDictation);
    julieConversation = [
      ...julieConversation,
      { role: "user", parts: [{ text: response.userPrompt }] },
      {
        role: "model",
        parts: [{
          text: response.correctedPhrase
            ? `${response.reply}\nPhrase corrigée : ${response.correctedPhrase}`
            : response.reply,
        }],
      },
    ];
    appendJulieMessage("model", response.reply);
    if (response.correctedPhrase) {
      appendSlowCorrectionButton(response.correctedPhrase);
    }
    const pronunciationTarget =
      response.correctedPhrase || (wasDictation ? message : "");
    if (pronunciationTarget) {
      appendPronunciationPractice(pronunciationTarget);
    }
    if (julieMessage.value.trim() === message) {
      julieMessage.value = "";
    }
    julieChatStatus.textContent = "";
    if (!julieView.hidden) {
      await speakJulieReply(response.reply);
    }
  } catch (error) {
    console.error("No se pudo completar el chat con Julie:", error);
    julieChatStatus.textContent =
      "No se pudo conectar con Julie. Comprueba tu conexión y vuelve a intentarlo.";
  } finally {
    isJulieReplyPending = false;
    updateJulieControls();
  }
}

function startJulieRecognition() {
  if (isJulieSpeaking || isJulieReplyPending) {
    return;
  }

  if (activePronunciationPractice) {
    activePronunciationPractice = null;
    stopJulieRecognition();
    julieChatStatus.textContent = "Práctica de pronunciación detenida.";
    return;
  }

  if (julieRecognition) {
    stopJulieRecognition();
    julieChatStatus.textContent = "Puedes revisar tu mensaje y pulsar Enviar.";
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    julieChatStatus.textContent =
      "El reconocimiento de voz no está disponible en este navegador.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  julieRecognitionFailed = false;
  julieDictationPending = false;
  julieRecognition = recognition;
  julieChatStatus.textContent =
    "Escuchando… Puedes revisar el texto y pulsar Enviar cuando termines.";
  updateJulieControls();

  recognition.addEventListener("result", (event) => {
    if (julieRecognition !== recognition) {
      return;
    }
    let transcript = "";
    for (let index = 0; index < event.results.length; index += 1) {
      transcript += event.results[index][0].transcript;
    }
    julieMessage.value = transcript.trim();
    julieDictationPending = julieMessage.value.length > 0;
  });
  recognition.addEventListener("error", (event) => {
    if (event.error === "aborted") {
      return;
    }
    julieRecognitionFailed = true;
    julieChatStatus.textContent =
      event.error === "not-allowed"
        ? "No se pudo acceder al micrófono. Revisa los permisos del navegador."
        : "No te he entendido bien. ¿Puedes repetirlo?";
  });
  recognition.addEventListener("end", () => {
    if (julieRecognition === recognition) {
      julieRecognition = null;
      updateJulieControls();
      if (!julieRecognitionFailed && !isJulieSpeaking && !isJulieReplyPending) {
        julieChatStatus.textContent = julieDictationPending
          ? "Puedes revisar tu mensaje y pulsar Enviar."
          : "No te he entendido bien. ¿Puedes repetirlo?";
      }
    }
  });

  try {
    recognition.start();
  } catch (error) {
    julieRecognition = null;
    julieRecognitionFailed = true;
    updateJulieControls();
    julieChatStatus.textContent =
      "No te he entendido bien. ¿Puedes repetirlo?";
  }
}

function normalizePronunciationText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pronunciationSimilarity(expected, actual) {
  const left = normalizePronunciationText(expected);
  const right = normalizePronunciationText(actual);
  if (!left || !right) {
    return 0;
  }

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const above = previous[column];
      const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + substitutionCost,
      );
      diagonal = above;
    }
  }

  return 1 - previous[right.length] / Math.max(left.length, right.length);
}

async function runPronunciationPractice(practice, targetElement) {
  if (activePronunciationPractice !== practice) {
    return;
  }
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    activePronunciationPractice = null;
    targetElement.classList.remove("is-practicing");
    julieChatStatus.textContent =
      "La síntesis de voz no está disponible en este navegador.";
    return;
  }

  julieChatStatus.textContent = "Escucha la palabra y repítela después.";
  await speakJulieReply(practice.target, 0.6);
  if (activePronunciationPractice !== practice) {
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    activePronunciationPractice = null;
    targetElement.classList.remove("is-practicing");
    julieChatStatus.textContent =
      "El reconocimiento de voz no está disponible en este navegador.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  julieRecognition = recognition;
  julieChatStatus.textContent = `Repite: ${practice.target}`;
  updateJulieControls();

  let transcript = "";
  let recognitionError = "";
  recognition.addEventListener("result", (event) => {
    if (julieRecognition !== recognition) {
      return;
    }
    transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join("")
      .trim();
    julieChatStatus.textContent = transcript
      ? `Te escuché: ${transcript}`
      : `Repite: ${practice.target}`;
  });
  recognition.addEventListener("error", (event) => {
    if (event.error === "aborted") {
      return;
    }
    recognitionError = event.error;
  });
  recognition.addEventListener("end", () => {
    if (julieRecognition !== recognition) {
      return;
    }
    julieRecognition = null;
    updateJulieControls();
    if (activePronunciationPractice !== practice) {
      return;
    }

    if (recognitionError === "not-allowed" || recognitionError === "service-not-allowed") {
      activePronunciationPractice = null;
      targetElement.classList.remove("is-practicing");
      julieChatStatus.textContent =
        "No se pudo acceder al micrófono. Revisa los permisos del navegador.";
      return;
    }

    if (pronunciationSimilarity(practice.target, transcript) >= 0.7) {
      activePronunciationPractice = null;
      targetElement.classList.remove("is-practicing");
      appendJulieMessage("model", "¡Excelente pronunciación!");
      julieChatStatus.textContent = "Práctica completada.";
      return;
    }

    julieChatStatus.textContent = "Casi lo tienes, escucha de nuevo.";
    window.setTimeout(() => {
      void runPronunciationPractice(practice, targetElement);
    }, 500);
  });

  try {
    recognition.start();
  } catch {
    julieRecognition = null;
    updateJulieControls();
    julieChatStatus.textContent = "No te he entendido bien. ¿Puedes repetirlo?";
    window.setTimeout(() => {
      if (activePronunciationPractice === practice) {
        void runPronunciationPractice(practice, targetElement);
      }
    }, 500);
  }
}

async function requestBuildGemini(prompt, expectsJson = false) {
  const generationConfig = {};
  if (expectsJson) {
    generationConfig.responseMimeType = "application/json";
  }
  return requestGeminiText(prompt, { generationConfig });
}

async function evaluateStudentSummary() {
  const story = getBuildStory();
  const summary = studentSummary.value.trim();
  if (!story) {
    showBuildFeedback(
      "Primero crea una historia",
      "Ve a Historias y genera o guarda una historia para poder evaluar tu resumen.",
      "error",
    );
    return;
  }
  if (!summary) {
    showBuildFeedback(
      "Escribe tu resumen",
      "Añade unas frases sobre la historia y Julie te ayudará a revisarlas.",
      "error",
    );
    studentSummary.focus();
    return;
  }

  setBuildRequestState(true, "Evaluando…");
  showBuildFeedback("Julie está leyendo tu resumen", "Un momento, por favor…", "loading");
  const prompt =
    "Actúa como un profesor de francés y evalúa si el resumen del estudiante " +
    "es correcto y demuestra comprensión de la historia. Acepta paráfrasis fieles; " +
    "no exijas que repita las mismas palabras. Devuelve únicamente un objeto JSON " +
    'con el formato {"aprobado": true, "feedback": "Mensaje de felicitación o de corrección"}. ' +
    "Escribe el feedback en español, de forma amable y concreta.\n\n" +
    `Historia original:\n${story.textoFrances}\n\nResumen del estudiante:\n${summary}`;

  try {
    const generatedText = await requestBuildGemini(prompt, true);
    let evaluation;
    try {
      evaluation = JSON.parse(generatedText);
    } catch {
      throw new Error("Julie no devolvió una evaluación JSON válida.");
    }
    if (
      typeof evaluation.aprobado !== "boolean" ||
      typeof evaluation.feedback !== "string" ||
      evaluation.feedback.trim().length === 0
    ) {
      throw new Error("Julie devolvió una evaluación incompleta.");
    }
    showBuildFeedback(
      evaluation.aprobado ? "¡Muy bien!" : "Puedes mejorar tu resumen",
      evaluation.feedback.trim(),
      evaluation.aprobado ? "success" : "error",
    );
  } catch (error) {
    console.error("No se pudo evaluar el resumen con Julie:", error);
    showBuildFeedback(
      "No se pudo evaluar el resumen",
      "Comprueba tu conexión y la configuración de la API de Gemini e inténtalo de nuevo.",
      "error",
    );
  } finally {
    setBuildRequestState(false);
  }
}

async function askJulieForSummaryHelp() {
  const story = getBuildStory();
  if (!story) {
    showBuildFeedback(
      "Primero crea una historia",
      "Ve a Historias y genera o guarda una historia para que Julie pueda darte una pista.",
      "error",
    );
    return;
  }

  setBuildRequestState(true, "Pidiendo ayuda…");
  showBuildFeedback("Julie está preparando una pista", "Un momento, por favor…", "loading");
  const prompt =
    "Actúa como una profesora amable de francés. Ayuda al estudiante a empezar " +
    "a escribir un resumen de la siguiente historia. Dale una pista breve o dos " +
    "ideas clave que le ayuden a recordar los hechos principales, sin escribir " +
    "el resumen por él. Responde en español.\n\n" +
    `Historia:\n${story.textoFrances}`;

  try {
    const hint = await requestBuildGemini(prompt);
    showBuildFeedback("Una pista de Julie", hint, "help");
  } catch (error) {
    console.error("No se pudo obtener ayuda de Julie:", error);
    showBuildFeedback(
      "Julie no está disponible ahora",
      "Comprueba tu conexión y la configuración de la API de Gemini e inténtalo de nuevo.",
      "error",
    );
  } finally {
    setBuildRequestState(false);
  }
}

function setBuildRequestState(isLoading, buttonText) {
  evaluateSummaryButton.disabled = isLoading;
  askJulieButton.disabled = isLoading;
  evaluateSummaryButton.textContent = isLoading && buttonText === "Evaluando…"
    ? buttonText
    : "Evaluar mi resumen";
  askJulieButton.textContent = isLoading && buttonText === "Pidiendo ayuda…"
    ? buttonText
    : "Pedir ayuda a Julie";
}

async function fetchGeminiQuestions(textoHistoria) {
  const prompt =
    "Actúa como un profesor de francés. Basándote en esta historia: " +
    `${textoHistoria}, genera exactamente 10 preguntas de comprensión lectora ` +
    "en francés para un nivel principiante. Devuélveme únicamente las 10 preguntas " +
    'en formato de array JSON (por ejemplo: ["Pregunta 1", "Pregunta 2", ...]), ' +
    "sin texto adicional ni formato markdown.";
  const responseText = await requestGeminiText(prompt, {
    generationConfig: { responseMimeType: "application/json" },
  });

  let questions;
  try {
    questions = JSON.parse(responseText);
  } catch {
    throw new Error("Gemini no devolvió un array JSON válido.");
  }

  if (
    !Array.isArray(questions) ||
    questions.length !== 10 ||
    questions.some(
      (question) => typeof question !== "string" || question.trim().length === 0,
    )
  ) {
    throw new Error("Julie no devolvió exactamente 10 preguntas válidas.");
  }

  return questions;
}

async function loadQuestionsForStory(story) {
  questionList.replaceChildren();
  questionLoadStatus.textContent = "Julie está preparando tus preguntas…";

  try {
    const questions = await fetchGeminiQuestions(story.textoFrances);
    if (!currentStory || currentStory.id !== story.id) {
      return;
    }
    renderQuestions(questions);
    questionLoadStatus.textContent = `Pregunta 1 de ${questions.length}`;
  } catch (error) {
    console.error("No se pudieron cargar las preguntas de Julie:", error);
    if (currentStory && currentStory.id === story.id) {
      questionLoadStatus.textContent =
        "Error al conectar con Julie. Inténtalo de nuevo más tarde.";
    }
  }
}

function renderQuestions(questions) {
  questionList.replaceChildren();
  if (!currentStory) {
    return;
  }

  if (
    !Array.isArray(questions) ||
    questions.length !== 10 ||
    questions.some((question) => typeof question !== "string")
  ) {
    throw new Error("Se esperaba un array de exactamente 10 preguntas.");
  }

  questions.forEach((question, index) => {
    const questionNumber = index + 1;
    const item = document.createElement("li");
    item.className = "question-card";
    item.hidden = index !== 0;

    const heading = document.createElement("h3");
    heading.className = "question-prompt";
    heading.textContent = `Pregunta ${questionNumber}: ${question}`;

    const form = document.createElement("form");
    form.className = "question-form";
    const answerLabel = document.createElement("label");
    answerLabel.className = "form-field";
    answerLabel.textContent = "Tu respuesta";
    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.name = `answer-${questionNumber}`;
    answerInput.autocomplete = "off";
    answerInput.placeholder = "Escribe tu respuesta...";
    answerInput.setAttribute("aria-label", `Respuesta para la pregunta ${questionNumber}`);
    answerLabel.append(answerInput);

    const answerActions = document.createElement("div");
    answerActions.className = "question-actions";
    const submitButton = document.createElement("button");
    submitButton.className = "question-submit";
    submitButton.type = "submit";
    submitButton.textContent = "Enviar";

    const microphoneButton = document.createElement("button");
    microphoneButton.className = "microphone-button";
    microphoneButton.type = "button";
    microphoneButton.setAttribute("aria-label", `Responder pregunta ${questionNumber} por voz`);
    microphoneButton.innerHTML = '<span aria-hidden="true">🎙</span><span>Responder por voz</span>';

    answerActions.append(submitButton, microphoneButton);
    const status = document.createElement("p");
    status.className = "question-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    let isEvaluating = false;

    const nextButton = document.createElement("button");
    nextButton.className = "question-submit question-next";
    nextButton.type = "button";
    nextButton.textContent =
      questionNumber === questions.length ? "Finalizar" : "Siguiente pregunta";
    nextButton.hidden = true;

    form.append(answerLabel, answerActions);
    item.append(heading, form, status, nextButton);
    questionList.append(item);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      evaluateAnswer(answerInput.value);
    });

    async function evaluateAnswer(answer) {
      if (isEvaluating || !currentStory) {
        return;
      }
      isEvaluating = true;
      submitButton.disabled = true;
      microphoneButton.disabled = true;
      await checkQuestionAnswer(question, answer, status, nextButton);
      submitButton.disabled = false;
      microphoneButton.disabled = false;
      isEvaluating = false;
    }

    nextButton.addEventListener("click", () => {
      if (questionNumber === questions.length) {
        questionList.replaceChildren();
        questionLoadStatus.textContent = "¡Has terminado las 10 preguntas!";
        return;
      }

      item.hidden = true;
      questionList.children[index + 1].hidden = false;
      questionLoadStatus.textContent = `Pregunta ${questionNumber + 1} de ${questions.length}`;
    });

    microphoneButton.addEventListener("click", () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        status.textContent = "El reconocimiento de voz no está disponible en este navegador.";
        status.className = "question-status is-error";
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      microphoneButton.disabled = true;
      microphoneButton.classList.add("is-listening");
      microphoneButton.lastElementChild.textContent = "Escuchando…";
      status.textContent = "Habla ahora para responder.";
      status.className = "question-status";

      recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript;
        answerInput.value = transcript;
        evaluateAnswer(transcript);
      });
      recognition.addEventListener("error", (event) => {
        status.textContent =
          event.error === "not-allowed"
            ? "No se concedió permiso para usar el micrófono."
            : `No se pudo reconocer la voz: ${event.error}.`;
        status.className = "question-status is-error";
      });
      recognition.addEventListener("end", () => {
        microphoneButton.disabled = isEvaluating;
        microphoneButton.classList.remove("is-listening");
        microphoneButton.lastElementChild.textContent = "Responder por voz";
      });

      try {
        recognition.start();
      } catch (error) {
        microphoneButton.disabled = false;
        microphoneButton.classList.remove("is-listening");
        microphoneButton.lastElementChild.textContent = "Responder por voz";
        status.textContent = `No se pudo iniciar el micrófono: ${error.message}`;
        status.className = "question-status is-error";
      }
    });
  });
}

function setSpeaking(speaking) {
  isSpeaking = speaking;
  listenButtons.forEach((button) => {
    button.classList.toggle("is-speaking", speaking);
    button.setAttribute("aria-label", speaking ? "Arrêter la lecture" : "Écouter");
    button.querySelector("span").textContent = speaking ? "Arrêter" : "Écouter";
  });
  speechStatuses.forEach((status) => {
    status.textContent = speaking ? "Lecture en cours…" : "";
  });
}

function speakCurrentStory() {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    speechStatuses.forEach((status) => {
      status.textContent = "La synthèse vocale n’est pas disponible dans ce navigateur.";
    });
    return;
  }

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    return;
  }

  if (!currentStory) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(currentStory.textoFrances);
  utterance.lang = "fr-FR";
  utterance.rate = selectedRate;
  utterance.addEventListener("end", () => setSpeaking(false));
  utterance.addEventListener("error", (event) => {
    setSpeaking(false);
    if (event.error !== "canceled" && event.error !== "interrupted") {
      speechStatuses.forEach((status) => {
        status.textContent = `La lecture a échoué : ${event.error}.`;
      });
    }
  });

  window.speechSynthesis.cancel();
  setSpeaking(true);
  window.speechSynthesis.speak(utterance);
}

async function initializeAuthentication() {
  application.hidden = true;
  loginView.hidden = false;
  stories = [];
  renderStories();

  if (!supabaseClient) {
    loginStatus.textContent = "No se pudo conectar con el servicio de autenticación.";
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      throw error;
    }
    if (!data.session?.user) {
      return;
    }

    const user = await loadAuthenticatedProfile(data.session.user);
    showApplication(user);
  } catch (error) {
    currentUser = null;
    loginStatus.textContent = `No se pudo restaurar la sesión: ${error.message}`;
  }
}

void initializeAuthentication();

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  authenticate();
});

registerButton.addEventListener("click", openRegistration);
registrationForm.addEventListener("submit", registerUser);
cancelRegistrationButton.addEventListener("click", closeRegistration);
changeAvatarButton.addEventListener("click", () => {
  const shouldShowPicker = profileAvatarPicker.hidden;
  profileAvatarPicker.hidden = !shouldShowPicker;
  changeAvatarButton.setAttribute("aria-expanded", String(shouldShowPicker));
  if (shouldShowPicker && currentUser) {
    renderAvatarGrid(
      profileAvatarGrid,
      currentUser.avatar || AVATAR_OPTIONS[0].url,
      saveProfileAvatar,
    );
  }
});

primaryTabs.forEach((tab) => {
  tab.addEventListener("click", () => setPrimaryView(tab.dataset.view));
});

julieChatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = julieMessage.value.trim();
  if (!message || isJulieReplyPending) {
    return;
  }

  stopJulieRecognition();
  sendJulieMessage(message);
});

julieMicrophoneButton.addEventListener("click", startJulieRecognition);
julieMessage.addEventListener("input", () => {
  julieDictationPending = false;
});

julieSpeedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const rate = Number(button.dataset.rate);
    if (![0.7, 0.85, 1].includes(rate)) {
      return;
    }
    julieSelectedRate = rate;
    julieSpeedButtons.forEach((option) => {
      const selected = Number(option.dataset.rate) === rate;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
  });
});

vaultSpeedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const rate = Number(button.dataset.rate);
    if (!VAULT_PLAYBACK_RATES.includes(rate) || !currentUser) {
      vaultStatus.textContent = "No se pudo cambiar la velocidad global del Baúl.";
      return;
    }

    try {
      window.localStorage.setItem(
        getVaultSpeedStorageKey(),
        String(rate),
      );
      vaultPlaybackRate = rate;
      vaultSpeedButtons.forEach((option) => {
        const selected = Number(option.dataset.rate) === rate;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      vaultStatus.textContent = "";
    } catch (error) {
      vaultStatus.textContent = `No se pudo guardar la velocidad: ${error.message}`;
    }
  });
});

createTab.addEventListener("click", () => setMainTab("create"));
libraryTab.addEventListener("click", () => {
  setMainTab("library");
  renderStories();
});

evaluateSummaryButton.addEventListener("click", evaluateStudentSummary);
askJulieButton.addEventListener("click", askJulieForSummaryHelp);
studentSummary.addEventListener("input", () => {
  buildFeedback.hidden = true;
});

storyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  pendingShortStoryRequest = null;
  retryShortStoryButton.hidden = true;

  if (storageError) {
    formStatus.textContent = "Corrige el problema de almacenamiento antes de guardar una historia.";
    return;
  }

  const theme = storyTheme.value.trim();
  if (!theme) {
    storyTheme.focus();
    return;
  }

  const submitButton = storyForm.querySelector('button[type="submit"]');
  const selectedLevel = storyLevel.value;
  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Creando historia…";
  try {
    const story = await createStory(theme, selectedLevel, storyType.value);
    if (!(await saveStories([story, ...stories]))) {
      return;
    }
    const shortStory = story.demasiadoCorta === true;
    if (shortStory) {
      pendingShortStoryRequest = {
        theme,
        level: selectedLevel,
        type: storyType.value,
      };
    }
    storyForm.reset();
    storyLevel.value = selectedLevel;
    setMainTab("library");
    renderStories();
    libraryStatus.textContent = shortStory
      ? "La historia es muy corta, ¿quieres intentarlo de nuevo?"
      : storageError;
    retryShortStoryButton.hidden = !shortStory;
  } catch (error) {
    formStatus.textContent =
      error.message ===
      "La historia se ha generado con errores. Por favor, intenta de nuevo"
        ? error.message
        : `No se pudo generar la historia: ${error.message}`;
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Generar Historia";
  }
});

retryShortStoryButton.addEventListener("click", () => {
  if (!pendingShortStoryRequest) {
    retryShortStoryButton.hidden = true;
    return;
  }

  const retryRequest = pendingShortStoryRequest;
  pendingShortStoryRequest = null;
  retryShortStoryButton.hidden = true;
  libraryStatus.textContent = "";
  storyTheme.value = retryRequest.theme;
  storyLevel.value = retryRequest.level;
  storyType.value = retryRequest.type;
  setMainTab("create");
  storyForm.requestSubmit();
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  profileStatus.textContent = "";

  const savedUser = currentUser;
  if (!savedUser) {
    profileStatus.textContent = "No se pudo encontrar el perfil. Inicia sesión de nuevo.";
    application.hidden = true;
    loginView.hidden = false;
    return;
  }

  const name = profileNameInput.value.trim();
  if (!name) {
    profileNameInput.focus();
    return;
  }
  if (!availableLevels(savedUser.level).includes(profileLevel.value)) {
    profileStatus.textContent =
      "Elige tu nivel actual o un nivel permitido en la progresión.";
    return;
  }

  const updatedUser = {
    ...savedUser,
    name,
    level: profileLevel.value,
    difficulty: exerciseDifficulty.value,
  };

  try {
    await guardarProgreso({
      perfil: {
        name: updatedUser.name,
        level: updatedUser.level,
      },
      avatar: updatedUser.avatar,
      difficulty: updatedUser.difficulty,
    });
    currentUser = updatedUser;
    setAllLevelOptions(storyLevel, updatedUser.level);
    renderProfile(updatedUser);
    profileStatus.textContent = "Cambios guardados correctamente.";
  } catch (error) {
    profileStatus.textContent = `No se pudieron guardar los cambios: ${error.message}`;
  }
});

async function logout(statusElement) {
  try {
    if (!supabaseClient) {
      throw new Error("El cliente de Supabase no está disponible.");
    }
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw error;
    }
    window.location.reload();
  } catch (error) {
    statusElement.textContent = `No se pudo cerrar la sesión: ${error.message}`;
  }
}

logoutButton.addEventListener("click", () => logout(profileStatus));
headerLogoutButton.addEventListener("click", () => logout(headerLogoutStatus));

audioTab.addEventListener("click", () => setReaderTab("audio"));
readingTab.addEventListener("click", () => setReaderTab("reading"));
questionsTab.addEventListener("click", () => setReaderTab("questions"));

translationToggle.addEventListener("click", () => {
  const showTranslation = translationContainer.hidden;
  translationContainer.hidden = !showTranslation;
  translationToggle.textContent = showTranslation
    ? "Ocultar Traducción"
    : "Mostrar Traducción";
  translationToggle.setAttribute("aria-expanded", String(showTranslation));
});

modalClose.addEventListener("click", () => wordModal.close());

saveWordButton.addEventListener("click", async () => {
  if (!selectedVocabularyCard?.traduccion) {
    return;
  }

  if (!loadVocabularyCards()) {
    modalSaveStatus.textContent = vaultStatus.textContent;
    return;
  }
  const duplicate = vocabularyCards.some(
    (card) =>
      card.palabra === selectedVocabularyCard.palabra &&
      card.contexto === selectedVocabularyCard.contexto,
  );
  if (duplicate) {
    modalSaveStatus.textContent = "Esta tarjeta ya está guardada en el Baúl.";
    saveWordButton.textContent = "Ya está en Baúl";
    saveWordButton.disabled = true;
    return;
  }

  const card = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    ...selectedVocabularyCard,
    velocidad: 0.85,
  };
  saveWordButton.disabled = true;
  saveWordButton.textContent = "Preparando tarjeta…";
  let sentenceTranslationAvailable = true;
  if (!card.contextoEspanol) {
    try {
      card.contextoEspanol = await fetchMyMemoryTranslation(card.contexto);
    } catch {
      card.contextoEspanol = "Traducción no disponible";
      sentenceTranslationAvailable = false;
    }
  }

  if (saveVocabularyCards([card, ...vocabularyCards])) {
    modalSaveStatus.textContent = sentenceTranslationAvailable
      ? "Tarjeta guardada en el Baúl."
      : "Tarjeta guardada; la traducción de la frase no está disponible.";
    saveWordButton.textContent = "Guardado en Baúl";
  } else {
    saveWordButton.disabled = false;
    saveWordButton.textContent = "Guardar en Baúl";
  }
});

wordModal.addEventListener("close", () => {
  translationRequestId += 1;
  selectedVocabularyCard = null;
});

wordModal.addEventListener("click", (event) => {
  if (event.target === wordModal) {
    wordModal.close();
  }
});

backButton.addEventListener("click", () => {
  if (isSpeaking && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  currentStory = null;
  readerView.hidden = true;
  primaryNav.hidden = false;
  setPrimaryView("main-view");
  setMainTab("library");
  renderStories();
});

speedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRate = Number(button.dataset.rate);
    speedButtons.forEach((option) => {
      const selected = Number(option.dataset.rate) === selectedRate;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
  });
});

listenButtons.forEach((button) => {
  button.addEventListener("click", speakCurrentStory);
});
// --- PARCHE FINAL v2: LEE EL TEXTO DIRECTO DE LA PANTALLA ---
document.addEventListener('click', (e) => {
  if (e.target.closest('.listen-button') && !e.target.closest('.vault-card')) {
    e.preventDefault();

    if (!("speechSynthesis" in window)) {
      alert("La síntesis de voz no está disponible en este navegador.");
      return;
    }

    const contenedor = document.getElementById('historia-texto');
    if (!contenedor) return;

    // 1. Extraemos el texto directamente de lo que se ve en pantalla
    const texto = contenedor.innerText.trim();
    if (!texto) {
      alert("No hay texto para leer.");
      return;
    }

    // Si ya está hablando, lo detenemos
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }

    // 2. Preparamos el contenedor para el karaoke
    contenedor.innerHTML = '';
    const palabras = texto.split(' ');
    palabras.forEach((palabra, index) => {
      const span = document.createElement('span');
      span.innerText = palabra + ' ';
      span.id = `palabra-${index}`;
      span.style.transition = 'background-color 0.2s, color 0.2s';
      contenedor.appendChild(span);
    });

    // 3. Configuramos la voz
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'fr-FR';
    
    // Obtenemos la velocidad del botón seleccionado
    const botonVelocidad = document.querySelector('.speed-button.is-selected');
    utterance.rate = botonVelocidad ? parseFloat(botonVelocidad.getAttribute('data-rate')) : 1.0;

    // 4. Efecto karaoke
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const textoHastaAqui = texto.substring(0, charIndex);
        const numeroPalabra = textoHastaAqui.split(' ').length - 1;

        document.querySelectorAll('#historia-texto span').forEach(span => {
          span.style.backgroundColor = 'transparent';
          span.style.color = 'inherit';
          span.style.fontWeight = 'normal';
        });

        const palabraActual = document.getElementById(`palabra-${numeroPalabra}`);
        if (palabraActual) {
          palabraActual.style.backgroundColor = '#e8f0e8';
          palabraActual.style.color = '#1e4d2b';
          palabraActual.style.fontWeight = 'bold';
        }
      }
    };

    // 5. Reproducir
    window.speechSynthesis.speak(utterance);
  }
});