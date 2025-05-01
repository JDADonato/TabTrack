let tabs = [];
let currentTabIndex = 0;

// Save state to localStorage
function saveState() {
  localStorage.setItem('tabsData', JSON.stringify(tabs));
  localStorage.setItem('currentTabIndex', currentTabIndex);
}

// Load state from localStorage
function loadState() {
  const savedTabs = localStorage.getItem('tabsData');
  const savedIndex = localStorage.getItem('currentTabIndex');

  if (savedTabs) tabs = JSON.parse(savedTabs);
  if (savedIndex !== null) currentTabIndex = parseInt(savedIndex);
}

function createTab(title = "Untitled", nameList = []) {
  const tab = {
    title,
    list: nameList.map(name => ({ name, paid: false, timestamp: null }))
  };

  const insertAt = currentTabIndex + 1;
  tabs.splice(insertAt, 0, tab);
  currentTabIndex = insertAt;

  renderTabs();
  renderTabContent();
  saveState();
}

function renderTabs() {
  const tabsDiv = document.getElementById("tabs");
  tabsDiv.innerHTML = '';
  tabs.forEach((tab, i) => {
    const button = document.createElement("button");
    button.textContent = tab.title;
    button.className = i === currentTabIndex ? 'active' : '';
    button.onclick = (e) => {
      e.preventDefault();
      currentTabIndex = i;
      renderTabs();
      renderTabContent();
      saveState();
    };
    button.oncontextmenu = (e) => {
      e.preventDefault();
      currentTabIndex = i;
      showTabMenu(e.pageX, e.pageY);
    };
    button.onmousedown = (e) => {
      if (e.button === 0 && e.detail === 2) {
        currentTabIndex = i;
        showTabMenu(e.pageX, e.pageY);
      }
    };
    tabsDiv.appendChild(button);
  });
}

function renderTabContent() {
  const tab = tabs[currentTabIndex];
  const container = document.getElementById("tabContent");
  const checklistHTML = tab.list.map((entry, idx) => `
    <li>
      <span>
        <input type="text" class="editable-name" value="${entry.name}" onchange="updateName(${idx}, this.value)" />
        <small>${entry.timestamp || ''}</small>
      </span>
      <input type="checkbox" ${entry.paid ? 'checked' : ''} onclick="confirmCheck(this, ${idx})" />
    </li>
  `).join('');
  container.innerHTML = `
    <div class="checklist">
      <input type="text" value="${tab.title}" onchange="updateTabTitle(this.value)" />
      <ul>${checklistHTML}</ul>
    </div>
  `;
}

function updateTabTitle(newTitle) {
  tabs[currentTabIndex].title = newTitle;
  renderTabs();
  saveState();
}

function updateName(index, newName) {
  tabs[currentTabIndex].list[index].name = newName;
  saveState();
}

function getDateTime() {
  const now = new Date();
  return now.toLocaleString();
}

function confirmCheck(checkbox, index) {
  checkbox.checked = !checkbox.checked;
  setTimeout(() => {
    const entry = tabs[currentTabIndex].list[index];
    const action = !checkbox.checked ? 'mark as PAID' : 'mark as UNPAID';
    if (confirm(`Confirm to ${action} for "${entry.name}"?`)) {
      entry.paid = !checkbox.checked;
      entry.timestamp = `[${entry.paid ? 'PAID' : 'UNPAID'}] ${getDateTime()}`;
      renderTabContent();
      saveState();
    }
  }, 10);
}

// ==== Modal for Editing Names ====

function toggleModal() {
  const modal = document.getElementById("nameModal");
  const textarea = document.getElementById("bulkNames");
  if (modal.style.display === "block") {
    modal.style.display = "none";
  } else {
    textarea.value = tabs[currentTabIndex].list.map(e => e.name).join("\n");
    modal.style.display = "block";
  }
}

function saveNames() {
  const input = document.getElementById("bulkNames").value;
  const names = input.split('\n').map(n => n.trim()).filter(n => n);
  if (names.length === 0) return alert("Please enter at least one name.");
  tabs[currentTabIndex].list = names.map(name => ({ name, paid: false, timestamp: null }));
  toggleModal();
  renderTabContent();
  saveState();
}

document.getElementById("editNames").onclick = toggleModal;

// ==== Tab Menu (Right Click / Double Click) ====

function showTabMenu(x, y) {
  const menu = document.getElementById("tabMenu");
  menu.style.left = x + "px";
  menu.style.top = y + "px";
  menu.style.display = "block";
  document.addEventListener("click", hideTabMenu);
}

function hideTabMenu() {
  document.getElementById("tabMenu").style.display = "none";
  document.removeEventListener("click", hideTabMenu);
}

function renameTab() {
  const newName = prompt("Enter new name for the tab:", tabs[currentTabIndex].title);
  if (newName) {
    tabs[currentTabIndex].title = newName;
    renderTabs();
    renderTabContent();
    saveState();
  }
  hideTabMenu();
}

function deleteTab() {
  if (confirm(`Delete tab "${tabs[currentTabIndex].title}"?`)) {
    tabs.splice(currentTabIndex, 1);
    currentTabIndex = Math.max(0, currentTabIndex - 1);
    if (tabs.length === 0) {
      createTab("New List");
    }
    renderTabs();
    renderTabContent();
    saveState();
  }
  hideTabMenu();
}

// ==== Init ====

document.getElementById("addTab").onclick = () => {
  createTab("Untitled");
};

window.onload = () => {
  loadState();
  if (tabs.length === 0) {
    createTab("Master List", [
      "ABOGADO, RALPH LOUISE S.", "ARIOLA, ARIANA L.", "ATANANTE, IOANN R.",
      "BERMAS, KEITH DEXTER P.", "BOTE, CLAIRE ANDREI S.", "BUENAFLOR, THOMAS NATHAN B.",
      "BULAN, LYKA MAY P.", "CARINAN, CHARIZZE ANN B.", "CATALUÑA, JULIA CARMELLI A.",
      "CIPCON, CZEDRIC ROMMEN J.", "CONSTANTE, CLYDE WILLIAM S.", "DELA TORRE, TANITHA B.",
      "DE MESA, RIANNA RAE S.", "DEOCAREZA, SHANE NICOLE S.", "DIPAD, BENITO III B.",
      "DY, JAN CARLO B.", "ESQUEJO, KRISHA D.", "FAJARDO, GRACE PAULINE E.",
      "FELIAS, CAMILLE ANNE P.", "FLOR, ALLIAH MARIEL D.", "GALICIA, KRISHMER A.",
      "GUERIÑA, MA. JANNELLE V.", "LOMEDA, JAIME JR S.", "MARISCOTES, CHARLENE L.",
      "MENDIORO, JEZREEL KLEANNE B.", "MONTAÑEZ, PRINCESS RINA P.", "MORALES, MARIAN SAMANTHA S.",
      "MORICO, CHRISTIAN JOSH E.", "NIETO, HANNAH LOIS B.", "OBAL, KAELA GABRIELLE R.",
      "OPENARIA, ANNE MARGARET A.", "PAREJA, EUNICE GENOR C.", "RAMOS, JULIA JACINTH C.",
      "REBEUNO, ERICH JOHN B.", "REMENTILLO, SAMANTHA D.", "REMOLACIO, CARRHEE JUSTHIN M.",
      "RICO, EVA BEATRIZ H.", "TRILLANES, REMOS IVAN C.", "VOSOTROS, ZANDER B."
    ]);
  } else {
    renderTabs();
    renderTabContent();
  }
};
