let timer;
let timeLeft;
let darkMode = false;
const alarmSound = document.getElementById("alarmSound");

// Load stored tasks and theme
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    chrome.storage.sync.get(["darkMode"], (data) => {
        darkMode = data.darkMode || false;
        applyDarkMode();
    });
});

// Timer logic with sound
document.getElementById("startTimer").addEventListener("click", () => {
    const customTime = parseInt(document.getElementById("customTime").value) || 25;
    if (timer) clearInterval(timer);
    
    timeLeft = customTime * 60;
    updateDisplay();
    
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            alarmSound.play(); // Play alarm sound
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icon.webp",
                title: "Time's up!",
                message: "Take a break or start another session.",
                priority: 2
            });
        }
    }, 1000);
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timerDisplay").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Save task to Chrome storage
document.getElementById("saveTask").addEventListener("click", () => {
    const task = document.getElementById("task").value;
    if (!task) return;

    chrome.storage.sync.get({ tasks: [] }, (data) => {
        const tasks = [...data.tasks, task];
        chrome.storage.sync.set({ tasks }, () => {
            loadTasks();
        });
    });

    sendDataToAPI(task);
    document.getElementById("task").value = "";
});

// Load saved tasks
function loadTasks() {
    chrome.storage.sync.get({ tasks: [] }, (data) => {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";
        data.tasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task;
            li.addEventListener("click", () => {
                if (confirm("Mark task as completed?")) {
                    removeTask(task);
                }
            });
            taskList.appendChild(li);
        });
    });
}

// Remove task
function removeTask(taskToRemove) {
    chrome.storage.sync.get({ tasks: [] }, (data) => {
        const tasks = data.tasks.filter(task => task !== taskToRemove);
        chrome.storage.sync.set({ tasks }, () => {
            loadTasks();
        });
    });
}

// Mock API integration (replace with actual API)
function sendDataToAPI(task) {
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({ task }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => console.log("Task sent to API:", data))
    .catch(error => console.error("API Error:", error));
}

// Toggle Dark Mode
document.getElementById("toggleDarkMode").addEventListener("click", () => {
    darkMode = !darkMode;
    chrome.storage.sync.set({ darkMode });
    applyDarkMode();
});

function applyDarkMode() {
    document.body.classList.toggle("dark-mode", darkMode);
}
