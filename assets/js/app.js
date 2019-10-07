// **************************CANVAS SET UP**************************************
// Create the margins
var margin = {left: 100, right: 20, top: 20, bottom: 100};

// SVG dimensions
var svgWidth = 800,
    svgHeight = 600;

// Chart/visualization dimensions
var chartGroupWidth = svgWidth - margin.left - margin.right, // 680px
    chartGroupHeight = svgHeight - margin.top - margin.bottom; // 480px

// Create SVG wrapper
var svg = d3.select("#scatter")
  // Append an SVG element
    .append("svg")
      // Define the width
      .attr("width", svgWidth)
      // Define the height
      .attr("height", svgHeight);

// Create the svg group for the chart/visualization area
var chartGroup = svg.append("g")
  // Shift the chartGroup
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// *********************************DATA****************************************

// Retrieve/load the data and execute everything within the function
d3.csv("./assets/data/data.csv", function(error, data){
  // Check for errors
  if (error) throw (error);

  // Determine if the data needs cleaning
  console.log(data);

  // Parse the data and convert everything within the forEach function to numbers
    // Moe = Margin of error
  data.forEach(function(d){
    d.age = +d.age;
    d.ageMoe = +d.ageMoe; // margin of error
    d.healthcare = +d.healthcare; // average
    d.healthcareHigh = +d.healthcareHigh;
    d.healthcareLow = +d.healthcareLow;
    d.id = +d.id;
    d.income = +d.income;
    d.incomeMoe = +d.incomeMoe; // margin of error
    d.obesity = +d.obesity; // average
    d.obesityHigh = +d.obesityHigh;
    d.obesityLow = +d.obesityLow;
    d.poverty = +d.poverty;
    d.povertyMoe = +d.povertyMoe; //margin of error
    d.smokes = +d.smokes; // average
    d.smokesHigh = +d.smokesHigh;
    d.smokesLow = +d.smokesLow;
  });

  // Confirm the conversions were successful
  console.log(data);


// *******************************SCALES****************************************
  // Create the x-axis scale
  var xLinearScale = d3.scaleLinear()
        // Adjust the start and end x-axis ticks to ensure the circles do not
          // overlap the edges of the chart
        .domain([d3.min(data, d => d.poverty) - 1,
          d3.max(data, d => d.poverty) - 1])
          // Enable use of the entire width of the chart
          .range([0, chartGroupWidth]);

  // Create the y-axis scale
  var yLinearScale = d3.scaleLinear()
        // Highest tick is always the highest healthcare value in the data
        .domain([0, d3.max(data, d => d.healthcare)])
        // Move the 0 value to the bottom of the visualization's y-axis
        .range([chartGroupHeight, 0]);

// *********************************AXES****************************************
  // Axis generators
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  // Append the chartGroup axes groups
  chartGroup.append("g")
    .classed("x-axis", true)
    // Shift the axis to the bottom of the chart
    .attr("transform", `translate(0, ${chartGroupHeight})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

// *********************************LABELS**************************************
  // X-axis label
  var xLabel = chartGroup.append("text")
        .attr("x", chartGroupWidth / 2)
        .attr("y", chartGroupHeight + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("In Poverty (%)");

  // Y-axis label
  var yLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -240)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Lacks Healthcare (%)");

  // State labels for the circles
  // selectAll(null) to ensure enter() applies to every datum in the dataset
  var circleLabels = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
          .attr("x", d => xLinearScale(d.poverty))
          .attr("y", d => yLinearScale(d.healthcare))
          .attr("text-anchor", "middle")
          .style("font-size", "9px")
          .style("font-weight", "bold")
          .attr("fill", "black")
          .text(d => d.abbr);

// ******************************UPDATE PATTERN*********************************
  // Append circles
  var circles = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", "10")
          .attr("fill", "lightskyblue")
          .attr("stroke", "black")
          .attr("opacity", 0.4);

});
