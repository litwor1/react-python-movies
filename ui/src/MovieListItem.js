export default function MovieListItem(props) {
    const actorsDisplay = Array.isArray(props.movie.actors)
        ? props.movie.actors.join(', ')
        : props.movie.actors || '';

    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                <a onClick={props.onDelete}>Delete</a>
            </div>
            {actorsDisplay ? <div><em>Actors:</em> {actorsDisplay}</div> : null}
        </div>
    );
}
