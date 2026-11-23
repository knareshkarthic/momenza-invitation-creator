// App: routing, gallery, editor, dashboard. Data lives in templates.js; storage in storage.js; export in download.js.
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const tplById = id => TEMPLATES.find(t => t.id === id);
let state = null, filter = "All", toastTimer;

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2800); }

/* ---- rendering helpers ---- */
function invHTML(s) {
  const p = PALETTES[s.palette], f = FONTS[s.font];
  const style = `--bg:${p.bg};--ink:${p.ink};--ac:${p.ac};--f1:'${f[0]}';--f2:'${f[1]}';--fs:${f[2]}`;
  return `<div class="vars" style="${style}">${tplById(s.tplId).render(s.data, s.decor, p)}</div>`;
}
const sampleState = id => { const t = tplById(id); return { tplId: id, data: { ...CATS[t.category].sample }, palette: t.palette, font: t.font, decor: true }; };
const fit = () => $$(".fit").forEach(f => { const i = $(".inv", f); if (i && f.clientWidth) i.style.transform = `scale(${f.clientWidth / 1080})`; });
const fitBox = s => `<div class="fit" role="img" aria-label="${esc(tplById(s.tplId).name)} invitation preview">${invHTML(s)}</div>`;

/* ---- router ---- */
function route() {
  const v = (location.hash.slice(1) || "home").split("?")[0];
  const view = ["home", "templates", "editor", "mine"].includes(v) ? v : "home";
  if (view === "editor" && !state) return void (location.hash = "#templates");
  $$(".view").forEach(s => s.hidden = s.id !== "view-" + view);
  $$("#menu a:not(.btn)").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + view));
  $("#menu").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false");
  if (view === "templates") renderGallery(); if (view === "mine") renderDashboard();
  const anchor = ["how", "about"].includes(v) && $("#" + v); anchor ? anchor.scrollIntoView() : window.scrollTo(0, 0);
  fit();
}

/* ---- home ---- */
// Real photographs: drop files into assets/images (see README.txt there). A missing file is removed (no broken icon) and logged,
// so there are never broken-image icons. Without a file the card shows a plain tinted design.
const PHOTOS = {
  hero: ["hero/hero-celebration", "Guests celebrating at an elegant wedding reception"],
  Wedding: ["categories/wedding", "Wedding venue decorated with flowers"],
  Birthday: ["categories/birthday", "Birthday cake and balloons on a celebration table"],
  Housewarming: ["categories/housewarming", "Bright new home interior with fresh flowers"],
  Graduation: ["categories/graduation", "Graduates celebrating with caps and gowns"],
  "Baby Shower": ["categories/baby-shower", "Pastel baby shower decorations and table"],
  "General Event": ["categories/general-events", "Elegant party venue with celebration lighting"]
};
// Real <img> tags. If a file is missing, the image is removed (no broken icon), the card falls back to a plain tint, and the console says which file to add.
const photoSpan = (key, eager) => `<span class="ph"><img class="category-image" src="assets/images/${PHOTOS[key][0]}.jpg" alt="${PHOTOS[key][1]}" ${eager ? "" : 'loading="lazy"'} decoding="async"></span>`;
document.addEventListener("error", e => {
  const i = e.target; if (i.tagName !== "IMG" || !i.classList.contains("category-image")) return;
  console.warn("MOMENZA: photo file not found:", i.getAttribute("src"));
  const host = i.closest(".has-photo"); i.closest(".ph").remove(); if (host) host.classList.remove("has-photo");
}, true);

