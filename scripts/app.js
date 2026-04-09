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

if (header) {
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
}

// THEME TOGGLE
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("siteTheme") || "light";
body.classList.remove("light", "dark");
body.classList.add(savedTheme);
if (toggleBtn) {
  toggleBtn.textContent = savedTheme === "light" ? "🌙" : "☀️";
}

function setTheme(theme) {
  body.classList.remove("light", "dark");
  body.classList.add(theme);
  localStorage.setItem("siteTheme", theme);
  if (toggleBtn) {
    toggleBtn.textContent = theme === "light" ? "🌙" : "☀️";
  }
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light") ? "dark" : "light";
    setTheme(nextTheme);
  });
}

// SEARCH FEATURE
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", function () {
    var query = searchInput.value.trim();
    if (query !== "") {
      searchMovies(query);
    } else if (document.getElementById("trending-section")) {
      loadTrending();
    } else {
      loadPageSpecificMovies();
    }
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      var query = searchInput.value.trim();
      if (query !== "") {
        searchMovies(query);
      }
    }
  });
}

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

let currentMovieDetail = null;

function createMovieCard(movie) {
  var box = document.createElement("div");
  box.classList.add("box");

  var link = document.createElement("a");
  link.href = "movie.html?id=" + movie.id;
  link.classList.add("movie-link");
  link.title = movie.title || movie.name || "View movie details";

  var img = document.createElement("img");
  img.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  img.alt = movie.title || movie.name || "Movie poster";

  link.appendChild(img);
  box.appendChild(link);
  return box;
}

function getStoredMovies(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (err) {
    return [];
  }
}

function saveStoredMovies(key, movies) {
  localStorage.setItem(key, JSON.stringify(movies));
}

function isMovieInList(movieId, key) {
  return getStoredMovies(key).some(function (movie) {
    return movie.id === movieId;
  });
}

function addMovieToList(movie, key) {
  if (!movie || !movie.id) return;

  var stored = getStoredMovies(key);
  if (
    !stored.some(function (item) {
      return item.id === movie.id;
    })
  ) {
    stored.push({
      id: movie.id,
      title: movie.title || movie.name || "Untitled",
      poster_path: movie.poster_path,
      release_date: movie.release_date || movie.first_air_date || "",
      vote_average: movie.vote_average || null,
    });
    saveStoredMovies(key, stored);
  }
}

function updateMovieButtons() {
  var favButton = document.getElementById("addToFavorites");
  var watchButton = document.getElementById("addToWatchlist");
  if (!currentMovieDetail) return;

  if (favButton) {
    var favorited = isMovieInList(currentMovieDetail.id, "favorites");
    favButton.textContent = favorited
      ? "Added to Favorites"
      : "Add to Favorites";
    favButton.disabled = favorited;
  }
  if (watchButton) {
    var inWatchlist = isMovieInList(currentMovieDetail.id, "watchlist");
    watchButton.textContent = inWatchlist
      ? "Added to Watchlist"
      : "Add to Watchlist";
    watchButton.disabled = inWatchlist;
  }
}

function bindMovieDetailButtons() {
  var favButton = document.getElementById("addToFavorites");
  var watchButton = document.getElementById("addToWatchlist");

  if (favButton) {
    favButton.addEventListener("click", function () {
      if (!currentMovieDetail) return;
      addMovieToList(currentMovieDetail, "favorites");
      updateMovieButtons();
    });
  }

  if (watchButton) {
    watchButton.addEventListener("click", function () {
      if (!currentMovieDetail) return;
      addMovieToList(currentMovieDetail, "watchlist");
      updateMovieButtons();
    });
  }
}

bindMovieDetailButtons();

