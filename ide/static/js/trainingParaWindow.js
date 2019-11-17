// References:
// bootstrap horizontal form layout: https://blog.csdn.net/fengsuiyingdong/article/details/72357479
// react father-son components value sending: https://blog.csdn.net/qq_24147051/article/details/80832784
// 'for' attribute of html label element: https://www.jianshu.com/p/34610b63002b
//                            https://jingyan.baidu.com/article/ab0b563085d4a8c15afa7da6.html
import React from 'react';
import AlertLabel from './alertLabel';

class TrainingParaWindow extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            batch_size: 0,
            epoch: 0,
            learning_rate: 0.0,
            ifShowAlert: null,
            alertDiv: null
        };
        this.finishInput = this.finishInput.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }

    componentWillMount() {
        this.setState({
            ifShowAlert: null,
            alertDiv: null
        });
    }


    finishInput(){
        console.log('Finish input');
        let batch_size = $('#batch-size-input')[0].value;
        let epoch_times = $('#epoch-times-input')[0].value;
        let lr = $('#lr-input')[0].value;
        // check params
        if(batch_size === '' || epoch_times === '' || lr === ''){
            this.showAlert('alert alert-danger', 'Input field can not be empty.');
            return;
        }
        let n_batch_size = parseInt(batch_size);
        let n_epoch_times = parseInt(epoch_times);
        let n_lr = parseFloat(lr);
        if(isNaN(n_batch_size) || isNaN(n_epoch_times) || isNaN(n_lr)){
            this.showAlert('alert alert-danger', 'Invalid input');
            return;
        }
        // call father function
        this.props.submitParams(n_batch_size, n_epoch_times, n_lr);

    }
    showAlert(type, text){
        let alertDiv = (
            <AlertLabel display="block" text={text} alertType={type} />
        );
        this.setState({
            showAlert: true,
            alertDiv: alertDiv
        });
    }

    // TODO: submit button alignment
    render(){
        
        return (
            <div className="container">
                {this.state.alertDiv}
                <form className="form-horizontal" role="form">
                    <div className="form-group">
                        <label htmlFor="batch-size-input" className="col-sm-2 control-label">Batch Size:</label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" id="batch-size-input" placeholder="Input batch size" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="epoch-times-input" className="col-sm-2 control-label">Epoch:</label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" id="epoch-times-input" placeholder="Input epoch times" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lr-input" className="col-sm-2 control-label">Learning rate:</label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" id="lr-input" placeholder="Input learning rate" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-5">
                            <input type="button" className="btn btn-success" id="start-btn" onClick={this.finishInput} value="Start" />
                        </div>
                    </div>

                </form>
            </div>
        );

    }

}

TrainingParaWindow.propTypes = {
    submitParams: React.PropTypes.func
}


export default TrainingParaWindow;

