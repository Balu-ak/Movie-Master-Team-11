from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import random
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://bala:123456@localhost/movie_master'  # Replace with your actual database URI
db = SQLAlchemy(app)

class Order(db.Model):
    __tablename__ = 'Orders'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    totalCost = db.Column(db.Float, nullable=False)
    ordered_date = db.Column(db.String(255), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=True)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))

class User(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstName = db.Column(db.String(255), nullable=False)
    lastName = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    dob = db.Column(db.String(255), nullable=True)
    password = db.Column(db.BLOB, nullable=False)
    salt = db.Column(db.BLOB, nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Movie(db.Model):
    __tablename__ = 'Movies'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    releaseDate = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.Integer, nullable=True)
    imageUrl = db.Column(db.String(255), nullable=True)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    genre_id = db.Column(db.Integer, db.ForeignKey('Genres.id'), nullable=True)
    language_id = db.Column(db.Integer, db.ForeignKey('Languages.id'), nullable=True)
    cost = db.Column(db.Float, nullable=True)

    genre = db.relationship('Genre', backref=db.backref('movies', lazy=True))
    language = db.relationship('Language', backref=db.backref('movies', lazy=True))

class Genre(db.Model):
    __tablename__ = 'Genres'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

class Language(db.Model):
    __tablename__ = 'Languages'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

class OrderMovie(db.Model):
    __tablename__ = 'OrderMovies'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    OrderId = db.Column(db.Integer, db.ForeignKey('Orders.id'), nullable=True)
    MovieId = db.Column(db.Integer, db.ForeignKey('Movies.id'), nullable=True)

    order = db.relationship('Order', backref=db.backref('order_movies', lazy=True))
    movie = db.relationship('Movie', backref=db.backref('order_movies', lazy=True))


def display_tfidf_vectors(tfidf_matrix, feature_names,user_orders):
    for idx, vector in enumerate(tfidf_matrix):
        print(f"Movie ID: {user_orders[idx][0]}")
        print(f"Movie Title: {user_orders[idx][1]}")
        print("TF-IDF Vector:")
        for term_idx, value in zip(vector.indices, vector.data):
            print(f"   {feature_names[term_idx]}: {value}")
        print("\n")


def get_movie_recommendations(user_id=None):
    # Fetch the user's orders if user_id is provided
    if user_id:
        user_orders = db.session.query(OrderMovie.MovieId, Movie.title, Movie.description, Movie.imageUrl).join(Movie).join(Order).filter(Order.user_id == user_id).all()
    else:
        user_orders = db.session.query(Movie.id, Movie.title, Movie.description, Movie.imageUrl).all()

    # Create a TF-IDF vectorizer
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')

    # Combine movie titles and descriptions into a single text for TF-IDF
    movie_descriptions = [f"{movie.title} {movie.description}" for movie in user_orders]

    # Calculate TF-IDF matrix
    tfidf_matrix = tfidf_vectorizer.fit_transform(movie_descriptions)
    feature_names = tfidf_vectorizer.get_feature_names_out()
    display_tfidf_vectors(tfidf_matrix, feature_names,user_orders)
    # Calculate cosine similarity between movies
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Get movie indices
    movie_indices = {movie[0]: idx for idx, movie in enumerate(user_orders)}

    # Get movie recommendations
    recommended_movies = []
    idx = movie_indices.get(user_orders[-1][0]) if user_orders else None  # Choose the last ordered movie for demonstration
    if idx is not None:
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6]  # Top 5 recommendations
        print(user_orders)
        for movie_idx, score in sim_scores:
            recommended_movies.append({'id':user_orders[movie_idx][0],'title': user_orders[movie_idx][1], 'description': user_orders[movie_idx][2], 'imageUrl':user_orders[movie_idx][3]})

    return recommended_movies


# Endpoint to get movie recommendations with or without a user ID
@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    user_id = request.args.get('user_id', None, type=int)
    recommendations = get_movie_recommendations(user_id)

    # If no user ID is provided, give random recommendations
    if not user_id:
        random_movies = db.session.query(Movie).order_by(db.func.rand()).limit(20).all()
        recommendations.extend({
                                        'title': movie.title,
                                        'description': movie.description,
                                        'id': movie.id,
                                        'imageUrl': movie.imageUrl
                                        
                                } for movie in random_movies)

    # Ensure the recommendations are unique
    recommendations = [dict(t) for t in {tuple(d.items()) for d in recommendations}]

    # If the number of recommendations is less than 10, fill the remaining slots with additional random movies
    while len(recommendations) < 10:
        random_movie = random.choice(db.session.query(Movie).order_by(db.func.rand()).limit(1).all())
        recommendations.append({'title': random_movie.title, 'description': random_movie.description,'id': random_movie.id, 'imageUrl': random_movie.imageUrl})

    return jsonify({'user_id': user_id, 'recommendations': recommendations[:20]})


if __name__ == '__main__':
    app.run(debug=True)
