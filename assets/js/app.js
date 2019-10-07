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

// -----------------------------X-axis functions--------------------------------
// Update x scale function
// var updateXScale = function(data, newXAxis){

// }

// Update the x-axis variable with a transition - xAxis defined in data loading function
// var updateXAxis = function(newXScale, xAxis){
  // x-axis generator
  // xAxis = d3.axisBottom(newXScale)

  // Transition the new x-axis
//   chartGroup.append("g")
//     .transition()
//     .duration(1000)
//     .call(xAxis)
// }

// Update the circlesGroup
// var updateCirclesGroup = function(circlesGroup, newXScale, chosenXAxis){
//   // Determine the value of 'label' based on chosenXAxis' value
//   if (chosenXAxis === "poverty"){
//     var label = "In Poverty (%)";
//   }else if (chosenXAxis === "age"){
//     var label = "Age (Median)";
//   }else{
//     var label = "Household Income (Median)"
//   }
//
//   // Initialize the tooltip
//   var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .attr("display")
//         .html(function(d){
//           `${label}: <strong>${d.[chosenXAxis]}</strong>`
//
//
//         })


// }



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
  var xLinearScale = d3.scaleLinear()
        // Adjust the start and end x-axis ticks to ensure the circles do not
          // overlap the edges of the chart
        .domain([d3.min(data, d => d.poverty) - 1,
          d3.max(data, d => d.poverty) - 1])
          // Enable use of the entire width of the chart
          .range([0, chartGroupWidth]);

  // Create the y-axis scale
  var yLinearScale = d3.scaleLinear()
        // Adjust the top y-axis tick to ensure the circles do not overlap the
          // top of the chart
        .domain([0, d3.max(data, d => d.healthcare) + 1])
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
  // ----------------------------X-axis labels----------------------------------

  // Currently selected x-axis label
  // var activeXLabel


  // Poverty label
  var povertyLabel = chartGroup.append("text")
        .attr("x", chartGroupWidth / 2)
        .attr("y", chartGroupHeight + (margin.top * 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("In Poverty (%)");

  // Age label
  var ageLabel = chartGroup.append("text")
        .attr("x", chartGroupWidth / 2)
        .attr("y", chartGroupHeight + (margin.top * 3))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Age (Median)");

  // Income label
  var incomeLabel = chartGroup.append("text")
        .attr("x", chartGroupWidth / 2)
        .attr("y", chartGroupHeight + (margin.top * 4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Household Income (Median)");


  // ----------------------------Y-axis labels----------------------------------
  // Currently selected y-axis label
  // var activeYLabel

  // Healthcare label
  var healthcareLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -((margin.left * 2) + (margin.right * 2)))
        .attr("y", -(margin.right * 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Lacks Healthcare (%)");

  // Smokes label
  var smokesLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -((margin.left * 2) + (margin.right * 2)))
        .attr("y", -(margin.right * 3))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Smokes (%)");

  // Obese label
  var obeseLabel = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -((margin.left * 2) + (margin.right * 2)))
        .attr("y", -(margin.right * 4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Obese (%)");




// ******************************UPDATE PATTERN*********************************
  // Append circles
  var circles = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        // Styling from d3Style.css
        .classed("stateCircle", true)
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", "10")


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

  // Click event to update chartGroup depending on the label clicked
  // circles.on("click", function(d){
  //   // Get the label clicked on
  //   var clickedXLabel = d3.select(this).("value")
  //
  //   // If chosenXAxis is not the value clicked
  //   if (chosenXAxis !== clickedLabel){
  //     // Reassign the chosenXAxis value to the label clicked on to ensure
  //      // the data rendered always corresponds to the x-axis label clicked
  //      chosenXAxis = clickedXLabel
  //   }
  //
  //
  //
  // })

});
