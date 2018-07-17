import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Paper from 'material-ui/Paper';
import reducers from './reducers/reducers';
import './components/bundle.css';

import App from './components/App';
import SosikiMailInfo from './components/SosikiMailInfo';
import PersonMailInfo from './components/PersonMailInfo';

injectTapEventPlugin();

const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStoreWithMiddleware(reducers);

const muiTheme = getMuiTheme({
  fontFamily: "'Noto Sans Japanese', '游ゴシック', YuGothic, 'ヒラギノ角ゴ Pro', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif",
});

ReactDOM.render(
	<Provider store={store}>
			<MuiThemeProvider muiTheme={muiTheme}>

				<Router basename={window.location.pathname}>
					<Paper zDepth={0}  style={{padding:0,}}>
						<Route exact path="/" component={App} />
						<Route path="/sosikiMailInfo" component={SosikiMailInfo} />
						<Route path="/personMailInfo" component={PersonMailInfo} />
					</Paper>
				</Router>

			</MuiThemeProvider>
	</Provider>
	, document.getElementById('react-root')
);
