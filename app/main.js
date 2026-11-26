// Nippon in Numbers — router, search, table sorting, year selector and
// currency toggle. Plain JavaScript, no libraries.

window.AppState = { route: "overview", year: 2024, currency: "yen", search: "" };

var viewEl = document.getElementById("view");
var searchInput = document.getElementById("search");
var yearSelect = document.getElementById("year-select");

function currentRoute() {
  var h = window.location.hash || "#/";
  var name = h.replace(/^#\/?/, "").split("?")[0].split("/")[0];
  return VIEWS[name] ? name : "overview";
}

function render() {
  var route = currentRoute();
  window.AppState.route = route;
  document.querySelectorAll("nav.main-nav a").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("data-route") === route);
  });
  viewEl.innerHTML = VIEWS[route]();
  wireCharts(viewEl);
  wireSorting(viewEl);
  wirePrefFilter(viewEl);
  if (window.AppState.search) showSearchResults(window.AppState.search);
  window.scrollTo(0, 0);
}

function showSearchResults(q) {
  var query = q.trim().toLowerCase();
  var box = viewEl.querySelector(".search-results");
  if (box) box.remove();
  if (!query) return;
  var hits = DATA.topics.filter(function (t) {
    return t.term.indexOf(query) !== -1 || query.indexOf(t.term) !== -1 ||
      t.text.toLowerCase().indexOf(query) !== -1;
  });
  var html;
  if (hits.length === 0) {
    html = '<div class="search-results panel"><h3>No matches for &ldquo;' + esc(query) +
      "&rdquo;</h3><p>Try &ldquo;wages&rdquo;, &ldquo;Tokyo&rdquo;, &ldquo;trade&rdquo; or &ldquo;rice&rdquo;.</p></div>";
  } else {
    var items = hits.slice(0, 8).map(function (t) {
      return '<li><a href="#/' + t.view + '">' + esc(t.text) + "</a></li>";
    }).join("");
    html = '<div class="search-results panel"><h3>' + hits.length +
      ' result' + (hits.length > 1 ? "s" : "") + ' for &ldquo;' + esc(query) +
      "&rdquo;</h3><ul>" + items + "</ul></div>";
  }
  viewEl.insertAdjacentHTML("afterbegin", html);
}

// ---- Table sorting: click a <th data-sort> to sort its table ----
function wireSorting(root) {
  root.querySelectorAll("table.data th[data-sort]").forEach(function (th) {
    th.addEventListener("click", function () {
      var table = th.closest("table");
      var tbody = table.querySelector("tbody");
      var key = th.getAttribute("data-sort");
      var rows = Array.prototype.slice.call(tbody.querySelectorAll("tr"));
      var asc = th.classList.contains("sorted-asc");
      table.querySelectorAll("th").forEach(function (h) {
        h.classList.remove("sorted-asc", "sorted-desc");
      });
      th.classList.add(asc ? "sorted-desc" : "sorted-asc");
      var dir = asc ? -1 : 1;
      rows.sort(function (a, b) {
        var va = cellValue(a, key), vb = cellValue(b, key);
        if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
        return String(va).localeCompare(String(vb)) * dir;
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
    });
  });
}

function cellValue(row, key) {
  var cells = row.querySelectorAll("td");
  var map = { rank: 0, name: 1, population: 2, changePct: 3, elderlyShare: 4 };
  var cell = cells[map[key]];
  if (!cell) return "";
  var text = cell.textContent.replace(/[,%+]/g, "").trim();
  var num = parseFloat(text.replace(/,/g, ""));
  return isNaN(num) ? cell.textContent.trim() : num;
}

// ---- Prefecture table filter: live text filter on the name column ----
function wirePrefFilter(root) {
  var input = root.querySelector("#pref-filter");
  var table = root.querySelector("#pref-table");
  if (!input || !table) return;
  var countNote = root.querySelector("#pref-count");
  var baseNote = countNote ? countNote.textContent : "";
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    table.querySelectorAll("tbody tr").forEach(function (tr) {
      var name = tr.cells[1].textContent.toLowerCase();
      var match = !q || name.indexOf(q) !== -1;
      tr.style.display = match ? "" : "none";
      if (match) shown++;
    });
    if (countNote) {
      countNote.textContent = q
        ? shown + " of 47 prefectures match “" + input.value.trim() + "”. " + baseNote
        : baseNote;
    }
  });
}

// ---- Controls ----
searchInput.addEventListener("input", function () {
  window.AppState.search = searchInput.value;
  showSearchResults(searchInput.value);
});

yearSelect.addEventListener("change", function () {
  window.AppState.year = parseInt(yearSelect.value, 10);
  render();
});

function setCurrency(cur) {
  window.AppState.currency = cur;
  document.getElementById("unit-yen").classList.toggle("active", cur === "yen");
  document.getElementById("unit-usd").classList.toggle("active", cur === "usd");
  document.getElementById("unit-yen").setAttribute("aria-pressed", String(cur === "yen"));
  document.getElementById("unit-usd").setAttribute("aria-pressed", String(cur === "usd"));
  render();
}
document.getElementById("unit-yen").addEventListener("click", function () { setCurrency("yen"); });
document.getElementById("unit-usd").addEventListener("click", function () { setCurrency("usd"); });

window.addEventListener("hashchange", function () {
  // Following a search result into its section clears the search box.
  window.AppState.search = "";
  searchInput.value = "";
  render();
});
render();
