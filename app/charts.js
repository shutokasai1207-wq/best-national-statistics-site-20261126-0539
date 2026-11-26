// Nippon in Numbers — hand-built SVG chart builders.
// Bar charts, line charts and a donut chart, drawn with plain SVG.
// Every bar / point carries a hover tooltip with its exact value.

const CHART = {
  navy: "#14243e",
  accent: "#c93a22",
  teal: "#2e7d6b",
  gold: "#b98a1d",
  grey: "#8a94a3",
  grid: "#e6dfd0"
};

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmtNum(v, decimals) {
  return Number(v).toLocaleString("en-US", {
    minimumFractionDigits: decimals || 0,
    maximumFractionDigits: decimals || 0
  });
}

// Shared tooltip element: one per chart holder, positioned by mouse events.
function tooltipHtml() {
  return '<div class="tooltip" role="status"></div>';
}

function attachTooltips(holder, tipText) {
  const tip = holder.querySelector(".tooltip");
  if (!tip) return;
  holder.querySelectorAll("[data-tip]").forEach(function (el) {
    el.addEventListener("mouseenter", function (ev) {
      tip.textContent = el.getAttribute("data-tip");
      tip.style.opacity = "1";
      moveTip(ev);
    });
    el.addEventListener("mousemove", moveTip);
    el.addEventListener("mouseleave", function () { tip.style.opacity = "0"; });
  });
  function moveTip(ev) {
    const r = holder.getBoundingClientRect();
    let x = ev.clientX - r.left + 12;
    let y = ev.clientY - r.top - 30;
    if (x + 170 > r.width) x = r.width - 175;
    if (y < 4) y = ev.clientY - r.top + 14;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }
  if (tipText) tip.textContent = tipText;
}

// ---- Vertical bar chart ----
// items: [{label, value, color?}]  opts: {height, unit, decimals, yLabel}
function barChart(items, opts) {
  opts = opts || {};
  const W = 640, H = opts.height || 320, padL = 64, padB = 34, padT = 14, padR = 12;
  const max = Math.max.apply(null, items.map(function (d) { return Math.abs(d.value); })) * 1.08;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const bw = Math.min(64, innerW / items.length * 0.62);
  const step = innerW / items.length;
  let g = "";
  // gridlines + y labels, with a unit label on the axis
  [0, 0.25, 0.5, 0.75, 1].forEach(function (f) {
    const y = padT + innerH * (1 - f);
    g += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y +
      '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    g += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="12" fill="' +
      CHART.grey + '">' + fmtNum(max * f, opts.decimals || 0) + "</text>";
  });
  if (opts.yLabel) {
    g += '<text x="14" y="' + (padT + innerH / 2) + '" font-size="12" fill="' + CHART.grey +
      '" text-anchor="middle" transform="rotate(-90 14 ' + (padT + innerH / 2) + ')">' +
      esc(opts.yLabel) + "</text>";
  }
  items.forEach(function (d, i) {
    const h = Math.abs(d.value) / max * innerH;
    const x = padL + step * i + (step - bw) / 2;
    const y = padT + innerH - h;
    const color = d.color || (i % 2 ? CHART.navy : CHART.accent);
    const tip = d.label + ": " + fmtNum(d.value, opts.decimals || 0) + (opts.unit ? " " + opts.unit : "");
    g += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) +
      '" height="' + h.toFixed(1) + '" rx="3" fill="' + color + '" data-tip="' + esc(tip) + '">' +
      '<title>' + esc(tip) + "</title></rect>";
    g += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) +
      '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CHART.navy + '">' +
      fmtNum(d.value, opts.decimals || 0) + "</text>";
    g += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="12" fill="#3c4656">' +
      esc(d.label) + "</text>";
  });
  return '<div class="chart-holder"><div class="chart-wrap">' +
    '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Bar chart">' + g + "</svg></div>" +
    tooltipHtml() + "</div>";
}

