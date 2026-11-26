# best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/shutokasai1207-wq/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/shutokasai1207-wq/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**Nippon in Numbers** — a national statistics site for Japan. Eight headline indicators (population 122.97 million in the 2025 census, nominal GDP ¥609.3 trillion in 2024, unemployment 2.6% in September 2025, CPI inflation 3.0% in October 2025, and more), all 47 prefectures with population, five-year change and ageing share, census and fertility trends since 2010, GDP growth and trade partners, wages and working hours, and prices by category. Every figure is labelled with its source and year. The site has hand-drawn SVG charts with hover tooltips and axis labels, sortable and filterable tables, a year selector that moves the figures through time, a ¥/$ currency toggle, and a search box that filters indicators — all as static files with no build step and no network requests.

## Run it

```sh
python3 -m http.server 8000 --directory app
```

Then open http://localhost:8000/ in a browser. Any static server works; open `app/index.html` directly also works.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
