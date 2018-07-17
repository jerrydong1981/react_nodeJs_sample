import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import db from '../../db/db';

const MailStrageInfoSchema = new mongoose.Schema({
});

/**
 * 最新処理年月を取得する
 */
MailStrageInfoSchema.statics.getDispMonth = function (searchMonth, callback) {

  this.aggregate([
      {$match : {
        $and: [{ 
                "利用年月": { $lte : searchMonth }
        }]
      }}
      ,{$sort:{'利用年月': -1}}
      ,{ $limit : 1 }
      ,{$project: {
            _id : 0,
            '利用年月' : 1
      }}
  ]).exec(callback);
 
};

/**
 * 組織を取得する
 */
MailStrageInfoSchema.statics.getSosikiGroupInfo = function (callback) {
  this.distinct('組織名').exec(callback);
};

/**
 * 組織別メール課金を取得する
 */
MailStrageInfoSchema.statics.getSosikiMailSumInfo = function (searchMonth, callback) {

  this.aggregate([
      {$match : {
            '利用年月': { $eq : searchMonth } 
      }}
      ,{$group : {_id :{'利用年月':'$利用年月','組織名':'$組織名' },
                  '金額合計' : {$sum: '$金額'}, 
                  '容量合計' : {$sum: '$容量'}, 
      }}
      ,{$project: {
            _id: 0,
            '利用年月':'$_id.利用年月',
            '組織名':'$_id.組織名',
            '金額合計':'$金額合計',
            '容量合計':'$容量合計'
      }}
      ,{$sort:{'金額合計':-1, '組織名': 1}}

  ]).exec(callback);
 
};

/**
 * 個人別メール課金を取得する
 */
MailStrageInfoSchema.statics.getSosikiMailInfo = function (searchMonth, callback) {
  this.find({ '利用年月': { $eq : searchMonth } }).sort({'組織名': 1,'金額': -1, 'ユーザー名': 1}).exec(callback);
};

/**
 * 個人メール課金履歴を取得する
 */
MailStrageInfoSchema.statics.getPersonMailInfo = function (searchData, callback) {  

  let monthStart = searchData.monthStart || '';
  let monthEnd = searchData.monthEnd || ''; 
  let sosiki = searchData.sosiki || '';
  let personNm = searchData.personNm || '';

  // this.aggregate([
  //   {$match : {
  //       $and: [{ 
  //         '利用年月': { $gte:monthStart, $lte:monthEnd }
  //         ,'組織名': { $eq : sosiki }
  //         ,'ユーザー名': { $eq : personNm }
  //       }]
  //   }}
  //   ,{$project: {
  //         _id: 0,
  //         '利用年':{ $substr: [ "$利用年月", 0, 4 ] },
  //         '組織名':1,
  //         'ユーザー名':1,
  //         '利用年月':1,
  //         '容量':1,
  //         '金額':1,
  //     }}
  //   ,{$sort:{'組織名': 1,'ユーザー名':1, '利用年月':-1}}
  // ]).exec(callback);

  this.aggregate([
    {$match : {
        $and: [{ 
           '利用年月': { $gte:monthStart, $lte:monthEnd }
          ,'組織名': { $eq : sosiki }
          ,'ユーザー名': { $eq : personNm }
        }]
    }}
    ,{$project: {
        _id: 0,
        '利用年':{ $substr: [ "$利用年月", 0, 4 ] },
        '組織名':1,
        'ユーザー名':1,
        'メール履歴':{
            '利用年月':"$利用年月",
            '容量':"$容量",
            '金額':"$金額",
        }
    }}
    ,{$sort:{'組織名': 1, 'ユーザー名':1, '利用年':-1, 'メール履歴.利用年月':-1}}
    ,{$group : {_id :{'組織名':'$組織名', 'ユーザー名': '$ユーザー名', '利用年': '$利用年'},
                'メール履歴' : {$push: '$メール履歴'}
  　}}
    ,{$project: {
        _id: 0,
        '利用年':'$_id.利用年',
        '組織名':'$_id.組織名',
        'ユーザー名':'$_id.ユーザー名',
        'メール履歴':1
    }}
    ,{$sort:{'組織名': 1, 'ユーザー名':1, '利用年':-1}}    
  ]).exec(callback);

};

export default db.model('mailStrageInfoData', MailStrageInfoSchema, 'MailStrageInfo');