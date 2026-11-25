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
const taskbarWindows = document.getElementById("taskbar-windows"};

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

  // window header
  const header = document.createElement("span");
  title.className = "window-title";
  title.textContent = options.title || id;

  // window controls
  const controls = document.createElement("div");
  controls.className = "windows-controls";

  const minimizeButton = doccument.createElement("button");
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

  if (options.content instanceof HTMLElement) {
    content.appendChild(options.content);
  } else {
    content.innerHTML = options.content || "";
  }

  windowElement.append(header, content);
  windowLayer.appendChild(windowElement);

  // taskbar button
  const taskbarButton = document.createElement("button");
  taskbarButton.className = "taskbar-window";
  taskbarButton.textContent = options.title || id;

  
