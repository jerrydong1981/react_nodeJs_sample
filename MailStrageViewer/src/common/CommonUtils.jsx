const CommonUtils ={

    deepCopy : function (o) {
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
    },
    padding : function (num, digit, str) {
        let formatStr = '';
        for (let i = 0, len = digit; i < len; i++) {
          formatStr += str;
        }
        return (formatStr + num).slice(-digit);
    },
    zeroPadding : function (num, digit) {
        if (!num && num!==0) return num;
        return this.padding(num, digit, '0');
    },
    getSysDate : function () {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
      
        return year + '/' + this.zeroPadding(month, 2) + '/' + this.zeroPadding(day, 2);
    },
    getSysDateTime : function () {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
    
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
      
        return year + '/' + this.zeroPadding(month, 2) + '/' + this.zeroPadding(day, 2) + " " +
               this.zeroPadding(hours, 2)+ ':' +this.zeroPadding(minutes, 2)+ ':' +this.zeroPadding(seconds, 2);
    },
    dateAddHour : function(date, num) {

        let today = new Date(date);
        today.setHours (today.getHours () + num);

        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
    
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
      
        return year + '/' + this.zeroPadding(month, 2) + '/' + this.zeroPadding(day, 2) + " " +
               this.zeroPadding(hours, 2)+ ':' +this.zeroPadding(minutes, 2)+ ':' +this.zeroPadding(seconds, 2);
    },
    dateAddMonth : function (date, num) {
        
        let date1 = date.replace(/\//g,"");
        const newDate = new Date(date1.slice(0, 4) + '/' + date1.slice(4, 6) + '/' + date1.slice(6, 8));
        newDate.setMonth(newDate.getMonth() + num);
    
        const year = newDate.getFullYear();
        const month = newDate.getMonth() + 1;
        const day = newDate.getDate();
    
        return year + '/' + this.zeroPadding(month, 2) + '/' + this.zeroPadding(day, 2);
    },
    toThousands : function (num) {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    getTalentPageUrl : function (url, userIdName) {

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
    
    },
}

export default CommonUtils