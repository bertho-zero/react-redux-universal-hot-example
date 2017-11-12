import React from 'react';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
  findRenderedDOMComponentWithClass
} from 'react-dom/test-utils';
import { expect } from 'chai';
import { InfoBar } from 'components';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import createStore from 'redux/create';
import apiClient from 'helpers/apiClient';

const client = apiClient();

describe('InfoBar', () => {
  const mockStore = {
    info: {
      load: () => {},
      loaded: true,
      loading: false,
      data: {
        message: 'This came from the api server',
        time: Date.now()
      }
    }
  };
  const store = createStore({
    history: browserHistory,
    helpers: { client },
    data: mockStore
  });
  const renderer = renderIntoDocument(<Provider store={store} key="provider">
    <InfoBar />
  </Provider>);

  it('should render correctly', () => {
    // eslint-disable-next-line no-unused-expressions
    expect(renderer).to.be.ok;
  });

  it('should render with correct value', () => {
    const text = findRenderedDOMComponentWithTag(renderer, 'strong').textContent;
    expect(text).to.equal(mockStore.info.data.message);
  });

  it('should render with a reload button', () => {
    const text = findRenderedDOMComponentWithTag(renderer, 'button').textContent;
    expect(text).to.be.a('string');
  });

  it('should render the correct className', () => {
    const styles = require('components/InfoBar/InfoBar.scss');
    const component = findRenderedDOMComponentWithClass(renderer, styles.infoBar);
    expect(styles.infoBar).to.be.a('string');
    expect(component.className).to.include(styles.infoBar);
  });
});
