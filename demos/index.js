const appendClone = (target, elToClone, id=null, _class=null) => {
  let newEl = elToClone.cloneNode(true)
  id ? newEl.id=id : newEl.removeAttribute('id')
  newEl.classList.remove("hidden")
  if (_class) newEl.classList.add(_class)
  target.append(newEl)
}

let lorem = document.querySelector(".lorem")
let annotations = document.querySelector(".annotations")
let propDiv = document.querySelector(".demo-prop")
appendClone(propDiv,lorem,"demo-prop__1","demo-prop__col")
appendClone(propDiv,lorem,"demo-prop__2","demo-prop__col")
appendClone(propDiv,annotations,"demo-prop__3","demo-prop__col")

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