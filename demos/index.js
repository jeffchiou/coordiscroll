const appendClone = (target, elToClone, id=null, _class=null) => {
  let newEl = elToClone.cloneNode(true)
  id ? newEl.id=id : newEl.removeAttribute('id')
  newEl.classList.remove("hidden")
  if (_class) newEl.classList.add(_class)
  target.append(newEl)
}

let lorem = document.querySelector(".lorem")
let annotations = document.querySelector(".annotations")
let bloch = document.querySelector(".bloch")

let propDiv = document.querySelector(".demo-prop")
appendClone(propDiv,bloch,"demo-prop__1","demo-prop__col")
appendClone(propDiv,bloch,"demo-prop__2","demo-prop__col")

let springDiv = document.querySelector(".demo-spring")
appendClone(springDiv,lorem,"demo-spring__1","demo-spring__col")
appendClone(springDiv,lorem,"demo-spring__2","demo-spring__col")
appendClone(springDiv,annotations,"demo-spring__3","demo-spring__col")

let loopDiv = document.querySelector(".demo-loop")
appendClone(loopDiv,lorem,"demo-loop__1","demo-loop__col")
appendClone(loopDiv,lorem,"demo-loop__2","demo-loop__col")
appendClone(loopDiv,annotations,"demo-loop__3","demo-loop__col")

let softDiv = document.querySelector(".demo-soft")
appendClone(softDiv,lorem,"demo-soft__1","demo-soft__col")
appendClone(softDiv,lorem,"demo-soft__2","demo-soft__col")
appendClone(softDiv,annotations,"demo-soft__3","demo-soft__col")

let margin = { top: 50, right: 50, bottom: 50, left: 50 },
  width = 883 - margin.left - margin.right,
  height = 879 - margin.top - margin.bottom;

let data = [...Array(200).keys()].map( x => (x-100)/10 )

// Axes. Domain is numeric range of axis, range is pixels covered
let xAx = d3.scaleLinear()
  .domain([-10, 10])  
  .range([0, width]); 
let yAx = d3.scaleLinear()
  .domain([-10, 10]) 
  .range([height, 0]);

const createAxes = (svg,xAx,yAx) => {
  svg.append('g')
    .style("font-size","20px")
    .attr("transform", "translate(0," + height/2 + ")")
    .attr("stroke-width", 2)
    .call(d3.axisBottom(xAx));
  svg.append('g')
    .style("font-size", "20px")
    .attr("transform", "translate(" + width / 2 + ",0)")
    .attr("stroke-width", 2)
    .call(d3.axisLeft(yAx));
  return svg
}

const createSvg = el => {
  let svg = d3.select(el)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  return svg
}



let xline = d3.line()
  .x(d => xAx(d))
  .y(d => yAx(d))
let xlineSvg = createSvg("#xline")
xlineSvg = createAxes(xlineSvg,xAx,yAx)
xlineSvg.append("path")
  .datum(data)
  .attr("d",xline)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)

let sin = d3.line()
  .x(d => xAx(d))
  .y(d => yAx(2*Math.sin(d)))
let sinSvg = createSvg("#sinLine")
sinSvg = createAxes(sinSvg,xAx,yAx)
sinSvg.append("path")
  .datum(data)
  .attr("d",sin)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)

let heart = d3.line()
  .x(d => xAx(8*Math.sin(d)**3))
  .y(d => yAx(6.5*Math.cos(d) - 2.5*Math.cos(2*d) - Math.cos(3*d) - 0.5*Math.cos(4*d)))
let heartSvg = createSvg("#heart")
heartSvg = createAxes(heartSvg,xAx,yAx)
heartSvg.append("path")
  .datum(data)
  .attr("d",heart)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)