import React, { Component } from 'react';
import { connect } from 'react-redux'

import {lightBlue900,orange900,grey700,red500} from 'material-ui/styles/colors';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import {Card, CardHeader, CardText,CardActions} from 'material-ui/Card';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';

import { 
    onGetCompdayInfoDataEventData
  , onGetCommonInfoDataEventData
} from '../actions/index';

const commonUtils = require('./commonUtils');
const SORTNMARRAY=["代休取得率","休出","全出","代休"];

class SosikiCompdayInfo extends Component {
	
	constructor(props, context) {
		super(props, context);
		this.state = {
			// 社員名
			searchUserNm:"",
			// ソート
			searchSortNm:SORTNMARRAY[0],
			searchSortNmArray:SORTNMARRAY,
			isSortAsc:true, // true:昇順 false:降順
		};
	}

	/******************************************************************************/
	/*                             画面イベント処理                                */
	/******************************************************************************/

	componentWillMount = () => {	
	}
  
	componentDidMount = () => {
		window.scroll(0,0);
	}

	/*
	*  社員名検索処理
	*/
	onSearchUserNmChange = (event, newValue) => {
		window.scroll(0,0);
		this.setState({
			searchUserNm:newValue
		});
	}
	/*
	*  ソート項目選択処理
	*/
	onSearchSortNmSelectChange = (event, index, value) => {
		window.scroll(0,0);
		this.setState({
			searchSortNm:value
		});
	}
	/*
	*  ソート選択処理
	*/
	onSortCheck=(event, isInputChecked) => {
		window.scroll(0,0);
		this.setState({
			isSortAsc: isInputChecked,
		})
	}

	/*
	*  TalentAppへ遷移する
	*/
	onPersonInfoClick = (event, personInfo) => {
		
		let personId = personInfo.社員ID;
		let url = commonUtils.getTalentPageUrl(locationHref, personId);
		window.open(url)
	}

	/******************************************************************************/
	/*                             サブ関数定義                                    */
	/******************************************************************************/
		
	search = (compdayInfoData, sosikiNm) => {
		let dispCompdayInfoList = null;

		if (sosikiNm==='全体') {
			let maxUpdDate = '';
			let 全体の要員代休情報=[];
			if (compdayInfoData && compdayInfoData.length>0) {
				compdayInfoData.map((groupRec, index1)=>{

					if (groupRec.要員代休情報 && groupRec.要員代休情報.length>0) {
						全体の要員代休情報.push(...groupRec.要員代休情報);
						// groupRec.要員代休情報.map((item, index2)=>{
						// 	全体の要員代休情報.push(item);
						// })
					}
					
					if (groupRec.更新日>maxUpdDate) {
						maxUpdDate = groupRec.更新日;
					}

				});
			}

			dispCompdayInfoList = {
				'更新日':maxUpdDate,
				'組織名':'全体',
				'要員代休情報':全体の要員代休情報
			}
		} else {
			if (compdayInfoData && compdayInfoData.length>0) {
				let tempData = compdayInfoData.filter(item => item.組織名===sosikiNm);
				if (tempData && tempData.length> 0) {
					dispCompdayInfoList = tempData[0];
				}
			}
		}

		// 社員名を検索処理
		if (this.state.searchUserNm && this.state.searchUserNm!=="") {
			if (dispCompdayInfoList && dispCompdayInfoList.要員代休情報 && dispCompdayInfoList.要員代休情報.length>0) {
				let temp要員代休情報 = dispCompdayInfoList.要員代休情報.filter((item)=>{
					return item.社員名.indexOf(this.state.searchUserNm)>=0?true:false;
				});
				dispCompdayInfoList.要員代休情報 = temp要員代休情報;
			}
		}

		if (dispCompdayInfoList && dispCompdayInfoList.要員代休情報 && dispCompdayInfoList.要員代休情報.length>0) {
			dispCompdayInfoList.要員代休情報.sort((itemA, itemB)=>{
				if (itemA.社員ID > itemB.社員ID) {
					return 1;
				} else if (itemA.社員ID < itemB.社員ID) {
					return -1;
				} else {
					return 0;
				}
			})
		}

		return dispCompdayInfoList;
	}

