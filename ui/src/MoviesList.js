import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div>
        <div className="movies-header-decoration">🎬</div>
        <h2>Movies</h2>
        <ul className="movies-list">
            {props.movies.map(movie => <li key={movie.id}>
                <MovieListItem movie={movie} onDelete={() => props.onDeleteMovie(movie)} onUpdateActors={props.onUpdateActors}/>
            </li>)}
        </ul>
    </div>;
}