// Collections link into the gallery. Add an object here to add a section; counts are always real.
const COLLECTIONS = [
  { name: "Royal Wedding Collection", cat: "Wedding", stys: ["traditional", "luxury"] },
  { name: "Modern Birthday Collection", cat: "Birthday", stys: ["modern", "bold"] },
  { name: "Floral Collection", q: "floral" },
  { name: "Minimalist Collection", stys: ["minimal"] }
];
const collList = c => TEMPLATES.filter(t => (!c.cat || t.category === c.cat) && (!c.stys || c.stys.includes(t.style)) && (!c.q || t.q.includes(c.q)));
function syncControls() { $("#q").value = query; $("#f-col").value = colF; $("#f-sty").value = styF; $("#f-sort").value = sortBy; }
function openCollection(i) { coll = COLLECTIONS[i]; filter = "All"; query = colF = styF = ""; sortBy = "featured"; syncControls(); renderGallery(true, true); location.hash = "#templates"; }
function openCategory(c) { coll = null; filter = c; query = colF = styF = ""; sortBy = "featured"; syncControls(); renderGallery(true); location.hash = "#templates"; }
function openSorted(k) { coll = null; filter = "All"; query = colF = styF = ""; sortBy = k; syncControls(); renderGallery(true); location.hash = "#templates"; }
function section(title, list, total, link, cls) {
  return `<section class="wrap block"><div class="sec-head"><h2>${title}</h2><button class="link" ${link}>View all ${total} →</button></div><div class="${cls}">${list.map(tplCard).join("")}</div></section>`;
}
function homeLists() {
  const feat = TEMPLATES.filter(t => t.featured), recent = [...TEMPLATES].sort((a, b) => b.added - a.added);
  $("#collections").innerHTML = section("Featured invitations", feat.slice(0, 5), feat.length, 'data-go="featured"', "mag") +
    COLLECTIONS.map((c, i) => { const l = collList(c); return l.length ? section(c.name, l.slice(0, 4), l.length, `data-coll="${i}"`, "row4") : ""; }).join("") +
    section("Recently added", recent.slice(0, 4), TEMPLATES.length, 'data-go="recent"', "row4");
}
function renderHome() {
  $("#hero-art").className = "hero-art has-photo";
  $("#hero-art").innerHTML = photoSpan("hero", true) + [["wedding-02", "a"], ["birthday-02", "b"], ["house-01", "c"]].map(([id, k]) => fitBox(sampleState(id)).replace('class="fit"', `class="fit ${k}"`)).join("");
  $("#hero-meta").textContent = `${TEMPLATES.length} original designs across ${Object.keys(CATS).length} occasions. Free, with no sign-up.`;
  $("#cat-grid").innerHTML = Object.keys(CATS).map(c => { const n = TEMPLATES.filter(t => t.category === c).length, label = c === "General Event" ? "General Events" : c;
    return `<button class="cat-card has-photo" data-cat="${c}" aria-label="Browse ${label} invitations">${photoSpan(c)}<span class="cat-meta"><span><span class="cat-name">${label}</span><span class="cat-n">${n} designs</span></span><span class="arrow" aria-hidden="true">→</span></span></button>`; }).join("");
  homeLists();
}

