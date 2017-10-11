import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'multireducer';
import * as counterActions from 'redux/modules/counter';

@connect(
  (state, { multireducerKey: key }) => ({ count: state.counter[key].count }),
  (dispatch, { multireducerKey: key }) => bindActionCreators(counterActions, dispatch, key)
)
export default class CounterButton extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    increment: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const { count, increment } = this.props;
    let { className } = this.props;
    className += ' btn btn-default';
    return (
      <button className={className} onClick={increment}>
        You have clicked me {count} time{count === 1 ? '' : 's'}.
      </button>
    );
  }
}
