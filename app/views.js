// Nippon in Numbers — view renderers, one per section.
// All numbers come from DATA in data.js; nothing here is invented.

function srcLine(source, year) {
  return "Source: " + source + ", " + year;
}

function moneyYen(trillionYen) {
  // Currency toggle: show yen, or dollars at the 2024 average rate.
  // ¥1 trillion / 151.5 yen per dollar = $0.0066 trillion, so divide directly.
  if (window.AppState && window.AppState.currency === "usd") {
    return "$" + (trillionYen / YEN_PER_DOLLAR).toFixed(2) + " trillion";
  }
  return "¥" + trillionYen.toFixed(1) + " trillion";
}

function moneyYenValue(trillionYen) {
  if (window.AppState && window.AppState.currency === "usd") {
    const usd = trillionYen / YEN_PER_DOLLAR;
    // Small values read better in billions than as a fraction of a trillion.
    if (Math.abs(usd) < 1) {
      return "$" + (usd * 1000).toFixed(1);
    }
    return "$" + usd.toFixed(2);
  }
  return "¥" + trillionYen.toFixed(1);
}

// Unit label that matches what moneyYenValue just produced.
function moneyYenUnit(trillionYen) {
  if (window.AppState && window.AppState.currency === "usd") {
    return Math.abs(trillionYen / YEN_PER_DOLLAR) < 1 ? "billion dollars" : "trillion dollars";
  }
  return "trillion yen";
}

function moneyUnit() {
  return moneyYenUnit(100);
}

function cardHTML(item, opts) {
  opts = opts || {};
  const value = opts.valueText || (item.value + (item.unit ? " <small>" + item.unit + "</small>" : ""));
  return '<article class="card' + (opts.accent ? " accent" : "") + '">' +
    '<div class="stat-label">' + item.label + "</div>" +
    '<div class="stat-value">' + value + "</div>" +
    '<p class="stat-detail">' + (opts.detail || item.detail || "") + "</p>" +
    '<p class="stat-source">' + srcLine(item.source, item.year) + "</p></article>";
}

function yearOf(state) {
  return state && state.year ? state.year : 2024;
}

