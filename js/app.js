var STORAGE_KEY = "romr_profile_v2";
var THEME_KEY = "romr_theme";

var COUNTRIES = window.ROMR_COUNTRIES;
var byCode = {};
COUNTRIES.forEach(function (c) { byCode[c.c] = c; });

var CONTINENTS = [
  { id: "asia", icon: "🏯", title: "Asia" },
  { id: "europe", icon: "🏰", title: "Europe" },
  { id: "north-america", icon: "🗽", title: "North America" },
  { id: "south-america", icon: "🌋", title: "South America" },
  { id: "africa", icon: "🦁", title: "Africa" },
  { id: "oceania", icon: "🦘", title: "Oceania" },
  { id: "antarctica", icon: "🐧", title: "Antarctica" }
];

var DEFAULT_STATE = {
  name: "Alex Rivera",
  username: "alexroams",
  bio: "Chasing sunsets and street food. Planning the next trip with Romr.",
  avatar: null,
  demoUnlocked: [],
  manual: [],
  trips: [
    { id: "t1", place: "Tokyo", country: "JPN", start: "2025-03-02", end: "2025-03-12", note: "Ramen every day.", everest: false },
    { id: "t2", place: "Paris", country: "FRA", start: "2024-06-10", end: "2024-06-17", note: "", everest: false },
    { id: "t3", place: "New York", country: "USA", start: "2023-12-20", end: "2023-12-27", note: "Holiday trip.", everest: false }
  ],
  people: [
    { id: "p1", name: "Maya Chen", username: "mayaexplores", emoji: "🌸", followsMe: true, following: true },
    { id: "p2", name: "Jordan Lee", username: "jlee.travels", emoji: "🎒", followsMe: true, following: false },
    { id: "p3", name: "Sam Okafor", username: "samgoesplaces", emoji: "🌍", followsMe: false, following: true },
    { id: "p4", name: "Priya Nair", username: "priyainparis", emoji: "🥐", followsMe: true, following: true },
    { id: "p5", name: "Luca Rossi", username: "lucaroams", emoji: "🍕", followsMe: true, following: false },
    { id: "p6", name: "Emma Wilson", username: "emmaweekends", emoji: "⛰️", followsMe: false, following: true },
    { id: "p7", name: "Kai Tanaka", username: "kaitrips", emoji: "🗻", followsMe: true, following: true },
    { id: "p8", name: "Noor Hassan", username: "noorabroad", emoji: "🐪", followsMe: true, following: false }
  ]
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function $(id) { return document.getElementById(id); }
function make(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

var state = loadState();
var demoMode = false;
var peopleTab = "followers";

function loadState() {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return Object.assign(clone(DEFAULT_STATE), saved);
  } catch (e) {}
  return clone(DEFAULT_STATE);
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { alert("Couldn’t save (storage full?). Try a smaller photo."); }
}

function visitedMap() {
  var v = {};
  state.trips.forEach(function (t) { v[t.country] = true; });
  state.manual.forEach(function (c) { v[c] = true; });
  return v;
}
function buildAchievements(v, pct) {
  var TIERS = [25, 50, 75, 100];
  var world = [];
  TIERS.forEach(function (n) {
    world.push({ id: "pct" + n, icon: n === 100 ? "🏆" : n === 75 ? "🧳" : n === 50 ? "🗺️" : "🌍",
      title: n + "% Explorer", desc: "Visited " + n + "% of the world", real: pct >= n });
  });
  world.push({ id: "everest", icon: "🏔️", title: "Mount Everest", desc: "You’ve climbed Mount Everest",
    real: state.trips.some(function (t) { return t.everest; }) });

  var everyContinent = true, groups = [];
  CONTINENTS.forEach(function (c) {
    var total = 0, seen = 0;
    COUNTRIES.forEach(function (x) { if (x.k === c.id) { total++; if (v[x.c]) seen++; } });
    if (!seen) everyContinent = false;
    var items = TIERS.map(function (n) {
      var need = Math.ceil(total * n / 100);
      return { id: c.id + "-" + n, icon: c.icon, title: n + "%", desc: need + " of " + total + " countries", real: total > 0 && seen >= need };
    });
    groups.push({ title: c.icon + " " + c.title, sub: seen + " of " + total + " visited", items: items });
  });
  world.push({ id: "all7", icon: "🌐", title: "All 7 Continents", desc: "Visited every continent", real: everyContinent });
  return [{ title: "🌍 World", sub: "", items: world }].concat(groups);
}

function setAvatar(el, dataUrl) {
  if (dataUrl) { el.style.backgroundImage = "url(" + dataUrl + ")"; el.textContent = ""; }
  else { el.style.backgroundImage = ""; el.textContent = "🧭"; }
}

function render() {
  var v = visitedMap();
  var visitedCount = Object.keys(v).length;
  var pct = Math.round(visitedCount / COUNTRIES.length * 100);

  $("displayName").textContent = state.name;
  $("username").textContent = "@" + state.username;
  $("bio").textContent = state.bio;
  setAvatar($("avatar"), state.avatar);
  $("followers").textContent = state.people.filter(function (p) { return p.followsMe; }).length;
  $("following").textContent = state.people.filter(function (p) { return p.following; }).length;

  $("pct").textContent = pct + "%";
  $("mapCount").textContent = "of the world explored (" + visitedCount + " of " + COUNTRIES.length + " countries)";
  $("fill").style.width = pct + "%";
  $("mapHint").textContent = demoMode ? "Demo mode: click a country to light it up." : "Countries light up automatically from your trip history.";
  renderMap(v);
  renderTrips();

  var groups = buildAchievements(v, pct), root = $("grid"), count = 0, total = 0;
  root.innerHTML = "";
  groups.forEach(function (g) {
    var sec = make("div", "grp");
    var h = make("h3", "", g.title);
    if (g.sub) h.appendChild(make("span", "muted", " · " + g.sub));
    sec.appendChild(h);
    var grid = make("div", "grid");
    g.items.forEach(function (a) {
      var on = a.real || state.demoUnlocked.indexOf(a.id) !== -1;
      total++;
      if (on) count++;
      var el = make("div", "ach " + (on ? "on" : "off") + (demoMode ? " clickable" : ""));
      el.appendChild(make("span", "ic", on ? a.icon : "🔒"));
      el.appendChild(make("div", "t", a.title));
      el.appendChild(make("div", "d", a.desc));
      el.addEventListener("click", function () { if (demoMode && !a.real) toggleDemoAchievement(a.id); });
      grid.appendChild(el);
    });
    sec.appendChild(grid);
    root.appendChild(sec);
  });
  $("unlockedCount").textContent = count;
  $("summary").textContent = count + " of " + total + " unlocked";
}

function toggleDemoAchievement(id) {
  var i = state.demoUnlocked.indexOf(id);
  if (i === -1) state.demoUnlocked.push(id); else state.demoUnlocked.splice(i, 1);
  saveState(); render();
}

var mapBuilt = false;
function renderMap(v) {
  var box = $("mapBox"), tip = $("tip");
  if (!mapBuilt) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 960 500");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "World map");
    COUNTRIES.forEach(function (c) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", c.d);
      p.setAttribute("class", "country");
      p.setAttribute("data-code", c.c);
      p.addEventListener("click", function () { onCountryClick(c.c); });
      p.addEventListener("mousemove", function (e) {
        var r = box.getBoundingClientRect();
        tip.textContent = c.f + " " + c.n;
        tip.style.display = "block";
        tip.style.left = (e.clientX - r.left) + "px";
        tip.style.top = (e.clientY - r.top) + "px";
      });
      p.addEventListener("mouseleave", function () { tip.style.display = "none"; });
      svg.appendChild(p);
    });
    box.appendChild(svg);
    mapBuilt = true;
  }
  var paths = box.querySelectorAll(".country");
  for (var i = 0; i < paths.length; i++) {
    paths[i].classList.toggle("visited", !!v[paths[i].getAttribute("data-code")]);
  }
}

