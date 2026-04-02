import { IMG_URL } from "../utils/constants.js";
import { addToWatchlist } from "../services/watchlist.js";

export function createMovieCard(movie) {
  const div = document.createElement("div");
  div.className = "movie-card";

  div.innerHTML = `
    <img src="${IMG_URL + movie.poster_path}" />
    <h3>${movie.title}</h3>
    <p>⭐ ${movie.vote_average}</p>
    <button>❤️</button>
  `;

  div.querySelector("button").onclick = () => addToWatchlist(movie);

  div.onclick = () => {
    localStorage.setItem("selectedMovie", JSON.stringify(movie));
    window.location.href = "movie.html";
  };

  return div;
}