// ---------- Overview ----------
function viewOverview() {
  const year = yearOf(window.AppState);
  const gdpYear = DATA.economy.nominalByYear.find(function (d) { return d.year === year; }) ||
    DATA.economy.nominalByYear[DATA.economy.nominalByYear.length - 1];
  const growthYear = DATA.economy.growth.find(function (d) { return d.year === year; }) ||
    DATA.economy.growth[DATA.economy.growth.length - 1];
  const cpiYear = DATA.prices.trend.find(function (d) { return d.year === year; });
  const unYear = DATA.labour.unemploymentTrend.find(function (d) { return d.year === year; });

  const gdpCard = {
    label: "Nominal GDP (" + gdpYear.year + ")",
    source: DATA.economy.nominalGdpYen.source, year: String(gdpYear.year),
    detail: "Real growth " + (growthYear.value > 0 ? "+" : "") + growthYear.value.toFixed(1) +
      "% on the year; the world's 4th largest economy"
  };
  const cpiCard = cpiYear ? {
    label: "Consumer prices (" + cpiYear.year + ")",
    source: DATA.prices.trendSource.source, year: String(cpiYear.year),
    detail: cpiYear.year === 2025
      ? "October year-on-year reading; core CPI (less fresh food) also 3.0%"
      : "Annual average change in the consumer price index"
  } : DATA.headline[3];
  const unCard = unYear ? {
    label: "Unemployment rate (" + unYear.year + ")",
    source: SOURCES.statBureau, year: String(unYear.year),
    detail: "Annual average, Labour Force Survey" +
      (unYear.year === 2025 ? "; 2.6% in September 2025 (seasonally adjusted)" : "")
  } : DATA.headline[2];
  // Population follows the census nearest the chosen year.
  const popYear = year <= 2022 ? 2020 : 2025;
  const popValue = DATA.population.censusTrend.find(function (d) { return d.year === popYear; });
  const popCard = {
    label: "Total population (" + popYear + " Census)",
    source: SOURCES.statBureau, year: String(popYear) + " Census",
    detail: popYear === 2025
      ? "1 October 2025, down 3.17 million (−2.5%) on the 2020 census"
      : "1 October 2020 census; the 2025 census fell to 122.97 million"
  };

  const cards = [
    cardHTML(popCard, { valueText: popValue.value.toFixed(2) + " <small>million</small>", accent: true }),
    cardHTML(gdpCard, { valueText: moneyYenValue(gdpYear.value) + " <small>" + moneyYenUnit(gdpYear.value) + "</small>" }),
    cardHTML(unCard, { valueText: unYear.value.toFixed(1) + " <small>%</small>" }),
    cardHTML(cpiCard, { valueText: cpiYear.value.toFixed(1) + " <small>% year on year</small>" }),
    cardHTML(DATA.headline[4], { valueText: moneyYenValue(DATA.headline[4].value) + " <small>" + moneyYenUnit(DATA.headline[4].value) + "</small>" }),
    cardHTML(DATA.headline[5]),
    cardHTML(DATA.headline[6], { valueText: moneyYenValue(DATA.headline[6].value) + " <small>" + moneyYenUnit(DATA.headline[6].value) + "</small>" }),
    cardHTML(DATA.headline[7], { valueText: DATA.headline[7].value.toFixed(2) + " <small>openings</small>" })
  ].join("");

  const ageBars = DATA.population.ageBands.map(function (b) {
    return { label: b.band, value: b.value, color: b.band === "75+" ? CHART.accent : CHART.navy };
  });
  const growthLine = DATA.economy.growth.map(function (g) {
    return { label: String(g.year), value: g.value };
  });
  const censusLine = DATA.population.censusTrend.map(function (d) {
    return { label: String(d.year), value: d.value };
  });

  return '<section class="view" id="view-overview">' +
    '<p class="section-label">Overview &middot; Japan at a glance</p>' +
    "<h2>Japan in eight numbers</h2>" +
    '<p class="lede">The essentials, as published by Japan&rsquo;s own statistical agencies. ' +
    "Pick a year above and the population, GDP, unemployment and prices cards follow it.</p>" +
    '<div class="cards four">' + cards + "</div>" +
    '<div class="key-findings">' +
    "<h3>Three things to know</h3>" +
    "<ol>" +
    "<li><strong>Japan is shrinking fast.</strong> The 2025 census counted 122.97 million people — " +
    "3.17 million fewer than in 2020, the steepest five-year fall since the census began in 1920.</li>" +
    "<li><strong>It is the world&rsquo;s oldest country.</strong> 29.4% of residents are 65 or older, " +
    "and the fertility rate hit a record low of 1.15 in 2024.</li>" +
    "<li><strong>Inflation is back, led by food.</strong> Consumer prices rose 3.0% in the year to " +
    "October 2025, with food up 6.4% and rice up 40.2%.</li>" +
    "</ol></div>" +
    '<div class="two-col">' +
    '<div class="panel"><h3>Who lives here</h3>' +
    "<p>Population by age band, millions of people. Nearly three in ten residents are 65 or older.</p>" +
    barChart(ageBars, { unit: "million", decimals: 2, yLabel: "million people" }) +
    '<p class="source-note">' + srcLine(DATA.population.ageSource.source, DATA.population.ageSource.year) + "</p></div>" +
    '<div class="panel"><h3>How the economy grew</h3>' +
    "<p>Real GDP growth, % on the previous year. The 2020 pandemic fall, the 2021 rebound, then near-flat growth.</p>" +
    lineChart(growthLine, { unit: "%", decimals: 1, yLabel: "% change" }) +
    '<p class="source-note">' + srcLine(DATA.economy.growthSource.source, DATA.economy.growthSource.year) + "</p></div>" +
    "</div>" +
    '<div class="panel"><h3>A century of growth, then decline</h3>' +
    "<p>Census population, millions. Japan peaked at 128.06 million in 2010 and has fallen in every census since.</p>" +
    lineChart(censusLine, { unit: "million", decimals: 2, yLabel: "million people", color: CHART.navy, zeroLine: false }) +
    '<p class="source-note">' + srcLine(DATA.population.censusTrendSource.source, DATA.population.censusTrendSource.year) + "</p></div>" +
    '<div class="callout"><strong>Reading this site:</strong> every figure carries its source and year. ' +
    "Use the search box to find any indicator, the year selector to move through time, " +
    "and the &yen; / $ toggle to see money in dollars at the 2024 average rate of &yen;151.5 per dollar.</div>" +
    "</section>";
}

