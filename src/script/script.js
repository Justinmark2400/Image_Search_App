"use strict";

const inputSearch = document.querySelector(".search");
const btnSearch = document.querySelector(".btn-search");
const form = document.querySelector(".form");
const btnShow = document.querySelector(".btn-show");
const container = document.querySelector(".container-image");

const APIKey = "Uf8lq-tQl1PJpzlCcgpy6ktdzdCtcu_4gKeY3SVGEdg";
// const query = "pizza";
let page = 1;

let state = {
  query: "",
  page: 1,
  result: [],
  totalPage: 0,
};

const renderMarkup = function (data) {
  const markup = data.reduce(
    (acc, img) =>
      (acc += `
  <div class="image">
  <a class="class-link" href="#">
  <img
  src="${img.urls.full}"
  alt="img.alt_description"
  class="img"
  />
  </a>
  <p class="image-description">${img.alt_description}</p>
  </div>
  `),
    ""
  );
  container.insertAdjacentHTML("beforeend", markup);
};

const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.total === 0) throw Error("No result found 😭");
    state.totalPage = data.total_pages;
    state.result.push(...data.results);
  } catch (err) {
    throw err;
  }
};

const getQuery = async function () {
  try {
    const query = inputSearch.value.trim();
    inputSearch.value = "";
    inputSearch.blur();

    if (!query) return;
    state.query = query;
    const data = await getJSON(
      `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${APIKey}`
    );
    container.innerHTML = "";
    renderMarkup(state.result);
    if (state.page < state.totalPage) {
      btnShow.classList.remove("hidden");
    }
  } catch (err) {
    console.error(err);
  }
};

const showResult = async function () {
  state.page++;
  const data = await getJSON(
    `https://api.unsplash.com/search/photos?page=${state.page}&query=${state.query}&client_id=${APIKey}`
  );
  renderMarkup(state.result.slice((state.page - 1) * 10));
};

const init = function () {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    state = {
      query: "",
      page: 1,
      result: [],
      totalPage: 0,
    };
    getQuery();
  });
  btnShow.addEventListener("click", showResult);
};
init();
