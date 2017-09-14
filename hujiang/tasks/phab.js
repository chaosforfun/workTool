let isReviewPage = location.href.match(/phab-by\.intra\.yeshj\.com\/r\w+/)
if (isReviewPage && isReviewed()) {
  let extentionWrapper = document.createElement('div')
  extentionWrapper.className = 'zsc'
  let contentTemplate = `
    <div class="container">
      <div class="header">
        <span>还有</span><span id="zscCount"></span>个,加油!!!
        <button id="zscClose">关闭</button>
      </div>
      <div class='content'>
        {{value}}
      </div>
    </div>
  `
  let render = template.compile(contentTemplate, { escape: false })
  Ajax('GET', '/audit')
    .then(html => {
      let bodyReg = /<ul class="phui-oi-list-view ">.*<\/ul>/
      let value = bodyReg.exec(html)[0]
      extentionWrapper.innerHTML = render({value})
      document.body.appendChild(extentionWrapper)
      let count = extentionWrapper.querySelector('ul').children.length
      extentionWrapper.querySelector('#zscCount').innerText = count
      extentionWrapper.querySelector('#zscClose').addEventListener('click', function(e) {
        extentionWrapper.classList.add('closed')
      })
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
      isReviewed = !user.children[0].classList.contains('orange')
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