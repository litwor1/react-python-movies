import {useState, useEffect} from "react";
import {useTransition, animated} from "@react-spring/web";

export default function MovieListItem(props) {
    const [isEditingActors, setIsEditingActors] = useState(false);
    const [actorsList, setActorsList] = useState(Array.isArray(props.movie.actors) ? [...props.movie.actors] : []);
    const [newActorInput, setNewActorInput] = useState('');

    // Reset actors list when movie prop changes
    useEffect(() => {
        setActorsList(Array.isArray(props.movie.actors) ? [...props.movie.actors] : []);
        setIsEditingActors(false);
    }, [props.movie.id]);

    const transitions = useTransition(isEditingActors, {
        from: { opacity: 0, transform: 'translate3d(0, -10px, 0)' },
        enter: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
        leave: { opacity: 0, transform: 'translate3d(0, -10px, 0)' },
        config: { duration: 300 }
    });


    function handleAddActor() {
        if (newActorInput.trim()) {
            setActorsList([...actorsList, newActorInput.trim()]);
            setNewActorInput('');
        }
    }

    function handleRemoveActor(index) {
        setActorsList(actorsList.filter((_, i) => i !== index));
    }

    function handleSaveActors() {
        props.onUpdateActors({...props.movie, actors: actorsList});
        setIsEditingActors(false);
    }

    function handleCancel() {
        setActorsList(Array.isArray(props.movie.actors) ? [...props.movie.actors] : []);
        setNewActorInput('');
        setIsEditingActors(false);
    }

    return (
        <div>
            <h5>{props.movie.title} ({props.movie.year})</h5>

            {!isEditingActors && (
                <div className="movie-actions">
                    <button onClick={() => setIsEditingActors(true)}>Edit Actors</button>
                    <button onClick={props.onDelete} className="delete">Delete</button>
                </div>
            )}

            {transitions((style, item) =>
                item ? (
                    <animated.div style={style} className="edit-actors-panel">
                        <h5>Edit Actors</h5>

                        <div>
                            <input
                                type="text"
                                value={newActorInput}
                                onChange={(e) => setNewActorInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddActor();
                                    }
                                }}
                                placeholder="Enter actor name"
                            />
                            <button onClick={handleAddActor}>Add</button>
                        </div>

                        <div>
                            {actorsList.length > 0 ? (
                                <ul>
                                    {actorsList.map((actor, index) => (
                                        <li key={index}>
                                            <span>{actor}</span>
                                            <button onClick={() => handleRemoveActor(index)}>Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No actors</p>
                            )}
                        </div>

                        <div>
                            <button onClick={handleSaveActors}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </animated.div>
                ) : null
            )}

            {Array.isArray(props.movie.actors) && props.movie.actors.length > 0 && (
                <div className="actors-list">
                    <strong>Actors:</strong>
                    <ul>
                        {props.movie.actors.map((actor, index) => (
                            <li key={index}>{actor}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
