import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <h1>Dj Afro Movies in HD</h1>
      <p>Browse featured movies and stream from the comfort of your home.</p>
      <Link to="/movies">Browse movies</Link>
    </main>
  );
}

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    genre: '',
    releaseYear: '',
    video: null,
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setUploadForm(prev => ({
      ...prev,
      video: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('thumbnailUrl', uploadForm.thumbnailUrl);
    formData.append('genre', uploadForm.genre);
    formData.append('releaseYear', uploadForm.releaseYear);
    formData.append('video', uploadForm.video);

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Movie uploaded successfully!');
        setUploadForm({
          title: '',
          description: '',
          thumbnailUrl: '',
          genre: '',
          releaseYear: '',
          video: null,
        });
        fetchMovies(); // Refresh the movie list
      } else {
        alert('Failed to upload movie');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading movie');
    }
  };

  if (loading) {
    return <main><p>Loading movies...</p></main>;
  }

  return (
    <main>
      <h1>Movies</h1>

      {/* Upload Form */}
      <section className="upload-section">
        <h2>Upload New Movie</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={uploadForm.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={uploadForm.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="thumbnailUrl">Thumbnail URL:</label>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={uploadForm.thumbnailUrl}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="genre">Genre:</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={uploadForm.genre}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="releaseYear">Release Year:</label>
            <input
              type="number"
              id="releaseYear"
              name="releaseYear"
              value={uploadForm.releaseYear}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="video">Video File:</label>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit">Upload Movie</button>
        </form>
      </section>

      {/* Movies List */}
      <section className="movies-list">
        <h2>Available Movies</h2>
        {movies.length === 0 ? (
          <p>No movies available yet.</p>
        ) : (
          <div className="movies-grid">
            {movies.map(movie => (
              <div key={movie._id} className="movie-card">
                <img src={movie.thumbnailUrl} alt={movie.title} />
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
                {movie.genre && <p>Genre: {movie.genre}</p>}
                {movie.releaseYear && <p>Year: {movie.releaseYear}</p>}
                <video controls poster={movie.thumbnailUrl} style={{ width: '100%', maxWidth: '300px' }}>
                  <source src={movie.streamUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </div>
  );
}

export default App;
