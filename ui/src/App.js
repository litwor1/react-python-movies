import './App.css';
import {useState, useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);

    const fetchMovies = async () => {
        try {
            const response = await fetch(`/movies`);
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            } else {
                console.error('Failed to fetch movies', response.status);
            }
        } catch (err) {
            console.error('Error fetching movies', err);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    async function handleAddMovie(movie) {
        // Ensure actors is an array
        if (!Array.isArray(movie.actors)) {
            movie.actors = [];
        }
        try {
            const response = await fetch('/movies', {
                method: 'POST',
                body: JSON.stringify(movie),
                headers: {'Content-Type': 'application/json'}
            });
            if (response.ok) {
                await fetchMovies();
                setAddingMovie(false);
            } else {
                console.error('Failed to add movie', response.status);
            }
        } catch (err) {
            console.error('Error adding movie', err);
        }
    }

    async function handleDeleteMovie(movie) {
        try {
            const response = await fetch(`/movies/${movie.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const nextMovies = movies.filter(m => m.id !== movie.id);
                setMovies(nextMovies);
            } else {
                console.error('Failed to delete movie', response.status);
            }
        } catch (err) {
            console.error('Error deleting movie', err);
        }
    }

    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>

            {addingMovie ? (
                <MovieForm onMovieSubmit={handleAddMovie} buttonLabel="Add a movie"/>
            ) : (
                <button onClick={() => setAddingMovie(true)}>Add a movie</button>
            )}

            {movies.length === 0 ? (
                <p>No movies yet. Maybe add something?</p>
            ) : (
                <MoviesList movies={movies} onDeleteMovie={handleDeleteMovie}/>
            )}
        </div>
    );
}

export default App;
