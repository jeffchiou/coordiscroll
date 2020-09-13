export const ScrollFuncs = {}
ScrollFuncs.absolute = (msg, acc) => [msg.x, msg.y]
ScrollFuncs.absXOnly = (msg, acc) => [msg.x, null]
ScrollFuncs.absYOnly = (msg, acc) => [null, msg.y]
ScrollFuncs.proportional = (msg, acc) => {  
  let x = acc.state.w * msg.x / msg.w
  let y = acc.state.h * msg.y / msg.h
  return [x, y]
}
ScrollFuncs.relSpring =  (msg, acc) => {
  let offsetX = acc.state.xOnSync - msg.xOnSync
  let offsetY = acc.state.yOnSync - msg.yOnSync
  return [msg.x + offsetX, msg.y + offsetY]
}
ScrollFuncs.relLoop =  (msg, acc) => {
  let offsetX = acc.state.xOnSync - msg.xOnSync
  let offsetY = acc.state.yOnSync - msg.yOnSync
  acc.state.xGoal = msg.x + offsetX
  acc.state.yGoal  = msg.y + offsetY
  if (acc.state.xGoal > acc.state.w)  acc.state.xGoal = acc.state.xGoal - acc.state.w 
  else if (acc.state.xGoal < 0 )      acc.state.xGoal = acc.state.xGoal + acc.state.w
  if (acc.state.yGoal > acc.state.h)  acc.state.yGoal = acc.state.yGoal - acc.state.h 
  else if (acc.state.yGoal < 0 )      acc.state.yGoal = acc.state.yGoal + acc.state.h 
  return [acc.state.xGoal, acc.state.yGoal]
}
ScrollFuncs.relLoopDxy =  (msg, acc) => {
  let dx = msg.x - msg.x0
  let dy = (msg.y - msg.y0)
  acc.state.xGoal = acc.state.xGoal ? dx + acc.state.xGoal : dx + acc.state.x
  acc.state.yGoal = acc.state.yGoal ? dy + acc.state.yGoal : dy + acc.state.y
  if (acc.state.xGoal > acc.state.w)  acc.state.xGoal = acc.state.xGoal - acc.state.w + dx
  else if (acc.state.xGoal < 0)       acc.state.xGoal = acc.state.xGoal + acc.state.w + dx  
  if (acc.state.yGoal > acc.state.h)  acc.state.yGoal = acc.state.yGoal - acc.state.h + dy
  else if (acc.state.yGoal < 0)       acc.state.yGoal = acc.state.yGoal + acc.state.h + dy  
  return [acc.state.xGoal, acc.state.yGoal]
}
ScrollFuncs.relSoft = (msg, acc) => {
  let dx = msg.x - msg.x0
  let dy = msg.y - msg.y0

  if (acc.state.xGoal > acc.state.h || acc.state.xGoal < 0) acc.state.xGoal = null
  if (acc.state.yGoal > acc.state.h || acc.state.yGoal < 0) acc.state.yGoal = null    
  // alternative implementation is to alternate between NaN (NaN, not null) and next goal, 
  // resulting in intended loss of sync position
  acc.state.xGoal = acc.state.xGoal ? dx + acc.state.xGoal : dx + acc.state.x
  acc.state.yGoal = acc.state.yGoal ? dy + acc.state.yGoal : dy + acc.state.y
  return [acc.state.xGoal, acc.state.yGoal]
}