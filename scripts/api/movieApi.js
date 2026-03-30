const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MmU2YTc3MDg2MDA4YmE0NGVkYmU0ZmIwYmNmMTUxMyIsIm5iZiI6MTc3NDc5MDA3My42ODUsInN1YiI6IjY5YzkyNWI5MDRiOWJkY2IwNTkzMzljOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yGYam0tMhdw6ZWN2diATCBU9netR-YsFwpZcs_bwYJc";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + API_TOKEN,
  },
};

fetch("https://api.themoviedb.org/3/trending/movie/week", options)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    var movies = data.results;
    loadHero(movies);
  })
  .catch(function (err) {
    console.log("Error:", err);
  });

function loadHero(movies) {
  var hero = document.querySelector(".heroHeader");
  var firstMovie = movies[0];
  var imageUrl =
    "https://image.tmdb.org/t/p/original" + firstMovie.backdrop_path;
  hero.style.backgroundImage = "url(" + imageUrl + ")";
}
