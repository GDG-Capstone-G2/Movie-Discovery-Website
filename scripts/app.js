// HERO BACKGROUND SLIDER
const header = document.querySelector(".heroHeader");
const images = [
  "assets/images/img1.jpg",
  "assets/images/img2.jpg",
  "assets/images/img3.jpg",
  "assets/images/img4.jpg",
  "assets/images/img5.jpg",
  "assets/images/img6.jpg",
  "assets/images/img7.jpg",
  "assets/images/img8.jpg",
];

let index = 0;

header.style.backgroundImage = `url(${images[index]})`;
header.style.backgroundSize = "cover";
header.style.backgroundPosition = "center";

function changeBackground() {
  index = (index + 1) % images.length;

  header.style.transition = "opacity 0.6s ease-in-out";
  header.style.opacity = "0.2";

  setTimeout(() => {
    header.style.backgroundImage = `url(${images[index]})`;
    header.style.opacity = "1";
  }, 600);
}

setInterval(changeBackground, 4000);

// THEME TOGGLE
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

body.classList.add("light");

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (body.classList.contains("light")) {
      body.classList.replace("light", "dark");
      toggleBtn.textContent = "☀️";
    } else {
      body.classList.replace("dark", "light");
      toggleBtn.textContent = "🌙";
    }
  });
}

// SEARCH FEATURE
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", function () {
  var query = searchInput.value;
  if (query !== "") {
    searchMovies(query);
  } else {
    loadTrending();
  }
});

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    var query = searchInput.value;
    if (query !== "") {
      searchMovies(query);
    }
  }
});

function searchMovies(query) {
  fetch("https://api.themoviedb.org/3/search/movie?query=" + query, options)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      showResults(data.results, query);
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
}

function showResults(movies, query) {
  var section = document.getElementById("trending-section");
  var sectionTitle = document.getElementById("title-trending");
  sectionTitle.textContent = "Search Results for: " + query;
  section.innerHTML = "";
  movies.forEach(function (movie) {
    if (movie.poster_path) {
      var box = document.createElement("div");
      box.classList.add("box");
      box.innerHTML =
        '<img src="https://image.tmdb.org/t/p/w500' +
        movie.poster_path +
        '" alt="' +
        movie.title +
        '">';
      section.appendChild(box);
    }
  });
}

function loadTrending() {
  fetch("https://api.themoviedb.org/3/trending/movie/week", options)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var sectionTitle = document.getElementById("title-trending");
      sectionTitle.textContent = "Trending";
      fillSection("trending-section", data.results);
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
}

// FILL SECTION HELPER
function fillSection(sectionId, movies) {
  var section = document.getElementById(sectionId);
  section.innerHTML = "";
  var count = 0;
  movies.forEach(function (movie) {
    if (movie.poster_path && count < 4) {
      var box = document.createElement("div");
      box.classList.add("box");
      box.innerHTML =
        '<img src="https://image.tmdb.org/t/p/w500' +
        movie.poster_path +
        '" alt="' +
        (movie.title || movie.name) +
        '">';
      section.appendChild(box);
      count++;
    }
  });
}

// TRENDING MOVIES
fetch("https://api.tmdb.org/3/trending/movie/week", options)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    fillSection("trending-section", data.results);
  })
  .catch(function (err) {
    console.log("Error:", err);
  });

// LATEST TV SERIES
fetch("https://api.themoviedb.org/3/trending/tv/week", options)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    fillSection("tvseries-section", data.results);
  })
  .catch(function (err) {
    console.log("Error:", err);
  });

// LATEST HOLLYWOOD MOVIES
fetch(
  "https://api.themoviedb.org/3/discover/movie?with_original_language=en&sort_by=popularity.desc",
  options,
)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    fillSection("hollywood-section", data.results);
  })
  .catch(function (err) {
    console.log("Error:", err);
  });

// LATEST BOLLYWOOD MOVIES
fetch(
  "https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=popularity.desc",
  options,
)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    fillSection("bollywood-section", data.results);
  })
  .catch(function (err) {
    console.log("Error:", err);
  });

// POPULAR BUTTON
document.getElementById("btn-popular").addEventListener("click", function (e) {
  e.preventDefault();
  fetch("https://api.themoviedb.org/3/movie/popular", options)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      document.getElementById("title-trending").textContent = "Popular Movies";
      fillSection("trending-section", data.results);
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
});

// TOP RATED BUTTON
document.getElementById("btn-toprated").addEventListener("click", function (e) {
  e.preventDefault();
  fetch("https://api.themoviedb.org/3/movie/top_rated", options)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      document.getElementById("title-trending").textContent =
        "Top Rated Movies";
      fillSection("trending-section", data.results);
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
});