/* ---- gallery ---- */
function tplCard(t) {
  const fav = Store.favs().includes(t.id);
  return `<article class="card">${fitBox(sampleState(t.id))}<div class="card-b"><span class="tag">${t.category}, ${t.style}</span><h3>${t.name}</h3><p>${t.desc}</p>
  <div class="row"><button class="btn" data-use="${t.id}">Customize this template</button><button class="fav" data-fav="${t.id}" aria-pressed="${fav}" aria-label="Favourite ${t.name}">${fav ? "♥" : "♡"}</button></div></div></article>`;
}
const PAGE = 12; let coll = null, page = 1, query = "", colF = "", styF = "", sortBy = "featured";
function galleryList() {
  const words = query.split(/\s+/).filter(Boolean), inColl = coll ? new Set(collList(coll)) : null;
  const list = TEMPLATES.filter(t => (filter === "All" || t.category === filter) && (!colF || t.col.split(" ").includes(colF)) && (!styF || t.style === styF) && words.every(w => t.q.includes(w)) && (!inColl || inColl.has(t)));
  if (sortBy === "az") list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "recent") list.sort((a, b) => b.added - a.added);
  else list.sort((a, b) => b.featured - a.featured || a.added - b.added);
  return list;
}
function pagerHTML(pages) {
  const items = [];
  for (let n = 1; n <= pages; n++) { if (n === 1 || n === pages || Math.abs(n - page) <= 1) items.push(n); else if (items[items.length - 1] !== "…") items.push("…"); }
  return `<button type="button" class="pg" data-page="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="Previous page">←</button>` +
    items.map(n => n === "…" ? `<span class="pg-gap">…</span>` : `<button type="button" class="pg" data-page="${n}" aria-current="${n === page}" aria-label="Page ${n}">${n}</button>`).join("") +
    `<button type="button" class="pg" data-page="${page + 1}" ${page === pages ? "disabled" : ""} aria-label="Next page">→</button>`;
}
function renderGallery(reset, keepColl) {
  if (reset) { page = 1; if (!keepColl) coll = null; }
  $("#chips").innerHTML = ["All", ...Object.keys(CATS)].map(c => `<button class="chip" data-filter="${c}" aria-pressed="${c === filter}">${c}</button>`).join("");
  const list = galleryList(), pages = Math.max(1, Math.ceil(list.length / PAGE)); page = Math.min(Math.max(page, 1), pages);
  const start = (page - 1) * PAGE, vis = list.slice(start, start + PAGE), g = $("#gallery");
  $("#count").textContent = list.length ? `${coll ? coll.name + ". " : ""}Showing ${start + 1}–${start + vis.length} of ${list.length} templates` + (list.length < TEMPLATES.length ? ` (${TEMPLATES.length} in total)` : "") + `. Page ${page} of ${pages}.` : "";
  g.innerHTML = list.length ? vis.map(tplCard).join("") : `<div class="empty"><p>No templates match your search. Try a different word, or clear the filters.</p><button class="btn" data-reset="1">Clear search and filters</button></div>`;
  $("#pager").innerHTML = pages > 1 ? pagerHTML(pages) : ""; $("#q-clear").hidden = !query;
  g.classList.remove("fade"); void g.offsetWidth; g.classList.add("fade");
  fit();
}
function goPage(n) { page = n; renderGallery(); $("#count").scrollIntoView({ behavior: "smooth", block: "start" }); }
function resetGallery() { query = colF = styF = ""; filter = "All"; sortBy = "featured"; syncControls(); renderGallery(true); }
function initGalleryControls() {
  const cap = w => w[0].toUpperCase() + w.slice(1);
  const cols = ["gold", "red", "pink", "orange", "yellow", "green", "blue", "teal", "purple", "black", "white", "grey", "beige"];
  const styles = [...new Set(TEMPLATES.map(t => t.style))].sort();
  $("#f-col").innerHTML = `<option value="">All colours</option>` + cols.map(c => `<option value="${c}">${cap(c)}</option>`).join("");
  $("#f-sty").innerHTML = `<option value="">All styles</option>` + styles.map(c => `<option value="${c}">${cap(c)}</option>`).join("");
  $("#q").addEventListener("input", e => { query = e.target.value.trim().toLowerCase(); renderGallery(true); });
  $("#q-clear").addEventListener("click", () => { query = ""; $("#q").value = ""; renderGallery(true); $("#q").focus(); });
  $("#f-col").addEventListener("change", e => { colF = e.target.value; renderGallery(true); });
  $("#f-sty").addEventListener("change", e => { styF = e.target.value; renderGallery(true); });
  $("#f-sort").addEventListener("change", e => { sortBy = e.target.value; renderGallery(true); });
}

/* ---- editor ---- */
function openEditor(s) { state = s; buildForm(); updatePreview(); location.hash = "#editor"; }
function buildForm() {
  const t = tplById(state.tplId), cat = CATS[t.category];
  $("#ed-title").textContent = t.name;
  $("#fields").innerHTML = cat.fields.map(([k, label, type]) => {
    const v = esc(state.data[k] || ""), req = k === "main";
    const input = type === "textarea" ? `<textarea data-k="${k}" maxlength="220">${v}</textarea>` : `<input type="${type}" data-k="${k}" value="${v}" ${type === "text" ? 'maxlength="80"' : ""}>`;
    return `<label class="f">${label}${req ? " *" : ""}${input}<span class="err" data-err="${k}"></span></label>`;
  }).join("");
  $("#palettes").innerHTML = Object.entries(PALETTES).map(([k, p]) => `<button type="button" class="sw" data-pal="${k}" aria-label="${p.label}" title="${p.label}" aria-pressed="${k === state.palette}" style="background:${p.bg}"><i style="background:${p.ac}"></i></button>`).join("");
  $("#font").innerHTML = Object.entries(FONTS).map(([k, f]) => `<option value="${k}" ${k === state.font ? "selected" : ""}>${f[3]}</option>`).join("");
  $("#decor").checked = state.decor;
}
function updatePreview() { $("#preview").innerHTML = fitBox(state); fit(); }
function validate() {
  const ok = (state.data.main || "").trim().length > 0;
  $('[data-err="main"]').textContent = ok ? "" : "Enter a name or title to continue.";
  if (!ok) { $('[data-k="main"]').focus(); toast("Add a name or title first."); }
  return ok;
}
async function runExport(fn, label) {
  if (!validate()) return;
  toast(`Preparing ${label}…`);
  try { await fn(state); toast(`${label} downloaded.`); }
  catch (e) { console.error(e); toast(`Couldn't create the ${label}. Check your internet connection and try again.`); }
}

