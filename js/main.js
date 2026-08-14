document.addEventListener('DOMContentLoaded', () => {

  // --- 1. CLOCK, DATE & GREETING ---
  const greetingEl = document.getElementById('greeting');

function updateGreeting() {
  const hours = new Date().getHours();
  let greetingText = 'Selamat Datang! ✨';

  if (hours >= 5 && hours < 12) {
    greetingText = 'Selamat Pagi! ☀️';
  } else if (hours >= 12 && hours < 15) {
    greetingText = 'Selamat Siang! 🌤️';
  } else if (hours >= 15 && hours < 18) {
    greetingText = 'Selamat Sore! 🌆';
  } else {
    greetingText = 'Selamat Malam! 🌙';
  }

  if (greetingEl) {
    greetingEl.textContent = greetingText;
  }
}

// Panggil fungsi salam
updateGreeting();
  // --- 2. LIGHT / DARK MODE TOGGLE ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('dashboard_theme');

  if (currentTheme === 'light') {
    document.body.classList.remove('dark-mode');
    themeToggleBtn.textContent = '🌙 Dark Mode';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('dashboard_theme', isDark ? 'dark' : 'light');
  });


  // --- 3. FOCUS TIMER (With Change Pomodoro Time Option) ---
  let timerInterval;
  let defaultMinutes = 25;
  let timeLeft = defaultMinutes * 60;
  
  const timerDisplay = document.getElementById('timer-display');
  const customMinutesInput = document.getElementById('custom-minutes');
  const setTimerBtn = document.getElementById('set-timer-btn');

  function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
  }

  // Opsi Mengubah Durasi Timer
  setTimerBtn.addEventListener('click', () => {
    const customMins = parseInt(customMinutesInput.value);
    if (!isNaN(customMins) && customMins > 0) {
      clearInterval(timerInterval);
      defaultMinutes = customMins;
      timeLeft = defaultMinutes * 60;
      updateTimerDisplay();
    }
  });

  document.getElementById('start-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        alert('🎉 Waktu Focus Selesai! Saatnya Istirahat 🌸');
      }
    }, 1000);
  });

  document.getElementById('stop-timer').addEventListener('click', () => clearInterval(timerInterval));
  
  document.getElementById('reset-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timeLeft = defaultMinutes * 60;
    updateTimerDisplay();
  });


  // --- 4. TO-DO LIST (Prevent Duplicate Included) ---
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const todoError = document.getElementById('todo-error');
  let todos = JSON.parse(localStorage.getItem('dashboard_todos')) || [];

  function saveAndRenderTodos() {
    localStorage.setItem('dashboard_todos', JSON.stringify(todos));
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.done ? 'done' : ''}`;
      li.innerHTML = `
        <span onclick="toggleTodo(${index})">${todo.done ? '✅' : '📌'} ${todo.text}</span>
        <div style="display:flex; gap:6px;">
          <button onclick="editTodo(${index})" class="btn-blue" style="padding:4px 10px; font-size:0.8rem;">✏️</button>
          <button onclick="deleteTodo(${index})" class="btn-orange" style="padding:4px 10px; font-size:0.8rem;">🗑️</button>
        </div>
      `;
      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    // Prevent Duplicate Task Check
    const isDuplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
      todoError.textContent = '⚠️ Tugas ini sudah ada di dalam list-mu!';
      return;
    }

    todoError.textContent = '';
    todos.push({ text, done: false });
    todoInput.value = '';
    saveAndRenderTodos();
  });

  window.toggleTodo = (index) => {
    todos[index].done = !todos[index].done;
    saveAndRenderTodos();
  };

  window.deleteTodo = (index) => {
    todos.splice(index, 1);
    saveAndRenderTodos();
  };

  window.editTodo = (index) => {
    const newText = prompt('Edit tugas:', todos[index].text);
    if (newText !== null && newText.trim() !== '') {
      todos[index].text = newText.trim();
      saveAndRenderTodos();
    }
  };

  saveAndRenderTodos();


  // --- 5. QUICK LINKS ---
  const linkForm = document.getElementById('link-form');
  const linkTitle = document.getElementById('link-title');
  const linkUrl = document.getElementById('link-url');
  const linksContainer = document.getElementById('links-container');
  let links = JSON.parse(localStorage.getItem('dashboard_links')) || [];

  function saveAndRenderLinks() {
    localStorage.setItem('dashboard_links', JSON.stringify(links));
    linksContainer.innerHTML = '';
    links.forEach((link, index) => {
      const div = document.createElement('div');
      div.className = 'link-item';
      div.innerHTML = `
        <a href="${link.url}" target="_blank"> ${link.title}</a>
        <span class="delete-link-btn" onclick="deleteLink(${index})">✕</span>
      `;
      linksContainer.appendChild(div);
    });
  }

  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    links.push({ title: linkTitle.value.trim(), url: linkUrl.value.trim() });
    linkTitle.value = '';
    linkUrl.value = '';
    saveAndRenderLinks();
  });

  window.deleteLink = (index) => {
    links.splice(index, 1);
    saveAndRenderLinks();
  };

  saveAndRenderLinks();
});