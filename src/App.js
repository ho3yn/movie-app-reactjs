import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { ConstructionOutlined } from "@mui/icons-material";
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

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState(Array);
  const [watched, setWatched] = useState(tempWatchedData);
  const [openmovie, setopenmovie] = useState("");
  const [moviedatabyid, setmoviedatabyid] = useState("");
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  const KEY = "f84fc31d";
  //console.log(openmovie);

  useEffect(() => {
    async function loger() {
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        const data = await res.json();
        if (data.Response === "True") {
          setMovies(data.Search);
        }

        //console.log(data);
      } catch (e) {
        console.log(`error :  ${e.message}`);
      }
    }
    if (query.length > 2) {
      loger();
    }
  }, [query]);

  useEffect(() => {
    async function getmoviebyid() {
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${openmovie}`
        );
        const data = await res.json();
        //console.log(data);

        setmoviedatabyid(data);
      } catch (error) {
        console.log(`getmoviebyid error = ${error}`);
      }
    }
    if (openmovie.length > 0) {
      getmoviebyid();
    }
  }, [openmovie]);

  return (
    <>
      <Navbar
        query={query}
        onchange={(v) => {
          setQuery(v.target.value);
          //console.log(query);
        }}
        movies={movies}
      />
      <Main>
        <Boxm>
          <Movielist movies={movies} onclick={(e) => setopenmovie(e)} />
        </Boxm>

        <Boxm>
          {openmovie.length > 0 ? (
            <Openmovie
              key={moviedatabyid.imdbID}
              watched={watched}
              moviedatabyid={moviedatabyid}
              closemovie={() => setopenmovie("")}
              Addtolisfunc={(e) => {
                console.log(e);
                setWatched((watched) => [...watched, e]);
              }}
            />
          ) : (
            <>
              {" "}
              <Summary
                watched={watched}
                avgImdbRating={avgImdbRating}
                avgUserRating={avgUserRating}
                avgRuntime={avgRuntime}
              />
              <Watchedmovies
                watched={watched}
                deletfromlist={(id) =>
                  setWatched((watched) =>
                    watched.filter((movie) => movie.imdbID !== id)
                  )
                }
              />
            </>
          )}
        </Boxm>
      </Main>
    </>
  );
}

function Navbar({ query, onchange, movies }) {
  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => onchange(e)}
      />
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </nav>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Boxm({ children }) {
  const [openbox, setopenbox] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setopenbox((e) => !e)}>
        {openbox ? "–" : "+"}
      </button>
      {openbox && children}
    </div>
  );
}

function Movielist({ movies, onclick }) {
  //console.log(`movies obj ${movies.length}`);
  //console.log(movies.length);
  return movies.length ? (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} onclick={onclick} key={movie.imdbID} />
      ))}
    </ul>
  ) : (
    //<p>not movie yet</p>
    <Loader />
  );
}

function Movie({ movie, onclick }) {
  return (
    <li onClick={() => onclick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Summary({ watched, avgImdbRating, avgUserRating, avgRuntime }) {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}

function Watchedmovies({ watched, deletfromlist }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => deletfromlist(movie.imdbID)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
function Thisisempty() {
  return <p className="loader">Thisisempty...</p>;
}

function Openmovie({ watched, moviedatabyid, closemovie, Addtolisfunc }) {
  const [rate, setrate] = useState(0);
  let iswatched = false;
  let currate = false;
  watched.map((e) => {
    if (e.imdbID === moviedatabyid.imdbID) {
      //console.log(`movie id ===> ${e.imdbID}`);
      iswatched = true;
      currate = e.userRating;
    }
    //console.log(iswatched);
  });
  console.log(moviedatabyid);
  let datatoadd = {};

  function datamaker() {
    if (moviedatabyid) {
      //console.log(moviedatabyid);
      datatoadd = {
        imdbID: moviedatabyid.imdbID,
        Title: moviedatabyid.Title,
        Year: moviedatabyid.Year,
        Poster: moviedatabyid.Poster,
        //runtime: Number(moviedatabyid.Runtime.split(" ").at(0)),
        imdbRating: Number(moviedatabyid.imdbRating),
        userRating: rate,
      };
    }
  }
  datamaker();

  return (
    <div className="details">
      <button className="btn-back" onClick={closemovie}>
        ←
      </button>
      <header className="openmovieheader">
        <img src={moviedatabyid.Poster} alt="Poster of movie"></img>
        <div className="details-overview">
          <h2>{moviedatabyid.Title}</h2>
          <p>{moviedatabyid.Released}</p>
          <p>{moviedatabyid.Runtime}</p>
          <p>{moviedatabyid.Genre}</p>
          <p>
            <span>⭐️</span>
            {moviedatabyid.imdbRating} IMDB rating
          </p>
        </div>
      </header>

      <section>
        {iswatched ? (
          <div className="rating">
            <p>
              You rated with movie {currate} <span>⭐️</span>
            </p>
          </div>
        ) : (
          <div className="rating">
            <Rating
              name="large-rating"
              value={rate || 0}
              size="large"
              max={10}
              key={moviedatabyid.imdbID}
              onChange={(e, v) => setrate(v)}
              sx={{
                "& .MuiRating-icon": {
                  fontSize: "3rem",
                },
              }}
            />
            {rate ? (
              <Addtolistbtn
                Addtolisfunc={() => {
                  Addtolisfunc(datatoadd);
                  closemovie();
                }}
              />
            ) : (
              ""
            )}
          </div>
        )}

        <p>
          <em>{moviedatabyid.Plot}</em>
        </p>
        <p>{moviedatabyid.Actors}</p>
        <p>{moviedatabyid.Director}</p>
      </section>
    </div>
  );
}

function Addtolistbtn({ Addtolisfunc }) {
  return (
    <button className="btn-add" onClick={Addtolisfunc}>
      + Add to list
    </button>
  );
}
