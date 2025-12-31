import { useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export default function App() {
  return (
    <>
      <Navbar />
      <Main />
    </>
  );
}

function Navbar() {
  return (
    <div className="nav-bar">
      <Logo />
      <SearchBox />
      <NumResults />
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBox() {
  return (
    <input className="search" type="text" placeholder="Search movies..." />
  );
}

function NumResults() {
  return (
    <div className="num-results">
      <p>Found 0 results</p>
    </div>
  );
}

function Main() {
  return (
    <main className="main">
      <Box>
        <MovieList movies={tempMovieData} />
      </Box>
      <Box>
        <WatchedList watched={tempWatchedData} />
      </Box>
    </main>
  );
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function MovieList({ movies }) {
  return (
    <div className="list">
      <ul className="list-movies">
        {movies.map((movie) => (
          <Movie movie={movie} key={movie.imdbID} />
        ))}
      </ul>
    </div>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={movie.imdbID} />
      <h3>{movie.Title}</h3>
      <div>
        <p>🗓 {movie.Year}</p>
      </div>
    </li>
  );
}

function WatchedList({ watched }) {
  return (
    <div className="list">
      <ul className="list-watched">
        {watched.map((watch) => (
          <Watch watch={watch} />
        ))}
      </ul>
    </div>
  );
}

function Watch({ watch }) {
  return (
    <li>
      <img src={watch.Poster} alt={watch.imdbID} />
      <h3>{watch.Title}</h3>
      <div>
        <p>🗓 {watch.Year}</p>
      </div>
    </li>
  );
}
