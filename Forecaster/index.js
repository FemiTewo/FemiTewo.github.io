// Rows from data.js look like: [label, solid, gas, liquid, electricity]
let index = 0;            // how many months back from the latest data
let chartMode = "historical";

const statusEl = document.getElementById("status");
const earlierBtn = document.getElementById("earlier");
const laterBtn = document.getElementById("later");

const SERIES = [
    { name: "Gas", column: 2, color: "#2f9bff" },
    { name: "Liquid fuels", column: 3, color: "#0d47a1" },
    { name: "Electricity", column: 4, color: "#f57c00" }
];

function currentRows() {
    return chartMode === "historical" ? CurrentData(chartMode, index) : ForecastData();
}

function buildData(rows) {
    return {
        labels: rows.map((row) => String(row[0]).split("\n")),
        datasets: SERIES.map((s) => ({
            label: s.name,
            data: rows.map((row) => Number(row[s.column])),
            borderColor: s.color,
            backgroundColor: s.color,
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0.25
        }))
    };
}

const chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: buildData(currentRows()),
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
            title: { display: true, text: "Fuel and energy prices (sample data)", font: { size: 16 } },
            legend: { position: "bottom" },
            tooltip: {
                callbacks: {
                    title: (items) => String(items[0].label).replace(/,/g, " "),
                    label: (item) => ` ${item.dataset.label}: ${item.parsed.y.toFixed(1)}`
                }
            }
        },
        scales: {
            y: { title: { display: true, text: "Price (sample data)" }, beginAtZero: true },
            x: { grid: { display: false } }
        }
    }
});

function refresh() {
    chart.data = buildData(currentRows());
    chart.update();
    const forecast = chartMode === "forecast";
    earlierBtn.disabled = forecast || index >= FuelData.length - 12;
    laterBtn.disabled = forecast || index <= 0;
    statusEl.textContent = forecast
        ? "Projection for the 12 months after the last data point. Scrolling is disabled in this mode."
        : "Showing 12 months of sample data. Use Earlier and Later to move through time.";
}

earlierBtn.addEventListener("click", () => {
    if (index < FuelData.length - 12) index += 1;
    refresh();
});

laterBtn.addEventListener("click", () => {
    if (index > 0) index -= 1;
    refresh();
});

document.getElementById("mode").addEventListener("change", (event) => {
    chartMode = event.target.value;
    if (chartMode === "historical") index = 0;
    refresh();
});

refresh();
