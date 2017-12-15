let contentTemplate = `
    <div class="container">
      <div class="header">
        <span>还有</span><span id="zscCount"></span>个,加油!!!
        <div class="authors"></div>
        <button id="zscClose">关闭</button>
      </div>
      <div class='content'>
        {{value}}
      </div>
    </div>
  `
let authorsTemplate = `
    <ul>
      <li>all</li>
      {{each authors}}
        <li id={{$index}}>{{$index}}({{$value}})<li>
      {{/each}}
    </ul>
  `
let isReviewPage = location.href.match(/phab-by\.intra\.yeshj\.com\/r\w+/)
if (isReviewPage && isReviewed()) {
  let extentionWrapper = document.createElement('div')
  extentionWrapper.className = 'zsc'
  let render = template.compile(contentTemplate, { escape: false })
  Ajax('GET', '/audit')
    .then(html => {
      let bodyReg = /<ul class="phui-oi-list-view ">.*<\/ul>/
      let value = bodyReg.exec(html)[0]
      extentionWrapper.innerHTML = render({ value })
      document.body.appendChild(extentionWrapper)
      enhanceExtention(extentionWrapper)
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

function getAuthor(li) {
  let element = li.querySelector('a.phui-handle.phui-link-person')
  let author = element.innerText
  li.dataset.author = element.innerText
  return author
}

function enhanceExtention(extentionWrapper) {
  let commitList = extentionWrapper.querySelector('ul').children
  commitList = [].slice.apply(commitList)
  let count = commitList.length
  extentionWrapper.querySelector('#zscCount').innerText = count
  extentionWrapper.querySelector('#zscClose').addEventListener('click', function (e) {
    extentionWrapper.classList.add('closed')
  })

  let authors = {}
  commitList.forEach(commit => {
    let author = getAuthor(commit)
    authors[author] = authors[author] || 0
    authors[author] += 1
  })
  let render = template.compile(authorsTemplate, { escape: false })
  extentionWrapper.querySelector('.authors').innerHTML = render({ authors })
  extentionWrapper.querySelector('.authors').addEventListener('click', function (e) {
    hideOthers(e.target.id, commitList)
  })
}

function hideOthers(author, list) {
  list.forEach(v => {
    if (!author) {
      v.style.display = 'list-item'
      return
    }
    if (v.dataset.author === author) {
      v.style.display = 'list-item'
    } else {
      v.style.display = 'none'
    }
  })
}
