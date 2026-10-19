/**
 * Chimamanda Justus - Student Portfolio
 * Main JavaScript Application
 * 
 * Demonstrates:
 * - Event Handling (click, submit, change, input, timeupdate, ended)
 * - DOM Manipulation (element creation, class toggling, text updates)
 * - Form Validation (required fields, email format regex, digits-only phone regex)
 * - Dynamic Content Updates (real-time task list, audio progress & countdown timer)
 * - Arrays and Functions (filter, forEach, map, push, modular functions)
 * - Interactive Task Management System (localStorage persistence)
 */

/* ==========================================================================
   1. ACADEMIC PLANNER MODULE
   ========================================================================== */

function initPlanner() {
  const taskForm = document.querySelector("#task-form");
  const taskInput = document.querySelector("#task");
  const taskDateInput = document.querySelector("#task-date");
  const taskList = document.querySelector("#task-list");
  const emptyState = document.querySelector("#empty-state");

  // Only run if planner elements exist on the current page
  if (!taskForm || !taskList || taskForm.dataset.initialized) return;
  taskForm.dataset.initialized = "true";

  const STORAGE_KEY = "chimamanda-academic-tasks";
  let tasks = loadTasks();

  function loadTasks() {
    try {
      const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(savedTasks) ? savedTasks : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      console.warn("Tasks could not be saved in this browser.");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function createCalendarIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "15");
    svg.setAttribute("height", "15");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const calendar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    calendar.setAttribute("x", "3");
    calendar.setAttribute("y", "5");
    calendar.setAttribute("width", "18");
    calendar.setAttribute("height", "16");
    calendar.setAttribute("rx", "2");

    const topLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
    topLine.setAttribute("d", "M16 3v4M8 3v4M3 10h18");

    svg.append(calendar, topLine);
    return svg;
  }

  function createDeleteIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.6");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const bin = document.createElementNS("http://www.w3.org/2000/svg", "path");
    bin.setAttribute("d", "M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6");

    svg.append(bin);
    return svg;
  }

  function renderTasks() {
    taskList.replaceChildren();

    if (emptyState) {
      emptyState.hidden = tasks.length > 0;
    }

    // Demonstrates array iteration (forEach) & DOM manipulation
    tasks.forEach((task) => {
      const row = document.createElement("li");
      row.className = `task-row${task.completed ? " completed" : ""}`;

      const taskMain = document.createElement("div");
      taskMain.className = "task-main";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", `Mark ${task.name} as completed`);

      // Event Handling: task completion status update
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const content = document.createElement("div");
      content.className = "task-content";

      const taskName = document.createElement("p");
      taskName.className = "task-name";
      taskName.textContent = task.name;

      content.append(taskName);

      const dateLabel = document.createElement("span");
      dateLabel.className = "task-date";

      if (task.dueDate) {
        dateLabel.append(createCalendarIcon());
        dateLabel.append(document.createTextNode(formatDate(task.dueDate)));
      } else {
        dateLabel.classList.add("no-date");
        dateLabel.textContent = "no due date";
      }

      content.append(dateLabel);
      taskMain.append(checkbox, content);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-task";
      deleteButton.setAttribute("aria-label", `Delete task ${task.name}`);
      deleteButton.title = "Delete task";
      deleteButton.append(createDeleteIcon());

      // Event Handling & Array filtering: task deletion
      deleteButton.addEventListener("click", () => {
        tasks = tasks.filter((item) => item.id !== task.id);
        saveTasks();
        renderTasks();
      });

      row.append(taskMain, deleteButton);
      taskList.append(row);
    });
  }

  // Event Handling: Task creation on submit
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = taskInput.value.trim();
    if (!name) {
      taskInput.focus();
      return;
    }

    const task = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
      name,
      dueDate: taskDateInput ? taskDateInput.value : "",
      completed: false,
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskForm.reset();
    taskInput.focus();
  });

  renderTasks();
}

/* ==========================================================================
   2. CONTACT FORM VALIDATION MODULE
   ========================================================================== */

function initContactValidation() {
  const contactForm = document.querySelector("#contact-form");
  if (!contactForm || contactForm.dataset.initialized) return;
  contactForm.dataset.initialized = "true";

  const nameInput = document.querySelector("#contact-name");
  const emailInput = document.querySelector("#contact-email");
  const phoneInput = document.querySelector("#contact-phone");
  const messageInput = document.querySelector("#contact-message");

  const nameError = document.querySelector("#name-error");
  const emailError = document.querySelector("#email-error");
  const phoneError = document.querySelector("#phone-error");
  const messageError = document.querySelector("#message-error");
  const formFeedback = document.querySelector("#form-feedback");

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnlyRegex = /^\d+$/;

  function clearError(input, errorElement) {
    if (input) input.classList.remove("invalid");
    if (errorElement) errorElement.textContent = "";
  }

  function setError(input, errorElement, message) {
    if (input) input.classList.add("invalid");
    if (errorElement) errorElement.textContent = message;
  }

  // Event Handling: Real-time clearing of errors when the user types
  const fields = [
    { input: nameInput, error: nameError },
    { input: emailInput, error: emailError },
    { input: phoneInput, error: phoneError },
    { input: messageInput, error: messageError },
  ];

  fields.forEach(({ input, error }) => {
    if (input) {
      input.addEventListener("input", () => {
        clearError(input, error);
        if (formFeedback) formFeedback.textContent = "";
      });
    }
  });

  // Event Handling: Form submission and validation checks
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    // Reset previous states
    fields.forEach(({ input, error }) => clearError(input, error));
    if (formFeedback) formFeedback.textContent = "";

    // Requirement: No field is empty
    // 1. Name check
    const nameVal = nameInput ? nameInput.value.trim() : "";
    if (!nameVal) {
      setError(nameInput, nameError, "name is required");
      isValid = false;
    }

    // 2. Email check: no empty field + valid email format
    const emailVal = emailInput ? emailInput.value.trim() : "";
    if (!emailVal) {
      setError(emailInput, emailError, "email address is required");
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setError(emailInput, emailError, "please enter a valid email address");
      isValid = false;
    }

    // 3. Phone number check: no empty field + contains only digits
    const phoneVal = phoneInput ? phoneInput.value.trim() : "";
    if (!phoneVal) {
      setError(phoneInput, phoneError, "phone number is required");
      isValid = false;
    } else if (!digitsOnlyRegex.test(phoneVal)) {
      setError(phoneInput, phoneError, "phone number must contain only digits");
      isValid = false;
    }

    // 4. Message check
    const messageVal = messageInput ? messageInput.value.trim() : "";
    if (!messageVal) {
      setError(messageInput, messageError, "message cannot be empty");
      isValid = false;
    }

    // Dynamic content update: display feedback if valid
    if (isValid) {
      if (formFeedback) {
        formFeedback.textContent = "thank you! your message has been sent successfully.";
      }
      contactForm.reset();
    }
  });
}

