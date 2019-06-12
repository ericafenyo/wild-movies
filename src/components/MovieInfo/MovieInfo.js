import React, { Component, Fragment } from 'react';
import ToolBar from '../Toolbar/ToolBar';
import MovieDetails from '../MovieDetails/MovieDetails';
import LoadingState from '../ViewStates/LoadingState';
import './MovieInfo.css';
import { fetchMovieDetails } from '../../data/ApiEndpoint';

class MovieInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    fetchMovieDetails(this.props.location.state, (res) => {
      this.setState({ info: res, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingState />;
    }

    return (
      <Fragment>
        <ToolBar
          title="Movie details"
          leftIcon="close"
          rightIcon="bookmark"
        />
        <MovieDetails info={this.state.info} />
      </Fragment>
    );
  }
}

export default MovieInfo;