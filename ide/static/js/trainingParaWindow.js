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
            alertDiv: null,
            optSelected: "RMSprop"
        };
        this.finishInput = this.finishInput.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.optimizerChanged = this.optimizerChanged.bind(this);
    }

    componentWillMount() {
        this.setState({
            ifShowAlert: null,
            alertDiv: null,
            optSelected: "RMSprop"
        });
    }

    optimizerChanged(){
        let optimizer = $('#optimizerSelect').val();
        console.log(optimizer);
        this.setState({
            optSelected: optimizer
        });
        console.log(this.state.optSelected);
    }
    finishInput(){
        console.log('Finish input');
        console.log(this.state.optSelected);
        let batch_size = $('#batch-size-input')[0].value;
        let epoch_times = $('#epoch-times-input')[0].value;
        let lr = $('#lr-input')[0].value;

        var paras = new Array();

        var emptyError = false;
        var invalidError = false;
        let optimizer = $('#optimizerSelect').val();
        console.log("Current optimizer: " + optimizer);
        console.log(optimizer == "RMSprop");
        console.log(optimizer == 'RMSprop');
        switch (optimizer){
            case "SGD": 
                paras['momentum'] = $('#sgd-momentum-input')[0].value;
                if (paras['momentum'] === '') emptyError = true;
                if (isNaN(parseFloat(paras['momentum']))) invalidError = true;
                break;
            //case "RMSprop", "Adadelta": 
            case "RMSprop":
            case "Adadelta":
                //console.log("Get RMSprop");
                paras['rho'] = $('#rmsprop-rho-input')[0].value;
                if (paras['rho'] === '') emptyError = true; 
                if(isNaN(parseFloat(paras['rho']))) invalidError = true;
                break;
            case "Adagrad":
                break;
            //case "Adam", "Adamax", "Nadam":
            case "Adam":
            case "Adamax":
            case "Nadam":
                paras['beta1'] = $('#adm-beta1-input')[0].value;
                paras['beta2'] = $('#adm-beta2-input')[0].value;
                if (paras['beta1'] === '' || paras['beta2'] === '') emptyError = true; 
                if (isNaN(parseFloat(paras['beta1'])) || isNaN(parseFloat(paras['beta2'])) )
                    invalidError = true;
                break;
            default:
                break;
        }
        
        // check params
        if(batch_size === '' || epoch_times === '' || lr === '' || emptyError){
            this.showAlert('alert alert-danger', 'Input field can not be empty.');
            return;
        }

        let n_batch_size = parseInt(batch_size);
        let n_epoch_times = parseInt(epoch_times);
        let n_lr = parseFloat(lr);
 
        if(isNaN(n_batch_size) || isNaN(n_epoch_times) || isNaN(n_lr) || invalidError){
            this.showAlert('alert alert-danger', 'Invalid input');
            return;
        }

        //console.log("I'm here!");
        // call father function
        this.props.submitParams(n_batch_size, n_epoch_times, n_lr, this.state.optSelected, paras);

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
    

    render(){

        let sgdPara = (
            <div className="form-group">
                <label htmlFor="sgd-momentum-input" className="col-sm-2 control-label">momentum:</label>
                <div className="col-sm-5">
                    <input type="text" className="form-control" id="sgd-momentum-input" defaultValue="0.0" />
                </div>
            </div>
        );
        let rmspropPara = (
            <div className="form-group">
                <label htmlFor="rmsprop-rho-input" className="col-sm-2 control-label">rho:</label>
                <div className="col-sm-5">
                    <input type="text" className="form-control" id="rmsprop-rho-input" defaultValue="0.9" />
                </div>
            </div>
        );

        let adagradPara = null;
        let adadeltaPara = rmspropPara;
        let adamPara = (
            <div>
            <div className="form-group">
                <label htmlFor="adm-beta1-input" className="col-sm-2 control-label">beta_1:</label>
                <div className="col-sm-5">
                    <input type="text" className="form-control" id="adm-beta1-input" defaultValue="0.9" />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="adm-beta2-input" className="col-sm-2 control-label">beta_2:</label>
                <div className="col-sm-5">
                    <input type="text" className="form-control" id="adm-beta2-input" defaultValue="0.999" />
                </div>
            </div>
            </div>
        );
        let adamMaxPara = adamPara;
        let nadamPara = adamPara;
        let showOptPara = null;
        switch (this.state.optSelected){
            case "SGD": showOptPara = sgdPara; break;
            case "RMSprop": showOptPara = rmspropPara; break;
            case "Adagrad": showOptPara = adagradPara; break;
            case "Adadelta": showOptPara = adadeltaPara; break;
            case "Adam": showOptPara = adamPara; break;
            case "Adamax": showOptPara = adamMaxPara; break;
            case "Nadam": showOptPara = nadamPara; break;
            default: showOptPara = null;
        }
        return (
            <div className="container">
                {this.state.alertDiv}
                <form className="form-horizontal" role="form">
                    <div className="form-group">
                        <label htmlFor="batch-size-input" className="col-sm-2 control-label">Batch Size:</label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" id="batch-size-input" defaultValue="100" placeholder="Input batch size" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="epoch-times-input" className="col-sm-2 control-label">Epoch:</label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" id="epoch-times-input" defaultValue="10" placeholder="Input epoch times" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lr-input" className="col-sm-2 control-label">Learning rate:</label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" id="lr-input" defaultValue="0.01" placeholder="Input learning rate" />
                        </div>
                    </div>

                    {/*Optimizer dropdown menu*/}
                    <div className="form-group">
                        <label htmlFor="optimizerSelect" className="col-sm-2 control-label">Optimizer:</label>
                        <div className="col-sm-5">
                                <select id="optimizerSelect" name="usertype" className="selectpicker show-tick form-control" 
                                      data-live-search="false" onChange={this.optimizerChanged}>
                                        <option value="RMSprop">RMSprop</option>
                                        <option value="SGD">SGD</option>
                                        <option value="Adagrad">Adagrad</option>
                                        <option value="Adadelta">Adadelta</option>
                                        <option value="Adam">Adam</option>
                                        <option value="Adamax">Adamax</option>
                                        <option value="Nadam">Nadam</option>
                                </select>
                        </div>

                    </div>
                    
                    {showOptPara}
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