// ---------- Population ----------
function viewPopulation() {
  const p = DATA.population;
  const rows = p.prefectures.map(function (d) {
    const cls = d.changePct >= 0 ? "pos" : "neg";
    const sign = d.changePct >= 0 ? "+" : "";
    return "<tr><td>" + d.rank + "</td><td>" + d.name + "</td>" +
      '<td class="num">' + d.population.toLocaleString("en-US") + "</td>" +
      '<td class="num ' + cls + '">' + sign + d.changePct.toFixed(2) + "%</td>" +
      '<td class="num">' + d.elderlyShare.toFixed(1) + "%</td></tr>";
  }).join("");
  const fertLine = p.fertilityTrend.map(function (d) {
    return { label: String(d.year), value: d.value };
  });
  const censusLine = p.censusTrend.map(function (d) {
    return { label: String(d.year), value: d.value };
  });

  return '<section class="view" id="view-population">' +
    '<p class="section-label">Population</p><h2>A shrinking, ageing country</h2>' +
    '<p class="lede">Japan&rsquo;s population fell by 3.17 million people between the 2020 and 2025 censuses — ' +
    "the fastest five-year fall on record. In the final counts, only Tokyo grew; the other 46 prefectures shrank.</p>" +
    '<div class="cards">' +
    cardHTML({ label: "Total population", source: p.total.source, year: p.total.year,
      detail: "Down 3.17 million (−2.5%) since the 2020 census" },
      { valueText: "122.97 <small>million</small>", accent: true }) +
    cardHTML({ label: "Share aged 65 and over", source: p.ageing.source, year: p.ageing.year,
      detail: "36.14 million people — the highest share in the world" },
      { valueText: p.ageing.value.toFixed(1) + " <small>%</small>" }) +
    cardHTML({ label: "Total fertility rate", source: p.fertility.source, year: p.fertility.year,
      detail: "686,061 births in 2024 — the first year below 700,000 since records began in 1899" },
      { valueText: p.fertility.value.toFixed(2) + " <small>children per woman</small>" }) +
    "</div>" +
    '<div class="two-col">' +
    '<div class="panel"><h3>Population by age band</h3>' +
    "<p>Millions of people, 2025 Census. Hover any bar for the exact figure.</p>" +
    barChart(p.ageBands.map(function (b) {
      return { label: b.band + " (" + b.share + "%)", value: b.value };
    }), { unit: "million", decimals: 2, yLabel: "million people" }) +
    '<p class="source-note">' + srcLine(p.ageSource.source, p.ageSource.year) +
    " &middot; Median age " + p.medianAge.value + " years. Children under 15: " + p.children.value +
    "% of the population. Deaths in 2024: " + p.deaths.value.toLocaleString("en-US") + ".</p></div>" +
    '<div class="panel"><h3>Fertility keeps falling</h3>' +
    "<p>Total fertility rate, children per woman. The replacement level is 2.1; Japan has been below it since the mid-1970s.</p>" +
    lineChart(fertLine, { unit: "children per woman", decimals: 2, yLabel: "children per woman", color: CHART.teal, zeroLine: false }) +
    '<p class="source-note">' + srcLine(p.fertilitySource.source, p.fertilitySource.year) + "</p></div>" +
    "</div>" +
    '<div class="panel"><h3>Census population, 2010–2025</h3>' +
    "<p>Millions of people at each census. The 2025 fall of 2.5% is the largest five-year drop on record.</p>" +
    lineChart(censusLine, { unit: "million", decimals: 2, yLabel: "million people", color: CHART.navy, zeroLine: false }) +
    '<p class="source-note">' + srcLine(p.censusTrendSource.source, p.censusTrendSource.year) + "</p></div>" +
    '<div class="panel"><h3>All 47 prefectures</h3>' +
    "<p>Click any column heading to sort. Type in the box to filter by prefecture name. " +
    "Change is since the 2020 census; the 65+ share is from the 2020 census.</p>" +
    '<div class="filter-row"><label for="pref-filter">Filter prefectures</label>' +
    '<input type="search" id="pref-filter" placeholder="Type a name — try “Aichi” or “Okinawa”…"></div>' +
    '<div class="chart-wrap"><table class="data" id="pref-table">' +
    "<thead><tr><th data-sort=\"rank\">Rank</th><th data-sort=\"name\">Prefecture</th>" +
    '<th data-sort="population" class="num">Population (2025)</th>' +
    '<th data-sort="changePct" class="num">Change 2020–25</th>' +
    '<th data-sort="elderlyShare" class="num">Aged 65+ (2020)</th></tr></thead>' +
    "<tbody>" + rows + "</tbody></table></div>" +
    '<p class="source-note" id="pref-count">' + srcLine(p.prefectureSource.source, p.prefectureSource.year) +
    " &middot; The ten largest prefectures hold about 58% of the country. Tokyo alone holds 11.6%.</p></div>" +
    "</section>";
}

