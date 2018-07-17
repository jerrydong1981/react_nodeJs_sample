
// 代休状況情報を取得する
export const EVENTDATA_GETCOMPDAYINFODATA = 'EVENTDATA_GETCOMPDAYINFODATA';
export function onGetCompdayInfoDataEventData(response) {
  return {
    "type": EVENTDATA_GETCOMPDAYINFODATA,
    "data": response
  }
}

// 組織別代休状況情報を取得する
export const EVENTDATA_GETSOSIKICOMPDAYINFODATA = 'EVENTDATA_GETSOSIKICOMPDAYINFODATA';
export function onGetSosikiCompdayInfoDataEventData(response) {
  return {
    "type": EVENTDATA_GETSOSIKICOMPDAYINFODATA,
    "data": response
  }
}

// 共通情報を取得する
export const EVENTDATA_GETCOMMONINFODATA = 'EVENTDATA_GETCOMMONINFODATA';
export function onGetCommonInfoDataEventData(response) {
  return {
    "type": EVENTDATA_GETCOMMONINFODATA,
    "data": response
  }
}

// グループＯｐｅｎ状態の設定
export const EVENTDATA_SETGROUPEXPANDSTATUS = 'EVENTDATA_SETGROUPEXPANDSTATUS';
export function onSetGroupExpandStatusEventData(groupNm, state) {
  return {
    "type": EVENTDATA_SETGROUPEXPANDSTATUS,
    "data":{
      "groupNm":groupNm,
      "state":state
    }
  }
}
