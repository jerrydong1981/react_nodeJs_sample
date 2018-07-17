import { combineReducers } from 'redux';
import { 
    EVENTDATA_SAVE_APPFORMDATA
  , EVENTDATA_SAVE_SOSIKIMAILFORMDATA
  , EVENTDATA_SAVE_PERSONMAILFORMDATA
} from '../actions/actions';

// APP画面のstateを設定する
function SaveAppFormData(state=null, action) {
  switch (action.type) {
    case EVENTDATA_SAVE_APPFORMDATA:
	    return  action.data
    default:
      return state
  }
}

// SosikiMailInfo画面のstateを設定する
function SaveSosikiMailFormData(state=null, action) {
  switch (action.type) {
    case EVENTDATA_SAVE_SOSIKIMAILFORMDATA:
	    return  action.data
    default:
      return state
  }
}

// PersonMailInfo画面のstateを設定する
function SavePersonMailFormData(state=null, action) {
  switch (action.type) {
    case EVENTDATA_SAVE_PERSONMAILFORMDATA:
	    return  action.data
    default:
      return state
  }
}

const rootReducer = combineReducers({
  appFormData : SaveAppFormData,
  sosikiMailFormData : SaveSosikiMailFormData,
  personMailFormData : SavePersonMailFormData,
});

export default rootReducer;
