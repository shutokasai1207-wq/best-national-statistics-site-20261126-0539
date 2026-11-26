// Nippon in Numbers — all figures are real, published statistics.
// Every figure carries its publisher and the year it refers to.
// Figures were checked against the Statistics Bureau of Japan, the Cabinet
// Office, the Ministry of Health, Labour and Welfare, the Ministry of
// Finance, the National Tax Agency and the Japan Institute for Labour
// Policy and Training before being written here.

const SOURCES = {
  statBureau: "Statistics Bureau of Japan",
  cabinetOffice: "Cabinet Office of Japan",
  mhlw: "Ministry of Health, Labour and Welfare",
  mof: "Ministry of Finance",
  nta: "National Tax Agency",
  jilpt: "Japan Institute for Labour Policy and Training",
  oecd: "OECD / JILPT Databook of International Labour Statistics"
};

// Exchange rate used by the ¥ / $ toggle: 2024 average, Cabinet Office.
const YEN_PER_DOLLAR = 151.5;

const DATA = {
  meta: {
    siteName: "Nippon in Numbers",
    country: "Japan",
    updated: "November 2026",
    note: "All figures are from official publications. Each figure shows its source and the year it refers to."
  },

  // ---- Headline indicators (overview dashboard) ----
  headline: [
    { id: "population", label: "Total population", value: 122.97, unit: "million", decimals: 2,
      detail: "1 October 2025, down 3.17 million (−2.5%) on the 2020 census",
      source: SOURCES.statBureau, year: "2025 Census" },
    { id: "gdp", label: "Nominal GDP", value: 609.3, unit: "trillion yen", decimals: 1, currency: true,
      detail: "Calendar year, about $4.19 trillion — the world's 4th largest economy",
      source: SOURCES.cabinetOffice, year: "2024" },
    { id: "unemployment", label: "Unemployment rate", value: 2.6, unit: "%", decimals: 1,
      detail: "Seasonally adjusted, September 2025; annual average 2.5% in 2025",
      source: SOURCES.statBureau, year: "2025" },
    { id: "cpi", label: "Consumer prices (CPI)", value: 3.0, unit: "% year on year", decimals: 1,
      detail: "All items, October 2025; core (less fresh food) also 3.0%",
      source: SOURCES.statBureau, year: "2025" },
    { id: "trade", label: "Trade balance (goods)", value: -5.3, unit: "trillion yen", decimals: 1, currency: true,
      detail: "Calendar year; exports ¥107.9 trillion, imports ¥113.2 trillion",
      source: SOURCES.mof, year: "2024" },
    { id: "life", label: "Life expectancy at birth", value: 84.0, unit: "years", decimals: 1,
      detail: "Men 81.09 years, women 87.13 years",
      source: SOURCES.mhlw, year: "2024" },
    { id: "current", label: "Current account surplus", value: 29.26, unit: "trillion yen", decimals: 2, currency: true,
      detail: "Record high, driven by investment income from abroad",
      source: SOURCES.mof, year: "2024" },
    { id: "jobs", label: "Jobs per applicant", value: 1.20, unit: "openings", decimals: 2,
      detail: "Effective job openings ratio, September 2025 — more jobs than jobseekers",
      source: SOURCES.mhlw, year: "2025" }
  ],

  // ---- Population ----
  population: {
    total: { value: 122972528, label: "Total population, 1 October 2025",
      source: SOURCES.statBureau, year: "2025 Census" },
    change5y: { value: -3173571, pct: -2.5, label: "Change since the 2020 census",
      source: SOURCES.statBureau, year: "2020–2025" },
    // Age bands sum to the census total (millions, one decimal).
    ageBands: [
      { band: "0–14", value: 13.35, share: 10.9 },
      { band: "15–64", value: 73.48, share: 59.8 },
      { band: "65–74", value: 14.97, share: 12.2 },
      { band: "75+", value: 21.17, share: 17.2 }
    ],
    ageSource: { source: SOURCES.statBureau, year: "2025 Census" },
    ageing: { value: 29.4, unit: "%", label: "Share aged 65 and over",
      source: SOURCES.statBureau, year: "2025 Census" },
    children: { value: 10.9, unit: "%", label: "Share under 15",
      source: SOURCES.statBureau, year: "2025 Census" },
    medianAge: { value: 50.5, unit: "years", label: "Median age",
      source: SOURCES.statBureau, year: "2025 Census" },
    fertility: { value: 1.15, label: "Total fertility rate (children per woman)",
      source: SOURCES.mhlw, year: "2024" },
    births: { value: 686061, label: "Births in the year (Japanese nationals)",
      source: SOURCES.mhlw, year: "2024" },
    deaths: { value: 1605298, label: "Deaths in the year",
      source: SOURCES.mhlw, year: "2024" },
    // Census totals, millions (Statistics Bureau, Population Census).
    censusTrend: [
      { year: 2010, value: 128.06 }, { year: 2015, value: 127.09 },
      { year: 2020, value: 126.15 }, { year: 2025, value: 122.97 }
    ],
    censusTrendSource: { source: SOURCES.statBureau, year: "2010–2025" },
    // Total fertility rate, MHLW Vital Statistics (World Bank series).
    fertilityTrend: [
      { year: 2020, value: 1.33 }, { year: 2021, value: 1.30 },
      { year: 2022, value: 1.26 }, { year: 2023, value: 1.20 },
      { year: 2024, value: 1.15 }
    ],
    fertilitySource: { source: SOURCES.mhlw, year: "2020–2024" },
    // All 47 prefectures, 2025 Census final counts. elderlyShare is the
    // share aged 65+ from the 2020 census (same source).
    prefectures: [
      { rank: 1, name: "Tokyo", population: 14236627, changePct: 1.35, elderlyShare: 19.7 },
      { rank: 2, name: "Kanagawa", population: 9193922, changePct: -0.47, elderlyShare: 22.5 },
      { rank: 3, name: "Osaka", population: 8759312, changePct: -0.89, elderlyShare: 24.3 },
      { rank: 4, name: "Aichi", population: 7448043, changePct: -1.25, elderlyShare: 22.4 },
      { rank: 5, name: "Saitama", population: 7287325, changePct: -0.78, elderlyShare: 24.4 },
      { rank: 6, name: "Chiba", population: 6257225, changePct: -0.43, elderlyShare: 24.6 },
      { rank: 7, name: "Hyogo", population: 5317792, changePct: -2.69, elderlyShare: 25.7 },
      { rank: 8, name: "Fukuoka", population: 5077785, changePct: -1.12, elderlyShare: 24.4 },
      { rank: 9, name: "Hokkaido", population: 4980272, changePct: -4.68, elderlyShare: 28.1 },
      { rank: 10, name: "Shizuoka", population: 3465667, changePct: -4.61, elderlyShare: 26.4 },
      { rank: 11, name: "Ibaraki", population: 2789856, changePct: -2.69, elderlyShare: 26.5 },
      { rank: 12, name: "Hiroshima", population: 2682786, changePct: -4.18, elderlyShare: 25.7 },
      { rank: 13, name: "Kyoto", population: 2500173, changePct: -3.02, elderlyShare: 25.7 },
      { rank: 14, name: "Miyagi", population: 2225414, changePct: -3.33, elderlyShare: 24.6 },
      { rank: 15, name: "Niigata", population: 2067144, changePct: -6.09, elderlyShare: 28.4 },
      { rank: 16, name: "Nagano", population: 1953866, changePct: -4.60, elderlyShare: 27.5 },
      { rank: 17, name: "Gifu", population: 1889576, changePct: -4.51, elderlyShare: 26.8 },
      { rank: 18, name: "Gunma", population: 1865934, changePct: -3.77, elderlyShare: 26.6 },
      { rank: 19, name: "Tochigi", population: 1863329, changePct: -3.61, elderlyShare: 25.7 },
      { rank: 20, name: "Okayama", population: 1807160, changePct: -4.30, elderlyShare: 26.4 },
      { rank: 21, name: "Fukushima", population: 1710242, changePct: -6.70, elderlyShare: 27.5 },
      { rank: 22, name: "Mie", population: 1693225, changePct: -4.35, elderlyShare: 26.3 },
      { rank: 23, name: "Kumamoto", population: 1677302, changePct: -3.51, elderlyShare: 26.9 },
      { rank: 24, name: "Kagoshima", population: 1511783, changePct: -4.81, elderlyShare: 27.9 },
      { rank: 25, name: "Okinawa", population: 1466548, changePct: -0.06, elderlyShare: 19.4 },
      { rank: 26, name: "Shiga", population: 1392008, changePct: -1.53, elderlyShare: 23.1 },
      { rank: 27, name: "Nara", population: 1268181, changePct: -4.25, elderlyShare: 28.1 },
      { rank: 28, name: "Yamaguchi", population: 1262770, changePct: -5.91, elderlyShare: 30.2 },
      { rank: 29, name: "Ehime", population: 1259907, changePct: -5.61, elderlyShare: 28.9 },
      { rank: 30, name: "Nagasaki", population: 1232040, changePct: -6.12, elderlyShare: 28.6 },
      { rank: 31, name: "Aomori", population: 1139461, changePct: -7.96, elderlyShare: 29.6 },
      { rank: 32, name: "Iwate", population: 1124652, changePct: -7.09, elderlyShare: 29.1 },
      { rank: 33, name: "Ishikawa", population: 1086596, changePct: -4.06, elderlyShare: 26.1 },
      { rank: 34, name: "Oita", population: 1076353, changePct: -4.23, elderlyShare: 28.9 },
      { rank: 35, name: "Miyazaki", population: 1017628, changePct: -4.86, elderlyShare: 28.1 },
      { rank: 36, name: "Yamagata", population: 992297, changePct: -7.09, elderlyShare: 28.9 },
      { rank: 37, name: "Toyama", population: 982147, changePct: -5.09, elderlyShare: 28.5 },
      { rank: 38, name: "Kagawa", population: 906828, changePct: -4.57, elderlyShare: 27.6 },
      { rank: 39, name: "Akita", population: 881470, changePct: -8.13, elderlyShare: 32.4 },
      { rank: 40, name: "Wakayama", population: 863757, changePct: -6.38, elderlyShare: 29.0 },
      { rank: 41, name: "Saga", population: 780675, changePct: -3.79, elderlyShare: 26.5 },
      { rank: 42, name: "Yamanashi", population: 779276, changePct: -3.79, elderlyShare: 26.8 },
      { rank: 43, name: "Fukui", population: 728588, changePct: -4.99, elderlyShare: 26.4 },
      { rank: 44, name: "Tokushima", population: 674790, changePct: -6.22, elderlyShare: 29.8 },
      { rank: 45, name: "Kochi", population: 642836, changePct: -7.04, elderlyShare: 30.5 },
      { rank: 46, name: "Shimane", population: 628887, changePct: -6.29, elderlyShare: 29.1 },
      { rank: 47, name: "Tottori", population: 523073, changePct: -5.48, elderlyShare: 27.6 }
    ],
    prefectureSource: { source: SOURCES.statBureau, year: "2025 Census" }
  },

  // ---- Economy ----
  economy: {
    nominalGdpYen: { value: 609.3, unit: "trillion yen", source: SOURCES.cabinetOffice, year: "2024" },
    nominalGdpUsd: { value: 4.19, unit: "trillion dollars", source: SOURCES.cabinetOffice, year: "2024" },
    gdpPerCapita: { value: 33785, unit: "US dollars", source: SOURCES.cabinetOffice, year: "2024" },
    // Real GDP growth, calendar year, Cabinet Office national accounts.
    growth: [
      { year: 2020, value: -4.3 }, { year: 2021, value: 3.6 },
      { year: 2022, value: 1.2 }, { year: 2023, value: 0.9 },
      { year: 2024, value: 0.1 }
    ],
    growthSource: { source: SOURCES.cabinetOffice, year: "2020–2024" },
    // Nominal GDP by year (trillion yen), Cabinet Office.
    nominalByYear: [
      { year: 2020, value: 554.3 }, { year: 2021, value: 574.2 },
      { year: 2022, value: 581.3 }, { year: 2023, value: 586.5 },
      { year: 2024, value: 609.3 }
    ],
    // Share of GDP by sector (CIA World Factbook values, labelled as such).
    industryShare: [
      { sector: "Services", share: 70 },
      { sector: "Industry", share: 29 },
      { sector: "Agriculture", share: 1 }
    ],
    industrySource: { source: "CIA World Factbook", year: "2022" },
    trade: {
      exports: { value: 107.9, unit: "trillion yen", source: SOURCES.mof, year: "2024" },
      imports: { value: 113.2, unit: "trillion yen", source: SOURCES.mof, year: "2024" },
      balance: { value: -5.3, unit: "trillion yen", source: SOURCES.mof, year: "2024" },
      currentAccount: { value: 29.26, unit: "trillion yen", note: "Record high",
        source: SOURCES.mof, year: "2024" }
    },
    // Top export products, share of goods exports, 2024.
    exportProducts: [
      { product: "Vehicles and parts", share: 21.7 },
      { product: "Machinery and computers", share: 19.1 },
      { product: "Electrical machinery and electronics", share: 18.5 },
      { product: "All other goods", share: 40.7 }
    ],
    exportProductsSource: { source: SOURCES.mof, year: "2024" },
    // Top export destinations, fiscal 2024 customs values (verified).
    partners: [
      { partner: "United States", exports: 21.65, imports: 12.64, balance: 9.01 },
      { partner: "China", exports: 18.89, imports: 25.94, balance: -7.05 }
    ],
    partnersNote: "Goods trade, trillion yen, fiscal 2024 (April 2024 – March 2025), " +
      "Ministry of Finance customs data. The United States is Japan's largest export " +
      "market; China is its largest source of imports.",
    partnersSource: { source: SOURCES.mof, year: "FY2024" }
  },

  // ---- Labour ----
  labour: {
    unemployment: { value: 2.6, unit: "%", label: "Seasonally adjusted, September 2025",
      source: SOURCES.statBureau, year: "2025" },
    // Annual average unemployment rate, Labour Force Survey.
    unemploymentTrend: [
      { year: 2020, value: 2.8 }, { year: 2021, value: 2.8 },
      { year: 2022, value: 2.6 }, { year: 2023, value: 2.6 },
      { year: 2024, value: 2.5 }, { year: 2025, value: 2.5 }
    ],
    employed: { value: 68.35, unit: "million", label: "Employed persons, September 2025",
      source: SOURCES.statBureau, year: "2025" },
    jobsToApplicants: { value: 1.20, label: "Jobs-to-applicants ratio (effective job openings)",
      source: SOURCES.mhlw, year: "Sep 2025" },
    // National weighted-average minimum wage, yen per hour (MHLW).
    minimumWageTrend: [
      { year: 2020, value: 902 }, { year: 2021, value: 930 },
      { year: 2022, value: 961 }, { year: 2023, value: 1004 },
      { year: 2024, value: 1055 }, { year: 2025, value: 1121 }
    ],
    minimumWageSource: { source: SOURCES.mhlw, year: "2020–2025" },
    // Employment by broad sector, 2024 (millions of workers).
    bySector: [
      { sector: "Primary (agriculture, forestry, fishing)", value: 1.92 },
      { sector: "Secondary (manufacturing, construction)", value: 15.25 },
      { sector: "Tertiary (services)", value: 50.64 }
    ],
    sectorTotal: 67.81,
    sectorSource: { source: SOURCES.jilpt, year: "2024" },
    wages: {
      monthlyCash: { value: 348182, unit: "yen per month",
        label: "Average total cash earnings per worker (incl. bonuses)",
        source: SOURCES.mhlw, year: "2024" },
      annualSalary: { value: 4775000, unit: "yen per year",
        label: "Average annual salary, private-sector workers",
        source: SOURCES.nta, year: "2024" },
      regularMonthly: { value: 455726, unit: "yen per month",
        label: "Regular employees, average monthly cash earnings",
        source: SOURCES.mhlw, year: "FY2024" },
      partTimeMonthly: { value: 112637, unit: "yen per month",
        label: "Part-time workers, average monthly cash earnings",
        source: SOURCES.mhlw, year: "FY2024" },
      minimumWage: { value: 1055, unit: "yen per hour",
        label: "National weighted-average minimum wage",
        source: SOURCES.mhlw, year: "Oct 2024" },
      realWageChange: { value: -0.2, unit: "%",
        label: "Real wage change on the year (inflation-adjusted)",
        source: SOURCES.mhlw, year: "2024" }
    },
    hours: {
      annual: { value: 1617, unit: "hours per year",
        label: "Average annual hours actually worked per worker",
        source: SOURCES.oecd, year: "2024" },
      monthly: { value: 136.9, unit: "hours per month",
        label: "Total actual working hours, Monthly Labour Survey",
        source: SOURCES.mhlw, year: "2024" },
      overtimeCap: "Overtime is capped by law at 45 hours a month / 360 hours a year (Work Style Reform Act, 2019)."
    }
  },

  // ---- Prices ----
  prices: {
    headline: { value: 3.0, unit: "% year on year", label: "CPI, all items, October 2025",
      source: SOURCES.statBureau, year: "2025" },
    core: { value: 3.0, unit: "% year on year", label: "Core CPI (less fresh food)",
      source: SOURCES.statBureau, year: "2025" },
    coreCore: { value: 3.1, unit: "% year on year", label: "Core-core CPI (less fresh food and energy)",
      source: SOURCES.statBureau, year: "2025" },
    // Annual average CPI change, Statistics Bureau.
    trend: [
      { year: 2020, value: 0.0 }, { year: 2021, value: -0.2 },
      { year: 2022, value: 2.5 }, { year: 2023, value: 3.3 },
      { year: 2024, value: 2.7 }, { year: 2025, value: 3.0 }
    ],
    trendNote: "2025 is the October year-on-year reading; earlier years are annual averages.",
    trendSource: { source: SOURCES.statBureau, year: "2020–2025" },
    // CPI by component, October 2025, year on year.
    components: [
      { item: "Food", value: 6.4, note: "Rice alone rose 40.2%" },
      { item: "Goods", value: 4.2, note: "All goods" },
      { item: "Energy", value: 2.1, note: "Electricity, gas and other fuels" },
      { item: "Services", value: 1.6, note: "Includes housing rent, which moves slowly" },
      { item: "All items", value: 3.0, note: "Headline CPI" }
    ],
    componentsSource: { source: SOURCES.statBureau, year: "Oct 2025" },
    housing: {
      text: "Housing sits inside the services part of the CPI. Rents in Japan move " +
        "slowly: while food prices rose 6.4% in the year to October 2025, services " +
        "prices — the basket that includes rent — rose only 1.6%. That gap is why " +
        "households feel inflation most at the supermarket, not in their rent.",
      source: SOURCES.statBureau, year: "Oct 2025"
    }
  },

  // ---- Search index: every indicator/topic the search box can find ----
  topics: [
    { term: "population", view: "population", text: "Population — 122.97 million (2025 Census)" },
    { term: "gdp", view: "economy", text: "GDP — ¥609.3 trillion nominal (2024)" },
    { term: "gross domestic product", view: "economy", text: "GDP — ¥609.3 trillion nominal (2024)" },
    { term: "unemployment", view: "labour", text: "Unemployment — 2.6% (September 2025)" },
    { term: "jobs", view: "labour", text: "Employment — 68.35 million people (September 2025)" },
    { term: "wages", view: "labour", text: "Wages — ¥348,182 a month on average (2024)" },
    { term: "salary", view: "labour", text: "Average annual salary — ¥4,775,000 (2024)" },
    { term: "working hours", view: "labour", text: "Working hours — 1,617 hours a year (2024)" },
    { term: "inflation", view: "prices", text: "Inflation (CPI) — 3.0% year on year (October 2025)" },
    { term: "cpi", view: "prices", text: "CPI — 3.0% year on year (October 2025)" },
    { term: "prices", view: "prices", text: "Consumer prices — 3.0% year on year (October 2025)" },
    { term: "food", view: "prices", text: "Food prices — up 6.4% year on year (October 2025)" },
    { term: "energy", view: "prices", text: "Energy prices — up 2.1% year on year (October 2025)" },
    { term: "housing", view: "prices", text: "Housing — rents inside services CPI, up 1.6% (October 2025)" },
    { term: "trade", view: "economy", text: "Trade balance — ¥5.3 trillion deficit (2024)" },
    { term: "exports", view: "economy", text: "Exports — ¥107.9 trillion (2024)" },
    { term: "imports", view: "economy", text: "Imports — ¥113.2 trillion (2024)" },
    { term: "fertility", view: "population", text: "Fertility rate — 1.15 children per woman (2024)" },
    { term: "births", view: "population", text: "Births — 686,061 in 2024, a record low" },
    { term: "ageing", view: "population", text: "Ageing — 29.4% of the population is 65 or over (2025 Census)" },
    { term: "life expectancy", view: "population", text: "Life expectancy — 84.0 years (2024)" },
    { term: "tokyo", view: "population", text: "Tokyo — 14.24 million, the largest prefecture (2025 Census)" },
    { term: "prefecture", view: "population", text: "Prefectures — all 47, with population, change and ageing (2025 Census)" },
    { term: "census", view: "population", text: "Census — population 128.06m (2010) to 122.97m (2025)" },
    { term: "minimum wage", view: "labour", text: "Minimum wage — ¥1,055 an hour (2024), ¥1,121 (2025)" },
    { term: "job openings", view: "labour", text: "Jobs-to-applicants — 1.20 openings per applicant (September 2025)" },
    { term: "part-time", view: "labour", text: "Part-time workers — ¥112,637 a month on average (FY2024)" },
    { term: "exports products", view: "economy", text: "Top exports — vehicles 21.7%, machinery 19.1%, electronics 18.5% (2024)" },
    { term: "rice", view: "prices", text: "Rice prices — up 40.2% year on year (October 2025)" },
    { term: "current account", view: "economy", text: "Current account — record ¥29.26 trillion surplus (2024)" }
  ]
};
