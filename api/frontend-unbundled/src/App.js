import React from 'react';
import {getParamValue, useRequest} from "./helper";
import TestScreen from "./screens/TestScreen";
import {shallowEqual, useSelector} from "react-redux";
import CreatePortfolioScreen from "./screens/CreatePortfolioScreen";
import MainScreen from "./screens/MainScreen";
import PortfolioScreen from "./screens/PortfolioScreen";

export default function App ({})
{
	const {requestLoading, request} = useRequest();
	const level = useSelector(state => state.main.level, shallowEqual);
	const screen = useSelector(state => state.main.screen, shallowEqual);

    /*useEffect(() => {

        let forceIdOrganisation = getParamValue('io'),
            forceIdResult = getParamValue('ir');

	    if (forceIdOrganisation && forceIdResult)
        {
	        setOrganisation({id : forceIdOrganisation});
            setResult({idResult : decodeURIComponent(forceIdResult)});
            getInfo(forceIdOrganisation, decodeURIComponent(forceIdResult));
        }
	    else if (forceIdOrganisation && (organisation && organisation.id !== forceIdOrganisation))
	    {
		    clearAllSettings();
	    }

    }, []);

    async function getInfo (idOrganisation, idResult)
	{
		try
		{
			const data = await request(`/search/${idOrganisation}/${idResult}`);
			console.log(data);
		}
		catch (e) {
			console.error(e);
			//alert(e);
		}
	}*/

    return <div className={``}>
	    {
	    	screen === "MAIN" &&
		    <MainScreen/>
	    }
	    {
		    screen === "TEST" &&
		    <TestScreen/>
	    }
	    {
	    	screen === "PORTFOLIO" &&
		    <PortfolioScreen/>
	    }
	    {
	    	false && level && <CreatePortfolioScreen/>
	    }
    </div>
}
