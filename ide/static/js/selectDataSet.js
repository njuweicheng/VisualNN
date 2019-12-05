import React from 'react';

class SelectDataSet extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            dataSetName: ''
        }
        
        this.selectDone = this.selectDone.bind(this);
        this.changeSelected = this.changeSelected.bind(this);
    }

    componentWillMount() {
        this.setState({
            dataSetName: ''
        });
    }

    selectDone(){
        console.log(this.state.dataSetName);
        if(this.state.dataSetName != ''){
            this.props.setDataSet(this.state.dataSetName);
            this.props.openTrainingParaWindow();
        }
    }

    changeSelected(e){
        this.setState({
            dataSetName: e.target.value
        })
    }

    render(){
        if(this.props.dataSets.length == 0){
            return(
                <div>
                    <label className="col-sm-5">Please upload your data set!</label>
                </div>
            )
        }

        let dataSelect = this.props.dataSets.map((dataSet, index)=>{
            return(
                <div className = "form-group" key={index}>
                    <div className="col-sm-5">
                        <input type="radio" name="chosen" value={dataSet} onChange={this.changeSelected} required/>{dataSet}
                    </div>
                </div>
            )
        })
        
        return (
            <div className="container">
                <form className="form-horizontal" role="form">
                    <div className="form-group">
                        <label className="col-sm-5">Choose the data set:</label>
                    </div>
                    {dataSelect}
                    <div className="form-group">
                        <div className="col-sm-5">
                            <input type="submit" className="btn btn-success" id="chose-btn" onClick={this.selectDone} value="Choose" />
                        </div>
                    </div>

                </form>
            </div>
        );

    }

}

SelectDataSet.propTypes = {
    setDataSet: React.PropTypes.func,
    openTrainingParaWindow: React.PropTypes.func,
    dataSets: React.PropTypes.array
}


export default SelectDataSet;

