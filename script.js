// SECTION: SYSTEM CLOCK

const clock = document.getElementById("clock");

function updateClock() {
  const now = new Date();

  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

updateClock();
setInterval(updateClock, 1000);

// SECTION: SYSTEM BOOT

const systemStatus = document.getElementById("system-status");

function bootSystem() {
  systemStatus.textContent = "INITIALIZING...";

  setTimeout(() => {
    systemStatus.textContent = "SYSTEM ONLINE";
    console.log("[ORBIT] system boot complete.");
  }, 1200);
}

bootSystem();

// SECTION: SYSTEM CORE

const ORBIT = {
  name: "ORBIT",
  version: "0.2.0",
  status: "online",

  log(message) {
    console.log(`[ORBIT] ${message}`);
  }
};

window.ORBIT = ORBIT;

// SECTION: WINDOW MANAGER

ORBIT.windows = {};

ORBIT.activeWindow = null;
ORBIT.windowZIndex = 10;

const windowLayer = document.getElementById("window-layer");
const taskbarWindows = document.getElementById("taskbar-windows");

// SECTION: CREATE WINDOW

ORBIT.createWindow = function (options) {

  const id = options.id

  // prevent duplicate windows
  if (ORBIT.windows[id]) {
    ORBIT.focusWindow(id);
    return ORBIT.windows[id];
  }

  const windowElement = document.createElement("div");
  windowElement.className = "orbit-window";
  windowElement.dataset.windowId = id;

  windowElement.style.left = 
    `${100 + Object.keys(ORBIT.windows).length * 30}px`;

  windowElement.style.top = 
    `${80 + Object.keys(ORBIT.windows).length * 30}px`;

  windowElement.style.zIndex = ++ORBIT.windowZIndex;

  // window header
  const header = document.createElement("div");
  header.className = "window-header";

  const title = document.createElement("span");
  title.className = "window-title";
  title.textContent = options.title || id;

  // window controls
  const controls = document.createElement("div");
  controls.className = "window-controls";

  const minimizeButton = document.createElement("button");
  minimizeButton.className = "window-control window-minimize";
  minimizeButton.title = "Minimize";

  const closeButton = document.createElement("button");
  closeButton.className = "window-control window-close";
  closeButton.title = "Close";

  controls.append(minimizeButton, closeButton);
  header.append(title, controls);

  // window content
  const content = document.createElement("div");
  content.className = "window-content";

  // resize handle
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "window-resize";

  if (options.content instanceof HTMLElement) {
    content.appendChild(options.content);
  } else {
    content.innerHTML = options.content || "";
  }

  windowElement.append(header, content);
  windowElement.appendChild(resizeHandle);
  windowLayer.appendChild(windowElement);

  // taskbar button
  const taskbarButton = document.createElement("button");
  taskbarButton.className = "taskbar-window";
  taskbarButton.textContent = options.title || id;

  taskbarWindows.appendChild(taskbarButton);

  // window object
  const windowObject = {
    id,
    element: windowElement,
    taskbarButton,
    minimized: false
  };

  ORBIT.windows[id] = windowObject;

  // events
  windowElement.addEventListener("mousedown", () => {
    ORBIT.focusWindow(id);
  });

  minimizeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    ORBIT.minimizeWindow(id);
  });

  closeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    ORBIT.closeWindow(id);
  });

  taskbarButton.addEventListener("click", () => {
    ORBIT.restoreWindow(id);
  });

  // dragging
  ORBIT.makeDraggable(windowElement, header);

  ORBIT.focusWindow(id);
  ORBIT.log(`Window created: ${id}`);

  return windowObject;
};

// SECTION: FOCUS WINDOW

ORBIT.focusWindow = function (id) {

  const win = ORBIT.windows[id];
  if (!win || win.minimized) return;

  ORBIT.activeWindow = id;

  win.element.style.zIndex = ++ORBIT.windowZIndex;

  Object.values(ORBIT.windows).forEach(window => {
    window.taskbarButton.classList.remove("active");
  });

  win.taskbarButton.classList.add("active");
};

// SECTION: MINIMIZE BUTTON

ORBIT.minimizeWindow = function (id) {

  const win = ORBIT.windows[id];
  if (!win) return;

  win.element.style.display = "none";
  win.minimized = true;

  win.taskbarButton.classList.remove("active");

  if (ORBIT.activeWindow === id) {
    ORBIT.activeWindow = null;
  }

  ORBIT.log(`Window minimized: ${id}`);
};

// SECTION: RESTORE WINDOW

ORBIT.restoreWindow = function (id) {

  const win = ORBIT.windows[id];
  if (!win) return;

  win.element.style.display = "flex";
  win.minimized = false;

  ORBIT.focusWindow(id);

  ORBIT.log(`Window restored ${id}`);
};

// SECTION: CLOSE WINDOW

ORBIT.closeWindow = function (id) {

  const win = ORBIT.windows[id];
  if (!win) return;

  win.element.remove();
  win.taskbarButton.remove();

  delete ORBIT.windows[id];

  if (ORBIT.activeWindow === id) {
    ORBIT.activeWindow = null;
  }

  ORBIT.log(`Window closed: ${id}`);

  // focus remaining window
  const remainingWindows = Object.values(ORBIT.windows);

  if (remainingWindows.length > 0) {
    const nextWindow = remainingWindows
    .filter(win => !win.minimized)
    .sort((a, b) =>
      Number(b.element.style.zIndex) - Number(a.element.style.zIndex)
    )[0];

    if (nextWindow) {
      ORBIT.focusWindow(nextWindow.id);
    }
  }
};

  // SECTION: WINDOW DRAGGING

ORBIT.makeDraggable = function (windowElement, header) {

  let dragging = false;

  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (event) => {

    if (event.target.closest(".window-controls")) return;

    dragging = true;

    const rect = windowElement.getBoundingClientRect();

    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    ORBIT.focusWindow(windowElement.dataset.windowId);
  });

  document.addEventListener("mousemove", (event) => {

    if (!dragging) return;
    
    const maxX = window.innerWidth - windowElement.offsetWidth;
    const maxY = window.innerHeight - windowElement.offsetHeight - 55;

    const x = Math.max(0, Math.min(event.clientX - offsetX, maxX));
    const y = Math.max(0, Math.min(event.clientY - offsetY, maxY));

    windowElement.style.left = `${x}px`;
    windowElement.style.top = `${y}px`;

  });
  
  document.addEventListener("mouseup", () => {
    dragging = false;
  });
  
};

  // SECTION: CORE INITIALIZATION

  ORBIT.log("Core initialized.")
  ORBIT.log("Window manager loaded.");
