let grid4x4 = document.querySelector('.grid4x4')
let grid2x2 = document.querySelector('.grid2x2')
let longArticle1 = document.querySelector('#long-article1')
let longArticle2 = document.querySelector('#long-article2')
let annotations = document.querySelector('#annotations')
const appendClone = (target, elToClone, id=null, _class=null) => {
  let newEl = elToClone.cloneNode(true)
  id ? newEl.id=id : newEl.removeAttribute('id')
  if (_class) newEl.classList.add(_class)
  target.append(newEl)
}

for (let row=0; row<3; row++) {
  let _class = `g4_r${row+1}`
  for (let col=0; col<4; col++) {
    let id = `g4_${row+1}-${col+1}`
    if (col == 0 || col == 1) {
      appendClone(grid4x4, longArticle1, id=id, _class=_class)
    } else if (col == 2) {
      appendClone(grid4x4, longArticle2, id=id, _class=_class)
    } else {
      appendClone(grid4x4, annotations, id=id, _class=_class)
    }              
  }   
}

let imgList = ['y=x.png','y=x^2.png','y=sin(x).png','y=sqrt(x).png']
imgList.forEach((imgPath,i) => {
  let newDiv = document.createElement('div')
  newDiv.classList.add('grid-el', 'g4_r4')
  newDiv.id = `g4_4-${i+1}`
  let newImg = document.createElement('img')
  newImg.src = `./img/${imgList[i]}`
  newImg.style.width = '500px'
  newImg.style.height= '500px'
  newDiv.append(newImg)   
  grid4x4.append(newDiv)
})

appendClone(grid2x2, longArticle1, 'g2_1-1', 'g2_r1')
appendClone(grid2x2, annotations, 'g2_1-2', 'g2_r2') 


let sourceDiv = document.createElement('div')
sourceDiv.classList.add('grid-el', 'g2_r2')
sourceDiv.id = 'g2_2-1'
let sourceImg = document.createElement('img')
sourceImg.src = './img/y=x^3.png'
sourceImg.style.width = '1000px'
sourceImg.style.height= '1000px'
sourceDiv.append(sourceImg)   
grid2x2.append(sourceDiv)

let zoomDiv = document.createElement('div')
zoomDiv.classList.add('grid-el', 'g2_r2')
zoomDiv.id = 'g2_2-2'
let zoomImg = document.createElement('img')
zoomImg.src = './img/y=x^3.png'
zoomImg.style.width = '2000px'
zoomImg.style.height= '2000px'
zoomDiv.append(zoomImg)   
grid2x2.append(zoomDiv)
