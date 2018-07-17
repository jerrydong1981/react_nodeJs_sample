// APP画面のstateを設定する
export const EVENTDATA_SAVE_APPFORMDATA = 'EVENTDATA_SAVE_APPFORMDATA';
export function onSaveAppFormDataEventData(response) {
  return {
    "type": EVENTDATA_SAVE_APPFORMDATA,
    "data": response
  }
}

// SosikiMailInfo画面のstateを設定する
export const EVENTDATA_SAVE_SOSIKIMAILFORMDATA = 'EVENTDATA_SAVE_SOSIKIMAILFORMDATA';
export function onSaveSosikiMailFormDataEventData(response) {
  return {
    "type": EVENTDATA_SAVE_SOSIKIMAILFORMDATA,
    "data": response
  }
}

// PersonMailInfo画面のstateを設定する
export const EVENTDATA_SAVE_PERSONMAILFORMDATA = 'EVENTDATA_SAVE_PERSONMAILFORMDATA';
export function onSavePersonMailFormDataEventData(response) {
  return {
    "type": EVENTDATA_SAVE_PERSONMAILFORMDATA,
    "data": response
  }
}
