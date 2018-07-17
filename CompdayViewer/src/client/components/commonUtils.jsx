exports.deepCopy = function (o) {
    if (o instanceof Array) {
        let n = [];
        for (let i = 0; i < o.length; ++i) {
            n[i] = this.deepCopy(o[i]);
        }
        return n;
    } else if (o instanceof Object) {
        let n = {}
        for (let i in o) {
            n[i] = this.deepCopy(o[i]);
        }
        return n;
    } else {
        return o;
    }
};

exports.padding = function (num, digit, str) {
  let formatStr = '';
  for (let i = 0, len = digit; i < len; i++) {
    formatStr += str;
  }
  return (formatStr + num).slice(-digit);
};

exports.zeroPadding = function (num, digit) {
  if (!num) return num;
  return this.padding(num, digit, '0');
};

exports.getSysDate = function () {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return year + '/' + this.zeroPadding(month, 2) + '/' + this.zeroPadding(day, 2);
};

exports.dateAddMonth = function (date, num) {

  let date1 = date.replace(/\//g,"");
  const newDate = new Date(date1.slice(0, 4) + '/' + date1.slice(4, 6) + '/' + date1.slice(6, 8));
  newDate.setMonth(newDate.getMonth() + num);

  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();

  return year + '/' + this.zeroPadding(month, 2) + '/' + this.zeroPadding(day, 2);
};


exports.toThousands = function (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};

exports.dealKanjiNumber = function(target) {
    if(!target || !isNaN(target)) return target;
    return target.replace(new RegExp('一', 'g'), 0)
                .replace(new RegExp('二', 'g'), 1)
                .replace(new RegExp('三', 'g'), 2)
                .replace(new RegExp('四', 'g'), 3)
                .replace(new RegExp('五', 'g'), 4)
                .replace(new RegExp('六', 'g'), 5)
                .replace(new RegExp('七', 'g'), 6)
                .replace(new RegExp('八', 'g'), 7)
                .replace(new RegExp('九', 'g'), 8)
                .replace(new RegExp('十', 'g'), 9);
};

exports.getTalentPageUrl = function (url, userIdName) {

    // 現在の時刻オブジェクトを作成
    var t = new Date();
    // 変数 p の初期化
    var p = "";
    // p に分+17(2桁合わせ)を連結
    p += ("0"+(t.getMinutes()+17)).slice(-2);
    // p に日+月(2桁合わせ)を連結
    p += ("0"+(t.getDate()+(t.getMonth()+1))).slice(-2);
    // p に時+日(2桁合わせ)を連結
    p += ("0"+(t.getHours()+t.getDate())).slice(-2);
    // p に月+12(2桁合わせ)を連結
    p += ("0"+(t.getMonth()+13)).slice(-2);

    let pageUrl = url + "talent/Staff/" + userIdName + "?p=" + p + "&closeflag=1";
    return pageUrl;

}
