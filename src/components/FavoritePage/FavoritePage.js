import React, { Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { mapper } from 'mapper';
import EmptyState from '../view-states/EmptyState';
import { getFavoriteMovies } from '../../data/ApiEndpoint';
import './FavoritePage.css';

const FavoritePage = () => {
  const [favoriteIds, setFavoriteIds] = useLocalStorage('favorites', []);
  const [movies, setMovies] = useState([]);
  const [movieId, setMoviesId] = useState(0);
  const [navigateToInfo, setNavigateToInfo] = useState(false);

  useEffect(() => {
    getFavoriteMovies(favoriteIds, (response) => {
      setMovies(response);
    });
  }, []);

  const removeMovie = (id) => {
    if (favoriteIds) {
      if (favoriteIds.includes(id)) {
        const idIndex = favoriteIds.indexOf(id);
        favoriteIds.splice(idIndex, 1);
        setFavoriteIds(favoriteIds);
        const newMovies = [...movies];
        const movieIndex = newMovies.findIndex(movie => movie.id === id);
        newMovies.splice(movieIndex, 1);
        setMovies(newMovies);
      }
    }
  };

  if (navigateToInfo) {
    return <Redirect push to={{ pathname: `${process.env.PUBLIC_URL}/info`, state: movieId }} />;
  }

  if (!movies.length) {
    return <EmptyState message="No favorites saved" />;
  }

  const navigateTodetails = (id) => {
    setMoviesId(id);
    setNavigateToInfo(true);
  };

  return (
    <Fragment>
      <div className="container h-100">
        <div className="row">
          {movies.map(movie => (
            <div key={movie.id} className="iconName col-6 col-sm-4 col-md-3 col-lg-3  favorite-item p-0 ">
              <img
                className="w-100 h-100"
                src={mapper.buildImageUrl(movie.poster_path)}
                alt="Movie poster"
                onClick={() => navigateTodetails(movie.id)}
              />
              <div className="icon-favorite" onClick={() => removeMovie(movie.id)}>
                <i className="icon-heart-fill" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default FavoritePage;
