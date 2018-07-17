import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import request from 'superagent';
const nocache = require('superagent-no-cache');

import moment from 'moment';
import GroupArray from 'group-array';

import {red500,grey700,white,lightBlue900} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';


import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader, CardText,CardActions} from 'material-ui/Card';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import MultiClamp from 'react-multi-clamp';

import { 
  onGetCompdayInfoDataEventData
, onGetSosikiCompdayInfoDataEventData
, onGetCommonInfoDataEventData
, onSetGroupExpandStatusEventData
} from '../actions/index';

const commonUtils = require('./commonUtils');

class App extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {      
    };

  };

  /******************************************************************************/
  /*                             画面イベント処理                                */
  /******************************************************************************/

  /*
   *  初期化処理
   */
  componentWillMount = () => {
    //console.log("App.componentWillMount")
    window.scroll(0,0);
    
    // 「戻る」ボタンをクリックする場合、既存データを利用する。
    if (this.props.compdayInfoData!=null && this.props.compdayInfoData.length>0) {
      return;
    }

    // システム日付を取得する
    let currentDate = commonUtils.getSysDate();
    // データを取得する
    this.getCompdayInfoData(currentDate);
  };
  componentDidMount = () => {
  }
  componentWillReceiveProps = (newProps) => {
  };
 
  /******************************************************************************/
  /*                             サブ関数定義                                    */
  /******************************************************************************/
 
   /*
   *  代休状況情報を取得する
   */
  getCompdayInfoData = (searchDate) => {
      // 代休状況情報を取得する
      let url_projectData = urlpathname+"GetCompdayInfoData?searchDate="+searchDate;
      //console.log("url_projectData:"+url_projectData);

      //ajax通信する
      request
        .get(encodeURI(url_projectData))
        .use(nocache)
        .end((err, res)=> {
            if (err) {
              console.log(err)
            } else {
              let response = JSON.parse(res.text);
              //console.log(response);

              // 組織別代休状況情報を取得する
              this.props.onGetSosikiCompdayInfoData(response.sosikiCompdayInfoData);
              // 代休状況情報を取得する
              this.props.onGetCompdayInfoData(response.compdayInfoData);
              // レッドカードを取得する
              this.props.onGetCommonInfoData(
                {
                  "redCardRate":parseFloat(response.redCardRate,10)
                }
              );

            }
        });
  };

	search = (sosikiCompdayInfoData) => {

    let dispData=[];
  
    if (sosikiCompdayInfoData && sosikiCompdayInfoData.length>0) {

      // 事業遂行職
      let flag0 = false;
      let 休出日数0 = 0;
      let 全出日数0 = 0;
      let 代休日数0 = 0;

      // 管理職
      let flag1 = false;
      let 休出日数1 = 0;
      let 全出日数1 = 0;
      let 代休日数1 = 0;

      sosikiCompdayInfoData.map((item, index1)=>{
        if (item.組織代休情報&&item.組織代休情報.length>0) {

          item.組織代休情報.map((rec, index2)=>{
            if (rec.管理区分==="0") {
              flag0= true;
              休出日数0 = 休出日数0 + (rec.休出日数?rec.休出日数:0);
              全出日数0 = 全出日数0 + (rec.全出日数?rec.全出日数:0);
              代休日数0 = 代休日数0 + (rec.代休日数?rec.代休日数:0);
            } else {
              flag1 = true
              休出日数1 = 休出日数1 + (rec.休出日数?rec.休出日数:0);
              全出日数1 = 全出日数1 + (rec.全出日数?rec.全出日数:0);
              代休日数1 = 代休日数1 + (rec.代休日数?rec.代休日数:0);
            }
          })

        }
      })

      let sum組織代休情報=[];
      if (flag0) {
        sum組織代休情報.push({
          '管理区分':'0',
          '休出日数':休出日数0,
          '全出日数':全出日数0,
          '代休日数':代休日数0
        });
      }
      if (flag1) {
        sum組織代休情報.push({
          '管理区分':'1',
          '休出日数':休出日数1,
          '全出日数':全出日数1,
          '代休日数':代休日数1
        });
      }

      let dispDataSum = {
        '更新日':'',
        '組織名':'全体',
        '組織代休情報':sum組織代休情報
      }

      sosikiCompdayInfoData.sort((itemA, itemB)=>{
        let sosikiNmA = commonUtils.dealKanjiNumber(itemA.組織名);
        let sosikiNmB = commonUtils.dealKanjiNumber(itemB.組織名);
        if (sosikiNmA > sosikiNmB) {
            return 1;
        } else if (sosikiNmA < sosikiNmB) {
            return -1;
        } else {
            return 0;
        }
      })

      dispData = [dispDataSum, ...sosikiCompdayInfoData];
    }

    return dispData;
  }

  getSosikiGroupColor = (sosikiGroup) => {
    let color = grey700;
    let sum代休日数=0;
    let sum全出日数=0;
    if (sosikiGroup&&sosikiGroup.組織代休情報&&sosikiGroup.組織代休情報.length>0) {

      if (sosikiGroup.組織名!=='全体') {
        sosikiGroup.組織代休情報.map((item, index) => {
          sum代休日数 = sum代休日数 + (item.代休日数?item.代休日数:0);
          sum全出日数 = sum全出日数 + (item.全出日数?item.全出日数:0);
        })
  
        if (sum全出日数>0) {
          color = ((sum代休日数/sum全出日数)<this.props.commonInfoData.redCardRate)?red500:grey700;
        }
      }
    }

    return color;
  }

  getGroupExpandStatus = (groupNm) => {
    let ret = false;
    
    if (groupNm==='全体') {
      ret = this.props.groupExpandStatus[groupNm]===undefined?true:this.props.groupExpandStatus[groupNm];
    } else {
      ret = this.props.groupExpandStatus[groupNm]===undefined?false:this.props.groupExpandStatus[groupNm];
    }

    return ret;
  }

  /******************************************************************************/
  /*                             画面レイアウト作成                               */
  /******************************************************************************/
  render() {

    let dispSosikiCompdayInfoList=[];
    dispSosikiCompdayInfoList = this.search(this.props.sosikiCompdayInfoData);

    return (
        <div>

          <div style={{position:'fixed', width:'100%',zIndex:99,backgroundColor:'#FFFFFF'}}>
              <AppBar title={"組織別代休状況"}
                showMenuIconButton={true}
                style={{backgroundColor:lightBlue900}}
                iconElementLeft={
                  <IconButton onTouchTap={()=>{this.props.history.goBack()}}>
                    <BackIcon color='#FFFFFF'/>
                  </IconButton>
                }	
              />
          </div>

          <div style={{paddingTop:65}} >
            {(dispSosikiCompdayInfoList==null || dispSosikiCompdayInfoList.length===0)
              ?<div style={{textAlign:"center"}}><p>データがありません。</p></div>
              :dispSosikiCompdayInfoList.map((group, index1)=>{
                let titleColor = this.getSosikiGroupColor(group);
                return (
                  <Card key={group.組織名}
                  style={{marginLeft:5,marginRight:5,marginTop:20,marginBottom:20,width:'97%',borderRadius:'5px'}}
                  initiallyExpanded={true}
                  expanded={this.getGroupExpandStatus(group.組織名)} 
                  onExpandChange={(newState)=>{this.props.onSetGroupExpandStatus(group.組織名, newState)}}>
    
                  <CardHeader
                    style={{padding:5,}}
                    textStyle={{paddingRight:48}}
                    titleStyle={{color:titleColor, fontWeight:'bold'}}
                    title={
                      <div><MultiClamp clamp={1}>{group.組織名}</MultiClamp></div>
                    }
                    actAsExpander={true}
                    showExpandableButton={true} />
    
                  <CardText expandable={true}  style={{padding:5,borderRadius:'10px'}}>
                    <Table selectable={false} fixedHeader={true} headerStyle={{height:32}}>
                      
                      <TableHeader adjustForCheckbox={false} displaySelectAll={false}   style={{fontWeight:'bold',}}>
                        <TableRow style={{height:15}}>
                          <TableHeaderColumn width="31%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>合計(日数)</TableHeaderColumn>
                          <TableHeaderColumn width="18%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>休出</TableHeaderColumn>
                          <TableHeaderColumn width="18%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>全出</TableHeaderColumn>
                          <TableHeaderColumn width="18%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>代休</TableHeaderColumn>
                          <TableHeaderColumn width="18%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>取得率</TableHeaderColumn>
                        </TableRow>
                      </TableHeader>

                      <TableBody displayRowCheckbox={false} >
                      {
                        group.組織代休情報.map((item,index2)=>{

                          // 取得率(代休/休出)
                          let rate = ""
                          let 代休日数 = (item.代休日数?item.代休日数:0);
                          let 休出日数 = (item.休出日数?item.休出日数:0);
                          if (休出日数!=0) {
                            rate = Math.ceil(代休日数/休出日数 * 100)/100;
                          }

                          return (
                            <TableRow key={index2} >
                              <TableRowColumn width="31%" style={{color:grey700, paddingLeft:5, paddingRight:5,fontSize:14}}>{item.管理区分==='0'?'事業遂行職':'管理職'}</TableRowColumn>
                              <TableRowColumn width="18%" style={{color:grey700, paddingLeft:5, paddingRight:5,fontSize:14}}>{item.休出日数?item.休出日数:0}</TableRowColumn>
                              <TableRowColumn width="18%" style={{color:grey700, paddingLeft:5, paddingRight:5,fontSize:14}}>{item.全出日数?item.全出日数:0}</TableRowColumn>
                              <TableRowColumn width="18%" style={{color:grey700, paddingLeft:5, paddingRight:5,fontSize:14}}>{item.代休日数?item.代休日数:0}</TableRowColumn>
                              <TableRowColumn width="18%" style={{color:grey700, paddingLeft:5, paddingRight:5,fontSize:14}}>{rate===""?"":`${rate*100}%`}</TableRowColumn>
                            </TableRow>
                            )
                        })
                      }
                      </TableBody>
                    </Table>
                  </CardText>

                  <CardActions>
                    <Link  to={"/sosikiCompdayInfo/"+group.組織名}>
                      <FlatButton label="個人別情報" labelStyle={{fontWeight:'bold'}} 
                        style={{width:'100%',backgroundColor:'#5A6B82',color:white}} 
                        />
                    </Link >
                  </CardActions>

                </Card>
                );
              })
            }
          </div>

 
        </div>
     );
  }
}

