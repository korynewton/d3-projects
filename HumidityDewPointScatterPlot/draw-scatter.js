async function drawScatter() {
  // load data
  const dataset = await d3.json('./seattle_weather_data.json');

  // data accessors
  const xAccessor = (d) => d.dewPoint;
  const yAccessor = (d) => d.humidity;
  const colorAccessor = (d) => d.cloudCover;

  // determine if screen height or width is smaller, use that as the chart width
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  // calculate bounded height and width
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //create full width svg of chart
  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  // create bounds of chart (the data part of the plot)
  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // determine domain of x input values, using nice method to round appropriately
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  // determine domain of y input values, using nice method to round appropriately
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  // color scale
  const colorScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(['skyblue', 'darkslategrey']);

  //   // draw data points
  //   let dots = bounds
  //     .selectAll('circle')
  //     .data(dataset)
  //     .enter()
  //     .append('circle')
  //     .attr('cx', d => xScale(xAccessor(d)))
  //     .attr('cy', d => yScale(yAccessor(d)))
  //     .attr('r', 5)
  //     .attr('fill', 'cornflowerblue');

  const dots = bounds.selectAll('circle').data(dataset);

  // draw dots
  // join combines the .enter(), .enter(), .append() methods
  dots
    .join('circle')
    .attr('cx', (d) => xScale(xAccessor(d)))
    .attr('cy', (d) => yScale(yAccessor(d)))
    .attr('r', 5)
    .attr('fill', (d) => colorScale(colorAccessor(d)));

  // generate x axis with scale
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  // draw x axis
  const xAxis = bounds
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`);
  // add label to bottom
  const xAxisLabel = xAxis
    .append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .html('Dew Point (&deg;F)');

  // generate y Axis with scale
  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);
  // draw y Axis
  const yAxis = bounds.append('g').call(yAxisGenerator);
  const yAxisLabel = yAxis
    .append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text('Relative humidity')
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle');
}

drawScatter();
