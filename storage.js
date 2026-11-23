// LocalStorage layer. Data stays in this browser only (no cross-device sync).
const Store = {
  read(key) {
    try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : []; }
    catch { return []; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  // Drop records that point to templates which no longer exist.
  invites() { return this.read("is_invites").filter(i => i && TEMPLATES.some(t => t.id === i.tplId) && i.data); },
  saveInvite(s) {
    const list = this.invites();
    const now = new Date().toISOString();
    const id = s.id || "inv-" + Date.now();
    const rec = { id, tplId: s.tplId, data: s.data, palette: s.palette, font: s.font, decor: s.decor, updated: now };
    const i = list.findIndex(x => x.id === id);
    i >= 0 ? list[i] = { ...list[i], ...rec } : list.unshift({ ...rec, created: now });
    return this.write("is_invites", list) ? id : null;
  },
  deleteInvite(id) { return this.write("is_invites", this.invites().filter(i => i.id !== id)); },
  favs() { return this.read("is_favs"); },
  toggleFav(id) {
    const f = this.favs(); const i = f.indexOf(id);
    i >= 0 ? f.splice(i, 1) : f.push(id);
    this.write("is_favs", f); return i < 0;
  }
};
