// save url in a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
    // Use D3 to read in json
    let dropdownMenu = d3.select("#selDataset");
    // Fetch json
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let names = data.names;
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });
        let name = names[0];
        //  make the demographic panel, bar chart, and bubble chart
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

// demographics panel
function demo(value) {
    // Fetch the json
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let metadata = data.metadata;
        let filteredData = metadata.filter((meta) => meta.id == value);
        let obj = filteredData[0]
        d3.select("#sample-metadata").html("");
        let entries = Object.entries(obj);
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
        console.log(entries);
    });
  }
  

// Make the bar chart
function bar(value) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let samples = data.samples;
        // Filter for  id = value 
        let filterdata = samples.filter((sample) => sample.id === value);
        let obj = filterdata[0];
        // Trace for horizontal bar chart
        let trace = [{
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("bar", trace);
    });
}
  
 // Make the bubble chart
function bubble(value) {
    // Fetch the json 
    d3.json(url).then((data) => {
        let samples = data.samples;
        let filterdata = samples.filter((sample) => sample.id === value);
        let obj = filterdata[0];
        // Trace for bubble chart
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Earth"
            }
        }];
        // Adding title
        let layout = {
            xaxis: {title: "OTU ID"}
        };
        // Use Plotly to plot the data in a bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Make the gauge chart 
function gauge(value) {
    // Fetch the json
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let filterdata = metadata.filter((meta) => meta.id == value);
        let obj = filterdata[0]
        // Trace data
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "rgb(68,166,198)"},
                steps: [
                    { range: [0, 1], color: "rgb(248, 243, 236)" },
                    { range: [1, 2], color: "rgb(244, 241, 229)" },
                    { range: [2, 3], color: "rgb(233, 230, 202)" },
                    { range: [3, 4], color: "rgb(229, 231, 179)" },
                    { range: [4, 5], color: "rgb(213, 228, 157)" },
                    { range: [5, 6], color: "rgb(183, 204, 146)" },
                    { range: [6, 7], color: "rgb(140, 191, 136)" },
                    { range: [7, 8], color: "rgb(138, 187, 143)" },
                    { range: [8, 9], color: "rgb(133, 180, 138)" }
                ]
            }
        }];

         // Use Plotly to plot the data in a gauge chart
         Plotly.newPlot("gauge", trace);
    });
}

// function to allow for toggling
function optionChanged(value) {
    demo(value);
    bar(value);
    bubble(value);
    gauge(value)
}

init();