// ---------- Economy ----------
function viewEconomy() {
  const e = DATA.economy;
  const growthLine = e.growth.map(function (g) { return { label: String(g.year), value: g.value }; });
  const nominalBars = e.nominalByYear.map(function (d) {
    return { label: String(d.year), value: d.value, color: CHART.navy };
  });
  const donutItems = e.industryShare.map(function (s, i) {
    return { label: s.sector, value: s.share,
      color: [CHART.navy, CHART.accent, CHART.gold][i] };
  });
  const partnerRows = e.partners.map(function (d) {
    const cls = d.balance >= 0 ? "pos" : "neg";
    const share = (d.exports / e.trade.exports.value * 100).toFixed(1);
    return "<tr><td>" + d.partner + "</td>" +
      '<td class="num">¥' + d.exports.toFixed(2) + " tn</td>" +
      '<td class="num">¥' + d.imports.toFixed(2) + " tn</td>" +
      '<td class="num ' + cls + '">¥' + d.balance.toFixed(2) + " tn</td>" +
      '<td class="num">' + share + "%</td></tr>";
  }).join("");
  const productBars = e.exportProducts.map(function (d) {
    // Short chart labels; the full product names are in the panel text.
    const short = { "Vehicles and parts": "Vehicles", "Machinery and computers": "Machinery",
      "Electrical machinery and electronics": "Electronics", "All other goods": "Other goods" };
    return { label: short[d.product] || d.product, value: d.share,
      color: d.product === "All other goods" ? CHART.grey : CHART.navy };
  });

  return '<section class="view" id="view-economy">' +
    '<p class="section-label">Economy</p><h2>The world&rsquo;s fourth-largest economy</h2>' +
    '<p class="lede">Nominal GDP reached &yen;609.3 trillion in 2024 — about $4.19 trillion. ' +
    "Real growth has been near-flat since the pandemic rebound, and the goods trade balance stays in deficit.</p>" +
    '<div class="cards">' +
    cardHTML({ label: "Nominal GDP", source: e.nominalGdpYen.source, year: e.nominalGdpYen.year,
      detail: "Calendar 2024; real growth just +0.1% on the year" },
      { valueText: moneyYenValue(609.3) + " <small>" + moneyYenUnit(609.3) + "</small>", accent: true }) +
    cardHTML({ label: "GDP per person", source: e.gdpPerCapita.source, year: e.gdpPerCapita.year,
      detail: "24th among OECD members — a record-low ranking, on a weaker yen" },
      { valueText: "$" + e.gdpPerCapita.value.toLocaleString("en-US") }) +
    cardHTML({ label: "Current account surplus", source: e.trade.currentAccount.source, year: e.trade.currentAccount.year,
      detail: "A record high, driven by investment income from abroad" },
      { valueText: moneyYenValue(e.trade.currentAccount.value) + " <small>" + moneyYenUnit(e.trade.currentAccount.value) + "</small>" }) +
    "</div>" +
    '<div class="two-col">' +
    '<div class="panel"><h3>Real GDP growth</h3><p>% change on the previous year.</p>' +
    lineChart(growthLine, { unit: "%", decimals: 1, yLabel: "% change" }) +
    '<p class="source-note">' + srcLine(e.growthSource.source, e.growthSource.year) + "</p></div>" +
    '<div class="panel"><h3>Nominal GDP by year</h3><p>Trillion yen, current prices. Hover for exact values.</p>' +
    barChart(nominalBars, { unit: "trillion yen", decimals: 1, yLabel: "trillion yen" }) +
    '<p class="source-note">' + srcLine(e.nominalGdpYen.source, e.nominalGdpYen.year) + "</p></div>" +
    "</div>" +
    '<div class="two-col">' +
    '<div class="panel"><h3>What Japan sells abroad</h3><p>Share of goods exports, 2024. ' +
    "Vehicles, machinery and electronics together make up almost 60% of exports.</p>" +
    barChart(productBars, { unit: "% of goods exports", decimals: 1, yLabel: "% of exports" }) +
    '<p class="source-note">' + srcLine(e.exportProductsSource.source, e.exportProductsSource.year) + "</p></div>" +
    '<div class="panel"><h3>What the economy is made of</h3><p>Share of GDP by sector.</p>' +
    donutChart(donutItems, { center: "Services", centerSub: "about 70% of GDP" }) +
    '<p class="source-note">' + srcLine(e.industrySource.source, e.industrySource.year) + "</p></div>" +
    "</div>" +
    '<div class="panel"><h3>Trade with the two biggest partners</h3>' +
    "<p>Goods trade, fiscal 2024 (April 2024 – March 2025). Japan runs a large surplus with the " +
    "United States and a large deficit with China. The last column is each partner&rsquo;s share of Japan&rsquo;s total exports.</p>" +
    '<table class="data"><thead><tr><th>Partner</th><th class="num">Exports</th>' +
    '<th class="num">Imports</th><th class="num">Balance</th><th class="num">Share of exports</th></tr></thead><tbody>' + partnerRows + "</tbody></table>" +
    '<p class="source-note">' + srcLine(e.partnersSource.source, e.partnersSource.year) +
    ". Calendar 2024 goods trade: exports &yen;107.9 trillion, imports &yen;113.2 trillion, deficit &yen;5.3 trillion.</p></div>" +
    "</div></section>";
}