function showResults(movies, query) {
  var section =
    document.getElementById("trending-section") ||
    document.getElementById("listing-section");
  var sectionTitle =
    document.getElementById("title-trending") ||
    document.getElementById("page-title");
  if (sectionTitle) {
    sectionTitle.textContent = "Search Results for: " + query;
  }
  if (!section) {
    console.log("No results container found for search.");
    return;
  }
  section.innerHTML = "";
  movies.forEach(function (movie) {
    if (movie.poster_path) {
      section.appendChild(createMovieCard(movie));
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
      if (sectionTitle) {
        sectionTitle.textContent = "Trending";
      }
      fillSection("trending-section", data.results);
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
}

// FILL SECTION HELPER
function fillSection(sectionId, movies) {
  var section = document.getElementById(sectionId);
  if (!section) return;
  section.innerHTML = "";
  var count = 0;
  movies.forEach(function (movie) {
    if (movie.poster_path && count < 20) {
      section.appendChild(createMovieCard(movie));
      count++;
    }
  });
}

function loadMovieDetail() {
  const detailContainer = document.querySelector(".movie-details");
  const moviePoster = document.querySelector(".movie-poster .card img");
  const movieTitle = document.querySelector(".movie-title");
  const movieOverview = document.querySelector(".movie-overview");
  const movieRelease = document.querySelector(".movie-release-date");
  const movieRating = document.querySelector(".movie-rating");

  if (!detailContainer || !moviePoster || !movieTitle) return;

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");
  if (!movieId) return;

  fetch("https://api.themoviedb.org/3/movie/" + movieId, options)
    .then(function (res) {
      return res.json();
    })
    .then(function (movie) {
      var posterPath = movie.poster_path || movie.backdrop_path || "";
      if (posterPath) {
        moviePoster.src = "https://image.tmdb.org/t/p/original" + posterPath;
      } else {
        moviePoster.src = "assets/images/img1.jpg";
      }
      moviePoster.alt = movie.title || movie.name || "Movie poster";
      movieTitle.textContent = movie.title || movie.name || "Movie details";
      movieOverview.textContent = movie.overview || "No description available.";
      movieRelease.textContent =
        "Release date: " + (movie.release_date || "Unknown");
      movieRating.textContent =
        "Rating: " + (movie.vote_average ? movie.vote_average + "/10" : "N/A");
      currentMovieDetail = movie;
      updateMovieButtons();
    })
    .catch(function (err) {
      console.log("Error loading movie details:", err);
    });
}

// TRENDING MOVIES
if (document.getElementById("trending-section")) {
  fetch("https://api.themoviedb.org/3/trending/movie/week", options)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      fillSection("trending-section", data.results);
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
}

loadMovieDetail();

function fillAllMovies(sectionId, movies) {
  var section = document.getElementById(sectionId);
  if (!section) return;
  section.innerHTML = "";
  movies.forEach(function (movie) {
    if (movie.poster_path) {
      section.appendChild(createMovieCard(movie));
    }
  });
}

// PAGE-SPECIFIC MOVIES
function loadPageSpecificMovies() {
  const pageTitle = document.getElementById("page-title");
  const listingSection = document.getElementById("listing-section");
  if (!pageTitle || !listingSection) return;

  const titleText = pageTitle.textContent.trim();

  if (titleText.includes("Popular")) {
    fetch("https://api.themoviedb.org/3/movie/popular", options)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        fillAllMovies("listing-section", data.results);
      })
      .catch(function (err) {
        console.log("Error:", err);
      });
  } else if (titleText.includes("Top Rated")) {
    fetch("https://api.themoviedb.org/3/movie/top_rated", options)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        fillAllMovies("listing-section", data.results);
      })
      .catch(function (err) {
        console.log("Error:", err);
      });
  } else if (titleText.includes("Watchlist")) {
    renderSavedMovieList(
      "watchlist",
      "Your watchlist is empty. Add movies to save them here.",
    );
  } else if (titleText.includes("Favorites")) {
    renderSavedMovieList(
      "favorites",
      "No favorites yet. Add some movies to your favorites list.",
    );
  }
}

function renderSavedMovieList(key, emptyMessage) {
  var section = document.getElementById("listing-section");
  if (!section) return;
  var saved = getStoredMovies(key);
  section.innerHTML = "";
  if (!saved.length) {
    var emptyBox = document.createElement("div");
    emptyBox.classList.add("box");
    emptyBox.innerHTML =
      '<p style="color: white; padding: 1rem; text-align: center; width: 100%;">' +
      emptyMessage +
      "</p>";
    section.appendChild(emptyBox);
    return;
  }
  saved.forEach(function (movie) {
    var wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";

    var card = createMovieCard(movie);

    var removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.style.position = "absolute";
    removeBtn.style.top = "8px";
    removeBtn.style.right = "8px";
    removeBtn.style.background = "rgba(0,0,0,0.7)";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "28px";
    removeBtn.style.height = "28px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.fontSize = "14px";
    removeBtn.style.zIndex = "10";
    removeBtn.style.transition = "background 0.2s ease";

    removeBtn.addEventListener("mouseenter", function () {
      removeBtn.style.background = "#e53935";
    });
    removeBtn.addEventListener("mouseleave", function () {
      removeBtn.style.background = "rgba(0,0,0,0.7)";
    });

    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var stored = getStoredMovies(key);
      var updated = stored.filter(function (m) {
        return m.id !== movie.id;
      });
      saveStoredMovies(key, updated);
      renderSavedMovieList(key, emptyMessage);
    });

    wrapper.appendChild(card);
    wrapper.appendChild(removeBtn);
    section.appendChild(wrapper);
  });
}

loadPageSpecificMovies();
