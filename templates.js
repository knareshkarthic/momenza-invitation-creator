// Template definitions + renderers. Add a template = add one object to TEMPLATES.
const BRAND = { name: "MOMENZA", tagline: "Make Every Moment Memorable." };   // brand lives here; data-brand elements read it

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtDate = v => { if (!v) return ""; const d = new Date(v + "T00:00"); return isNaN(d) ? esc(v) : d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); };
const fmtTime = v => { const m = /^(\d{1,2}):(\d{2})/.exec(v || ""); if (!m) return esc(v || ""); const h = +m[1]; return `${h % 12 || 12}:${m[2]} ${h >= 12 ? "PM" : "AM"}`; };

// Palettes: hex values are baked into SVG decorations so exports match the preview.
const PALETTES = {
  ivory:  { label: "Ivory & gold",  bg: "#fbf5e6", ink: "#3a2a16", ac: "#b58a2d" },
  blush:  { label: "Blush rose",    bg: "#fdecee", ink: "#4a2a33", ac: "#c2677a" },
  sunny:  { label: "Sunshine",      bg: "#ffe08a", ink: "#2b2350", ac: "#ff4f6d" },
  noir:   { label: "Noir & gold",   bg: "#121212", ink: "#f4ecd8", ac: "#c9a24a" },
  sage:   { label: "Sage garden",   bg: "#e6ecd9", ink: "#2f3b2a", ac: "#6b8a58" },
  navy:   { label: "Navy & gold",   bg: "#14213d", ink: "#f6f0dd", ac: "#e0b04a" },
  sky:    { label: "Sky blue",      bg: "#e4f0fa", ink: "#25415b", ac: "#5f9bd0" },
  coral:  { label: "Paper & coral", bg: "#f6efe6", ink: "#1f2a44", ac: "#e0573d" }
};
// [display font, body font, display size multiplier, label]
const FONTS = {
  classic:   ["Cinzel", "Cormorant Garamond", 0.8, "Classic capitals"],
  script:    ["Great Vibes", "Cormorant Garamond", 1.25, "Romantic script"],
  modern:    ["Poppins", "Poppins", 0.85, "Modern sans"],
  luxe:      ["Playfair Display", "Lora", 1, "Luxe serif"],
  editorial: ["DM Serif Display", "Poppins", 1, "Editorial"]
};

const cm = (venue = "Venue") => [["date", "Date", "date"], ["time", "Time", "time"], ["venue", venue, "text"], ["message", "Invitation message", "textarea"]];
const CATS = {
  Wedding: { icon: "Wedding", kick: "The wedding of", fields: [["main", "Couple names", "text"], ["sub", "Host / family names", "text"], ...cm()],
    sample: { main: "Arun & Priya", sub: "Together with their families", date: "2026-12-15", time: "18:30", venue: "The Grand Hall, Trichy", message: "Join us as we begin our journey together." } },
  Birthday: { kick: "Celebrate with us", fields: [["main", "Birthday person's name", "text"], ["age", "Age (optional)", "text"], ...cm()],
    sample: { main: "Meera", age: "25", date: "2026-11-30", time: "19:00", venue: "Skyline Terrace, Chennai", message: "Cake, music and a night to remember." } },
  Housewarming: { kick: "Housewarming", fields: [["main", "Family name", "text"], ...cm("New home address")],
    sample: { main: "The Kumar Family", date: "2026-12-06", time: "10:30", venue: "12, Lake View Road, Coimbatore", message: "Please bless our new home with your presence." } },
  Graduation: { kick: "Graduation celebration", fields: [["main", "Graduate's name", "text"], ["sub", "Qualification", "text"], ...cm()],
    sample: { main: "Karthik Raj", sub: "Bachelor of Technology, Information Technology", date: "2026-12-20", time: "17:00", venue: "Hotel Sangam, Trichy", message: "Join us as we celebrate this milestone." } },
  "Baby Shower": { kick: "Baby shower for", fields: [["main", "Parents' names", "text"], ...cm()],
    sample: { main: "Divya & Suresh", date: "2026-12-13", time: "16:00", venue: "Rose Garden Hall, Madurai", message: "A little one is on the way. Come celebrate!" } },
  "General Event": { kick: "You're invited", fields: [["main", "Event title", "text"], ["sub", "Host name", "text"], ...cm()],
    sample: { main: "Annual Tech Meetup", sub: "Hosted by the IT Association", date: "2026-12-10", time: "15:00", venue: "Seminar Hall, Block B", message: "An afternoon of talks, demos and conversation." } }
};

/* ---------- shared layout ---------- */
function build(cls, cat, d, decor) {
  const c = CATS[cat], n = (d.main || "").trim() || c.sample.main;
  const sz = n.length <= 14 ? 120 : n.length <= 22 ? 92 : n.length <= 34 ? 68 : 52;
  const when = [fmtDate(d.date), fmtTime(d.time)].filter(Boolean);
  return `<div class="inv ${cls}">${decor || ""}<div class="in"><p class="kick">${c.kick}</p>` +
    (d.age ? `<div class="age">${esc(d.age)}</div>` : "") +
    `<h1 class="main" style="font-size:calc(${sz}px*var(--fs))">${esc(n)}</h1>` +
    (d.sub ? `<p class="sub">${esc(d.sub)}</p>` : "") + `<div class="rule"></div>` +
    (d.message ? `<p class="msg">${esc(d.message)}</p>` : "") +
    `<div class="det">${when.length ? `<p class="when">${when.map(w => `<span>${w}</span>`).join("<i>•</i>")}</p>` : ""}` +
    (d.venue ? `<p class="venue">${esc(d.venue)}</p>` : "") + `</div></div></div>`;
}

