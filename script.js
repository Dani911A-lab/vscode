const addIcon = document.getElementById("addIcon");
const cardsContainer = document.getElementById("cardsContainer");
const filterIcon = document.getElementById("filterIcon");

// Crear label de filtro seleccionado
let activeFilterLabel = document.createElement("span");
activeFilterLabel.id = "activeFilterLabel";
activeFilterLabel.style.fontSize = "12px";
activeFilterLabel.style.color = "#555";
activeFilterLabel.style.backgroundColor = "#ddd";
activeFilterLabel.style.padding = "2px 6px";
activeFilterLabel.style.borderRadius = "6px";
activeFilterLabel.style.marginRight = "6px";
activeFilterLabel.style.display = "none"; // oculto inicialmente
filterIcon.parentElement.insertBefore(activeFilterLabel, filterIcon);

// Crear menú flotante del filtro
let filterMenu = document.createElement("div");
filterMenu.style.position = "absolute";
filterMenu.style.top = "36px";
filterMenu.style.right = "0";
filterMenu.style.backgroundColor = "white";
filterMenu.style.border = "1px solid #aaa";
filterMenu.style.borderRadius = "6px";
filterMenu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
filterMenu.style.display = "none";
filterMenu.style.flexDirection = "column";
filterMenu.style.zIndex = "1500";
["TODAS", "CUMPLIDAS", "PENDIENTES", "DESTACADAS"].forEach(optionText => {
  let option = document.createElement("div");
  option.textContent = optionText;
  option.style.padding = "6px 12px";
  option.style.cursor = "pointer";
  option.addEventListener("mouseenter", () => option.style.backgroundColor = "#f0f0f0");
  option.addEventListener("mouseleave", () => option.style.backgroundColor = "white");
  filterMenu.appendChild(option);
});
filterIcon.parentElement.appendChild(filterMenu);

filterIcon.addEventListener("click", () => {
  filterMenu.style.display = filterMenu.style.display === "flex" ? "none" : "flex";
});

// Función para aplicar filtro
function applyFilter(value) {
  activeFilterLabel.textContent = value === "TODAS" ? "" : value;
  activeFilterLabel.style.display = value === "TODAS" ? "none" : "inline-block";
  filterMenu.style.display = "none";

  const allSwipeWrappers = document.querySelectorAll(".swipe-wrapper");
  allSwipeWrappers.forEach(wrapper => {
    const swipeCard = wrapper.querySelector(".swipe-card");

    if (value === "TODAS") {
      wrapper.style.display = "flex"; // mostrar todas
    } else if (value === "CUMPLIDAS") {
      wrapper.style.display = swipeCard.classList.contains("completed") ? "flex" : "none";
    } else if (value === "PENDIENTES") {
      wrapper.style.display = !swipeCard.classList.contains("completed") ? "flex" : "none";
    } else if (value === "DESTACADAS") {
      wrapper.style.display = swipeCard.classList.contains("highlighted") ? "flex" : "none";
    }
  });
}

// Asignar eventos a las opciones del menú
Array.from(filterMenu.children).forEach(option => {
  option.addEventListener("click", () => {
    applyFilter(option.textContent);
  });
});

const welcomeMessage = document.createElement("div");
welcomeMessage.id = "welcomeMessage";
welcomeMessage.textContent = "Bienvenida Andreita a tu espacio de trabajo, Preciona el icono de (+) de la parte superior izquierda.";
welcomeMessage.style.position = "absolute";
welcomeMessage.style.top = "50%";
welcomeMessage.style.left = "50%";
welcomeMessage.style.transform = "translate(-50%, -50%)";
welcomeMessage.style.fontSize = "18px";
welcomeMessage.style.color = "#555";
welcomeMessage.style.textAlign = "center";
welcomeMessage.style.pointerEvents = "none"; // no interfiere con clics
cardsContainer.appendChild(welcomeMessage);

