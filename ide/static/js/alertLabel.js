import React from 'react';

class AlertLabel extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	return (
            <div className={this.props.alertType} role="alert" display={this.props.display}>{this.props.text}</div>
	)
    }
}

AlertLabel.propTypes = {
  display: React.PropTypes.string,
  text: React.PropTypes.string,
  alertType: React.PropTypes.string
}

AlertLabel.defaultProps = {
  display: "none",
  text: "",
  alertType: ""
}

export default AlertLabel;

