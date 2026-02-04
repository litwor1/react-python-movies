from fastapi import FastAPI, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any, List
import sqlite3


class Actor(BaseModel):
    id: int = None
    name: str
    movie_id: int = None


class Movie(BaseModel):
    title: str
    year: str
    actors: List[str] = []  # list of actor names


app = FastAPI()

app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")


@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get('/movies')
def get_movies():
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute('SELECT id, title, year FROM movies')
    movies_data = cursor.fetchall()

    output = []
    for movie_id, title, year in movies_data:
        # Get actors for this movie
        cursor.execute('SELECT name FROM actors WHERE movie_id = ?', (movie_id,))
        actors = [row[0] for row in cursor.fetchall()]

        movie = {'id': movie_id, 'title': title, 'year': year, 'actors': actors}
        output.append(movie)

    db.close()
    return output


@app.get('/movies/{movie_id}')
def get_single_movie(movie_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute('SELECT id, title, year FROM movies WHERE id = ?', (movie_id,))
    movie_data = cursor.fetchone()

    if movie_data is None:
        db.close()
        return {'message': "Movie not found"}

    # Get actors for this movie
    cursor.execute('SELECT name FROM actors WHERE movie_id = ?', (movie_id,))
    actors = [row[0] for row in cursor.fetchall()]

    db.close()
    return {'id': movie_data[0], 'title': movie_data[1], 'year': movie_data[2], 'actors': actors}


@app.post("/movies")
def add_movie(movie: Movie):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()

    # Insert the movie
    cursor.execute(
        "INSERT INTO movies (title, year) VALUES (?, ?)",
        (movie.title, movie.year)
    )
    movie_id = cursor.lastrowid

    # Insert each actor
    if movie.actors:
        for actor_name in movie.actors:
            if actor_name.strip():  # Only insert non-empty actor names
                cursor.execute(
                    "INSERT INTO actors (name, movie_id) VALUES (?, ?)",
                    (actor_name.strip(), movie_id)
                )

    db.commit()
    db.close()
    return {"message": f"Movie with id = {movie_id} added successfully", "id": movie_id}


@app.put("/movies/{movie_id}")
def update_movie(movie_id: int, params: dict[str, Any]):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()

    # Update movie title and year
    cursor.execute(
        "UPDATE movies SET title = ?, year = ? WHERE id = ?",
        (params.get('title'), params.get('year'), movie_id)
    )

    if cursor.rowcount == 0:
        db.close()
        return {"message": f"Movie with id = {movie_id} not found"}

    # Handle actors if provided
    if 'actors' in params:
        # Delete old actors for this movie
        cursor.execute("DELETE FROM actors WHERE movie_id = ?", (movie_id,))

        # Insert new actors
        actors = params['actors']
        if isinstance(actors, str):
            # If actors is a string (comma-separated), split it
            actors = [a.strip() for a in actors.split(',') if a.strip()]
        elif not isinstance(actors, list):
            actors = []

        for actor_name in actors:
            if actor_name.strip():
                cursor.execute(
                    "INSERT INTO actors (name, movie_id) VALUES (?, ?)",
                    (actor_name.strip(), movie_id)
                )

    db.commit()
    db.close()
    return {"message": f"Movie with id = {movie_id} updated successfully"}


@app.delete("/movies/{movie_id}")
def delete_movie(movie_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
    db.commit()
    deleted = cursor.rowcount
    db.close()

    if deleted == 0:
        return {"message": f"Movie with id = {movie_id} not found"}
    return {"message": f"Movie with id = {movie_id} deleted successfully"}


@app.delete("/movies")
def delete_movies(movie_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM movies")
    db.commit()
    deleted = cursor.rowcount
    db.close()
    return {"message": f"Deleted {deleted} movies"}

# if __name__ == '__main__':
#     app.run()
