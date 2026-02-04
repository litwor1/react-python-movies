import {useState} from "react";

export default function MovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [actors, setActors] = useState('');

    function addMovie(event) {
        event.preventDefault();
        if (title.length < 5) {
            return alert('Tytuł jest za krótki');
        }
        // Convert comma-separated actors string to array
        const actorsArray = actors.split(',').map(a => a.trim()).filter(a => a);
        props.onMovieSubmit({title, year, actors: actorsArray});
        setTitle('');
        setYear('');
        setActors('');
    }

    return <form onSubmit={addMovie}>
        <h2>Add movie</h2>
        <div>
            <label>Tytuł</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
            <label>Year</label>
            <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
        </div>
        <div>
            <label>Actors (comma separated)</label>
            <input type="text" value={actors} onChange={(event) => setActors(event.target.value)}/>
        </div>
        <div>
            <button type="submit">{props.buttonLabel || 'Submit'}</button>
            {props.onCancel && <button type="button" onClick={props.onCancel}>Cancel</button>}
        </div>
    </form>;
}