	getDetail = (dispCompdayInfoList, kbn) => {
		
		let disp要員時間情報 = [];
		if (dispCompdayInfoList && dispCompdayInfoList.要員代休情報 && dispCompdayInfoList.要員代休情報.length>0) {
			disp要員時間情報 = dispCompdayInfoList.要員代休情報;
		}

		if(disp要員時間情報.length>0) {
			let disp要員時間情報Array = disp要員時間情報.filter(item => item.管理区分===kbn);

			if (disp要員時間情報Array.length>0) {

				// ソート処理 start
				disp要員時間情報Array.sort((rec1, rec2) => {
				
					let 取得率flag = 0;
					let 休出日数flag = 0;
					let 全出日数flag = 0;
					let 代休日数flag = 0;
					let 社員flag = 0;

					// レコード１
					let 休出日数1=(rec1.休出日数?rec1.休出日数:0);
					let 全出日数1=(rec1.全出日数?rec1.全出日数:0);
					let 代休日数1=(rec1.代休日数?rec1.代休日数:0);
					// 取得率(代休/全出)
					let 取得率1 = 1;
					if (全出日数1!=0) {
						取得率1 = 代休日数1/全出日数1;
					}
					// レコード２
					let 休出日数2=(rec2.休出日数?rec2.休出日数:0);
					let 全出日数2=(rec2.全出日数?rec2.全出日数:0);
					let 代休日数2=(rec2.代休日数?rec2.代休日数:0);
					// 取得率(代休/全出)
					let 取得率2 = 1;
					if (全出日数2!=0) {
						取得率2 = 代休日数2/全出日数2;
					}

					// ソート(昇順)
					休出日数flag = 休出日数1-休出日数2;
					全出日数flag = 全出日数1-全出日数2;
					代休日数flag = 代休日数1-代休日数2;
					取得率flag = 取得率1-取得率2;
					if (rec1.社員ID > rec1.社員ID) {
						社員flag = 1;
					} else if (rec1.社員ID < rec1.社員ID) {
						社員flag = -1;
					} else {
						社員flag = 0;
					}
					
					// ソート処理
					let sortItem = this.state.searchSortNm;
					let sortAscDec = this.state.isSortAsc? 1: -1;
					if (sortItem === "代休取得率") {
						// 個人別代休状況
						// Key1：取得率(代休/全出)の昇順・降順　←分母は全出です
						// Key2：全出日数の降順
						// でソートしてください。
						if (取得率flag!=0) {
							return 取得率flag*sortAscDec;
						}
						if (全出日数flag!=0) {
							return (全出日数flag*-1);
						}
					} else if (sortItem === "休出") {
						if (休出日数flag!=0) {
							return 休出日数flag*sortAscDec;
						}
					} else if (sortItem === "全出") {
						if (全出日数flag!=0) {
							return 全出日数flag*sortAscDec;
						}
					} else if (sortItem === "代休") {
						if (代休日数flag!=0) {
							return 代休日数flag*sortAscDec;
						}
					}

					if (社員flag!=0) {
						return 社員flag;
					}

					return 0;
				})
				// ソート処理 end

				let sum休出日数 = disp要員時間情報Array.map(item => item.休出日数).reduce((a,b) => (a+b));
				let sum全出日数 = disp要員時間情報Array.map(item => item.全出日数).reduce((a,b) => (a+b));
				let sum代休日数 = disp要員時間情報Array.map(item => item.代休日数).reduce((a,b) => (a+b));
				return (
					<div>
						<Card key={kbn==="0"?"事業遂行職":"管理職"}
							style={{marginLeft:5,marginRight:5,marginTop:20,marginBottom:20,width:'97%',borderRadius:'5px'}}
							initiallyExpanded={true}>
			
							<CardHeader
								titleStyle={{fontWeight:'bold', color:grey700}}  style={{padding:5,}}
								title={kbn==="0"?"事業遂行職":"管理職"}
								actAsExpander={true}
								showExpandableButton={true} />
				
							<CardText expandable={true}  style={{padding:5,}}>
								<Table selectable={false} fixedHeader={true} headerStyle={{height:32}}>
									<TableHeader adjustForCheckbox={false} displaySelectAll={false}   style={{fontWeight:'bold',}}>
										<TableRow style={{height:15}}>
											<TableHeaderColumn width="37%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>名前</TableHeaderColumn>
											<TableHeaderColumn width="21%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>休出</TableHeaderColumn>
											<TableHeaderColumn width="21%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>全出</TableHeaderColumn>
											<TableHeaderColumn width="21%" style={{color:'#795548', fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>代休</TableHeaderColumn>
										</TableRow>
									</TableHeader>
									<TableBody displayRowCheckbox={false}>
										{
											disp要員時間情報Array.map((item,index)=>{
												let userColor = this.getColor(item);
												return (
														<TableRow key={index} style={{ color:grey700, cursor:"pointer"}} onTouchTap={(event)=>{this.onPersonInfoClick(event, item)}}>
															<TableHeaderColumn width="37%" style={{color:userColor, paddingLeft:5,height:25,fontSize:14, overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{item.社員名}</TableHeaderColumn>
															<TableHeaderColumn width="21%" style={{color:userColor, paddingLeft:5,height:25,fontSize:14}}>{item.休出日数?item.休出日数:0}</TableHeaderColumn>
															<TableHeaderColumn width="21%" style={{color:userColor, paddingLeft:5,height:25,fontSize:14}}>{item.全出日数?item.全出日数:0}</TableHeaderColumn>
															<TableHeaderColumn width="21%" style={{color:userColor, paddingLeft:5,height:25,fontSize:14}}>{item.代休日数?item.代休日数:0}</TableHeaderColumn>
														</TableRow>
													)
											})
										}
										<TableRow style={{ color:grey700}}>
											<TableHeaderColumn width="37%" style={{color:grey700, fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>合計(日数)</TableHeaderColumn>
											<TableHeaderColumn width="21%" style={{color:grey700, fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>{sum休出日数}</TableHeaderColumn>
											<TableHeaderColumn width="21%" style={{color:grey700, fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>{sum全出日数}</TableHeaderColumn>
											<TableHeaderColumn width="21%" style={{color:grey700, fontWeight:'bold',paddingLeft:5,height:25,fontSize:14}}>{sum代休日数}</TableHeaderColumn>
										</TableRow>
									</TableBody>
								</Table>
							</CardText>
			
						</Card>
					</div>
				);
			} else {
				return null;
			}
			
		} else {
			return null;
		}
	}

	getColor = (item) => {
		
		let color = grey700;

		let 代休日数=(item.代休日数?item.代休日数:0);
		let 全出日数=(item.全出日数?item.全出日数:0);
		if (全出日数>0) {
			color = ((代休日数/全出日数)<this.props.commonInfoData.redCardRate)?red500:grey700;
		}
		
		return color;
	}

	/******************************************************************************/
	/*                             画面レイアウト作成                               */
	/******************************************************************************/
  	render() {

		let sosikiNm = this.props.match.params.sosikiNm;
		let compdayInfoData = commonUtils.deepCopy(this.props.compdayInfoData);

		let dispCompdayInfoList = this.search(compdayInfoData, sosikiNm);
		let updDate = dispCompdayInfoList?dispCompdayInfoList.更新日:"";

		return (
			<div>	

				<div style={{position:'fixed', width:'100%',zIndex:99,backgroundColor:'#FFFFFF'}}>
					<AppBar title={"個人別代休状況"}
						showMenuIconButton={true}
						style={{backgroundColor:lightBlue900}}
						iconElementLeft={
						<IconButton onTouchTap={()=>{this.props.history.goBack()}}>
							<BackIcon color='#FFFFFF'/>
						</IconButton>
						}	
					/>
					<div style={{width:'100%', color:'#FFFFFF',}}>
						<div style={{paddingRight:10,textAlign:'right' ,backgroundColor:orange900}}>
							{updDate===""?"　":updDate+" 時点"}
						</div>
					</div>

					<div style={{marginTop:12,paddingLeft:"10%",paddingRight:"10%",
								textAlign:'center',color:grey700,fontSize:'1.17em',fontWeight:'bold',
								overflow:"hidden", whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
						{dispCompdayInfoList.組織名}
					</div>

					<div style={{paddingLeft:8,paddingRight:8,}}>
						<TextField
							floatingLabelText="名前"
							value={this.state.searchUserNm} 
							onChange={this.onSearchUserNmChange}
							type="search"
							style={{verticalAlign:'bottom',width:"45%",}}
						/>

						<SelectField
							floatingLabelText="ソート"    
							value={this.state.searchSortNm} 
							onChange={this.onSearchSortNmSelectChange} 
							style={{verticalAlign:'bottom',width:"45%",marginLeft:10,}}>
							{
								this.state.searchSortNmArray.map((sortNm, index)=>{
									return (
										<MenuItem key={index}  value={sortNm} primaryText={sortNm} />
									);
								})
							}
						</SelectField>

						<Checkbox
							checkedIcon={<ArrowUpward/>}
							uncheckedIcon={<ArrowDownward/>}
							iconStyle={{fill: '#26C6DA', paddingTop:4}}
							checked={this.state.isSortAsc}
							onCheck={this.onSortCheck} 
							style={{width:"5%", height:40, display:'inline-block',}}
						/>
                  	</div>

				</div>

				<div style={{paddingTop:192}}>
					{
						(dispCompdayInfoList && dispCompdayInfoList.要員代休情報 && dispCompdayInfoList.要員代休情報.length>0)
						?(
							<div>
								<div>
									{this.getDetail(commonUtils.deepCopy(dispCompdayInfoList), "0")}
								</div>
								<div>
									{this.getDetail(commonUtils.deepCopy(dispCompdayInfoList), "1")}
								</div>
							</div>
						)
						:<div style={{textAlign:"center"}}><p>データがありません。</p></div>
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
		// 共通情報
		commonInfoData:state.commonInfoData?state.commonInfoData:null,

	}
  }
  
const mapDispatchToProps = (dispatch) => {
	return {
		// 代休状況情報
		onGetCompdayInfoDataData: (response) => {
			dispatch(onGetCompdayInfoDataEventData(response))
		},
		// 共通情報
		onGetCommonInfoData: (response) => {
			dispatch(onGetCommonInfoDataEventData(response))
		},
	}
}
  
SosikiCompdayInfo = connect(
	mapStateToProps,mapDispatchToProps
)(SosikiCompdayInfo)
  
export default SosikiCompdayInfo;