/* ---- dashboard ---- */
function renderDashboard() {
  const list = Store.invites();
  $("#saved").innerHTML = list.length ? list.map(i => `<article class="card">${fitBox(i)}<div class="card-b"><h3>${esc(i.data.main || "Untitled")}</h3><p>${tplById(i.tplId).name} · updated ${new Date(i.updated).toLocaleDateString("en-GB")}</p>
    <div class="row"><button class="btn" data-edit="${i.id}">Edit</button><button class="btn ghost" data-del="${i.id}">Delete</button></div></div></article>`).join("")
    : `<div class="empty"><p>No saved invitations yet.</p><a class="btn" href="#templates">Create your first invitation</a></div>`;
  const favs = Store.favs().map(tplById).filter(Boolean);
  $("#favs").innerHTML = favs.length ? favs.map(tplCard).join("") : `<div class="empty"><p>Tap the heart on a template to keep it here.</p></div>`;
  fit();
}

/* ---- events ---- */
document.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  const d = b.dataset;
  if (d.use) openEditor(sampleState(d.use));
  else if (d.page) goPage(+d.page);
  else if (d.coll !== undefined) openCollection(+d.coll);
  else if (d.cat) openCategory(d.cat);
  else if (d.go) openSorted(d.go);
  else if (d.filter) { filter = d.filter; renderGallery(true); }
  else if (d.reset) resetGallery();
  else if (d.fav) { const on = Store.toggleFav(d.fav); toast(on ? "Added to favourites." : "Removed from favourites."); refreshLists(); }
  else if (d.pal) { state.palette = d.pal; $$(".sw").forEach(s => s.setAttribute("aria-pressed", s === b)); updatePreview(); }
  else if (d.edit) { const i = Store.invites().find(x => x.id === d.edit); if (i) openEditor({ ...i }); }
  else if (d.del) { if (confirm("Delete this invitation? This can't be undone.")) { Store.deleteInvite(d.del); renderDashboard(); toast("Invitation deleted."); } }
});
function refreshLists() { const v = (location.hash.slice(1) || "home"); if (v === "templates") renderGallery(); else if (v === "mine") renderDashboard(); else { homeLists(); fit(); } }

$("#fields").addEventListener("input", e => { const k = e.target.dataset.k; if (!k) return; state.data[k] = e.target.value; if (k === "main") $('[data-err="main"]').textContent = ""; updatePreview(); });
$("#font").addEventListener("change", e => { state.font = e.target.value; updatePreview(); });
$("#decor").addEventListener("change", e => { state.decor = e.target.checked; updatePreview(); });
$("#form").addEventListener("submit", e => e.preventDefault());
$("#save").addEventListener("click", () => {
  if (!validate()) return;
  const id = Store.saveInvite(state);
  if (id) { state.id = id; toast("Saved. Find it under My invitations."); } else toast("Couldn't save. Browser storage may be full or blocked.");
});
$("#dl-png").addEventListener("click", () => runExport(downloadPNG, "PNG"));
$("#dl-pdf").addEventListener("click", () => runExport(downloadPDF, "PDF"));
$("#burger").addEventListener("click", () => { const o = $("#menu").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); });
window.addEventListener("hashchange", route);
window.addEventListener("resize", fit);

/* ---- init ---- */
$$("[data-brand]").forEach(n => n.textContent = BRAND.name);
document.title = `${BRAND.name} – Create invitations worth remembering`;
$("#year").textContent = new Date().getFullYear();
initGalleryControls(); renderHome(); route();
document.fonts.ready.then(fit);
