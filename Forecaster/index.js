let index = 0;
let chartMode = "historical";

var dataSet = anychart.data.set(CurrentData(chartMode, index));

var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });

var thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });

var fourthSeriesData = dataSet.mapAs({ x: 0, value: 4 });

var chart = anychart.line();

chart.animation(true);

chart.padding([10, 20, 5, 20]);

chart.crosshair().enabled(true).yLabel(false).yStroke(null);

chart.tooltip().positionMode('point');

chart.title(
    'Fuel and Energy Cost Prediction'
);

chart.yAxis().title('Price (GBP)');
chart.xAxis().labels().padding(5);

chart.xScale().mode('continuous');

var secondSeries = chart.line(secondSeriesData);
secondSeries.name('Gas');
secondSeries.hovered().markers().enabled(true).type('circle').size(4);
secondSeries
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

var thirdSeries = chart.line(thirdSeriesData);
thirdSeries.name('Liquid fuels');
thirdSeries.hovered().markers().enabled(true).type('circle').size(4);
thirdSeries
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

var fourthSeries = chart.line(fourthSeriesData);
fourthSeries.name('Electricity');
fourthSeries.hovered().markers().enabled(true).type('circle').size(4);
fourthSeries
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);

chart.container('chart_container');

chart.draw();

function toggleMode() {
    chartMode = document.getElementById("mode").selectedOptions[0].value
    
    if (chartMode === "historical") {
        let newData = CurrentData(chartMode, 0)
        for (let i = 0; i < 12; i++) {
            dataSet.row(i, newData[i]);
        }
    }
    else {
        let newData = ForecastData()
        console.log(newData)
        for (let i = 0; i < 12; i++) {
            dataSet.row(i, newData[i]);
        }
    }
}

function increaseIndex() {
    if (chartMode === "historical") {
        if (index < 321 - 12) index += 1;
        else {
            alert("Insufficient data.")
        }
        let newData = CurrentData(chartMode, index)
        dataSet.remove(dataSet.getRowsCount() - 1)
        dataSet.insert(newData[0])
    }
    else alert("Scrolling is disabled in forecast mode.")
}

function decreaseIndex() {
    if (chartMode === "historical") {
        if (index > 0) index -= 1;
        else {
            alert("Insufficient data.")
        }
        let newData = CurrentData(chartMode, index)
        dataSet.remove(0)
        dataSet.insert(newData[newData.length - 1], -1)
    }
    else alert("Scrolling is disabled in forecast mode.")
}