/* ==========================================================================
   3. MULTIMEDIA VOICE NOTE / AUDIO PLAYER MODULE
   ========================================================================== */

function initAudioPlayer() {
  const audio = document.querySelector("#about-audio");
  const playBtn = document.querySelector("#voice-play-btn");
  const waveformContainer = document.querySelector("#voice-waveform");
  const timeLeftDisplay = document.querySelector("#voice-time-left");

  if (
    !audio ||
    !playBtn ||
    !waveformContainer ||
    !timeLeftDisplay ||
    waveformContainer.dataset.initialized
  ) {
    return;
  }
  waveformContainer.dataset.initialized = "true";

  const playIcon = playBtn.querySelector(".play-icon");
  const pauseIcon = playBtn.querySelector(".pause-icon");

  // Waveform bar heights (varying amplitudes matching voice note screenshot)
  const WAVEFORM_BARS = [
    5, 5, 8, 12, 28, 28, 16, 12, 10, 8, 12, 6, 18, 24, 26, 20, 6, 10, 14, 20,
    16, 12, 14, 18, 28, 12, 10, 14, 20, 18, 14, 10, 14, 8,
  ];

  // Helper: Format seconds to M:SS
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Dynamic Content Update: create bars dynamically using Array.prototype.map / forEach
  const barElements = WAVEFORM_BARS.map((height) => {
    const bar = document.createElement("span");
    bar.className = "voice-bar";
    bar.style.height = `${height}px`;
    waveformContainer.append(bar);
    return bar;
  });

  function updateTimeDisplay() {
    const duration = audio.duration;
    if (isNaN(duration) || duration === 0) {
      timeLeftDisplay.textContent = "0:00";
      return;
    }
    // "how many seconds/minutes left while listening to the audio on the side"
    const remainingSeconds = Math.max(0, Math.ceil(duration - audio.currentTime));
    timeLeftDisplay.textContent = formatTime(remainingSeconds);
  }

  function updateWaveformProgress() {
    const duration = audio.duration;
    const progress = duration > 0 ? audio.currentTime / duration : 0;
    const activeCount = Math.round(progress * barElements.length);

    barElements.forEach((bar, index) => {
      bar.classList.toggle("active", index < activeCount);
    });

    waveformContainer.setAttribute("aria-valuenow", Math.round(progress * 100));
  }

  function setPlayingState(isPlaying) {
    if (isPlaying) {
      if (playIcon) playIcon.style.display = "none";
      if (pauseIcon) pauseIcon.style.display = "block";
      playBtn.setAttribute("aria-label", "Pause audio");
    } else {
      if (playIcon) playIcon.style.display = "block";
      if (pauseIcon) pauseIcon.style.display = "none";
      playBtn.setAttribute("aria-label", "Play audio");
    }
  }

  // Event Handling: Play / Pause toggle
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        setPlayingState(true);
      }).catch((err) => {
        console.warn("Audio playback error:", err);
      });
    } else {
      audio.pause();
      setPlayingState(false);
    }
  });

  // Event Handling: Metadata loaded (initial duration)
  audio.addEventListener("loadedmetadata", () => {
    updateTimeDisplay();
  });

  // Event Handling: Time update while audio is playing
  audio.addEventListener("timeupdate", () => {
    updateTimeDisplay();
    updateWaveformProgress();
  });

  // Event Handling: Audio playback ended
  audio.addEventListener("ended", () => {
    setPlayingState(false);
    audio.currentTime = 0;
    updateTimeDisplay();
    updateWaveformProgress();
  });

  // Event Handling: Waveform scrub/seek on click
  waveformContainer.addEventListener("click", (event) => {
    const rect = waveformContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    if (audio.duration) {
      audio.currentTime = ratio * audio.duration;
      updateTimeDisplay();
      updateWaveformProgress();
    }
  });

  // Initial update
  if (audio.readyState >= 1) {
    updateTimeDisplay();
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPlanner();
  initContactValidation();
  initAudioPlayer();
});

// Also trigger immediately for module scripts
initPlanner();
initContactValidation();
initAudioPlayer();
