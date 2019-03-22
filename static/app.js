function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    var metaurl = "/metadata/${sample}"
    d3.json(metaurl).then(function(response){
    // Use d3 to select the panel with id of `#sample-metadata`        
        var sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata        
        sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new        
        Object.entries(response).forEach(function([key,value]) {
            var row = sample_metadata.append("p");
      // tags for each key-value in the metadata.
            row.text("${key}: ${value}");    
        });
    });
};

function buildCharts(sample) {
//    use d3.JSON to fetch sample data for plots
  var plotURL = `/samples/${sample}`;
  d3.json(plotURL).then(function(response){

    var otu_ids = response['otu_ids'];
    var sample_values = response['sample_values'];
    var otu_labels = response['otu_labels'];
    var pie_labels = otu_ids.slice(0,10);
    var pie_values = sample_values.slice(0,10);
    var pie_text = otu_labels.slice(0,10);

    var trace_scatter = { 
      type: "scatter",
      mode: "markers",
      x: otu_ids,
      y: sample_values,
      marker: {size: m_size,
                color: m_colors},
      text: otu_labels,
      hoverinfo: "x+\ny+\ntext",
      textinfo: "none"
    };
    var data_scatter = [trace_scatter];

    var layout = {
      showlegend: false,
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Values"}
    };

    Plotly.newPlot("bubble", data_scatter, layout);
//build a pie chart
    var trace_pie = {
      type: "pie",
      values: pie_values, 
      labels: pie_labels, 
      text: pie_text,
      hoverinfo: "label+\ntext+\nvalue+\npercent",
      textinfo: "percent",
    };
    var data_pie = [trace_pie];

    Plotly.newPlot("pie", data_pie);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
