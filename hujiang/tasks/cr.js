

function closeInIndexPage() {
  let reviews = document.querySelectorAll('.my-reviews tbody tr')
  let reviewsArr = [].slice.apply(reviews)
  let tocloseList = reviewsArr.filter(tr => tr.children[1].innerText === 'TO CLOSE')
  // tocloseList = tocloseList.slice(0, 1) // for debug
  tocloseList.forEach(tr => window.open(tr.children[0].querySelector('a').href + '#autoclose'))
}

function closeInDashboard() {
  let reviews = document.querySelectorAll('#panel-target tbody tr')
  let tocloseList = [].slice.apply(reviews)
  // tocloseList = tocloseList.slice(0, 1) // for debug
  tocloseList.forEach(tr => window.open(tr.children[1].querySelector('a').href + '#autoclose'))
}

// begenClose()
function begenClose() {
  console.log('find reviews to close')
  if (location.pathname === '/cru' && location.search === '?filter=toSummarize') {
    closeInDashboard()
  }
  let toSummarize = document.querySelector('#toSummarize')
  if (toSummarize) {
    location.href = toSummarize.href + '#closeInDashbord'
  } else {
    closeInIndexPage()
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
  if (request.cmd == "begenClose")
    begenClose()
})

function realClose() {
  document.querySelector('#aui-menu-item-views').click()
  setTimeout(() => {
    console.log('closed')
    window.close()
    // todo notify extension closed
  }, 2000)
}

if (location.hash.indexOf('autoclose') > 0) {
  realClose()
}

if (location.hash.indexOf('closeInDashbord') > 0) {
  closeInDashboard()
}