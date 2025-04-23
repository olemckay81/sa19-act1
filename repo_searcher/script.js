/*
    Github Repository Searcher
*/

//Declarations
let searchBar = document.getElementById("searchBar");
let submitBtn = document.getElementById("submit");
let results = document.getElementById("results");
let errorMsg = document.getElementById("error-msg");
let prevBtn = document.getElementById("prev-btn")
let nextBtn = document.getElementById("next-btn")
let pageNum = document.getElementById("page-num");

let currentPage = 1;

function searchGitHub(query, page) {
    if (!query) return;

    results.innerHTML = "Searching...";
    errorMsg.textContent = "";

    fetch(`https://api.github.com/search/repositories?q=${query}&per_page=3&page=${page}`)
    .then(response => response.json())
    .then(data => {
        if (data.items.length == 0) {
            results.innerHTML = "No repositories found.";
            nextBtn.hidden = true;
            return;
        }

        console.log(data.items);
        results.innerHTML = "";
        data.items.forEach( repo => {
            let repoCard = document.createElement("div");
            repoCard.setAttribute("class", "repo-card");

            let repoName = document.createElement("h2");
            let repoLink = document.createElement("a");
            repoLink.setAttribute("href", repo.html_url);
            repoLink.textContent = repo.name;
            repoName.appendChild(repoLink);
            repoCard.appendChild(repoName);

            let repoInfo = document.createElement("div");
            repoInfo.setAttribute("class", "repo-info");
            let repoRating = document.createElement("p");
            repoRating.innerHTML = `Lang: ${repo.language == null ? "None": repo.language} ★: ${repo.stargazers_count} stars`;
            repoInfo.appendChild(repoRating);
            repoCard.appendChild(repoInfo);

            let repoDesc = document.createElement("p");
            repoDesc.textContent = repo.description;
            repoCard.appendChild(repoDesc);

            results.appendChild(repoCard);
        });
        
        prevBtn.hidden = (currentPage == 1);
        nextBtn.hidden = (data.items.length < 3);
    })
    .catch((error) => {
        console.log(error);
        errorMsg.textContent = "Encountered error while fetching results...";
    });
}

submitBtn.addEventListener("click", () => {
    let searchQuery = searchBar.value;
    pageNum.textContent = currentPage;
    searchGitHub(searchQuery, currentPage);
});

prevBtn.addEventListener("click", () => {
    let searchQuery = searchBar.value;
    currentPage = currentPage > 1 ? currentPage - 1: 1;
    pageNum.textContent = currentPage;
    searchGitHub(searchQuery, currentPage);
});
nextBtn.addEventListener("click", () => {
    let searchQuery = searchBar.value;
    currentPage = currentPage + 1; 
    pageNum.textContent = currentPage;
    searchGitHub(searchQuery, currentPage);
});