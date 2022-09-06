const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const path = require("path");
const databasePath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let database = null;

const initializeDbServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};
initializeDbServer();

const convertDbObjToRespObj = (dbObject) => {
  return {
    movieId: database.movie_id,
    directorId: database.director_id,
    movieName: database.movie_name,
    leadActor: database.lead_actor,
    directorName: database.director_name,
  };
};

// Get of moviesLIST API

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `SELECT movie_name FROM movie;`;
  const moviesArray = await database.all(getMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => convertDbObjToRespObj(eachMovie))
  );
});

//create MOVIE API

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `INSERT INTO movie (directorId,movieName,leadActor) VALUES (${director_id},'${movie_name}','${lead_actor}');`;
  const movie = await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

//GET One/single Movie API

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `SELECT * FROM movie  WHERE movie_id=${movieId};`;
  const movie = await database.get(getMovieQuery);
  response.send(convertDbObjToRespObj(movie));
});

//Update Movie API

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updatedMovieQuery = `UPDATED movie SET director_id=${directorId}, movie_name='${movieName}',lead_actor='${leadActor}'
  WHERE movie_id=${movieId};`;
  await database.run(updatedMovieQuery);
  response.send("Movie Details Updated");
});
//Delete  Movie API

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `DELETE FROM movie WHERE movie_id=${movieId};`;
  await database.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//get DirectorsLIst API

app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `SELECT * FROM director;`;
  const directorsArray = await database.all(getDirectorsQuery);
  response.send(
    directorsArray.map((eachDirector) => convertDbObjToRespObj(eachDirector))
  );
});

//get Movies of Director API
app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorQuery = `SELECT movie_name as movieName FROM movie  WHERE director_Id=${DirectorId};`;
  const movie = await database.all(getDirectorQuery);
  response.send(convertDbObjToRespObj(movie));
});

module.exports = app;
