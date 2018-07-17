import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import request from 'superagent';
const nocache = require('superagent-no-cache');

import GroupArray from 'group-array';

import {grey600,lightBlue900,red500,orange500, orange900,cyan500,grey300,pink500} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ChevronRightIcon from 'material-ui/svg-icons/navigation/chevron-right';

import MonthPickerPopView from './MonthPickerPopView.jsx';

import { 
    onSaveAppFormDataEventData
  , onSaveSosikiMailFormDataEventData
} from '../actions/actions';

import Constants from '../../common/Constants';
import CommonUtils from '../../common/CommonUtils';

class App extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {

      // 画面項目
      // 組織
      searchSosikiNm:"",
      searchSosikiNmArray:[],
      // 処理年月(YYYY/MM)
      searchMailMonth:"",
      mailMonthChangeSearchFlag:false,

      // 画面データ
      // 組織リスト
      //sosikiGroupData:[],
      // 組織別メール課金合計情報
      sosikiMailSumInfoData:[],
    };
  };

  /******************************************************************************/
  /*                             画面イベント処理                                */
  /******************************************************************************/

  /*
   *  初期化処理
   */
  componentWillMount = () => {
    //console.log("App.componentWillMount");
    //console.log(this.props.appFormData);

    window.scroll(0,0);
    
    // 処理年月(YYYY/MM)
    let searchMonth = "";

    // 「戻る」ボタンをクリックする場合、検索条件を取得し、サーバ側からデータを取得する。
    if (this.props.appFormData) {

      let searchData = CommonUtils.deepCopy(this.props.appFormData);
      searchMonth = searchData.searchMailMonth;

      this.setState({
        // 組織
        searchSosikiNm:searchData.searchSosikiNm,
        // 処理年月(YYYY/MM)
        searchMailMonth:searchData.searchMailMonth,
        mailMonthChangeSearchFlag:false,
      });      
    } else {

      // システム日付を取得する
      //let currentMonth = CommonUtils.getSysDate().slice(0,7);
      let currentMonth = "";
      searchMonth = currentMonth;

      this.setState({
          // 組織
          searchSosikiNm:Constants.SOSIKI_ALL,
          // 処理年月(YYYY/MM)
          searchMailMonth:currentMonth,
          mailMonthChangeSearchFlag:false,
      });
    }

    // データを取得する
    this.getSosikiMailInfoData(searchMonth);

  };
 
  /*
   *  組織選択処理
   */
  onSosikiChange =(event, index, value) => {
    window.scroll(0,0);
    this.setState({
      searchSosikiNm:value
    });
  }

  /*
   *  処理月選択処理
   */
  onMonthPickerPopViewClose = (clickBtn, date) => {
    let searchMonth = date.slice(0,7);

    if (searchMonth!=this.state.searchMailMonth) {
      window.scroll(0,0);
      //処理月を取得する
      this.setState({
          // 処理月
          mailMonthChangeSearchFlag:true,
          searchMailMonth:searchMonth,       
      });
      // データを取得する
      this.getSosikiMailInfoData(searchMonth);
    } else {
      //処理なし
    }
  }

  /*
   *  組織別メール課金情報を表示する
   */
  onSosikiMailLinkClick = (sosikiMailSumInfo) => {

    // APP画面のstate
    let appFormData = {};
    // 組織
    appFormData.searchSosikiNm = this.state.searchSosikiNm;
    // 処理年月(YYYY/MM)
    appFormData.searchMailMonth = this.state.searchMailMonth;
    this.props.onSaveAppFormData(appFormData);


    // SosikiMailInfo画面のstate
    let sosikiMailFormData = {};
    // 組織（レコードを選択する）
    sosikiMailFormData.searchSosikiNm = sosikiMailSumInfo.組織名;
    // 処理年月(YYYY/MM)
    sosikiMailFormData.searchMailMonth = this.state.searchMailMonth;
    // ユーザー名検索
    sosikiMailFormData.searchUserNm = "";
    this.props.onSaveSosikiMailFormData(sosikiMailFormData);
  }

  /******************************************************************************/
  /*                             サブ関数定義                                    */
  /******************************************************************************/
 
   /*
   *  組織別メール課金を取得する
   */
  getSosikiMailInfoData = (searchMonth) => {
      // 組織別メール課金を取得する
      let url_projectData = urlpathname+"GetSosikiMailInfoData";
      //console.log("url_projectData:"+url_projectData);

      let searchData={};
      searchData.searchMonth = searchMonth;

      //ajax通信する
      request
        .post(encodeURI(url_projectData))
        .send({'data':searchData})
        .use(nocache)
        .end((err, res)=> {
              if (err) {
                console.log(err)
              } else {
                let response = JSON.parse(res.text);
                //console.log(response);
                
                // 組織リストを取得する
                let sosikiNmArray =[];
                if (response.sosikiGroupData) {
                  sosikiNmArray = CommonUtils.deepCopy(response.sosikiGroupData);
                  sosikiNmArray.sort();
                }
                sosikiNmArray.unshift(Constants.SOSIKI_ALL);

                if (this.state.mailMonthChangeSearchFlag) {

                  this.setState({
                    // 組織
                    searchSosikiNm:Constants.SOSIKI_ALL,
                    searchSosikiNmArray:sosikiNmArray,
                    // 処理年月(YYYY/MM)
                    mailMonthChangeSearchFlag:false,

                    // 組織リスト
                    //sosikiGroupData : response.sosikiGroupData,
                    // 組織別メール課金合計情報
                    sosikiMailSumInfoData : response.sosikiMailSumInfoData,
                  });

                } else {

                  // 処理月
                  let dispMonth = "";
                  if (response.sosikiMailSumInfoData && response.sosikiMailSumInfoData.length>0) {
                    dispMonth = response.sosikiMailSumInfoData[0].利用年月;
                  }

                  this.setState({
                    // 組織
                    searchSosikiNmArray:sosikiNmArray,
                    // 処理年月(YYYY/MM)
                    searchMailMonth:dispMonth,
                    mailMonthChangeSearchFlag:false,

                    // 組織リスト
                    //sosikiGroupData : response.sosikiGroupData,
                    // 組織別メール課金合計情報
                    sosikiMailSumInfoData : response.sosikiMailSumInfoData,
                  });

                }

              }
         });
  };

	search = (mailSumInfoData, searchData) => {

    // 組織
    let searchSosikiNm=searchData.searchSosikiNm;
    // 処理年月
    let searchMailMonth=searchData.searchMailMonth;

    let dispData=[];

    if (mailSumInfoData && mailSumInfoData.length>0) {

      dispData = mailSumInfoData.filter((item, index)=>{		

        let flag1 = false;
        if (searchSosikiNm===Constants.SOSIKI_ALL) {
          flag1 =true;
        } else {
          flag1 = (item.組織名===searchSosikiNm? true: false);
        }

        let flag2 = false;
        flag2 = (item.利用年月===searchMailMonth? true: false);	

        return flag1&&flag2;
      })
    }

    dispData.sort((rec1, rec2)=>{

      let cmp金額合計 = 0;
      let cmp容量合計 = 0;
      let cmp組織名 = 0;

      let 金額1 = rec1["金額合計"]?rec1["金額合計"]:0;
      let 金額2 = rec2["金額合計"]?rec2["金額合計"]:0;
      cmp金額合計 =  (金額1-金額2)*-1;

      let 容量1 = rec1["容量合計"]?rec1["容量合計"]:0;
      let 容量2 = rec2["容量合計"]?rec2["容量合計"]:0;
      cmp容量合計 =  (容量1-容量2)*-1;

      if (rec1.組織名==rec2.組織名) {
        cmp組織名 = 0;
      } else if (rec1.組織名>rec2.組織名) {
        cmp組織名 = 1;
      } else if (rec1.組織名<rec2.組織名) {
        cmp組織名 = -1;
      }

      if (cmp金額合計!=0) {
        return cmp金額合計;
      }
      if (cmp容量合計!=0) {
        return cmp容量合計;
      }
      if (cmp組織名!=0) {
        return cmp組織名; 
      }
      return 0;
    })

    return dispData;
  }

  /******************************************************************************/
  /*                             画面レイアウト作成                               */
  /******************************************************************************/
  render() {
      
    //console.log("render:" + CommonUtils.getSysDateTime());
    // 組織別メール課金(表示用)
    let dispSosikiMailSumInfoList=[];
    dispSosikiMailSumInfoList = this.search(this.state.sosikiMailSumInfoData, this.state);
    //console.log(dispSosikiMailSumInfoList);

    return (
        <div>

          <div style={{position:'fixed', width:'100%',zIndex:99,backgroundColor:'#FFFFFF'}}>
              <AppBar title={"組織別メール課金"}
                showMenuIconButton={true}
                style={{backgroundColor:lightBlue900}}
                iconElementLeft={
                  <IconButton onTouchTap={()=>{this.props.history.goBack()}}>
                    <BackIcon color='#FFFFFF'/>
                  </IconButton>
                }	
              />

              <div style={{marginLeft:8, marginRight:8,}}>
                  <SelectField
                    floatingLabelText="組織"
                    style={{float:'left', width:"65%"}}
                    value={this.state.searchSosikiNm}
                    onChange={this.onSosikiChange}
                  >
                    {
                      this.state.searchSosikiNmArray.map((sosikiNm, index)=>{
                        return (
                          <MenuItem key={index}  value={sosikiNm} primaryText={sosikiNm} />
                        );
                      })
                    }
                  </SelectField>

                  <div style={{display:'inline-block', width:"35%"}}>
                    <MonthPickerPopView 
                      startYearMonth={
                        this.state.searchMailMonth==""
                        ?""
                        :this.state.searchMailMonth+"/01"
                      } 
                      onMonthPickerPopViewClose={this.onMonthPickerPopViewClose}>
                    </MonthPickerPopView>
                  </div>
              </div>
          </div>

          <div style={{paddingTop:132, marginLeft:8, marginRight:8,}}>
              <List>
                {dispSosikiMailSumInfoList.length==0
                  ?<div style={{textAlign:"center"}}><p>データがありません。</p></div>
                  :dispSosikiMailSumInfoList.map((sosikiMailSumInfo,index) => {
                      
                      let rec容量合計 = sosikiMailSumInfo["容量合計"]?sosikiMailSumInfo["容量合計"]:0;
                      let rec金額合計 = sosikiMailSumInfo["金額合計"]?sosikiMailSumInfo["金額合計"]:0;

                      return (
                        <div key={index} style={{}}>
                          <Link to={"/sosikiMailInfo"} 
                            style={{textDecoration:"none"}} 
                            onTouchTap={()=>{this.onSosikiMailLinkClick(sosikiMailSumInfo)}}>
                            <ListItem
                              disabled={true}
                              key={index}
                              style={{paddingLeft:0}}
                              primaryText={
                                <div style={{display:"flex", alignItems:"center"}}>
                                  <div style={{display:'inline-block', width:'36%',textAlign:'left',paddingTop:2,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",}}>{sosikiMailSumInfo.組織名}</div>
                                  <div style={{display:'inline-block', width:'30%',textAlign:'right'}}>{CommonUtils.toThousands(rec容量合計)}MB</div>
                                  <div style={{display:'inline-block', width:'30%',textAlign:'right', color:'red'}}>{CommonUtils.toThousands(rec金額合計)}円</div>
                                  <div style={{display:'inline-block', width:'3%' ,textAlign:'right'}}>
                                    <ChevronRightIcon/>
                                  </div>
                                </div>
                              }
                            />
                          </Link >
                          <Divider/>
                        </div>
                      );

                  })
                }
              </List>	
          </div>
 
        </div>
     );
  }
}

const mapStateToProps = (state,ownProps) => {
	return { 
    // APP画面のstate
    appFormData:state.appFormData?state.appFormData:null,
    // SosikiMailInfo画面のstate
    sosikiMailFormData:state.sosikiMailFormData?state.sosikiMailFormData:null,
	}
}
  
const mapDispatchToProps = (dispatch) => {
	return {
		// APP画面のstate
		onSaveAppFormData: (response) => {
			dispatch(onSaveAppFormDataEventData(response))
    },
		// SosikiMailInfo画面のstate
		onSaveSosikiMailFormData: (response) => {
			dispatch(onSaveSosikiMailFormDataEventData(response))
		},
	}
}

App = connect(
  mapStateToProps,mapDispatchToProps
)(App)

export default App;