function onCountryClick(code) {
  if (!demoMode) return;
  var i = state.manual.indexOf(code);
  if (i === -1) state.manual.push(code); else state.manual.splice(i, 1);
  saveState(); render();
}

function fmtDate(s) {
  return new Date(s + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function renderTrips() {
  var box = $("trips");
  box.innerHTML = "";
  if (!state.trips.length) { box.appendChild(make("p", "muted", "No trips yet. Add your first one!")); return; }
  state.trips.slice().sort(function (a, b) { return b.start.localeCompare(a.start); }).forEach(function (t) {
    var c = byCode[t.country];
    var card = make("div", "card trip");
    card.appendChild(make("div", "flag", c ? c.f : "📍"));
    var info = make("div", "info");
    info.appendChild(make("b", "", t.place + (t.everest ? " 🏔️" : "")));
    info.appendChild(make("span", "muted", (c ? c.n : t.country) + " · " + fmtDate(t.start) + " – " + fmtDate(t.end)));
    if (t.note) info.appendChild(make("div", "note", t.note));
    card.appendChild(info);
    box.appendChild(card);
  });
}

var tripDialog = $("tripDialog");
var sel = $("tCountry");
COUNTRIES.slice().sort(function (a, b) { return a.n.localeCompare(b.n); }).forEach(function (c) {
  var o = make("option", "", c.f + " " + c.n);
  o.value = c.c;
  sel.appendChild(o);
});
function openTrip() {
  $("tripForm").reset();
  $("tError").textContent = "";
  tripDialog.showModal();
}
$("addTripBtn").addEventListener("click", function () { openTrip(); });
$("tCancel").addEventListener("click", function () { tripDialog.close(); });
$("tripForm").addEventListener("submit", function (e) {
  var start = $("tStart").value, end = $("tEnd").value, place = $("tPlace").value.trim();
  if (!place || !start || !end) { e.preventDefault(); $("tError").textContent = "Fill in the place and both dates."; return; }
  if (end < start) { e.preventDefault(); $("tError").textContent = "End date can’t be before the start date."; return; }
  state.trips.push({ id: "t" + Date.now(), place: place, country: sel.value, start: start, end: end,
    note: $("tNote").value.trim(), everest: $("tEverest").checked });
  saveState(); render();
});

var peopleDialog = $("peopleDialog");
function openPeople(tab) { peopleTab = tab; renderPeople(); peopleDialog.showModal(); }
function renderPeople() {
  $("tabFollowers").classList.toggle("active", peopleTab === "followers");
  $("tabFollowing").classList.toggle("active", peopleTab === "following");
  var box = $("people");
  box.innerHTML = "";
  var list = state.people.filter(function (p) { return peopleTab === "followers" ? p.followsMe : p.following; });
  if (!list.length) box.appendChild(make("p", "muted", "Nobody here yet."));
  list.forEach(function (p) {
    var row = make("div", "person");
    row.appendChild(make("div", "avatar", p.emoji));
    var who = make("div", "who");
    who.appendChild(make("b", "", p.name));
    who.appendChild(make("span", "muted", "@" + p.username));
    row.appendChild(who);
    var label = p.following ? (peopleTab === "following" ? "Unfollow" : "Following") : "Follow back";
    var btn = make("button", "btn small" + (p.following ? " ghost" : " primary"), label);
    btn.addEventListener("click", function () {
      p.following = !p.following;
      saveState(); render(); renderPeople();
    });
    row.appendChild(btn);
    box.appendChild(row);
  });
}
$("followersBtn").addEventListener("click", function () { openPeople("followers"); });
$("followingBtn").addEventListener("click", function () { openPeople("following"); });
$("tabFollowers").addEventListener("click", function () { peopleTab = "followers"; renderPeople(); });
$("tabFollowing").addEventListener("click", function () { peopleTab = "following"; renderPeople(); });
$("peopleClose").addEventListener("click", function () { peopleDialog.close(); });

var dialog = $("editDialog"), draftAvatar = null;
$("editBtn").addEventListener("click", function () {
  $("nameInput").value = state.name;
  $("userInput").value = state.username;
  $("bioInput").value = state.bio;
  draftAvatar = state.avatar;
  setAvatar($("previewAvatar"), draftAvatar);
  $("userError").textContent = "";
  $("bioCount").textContent = state.bio.length + "/150";
  dialog.showModal();
});
$("cancelBtn").addEventListener("click", function () { dialog.close(); });
$("bioInput").addEventListener("input", function () { $("bioCount").textContent = $("bioInput").value.length + "/150"; });
$("removePhoto").addEventListener("click", function () { draftAvatar = null; setAvatar($("previewAvatar"), null); });

$("photoInput").addEventListener("change", function (e) {
  var file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  if (file.type.indexOf("image/") !== 0) { $("userError").textContent = "Please choose an image file."; return; }
  var reader = new FileReader();
  reader.onload = function () {
    var img = new Image();
    img.onload = function () {
      var size = 256, canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      var s = Math.min(img.width, img.height);
      canvas.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      draftAvatar = canvas.toDataURL("image/jpeg", 0.85);
      setAvatar($("previewAvatar"), draftAvatar);
      $("userError").textContent = "";
    };
    img.onerror = function () { $("userError").textContent = "Couldn’t read that image."; };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});
$("editForm").addEventListener("submit", function (e) {
  var username = $("userInput").value.trim().replace(/^@/, "");
  if (!/^[A-Za-z0-9_.]{3,20}$/.test(username)) {
    e.preventDefault();
    $("userError").textContent = "Username: 3–20 characters, letters, numbers, _ or . only.";
    return;
  }
  state.name = $("nameInput").value.trim() || state.name;
  state.username = username;
  state.bio = $("bioInput").value.trim();
  state.avatar = draftAvatar;
  saveState(); render();
});

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  $("themeBtn").textContent = t === "dark" ? "☀️ Light" : "🌙 Dark";
}
var savedTheme = null;
try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
applyTheme(savedTheme || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("themeBtn").addEventListener("click", function () {
  var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
});

$("demoMode").addEventListener("change", function (e) {
  demoMode = e.target.checked;
  $("demoTools").classList.toggle("on", demoMode);
  render();
});
$("visitAll").addEventListener("click", function () {
  state.manual = COUNTRIES.map(function (c) { return c.c; });
  state.demoUnlocked = ["everest"];
  saveState(); render();
});
$("clearDemo").addEventListener("click", function () {
  state.manual = []; state.demoUnlocked = [];
  saveState(); render();
});
$("resetBtn").addEventListener("click", function () {
  if (!confirm("Reset the profile back to the defaults?")) return;
  state = clone(DEFAULT_STATE);
  saveState(); render();
});

render();
