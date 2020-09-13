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

// Drag scroll implementation adapted from htmldom.dev
class Draggable {
  constructor(el) {
    this.el = el
    this.pos = { top: 0, left: 0, x: 0, y: 0 }
    this.mouseDownHandler = this.mouseDownHandler.bind(this)
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
    this.mouseUpHandler = this.mouseUpHandler.bind(this)
    el.style.cursor = 'grab'
  }
  mouseDownHandler(e) {
    e.preventDefault() // prevent image ghost drag
    this.pos = {
        left: this.el.scrollLeft,
        top: this.el.scrollTop,
        x: e.clientX,
        y: e.clientY,
    }
    this.el.style.cursor = 'grabbing'
    this.el.style.userSelect = 'none'    
    this.el.addEventListener('mousemove', this.mouseMoveHandler)
    this.el.addEventListener('mouseup', this.mouseUpHandler)
  }
  mouseMoveHandler(e) {
    // How far the mouse has been moved
    let dx = e.clientX - this.pos.x
    let dy = e.clientY - this.pos.y

    // Scroll the element
    this.el.scrollTop = this.pos.top - dy
    this.el.scrollLeft = this.pos.left - dx
  }
  mouseUpHandler = function() {
    this.el.style.cursor = 'grab'
    this.el.style.removeProperty('user-select')

    this.el.removeEventListener('mousemove', this.mouseMoveHandler)
    this.el.removeEventListener('mouseup', this.mouseUpHandler)
  }
  start() {
    this.el.addEventListener('mousedown', this.mouseDownHandler);
  }
}
bloch1 = new Draggable(document.querySelector("#demo-prop__1"))
bloch2 = new Draggable(document.querySelector("#demo-prop__2"))
bloch1.start()
bloch2.start()

nlineDrag = new Draggable(document.querySelector("#demo-nline__nline"))
nlineDrag.start()


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