// ---- Line chart ----
// points: [{label, value}]  opts: {height, unit, decimals, color, zeroLine, yLabel, fill}
function lineChart(points, opts) {
  opts = opts || {};
  const W = 640, H = opts.height || 300, padL = 64, padB = 34, padT = 20, padR = 16;
  const vals = points.map(function (p) { return p.value; });
  let lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
  if (opts.zeroLine !== false) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
  const pad = (hi - lo) * 0.15 || 1;
  lo -= pad; hi += pad;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const xAt = function (i) { return padL + innerW * i / (points.length - 1); };
  const yAt = function (v) { return padT + innerH * (1 - (v - lo) / (hi - lo)); };
  const color = opts.color || CHART.accent;
  let g = "";
  [0, 0.25, 0.5, 0.75, 1].forEach(function (f) {
    const v = lo + (hi - lo) * f, y = yAt(v);
    g += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) +
      '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    g += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' +
      CHART.grey + '">' + fmtNum(v, opts.decimals || 1) + "</text>";
  });
  if (opts.yLabel) {
    g += '<text x="14" y="' + (padT + innerH / 2) + '" font-size="12" fill="' + CHART.grey +
      '" text-anchor="middle" transform="rotate(-90 14 ' + (padT + innerH / 2) + ')">' +
      esc(opts.yLabel) + "</text>";
  }
  if (lo < 0 && hi > 0) {
    g += '<line x1="' + padL + '" y1="' + yAt(0).toFixed(1) + '" x2="' + (W - padR) + '" y2="' +
      yAt(0).toFixed(1) + '" stroke="#b9a98c" stroke-width="1.5"/>';
  }
  const d = points.map(function (p, i) {
    return (i ? "L" : "M") + xAt(i).toFixed(1) + " " + yAt(p.value).toFixed(1);
  }).join(" ");
  // Soft area fill under the line so the shape reads at a glance.
  const base = yAt(Math.max(lo, 0));
  g += '<path d="' + d + " L" + xAt(points.length - 1).toFixed(1) + " " + base.toFixed(1) +
    " L" + xAt(0).toFixed(1) + " " + base.toFixed(1) +
    ' Z" fill="' + color + '" fill-opacity="0.08" stroke="none"/>';
  g += '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  points.forEach(function (p, i) {
    const tip = p.label + ": " + fmtNum(p.value, opts.decimals || 1) + (opts.unit ? " " + opts.unit : "");
    g += '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(p.value).toFixed(1) +
      '" r="5" fill="#fff" stroke="' + color + '" stroke-width="2.5" data-tip="' + esc(tip) + '">' +
      "<title>" + esc(tip) + "</title></circle>";
    g += '<text x="' + xAt(i).toFixed(1) + '" y="' + (yAt(p.value) - 12).toFixed(1) +
      '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CHART.navy + '">' +
      fmtNum(p.value, opts.decimals || 1) + "</text>";
    g += '<text x="' + xAt(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="12" fill="#3c4656">' +
      esc(p.label) + "</text>";
  });
  return '<div class="chart-holder"><div class="chart-wrap">' +
    '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Line chart">' + g + "</svg></div>" +
    tooltipHtml() + "</div>";
}

// ---- Donut chart ----
// items: [{label, value, color}] — values are shares that sum to ~100.
function donutChart(items, opts) {
  opts = opts || {};
  const size = 260, cx = 130, cy = 130, r = 96, inner = 58;
  const total = items.reduce(function (a, d) { return a + d.value; }, 0);
  let g = "", angle = -Math.PI / 2;
  items.forEach(function (d) {
    const frac = d.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const tip = d.label + ": " + fmtNum(d.value, 1) + "%";
    g += '<path d="M ' + x0.toFixed(1) + " " + y0.toFixed(1) + " A " + r + " " + r + " 0 " + large +
      " 1 " + x1.toFixed(1) + " " + y1.toFixed(1) + " L " + xi1.toFixed(1) + " " + yi1.toFixed(1) +
      " A " + inner + " " + inner + " 0 " + large + " 0 " + xi0.toFixed(1) + " " + yi0.toFixed(1) +
      ' Z" fill="' + d.color + '" data-tip="' + esc(tip) + '"><title>' + esc(tip) + "</title></path>";
    angle = a1;
  });
  let legend = '<ul style="list-style:none;margin:12px 0 0;padding:0;font-size:14px">';
  items.forEach(function (d) {
    legend += '<li style="margin:4px 0"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:' +
      d.color + ';margin-right:8px"></span>' + esc(d.label) + " — <strong>" + fmtNum(d.value, 1) + "%</strong></li>";
  });
  legend += "</ul>";
  return '<div class="chart-holder"><div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
    '<svg viewBox="0 0 ' + size + " " + size + '" width="240" height="240" role="img" aria-label="Donut chart">' + g +
    '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="15" font-weight="700" fill="' + CHART.navy + '">' +
    esc(opts.center || "") + '</text><text x="' + cx + '" y="' + (cy + 18) +
    '" text-anchor="middle" font-size="12" fill="' + CHART.grey + '">' + esc(opts.centerSub || "") + "</text></svg>" +
    legend + "</div>" + tooltipHtml() + "</div>";
}

// After a view is inserted into the page, wire up its tooltips.
function wireCharts(root) {
  (root || document).querySelectorAll(".chart-holder").forEach(function (h) { attachTooltips(h); });
}