/* ---------- SVG decorations (colours baked in) ---------- */
const svg = (cls, w, h, inner, vb) => `<svg class="${cls}" width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const corner = (pos, sx, sy, col) => svg("cn " + pos, 200, 200,
  `<g transform="translate(${sx < 0 ? 100 : 0} ${sy < 0 ? 100 : 0}) scale(${sx} ${sy})" fill="none" stroke="${col}" stroke-width="1.6"><path d="M4 96V28Q4 4 28 4h68"/><path d="M14 96V34Q14 14 34 14h62" opacity=".55"/><path d="M4 60Q30 60 30 34"/><path d="M20 96Q20 46 70 22"/><circle cx="30" cy="34" r="3.5" fill="${col}"/><circle cx="70" cy="22" r="2.5" fill="${col}"/></g>`, "0 0 100 100");
const royalDecor = p => `<i class="b1"></i><i class="b2"></i>` + corner("tl", 1, 1, p.ac) + corner("tr", -1, 1, p.ac) + corner("bl", 1, -1, p.ac) + corner("br", -1, -1, p.ac);

const flower = (x, y, r, a, b) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(t => `<ellipse cx="0" cy="${-r * .6}" rx="${r * .38}" ry="${r * .6}" fill="${a}" transform="rotate(${t})"/>`).join("")}<circle r="${r * .22}" fill="${b}"/></g>`;
const leaf = (x, y, rot, len, col) => `<ellipse cx="${x}" cy="${y}" rx="${len * .3}" ry="${len}" fill="${col}" opacity=".55" transform="rotate(${rot} ${x} ${y})"/>`;
function floralDecor(p) {
  const cluster = (x, y, k) => leaf(x + 110 * k, y + 40 * k, 60 * k, 90, p.ink) + leaf(x + 40 * k, y + 130 * k, 20 * k, 90, p.ink) + flower(x + 80 * k, y + 80 * k, 110, p.ac, "#fff6d8") + flower(x + 200 * k, y + 40 * k, 60, "#fff", p.ac) + flower(x + 30 * k, y + 210 * k, 60, "#fff", p.ac) + flower(x + 150 * k, y + 170 * k, 42, p.ac, "#fff");
  return `<i class="panel"></i>` + svg("fl", 1080, 1350, cluster(30, 30, 1) + cluster(1050, 1320, -1) + `<g transform="translate(1080 0) scale(-.6 .6)">${cluster(30, 30, 1)}</g><g transform="translate(0 1350) scale(.6 -.6)">${cluster(30, 30, 1)}</g>`);
}
const confetti = p => { const c = [p.ac, p.ink, "#fff", p.ac], s = [];
  [[90,110,40],[300,70,22],[620,150,30],[930,90,52],[1000,420,24],[70,430,26],[960,820,36],[880,1250,48],[200,1270,30],[1010,1090,20]].forEach(([x,y,r],i)=>s.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${c[i%4]}"/>`));
  [[470,60,34],[180,260,28],[810,300,30],[60,900,34]].forEach(([x,y,r],i)=>s.push(`<rect x="${x}" y="${y}" width="${r}" height="${r}" fill="${c[(i+1)%4]}" transform="rotate(${20+i*30} ${x} ${y})"/>`));
  return svg("cf", 1080, 1350, s.join("")); };
const luxDecor = p => `<i class="fr"></i><i class="fr2"></i>` + svg("burst", 600, 300, Array.from({ length: 25 }, (_, i) => { const a = Math.PI * (i / 24); return `<line x1="${300 - Math.cos(a) * 60}" y1="${300 - Math.sin(a) * 60}" x2="${300 - Math.cos(a) * 280}" y2="${300 - Math.sin(a) * 280}" stroke="${p.ac}" stroke-width="${i % 2 ? 1 : 2}"/>`; }).join(""));
const sprig = (x, y, rot, col) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0Q8 -140 0 -300" stroke="${col}" stroke-width="3" fill="none"/>${[1,2,3,4,5].map(i => `<ellipse cx="${i%2?18:-18}" cy="${-i*55}" rx="14" ry="34" fill="${col}" opacity=".7" transform="rotate(${i%2?40:-40} ${i%2?18:-18} ${-i*55})"/>`).join("")}</g>`;
const houseDecor = p => svg("house", 240, 200, `<g fill="none" stroke="${p.ac}" stroke-width="5" stroke-linejoin="round"><path d="M20 100L120 20l100 80"/><path d="M45 85v100h150V85"/><rect x="100" y="125" width="40" height="60"/><rect x="62" y="102" width="28" height="28"/><rect x="150" y="102" width="28" height="28"/></g><path d="M120 62c-10-14-26 0-14 12l14 12 14-12c12-12-4-26-14-12z" fill="${p.ac}"/>`) +
  svg("sp", 400, 400, sprig(40, 390, 12, p.ac), "0 0 400 400") + svg("sp r", 400, 400, sprig(360, 390, -12, p.ac), "0 0 400 400");
const gradDecor = p => `<i class="fr"></i>` + svg("cap", 300, 200, `<g fill="none" stroke="${p.ac}" stroke-width="5" stroke-linejoin="round"><path d="M150 20L20 75l130 55 130-55z" fill="${p.ac}" fill-opacity=".15"/><path d="M80 105v45q70 38 140 0v-45"/><path d="M260 82v70"/></g><circle cx="260" cy="160" r="8" fill="${p.ac}"/>`);
const star = (x, y, r, col) => `<polygon fill="${col}" points="${Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; return (x + Math.cos(a) * q).toFixed(1) + "," + (y + Math.sin(a) * q).toFixed(1); }).join(" ")}"/>`;
const cloud = (x, y, k, col) => `<g transform="translate(${x} ${y}) scale(${k})" fill="${col}"><circle cx="40" cy="50" r="34"/><circle cx="90" cy="38" r="44"/><circle cx="140" cy="52" r="32"/><rect x="40" y="52" width="100" height="32" rx="16"/></g>`;
const babyDecor = p => `<i class="fr"></i>` + svg("bb", 1080, 1350, cloud(90, 120, 1.2, "#fff") + cloud(760, 190, 1, "#fff") + cloud(700, 1130, 1.3, "#fff") + cloud(110, 1180, .9, "#fff") + star(520, 130, 28, p.ac) + star(930, 90, 18, p.ac) + star(210, 70, 16, p.ac) + star(980, 1030, 20, p.ac) + star(120, 1040, 24, p.ac));
const genDecor = p => `<i class="bar"></i>` + svg("gc", 700, 700, `<circle cx="450" cy="250" r="230" fill="${p.ac}"/><circle cx="330" cy="400" r="150" fill="none" stroke="${p.ink}" stroke-width="6"/><rect x="520" y="420" width="120" height="120" fill="${p.ink}"/>`);

/* ---------- Template registry ---------- */
const TEMPLATES = [
  { id: "wedding-01", name: "Royal Elegance", category: "Wedding", desc: "Ivory and gold with ornate corner flourishes.", palette: "ivory", font: "classic", render: (d, o, p) => build("t-royal", "Wedding", d, o ? royalDecor(p) : "") },
  { id: "wedding-02", name: "Floral Bloom", category: "Wedding", desc: "Soft botanicals framing an arched panel.", palette: "blush", font: "script", render: (d, o, p) => build("t-floral", "Wedding", d, o ? floralDecor(p) : "") },
  { id: "birthday-01", name: "Pop Party", category: "Birthday", desc: "Bold colour, confetti and a giant age.", palette: "sunny", font: "modern", render: (d, o, p) => build("t-modern", "Birthday", d, o ? confetti(p) : "") },
  { id: "birthday-02", name: "Midnight Luxe", category: "Birthday", desc: "Black and gold with a radiant starburst.", palette: "noir", font: "luxe", render: (d, o, p) => build("t-lux", "Birthday", d, o ? luxDecor(p) : "") },
  { id: "house-01", name: "Sage Home", category: "Housewarming", desc: "Line-art house between leafy sprigs.", palette: "sage", font: "luxe", render: (d, o, p) => build("t-house", "Housewarming", d, o ? houseDecor(p) : "") },
  { id: "grad-01", name: "Honours", category: "Graduation", desc: "Navy and gold, minimal and formal.", palette: "navy", font: "classic", render: (d, o, p) => build("t-grad", "Graduation", d, o ? gradDecor(p) : "") },
  { id: "baby-01", name: "Little Star", category: "Baby Shower", desc: "Clouds and stars on a soft sky.", palette: "sky", font: "script", render: (d, o, p) => build("t-baby", "Baby Shower", d, o ? babyDecor(p) : "") },
  { id: "event-01", name: "Studio Editorial", category: "General Event", desc: "Geometric, left-aligned and confident.", palette: "coral", font: "editorial", render: (d, o, p) => build("t-gen", "General Event", d, o ? genDecor(p) : "") }
];

/* ===== Phase 2: expanded collection =====
   Each new template is one recipe row: name | layout | decoration motif | palette | font | style,tags
   Distinct looks come from combining layout x motif x palette x font. Add rows to grow the collection. */
Object.assign(PALETTES, {
  ruby:     { label: "Ruby & gold",     bg: "#7a1020", ink: "#fbe9c8", ac: "#e8b84a" },
  emerald:  { label: "Emerald & gold",  bg: "#0f3d33", ink: "#f2ead0", ac: "#d4b25a" },
  lavender: { label: "Lavender",        bg: "#efe8fb", ink: "#3a2a5e", ac: "#8c6ad0" },
  peach:    { label: "Peach",           bg: "#ffe6d5", ink: "#5a2d1f", ac: "#e8805a" },
  mint:     { label: "Fresh mint",      bg: "#dff4ea", ink: "#1f4a3b", ac: "#3aa57d" },
  charcoal: { label: "Charcoal & silver", bg: "#2b2b2e", ink: "#f3f3f3", ac: "#b8bcc6" },
  white:    { label: "Clean white",     bg: "#ffffff", ink: "#222222", ac: "#9aa58c" },
  beige:    { label: "Warm beige",      bg: "#efe4d3", ink: "#4a3a2a", ac: "#9b7b52" },
  pink:     { label: "Bubblegum pink",  bg: "#ffd9e8", ink: "#5a1f3d", ac: "#ec4f8f" },
  blue:     { label: "Bright blue",     bg: "#d6e7ff", ink: "#102a5c", ac: "#2f6fe0" },
  neon:     { label: "Neon night",      bg: "#0d0221", ink: "#f5f0ff", ac: "#00f0ff" },
  rose:     { label: "Dusty rose",      bg: "#f7d9d9", ink: "#5b2333", ac: "#b5435b" },
  teal:     { label: "Deep teal",       bg: "#0e4d57", ink: "#f4efe0", ac: "#f2b84b" },
  mustard:  { label: "Mustard",         bg: "#f4c542", ink: "#2a2240", ac: "#d9503f" }
});
const COL = { ivory: "gold ivory cream white", blush: "pink blush", sunny: "yellow orange red", noir: "black gold", sage: "green sage", navy: "blue navy gold", sky: "blue sky",
  coral: "red coral orange beige", ruby: "red maroon gold", emerald: "green emerald gold", lavender: "purple lavender", peach: "orange peach", mint: "green mint",
  charcoal: "grey black silver", white: "white minimal", beige: "beige neutral brown", pink: "pink", blue: "blue", neon: "black neon blue", rose: "pink rose", teal: "blue teal green gold", mustard: "yellow orange red" };
Object.keys(PALETTES).forEach(k => PALETTES[k].col = COL[k]);
FONTS.hand = ["Dancing Script", "Lora", 1.2, "Handwritten"];
FONTS.fun = ["Fredoka", "Poppins", 0.95, "Playful rounded"];

const bgSvg = inner => svg("bg", 1080, 1350, inner);
const DECOR = {
  corner: royalDecor, floral: floralDecor, confetti, burst: luxDecor, house: houseDecor, cap: gradDecor, stars: babyDecor, geo: genDecor,
  double: () => `<i class="b1"></i><i class="b2"></i>`, thick: () => `<i class="b1"></i>`, dashed: () => `<i class="b1"></i>`, arch: () => `<i class="b1"></i>`,
  waves: p => bgSvg(`<path d="M0 0H1080V120Q810 220 540 120T0 150Z" fill="${p.ac}"/><path d="M0 1350H1080V1230Q810 1130 540 1230T0 1200Z" fill="${p.ac}"/>`),
  dots: p => bgSvg(Array.from({ length: 12 }, (_, i) => `<circle cx="${70 + i * 85}" cy="70" r="12" fill="${p.ac}"/><circle cx="${70 + i * 85}" cy="1280" r="12" fill="${p.ac}"/>`).join("")),
  stripes: p => bgSvg(`<polygon points="0,0 380,0 0,380" fill="${p.ac}"/><polygon points="0,0 190,0 0,190" fill="${p.ink}" opacity=".45"/><polygon points="1080,1350 700,1350 1080,970" fill="${p.ac}"/>`),
  leaves: p => svg("sp", 400, 400, sprig(40, 390, 12, p.ac), "0 0 400 400") + svg("sp r", 400, 400, sprig(360, 390, -12, p.ac), "0 0 400 400"),
  rays: p => bgSvg(Array.from({ length: 21 }, (_, i) => { const a = Math.PI * (i / 20); return `<line x1="540" y1="1350" x2="${540 - Math.cos(a) * 900}" y2="${1350 - Math.sin(a) * 900}" stroke="${p.ac}" stroke-width="${i % 2 ? 2 : 5}" opacity=".55"/>`; }).join("")),
  diamond: p => bgSvg([90, 1260].map(y => `<rect x="90" y="${y}" width="900" height="2" fill="${p.ac}"/>` + Array.from({ length: 9 }, (_, i) => `<polygon points="${135 + i * 100},${y - 18} ${153 + i * 100},${y} ${135 + i * 100},${y + 18} ${117 + i * 100},${y}" fill="${p.ac}"/>`).join("")).join("")),
  minimal: p => bgSvg(`<rect x="90" y="90" width="900" height="2" fill="${p.ac}"/><rect x="90" y="1258" width="900" height="2" fill="${p.ac}"/>`)
};
const LAYOUTS = { center: "", left: "g-left", top: "g-top", band: "g-band", caps: "g-caps" };
const PFX = { Wedding: "wedding", Birthday: "birthday", Housewarming: "house", Graduation: "grad", "Baby Shower": "baby", "General Event": "event" };
const RECIPES = {
Wedding: `Minimal Ivory|center|minimal|white|luxe|minimal
Traditional Indian|center|diamond|ruby|classic|traditional,indian temple
Luxury Black & Gold|caps|double|noir|luxe|luxury,dark
Pastel Romantic|center|dashed|blush|script|elegant,romantic pastel
Modern Editorial|left|stripes|charcoal|editorial|editorial,modern
Botanical Garden|top|leaves|sage|luxe|botanical
Classic Vintage|center|thick|beige|luxe|vintage
Elegant Marble|center|minimal|charcoal|classic|elegant,marble
Palace Inspired|center|arch|emerald|classic|traditional,palace
Red & Gold Traditional|center|corner|ruby|classic|traditional
White Floral|center|floral|white|script|floral,elegant
Modern Typography|band|dots|beige|modern|modern,typography
Luxury Navy|center|double|navy|luxe|luxury
Rustic Charm|top|leaves|beige|hand|rustic
Minimal Beige|left|minimal|beige|editorial|minimal
Elegant Rose|center|waves|rose|script|elegant
Ornamental Teal|center|corner|teal|classic|luxury,ornamental
Contemporary Arch|center|arch|peach|modern|modern,contemporary`,
Birthday: `Pastel Party|center|dots|lavender|fun|playful,pastel
Luxury Black|caps|burst|noir|luxe|luxury
Colourful Celebration|band|confetti|mustard|fun|bold,colourful
Floral Birthday|center|floral|pink|script|floral
Minimal Birthday|left|minimal|white|modern|minimal
Elegant Gold|center|double|ivory|luxe|elegant,gold
Kids Fun|center|stars|sky|fun|playful,kids
Modern Typography|left|stripes|coral|modern|modern,typography
Neon Celebration|center|rays|neon|modern|bold,neon
Confetti Burst|top|confetti|peach|fun|playful,confetti
Watercolour Wash|center|waves|mint|script|elegant,watercolour
Elegant Pink|center|dashed|pink|luxe|elegant
Blue Celebration|band|dots|blue|modern|bold
Retro Groove|left|stripes|mustard|editorial|vintage,retro
Cartoon Pop|center|confetti|sunny|fun|playful,cartoon
Garden Party|top|leaves|sage|hand|botanical,floral garden
Luxury Cream|center|arch|beige|luxe|luxury,cream
Rainbow Joy|center|geo|sunny|fun|bold,rainbow`,
Housewarming: `Warm Welcome|center|double|beige|luxe|elegant
Botanical Home|top|leaves|sage|luxe|botanical
Modern Keys|left|geo|charcoal|modern|modern
Terracotta Hearth|center|arch|peach|editorial|rustic
Minimal Home|left|minimal|white|modern|minimal
Floral Doorway|center|floral|blush|script|floral
Emerald Residence|center|corner|emerald|classic|luxury
Cosy Cottage|center|dashed|mustard|hand|rustic,cosy
Golden Threshold|center|house|ivory|luxe|elegant,gold
Sky Blue Nest|center|dots|sky|fun|playful
Traditional Griha Pravesh|center|diamond|ruby|classic|traditional,gruhapravesh
Teal Terrace|band|waves|teal|modern|modern
Blush Abode|center|thick|rose|luxe|elegant
Navy Foyer|center|double|navy|classic|luxury
Mint Fresh Start|top|rays|mint|modern|modern
Heritage Home|center|corner|beige|luxe|vintage
Green Haven|left|leaves|emerald|editorial|botanical
Sunrise Home|center|rays|sunny|fun|bold
Lavender Lane|center|arch|lavender|script|elegant,floral`,
Graduation: `Gold Scholar|caps|double|noir|classic|luxury
Minimal Graduate|left|minimal|white|modern|minimal
Classic Cap|center|cap|ivory|luxe|elegant
Class of Bold|band|stripes|navy|modern|bold
Maroon Merit|center|corner|ruby|classic|traditional
Emerald Achievement|center|thick|emerald|luxe|luxury
Editorial Grad|left|dots|beige|editorial|editorial
Sky Milestone|center|rays|sky|modern|modern
Silver Success|caps|double|charcoal|classic|elegant
Coral Cheers|top|confetti|coral|fun|playful
Teal Triumph|center|arch|teal|luxe|modern
Pink Pioneer|center|dashed|pink|script|playful
Stripe Scholar|left|stripes|mustard|modern|bold
Diamond Degree|center|diamond|navy|classic|luxury
Laurel Wreath|top|leaves|sage|luxe|botanical
Vintage Diploma|center|thick|beige|luxe|vintage
Midnight Graduate|center|burst|noir|modern|luxury
Peach Future|center|waves|peach|script|elegant
Violet Vision|center|geo|lavender|editorial|modern`,
"Baby Shower": `Moon & Stars|center|stars|navy|script|elegant
Soft Pink Cloud|center|waves|pink|script|elegant,pastel
Mint Lullaby|center|dashed|mint|hand|playful,pastel
Peach Bundle|center|dots|peach|fun|playful
Lavender Dream|center|arch|lavender|script|elegant
Minimal Baby|left|minimal|white|modern|minimal
Rainbow Baby|center|confetti|sunny|fun|bold,rainbow
Botanical Baby|top|leaves|sage|luxe|botanical
Blue Boy Bash|band|dots|blue|fun|playful,boy
Pink Princess|center|floral|rose|script|floral,girl
Golden Little One|center|double|ivory|luxe|luxury,gold
Safari Sunshine|center|rays|mustard|fun|playful,safari
Beige Boho|center|arch|beige|hand|rustic,boho
Twinkle Night|center|burst|noir|script|elegant,stars
Teal Treasure|center|corner|teal|luxe|elegant
Coral Cuddles|left|geo|coral|fun|playful
Cotton Candy|center|waves|lavender|fun|playful,pastel
Editorial Bump|left|stripes|charcoal|editorial|editorial,modern
Hello Baby|center|thick|sky|hand|playful`,
"General Event": `Corporate Navy|left|stripes|navy|modern|modern,corporate
Gala Night|caps|burst|noir|luxe|luxury,gala
Minimal Event|left|minimal|white|editorial|minimal
Festival Bold|band|confetti|mustard|fun|bold,festival
Conference Teal|left|geo|teal|modern|modern,conference
Charity Dinner|center|double|ivory|classic|elegant,dinner
Neon Night|center|rays|neon|modern|bold,neon
Garden Reception|top|leaves|sage|luxe|botanical
Cultural Evening|center|diamond|ruby|classic|traditional,cultural
Launch Party|band|dots|coral|modern|bold,launch
Reunion Retro|left|stripes|mustard|editorial|vintage,retro
Rose Soiree|center|dashed|rose|script|elegant
Workshop Blue|left|dots|blue|modern|modern,workshop
Emerald Gala|center|corner|emerald|classic|luxury
Sunset Social|center|waves|peach|fun|playful,social
Arch Invitation|center|arch|beige|luxe|elegant
Lavender Launch|center|thick|lavender|editorial|modern
Mint Meetup|top|rays|mint|modern|modern,meetup
Monochrome Showcase|left|minimal|charcoal|modern|minimal`
};
const META = { "wedding-01": "traditional,royal gold", "wedding-02": "floral,botanical blush", "birthday-01": "bold,confetti party", "birthday-02": "luxury,elegant dark",
  "house-01": "botanical,leaves home", "grad-01": "elegant,formal minimal", "baby-01": "playful,stars clouds", "event-01": "editorial,geometric bold" };
TEMPLATES.forEach(t => { const [s, ...x] = META[t.id].split(","); t.style = s; t.tags = x.join(" "); });
Object.entries(RECIPES).forEach(([cat, rows]) => {
  let n = TEMPLATES.filter(t => t.category === cat).length;
  rows.split("\n").forEach(r => {
    const [name, lay, mot, pal, font, sty] = r.trim().split("|"), [style, ...x] = sty.split(","); n++;
    TEMPLATES.push({ id: `${PFX[cat]}-${String(n).padStart(2, "0")}`, name, category: cat, style, tags: x.join(" "), palette: pal, font,
      desc: `A ${style} ${cat.toLowerCase()} design in ${PALETTES[pal].label.toLowerCase()}.`,
      render: (d, o, p) => build(`${LAYOUTS[lay]} m-${mot}`.trim(), cat, d, o ? DECOR[mot](p) : "") });
  });
});
// Search index + featured flag (no real popularity data exists, so "Featured" is an editorial flag).
TEMPLATES.forEach((t, i) => { t.col = PALETTES[t.palette].col; t.added = i; t.featured = i < 8 || i % 6 === 0;
  t.q = [t.name, t.category, t.style, t.tags, t.col, PALETTES[t.palette].label, t.desc].join(" ").toLowerCase(); });

/* ===== Phase 7: grow every category to 100 templates =====
   New templates are generated from per-category design pools (motif x palette x layout x font).
   Rules: no (category, motif, palette) pair is reused, no (motif, layout, font) combination repeats,
   and floral panels only use light palettes so text stays readable. Existing templates are never touched. */
Object.assign(PALETTES, {
  burgundy: { label: "Burgundy & gold", bg: "#5a1224", ink: "#f6e7d5", ac: "#d9a441" },
  forest:   { label: "Forest & brass",  bg: "#1f3a2e", ink: "#f2eddc", ac: "#c9a45c" },
  ocean:    { label: "Ocean blue",      bg: "#0b3c5d", ink: "#f1f5f9", ac: "#6fc3df" },
  violet:   { label: "Violet night",    bg: "#2a1f4a", ink: "#efe9ff", ac: "#b79cff" },
  dusty:    { label: "Dusty rose",      bg: "#e8d5d0", ink: "#40302e", ac: "#a85d5d" },
  honey:    { label: "Honey",           bg: "#fff1cc", ink: "#4a3516", ac: "#d9962b" }
});
Object.assign(COL, { burgundy: "red burgundy maroon gold", forest: "green forest gold", ocean: "blue ocean teal", violet: "purple violet", dusty: "pink rose dusty", honey: "yellow honey gold" });
Object.keys(PALETTES).forEach(k => { PALETTES[k].col = COL[k]; });
Object.assign(LAYOUTS, { right: "g-right", lower: "g-lower", side: "g-side", boxed: "g-boxed", wide: "g-wide", ital: "g-ital" });
Object.assign(DECOR, {
  scallop: p => bgSvg([0, 1350].map(y => Array.from({ length: 14 }, (_, i) => `<circle cx="${40 + i * 80}" cy="${y}" r="46" fill="${p.ac}"/>`).join("")).join("")),
  polka: p => bgSvg(Array.from({ length: 30 }, (_, i) => `<circle cx="${(i % 6) * 200 + (Math.floor(i / 6) % 2 ? 100 : 0)}" cy="${Math.floor(i / 6) * 290 + 60}" r="34" fill="${p.ac}" opacity=".18"/>`).join("")),
  bunting: p => bgSvg(`<path d="M0 40Q540 150 1080 40" stroke="${p.ink}" stroke-width="3" fill="none"/>` + Array.from({ length: 10 }, (_, i) => { const x = 40 + i * 100, y = 60 + 38 * Math.sin(i / 9 * Math.PI); return `<polygon points="${x},${y} ${x + 80},${y} ${x + 40},${y + 90}" fill="${i % 2 ? p.ink : p.ac}"/>`; }).join("")),
  sunburst: p => bgSvg(Array.from({ length: 19 }, (_, i) => { const a = Math.PI / 2 * i / 18; return `<line x1="0" y1="0" x2="${Math.cos(a) * 1800}" y2="${Math.sin(a) * 1800}" stroke="${p.ac}" stroke-width="${i % 2 ? 3 : 9}" opacity=".4"/>`; }).join("")),
  ribbon: p => bgSvg(`<polygon points="0,300 300,0 390,0 0,390" fill="${p.ac}"/><polygon points="0,420 420,0 450,0 0,450" fill="${p.ink}" opacity=".5"/><polygon points="1080,960 1080,1050 780,1350 690,1350" fill="${p.ac}"/>`),
  ring: p => bgSvg([200, 320, 440, 560, 680].map(r => `<circle cx="1080" cy="1350" r="${r}" fill="none" stroke="${p.ac}" stroke-width="3" opacity=".55"/>`).join("") + [120, 240, 360].map(r => `<circle cx="0" cy="0" r="${r}" fill="none" stroke="${p.ac}" stroke-width="3" opacity=".55"/>`).join("")),
  marble: p => bgSvg(["M-50 200C250 120 400 380 700 300S1000 500 1150 420", "M-50 520C200 640 420 420 640 560S960 760 1150 660", "M-50 900C300 820 480 1060 760 960S1020 1100 1150 1040", "M200 -50C260 200 160 360 300 560", "M900 1400C860 1180 980 1040 880 840"].map((d, i) => `<path d="${d}" stroke="${p.ac}" stroke-width="${i % 2 ? 2 : 4}" fill="none" opacity=".4"/>`).join("")),
  vines: p => bgSvg([0, 1].map(r => Array.from({ length: 6 }, (_, i) => { const x = 90 + i * 180, y = r ? 1270 : 80; return leaf(x + 60, y + (r ? -30 : 30), 70, 40, p.ac) + leaf(x - 60, y + (r ? -30 : 30), -70, 40, p.ac) + flower(x, y, 48, p.ac, p.ink); }).join("")).join(""))
});

const LIGHT = ["ivory", "blush", "sunny", "sage", "sky", "coral", "lavender", "peach", "mint", "white", "beige", "pink", "blue", "rose", "mustard", "dusty", "honey"];
const HEAVY = ["floral", "arch", "house", "cap", "burst", "stars"];     // motifs that restyle the text block; kept to simple layouts
const LAYS_ALL = ["center", "left", "top", "band", "caps", "right", "lower", "side", "boxed", "wide", "ital"], LAYS_HEAVY = ["center", "caps", "wide", "ital"];
const PALW = { ivory: "Ivory", blush: "Blush", sunny: "Sunburst", noir: "Noir", sage: "Sage", navy: "Navy", sky: "Skyline", coral: "Coral", ruby: "Ruby", emerald: "Emerald", lavender: "Lavender", peach: "Peach", mint: "Mint", charcoal: "Graphite", white: "Alabaster", beige: "Sandstone", pink: "Petal", blue: "Cobalt", neon: "Neon", rose: "Rosewood", teal: "Teal", mustard: "Saffron", burgundy: "Burgundy", forest: "Forest", ocean: "Ocean", violet: "Violet", dusty: "Mauve", honey: "Honey" };
const MOTW = { corner: "Flourish", floral: "Bloom", double: "Regency", thick: "Heritage", dashed: "Stitch", arch: "Archway", diamond: "Jewel", leaves: "Garden", minimal: "Pure", waves: "Tide", marble: "Marble", vines: "Trellis", ring: "Halo", scallop: "Scallop", sunburst: "Sunray", ribbon: "Ribbon", rays: "Radiance", dots: "Dotted", confetti: "Confetti", bunting: "Bunting", polka: "Polka", burst: "Starlight", stars: "Twinkle", geo: "Mosaic", stripes: "Stripe", house: "Hearth", cap: "Mortar" };
const MOTD = { corner: "ornate corner flourishes", floral: "a floral arch panel", double: "a double gold-style frame", thick: "a bold heritage border", dashed: "a stitched rounded frame", arch: "an arched window frame", diamond: "diamond rule borders", leaves: "leafy sprigs", minimal: "fine minimal rules", waves: "flowing wave edges", marble: "marble-vein lines", vines: "a trellis of flowers and leaves", ring: "concentric halo rings", scallop: "scalloped edges", sunburst: "a sunburst of rays", ribbon: "diagonal ribbon bands", rays: "rays rising from the base", dots: "dotted borders", confetti: "scattered confetti", bunting: "a bunting garland", polka: "a soft polka pattern", burst: "a starburst crown", stars: "stars and clouds", geo: "bold geometric shapes", stripes: "diagonal corner stripes", house: "a line-art home", cap: "a graduation cap" };
const MOTS = { corner: "traditional", floral: "floral", double: "luxury", thick: "vintage", dashed: "elegant", arch: "elegant", diamond: "traditional", leaves: "botanical", minimal: "minimal", waves: "elegant", marble: "luxury", vines: "floral", ring: "modern", scallop: "playful", sunburst: "bold", ribbon: "bold", rays: "bold", dots: "modern", confetti: "playful", bunting: "playful", polka: "playful", burst: "luxury", stars: "playful", geo: "modern", stripes: "editorial", house: "elegant", cap: "elegant" };
const SUFFIX = { Wedding: ["Vows", "Union", "Ceremony", "Nuptials", "Bliss", "Romance"], Birthday: ["Bash", "Party", "Fiesta", "Jubilee", "Toast", "Soiree"], Housewarming: ["Hearth", "Haven", "Home", "Threshold", "Nest", "Abode"], Graduation: ["Honours", "Scholar", "Laureate", "Milestone", "Degree", "Commencement"], "Baby Shower": ["Cherub", "Bundle", "Lullaby", "Blessing", "Bloom", "Sprout"], "General Event": ["Gala", "Gathering", "Affair", "Showcase", "Soiree", "Summit"] };
const POOLS = {
  Wedding: { mot: "corner floral double thick dashed arch diamond leaves minimal waves marble vines ring scallop sunburst ribbon rays dots", pal: "ivory blush sage white beige rose ruby emerald navy noir teal lavender peach burgundy forest dusty honey mint charcoal", font: "classic script luxe editorial hand modern" },
  Birthday: { mot: "confetti bunting polka rays burst stars geo dots stripes waves ribbon scallop double floral arch sunburst ring thick dashed minimal", pal: "sunny pink blue mustard coral peach mint lavender neon noir sky violet ocean honey rose teal burgundy ivory white charcoal", font: "fun modern luxe script hand editorial" },
  Housewarming: { mot: "house leaves arch double dashed thick minimal floral corner vines diamond geo dots waves scallop ring stripes marble polka sunburst", pal: "sage beige peach mint ivory white forest emerald teal honey dusty sky coral blush charcoal navy mustard lavender ruby ocean", font: "luxe editorial classic modern hand script fun" },
  Graduation: { mot: "cap double thick corner diamond rays stripes dots minimal burst arch geo leaves sunburst ring ribbon marble waves scallop dashed", pal: "navy noir ivory white ruby emerald charcoal burgundy forest ocean teal beige sky blue mustard coral violet lavender honey peach", font: "classic luxe modern editorial script" },
  "Baby Shower": { mot: "stars waves dashed arch dots floral leaves polka scallop bunting thick minimal ring vines sunburst rays ribbon double", pal: "sky blush pink mint peach lavender sage ivory white beige rose dusty honey blue mustard coral ocean violet", font: "script hand fun luxe modern" },
  "General Event": { mot: "geo burst stripes dots rays diamond double minimal confetti bunting corner arch waves thick ring marble sunburst ribbon polka scallop dashed", pal: "navy noir ivory white mustard coral teal emerald neon rose beige charcoal ruby blue sky lavender violet ocean burgundy forest honey peach mint", font: "modern editorial luxe classic fun" }
};
(function expandCollection(TARGET) {
  let seed = 20261123; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const used = new Set(["Wedding|corner|ivory", "Wedding|floral|blush", "Birthday|confetti|sunny", "Birthday|burst|noir", "Housewarming|house|sage", "Graduation|cap|navy", "Baby Shower|stars|sky", "General Event|geo|coral"]);
  Object.entries(RECIPES).forEach(([cat, rows]) => rows.split("\n").forEach(r => { const f = r.trim().split("|"); used.add(`${cat}|${f[2]}|${f[3]}`); }));
  const names = new Set(TEMPLATES.map(t => t.name.toLowerCase())), batches = {};
  Object.keys(CATS).forEach(cat => {
    const pool = { mot: POOLS[cat].mot.split(" "), pal: POOLS[cat].pal.split(" "), font: POOLS[cat].font.split(" ") };
    const combos = []; pool.mot.forEach(m => pool.pal.forEach(p => { if ((m !== "floral" || LIGHT.includes(p)) && !used.has(`${cat}|${m}|${p}`)) combos.push([m, p]); }));
    for (let i = combos.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [combos[i], combos[j]] = [combos[j], combos[i]]; }
    let n = TEMPLATES.filter(t => t.category === cat).length; const sig = new Set(), out = [];
    for (const [m, p] of combos) {
      if (n >= TARGET) break;
      const lays = HEAVY.includes(m) ? LAYS_HEAVY : LAYS_ALL; let lay, font, ok = false;
      for (let k = 0; k < lays.length * pool.font.length && !ok; k++) { lay = lays[(n + k) % lays.length]; font = pool.font[(n * 3 + Math.floor(k / lays.length) + k) % pool.font.length]; ok = !sig.has(`${m}|${lay}|${font}`); }
      if (!ok) continue;
      sig.add(`${m}|${lay}|${font}`); used.add(`${cat}|${m}|${p}`); n++;
      let name, s = n; do { name = `${PALW[p]} ${MOTW[m]} ${SUFFIX[cat][s++ % 6]}`; } while (names.has(name.toLowerCase()) && s < n + 40);
      if (names.has(name.toLowerCase())) name += " II";
      names.add(name.toLowerCase());
      let style = MOTS[m]; if (style === "elegant" && !LIGHT.includes(p)) style = "luxury";
      out.push({ id: `${PFX[cat]}-${String(n).padStart(2, "0")}`, name, category: cat, style, tags: `${MOTW[m]} ${m} ${FONTS[font][3]} ${lay}`.toLowerCase(), palette: p, font, motif: m, layout: lay,
        desc: `A ${style} ${cat.toLowerCase()} invitation with ${MOTD[m]} in ${PALETTES[p].label.toLowerCase()}.`,
        render: (d, o, pp) => build(`${LAYOUTS[lay]} m-${m}`.trim(), cat, d, o ? DECOR[m](pp) : "") });
    }
    batches[cat] = out;
  });
  // Interleave categories so "Recently added" shows a mix.
  for (let i = 0; i < TARGET; i++) Object.keys(CATS).forEach(cat => { const t = batches[cat][i]; if (!t) return;
    t.col = PALETTES[t.palette].col; t.added = TEMPLATES.length; t.featured = false;
    t.q = [t.name, t.category, t.style, t.tags, t.col, PALETTES[t.palette].label, t.desc].join(" ").toLowerCase(); TEMPLATES.push(t); });
})(100);
