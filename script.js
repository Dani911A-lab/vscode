document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.querySelector(".task-list");
  const searchInput = document.querySelector(".search");
  const addTaskBtn = document.querySelector(".add-task");
  const filterStarBtn = document.querySelector(".filter-priority");
  const filterDropdown = document.querySelector(".filter-dropdown");
  const filterBtn = filterDropdown.querySelector(".filter-btn");
  const filterMenuItems = filterDropdown.querySelectorAll(".filter-menu li");
  const notificationBell = document.getElementById("notification-bell");
  const tasksHeader = document.querySelector(".tasks-header h2");

  let taskItems = [];
  let showOnlyPriorities = false;
  let activeFilter = "all";
  let editingTask = null;

  // -------------------------------
  // 🌎 Fecha en español
  // -------------------------------
  const currentDateEl = document.getElementById("current-date");
  const currentDayEl = document.getElementById("current-day");
  const now = new Date();
  const mes = now.toLocaleString('es-ES', { month: 'short' });
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
  const dia = String(now.getDate()).padStart(2, '0');
  const año = now.getFullYear();
  currentDateEl.innerHTML = `${mesCapitalizado} ${dia}, <span style="font-weight:400; color:#6e6e73;">${año}</span>`;
  const diaSemana = now.toLocaleString('es-ES', { weekday: 'long' });
  currentDayEl.textContent = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  // -------------------------------
  // Guardar y cargar tareas
  // -------------------------------
  function saveTasksToLocal() {
    const tasks = taskItems.map(task => ({
      text: task.querySelector(".task-text").textContent,
      date: task.querySelector(".task-date").textContent,
      scheduledDate: task.querySelector(".scheduled-date")?.textContent || "",
      priority: task.classList.contains("priority-high") ? "high" :
                task.classList.contains("priority-medium") ? "medium" : "none",
      completed: task.classList.contains("completed")
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocal() {
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");
    taskList.innerHTML = "";
    stored.forEach(item => {
      const task = document.createElement("li");
      task.classList.add("task");
      if(item.completed) task.classList.add("completed");
      else if(item.priority === "high") task.classList.add("priority-high");
      else if(item.priority === "medium") task.classList.add("priority-medium");
      else task.classList.add("gray");

      task.innerHTML = `
        <span class="task-text">${item.text}</span>
        <span class="task-date">${item.date}</span>
      `;
      taskList.appendChild(task);
      addPriorityDots(task);
      if(item.scheduledDate){
        const scheduledEl = task.querySelector(".scheduled-date");
        if(scheduledEl) scheduledEl.textContent = item.scheduledDate;
      }
    });
    updateTaskItems();
    updateFilter();
    updateTaskCounter();
  }

  // -------------------------------
  // Contador de tareas
  // -------------------------------
  function updateTaskCounter() {
    tasksHeader.textContent = `Tareas ${taskItems.length} tarea${taskItems.length !== 1 ? 's' : ''}`;
  }

  // -------------------------------
  // Prioridades
  // -------------------------------
  function addPriorityDots(task) {
    if(task.querySelector(".priority-dots")) return;

    const dateEl = task.querySelector(".task-date");
    const container = document.createElement("span");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "6px";

    const dotsContainer = document.createElement("span");
    dotsContainer.classList.add("priority-dots");

    const orangeDot = document.createElement("span");
    orangeDot.classList.add("priority-dot", "orange");
    const redDot = document.createElement("span");
    redDot.classList.add("priority-dot", "red");

    orangeDot.addEventListener("click", e => {
      e.stopPropagation();
      task.classList.remove("priority-high", "gray");
      if(task.classList.contains("priority-medium")){
        task.classList.remove("priority-medium");
        task.classList.add("gray");
      } else {
        task.classList.add("priority-medium");
      }
      updateFilter();
      saveTasksToLocal();
    });

    redDot.addEventListener("click", e => {
      e.stopPropagation();
      task.classList.remove("priority-medium", "gray");
      if(task.classList.contains("priority-high")){
        task.classList.remove("priority-high");
        task.classList.add("gray");
      } else {
        task.classList.add("priority-high");
      }
      updateFilter();
      saveTasksToLocal();
    });

    const deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete-task");
    deleteBtn.textContent = "×";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.color = "#888";
    deleteBtn.style.fontWeight = "600";
    deleteBtn.style.marginLeft = "6px";
    deleteBtn.style.fontSize = "14px";
    deleteBtn.addEventListener("mouseover", ()=> deleteBtn.style.color = "#d70015");
    deleteBtn.addEventListener("mouseout", ()=> deleteBtn.style.color = "#888");

    dotsContainer.appendChild(orangeDot);
    dotsContainer.appendChild(redDot);
    container.appendChild(dotsContainer);
    container.appendChild(deleteBtn);
    dateEl.insertAdjacentElement("afterend", container);

    addCalendarIcon(task);
  }

  function updateTaskItems() {
    taskItems = Array.from(taskList.children);
    updateTaskCounter();
  }

  // -------------------------------
  // Edición tareas
  // -------------------------------
  function enterEditMode(task){
    if(task.classList.contains("editing")) return;
    editingTask = task;
    task.classList.add("editing");

    const textSpan = task.querySelector(".task-text");
    const input = document.createElement("input");
    input.type = "text";
    input.value = textSpan.textContent;
    input.classList.add("task-input");
    task.replaceChild(input, textSpan);
    input.focus();
    input.addEventListener("keydown", e=> { if(e.key==="Enter") exitEditMode(task); });
  }

  function exitEditMode(task){
    if(!task.classList.contains("editing")) return;
    task.classList.remove("editing");
    const input = task.querySelector(".task-input");
    const span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = input.value.trim() || "Nueva tarea";
    task.replaceChild(span, input);
    editingTask = null;
    saveTasksToLocal();
  }

  // -------------------------------
  // Calendario hover
  // -------------------------------
  function addCalendarIcon(task){
    if(task.querySelector(".calendar-icon")) return;
    const dateEl = task.querySelector(".task-date");
    const container = document.createElement("span");
    container.style.display="flex";
    container.style.alignItems="center";
    container.style.gap="6px";
    task.style.position="relative";

    const calendarIcon = document.createElement("span");
    calendarIcon.classList.add("calendar-icon");
    calendarIcon.textContent = "📅";
    calendarIcon.style.cursor="pointer";
    calendarIcon.style.display="none";
    calendarIcon.style.fontSize="16px";

    const scheduledDateEl = document.createElement("span");
    scheduledDateEl.classList.add("scheduled-date");
    scheduledDateEl.style.fontSize="0.85em";
    scheduledDateEl.style.color="#555";

    container.appendChild(calendarIcon);
    container.appendChild(scheduledDateEl);
    dateEl.insertAdjacentElement("afterend", container);

    task.addEventListener("mouseover", ()=> calendarIcon.style.display="inline-block");
    task.addEventListener("mouseout", ()=> calendarIcon.style.display="none");

    calendarIcon.addEventListener("click", e=>{
      e.stopPropagation();
      const dateInput = document.createElement("input");
      dateInput.type="date";
      dateInput.style.position="absolute";
      dateInput.style.left="0";
      dateInput.style.top="100%";
      dateInput.style.zIndex="1000";

      task.appendChild(dateInput);
      dateInput.focus();

      dateInput.addEventListener("change", ()=>{
        scheduledDateEl.textContent = dateInput.value;
        task.removeChild(dateInput);
        saveTasksToLocal();
      });

      document.addEventListener("click", function handler(ev){
        if(!task.contains(ev.target)){
          if(task.contains(dateInput)) task.removeChild(dateInput);
          document.removeEventListener("click", handler);
        }
      });
    });
  }

  // -------------------------------
  // Hover efectos
  // -------------------------------
  taskList.addEventListener("mouseover", e=>{
    const t = e.target.closest(".task");
    if(!t) return;
    if(t.classList.contains("priority-medium")) t.style.background="#ffe5b4";
    if(t.classList.contains("priority-high")) t.style.background="#ffcaca";
  });

  taskList.addEventListener("mouseout", e=>{
    const t = e.target.closest(".task");
    if(!t) return;
    if(t.classList.contains("priority-medium")) t.style.background="#fcf9da";
    if(t.classList.contains("priority-high")) t.style.background="#ffe9e9";
    if(t.classList.contains("gray")) t.style.background="";
    if(t.classList.contains("completed")) t.style.background="#d4f4dd";
  });

  // -------------------------------
  // Click tareas
  // -------------------------------
  taskList.addEventListener("click", e=>{
    const task = e.target.closest(".task");
    if(!task) return;
    if(e.target.classList.contains("priority-dot") || e.target.classList.contains("delete-task") || e.target.classList.contains("calendar-icon")) return;
    if(editingTask && editingTask!==task) exitEditMode(editingTask);
    enterEditMode(task);
  });

  document.addEventListener("click", e=>{
    if(!e.target.closest(".task") && !e.target.closest(".add-task") && !e.target.closest(".filter-btn") && !e.target.closest(".filter-menu")){
      if(editingTask) exitEditMode(editingTask);
      filterDropdown.classList.remove("open");
      // cerrar cuadro campana si se hace click fuera
      const bellBox = document.querySelector(".bell-popup");
      if(bellBox) bellBox.remove();
    }
  });

  // -------------------------------
  // Búsqueda
  // -------------------------------
  searchInput.addEventListener("input", updateFilter);

  // -------------------------------
  // Eliminar tarea
  // -------------------------------
  taskList.addEventListener("click", e=>{
    if(e.target.classList.contains("delete-task")){
      const task = e.target.closest(".task");
      task.remove();
      updateTaskItems();
      updateFilter();
      saveTasksToLocal();
    }
  });

  // -------------------------------
  // Agregar tarea
  // -------------------------------
  addTaskBtn.addEventListener("click", ()=>{
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const dd = String(now.getDate()).padStart(2,'0');
    const mmMonth = String(now.getMonth()+1).padStart(2,'0');
    const yyyy = now.getFullYear();

    const newTask = document.createElement("li");
    newTask.classList.add("task","gray");
    newTask.innerHTML = `<span class="task-text"></span><span class="task-date">${dd}/${mmMonth}/${yyyy} ${hh}:${mm}</span>`;
    taskList.prepend(newTask);
    addPriorityDots(newTask);
    updateTaskItems();
    enterEditMode(newTask);
    const input = newTask.querySelector(".task-input");
    if(input) input.placeholder="Nueva Tarea...";
    saveTasksToLocal();
  });

  // -------------------------------
  // Estrella prioridad
  // -------------------------------
  filterStarBtn.addEventListener("click", ()=>{
    showOnlyPriorities = !showOnlyPriorities;
    filterStarBtn.style.color = showOnlyPriorities ? "#ff9500" : "#333";
    updateFilter();
  });

  // -------------------------------
  // Dropdown filtro
  // -------------------------------
  filterBtn.addEventListener("click", e=>{
    e.stopPropagation();
    filterDropdown.classList.toggle("open");
  });

  filterMenuItems.forEach(item=>{
    item.addEventListener("click", e=>{
      activeFilter = item.dataset.filter;
      filterDropdown.classList.remove("open");
      updateFilter();
    });
  });

  // -------------------------------
  // Completar tarea click sostenido
  // -------------------------------
  let holdInterval, holdProgress;

  taskList.addEventListener("mousedown", e=>{
    const task = e.target.closest(".task");
    if(!task) return;
    if(e.button!==2) return;
    if(e.target.classList.contains("priority-dot") || e.target.classList.contains("delete-task")) return;

    const dateEl = task.querySelector(".task-date");
    let progressBar = task.querySelector(".hold-bar");
    const isCompleted = task.classList.contains("completed");

    if(!progressBar){
      progressBar = document.createElement("div");
      progressBar.classList.add("hold-bar");
      progressBar.style.position="absolute";
      progressBar.style.top="0";
      progressBar.style.height="100%";
      progressBar.style.width="0%";
      progressBar.style.transition="width 0.05s linear";
      progressBar.style.borderRadius="6px";
      task.style.position="relative";
      task.prepend(progressBar);

      progressBar.style.left = !isCompleted ? "0" : "";
      progressBar.style.right = isCompleted ? "0" : "";
      progressBar.style.background = !isCompleted ? "rgba(52,199,89,0.5)" : "rgba(255,59,48,0.5)";
    }

    holdProgress = 0;
    holdInterval = setInterval(()=>{
      holdProgress+=2;
      progressBar.style.width = holdProgress+"%";

      if(holdProgress>=100){
        clearInterval(holdInterval);

        if(!isCompleted){
          task.classList.add("completed");
          task.style.background="#34c75933";
          const createdDate = dateEl.textContent.split(" ")[0];
          const now = new Date();
          const dd = String(now.getDate()).padStart(2,'0');
          const mm = String(now.getMonth()+1).padStart(2,'0');
          const yyyy = now.getFullYear();
          dateEl.textContent = `${createdDate} – ${dd}/${mm}/${yyyy}`;
        } else {
          task.classList.remove("completed");
          task.style.background="";
          const originalDate = dateEl.textContent.split("–")[0].trim();
          dateEl.textContent = originalDate;
        }
        saveTasksToLocal();
        setTimeout(()=> progressBar.remove(),200);
      }
    },20);
  });

  taskList.addEventListener("mouseup", e=>{
    clearInterval(holdInterval);
    const task = e.target.closest(".task");
    if(!task) return;
    const progressBar = task.querySelector(".hold-bar");
    if(progressBar) progressBar.remove();
  });

  taskList.addEventListener("mouseleave", e=>{
    clearInterval(holdInterval);
    taskItems.forEach(task=>{
      const progressBar = task.querySelector(".hold-bar");
      if(progressBar) progressBar.remove();
    });
  });

  taskList.addEventListener("contextmenu", e=> e.preventDefault());

  // -------------------------------
  // Filtros combinados
  // -------------------------------
  function updateFilter(){
    taskItems.forEach(task=>{
      let show = true;
      if(showOnlyPriorities && !task.classList.contains("priority-high") && !task.classList.contains("priority-medium")) show=false;
      if(activeFilter!=="all"){
        if(activeFilter==="completed"){
          if(!task.classList.contains("completed")) show=false;
        } else {
          if(!task.classList.contains(activeFilter) || task.classList.contains("completed")) show=false;
        }
      }
      const query = searchInput.value.toLowerCase();
      const text = task.querySelector(".task-text").textContent.toLowerCase();
      if(!text.includes(query)) show=false;
      task.style.display = show ? "" : "none";
    });
  }

  // -------------------------------
  // Notificaciones campanita + cuadro + sonido
  // -------------------------------
  const notificationAudio = new Audio("NOTE.MP3");

  function checkUpcomingTasks(){
    const now = new Date();
    const hours = now.getHours();
    if(hours < 9 || hours > 23) return; // Solo entre 9am y 23:59

    const upcomingTasks = [];

    taskItems.forEach(task=>{
      const scheduledEl = task.querySelector(".scheduled-date");
      if(!scheduledEl) return;
      const scheduledStr = scheduledEl.textContent;
      if(!scheduledStr) return;
      const scheduledDate = new Date(scheduledStr);
      const diffTime = scheduledDate - now;
      const diffDays = Math.ceil(diffTime / (1000*60*60*24));

      if(diffDays <=3 && diffDays >=0){
        upcomingTasks.push({task, diffDays});
        if(!task.classList.contains("notified")){
          if(Notification.permission==="granted"){
            new Notification("Tarea próxima", {
              body: `${task.querySelector(".task-text").textContent} vence en ${diffDays} día${diffDays!==1?'s':''}.`,
              icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png"
            });
          }
          task.style.border="2px solid #ff9500";
          task.classList.add("notified");
        }
      }
    });

    if(upcomingTasks.length>0){
      notificationAudio.play().catch(err=>console.log("Audio bloqueado hasta interacción del usuario"));
    }

    return upcomingTasks;
  }

  notificationBell.addEventListener("click", ()=>{
    const bellBox = document.querySelector(".bell-popup");
    if(bellBox) { bellBox.remove(); return; }

    const tasks = checkUpcomingTasks();
    const popup = document.createElement("div");
    popup.classList.add("bell-popup");
    popup.style.position="absolute";
    popup.style.top="35px";
    popup.style.left="0";
    popup.style.minWidth="200px";
    popup.style.background="#fff";
    popup.style.border="1px solid #ccc";
    popup.style.borderRadius="6px";
    popup.style.padding="10px";
    popup.style.boxShadow="0 4px 8px rgba(0,0,0,0.1)";
    popup.style.zIndex="999";

    if(tasks.length===0){
      popup.textContent="No hay tareas próximas";
    } else {
      tasks.forEach(({task, diffDays})=>{
        const t = document.createElement("div");
        t.textContent = `${task.querySelector(".task-text").textContent} - vence en ${diffDays} día${diffDays!==1?'s':''}`;
        t.style.padding="2px 0";
        popup.appendChild(t);
      });
    }
    notificationBell.parentElement.appendChild(popup);
  });

  if(Notification.permission!=="granted") Notification.requestPermission();
  setInterval(checkUpcomingTasks,15000); // cada 15 segundos

  // -------------------------------
  // Inicializar
  // -------------------------------
  loadTasksFromLocal();
});
