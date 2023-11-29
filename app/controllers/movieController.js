const db = require("../models");
const Movie = db.movie;
const Order = db.order;
const sequelize = db.sequelize;
const { Op } = require('sequelize');

// Controller actions for movie
exports.getAllMovies = async (req, res) => {
  try {
    const { genre_id, language_id } = req.query;
    
    const whereClause = {};
    
    // Check if genre_id is provided and not null
    if (genre_id !== undefined && genre_id !== null) {
      whereClause.genre_id = genre_id;
    }

    // Check if language_id is provided and not null
    if (language_id !== undefined && language_id !== null) {
      whereClause.language_id = language_id;
    }

    const movies = await Movie.findAll({
      where: whereClause, // Apply filtering based on query parameters
    });

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.createMovie = async (req, res) => {
  const { title, description, releaseDate, runtime, imageUrl, genre_id, language_id, duration } = req.body;

  try {
    // Create a new movie using the Movie model
    const movie = await Movie.create({
      title,
      description,
      releaseDate,
      runtime,
      imageUrl,
      genre_id,
      language_id,
      duration
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMovieById = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, description, releaseDate, imageUrl, genre_id, language_id,duration } = req.body;

  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Update the movie's attributes
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.releaseDate = releaseDate || movie.releaseDate;
    movie.duration = duration || movie.duration;
    movie.imageUrl = imageUrl || movie.imageUrl;
    movie.genre_id = genre_id || movie.genre_id;
    movie.language_id = language_id || movie.language_id;

    // Save the updated movie to the database
    await movie.save();

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteMovie = async (req, res) => {
  const {id} = req.params;

  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await movie.destroy();
    return res.status(200).json({ message: 'Movie is Deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRecommendedMovies = async (req, res) => {
  try {
    const { userId } = req.query; // Use optional chaining to safely access user ID

    const userOrders = userId
      ? await Order.findAll({
          where: {
            user_id: userId,
          },
          include: [Movie],
        })
      : [];

    let recommendedMovies = [];

    if (userOrders.length > 0) {
      const orderedMovieIds = userOrders.flatMap((order) =>
        order.Movies.map((movie) => movie.id)
      );

      // Get unique language_ids and genre_ids from associated movies
      const uniqueLanguageIds = [...new Set(userOrders.flatMap((order) => order.Movies.map((movie) => movie.language_id)))];
      const uniqueGenreIds = [...new Set(userOrders.flatMap((order) => order.Movies.map((movie) => movie.genre_id)))];

      // Retrieve recommended movies based on user orders' language_id or genre_id
      recommendedMovies = await Movie.findAll({
        where: {
          [Op.or]: [
            { language_id: uniqueLanguageIds },
            { genre_id: uniqueGenreIds },
          ],
          id: {
            [Op.notIn]: orderedMovieIds,
          },
        },
        order: sequelize.random(),
        limit: 5, // Adjust the number of movies based on language_id or genre_id
      });
    }

    // Retrieve additional random movies
    const randomMovies = await Movie.findAll({
      order: sequelize.random(),
      limit: 10, // Adjust the number of random movies as needed
    });

    // Combine recommended movies and random movies
    recommendedMovies = recommendedMovies.concat(randomMovies);

    res.status(200).json(recommendedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
