'use strict'
// Global Search object to store search references in.
window.SearchApp =  {
    searchSource: document.querySelector('#searchBox'),
    searchField: document.getElementById("searchField"),
    searchButton: document.getElementById("searchButton"),
    output: document.getElementById("output"),
    searchData: {},
    searchIndex: {}
};

// Async load data from pre-built JSON file.
axios
    .get(SearchApp.searchSource.dataset.lunrsearch)
    .then(response => {
        SearchApp.searchData = response.data;
        SearchApp.searchIndex = lunr(function () {
            this.ref('href');
            this.field('title');
            this.field('author');
            this.field('issue');
            this.field('category');
            this.field('date');
            this.field('summary');
            response.data.results.forEach ( e => { this.add(e); } );
        });
    });

// Perform search on searchButton click.
SearchApp.searchButton.addEventListener('click', search);

// The search function
function search() {
    let searchText = SearchApp.searchField.value;
    let resultList = SearchApp.searchIndex.search(searchText);
    let list = [];
    let results = resultList.map(entry => {
        SearchApp.searchData.results.filter( d => {
            if (entry.ref == d.href) {
                list.push(d);
            }
        });
    });
    display(list);
};

// Display the search results.
function display(list) {
    SearchApp.output.innerText = ''; // replace any existing text with new stuff.
    if (list.length > 0) {
        let resultItemTemplate = document.getElementById('search-result-item');
        list.forEach(el => {
            let resultItem = document.importNode(resultItemTemplate.content, true);
            let resultMeta = el.date + " / Issue " + el.issue + " / " + el.category;
            resultItem.querySelector('.search-result-href').href = el.href;
            resultItem.querySelector('.search-result-title').textContent = el.title;
            resultItem.querySelector('.search-result-author').textContent = el.author;
            resultItem.querySelector('.search-result-meta').textContent = resultMeta;
            resultItem.querySelector('.search-result-summary').textContent = el.summary;
            SearchApp.output.appendChild(resultItem);
        });
    } else {
        let noResultTemplate = document.getElementById('search-result-not-found');
        let noResult = document.importNode(noResultTemplate.content, true);
        SearchApp.output.appendChild(noResult);
    }
};
