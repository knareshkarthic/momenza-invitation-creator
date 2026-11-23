// Renders the invitation off-screen at full 1080x1350 so exports never depend on preview scaling.
async function renderCanvas(state) {
  await document.fonts.ready;
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-20000px;top:0;width:1080px;height:1350px";
  host.innerHTML = invHTML(state);
  document.body.appendChild(host);
  try {
    const f = FONTS[state.font];
    await Promise.all([f[0], f[1]].map(n => document.fonts.load(`40px "${n}"`)));
    return await html2canvas(host.querySelector(".inv"), { scale: 1, width: 1080, height: 1350, backgroundColor: null, useCORS: true });
  } finally { host.remove(); }
}
const fileName = s => { const t = tplById(s.tplId); return (t.category + " " + t.name).replace(/&/g, "and").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "") + "_Invitation"; };
async function downloadPNG(state) {
  const c = await renderCanvas(state);
  const a = document.createElement("a");
  a.download = fileName(state) + ".png"; a.href = c.toDataURL("image/png"); a.click();
}
async function downloadPDF(state) {
  const c = await renderCanvas(state);
  const pdf = new window.jspdf.jsPDF({ unit: "px", format: [1080, 1350], orientation: "portrait" });
  pdf.addImage(c.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 1080, 1350);
  pdf.save(fileName(state) + ".pdf");
}
