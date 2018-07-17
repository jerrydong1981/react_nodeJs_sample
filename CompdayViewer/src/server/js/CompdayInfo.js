import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import db from '../../db/db';

const CompdayInfoSchema = new mongoose.Schema({
});

// 代休状況情報を取得する
CompdayInfoSchema.statics.getCompdayInfoData = function (searchDate, callback) {  
	//console.log("searchDate:"+searchDate);
	this.aggregate([
		  {$match : {
				 $and: [{ 
					 "更新日": { $lte : searchDate }
				 }]
		   }}
		  ,{$sort:{'組織名':1,'更新日': -1}}
		  ,{$group:{_id: {'組織名':'$組織名'},
			 '更新日':{"$first":'$更新日'},
			 '組織名':{"$first":'$組織名'},
			 '要員代休情報':{"$first":'$要員代休情報'}
		   }}
		  ,{$project: {
				_id : 0,
				'更新日' : 1,
				'組織名' : 1,
				"要員代休情報" : 1
		  }}
	]).exec(callback);
};

// 代休状況情報を取得する
CompdayInfoSchema.statics.getSosikiCompdayInfoData = function (searchDate, callback) {  
	//console.log("searchDate:"+searchDate);
	this.aggregate([
		{$match : {
			   $and: [{ 
				   "更新日": { $lte : searchDate }
			   }]
		 }}
		,{$sort:{'組織名':1,'更新日': -1}}
		,{$group:{_id: {'組織名':'$組織名'},
		   '更新日':{"$first":'$更新日'},
		   '組織名':{"$first":'$組織名'},
		   '要員代休情報':{"$first":'$要員代休情報'}
		 }}
		,{ $unwind : '$要員代休情報'}
		,{$project: {
				_id : 0,
				'更新日' : 1,
				'組織名' : 1,
				'社員ID' : '$要員代休情報.社員ID',
				'社員名' : '$要員代休情報.社員名',
				'管理区分': '$要員代休情報.管理区分',
				'休出日数': '$要員代休情報.休出日数',
				'全出日数': '$要員代休情報.全出日数',
				'代休日数': '$要員代休情報.代休日数'
		}}
		,{$group : {_id :{'組織名':'$組織名','管理区分':'$管理区分'},
					'更新日':{"$first":'$更新日'},
					'休出日数' : {'$sum': '$休出日数'}, 
					'全出日数' : {'$sum':'$全出日数'},
					'代休日数' : {'$sum':'$代休日数'}
		}}
		,{$project: {
				_id : 0,
				'更新日':'$更新日',
				'組織名' : '$_id.組織名',
				'組織代休情報': {
					'管理区分' : '$_id.管理区分',
					'休出日数': '$休出日数',
					'全出日数': '$全出日数',
					'代休日数': '$代休日数'
				}
		}}
		,{$sort:{'組織名':1, '組織代休情報.管理区分': 1}}
		,{$group : {_id :{'組織名':'$組織名'},
					'更新日':{"$first":'$更新日'},
					'組織代休情報' : {$push: '$組織代休情報'}
		}}
		,{$project: {
				_id : 0,
				'更新日':1,
				'組織名' : '$_id.組織名',
				'組織代休情報':1
		}}
		
	]).exec(callback);
};

export default db.model('compdayInfoData', CompdayInfoSchema, 'compdayInfo');