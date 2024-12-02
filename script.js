//Popular Movies - I want to use these movies for my featured movies section

"https://api.themoviedb.org/3/movie/popular";

window.onload = () => {
	getOriginals();
	getTrendingNow();
	getTopRated();
};

async function fetchMovies(url, dom_element, path_type) {
	const response = await fetch(url);
	try {
		if (!response.ok) {
			throw new Error("An error occurred fetching the data");
		} else {
			const data = await response.json();
			showMovies(data, dom_element, path_type);
		}
	} catch (error) {
		console.error(error);
	}
}

//  ** Function that displays the movies to the DOM **
showMovies = (movies, dom_element, path_type) => {
	let moviesEl = document.querySelector(dom_element);

	for (let movie of movies.results) {
		let imgElement = document.createElement("img");

		imgElement.setAttribute("data-id", movie.id);
		imgElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;

		imgElement.addEventListener("click", (e) => {
			handleMovieSelection(e);
		});

		moviesEl.append(imgElement);
	}
};

// ** Function that fetches Netflix Originals **
function getOriginals() {
	const url =
		"https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";

	fetchMovies(url, ".original__movies", "poster_path");
}
// ** Function that fetches Trending Movies **
function getTrendingNow() {
	const url =
		"https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045";
	fetchMovies(url, "#trending", "backdrop_path");
}
// ** Function that fetches Top Rated Movies **
function getTopRated() {
	const url =
		"https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1";
	fetchMovies(url, "#top_rated", "backdrop_path");
}

// ** BONUS **

// ** Fetches URL provided and returns response.json()
async function getMovieTrailer(id) {
	const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;

	const response = await fetch(url);
	try {
		if (!response.ok) {
			throw new Error("An error occurred fetching the data");
		} else {
			const data = await response.json();
			return data;
		}
	} catch (error) {
		console.error(error);
	}
}

// ** Function that adds movie data to the DOM
const setTrailer = (trailers) => {
	// Set up iframe variable to hold id of the movieTrailer Element

	const iframe = document.getElementById("movieTrailer");
	// Set up variable to select .movieNotFound element
	const movieNotFound = document.querySelector(".movieNotFound");

	// If there is a trailer add the src for it
	if (trailers.length > 0) {
		// add d-none class to movieNotFound and remove it from iframe
		movieNotFound.classList.add("d-none");
		iframe.classList.remove("d-none");
		// add youtube link with trailers key to iframe.src

		iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`;
	} else {
		// Else remove d-none class to movieNotfound and ADD it to iframe

		movieNotFound.classList.remove("d-none");
		iframe.classList.add("d-none");
	}
};

const handleMovieSelection = (e) => {
	const id = e.target.getAttribute("data-id");

	getMovieTrailer(id).then((data) => {
		const results = data.results;
		const youTubeTrailers = results.filter((result) => {
			if (result.site === "YouTube" && result.type === "Trailer") {
				return true;
			} else {
				return false;
			}
		});
		setTrailer(youTubeTrailers);
	});

	$("#trailerModal").modal("show");
};
