import React from 'react';

class Tabs extends React.Component {
  componentDidMount() {
    $('#phaseTabs button').click(e => {
      e.preventDefault();
      if (e.target.id === 'train') {
        this.props.changeNetPhase(0);
      } else if (e.target.id === 'test') {
        this.props.changeNetPhase(1);
      }
    });
  }
  render() {
    let trainClass = 'btn-primary',
      testClass = 'btn-default';
    if (this.props.selectedPhase === 0) {
      trainClass = 'btn-primary';
      testClass = 'btn-default';
    } else if (this.props.selectedPhase === 1) {
      trainClass = 'btn-default';
      testClass = 'btn-primary';
    }
    return (
      <li className="btn-group" role="group" id="phaseTabs">
        <button type="button" id="train" className={"btn "+trainClass} onClick={() => this.props.startTraining()}>训练</button>
        <button type="button" id="test" className={"btn "+testClass}>测试</button>
      </li>
    );
  }
}

Tabs.propTypes = {
  startTraining: React.PropTypes.func,
  changeNetPhase: React.PropTypes.func,
  selectedPhase: React.PropTypes.number
};

export default Tabs;