const mapStateToProps = (state,ownProps) => {
	return {
		// 代休状況情報
    compdayInfoData:state.compdayInfoData?state.compdayInfoData:null,
		// 組織別代休状況情報
		sosikiCompdayInfoData:state.sosikiCompdayInfoData?state.sosikiCompdayInfoData:null,
		// 共通情報
    commonInfoData:state.commonInfoData?state.commonInfoData:null,
    // グループＯｐｅｎ状態
    groupExpandStatus:state.groupExpandStatus?state.groupExpandStatus:null,

  }
}
  
const mapDispatchToProps = (dispatch) => {
	return {
		// 代休状況情報
		onGetCompdayInfoData: (response) => {
			dispatch(onGetCompdayInfoDataEventData(response))
    },
		// 組織別代休状況情報
		onGetSosikiCompdayInfoData: (response) => {
			dispatch(onGetSosikiCompdayInfoDataEventData(response))
		},
		// 共通情報
		onGetCommonInfoData: (response) => {
			dispatch(onGetCommonInfoDataEventData(response))
    },
    // グループＯｐｅｎ状態
		onSetGroupExpandStatus: (groupNm, state) => {
			dispatch(onSetGroupExpandStatusEventData(groupNm, state))
    },
	}
}

App = connect(
  mapStateToProps,mapDispatchToProps
)(App)

export default App;
