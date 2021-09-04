import {persistReducer, persistStore} from "redux-persist";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import main, {
	setLevel, setPortfolioId, setScreen
} from "./ducks/main";
import storage from 'redux-persist/lib/storage'

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export let persistorLink;

export function configureStore ()
{
    const middlewares = [];
    if (development)
    {
        const {logger} = require(`redux-logger`);
        middlewares.push(logger);
    }

    const withStorage = true;

    const rootReducer = combineReducers({
        main : withStorage ? persistReducer({key: "main", storage, blacklist: ['searchScreenOpened', 'additionalResult', 'settingsScreenOpened']}, main) : main
    });
    const enhancer = compose(applyMiddleware(...middlewares));
    const store = createStore(rootReducer, enhancer);
    const persistor = persistStore(store);
    persistorLink = persistor;

    assignActionsCreators(store);

    return {store, persistor};
}

function assignActionsCreators (store) {
	setLevel.assignTo(store);
	setScreen.assignTo(store);
	setPortfolioId.assignTo(store);
}
