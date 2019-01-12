import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import MiniInfoBar from 'components/MiniInfoBar/MiniInfoBar';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';

/* eslint-disable max-len */
@provideHooks({
  fetch: ({ store: { dispatch, getState } }) => !isInfoLoaded(getState()) ? dispatch(loadInfo()).catch(() => null) : Promise.resolve()
})
class About extends Component {
  state = {
    showKitten: false
  };

  handleToggleKitten = () => {
    const { showKitten } = this.state;

    this.setState({ showKitten: !showKitten });
  };

  render() {
    const { showKitten } = this.state;
    const kitten = require('./kitten.jpg');

    return (
      <div className="container">
        <h1>About Us</h1>
        <Helmet title="About Us" />

        <p>
          This project is maintained by Kévin Berthommier (
          <a href="https://github.com/bertho-zero" target="_blank" rel="noopener noreferrer">
            @bertho-zero
          </a>
          ) and was originally created by Erik Rasmussen (
          <a href="https://twitter.com/erikras" target="_blank" rel="noopener noreferrer">
            @erikras
          </a>
          ),
          <br />
          but has since seen many contributions from the open source community. Thank you to{' '}
          <a
            href="https://github.com/bertho-zero/react-redux-universal-hot-example/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
          >
            all the contributors
          </a>
          .
        </p>

        <h3>
          Mini Bar <span style={{ color: '#aaa' }}>(not that kind)</span>
        </h3>

        <p>
          Hey! You found the mini info bar! The following component is display-only. Note that it shows the same time as
          the info bar.
        </p>

        <MiniInfoBar />

        <h3>Images</h3>

        <p>
          Psst! Would you like to see a kitten?
          <button
            type="button"
            className={`btn btn-${showKitten ? 'danger' : 'success'}`}
            style={{ marginLeft: 50 }}
            onClick={this.handleToggleKitten}
          >
            {showKitten ? 'No! Take it away!' : 'Yes! Please!'}
          </button>
        </p>

        {showKitten && (
          <div>
            <img src={kitten} alt="kitchen" />
          </div>
        )}
      </div>
    );
  }
}

export default About;