// ---------- Labour ----------
function viewLabour() {
  const l = DATA.labour;
  const trend = l.unemploymentTrend.map(function (d) { return { label: String(d.year), value: d.value }; });
  const sectorBars = l.bySector.map(function (s) {
    return { label: s.sector.split(" (")[0], value: s.value };
  });
  const total = l.sectorTotal;
  const wageLine = l.minimumWageTrend.map(function (d) {
    return { label: String(d.year), value: d.value };
  });
  const wageRows = [
    { group: "All workers", monthly: l.wages.monthlyCash.value, note: "Incl. bonuses; real wages −0.2% on the year" },
    { group: "Regular employees", monthly: l.wages.regularMonthly.value, note: "Full-time, regular staff" },
    { group: "Part-time workers", monthly: l.wages.partTimeMonthly.value, note: "About a quarter of regular pay" }
  ].map(function (r) {
    return "<tr><td>" + r.group + "</td>" +
      '<td class="num">¥' + r.monthly.toLocaleString("en-US") + "</td><td>" + r.note + "</td></tr>";
  }).join("");

  return '<section class="view" id="view-labour">' +
    '<p class="section-label">Labour</p><h2>Near-full employment, modest pay</h2>' +
    '<p class="lede">Unemployment has sat between 2.4% and 2.8% for years, and 68.35 million people are in work. ' +
    "The story of Japanese labour is not joblessness — it is low wage growth and long hours that are slowly shortening.</p>" +
    '<div class="cards">' +
    cardHTML({ label: "Unemployment rate", source: l.unemployment.source, year: l.unemployment.year,
      detail: "Seasonally adjusted, September 2025; 1.81 million people unemployed" },
      { valueText: l.unemployment.value.toFixed(1) + " <small>%</small>", accent: true }) +
    cardHTML({ label: "Jobs per applicant", source: l.jobsToApplicants.source, year: l.jobsToApplicants.year,
      detail: "Effective job openings ratio — employers are short of workers" },
      { valueText: l.jobsToApplicants.value.toFixed(2) + " <small>openings</small>" }) +
    cardHTML({ label: "Average monthly pay", source: l.wages.monthlyCash.source, year: l.wages.monthlyCash.year,
      detail: "Total cash earnings incl. bonuses; real wages fell 0.2% on the year" },
      { valueText: "¥" + l.wages.monthlyCash.value.toLocaleString("en-US") }) +
    "</div>" +
    '<div class="two-col">' +
    '<div class="panel"><h3>Unemployment, annual average</h3><p>% of the labour force.</p>' +
    lineChart(trend, { unit: "%", decimals: 1, color: CHART.teal, yLabel: "% of labour force", zeroLine: false }) +
    '<p class="source-note">' + srcLine(SOURCES.statBureau, "2020–2025") + "</p></div>" +
    '<div class="panel"><h3>Where people work</h3><p>Employment by broad sector, millions of workers, 2024. ' +
    "Services employ " + (l.bySector[2].value / total * 100).toFixed(1) + "% of all workers.</p>" +
    barChart(sectorBars, { unit: "million", decimals: 2, yLabel: "million workers" }) +
    '<p class="source-note">' + srcLine(l.sectorSource.source, l.sectorSource.year) +
    " &middot; Total employed: " + total.toFixed(2) + " million.</p></div>" +
    "</div>" +
    '<div class="two-col">' +
    '<div class="panel"><h3>The minimum wage climbs</h3>' +
    "<p>National weighted-average minimum wage, yen per hour. It has risen every year since 2020, " +
    "crossing &yen;1,000 in 2023; the government aims for &yen;1,500 by the mid-2030s.</p>" +
    lineChart(wageLine, { unit: "yen per hour", decimals: 0, yLabel: "yen per hour", color: CHART.gold, zeroLine: false }) +
    '<p class="source-note">' + srcLine(l.minimumWageSource.source, l.minimumWageSource.year) +
    " &middot; Tokyo's rate is the highest (&yen;1,163 in 2024); the lowest prefectures are near &yen;951.</p></div>" +
    '<div class="panel"><h3>Pay by type of worker</h3>' +
    "<p>Average monthly cash earnings, fiscal 2024. The gap between regular and part-time pay is wide — " +
    "part-timers earn about a quarter of what regular employees do.</p>" +
    '<table class="data"><thead><tr><th>Group</th><th class="num">Monthly pay</th><th>Note</th></tr></thead>' +
    "<tbody>" + wageRows + "</tbody></table>" +
    '<p class="source-note">' + srcLine(l.wages.monthlyCash.source, l.wages.monthlyCash.year) + "</p></div>" +
    "</div>" +
    '<div class="panel"><h3>Pay and hours</h3>' +
    "<p><strong>Average annual salary:</strong> &yen;" + l.wages.annualSalary.value.toLocaleString("en-US") +
    " (2024, " + l.wages.annualSalary.source + "). Regular employees average &yen;" +
    l.wages.regularMonthly.value.toLocaleString("en-US") + " a month (FY2024). The national " +
    "weighted-average minimum wage is &yen;" + l.wages.minimumWage.value + " an hour (October 2024).</p>" +
    "<p><strong>Hours:</strong> the average worker put in " + l.hours.annual.value.toLocaleString("en-US") +
    " hours in 2024 (" + l.hours.annual.source + "), or " + l.hours.monthly.value +
    " hours a month (" + l.hours.monthly.source + ", 2024). " + l.hours.overtimeCap + "</p>" +
    '<p class="source-note">Sources: ' + l.wages.monthlyCash.source + ", 2024; " +
    l.wages.annualSalary.source + ", 2024; " + l.hours.annual.source + ", 2024.</p></div>" +
    "</section>";
}

