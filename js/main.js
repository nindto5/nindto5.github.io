function switchPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
  document.querySelectorAll(".nav-link").forEach(a => a.classList.remove("active"));

  const target = document.getElementById("page-" + name);
  if (target) target.classList.add("visible");

  const link = document.querySelector(`.nav-link[data-page="${name}"]`);
  if (link) link.classList.add("active");
}

document.querySelectorAll(".nav-link").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    switchPage(a.dataset.page);
  });
});

const gotoProjects = document.getElementById("goto-projects");
if (gotoProjects) {
  gotoProjects.addEventListener("click", () => switchPage("projects"));
}

switchPage("projects");

function buildThumb(project, category) {
  const wrap = document.createElement("div");
  wrap.className = "proj-thumb";

  if (project.image) {
    const img = document.createElement("img");
    img.src = IMG_BASE[category] + project.image;
    img.alt = project.title + " preview";
    img.loading = "lazy";

    img.onerror = () => {
      wrap.innerHTML = "";
      wrap.appendChild(makePlaceholder("Image coming soon"));
    };

    wrap.appendChild(img);
  } else {
    wrap.appendChild(makePlaceholder("Preview coming soon"));
  }

  return wrap;
}

function makePlaceholder(text) {
  const div = document.createElement("div");
  div.className = "proj-thumb-placeholder";
  div.textContent = text;
  return div;
}

function buildGrid(gridId, category) {
  const container = document.getElementById(gridId);
  if (!container) return;

  const items = PROJECTS[category];
  if (!items || items.length === 0) return;

  items.forEach(project => {
    const card = document.createElement("div");
    card.className = "proj-card";

    card.appendChild(buildThumb(project, category));

    const body = document.createElement("div");
    body.className = "proj-card-body";
    body.innerHTML = `
      <div class="proj-card-title">${project.title}</div>
      <div class="proj-card-desc">${project.desc}</div>
    `;
    card.appendChild(body);

    card.addEventListener("click", () => openModal(project, category));

    container.appendChild(card);
  });
}

buildGrid("grid-report",    "report");
buildGrid("grid-dashboard", "dashboard");
buildGrid("grid-research",  "research");
buildGrid("grid-web",       "web");
buildGrid("grid-dataset",   "dataset");

const overlay       = document.getElementById("overlay");
const modalThumb    = document.getElementById("modal-thumb");
const modalCategory = document.getElementById("modal-category");
const modalTitle    = document.getElementById("modal-title");
const modalDesc     = document.getElementById("modal-desc");
const modalTagsEl   = document.getElementById("modal-tags");
const modalLink     = document.getElementById("modal-link");

function openModal(project, category) {
  modalThumb.innerHTML = "";

  if (project.video) {
    const vid = document.createElement("video");
    vid.src      = VID_BASE[category] + project.video;
    vid.autoplay = true;
    vid.loop     = true;
    vid.muted    = true;
    vid.controls = false;
    vid.playsInline = true;
    vid.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;";
    modalThumb.appendChild(vid);

  } else if (project.image) {
    const img = document.createElement("img");
    img.src   = IMG_BASE[category] + project.image;
    img.alt   = project.title + " preview";
    img.onerror = () => {
      modalThumb.innerHTML = `<div class="modal-thumb-placeholder">No preview available</div>`;
    };
    modalThumb.appendChild(img);

  } else {
    modalThumb.innerHTML = `<div class="modal-thumb-placeholder">Preview coming soon</div>`;
  }

  modalCategory.textContent = CATEGORY_NAMES[category] || category;
  modalTitle.textContent    = project.title;
  modalDesc.textContent     = project.longDesc || project.desc;

  modalTagsEl.innerHTML = project.tags
    .map(t => `<span class="modal-tag">${t}</span>`)
    .join("");

  modalLink.href = project.link || "#";
  if (!project.link || project.link === "#") {
    modalLink.textContent       = "Link Unavailable";
    modalLink.style.pointerEvents = "none";
    modalLink.style.opacity       = "0.5";
  } else {
    modalLink.textContent       = "View Project →";
    modalLink.style.pointerEvents = "";
    modalLink.style.opacity       = "";
  }

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const vid = modalThumb.querySelector("video");
  if (vid) vid.pause();

  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

overlay.addEventListener("click", e => {
  if (e.target === overlay) closeModal();
});

document.getElementById("close-btn").addEventListener("click", closeModal);
document.getElementById("modal-close-btn").addEventListener("click", closeModal);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});