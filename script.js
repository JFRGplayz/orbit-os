// SECTION: SYSTEM CLOCK

const clock = document.getElementById("clock");

function updateClock() {
  const now = new Date();

  clock.textContent = now.ToLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12 = false
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
  version: "0.1.0",
  status: "online",

  log(message) {
    console.log(`[ORBIT] ${message}`);
  }
};

window.ORBIT = ORBIT;

ORBIT.log("Core initialized.");
