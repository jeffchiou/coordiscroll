// All live HTMLCollections that update automatically
let ui = document.getElementsByClassName("main-ui")[0];
let columns = document.getElementsByClassName("column");
let articles = document.getElementsByClassName("column__article");
let controls = document.getElementsByClassName('column__controls');
// Other variables
let isSynced = [true];
let mainColumn = columns[0];

function updateGlobalVariables() {
  for (let i = 0; i < articles.length; i++) {
    if (isSynced[i] == undefined) { isSynced[i] = true; }
  }
}

function addColumn() {
  let clone = mainColumn.cloneNode(true);
  ui.append(clone);
  clone.id = "colnum" + columns.length
  clone.getElementsByClassName("column__header")[0].innerHTML = columns.length;
  updateGlobalVariables();
}

function removeColumn(colControls) {
  if (columns.length > 1) {
    ui.removeChild(colControls.closest('.column'));
  } else {
    console.log("No extra columns to remove");
  }
  updateGlobalVariables();
}

function toggleSync(colControls) {
  let column = colControls.closest('.column');
  for (let i = 0; i < columns.length; i++) {
    if (columns[i] == column) {
      isSynced[i] = isSynced[i] ? false : true;
      updateSyncHTML(i);
    }
  }

}

function updateSyncHTML(columnIndex) {
  let columnClasses = columns[columnIndex].classList;
  if (isSynced[columnIndex]) {
    columnClasses.replace("column--desynced", "column--synced");
    controls[columnIndex].getElementsByClassName("column__sync")[0].innerHTML = "⚙ Desync";
  } else {
    columnClasses.replace("column--synced", "column--desynced");
    controls[columnIndex].getElementsByClassName("column__sync")[0].innerHTML = "⚙ Resync";
  }
}

function jump() {
  console.log("jump");
}

function handleControls() {
  switch (event.target.className) {
    case 'column__sync':
      toggleSync(event.currentTarget);
      break;
    case 'column__jump':
      jump();
      break;
    case 'column__close':
      removeColumn(event.currentTarget);
      break;
  }
}

addColumn();
addColumn();

for (let i = 0; i < columns.length; i++) {
  // articles[i].addEventListener('scroll', articleScroll);
  controls[i].addEventListener('click', handleControls);
}