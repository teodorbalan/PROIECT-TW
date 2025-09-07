document.addEventListener("DOMContentLoaded", () => {
    const moviesContainer = document.getElementById("movies");
    const reviewPopup = document.getElementById("review-popup");
    const reviewForm = document.getElementById("review-form");
    const reviewList = document.getElementById("review-list");
    const reviewTitle = document.getElementById("review-title");
    const ratingInput = document.getElementById("review-rating");
    const ratingValueSpan = document.getElementById("rating-value");
    
    // Proprietati si metode (localStorage, Array, Math, String, Date)
    const watchlistKey = "userWatchlist";
    const reviewsKey = "userReviews";
    
    // Functie pentru a incarca datele din localStorage
    function loadDataFromStorage() {
        return {
            watchlist: JSON.parse(localStorage.getItem(watchlistKey)) || [],
            reviews: JSON.parse(localStorage.getItem(reviewsKey)) || {}
        };
    }

    // AJAX: fetch-ul datelor
    async function fetchMovies() {
        const bodyStyle = window.getComputedStyle(document.body);
        console.log("Culoarea de fundal a body-ului este:", bodyStyle.backgroundColor);

        const apiKey = "f344c4544491e9dd28e5e2e68e920aa6";
        const apiUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            data.results.sort(() => 0.5 - Math.random());
            
            data.results.forEach(media => {
                const movieCard = createMovieCard(media);
                moviesContainer.appendChild(movieCard);
            });
        } catch (error) {
            console.error("Eroare la preluarea datelor:", error);
            moviesContainer.innerHTML = "<p>Eroare la încărcarea filmelor. Te rugăm să verifici cheia API.</p>";
        }
    }

    // Schimbarea aleatorie a valorilor unei proprietăți
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    setInterval(() => {
        document.body.style.backgroundColor = getRandomColor();
    }, 10000);

    // Crearea de elemente și manipularea DOM-ului
    function createMovieCard(media) {
        const { title, name, backdrop_path, id } = media;
        const movieCard = document.createElement("div");
        
        movieCard.classList.add("movie-item");
        movieCard.setAttribute("data-movie-id", id);
        
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${backdrop_path}" alt="${title || name}" class="movie-img" />
            <div class="title">${title || name}</div>
            <button class="add-to-watchlist" data-action="save-to-watchlist">Save to Watchlist</button>
            <button class="add-review-btn" data-action="open-review">Add Review</button>
        `;
        return movieCard;
    }

    // Functia pentru salvarea in watchlist
    function addToWatchlist(movie) {
        let { watchlist } = loadDataFromStorage();
        if (!watchlist.some(item => item.id === movie.id)) {
            watchlist.push(movie);
            localStorage.setItem(watchlistKey, JSON.stringify(watchlist));
            console.log("Movie saved to watchlist:", watchlist);
        } else {
            console.log("Movie is already in watchlist.");
        }
    }

    // Functia pentru deschiderea formularului de review
    function openReviewForm(movieId, movieTitle) {
        reviewPopup.classList.add("is-visible");
        reviewTitle.textContent = `Review for: ${movieTitle}`;
        reviewForm.setAttribute("data-movie-id", movieId);
        renderReviews(movieId);
    }
    
    function renderReviews(movieId) {
        let { reviews } = loadDataFromStorage();
        reviewList.innerHTML = '';
        const movieReviews = reviews[movieId] || [];
        
        if (movieReviews.length === 0) {
            reviewList.innerHTML = '<p>Fără recenzii încă.</p>';
        } else {
            movieReviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('review-item');
                const date = new Date(review.date);
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

                reviewDiv.innerHTML = `
                    <p><strong>${review.author}</strong> - ${formattedDate}</p>
                    <p>"${review.text}"</p>
                    <p>Rating: ${review.rating} / 5</p>
                    <button class="review-delete" data-action="delete-review" data-review-id="${review.id}">Șterge</button>
                `;
                reviewList.appendChild(reviewDiv);
            });
        }
    }

    // Event Delegation pe containerul de filme
    moviesContainer.addEventListener('click', (event) => {
        const movieItem = event.target.closest('.movie-item');
        if (!movieItem) return; // Ieși dacă nu e un card de film

        const movieId = movieItem.getAttribute('data-movie-id');
        const movieTitle = movieItem.querySelector('.title').textContent;
        const action = event.target.dataset.action; // Folosim proprietatea dataset

        if (action === 'save-to-watchlist') {
            const movieData = {
                id: movieId,
                title: movieTitle,
            };
            addToWatchlist(movieData);
            event.target.textContent = "Saved!";
        } else if (action === 'open-review') {
            openReviewForm(movieId, movieTitle);
        }
    });

    // Event Delegation pe lista de recenzii
    reviewList.addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        if (action === 'delete-review') {
            const reviewId = parseInt(event.target.getAttribute('data-review-id'));
            const movieId = reviewForm.getAttribute('data-movie-id');
            let { reviews } = loadDataFromStorage();
            
            reviews[movieId] = reviews[movieId].filter(review => review.id !== reviewId);
            localStorage.setItem(reviewsKey, JSON.stringify(reviews));
            renderReviews(movieId);
        }
    });

    // Event Listener pentru a închide pop-up-ul
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const target = event.currentTarget.dataset.closeTarget;
            document.querySelector(target).classList.remove('is-visible');
        });
    });

    // Event Listener pentru a salva recenzia
    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const movieId = reviewForm.getAttribute("data-movie-id");
        const author = document.getElementById("review-author").value.trim();
        const reviewText = document.getElementById("review-text").value.trim();
        const rating = parseInt(ratingInput.value);
        
        const nameRegex = /^[A-Z][a-z]+$/;
        if (!nameRegex.test(author)) {
            alert("Numele trebuie să înceapă cu majusculă și să conțină doar litere!");
            return;
        }

        const newReview = {
            id: Date.now(),
            author: author,
            text: reviewText,
            rating: rating,
            date: new Date().toISOString()
        };

        let { reviews } = loadDataFromStorage();
        if (!reviews[movieId]) {
            reviews[movieId] = [];
        }
        reviews[movieId].push(newReview);
        localStorage.setItem(reviewsKey, JSON.stringify(reviews));
        
        reviewForm.reset();
        renderReviews(movieId);
    });

    // Event Listener pentru a actualiza valoarea rating-ului
    ratingInput.addEventListener('input', () => {
        ratingValueSpan.textContent = ratingInput.value;
    });

    fetchMovies();
});