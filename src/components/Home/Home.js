import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom';
import { Carousel, SearchBar } from 'components';
import { search } from '../../data/ApiEndpoint';
import { loadFeaturedMovies } from '../../actions'

const Home = () => {
  const filter = {
    nowPlaying: 'now_playing',
    upcoming: 'upcoming',
    popular: 'popular'
  };

  // redux hooks
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.movies.featured);

  const [navigateToInfo, setNavigateToInfo] = useState(false);
  const [navigateToList, setsNavigateToList] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [active, setActive] = useState('BOX OFFICE');
  const [value, setValue] = useState('');
  const [chart, setChart] = useState(filter.nowPlaying);
  const [movieId, setMovieId] = useState(0);

  useEffect(() => {
    dispatch(loadFeaturedMovies(chart));
  }, [chart]);

  const handleSubmit = ({ key }) => {
    const ENTER_KEYCODE = 'Enter';
    if (key === ENTER_KEYCODE) {
      setsNavigateToList(true);
    }
  };

  const handleClick = (tab) => {
    let trackingChart = '';
    switch (tab) {
      case 'BOX OFFICE':
        trackingChart = filter.nowPlaying;
        break;

      case 'COMING SOON':
        trackingChart = filter.upcoming;
        break;

      case 'POPULAR':
        trackingChart = filter.popular;
        break;
      default:
        trackingChart = filter.popular;
    }

    setChart(trackingChart);
    setActive(tab);
  };

  const onTextChange = ({ target }) => {
    // Update the state with the value
    setValue(target.value);
  };

  const performSearch = (query) => {
    search(query, (movies) => {
      setSuggestions(movies);
      // setLoading(false);
    });
  };

  const dispatchSearchRequest = (query) => {
    performSearch(query);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    // Check if the value is empty
    if (/\S/.test(value)) {
      // Value not empty
      // Perform a search request
      dispatchSearchRequest(value);
    } else {
      // Value is empty
      // Empty the data and hide the suggestion box (Dropdown)
      setSuggestions([]);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion.title;

  const renderSuggestion = suggestion => (
    <p className="suggestion-item">{suggestion.title}</p>
  );

  const onSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault();
    setMovieId(suggestion.id);
    setNavigateToInfo(true);
  };

  const inputProps = {
    placeholder: 'Search movies',
    value,
    onChange: onTextChange,
    onKeyPress: handleSubmit,
    className: 'w-100 px-3',
  };

  if (navigateToInfo) {
    return <Redirect push to={{ pathname: `${process.env.PUBLIC_URL}/info`, state: movieId }} />;
  } if (navigateToList) {
    return <Redirect push to={{ pathname: `${process.env.PUBLIC_URL}/movies`, state: value }} />;
  }

  return (
    <div className="home h-100">
      <div className="container">
        <div className="logo text-center w-100">
          <i className="icon icon-fire"></i>
          <p className="text">wild movie</p>
        </div>
        <SearchBar
          suggestions={suggestions.slice(0, 5)}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected}
          alwaysRenderSuggestions
          onSubmit={handleSubmit}
          inputProps={inputProps}
        />
        <div className="tab-layout">
          <button type="button" onClick={() => handleClick('BOX OFFICE')} className={`button ${active === 'BOX OFFICE' ? 'ui-button-secondary' : 'ui-button-primary'}`}>BOX OFFICE</button>
          <button type="button" onClick={() => handleClick('COMING SOON')} className={`button ${active === 'COMING SOON' ? 'ui-button-secondary' : 'ui-button-primary'}`}>COMING SOON</button>
          <button type="button" onClick={() => handleClick('POPULAR')} className={`button ${active === 'POPULAR' ? 'ui-button-secondary' : 'ui-button-primary'}`}>POPULAR</button>
        </div>
        <Carousel data={data} />
        <div className="actions">
          <NavLink className="button ui-button-outline mt-4" exact to={`${process.env.PUBLIC_URL}/favorites`}>MY FAVORITES</NavLink>
        </div>

      </div>
    </div>
  );
};

export default Home;
