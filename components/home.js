document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".fun-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      alert("🎉 Fun Fact: I can code for hours while listening to movie soundtracks!");
    });
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", () => {
      if (themeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    });
  }
});