const express = require('express');
const router = express.Router();

import CommonUtils from '../common/CommonUtils';

import MailStrageInfoTable from './js/MailStrageInfo';

var contextroot = process.env.npm_package_config_context_root;

// 組織別メール課金を取得する
router.post(`/${contextroot}/GetSosikiMailInfoData`, (req, res) => {

    // 組織別メール課金合計
    let sosikiMailSumInfoData = null;
    // 組織別メール課金
    let sosikiMailInfoData = null;
    // 組織リスト
    let sosikiGroupData = null;

    // 処理月(YYYY/MM)
    let searchMonth = '';
    if (req.body.data) {
        searchMonth = req.body.data['searchMonth'] || '';
    }

    if (searchMonth==='') {
        let currentMonth = CommonUtils.getSysDate().slice(0,7);

        // 最新処理年月を取得する
        MailStrageInfoTable.getDispMonth(currentMonth, (err, data) => {
            if(err){
                console.log(500);
                console.log('サーバエラー');
            }
            if(data){
                console.log(200);
                if (data && data.length>0) {
                    searchMonth = data[0].利用年月;
                } else {
                    searchMonth = currentMonth;
                }
            } else {
                console.log(404);
                searchMonth = currentMonth;
            }
            
            // 組織別メール課金を取得する
            // console.log("searchMonth:"+searchMonth);
            MailStrageInfoTable.getSosikiMailSumInfo(searchMonth, (err1, data1) => {
                if(err1){
                    console.log(500);
                    console.log('サーバエラー');
                }
                if(data1){
                    console.log(200);
                    sosikiMailSumInfoData = data1;
        
                    MailStrageInfoTable.getSosikiMailInfo(searchMonth, (err2, data2) => {
                        if(err2){
                            console.log(500);
                            console.log('サーバエラー');
                        }
                        if(data2){
                            console.log(200);
                            sosikiMailInfoData = data2;
            
                            MailStrageInfoTable.getSosikiGroupInfo((err3, data3) => {
                                if(err3){
                                    console.log(500);
                                    console.log('サーバエラー');
                                }
                                if(data3){
                                    console.log(200);
                                    sosikiGroupData=data3.sort();
        
                                    res.send({
                                        'sosikiGroupData':sosikiGroupData,
                                        'sosikiMailSumInfoData':sosikiMailSumInfoData,
                                        'sosikiMailInfoData':sosikiMailInfoData,
                                    });
                        
                                } else {
                                    console.log(404);
                                }
                            });
        
                        } else {
                            console.log(404);
                        }
                    });
         
                } else {
                    console.log(404);
                }
            });

        });        
    } else {
    
        // 組織別メール課金を取得する
        // console.log("searchMonth:"+searchMonth);
        MailStrageInfoTable.getSosikiMailSumInfo(searchMonth, (err1, data1) => {
            if(err1){
                console.log(500);
                console.log('サーバエラー');
            }
            if(data1){
                console.log(200);
                sosikiMailSumInfoData = data1;
    
                MailStrageInfoTable.getSosikiMailInfo(searchMonth, (err2, data2) => {
                    if(err2){
                        console.log(500);
                        console.log('サーバエラー');
                    }
                    if(data2){
                        console.log(200);
                        sosikiMailInfoData = data2;
        
                        MailStrageInfoTable.getSosikiGroupInfo((err3, data3) => {
                            if(err3){
                                console.log(500);
                                console.log('サーバエラー');
                            }
                            if(data3){
                                console.log(200);
                                sosikiGroupData=data3.sort();
    
                                res.send({
                                    'sosikiGroupData':sosikiGroupData,
                                    'sosikiMailSumInfoData':sosikiMailSumInfoData,
                                    'sosikiMailInfoData':sosikiMailInfoData,
                                });
                    
                            } else {
                                console.log(404);
                            }
                        });
    
                    } else {
                        console.log(404);
                    }
                });
     
            } else {
                console.log(404);
            }
        });

    }
});

// 個人メール課金履歴を取得する
router.post(`/${contextroot}/GetPersonMailInfoData`, (req, res) => {

    // 処理月(YYYY/MM)
    let searchMonth = '';
    // 組織
    let sosiki = '';
    // ユーザー
    let personNm = '';

    if (req.body.data) {
        searchMonth = req.body.data['searchMonth'] || '';
        sosiki = req.body.data['sosiki'] || '';
        personNm = req.body.data['personNm'] || '';
    } 
    
    // 前12ヶ月の履歴
    let monthStart = CommonUtils.dateAddMonth(searchMonth + '/01', -11).slice(0,7);
    let monthEnd = searchMonth;

    //console.log("searchMonth:"+searchMonth);

    let searchData={};
    searchData.monthStart=monthStart;
    searchData.monthEnd=monthEnd;
    searchData.sosiki=sosiki;
    searchData.personNm=personNm;

    MailStrageInfoTable.getPersonMailInfo(searchData, (err, data) => {
        if(err){
            console.log(500);
            console.log('サーバエラー');
        }
        if(data){
            console.log(200);

            res.send({
                'personMailInfoData':data
            });

        } else {
            console.log(404);
        }
    });

});

module.exports = router;