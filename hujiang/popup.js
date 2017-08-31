
document.querySelector('.shells').addEventListener('click', function (e) {
  if (e.target.id === 'closeReview') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { cmd: "begenClose" });
    });
  }
  window.close()
})