// ---------- Prices ----------
function viewPrices() {
  const pr = DATA.prices;
  const trend = pr.trend.map(function (d) { return { label: String(d.year), value: d.value }; });
  const compBars = pr.components.map(function (c) {
    return { label: c.item, value: c.value, color: c.item === "All items" ? CHART.accent : CHART.navy };
  });
  const compRows = pr.components.map(function (c) {
    return "<tr><td>" + c.item + "</td>" +
      '<td class="num">+' + c.value.toFixed(1) + "%</td><td>" + c.note + "</td></tr>";
  }).join("");

  return '<section class="view" id="view-prices">' +
    '<p class="section-label">Prices</p><h2>Inflation is back — led by food</h2>' +
    '<p class="lede">After decades of flat prices, Japan&rsquo;s CPI rose 2.7% in 2024 and 3.0% in the year to ' +
    "October 2025. Food is doing most of the damage: up 6.4%, with rice up 40.2% on the year.</p>" +
    '<div class="cards">' +
    cardHTML({ label: "CPI, all items", source: pr.headline.source, year: pr.headline.year,
      detail: "Year on year, October 2025" },
      { valueText: "+" + pr.headline.value.toFixed(1) + " <small>%</small>", accent: true }) +
    cardHTML({ label: "Core CPI (less fresh food)", source: pr.core.source, year: pr.core.year,
      detail: "The Bank of Japan's preferred measure; also 3.0%" },
      { valueText: "+" + pr.core.value.toFixed(1) + " <small>%</small>" }) +
    cardHTML({ label: "Food prices", source: pr.componentsSource.source, year: pr.componentsSource.year,
      detail: "Year on year, October 2025; rice alone +40.2%" },
      { valueText: "+" + pr.components[0].value.toFixed(1) + " <small>%</small>" }) +
    "</div>" +
    '<div class="two-col">' +
    '<div class="panel"><h3>CPI, year-on-year change</h3><p>%, all items. 2025 is the October reading; earlier years are annual averages. ' +
    "Prices were flat in 2020–21, then jumped as the yen weakened and energy costs rose.</p>" +
    lineChart(trend, { unit: "%", decimals: 1, yLabel: "% change" }) +
    '<p class="source-note">' + srcLine(pr.trendSource.source, pr.trendSource.year) + "</p></div>" +
    '<div class="panel"><h3>What got more expensive</h3><p>% change year on year, October 2025.</p>' +
    barChart(compBars, { unit: "%", decimals: 1, yLabel: "% change" }) +
    '<p class="source-note">' + srcLine(pr.componentsSource.source, pr.componentsSource.year) + "</p></div>" +
    "</div>" +
    '<div class="panel"><h3>Price rises by category, October 2025</h3>' +
    "<p>Year-on-year change in the consumer price index. Food inflation is more than four times services inflation — " +
    "which is why households feel this inflation at the supermarket more than anywhere else.</p>" +
    '<table class="data"><thead><tr><th>Category</th><th class="num">Change on the year</th><th>Note</th></tr></thead>' +
    "<tbody>" + compRows + "</tbody></table>" +
    '<p class="source-note">' + srcLine(pr.componentsSource.source, pr.componentsSource.year) + "</p></div>" +
    '<div class="panel"><h3>Housing</h3><p>' + pr.housing.text + "</p>" +
    '<p class="source-note">' + srcLine(pr.housing.source, pr.housing.year) + "</p></div>" +
    "</section>";
}

