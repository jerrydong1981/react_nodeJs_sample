import { combineReducers } from 'redux';
import {
    EVENTDATA_GETCOMPDAYINFODATA
  , EVENTDATA_GETSOSIKICOMPDAYINFODATA
  , EVENTDATA_GETCOMMONINFODATA
  , EVENTDATA_SETGROUPEXPANDSTATUS
} from '../actions/index';

// 代休状況情報を取得する
function GetCompdayInfoData(state={}, action) {
  switch (action.type) {
    case EVENTDATA_GETCOMPDAYINFODATA:
	    return  action.data;
    default:
      return state;
  }
}

// 組織別代休状況情報を取得する
function GetSosikiCompdayInfoData(state={}, action) {
  switch (action.type) {
    case EVENTDATA_GETSOSIKICOMPDAYINFODATA:
	    return  action.data;
    default:
      return state;
  }
}

// 共通情報を取得する
function GetCommonInfoData(state={}, action) {
  switch (action.type) {
    case EVENTDATA_GETCOMMONINFODATA:
	    return  action.data;
    default:
      return state;
  }
}

// グループＯｐｅｎ状態の設定
function setGroupExpandStatus(state={}, action) {
  switch (action.type) {
    case EVENTDATA_SETGROUPEXPANDSTATUS:
      let newState = {...state};
      newState[action.data.groupNm] = action.data.state;
      return newState;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  compdayInfoData:GetCompdayInfoData,
  sosikiCompdayInfoData:GetSosikiCompdayInfoData,
  commonInfoData:GetCommonInfoData,
  groupExpandStatus:setGroupExpandStatus,
});

export default rootReducer;
