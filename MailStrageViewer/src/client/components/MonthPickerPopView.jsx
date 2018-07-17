import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DateIcon from 'material-ui/svg-icons/action/date-range';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';

import BadIcon from 'material-ui/svg-icons/navigation/close';
import MonthPicker from './month-picker/MonthPicker';
import {white,black,grey500,green500,} from 'material-ui/styles/colors';

class MonthPickerPopView extends React.PureComponent  {
  
    constructor(props){
        super(props);
        this.state = {
          dialogOpen: false,
          yearMonth:this.props.startYearMonth,
          selectYearMonth:"",
        };
    }
    
    componentWillMount = () => {
      this.setState({
        dialogOpen: false,
        yearMonth: this.props.startYearMonth,
        selectYearMonth:"",
      })
    }

    componentWillReceiveProps = (newProps) => {
      if (newProps.startYearMonth != this.state.yearMonth) {
        this.setState({
          yearMonth: newProps.startYearMonth,
          selectYearMonth:"",
        })
        return 
      }
    }

    handleDialogOpen = (e) => {
      this.setState({dialogOpen: true});
      e.preventDefault();
    };
    
    handleDialogClose = () => {
      this.setState({dialogOpen: false});
    };
 
    handleDialogClear = () => {
      this.setState({
        yearMonth: "",
        selectYearMonth:""
      });
      this.handleDialogClose();
      this.props.onMonthPickerPopViewClose("Clear","");
    };

    handleDialogCancel = () => {
      this.handleDialogClose();
      this.props.onMonthPickerPopViewClose("Cancel",this.state.yearMonth);
    };

    handleDialogOK = () => {
      let retValue=""
      if (this.state.selectYearMonth!=="") {
        this.setState({yearMonth: this.state.selectYearMonth});
        retValue = this.state.selectYearMonth;
      } else {
        retValue = this.state.yearMonth;
      }
      this.handleDialogClose();
      this.props.onMonthPickerPopViewClose("OK", retValue);
    };

    handleDialogChange = (date) => {
      this.setState({selectYearMonth: moment(date,'YYYY/MM/DD').format('YYYY/MM/DD')});
    };

    render() {

      const actions = [
        /*<FlatButton
        label="クリア"
        primary={true}
        onClick={this.handleDialogClear}
        style={{minWidth:20}}
        />,*/
        <FlatButton
          label="キャンセル"
          primary={true}
          onClick={this.handleDialogCancel}
          style={{minWidth:20}}
        />,
        <FlatButton
          label="確定"
          primary={true}
          keyboardFocused={true}
          onClick={this.handleDialogOK}
          style={{minWidth:20}}
        />,
        ];
      
      return (
        <div style={{width:105,marginLeft:5,marginRight:5}}>
          <div style={{display:'inline-block',}}>
            <TextField id="txtYearMonth"
              floatingLabelText="年月"
              disabled={true}
              underlineDisabledStyle={{borderBottom:'1px solid #D3D3D3'}}
              style={{width:70,marginLeft:5,marginRight:5}}
              value={(this.state.yearMonth==="" || this.state.yearMonth==null)?"":this.state.yearMonth.slice(0, 7)}
              onTouchTap={this.handleDialogOpen}
              inputStyle={{color:black}}/>
          </div>
          <div style={{display:'inline-block',verticalAlign:'top',paddingTop:40}}>
            <DateIcon style={{width:20,height:20,}} onTouchTap={this.handleDialogOpen}/>
          </div>

          <Dialog
            title="年月を選択"
            actions={actions}
            modal={true}
            open={this.state.dialogOpen}
            onRequestClose={this.handleDialogClose}
            >
            <MonthPicker 
              initDate={(this.state.yearMonth==="" || this.state.yearMonth==null)
                        ? moment(new Date(),'YYYY/MM/DD').format('YYYY/MM/DD').slice(0, 7)+"/01"
                        : this.state.yearMonth.slice(0, 7)+"/01"} 
              onChange={(date)=>{this.handleDialogChange(date)}}
            />
          </Dialog>

        </div>
      );
    }
}

export default MonthPickerPopView;