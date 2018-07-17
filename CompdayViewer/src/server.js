require("babel-register");
const express = require('express');
const webpack = require('webpack');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var webpackMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var config = require("../webpack.config.js");
const path = require('path')
const app = express();
const fatherPath = path.resolve(__dirname, '..');
const moment = require("moment");

const serverRouter = require('./server/serverRouter');
var contextroot = process.env.npm_package_config_context_root;

app.use(cookieParser('CompdayViewer'));
app.use(session({
    secret: 'CompdayViewer',
    cookie: {maxAge: 1000*60*10},  
    resave: true,
    saveUninitialized: true,
}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express-session対応
if (process.env.NODE_ENV === "production") {
	app.use((req, res, next) => {
		
		if(req.session.security_check_result){
			next();
		} else {
			let p = req.query.p;
			if (p && p.length === 8) {
				// パラメータ p をデコードし、結果を t に求める
				// 変数 t の初期化
				var t = "";
				// t に月(2桁合わせ)を連結
				t += ("0"+(p.slice(6,8)-12)).slice(-2);
				// t に日(2桁合わせ)を連結
				t += ("0"+(p.slice(2,4)-t.slice(-2))).slice(-2);
				// t に時(2桁合わせ)を連結
				t += ("0"+(p.slice(4,6)-t.slice(2,4))).slice(-2);
				// tm に分(2桁合わせ)を連結
				t += ("0"+(p.slice(0,2)-17)).slice(-2);
				if (Math.abs(moment().diff(moment(t,"MMDDHHmm"),'minutes')) <= 2) {
					req.session.security_check_result=true;
					next();
				} else {
					req.session.security_check_result=false;
					res.send("<h1>利用できません</h1>")
				}
			} else {
				req.session.security_check_result=false;
				res.send("<h1>利用できません</h1>")
			}
		}
	});
}

// モバイルとパソコンの両対応
app.get(`/${contextroot}/`, (req, res) => {
	var userAgent = req.headers['user-agent'].toLowerCase();
	//console.log("userAgent:"+userAgent);

	var tannmatuType="0";
	if (userAgent.indexOf("android") != -1) {
		// android
		tannmatuType="1";
	} else if (userAgent.indexOf("mac os") != -1) {
		// mac
		tannmatuType="2";
	}  else if (userAgent.indexOf("windows phone") != -1) {
		// windows phone
		tannmatuType="3";
	} else {
		//pc
		tannmatuType="0";
	}

	if (tannmatuType=="0") {
		res.sendFile(`${fatherPath}/${contextroot}/indexPC.html`);
	} else {
		res.sendFile(`${fatherPath}/${contextroot}/index.html`);
	}
});

if (process.env.NODE_ENV !== "production") {
    const compiler = webpack(config);
		app.use(webpackMiddleware(compiler, { 
			quiet: true, 
			colors: true,
			'errors-only': true,
			publicPath: config.output.publicPath 
		}));
    app.use(webpackHotMiddleware(compiler,{log:console.log})); 
	app.use(`/${contextroot}`, express.static(path.join(fatherPath, `${contextroot}`)));
} else {
    app.use(express.static('./'));
	app.use(`/${contextroot}`, express.static(path.join(fatherPath, `${contextroot}`)));
}

app.get(`/${contextroot}/sosikiCompdayInfo/*`, (req, res) => {
	res.redirect(`/${contextroot}/`);
	res.end();
});

// Express Router
app.use(serverRouter);


const port = (process.env.NODE_ENV !== "production")?process.env.npm_package_config_dev_port:process.env.npm_package_config_production_port;

app.listen(port, () => {
  console.log('app listening on', port);
});