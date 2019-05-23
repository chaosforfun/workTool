
document.querySelector('.shells').addEventListener('click', function (e) {
  switch(e.target.id) {
    case 'closeReview': 
      closeReview(e)
      break;
    case 'switchToWap':
      switchToWap(event)
      break;
  }
  window.close()
})

function closeReview(event) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: "begenClose" });
  });
}

function switchToWap(event) {
  function reload() {
    let hasQuery = location.href.indexOf('?') !== -1
    let separator = hasQuery ? '&' : '?'
    location.href = `${location.href}${separator}clientType=wap`
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    chrome.tabs.executeScript(tabs[0].id, { code:  fnBodyToString(reload)});
  });
}

function fnBodyToString(fn) {
  return `(${fn.toString()})()`
}
