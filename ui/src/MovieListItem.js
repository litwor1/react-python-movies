export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                <a onClick={props.onDelete}>Delete</a>
            </div>
            {props.movie.actors ? <div><em>Actors:</em> {props.movie.actors}</div> : null}
        </div>
    );
}
