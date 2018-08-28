import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

@connect((state, { namespace }) => ({ notifs: state.notifs[namespace] || [] }))
class Notifs extends Component {
  static propTypes = {
    notifs: PropTypes.arrayOf(PropTypes.object).isRequired,
    NotifComponent: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired
  };

  render() {
    const { notifs, className, NotifComponent } = this.props;

    return (
      <div className={`notif-container ${className}`}>
        {notifs.map(notif => (
          <NotifComponent key={notif.id} message={notif.message} kind={notif.kind} />
        ))}
      </div>
    );
  }
}

export default Notifs;
