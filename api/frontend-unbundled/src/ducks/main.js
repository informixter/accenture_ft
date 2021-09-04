import {createAction, createReducer} from "redux-act";

export const setLevel = createAction('set level');
export const setScreen = createAction('set screen');
export const setPortfolioId = createAction('set portfolio id');

const initialState =  {level : null, screen : "MAIN", portfolioId: null};

export const LEVELS_INFO = {
	"LOW" : {
		title : "Начинающий инвестор",
		text : "Вы не готовы к рисковым вложениям. В вашем портфеле нет акций, только облигации.",
		ru: "Консервативный"
	},
	"MEDIUM" : {
		title : "Умеренный инвестор",
		text : "Вы готовы рисковать. Но только в меру. В вашем портфеле должны преобладать облигации, но есть и акции.",
		ru: "Умеренный"
	},
	"HIGH": {
		title : "Профессиональный инвестор",
		text: "Вы готовы рисковать. В вашем порфтеле преобраладают акции с высокой доходностью.",
		ru: "Агрессивный"
	}
};
const main = createReducer({
    [setLevel]: (state, payload) => ({...state, level: payload}),
    [setScreen]: (state, payload) => ({...state, screen: payload}),
    [setPortfolioId]: (state, payload) => ({...state, portfolioId: payload}),
}, initialState);

export default main;
