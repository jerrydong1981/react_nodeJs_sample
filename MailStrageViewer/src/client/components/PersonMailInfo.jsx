import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import request from 'superagent';
const nocache = require('superagent-no-cache');

import GroupArray from 'group-array';

import {white, grey700, grey500, lightBlue900,orange500,orange900} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import LinearProgress from 'material-ui/LinearProgress';

import { 
    onSavePersonMailFormDataEventData
} from '../actions/actions';

import Constants from '../../common/Constants';
import CommonUtils from '../../common/CommonUtils';

class PersonMailInfo extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			// 画面項目
			// 組織
			searchSosikiNm:"",
			// ユーザー名
			searchUserNm:"",

			// 画面データ
			// 個人メール課金履歴
			personMailInfoData:[],
		};
	}

	/******************************************************************************/
	/*                             画面イベント処理                                */
	/******************************************************************************/

	/*
	*  初期化処理
	*/
	componentWillMount = () => {		
		//console.log("PersonMailInfo.componentWillMount");
		//console.log(this.props.personMailFormData);

		let searchData = CommonUtils.deepCopy(this.props.personMailFormData);

		// データを取得する
		this.getPersonMailInfoData(searchData);
	}
	componentDidMount = () => {
		window.scroll(0,0);
	}

	/******************************************************************************/
	/*                             サブ関数定義                                    */
	/******************************************************************************/

	/*
	*  個人メール課金履歴を取得する
	*/
	getPersonMailInfoData = (searchMonth) => {

		// システム日付を取得する
		let currentMonth = CommonUtils.getSysDate().slice(0,7);

		// 個人メール課金履歴を取得する
		let url_projectData = urlpathname+"GetPersonMailInfoData";
		//console.log("url_projectData:"+url_projectData);

		let searchData={};
		searchData.sosiki = searchMonth.searchSosikiNm;
		searchData.personNm = searchMonth.searchUserNm;
		searchData.searchMonth = currentMonth;

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

				this.setState({
					// 組織
					searchSosikiNm : searchMonth.searchSosikiNm,
					// ユーザー名
					searchUserNm : searchMonth.searchUserNm,
					// 組織のメール課金
					personMailInfoData : response.personMailInfoData,
				});

			}
		});
	};

	/*
	*  個人メール課金履歴を取得する
	*/
	getMaxValue = (personMailInfoList) => {

		let dataList = [];
		if (personMailInfoList && personMailInfoList.length>0) {
			personMailInfoList.map((item, index)=>{
				if (item.メール履歴 && item.メール履歴.length>0) {
					item.メール履歴.map((rec)=>{
						dataList.push(rec.金額)
					})
				}
			})
		}

		let maxValue = Math.max(...dataList);
		return maxValue;
	}


	/******************************************************************************/
	/*                             画面レイアウト作成                               */
	/******************************************************************************/
  	render() {

		let dispPersonMailInfoList=[];
		if (this.state.personMailInfoData && this.state.personMailInfoData.length>0) {
			dispPersonMailInfoList = this.state.personMailInfoData;
		}
		//console.log(dispPersonMailInfoList);

		let max金額 = this.getMaxValue(dispPersonMailInfoList);
		let rowCnt = dispPersonMailInfoList.length;

		return (
			<div>	
				
				<div style={{position:'fixed', width:'100%',zIndex:99,backgroundColor:'#FFFFFF'}}>
					<AppBar title={"メール課金履歴"}
						showMenuIconButton={true}
						style={{backgroundColor:lightBlue900}}
						iconElementLeft={
						<IconButton onTouchTap={()=>{this.props.history.goBack()}}>
							<BackIcon color='#FFFFFF'/>
						</IconButton>
						}	
					/>

					<div style={{width:'100%', color:'#FFFFFF',backgroundColor:orange900,}}>
						<div style={{display:'inline-block',width:'50%',}}>
						  <span style={{paddingLeft:8}}>{this.state.searchSosikiNm}</span>
						</div>
						<div style={{display:'inline-block',width:'50%',textAlign:'right'}}>
						  <span style={{paddingRight:8}}>{this.state.searchUserNm}</span>
						</div>
					</div>
				</div>

				<div style={{paddingTop:89,marginLeft:8, marginRight:8,}}>

					{dispPersonMailInfoList.length==0
					 ?<div style={{textAlign:"center"}}><p>データがありません。</p></div>
					 :dispPersonMailInfoList.map((item,index1)=>{

						return (
							<div key={index1} style={{paddingTop:16}}>
								<div style={{fontWeight:'bold',color:grey700,}}>{item.利用年}年</div>
								<List>
								{
									item.メール履歴.map((rec, index2)=>{
										return (											
											<ListItem
												disabled={true}
												key={index2}
												style={{paddingLeft:0,paddingTop:8,paddingRight:0,paddingBottom:4}}
												primaryText={
													<div>
														<div style={{display:"inline-block", width:"14%", fontWeight:'bold',color:grey500,verticalAlign:"top"}}>{parseInt(rec.利用年月.slice(5,7),10)}月</div>
														<div style={{display:"inline-block", width:"82%", marginLeft:8,}}>
															<LinearProgress style={{height:16,backgroundColor:white}}
																mode="determinate"
																min={0} max={max金額}
																color={orange500}
																value={rec.金額} >
															</LinearProgress>
														</div>
													</div>
												}
												secondaryText={
													<div>
														<div style={{display:"inline-block", width:"14%",}}> </div>
														<div style={{display:"inline-block", width:"82%", marginLeft:8,fontSize:12, color:grey700}}>
															{CommonUtils.toThousands(rec.容量)}MB　{CommonUtils.toThousands(rec.金額)}円　
														</div>
													</div>
												}
											/>
										);
									})
								}
								</List>
								<Divider style={{visibility:(rowCnt-1)==index1?"hidden":"visible"}}/>
							</div>
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
		// PersonMailInfo画面のstate
		personMailFormData:state.personMailFormData?state.personMailFormData:null,
	}
  }
  
const mapDispatchToProps = (dispatch) => {
	return {
		// PersonMailInfo画面のstate
		onSavePersonMailFormData: (response) => {
			dispatch(onSavePersonMailFormDataEventData(response))
		},
	}
}
  
PersonMailInfo = connect(
	mapStateToProps,mapDispatchToProps
)(PersonMailInfo)
  
export default PersonMailInfo;
