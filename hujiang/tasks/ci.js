let buidList = document.querySelector('#buildHistory .pane-content')
let lastBuild
let interval = 3000
if (Notification.permission !== 'granted') {
  Notification.requestPermission()
}
let isBuilding = false
function run() {
  lastBuild = buidList.querySelector('tr.build-row')
  let success = lastBuild.querySelector('.build-icon .doony-circle-success')
  if (isBuilding && success) {
    let target = lastBuild.querySelector('.build-controls a')
    let n = new Notification('build success, please cd')
    n.addEventListener('click', e => {
      target && target.click()
    })
  }
  // 转圈时有个canvas
  isBuilding = lastBuild.querySelector('canvas')
  setTimeout(run, interval)
}

run()
