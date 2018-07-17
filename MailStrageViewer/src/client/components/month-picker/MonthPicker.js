import React, { Component } from 'react';
import './css/month-picker.css';
import './css/picker-styles.css';
import moment from 'moment';

export default class MonthPicker extends Component {

    constructor(props){
        super(props);
        //let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        if(this.props.months && this.props.months.length === 12){
            months = this.props.months;
        }           

        let currentMonth = moment(new Date(),'YYYY/MM/DD').format('YYYY/MM/DD').slice(0, 7)+"/01";
        this.state = {
            cells:[], 
            selectedDate:this.props.initDate==null?new Date(currentMonth):new Date(this.props.initDate),
            currentView:"months",
            renderDate:true, 
            months:months
        };
        this.selectCell = this.selectCell.bind(this);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
        this.selectYear = this.selectYear.bind(this);
    }

    componentWillMount(){
        /*let cells =[];
        let year = new Date().getFullYear() - 6 ;
        for(let i = 0 ; i< 12 ; i++)
            cells.push(year+i);
        this.setState({cells:cells});*/

        this.setState({currentView:"months",renderDate:true});
        this.setState({cells:this.state.months});

    }

    selectCell(cellContent, index){

        if(typeof cellContent === 'number'){
            // 年
            let date = this.state.selectedDate;
            date.setFullYear(cellContent);
            this.setState({selectedDate:date});

            let months = this.state.months;
            this.setState({currentView:"months",renderDate:false});
            this.setState({cells:months});
        }else{
            // 月
            let date = this.state.selectedDate;
            date.setMonth(index);
            this.setState({selectedDate:date, renderDate:true});
            if(this.props.onChange && typeof this.props.onChange === "function"){
                this.props.onChange(this.state.selectedDate);
            } 
        }
    }

    previous(){
        if(this.state.currentView === "years"){
            let years = this.state.cells;
            for(let i=0; i<12 ; i++)
                years[i] -= 12;
            this.setState({cells:years, renderDate:false});
        }else{

            let year = this.state.selectedDate.getFullYear() - 1;

            // 年
            let date = this.state.selectedDate;
            date.setFullYear(year);
            this.setState({selectedDate:date});

            let months = this.state.months;
            this.setState({currentView:"months",renderDate:false});
            this.setState({cells:months});

        }
    }

    next(){
        if(this.state.currentView === "years"){
            let years = this.state.cells;
            for(let i=0; i<12 ; i++)
                years[i] += 12;
            this.setState({cells:years, renderDate:false});
        }else{

            let year = this.state.selectedDate.getFullYear() + 1;

            // 年
            let date = this.state.selectedDate;
            date.setFullYear(year);
            this.setState({selectedDate:date});

            let months = this.state.months;
            this.setState({currentView:"months",renderDate:false});
            this.setState({cells:months});
        }
    }

    selectYear() {
        if (this.state.currentView === "years") {
            return;
        } else {
            let cells =[];
            let year ="";
            if (this.state.selectedDate) {
                year = this.state.selectedDate.getFullYear() - 6;
            } else {
                year = new Date().getFullYear() - 6;
            }
            for(let i = 0 ; i< 12 ; i++){
                cells.push(year+i);
            }
            this.setState({cells:cells});
            this.setState({currentView:"years", renderDate:false});
        }
    }

    render() {
        
        let selectedString="";
        if(this.state.renderDate){
            let selectedMonth = this.state.selectedDate.getMonth()+1;
            let selectedYear =  this.state.selectedDate.getFullYear();
            let monthString = (selectedMonth)>9 ? selectedMonth : "0"+selectedMonth;
            selectedString = selectedYear+"-"+monthString;
        } else {
            selectedString =  this.state.selectedDate.getFullYear();
        }

        let head =
            <div className="section_mp group_mp">
                <div className="col_mp span_1_of_3_mp arrows_mp" onClick={()=>{this.previous()}}>&lt;</div>
                <div className="col_mp span_1_of_3_mp selected_date_mp" style={{paddingTop:10}} onClick={()=>{this.selectYear()}}>{selectedString}</div>
                <div className="col_mp span_1_of_3_mp arrows_mp" onClick={()=>{this.next()}}>&gt;</div>
            </div>;

        let body = [];
        for( let i = 0 ; i< 12 ; i++){
            let cellContent = this.state.cells[i];
            let gColor ="";
            // if (i==this.state.selectedDate.getMonth()) {
            //     gColor="darkslateblue";
            // } 
            body.push(<div key={i} tabIndex={i} style={{backgroundColor:gColor}} onClick={()=>{this.selectCell(cellContent, i)}} className={"col_mp span_1_of_3_mp"}>{cellContent}</div>);
            
        }

        return (
                <div>
                    {head}
                    {body}
                </div>
        );
    }

}