addIcon.addEventListener("click", () => {
  const card = document.createElement("div");
  card.className = "card";

  // Input principal
  const mainInput = document.createElement("input");
  mainInput.className = "main-input";
  mainInput.type = "text";
  mainInput.placeholder = "Principal";

  // Input secundario
  const secondaryInput = document.createElement("input");
  secondaryInput.className = "secondary-input";
  secondaryInput.type = "text";
  secondaryInput.placeholder = "Secundario";

  // Botón guardar
  const saveBtn = document.createElement("button");
  saveBtn.className = "save-btn";
  saveBtn.textContent = "💾";

  // Botón editar
  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "✏️";
  editBtn.style.display = "none";

  // Botón "destacar"
  const highlightBtn = document.createElement("button");
  highlightBtn.className = "highlight-btn";
  highlightBtn.textContent = "☆";
  highlightBtn.style.fontSize = "16px";

  // Botón detalles
  const detailsBtn = document.createElement("button");
  detailsBtn.className = "details-btn";
  detailsBtn.textContent = "➕ Detalles";

  // Contenedor detalles
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "details-container";

  // Apartado 1: Empresas
  const row1 = document.createElement("div");
  row1.className = "detail-row";
  const label1 = document.createElement("label");
  label1.textContent = "Empresas:";
  const select1 = document.createElement("select");
  const placeholderOption1 = document.createElement("option");
  placeholderOption1.textContent = "Selecciona empresa";
  placeholderOption1.disabled = true;
  placeholderOption1.selected = true;
  select1.appendChild(placeholderOption1);
  for (let i = 1; i <= 13; i++) {
    const option = document.createElement("option");
    option.value = `empresa${i}`;
    option.textContent = `empresa${i}`;
    select1.appendChild(option);
  }
  const tagsContainer1 = document.createElement("div");
  tagsContainer1.className = "tags-container";
  select1.addEventListener("change", () => {
    const value = select1.value;
    if (value && !Array.from(tagsContainer1.children).some(span => span.textContent.includes(value))) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = value + " ×";
      tag.addEventListener("click", () => tag.remove());
      tagsContainer1.appendChild(tag);
    }
    select1.selectedIndex = 0;
  });
  row1.appendChild(label1);
  row1.appendChild(select1);
  row1.appendChild(tagsContainer1);
  detailsContainer.appendChild(row1);

  // Apartado 2: Personas
  const row2 = document.createElement("div");
  row2.className = "detail-row";
  const label2 = document.createElement("label");
  label2.textContent = "Personas:";
  const select2 = document.createElement("select");
  const placeholderOption2 = document.createElement("option");
  placeholderOption2.textContent = "Selecciona persona";
  placeholderOption2.disabled = true;
  placeholderOption2.selected = true;
  select2.appendChild(placeholderOption2);
  for (let i = 1; i <= 20; i++) {
    const option = document.createElement("option");
    option.value = `persona${i}`;
    option.textContent = `persona${i}`;
    select2.appendChild(option);
  }
  const tagsContainer2 = document.createElement("div");
  tagsContainer2.className = "tags-container";
  select2.addEventListener("change", () => {
    const value = select2.value;
    if (value && !Array.from(tagsContainer2.children).some(span => span.textContent.includes(value))) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = value + " ×";
      tag.addEventListener("click", () => tag.remove());
      tagsContainer2.appendChild(tag);
    }
    select2.selectedIndex = 0;
  });
  row2.appendChild(label2);
  row2.appendChild(select2);
  row2.appendChild(tagsContainer2);
  detailsContainer.appendChild(row2);

  // Apartado 3
  const row3 = document.createElement("div");
  row3.className = "detail-row";
  const label3 = document.createElement("label");
  label3.textContent = "Observaciones:";
  const input3 = document.createElement("input");
  input3.type = "text";
  input3.placeholder = "Detalle Observacion";
  row3.appendChild(label3);
  row3.appendChild(input3);
  detailsContainer.appendChild(row3);

  detailsContainer.style.display = "none";

  // Programar
  const scheduleLabel = document.createElement("span");
  scheduleLabel.textContent = "Programar:";
  scheduleLabel.className = "schedule-label";
  scheduleLabel.style.marginRight = "4px";
  scheduleLabel.style.fontSize = "14px";       
  scheduleLabel.style.color = "#666";          

  const scheduleInput = document.createElement("input");
  scheduleInput.type = "date";
  scheduleInput.className = "schedule-input";
  scheduleInput.style.border = "1px solid #ccc";
  scheduleInput.style.borderRadius = "6px";
  scheduleInput.style.backgroundColor = "#f0f0f0"; 
  scheduleInput.style.padding = "2px 6px";        
  scheduleInput.style.fontSize = "14px";          
  scheduleInput.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";

  const scheduleInfo = document.createElement("span");
  scheduleInfo.className = "schedule-info";
  scheduleInfo.style.marginLeft = "8px";
  scheduleInfo.style.fontWeight = "bold";
  scheduleInfo.style.fontSize = "14px";           
  scheduleInfo.style.color = "#333"; 

  scheduleInput.addEventListener("change", () => {
    if (!scheduleInput.value) { scheduleInfo.textContent = ""; return; }
    const selectedDate = new Date(scheduleInput.value);
    const today = new Date();
    selectedDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = selectedDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      scheduleInfo.textContent = "Hoy";
      scheduleInfo.style.color = "green";
    } else if (diffDays > 0) {
      scheduleInfo.textContent = `A ${diffDays} día${diffDays>1?'s':''}`;
      scheduleInfo.style.color = "green";
    } else {
      scheduleInfo.textContent = `${Math.abs(diffDays)} día${Math.abs(diffDays)>1?'s':''} retraso`;
      scheduleInfo.style.color = "red";
    }
  });

  // Eventos botones
  detailsBtn.addEventListener("click", () => {
    detailsContainer.style.display = detailsContainer.style.display === "none" ? "flex" : "none";
  });
  saveBtn.addEventListener("click", () => {
    mainInput.setAttribute("readonly", true);
    secondaryInput.setAttribute("readonly", true);
    select1.disabled = true;
    select2.disabled = true;
    input3.setAttribute("readonly", true);
    scheduleInput.disabled = true;
    saveBtn.style.display = "none";
    editBtn.style.display = "inline";
  });
  editBtn.addEventListener("click", () => {
    mainInput.removeAttribute("readonly");
    secondaryInput.removeAttribute("readonly");
    select1.disabled = false;
    select2.disabled = false;
    input3.removeAttribute("readonly");
    scheduleInput.disabled = false;
    editBtn.style.display = "none";
    saveBtn.style.display = "inline";
  });
 highlightBtn.addEventListener("click", () => {
  if(card.classList.contains("highlighted")) {
    card.classList.remove("highlighted");
    swipeCard.classList.remove("highlighted"); // agregado
    card.style.backgroundColor = "white";
    highlightBtn.textContent = "☆";
  } else {
    card.classList.add("highlighted");
    swipeCard.classList.add("highlighted"); // agregado
    card.style.backgroundColor = "#fef08a";
    highlightBtn.textContent = "★";
  }
});

  // Construir tarjeta
  card.appendChild(mainInput);
  card.appendChild(secondaryInput);
  card.appendChild(detailsContainer);

  const actionsRow = document.createElement("div");
  actionsRow.className = "actions-row";
  actionsRow.style.display = "flex";
  actionsRow.style.alignItems = "center";
  actionsRow.style.gap = "6px";

  actionsRow.appendChild(saveBtn);
  actionsRow.appendChild(editBtn);
  actionsRow.appendChild(detailsBtn);
  actionsRow.appendChild(scheduleLabel);
  actionsRow.appendChild(scheduleInput);
  actionsRow.appendChild(scheduleInfo);
  actionsRow.appendChild(highlightBtn);

  card.appendChild(actionsRow);

  // Swipe
  const swipeWrapper = document.createElement("div");
  swipeWrapper.className = "swipe-wrapper";
  const swipeCard = document.createElement("div");
  swipeCard.className = "swipe-card";

  while(card.firstChild) { swipeCard.appendChild(card.firstChild); }

  const swipeActions = document.createElement("div");
  swipeActions.className = "swipe-actions";
  swipeActions.style.display = "flex";
  swipeActions.style.flexDirection = "column"; 
  swipeActions.style.justifyContent = "flex-start"; 
  swipeActions.style.alignItems = "center";
  swipeActions.style.width = "50px";
  swipeActions.style.right = "0";
  swipeActions.style.top = "0";
  swipeActions.style.bottom = "0";
  swipeActions.style.position = "absolute";
  swipeActions.style.backgroundColor = "transparent";

  const completeBtn = document.createElement("button");
  completeBtn.className = "swipe-btn complete-btn";
  completeBtn.textContent = "✅";
  completeBtn.style.width = "36px";
  completeBtn.style.height = "36px";
  completeBtn.style.margin = "4px 0";

  const removeBtn = document.createElement("button");
  removeBtn.className = "swipe-btn remove-btn";
  removeBtn.textContent = "🗑️";
  removeBtn.style.width = "36px";
  removeBtn.style.height = "36px";
  removeBtn.style.margin = "4px 0";

  swipeActions.appendChild(completeBtn);
  swipeActions.appendChild(removeBtn);

  swipeWrapper.appendChild(swipeActions);
  swipeWrapper.appendChild(swipeCard);

  cardsContainer.insertBefore(swipeWrapper, cardsContainer.firstChild);

  // Swipe eventos
  let isDragging = false;
  let startX, currentX, translateX = 0;

  const handleStart = (e) => { if(e.target.tagName === "SELECT") return; isDragging=true; startX=e.type.includes("mouse")?e.clientX:e.touches[0].clientX; };
  const handleMove = (e) => { if(!isDragging) return; currentX=e.type.includes("mouse")?e.clientX:e.touches[0].clientX; translateX=Math.min(0,currentX-startX); swipeCard.style.transform=`translateX(${translateX}px)`; };
  const handleEnd = () => { isDragging=false; swipeCard.style.transform = translateX<-50?`translateX(-60px)`:`translateX(0)`; };

  swipeCard.addEventListener("mousedown", handleStart);
  swipeCard.addEventListener("touchstart", handleStart);
  swipeCard.addEventListener("mousemove", handleMove);
  swipeCard.addEventListener("touchmove", handleMove);
  swipeCard.addEventListener("mouseup", handleEnd);
  swipeCard.addEventListener("mouseleave", handleEnd);
  swipeCard.addEventListener("touchend", handleEnd);

  completeBtn.addEventListener("click", () => { swipeCard.classList.toggle("completed"); });
  removeBtn.addEventListener("click", () => { swipeWrapper.remove(); });
});