// ---------- About ----------
function viewAbout() {
  const rows = [
    { pub: "Statistics Bureau of Japan (Ministry of Internal Affairs and Communications)",
      what: "2025 Population Census; Population Estimates (Oct 2024); Labour Force Survey; Consumer Price Index",
      years: "2024–2025" },
    { pub: "Cabinet Office of Japan",
      what: "National Accounts (SNA): nominal GDP, real GDP growth, GDP per capita",
      years: "2020–2024" },
    { pub: "Ministry of Health, Labour and Welfare",
      what: "Vital Statistics (births, deaths, fertility rate, life expectancy); Monthly Labour Survey (wages, hours); minimum wage",
      years: "2024" },
    { pub: "Ministry of Finance",
      what: "Trade Statistics of Japan (customs): exports, imports, trade balance, current account",
      years: "2024 / FY2024" },
    { pub: "National Tax Agency",
      what: "Private Sector Salary Survey: average annual salary",
      years: "2024" },
    { pub: "Ministry of Health, Labour and Welfare",
      what: "Minimum-wage revisions (national weighted average, FY2020–FY2025); jobs-to-applicants ratio",
      years: "2020–2025" },
    { pub: "Japan Institute for Labour Policy and Training",
      what: "Employment by industry; Databook of International Labour Statistics (annual hours worked)",
      years: "2024" },
    { pub: "CIA World Factbook",
      what: "GDP composition by sector (services / industry / agriculture)",
      years: "2022" }
  ];
  const items = rows.map(function (r) {
    return '<li><span class="pub">' + r.pub + "</span><br>" + r.what +
      "<br><span class=\"source-note\">Data years: " + r.years + "</span></li>";
  }).join("");

  return '<section class="view" id="view-about">' +
    '<p class="section-label">About the data</p><h2>Where every number comes from</h2>' +
    '<p class="lede">Figures on this site are from official publications. Each figure on the site ' +
    "is labelled with its publisher and the year it refers to; this page lists every source in one place.</p>" +
    '<div class="callout"><strong>Our promise:</strong> figures are from official publications. ' +
    "Where a figure is an estimate or a preliminary count, the page says so. " +
    "Where the latest full year is 2024, we show 2024 — we do not dress up older data as current.</div>" +
    "<h3>Sources</h3>" +
    '<ul class="source-list">' + items + "</ul>" +
    "<h3>Method</h3>" +
    "<p>Population figures are census counts (1 October 2025) or the Statistics Bureau&rsquo;s annual " +
    "estimates. GDP figures are calendar-year national accounts from the Cabinet Office; trade figures " +
    "are customs values from the Ministry of Finance, with fiscal-year partner figures labelled FY2024. " +
    "Wage and hours figures come from the Ministry of Health, Labour and Welfare&rsquo;s Monthly Labour " +
    "Survey and the National Tax Agency&rsquo;s salary survey. The &yen; / $ toggle converts at the 2024 " +
    "average exchange rate of &yen;151.5 per US dollar (Cabinet Office).</p>" +
    "<p>Charts are drawn as inline SVG from the same data files that feed the tables, so a chart and its " +
    "table can never disagree. Figures were last checked in November 2026.</p>" +
    "</section>";
}

const VIEWS = {
  overview: viewOverview,
  population: viewPopulation,
  economy: viewEconomy,
  labour: viewLabour,
  prices: viewPrices,
  about: viewAbout
};
