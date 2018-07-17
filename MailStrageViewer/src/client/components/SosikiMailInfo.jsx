import React, { Component } from 'react';
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
    onSaveSosikiMailFormDataEventData
  , onSavePersonMailFormDataEventData
} from '../actions/actions';

import Constants from '../../common/Constants';
import CommonUtils from '../../common/CommonUtils';

class SosikiMailInfo extends Component {
	
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
			// ユーザー名検索
			searchUserNm:"",

			// 画面データ
			// 組織リスト
			//sosikiGroupData:[],
			// 組織別メール課金合計情報
			sosikiMailSumInfoData:[],
		};
	}

	/******************************************************************************/
	/*                             画面イベント処理                                */
	/******************************************************************************/

	/*
	*  初期化処理
	*/
	componentWillMount = () => {
		//console.log("SosikiMailInfo.componentWillMount");
		//console.log(this.props.sosikiMailFormData);

		let searchData = CommonUtils.deepCopy(this.props.sosikiMailFormData);
		// 処理年月(YYYY/MM)
		let searchMonth = searchData.searchMailMonth;

		this.setState({
			// 組織
			searchSosikiNm:searchData.searchSosikiNm,
			// 処理年月(YYYY/MM)
			searchMailMonth:searchData.searchMailMonth,
			mailMonthChangeSearchFlag:false,
			// ユーザー名検索
			searchUserNm:searchData.searchUserNm || '',
		});   

		// データを取得する
		this.getSosikiMailInfoData(searchMonth);
	}
	componentDidMount = () => {
		window.scroll(0,0);
	}

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
	*  ユーザー名検索処理
	*/
	onSearchUserNmChange = (event, newValue) => {
		window.scroll(0,0);
		this.setState({
			searchUserNm:newValue
		});
	}

	/*
	*  組織別メール課金情報を表示する
	*/
	onPersonMailLinkClick = (personMailInfo) => {

		// システム日付を取得する
		let currentMonth = CommonUtils.getSysDate().slice(0,7);

		// SosikiMailInfo画面のstate
		let sosikiMailFormData = {};
		// 組織
		sosikiMailFormData.searchSosikiNm = this.state.searchSosikiNm;
		// 処理年月(YYYY/MM)
		sosikiMailFormData.searchMailMonth = this.state.searchMailMonth;
		// ユーザー名検索
		sosikiMailFormData.searchUserNm = this.state.searchUserNm;
		this.props.onSaveSosikiMailFormData(sosikiMailFormData);


		//  PersonMailInfo画面のstate
		let personMailFormData = {};
		// 組織
		personMailFormData.searchSosikiNm = personMailInfo.組織名;
		// ユーザー名検索
		personMailFormData.searchUserNm = personMailInfo.ユーザー名;
		// // 処理年月(YYYY/MM)
		// personMailFormData.searchMailMonth = currentMonth;
		this.props.onSavePersonMailFormData(personMailFormData);
	
	}

	/*
	*  TalentAppへ遷移する
	*/
	onPersonInfoClick = (event, personInfo) => {	
		let personNm = personInfo.ユーザー名;
		let url = CommonUtils.getTalentPageUrl(locationHref, personNm);
		window.open(encodeURI(url));
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

				if (this.state.mailMonthChangeSearchFlag) {

					this.setState({
						// 組織
						searchSosikiNmArray:sosikiNmArray,
						// 処理年月(YYYY/MM)
						mailMonthChangeSearchFlag:false,

						// 組織リスト
						//sosikiGroupData : response.sosikiGroupData,
						// 組織のメール課金を取得する
						sosikiMailInfoData : response.sosikiMailInfoData,
					});

				} else {

					this.setState({
						// 組織
						searchSosikiNmArray:sosikiNmArray,

						// 組織リスト
						//sosikiGroupData : response.sosikiGroupData,
						// 組織のメール課金を取得する
						sosikiMailInfoData : response.sosikiMailInfoData,
					});

				}

			}
		});
	};

	search = (mailInfoData, searchData) => {

		// 組織
		let searchSosikiNm=searchData.searchSosikiNm;
		// 処理年月
		let searchMailMonth=searchData.searchMailMonth;
		// ユーザー名
		let searchUserNm=searchData.searchUserNm;
	
		let dispData=[];
	
		if (mailInfoData && mailInfoData.length>0) {
	
		  dispData = mailInfoData.filter((item,index)=>{
		
			let flag1 = false;
			flag1 = (item.組織名===searchSosikiNm? true: false);
	
			let flag2 = false;
			flag2 = (item.利用年月===searchMailMonth? true: false);	
			
			let flag3 = false;
			if (searchUserNm && searchUserNm!=="") {
				flag3 = item.ユーザー名.indexOf(searchUserNm)>=0?true:false;
			} else {
				flag3 = true;
			}
	
			return flag1&&flag2&&flag3;
		  })
		}
	
		dispData.sort((rec1, rec2)=>{
	
		  let cmp金額合計 = 0;
		  let cmp容量合計 = 0;
		  let cmpユーザー名 = 0;
	
		  let 金額1 = rec1["金額"]?rec1["金額"]:0;
		  let 金額2 = rec2["金額"]?rec2["金額"]:0;
		  cmp金額合計 =  (金額1-金額2)*-1;
	
		  let 容量1 = rec1["容量"]?rec1["容量"]:0;
		  let 容量2 = rec2["容量"]?rec2["容量"]:0;
		  cmp容量合計 =  (容量1-容量2)*-1;

		  if (rec1.ユーザー名==rec2.ユーザー名) {
			cmpユーザー名 = 0;
		  } else if (rec1.ユーザー名>rec2.ユーザー名) {
			cmpユーザー名 = 1;
		  } else if (rec1.ユーザー名<rec2.ユーザー名) {
			cmpユーザー名 = -1;
		  }
	
		  if (cmp金額合計!=0) {
			return cmp金額合計;
		  }
		  if (cmp容量合計!=0) {
			return cmp容量合計;
		  }
		  if (cmpユーザー名!=0) {
			return cmpユーザー名; 
		  }
		  return 0;
		})
	
		return dispData;
	}

	/******************************************************************************/
	/*                             画面レイアウト作成                               */
	/******************************************************************************/
  	render() {		

		// 組織別メール課金(表示用)
		let dispSosikiMailInfoList=[];
		dispSosikiMailInfoList = this.search(this.state.sosikiMailInfoData, this.state);
		//console.log(dispSosikiMailInfoList);

		return (
			<div>	
				
				<div style={{position:'fixed', width:'100%',zIndex:99,backgroundColor:'#FFFFFF'}}>
					<AppBar title={"個人別メール課金"}
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

					<div style={{marginLeft:8, marginRight:8,}}>
						<TextField type="search" 
						style={{width:'100%',}}
						hintText="名前検索" 
						value={this.state.searchUserNm} 
						onChange={this.onSearchUserNmChange} 
						/>
					</div>
				</div>

				<div style={{paddingTop:180, marginLeft:8, marginRight:8,}}>
					<List>
						{dispSosikiMailInfoList.length==0
						?<div style={{textAlign:"center"}}><p>データがありません。</p></div>
						:dispSosikiMailInfoList.map((personMailInfo,index) => {
							
							let rec容量 = personMailInfo["容量"]?personMailInfo["容量"]:0;
							let rec金額 = personMailInfo["金額"]?personMailInfo["金額"]:0;

							return (
								<div key={index} style={{}}>

										<ListItem
										disabled={true}
										key={index}
										style={{paddingLeft:0}}
										primaryText={
											<div style={{display:"flex", alignItems:"center"}}>
												<div style={{display:'inline-block', width:'36%',textAlign:'left',paddingTop:2,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",}}>
													<span style={{cursor:"pointer", color:lightBlue900}} onTouchTap={(event)=>{this.onPersonInfoClick(event, personMailInfo)}}>{personMailInfo.ユーザー名}</span>
												</div>
												<div style={{display:'inline-block', width:'30%',textAlign:'right'}}>{CommonUtils.toThousands(rec容量)}MB</div>
												<div style={{display:'inline-block', width:'30%',textAlign:'right', color:'red'}}>{CommonUtils.toThousands(rec金額)}円</div>
												<div style={{display:'inline-block', width:'3%' ,textAlign:'right'}}>
													<Link to={"/personMailInfo"} 
														style={{textDecoration:"none"}} 
														onTouchTap={()=>{this.onPersonMailLinkClick(personMailInfo)}}>
														<ChevronRightIcon/>
													</Link >
												</div>
											</div>
										}
										/>

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
		// SosikiMailInfo画面のstate
		sosikiMailFormData:state.sosikiMailFormData?state.sosikiMailFormData:null,
		// PersonMailInfo画面のstate
		personMailFormData:state.personMailFormData?state.personMailFormData:null,
	}
  }
  
const mapDispatchToProps = (dispatch) => {
	return {
		// SosikiMailInfo画面のstate
		onSaveSosikiMailFormData: (response) => {
			dispatch(onSaveSosikiMailFormDataEventData(response))
		},
		// PersonMailInfo画面のstate
		onSavePersonMailFormData: (response) => {
			dispatch(onSavePersonMailFormDataEventData(response))
		},
	}
}
  
SosikiMailInfo = connect(
	mapStateToProps,mapDispatchToProps
)(SosikiMailInfo)
  
export default SosikiMailInfo;
