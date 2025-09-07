document.addEventListener("DOMContentLoaded", () => {
  const gameLinks = document.querySelectorAll(".game-link");
  const popup = document.getElementById("game-popup");
  const popupTitle = document.getElementById("popup-title");
  const gameIframe = document.getElementById("game-iframe");
  const closeBtn = document.querySelector(".close-btn");

  gameLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); 
      const gameUrl = link.getAttribute("href");
      const gameTitle = link.getAttribute("data-game-title");

      gameIframe.src = gameUrl;
      popupTitle.textContent = gameTitle;
      
      popup.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
    gameIframe.src = ""; //
  });

  window.addEventListener("click", (event) => {
    if (event.target === popup) {
      popup.style.display = "none";
      gameIframe.src = "";
    }
  });
});