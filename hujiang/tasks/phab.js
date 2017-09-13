let isReviewPage = location.href.match(/phab-by\.intra\.yeshj\.com\/r\w+/)
if (isReviewPage && isReviewed()) {
  let audit = document.createElement('div')
  audit.className = 'zsc'
  Ajax('GET', '/audit')
    .then(html => {
      let bodyReg = /<ul class="phui-oi-list-view ">.*<\/ul>/
      audit.innerHTML = bodyReg.exec(html)[0]
      document.body.appendChild(audit)
    })
}

function isReviewed() {
  let currentUser = getCurrentUser()
  let auditors
  // get details key
  document.querySelectorAll('.phui-property-list-key').forEach(key => {
    if (key.innerHTML === 'Auditors ') {
      auditors = key.nextSibling
    }
  })
  let isReviewed = false;
  auditors.querySelectorAll('.phui-status-item-target').forEach(user => {
    let username = user.children[1].innerText
    // check current user's status
    if (username == currentUser) {
      isReviewed = user.children[0].classList.contains('green')
    }
  })
  return isReviewed
}

function getCurrentUser() {
  return document.querySelector('.phabricator-core-menu-icon.phabricator-core-menu-profile-image').nextSibling.innerText
}

function Ajax(method, url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', '/audit')
    xhr.onload = function () {
      resolve(xhr.responseText)
    }
    xhr.send()
  })
}