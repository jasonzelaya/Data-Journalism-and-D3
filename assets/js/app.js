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

// Function to update the x scale when an x-axis label is clicked on
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


// Function to update the x-axes with a transition when a label is clicked
function updateXAxes(newXScale, xAxis){
  // X-axis generator
  var xAxisGenerator = d3.axisBottom(newXScale);

  // Create the x-axis with a transition
  xAxis.transition()
    .duration(1000)
    .call(xAxisGenerator);

  return xAxis;
}


// Function used for updating the circles group with a transition to new circles
function updateCirclesGroup(circlesGroup, newXScale, chosenXAxis){

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}


// Function used for updating the values in the tooltips for the circles
function updateToolTip(chosenXAxis, /*chosenYAxis, */ circlesGroup){
  // Determine the 'xLabel' value
  if (chosenXAxis === "poverty"){
    var xLabel = "Poverty:";
  } else if (chosenXAxis === "age"){
    var xLabel = "Age:";
  } else {
    var xLabel = "Income:";
  }

  // Initialize the tooltip
  var toolTip = d3.tip()
    // Add styling from d3Style.css
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(d => `${d.state}<br>${xLabel} ${d[chosenXAxis]}`);

  // Create the tooltip
  circlesGroup.call(toolTip);

  circlesGroup
    // Mouseover event listener
    .on("mouseover", d => toolTip.show(d))
    // Mouseout event listener
    .on("mouseout", d => toolTip.hide(d));

    return circlesGroup
};




// -----------------------------Y-axis functions--------------------------------

// Function to update the y scale when an y-axis label is clicked on
function updateYScale(data, chosenYAxis){
  // Create the y-axis scale
  var yLinearScale = d3.scaleLinear()
        // Adjust the top y-axis tick to ensure the circles do not overlap the
          // top of the chart
        .domain([0, d3.max(data, d => d[chosenYAxis]) * 1.045])
        // Move the 0 value to the bottom of the visualization's y-axis
        .range([chartGroupHeight, 0]);

  return yLinearScale;
}


// Function to update the y-axes with a transition when a label is clicked
function updateYAxes(newYScale, yAxis){
  // Y-axis generator
  var yAxisGenerator = d3.axisLeft(newYScale);

  // Create the Y-axis with a transition
  yAxis.transition()
    .duration(1000)
    .call(yAxisGenerator);

  return yAxis;
}


// Function used for updating the circles group with a transition to new circles
function updateCirclesGroupY(circlesGroup, newYScale, chosenYAxis){

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


// Function used for updating the values in the tooltips for the circles
function updateToolTipY(chosenYAxis, circlesGroup){
  // Determine the 'xLabel' value
  if (chosenYAxis === "healthcare"){
    var yLabel = "Healthcare:";
  } else if (chosenYAxis === "smokes"){
    var yLabel = "Smokes:";
  } else {
    var yLabel = "Obesity:";
  }

  // Initialize the tooltip
  var toolTip = d3.tip()
    // Add styling from d3Style.css
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(d => `${d.state}<br>${yLabel} ${d[chosenYAxis]}`);

  // Create the tooltip
  circlesGroup.call(toolTip);

  circlesGroup
    // Mouseover event listener
    .on("mouseover", d => toolTip.show(d))
    // Mouseout event listener
    .on("mouseout", d => toolTip.hide(d));

    return circlesGroup
};



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
  var xLinearScale = updateXScale(data, chosenXAxis);

  // Create the y-axis scale
  var yLinearScale = d3.scaleLinear()
        // Adjust the top y-axis tick to ensure the circles do not overlap the
          // top of the chart
        .domain([0, d3.max(data, d => d.healthcare) * 1.045])
        // Move the 0 value to the bottom of the visualization's y-axis
        .range([chartGroupHeight, 0]);

// *********************************AXES****************************************
  // Axis generators
  var xAxisGenerator = d3.axisBottom(xLinearScale);
  var yAxisGenerator = d3.axisLeft(yLinearScale);

  // Append the chartGroup axes groups
  var xAxis = chartGroup.append("g")
    // Shift the axis to the bottom of the chart
    .attr("transform", `translate(0, ${chartGroupHeight})`)
    .call(xAxisGenerator);

  var yAxis = chartGroup.append("g")
    .call(yAxisGenerator);


  // ******************************UPDATE PATTERN*********************************
    // Append initial circles
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
        .classed("active", true)
        .attr("y", margin.top * 2.2)
        .attr("value", "poverty")
        .text("In Poverty (%)");

  // Age label
  var ageLabel = xLabelsGroup.append("text")
        .classed("inactive", true)
        .attr("y", margin.top * 3.3)
        .attr("value", "age")
        .text("Age (Median)");

  // Income label
  var incomeLabel = xLabelsGroup.append("text")
        .classed("inactive", true)
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
        .classed("active", true)
        .attr("x", -((margin.left * 2) + (margin.right * 2)))
        .attr("y", -(margin.right * 2))
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

  // Smokes label
  var smokesLabel = yLabelsGroup.append("text")
        .classed("inactive", true)
        .attr("x", -((margin.left * 2) + (margin.right * 2)))
        .attr("y", -(margin.right * 3.1))
        .attr("value", "smokes")
        .text("Smokes (%)");

  // Obese label
  var obeseLabel = yLabelsGroup.append("text")
        .classed("inactive", true)
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

  // Initial tooltip
  circlesGroup = updateToolTip(chosenXAxis, circlesGroup)


  // Event listener for x-axis labels
  xLabelsGroup.selectAll("text")
    .on("click", function(){
      // Label clicked on
      var xLabelValue = d3.select(this).attr("value");
      // Ensure the value of chosenXAxis is always the label clicked on
      if (xLabelValue !== chosenXAxis){
        chosenXAxis = xLabelValue;

        // The following functions are defined above the csv import function

        // Update x scale
        xLinearScale = updateXScale(data, chosenXAxis)

        // Update x-axis
        xAxis = updateXAxes(xLinearScale, xAxis)

         // Update circles group with new x values
         circlesGroup = updateCirclesGroup(circlesGroup, xLinearScale, chosenXAxis)

         // Update tooltips
         circlesGroup = updateToolTip(chosenXAxis, circlesGroup)


        // Activate/Deactivate labels based on the one that was clicked
        if (chosenXAxis === "poverty"){
          povertyLabel
            .classed("active", true)
            .classed("inactive", false)
          ageLabel
            .classed("active", false)
            .classed("inactive", true)
          incomeLabel
            .classed("active", false)
            .classed("inactive", true)

        } else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true)
          ageLabel
            .classed("active", true)
            .classed("inactive", false)
          incomeLabel
            .classed("active", false)
            .classed("inactive", true)

        } else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true)
          ageLabel
            .classed("active", false)
            .classed("inactive", true)
          incomeLabel
            .classed("active", true)
            .classed("inactive", false)
        }
      }
    });

});
