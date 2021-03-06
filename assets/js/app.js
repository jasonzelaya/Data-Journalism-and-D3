// **************************RESPONSIVE RESIZE**********************************
// Function to make the SVG responsive to window resizing
function responsivefy(svg) {
  // Container is the DOM element that the SVG is appended to
  const container = d3.select(svg.node().parentNode),
      // Measure the container
      width = parseInt(svg.style('width'), 10),
      height = parseInt(svg.style('height'), 10),
      // Find container's aspect ratio
      aspect = width / height;

  // Set viewBox attribute to the initial size
  svg.attr('viewBox', `0 0 ${width} ${height}`)
      // Control scaling with preserveAspectRatio
      .attr('preserveAspectRatio', 'xMinYMid')
      // Resize SVG on inital page load
      .call(resize);

  // Add event listener so the chart will be resized when the window resizes
  d3.select(window).on(
      'resize.' + container.attr('id'),
      resize
  );

  // Function that resizes the chart
  function resize() {
    // Get the width of the container
    const w = parseInt(container.style('width'));
    // Resize SVG to fill container while maintaining a consistent aspect ratio
    svg.attr('width', w);
    svg.attr('height', Math.round(w / aspect));
  }
}


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
      .attr("height", svgHeight)
      // Make the chart resize relative the the window resize
      .call(responsivefy);

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
};


// Function to update the x-axes with a transition when a label is clicked
function updateXAxes(newXScale, xAxis){
  // X-axis generator
  var xAxisGenerator = d3.axisBottom(newXScale);

  // Create the x-axis with a transition
  xAxis.transition()
    .duration(300)
    .call(xAxisGenerator);

  return xAxis;
};


// Function used for updating the circles group with a transition to new circles
function updateCirclesGroup(circlesGroup, newXScale, chosenXAxis){

  circlesGroup.transition()
    .duration(300)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
};

// Function used for updating the circle labels
function updateCircleLabelsX(circleLabels, newXScale, chosenXAxis){

  circleLabels.transition()
    .duration(300)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return circleLabels;
};

// -----------------------------Y-axis functions--------------------------------

// Function to update the y scale when an y-axis label is clicked on
function updateYScale(data, chosenYAxis){
  // Create the y-axis scale
  var yLinearScale = d3.scaleLinear()
        // Adjust the top y-axis tick to ensure the circles do not overlap the
          // top of the chart
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.9,
        d3.max(data, d => d[chosenYAxis]) * 1.045])
        // Move the 0 value to the bottom of the visualization's y-axis
        .range([chartGroupHeight, 0]);

  return yLinearScale;
};


// Function to update the y-axes with a transition when a label is clicked
function updateYAxes(newYScale, yAxis){
  // Y-axis generator
  var yAxisGenerator = d3.axisLeft(newYScale);

  // Create the Y-axis with a transition
  yAxis.transition()
    .duration(300)
    .call(yAxisGenerator);

  return yAxis;
};

// Function used for updating the circles group with a transition to new circles
function updateCirclesGroupY(circlesGroup, newYScale, chosenYAxis){

  circlesGroup.transition()
    .duration(300)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
};

// Function used for updating the circle labels
function updateCircleLabelsY(circleLabels, newYScale, chosenYAxis){

  circleLabels.transition()
    .duration(300)
    .attr("y", d => newYScale(d[chosenYAxis]));

  return circleLabels;
};



  // Initialize the tooltip
  var toolTip = d3.tip()
    // Add styling from d3Style.css
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d){

      // Values corresponding to the chosen y-axis label
      var yLabel = `${chosenYAxis}: ${d[chosenYAxis]}` ;

      // If chosenXAxis is the poverty value
      if (chosenXAxis === "poverty"){
        // Add a '%' after the values corresponding to the chosen x-axis label
        var xLabel = `${chosenXAxis}: ${d[chosenXAxis]}%`
      } else {
        // Values corresponding to the chosen x-axis label
        var xLabel = `${chosenXAxis}: ${parseFloat(d[chosenXAxis])
          .toLocaleString("en")}`;
      }

      // Tooltip contents
      return `${d.state}<br>${xLabel}<br>${yLabel}`
    });



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
  var yLinearScale = updateYScale(data, chosenYAxis);

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
            // Mouse events
            .on("mouseover", function(d) {
              // Show the tooltip
              toolTip.show(d, this);
              d3.select(this)
                .style("stroke", "#696969")
            })
            .on("mouseout", function(d) {
              // Remove the tooltip
              toolTip.hide(d);
              d3.select(this)
                .style("stroke", "#e3e3e3")
            });


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
    .attr("font-weight", "bold");

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
          .text(d => d.abbr)
          // Mouse events
          .on("mouseover", function(d) {
            // Show the tooltip
            toolTip.show(d, this);
          })
          .on("mouseout", function(d) {
            // Remove the tooltip
            toolTip.hide(d);
          });


  // Create the tooltip
  circlesGroup.call(toolTip);

// ****************************EVENT LISTENERS**********************************

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
        xLinearScale = updateXScale(data, chosenXAxis);

        // Update x-axis
        xAxis = updateXAxes(xLinearScale, xAxis);

         // Update circles group with new x values
         circlesGroup = updateCirclesGroup(circlesGroup, xLinearScale, chosenXAxis);

         // Update circle labels
         circleLabels = updateCircleLabelsX(circleLabels, xLinearScale, chosenXAxis);


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


    // Event listener for y-axis labels
    yLabelsGroup.selectAll("text")
      .on("click", function(){
        // Label clicked on
        var yLabelValue = d3.select(this).attr("value");
        // Ensure the value of chosenYAxis is always the label clicked on
        if (yLabelValue !== chosenYAxis){
          chosenYAxis = yLabelValue;

          // The following functions are defined above the csv import function

          // Update y scale
          yLinearScale = updateYScale(data, chosenYAxis);

          // Update y-axis
          yAxis = updateYAxes(yLinearScale, yAxis);

          // Update circles group with new y values
          circlesGroup = updateCirclesGroupY(circlesGroup, yLinearScale, chosenYAxis);

          // Update circle labels
          circleLabels = updateCircleLabelsY(circleLabels, yLinearScale, chosenYAxis);


          // Activate/Deactivate labels based on the one that was clicked
          if (chosenYAxis === "healthcare"){
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false)
            smokesLabel
              .classed("active", false)
              .classed("inactive", true)
            obeseLabel
              .classed("active", false)
              .classed("inactive", true)

          } else if (chosenYAxis === "smokes") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true)
            smokesLabel
              .classed("active", true)
              .classed("inactive", false)
            obeseLabel
              .classed("active", false)
              .classed("inactive", true)

          } else {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true)
            smokesLabel
              .classed("active", false)
              .classed("inactive", true)
            obeseLabel
              .classed("active", true)
              .classed("inactive", false)
          }
        }
      });

});
