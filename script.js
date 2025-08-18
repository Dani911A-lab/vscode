document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const taskCountEl = document.querySelector(".task-count");

  // Cargar sonidos
  const soundAdd = new Audio('add.mp3');       // sonido al añadir
  const soundDelete = new Audio('delete.mp3'); // sonido al eliminar
  const soundDone = new Audio('done.mp3');
  soundDone.volume = 0.2;    // sonido al marcar completada
  soundAdd.volume = 0.3;
  soundDelete.volume = 0.3;

  // Actualiza el contador
  function updateTaskCount() {
    const total = taskList.querySelectorAll(".task-item").length;
    taskCountEl.textContent = `${total} ${total === 1 ? "tarea" : "tareas"}`;
  }

  // Crear tarea nueva
  function createTask() {
    const li = document.createElement("li");
    li.classList.add("task-item");

    li.innerHTML = `
      <input type="checkbox">
      <div class="task-content">
        <span class="task-title" contenteditable="true" data-placeholder="Nueva tarea..."></span>
        <span class="task-meta" contenteditable="true" data-placeholder="Detalle..."></span>
      </div>
      <button class="delete-task">✕</button>
    `;

    // Insertar la nueva tarea al inicio
    taskList.insertBefore(li, taskList.firstChild);

    // Placeholders
    const editableElements = li.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(el => {
      el.addEventListener('focus', () => {
        if(el.textContent === '') el.textContent = '';
      });
    });

    // Checkbox: marcar como completada
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        li.classList.add('completed');
        soundDone.play();
        if (navigator.vibrate) navigator.vibrate(100); // vibración
      } else {
        li.classList.remove('completed');
      }
    });

    // Botón eliminar
    li.querySelector(".delete-task").addEventListener("click", () => {
      li.remove();
      updateTaskCount();
      soundDelete.play();
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    });

    // Actualizar contador
    updateTaskCount();

    // Poner foco en el título editable
    li.querySelector(".task-title").focus();

    // Sonido y vibración al añadir
    soundAdd.play();
    if (navigator.vibrate) navigator.vibrate(50);
  }

  // Evento click en "+ Añadir tarea"
  addTaskBtn.addEventListener("click", createTask);

  // Inicializa contador en 0
  updateTaskCount();
});
