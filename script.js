document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const taskCountEl = document.querySelector(".task-count");

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

    // Evento para eliminar tarea
    li.querySelector(".delete-task").addEventListener("click", () => {
      li.remove();
      updateTaskCount();
    });

    const checkbox = li.querySelector('input[type="checkbox"]');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    li.classList.add('completed');
  } else {
    li.classList.remove('completed');
  }
});

    // Actualizar contador
    updateTaskCount();

    // Poner foco en el título editable
    li.querySelector(".task-title").focus();
  }

  // Evento click en "+ Añadir tarea"
  addTaskBtn.addEventListener("click", createTask);

  // Inicializa contador en 0
  updateTaskCount();
});
