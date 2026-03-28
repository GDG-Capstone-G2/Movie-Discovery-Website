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
  "assets/images/img8.jpg"
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