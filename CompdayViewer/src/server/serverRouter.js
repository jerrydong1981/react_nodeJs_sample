const express = require('express');
const router = express.Router();

import CompdayInfoTable from './js/CompdayInfo';

var contextroot = process.env.npm_package_config_context_root;
var redCardRate = process.env.npm_package_config_red_card_rate;

// 代休状況情報を取得する
router.get(`/${contextroot}/GetCompdayInfoData`, (req, res) => {
    // 処理日(YYYY/MM/DD)
    const searchDate = req.query['searchDate'] || '';
    //console.log("searchDate:"+searchDate);

    let compdayInfoData = [];
    let sosikiCompdayInfoData = [];

    // 代休状況情報を取得する
    CompdayInfoTable.getCompdayInfoData(searchDate, (err1, data1) => {
        if(err1){
            console.log(500);
            console.log('サーバエラー');
        }
        if(data1){
            console.log(200);

            if (data1.length>0) {
                compdayInfoData = data1.filter((item, index)=>{
                    if (item.要員代休情報 && item.要員代休情報.length>0) {
                        return true;
                    }
                });
            }
                       
            // 組織別代休状況情報を取得する
            CompdayInfoTable.getSosikiCompdayInfoData(searchDate, (err2, data2) => {
                if(err2){
                    console.log(500);
                    console.log('サーバエラー');
                }
                if(data2){
                    console.log(200);

                    if (data2.length>0) {
                        sosikiCompdayInfoData = data2.filter((item, index)=>{
                            if (item.組織代休情報 && item.組織代休情報.length>0) {
                                return true;
                            }
                        });
                    }
                
                    res.send({
                        'compdayInfoData':compdayInfoData,
                        'sosikiCompdayInfoData':sosikiCompdayInfoData,
                        'redCardRate':redCardRate
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

module.exports = router;