import { useState, useEffect } from 'react'
import './App.css'

const tmdbKey = "e43cdb3c84faae3a25466e70e4e2d224";
const tmdbBaseUrl = "https://api.themoviedb.org/3";

function App() {

  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState([]);
  const [description, setDescription] = useState([]);

  const getGenres = async () => {

    const genreRequestEndpoint = "/genre/movie/list";
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;

    const response = await fetch(urlToFetch);
    const data = await response.json();
    setGenres(data.genres);
    console.log(data.genres);
  }

  useEffect(() => {
    getGenres();
    return () => {
      // cleanup
    };
  }, []);

  const getSelectedGenre = () => {
    const selectedGenre = document.getElementById('genres').value;
    return selectedGenre;
  }

  const getMovies = async () => {
    const selectedGenre = getSelectedGenre();
    const discoverMovieEndpoint = "/discover/movie";
    const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
    const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;

    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        console.log(movies);
        return movies;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMovie = async () => {
    const movies = await getMovies();
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    setDescription(randomMovie.overview);
    setTitle(randomMovie.title);

    return randomMovie;
  };


  const getPoster = async () => {
    const movie = await getMovie();
    const posterPath = movie.poster_path;
    const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
    setPoster(posterUrl);
  };

  
  const handleClick = () => {
    getMovie();
    getPoster();
  };

  return (
    <div className="App">
      <header>
        <h1>🍿Film Finder🍿</h1>
        <form id="form">
          <div className="form-group">
            <label>Choose a genre:</label>
            <br />
            <select name="genres" id="genres" onChange={getSelectedGenre}>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </form>
        <button type="submit" className="playBtn" onClick={handleClick}>Let's Play!</button>
      </header>

      <div className='movie-poster'>
        <img src={poster} alt="" />
        <div className='description'>
        <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default App
