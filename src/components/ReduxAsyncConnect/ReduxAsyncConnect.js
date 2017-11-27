import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route } from 'react-router';
import { trigger } from 'redial';
import asyncMatchRoutes from 'utils/asyncMatchRoutes';

@withRouter
export default class ReduxAsyncConnect extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired
  };

  state = {
    previousLocation: null
  };

  async componentWillReceiveProps(nextProps) {
    const {
      history, location, routes, store, helpers
    } = this.props;
    const navigated = nextProps.location !== location;

    if (navigated) {
      // save the location so we can render the old screen
      this.setState({ previousLocation: location });

      // load data while the old screen remains
      const { components, match, params } = await asyncMatchRoutes(routes, nextProps.location.pathname);

      await trigger('fetch', components, {
        ...helpers,
        store,
        match,
        params,
        history,
        location: nextProps.location
      });
      if (__CLIENT__) {
        await trigger('defer', components, {
          ...helpers,
          store,
          match,
          history,
          location: nextProps.location
        });
      }

      // clear previousLocation so the next screen renders
      this.setState({ previousLocation: null });
    }
  }

  render() {
    const { children, location } = this.props;
    const { previousLocation } = this.state;

    // use a controlled <Route> to trick all descendants into
    // rendering the old location
    return <Route location={previousLocation || location} render={() => children} />;
  }
}
