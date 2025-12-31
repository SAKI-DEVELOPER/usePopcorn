import { useState, useEffect } from "react";
import StarRating from "./StartRating";

const key = "ff03112d";

// The App Component
export default function App() {
  const [fetchedMovies, setFetchedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [userRating, setUserRating] = useState("");

  const sumImdbRating = watchedMovies.reduce(
    (prev, curr) => prev + curr.imdbRating,
    0
  );

  const sumUserRating = watchedMovies.reduce(
    (prev, curr) => prev + curr.userRating,
    0
  );

  const sumRunTime = watchedMovies.reduce(
    (prev, curr) => prev + curr.runtime,
    0
  );

  function handleSelectedMovie(id) {
    id === selectedId ? setSelectedId(null) : setSelectedId(id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function addWatched(newMovie) {
    const watchedIds = watchedMovies.map((m) => m.imdbID);
    watchedIds.includes(newMovie.imdbID)
      ? setWatchedMovies([...watchedMovies])
      : setWatchedMovies([
          ...watchedMovies,
          { ...newMovie, userRating: userRating },
        ]);

    setSelectedId(null);
    setUserRating("");
  }

  function removeWatchedList(id) {
    setWatchedMovies(watchedMovies.filter((w) => id !== w.imdbID && [w]));
  }

  function onRateIt(rate) {
    setUserRating(rate);
  }

  useEffect(
    function () {
      async function retrieveMovie() {
        try {
          setError("");
          setFetchedMovies([]);
          if (query.length < 3) {
            return;
          }
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`
          );
          if (!res.ok) {
            setIsLoading(false);
            throw new Error("Something is wrong");
          }

          const data = await res.json();
          setIsLoading(false);
          if (data.Response === "False") {
            setError(data.Error);
            return;
          }
          setFetchedMovies(data.Search);
        } catch (err) {
          //console.error(err);
        } finally {
        }
      }
      retrieveMovie();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <SearchBox query={query} setQuery={setQuery} />
        <NumResults nums={fetchedMovies} isLoading={isLoading} />
      </Navbar>
      <Main>
        <Box>
          <MovieList
            movies={fetchedMovies}
            isLoading={isLoading}
            error={error}
            onSelectedMovie={handleSelectedMovie}
          />
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              addWatched={addWatched}
              watched={watchedMovies}
              userRating={userRating}
            >
              <StarRating maxRating={10} size={24} onRateIt={onRateIt} />
            </MovieDetails>
          ) : (
            <>
              <WatchedSummary
                watched={watchedMovies}
                sumImdbRating={sumImdbRating}
                sumUserRating={sumUserRating}
                sumRunTime={sumRunTime}
              />
              <WatchedList
                watched={watchedMovies}
                removeWatchedList={removeWatchedList}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return <div className="nav-bar">{children}</div>;
}

function Logo() {
  return (
    <div className="logo">
      <span>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBox({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ nums, isLoading }) {
  return (
    <div className="num-results">
      <p>Found {isLoading ? "Loading" : nums ? nums.length : 0} results</p>
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsopen] = useState(true);

  function open(status) {
    setIsopen(!status);
  }
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => open(isOpen)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen ? children : ""}
    </div>
  );
}

function MovieList({ movies, isLoading, error, onSelectedMovie }) {
  return (
    <div className="list">
      <ul className="list list-movies">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Error error={error} />
        ) : (
          movies &&
          movies.map((movie) => (
            <Movie
              movie={movie}
              key={movie.imdbID}
              onSelectedMovie={onSelectedMovie}
            />
          ))
        )}
      </ul>
    </div>
  );
}

function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.imdbID} />
      <h3>{movie.Title}</h3>
      <div>
        <p>🗓 {movie.Year}</p>
      </div>
    </li>
  );
}

function WatchedList({ watched, removeWatchedList }) {
  return (
    <div className="list">
      <ul className="list-watched">
        {watched.map((watch) => (
          <Watch
            watch={watch}
            key={watch.imdbID}
            removeWatchedList={removeWatchedList}
          />
        ))}
      </ul>
    </div>
  );
}

function Watch({ watch, removeWatchedList }) {
  return (
    <li>
      <img src={watch.poster} alt={watch.imdbID} />
      <h3>{watch.title}</h3>
      <div>
        <p>
          <span>⭐</span>
          <span>{watch.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{watch.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{watch.runtime}</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => removeWatchedList(watch.imdbID)}
      >
        X
      </button>
    </li>
  );
}

function Loader() {
  return (
    <li>
      <h1>Loading...</h1>
    </li>
  );
}

function Error({ error }) {
  return (
    <p className="error">
      <span>⛔️</span> {error}
    </p>
  );
}

function WatchedSummary({ watched, sumImdbRating, sumUserRating, sumRunTime }) {
  const totalimdbRating = (sumImdbRating / watched.length).toFixed(2);
  const totalUserRating = (sumUserRating / watched.length).toFixed(2);
  const totalRunTime = (sumRunTime / watched.length).toFixed(1);

  return (
    <div className="summary">
      <h2>MOVIES YOU WATCHED</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐</span>
          <span>{watched.length ? totalimdbRating : 0.0}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{watched.length ? totalUserRating : 0.0}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{watched.length ? totalRunTime : 0} min</span>
        </p>
      </div>
    </div>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  addWatched,
  children,
  watched,
  userRating,
}) {
  const [movieDetail, setMovieDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [myRating, setMyRating] = useState(0);

  const ids = watched.map((m) => m.imdbID);
  const isWatched = ids.includes(selectedId);

  useEffect(
    function () {
      function getRatings() {
        watched.filter((w) =>
          w.imdbID === selectedId ? setMyRating(w.userRating) : ""
        );
      }
      getRatings();
    },
    [selectedId, watched]
  );

  const {
    Actors: actors,
    Runtime: runtime,
    Director: director,
    Genre: genre,
    Plot: plot,
    Poster: poster,
    Released: released,
    Title: title,
    imdbRating,
    Year: year,
  } = movieDetail;

  function onAddWatched() {
    const newWatchedMovie = {
      title: title,
      poster: poster,
      imdbID: selectedId,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      year: year,
    };

    addWatched(newWatchedMovie);
  }

  useEffect(
    function () {
      async function getMovieDetail(selectedId) {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        // console.log(data);
        setMovieDetail(data);
        setIsLoading(false);
      }
      getMovieDetail(selectedId);
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={movieDetail} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} • {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            {!isWatched ? (
              <>
                {" "}
                <div className="rating">
                  {children}
                  {userRating > 0 && (
                    <button className="btn-add" onClick={() => onAddWatched()}>
                      Add to the list
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="rating">
                  <p>You already rated this movie with {myRating} ⭐</p>
                </div>
              </>
            )}
            <p>{plot}</p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
