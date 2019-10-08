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

// *****************************UPDATE FUNCTIONS********************************
// Default selected x-axis label
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// -----------------------------X-axis functions--------------------------------

// Function used to update the x scale when an x-axis label is clicked on
function updateXScale(data, chosenXAxis){
  // Create the x-axis scale
  var xLinearScale = d3.scaleLinear()
        // Adjust the start and end x-axis ticks to ensure the circles do not
          // overlap the edges of the chart
          .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
            d3.max(data, d => d[chosenXAxis]) * 1.04])
          // Enable use of the entire width of the chart
          .range([0, chartGroupWidth]);

  return xLinearScale;
}


// Function used to update the x-axes with a transition when a label is clicked
function updateXAxes(newXScale, xAxis){
  // X-axis generator
  var xAxis = d3.axisBottom(newXScale);

  // Create the x-axis
  circlesGroup.append("g")
    // Place the axis at the bottom of the chart
    .attr("transform", `translate(0, ${chartGroupHeight})`)
    // Render the axis by sliding it into place
    .transition()
    .duration(1000)
    .call(xAxis);
}


// Function to update the data point circles when a label is clicked
// function updateCirclesGroup

// Update:circlesGroup, tooltip





// -----------------------------Y-axis functions--------------------------------





// *********************************DATA****************************************

// Retrieve/load the data and execute everything within the function
d3.csv("./assets/data/data.csv", function(error, data){
  // Check for errors
  if (error) throw (error);

  // Determine if the data needs cleaning
  // console.log(data);

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
  // var xLinearScale = xScale(data, chosenXAxis);


  // Create the x-axis scale
  var xLinearScale = d3.scaleLinear()
        // Adjust the start and end x-axis ticks to ensure the circles do not
          // overlap the edges of the chart
        .domain([d3.min(data, d => d.poverty) * 0.9,
          d3.max(data, d => d.poverty) * 1.04])
          // Enable use of the entire width of the chart
          .range([0, chartGroupWidth]);

  // Create the y-axis scale
  var yLinearScale = d3.scaleLinear()
        // Adjust the top y-axis tick to ensure the circles do not overlap the
          // top of the chart
        .domain([0, d3.max(data, d => d.healthcare) * 1.045])
        // Move the 0 value to the bottom of the visualization's y-axis
        .range([chartGroupHeight, 0]);

// *********************************AXES****************************************
  // Axis generators
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  // Append the chartGroup axes groups
  chartGroup.append("g")
    // Shift the axis to the bottom of the chart
    .attr("transform", `translate(0, ${chartGroupHeight})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);


  // ******************************UPDATE PATTERN*********************************
    // Append circles
    var circlesGroup = chartGroup.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          // Styling from d3Style.css
          .classed("stateCircle", true)
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "10")

// *********************************LABELS**************************************
  // ----------------------------X-axis labels----------------------------------
  // X-axis label group
  var xLabelsGroup = chartGroup.append("g")
        .classed("aText", true)
        .attr("transform", `translate(${chartGroupWidth / 2},
          ${chartGroupHeight})`)
        .attr("font-weight", "bold");

  // Poverty label
  var povertyLabel = xLabelsGroup.append("text")
        .attr("y", margin.top * 2.2)
        .attr("value", "poverty")
        .text("In Poverty (%)");

  // Age label
  var ageLabel = xLabelsGroup.append("text")
        .attr("y", margin.top * 3.3)
        .attr("value", "age")
        .text("Age (Median)");

  // Income label
  var incomeLabel = xLabelsGroup.append("text")
        .attr("y", margin.top * 4.4)
        .attr("value", "income")
        .text("Household Income (Median)");


  // ----------------------------Y-axis labels----------------------------------
  // Y-axis label group
  var yLabelsGroup = chartGroup.append("g")
    .classed("aText", true)
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")

  // Healthcare label
  var healthcareLabel = yLabelsGroup.append("text")
        .attr("x", -((margin.left * 2) + (margin.right * 2)))
        .attr("y", -(margin.right * 2))
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

  // Smokes label
  var smokesLabel = yLabelsGroup.append("text")
        .attr("x", -((margin.left * 2) + (margin.right * 2)))
        .attr("y", -(margin.right * 3.1))
        .attr("value", "smokes")
        .text("Smokes (%)");

  // Obese label
  var obeseLabel = yLabelsGroup.append("text")
        .attr("x", -((margin.left * 2) + (margin.right * 2)))
        .attr("y", -(margin.right * 4.2))
        .attr("value", "obesity")
        .text("Obese (%)");


  // State (abbreviation) labels for the circles
  // selectAll(null) to ensure enter() applies to every datum in the dataset
  var circleLabels = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
          // Styling from d3Style.css
          .classed("stateText", true)
          .attr("x", d => xLinearScale(d.poverty))
          .attr("y", d => yLinearScale(d.healthcare))
          .style("font-size", "9px")
          .style("font-weight", "bold")
          .text(d => d.abbr);

});
