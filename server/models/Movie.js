import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    poster: String,
    genres: [String],
    plot: String
});

export default mongoose.model('Movies', movieSchema, 'movies');