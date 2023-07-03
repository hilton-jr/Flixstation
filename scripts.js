let carousel = document.querySelector(".carousel")
let movieContainer = document.querySelector(".movie")
const API_KEY = 'api_key=b4b5f9d98442f11bbdd50a5adf70f1d1';
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const language = 'language=pt-BR';

let movies = []

/* rota de filmes
https://developer.themoviedb.org/reference/movie-videos

POPULARES => https://api.themoviedb.org/3/movie/popular?api_key=78233&language=pt-BR&page=1
Lançamentos => https://api.themoviedb.org/3/movie/upcoming?api_key=78233&language=pt-BR&page=1

series: 
POPULARES => https://api.themoviedb.org/3/tv/popular?api_key=78233&language=pt-BR&page=1
Lançamentos => https://api.themoviedb.org/3/tv/upcoming?api_key=78233&language=pt-BR&page=1

language e page são parametros de rotas opcionais

rotas de tv são a msm coisa com a diferença de ter tv no lugar de movie na rota

filmes retornam o nome deles na propriedade 

*/


async function getMovies() {
    for(let i = 1; i <= 4; i++) {
        let response = await fetch(`${BASE_URL}movie/popular?${API_KEY}&${language}&page=${i}`)
        let data = await response.json()

        movies.push(...data.results)
        console.log(movies)
        
    }

    /* console.log(movies) */
    carousel.innerHTML = ""

    movies.forEach(movie => {
        carousel.innerHTML += `<img onclick="getMovie(${movie.id})" src=${IMG_URL + movie.poster_path} alt="${movie.title} poster" />`
    }) 
}

async function getMovie(id) {
    let movie = movies.find((item) => id == item.id) 

    let responseMovie = await fetch(`${BASE_URL}movie/${id}?${API_KEY}&${language}`)
    movie = await responseMovie.json()

    let responseTrailer = await fetch(`${BASE_URL}movie/${id}/videos?${API_KEY}&${language}`)
    let trailer = await responseTrailer.json()

    console.log(trailer)

    movieContainer.innerHTML = `
    <div>
        <h2>${movie.title}</h2>
        <span class=${movie.vote_average >= 7 ? "good" : movie.vote_average >= 4 ? "average" : "bad"}>
            ${(movie.vote_average * 10).toFixed(0)}% gostaram 
        </span>
        <span>Gêneros: ${movie.genres.map(genre => ' ' + genre.name )}</span>
        <p>${movie.overview}</p>
    </div>


    ${trailer.results.length > 0 ? 
        `<iframe width="560" height="315" autoplay src="https://www.youtube.com/embed/${trailer.results[0].key}" title="YouTube video player" allow="fullscreen" frameborder="0"></iframe>` 
        : 
        `<img src=${IMG_URL + movie.backdrop_path} alt="${movie.title} poster" />`
    }
    `
}

getMovies()


function goLeft() {
    carousel.scrollLeft -= carousel.offsetWidth
}

function goRight() {
    carousel.scrollLeft += carousel.offsetWidth
    console.log(carousel.scrollLeft, carousel.offsetWidth)
}

setInterval(() => {
     if(carousel.scrollLeft + 2000 > carousel.scrollWidth) {
        carousel.scrollLeft = 0
        return
     } 
     
     goRight()
}
, 5000)