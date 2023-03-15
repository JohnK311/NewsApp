const form = document.forms["newsControls"];
let requestNews = (function () {
  return {
    topHeadlines(country = "us") {
      fetch(
        `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          renderNews(data.articles);
          removeLoader();
        })
        .catch((err) => console.log(err));
    },
    everything(value) {
      fetch(`https://newsapi.org/v2/everything?q=${value}&apiKey=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          renderNews(data.articles);
          removeLoader();
        })
        .catch((err) => console.log(err));
    },
  };
})();

function receivingNews() {
  const country = form.elements["country"].value;
  const searchText = form.elements["search"].value;
  loader();
  if (!searchText) {
    requestNews.topHeadlines(country);
  } else {
    requestNews.everything(searchText);
  }
}
function renderNews(news) {
  let fragment = "";
  let newsContainer = document.querySelector(".news");
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  news.forEach((el) => {
    if(el.source.name != 'YouTube') fragment += generateCard(el);
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

function generateCard({ title, description, url, urlToImage }) {
  return `
          <div class="row">
            <div class="col s12">
              <div class="card medium">
                <div class="card-image">
                  <img src="${urlToImage}"  onerror="this.src = '/img/plug.jpg'"">
                  <span class="card-title flow-text">${title}</span>
                </div>
                <div class="card-content">
                  <p class="flow-text">${description || ''}</p>
                </div>
                <div class="card-action">
                  <a href="${url}">This is a link</a>
                </div>
              </div>
            </div>
          </div>
            `;
}

function clearContainer(container) {
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  receivingNews();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  receivingNews();
});

function loader() {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="progress">
  <div class="indeterminate"></div>
  </div>
  `
  );
}

function removeLoader() {
  let loader = document.querySelector(".progress");
  if (loader) loader.remove();
}