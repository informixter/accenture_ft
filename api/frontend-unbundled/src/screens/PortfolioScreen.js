import React, {useEffect, useState} from 'react';
import {useRequest} from "../helper";
import {LEVELS_INFO, setLevel, setScreen} from "../ducks/main";
import {shallowEqual, useSelector} from "react-redux";
import IconBack from "../components/icons/IconBack";
import {PortfolioItems} from "../components/PortfolioItems";
import {PortfolioAnalytics} from "../components/PortfolioAnalytics";
import {PortfolioRecs} from "../components/PortfolioRecs";

export default function PortfolioScreen ({})
{
	const level = useSelector(state => state.main.level, shallowEqual);
	const portfolioId = useSelector(state => state.main.portfolioId, shallowEqual);
	const {requestLoading, request} = useRequest();

	const [recs, setRecs] = useState(null);
	const [modelPortfolio, setModelPortfolio] = useState(null);
	const [portfolio, setPortfolio] = useState(null);
	const [scenario, setScenario] = useState("MAIN");
	const [years, setYears] = useState(level === "HIGH" ? 5 : 1);
	const [sorting, setSorting] = useState("MAIN");

/*	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				const data = await request(`/availableLimits?level=${level}`);
				console.log(data);
			}
			catch (e)
			{

			}
		})();
	}, [])*/

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				const data = await request(`/portfolio?level=${level}`);
				setPortfolio(data);
				console.log(data);
			}
			catch (e)
			{

			}
		})();
	}, []);

	async function getRecs ()
	{
		try
		{
			const data = await request(`/recs?level=${level}&years=${years}&scenario=${scenario}&sorting=${sorting}`);
			setModelPortfolio(data.model);
			setRecs(data.recs);
		}
		catch (e)
		{

		}
	}

	return <div className={`screen`}>

		<div className="screen-body pt-0">
			<div onClick={() => setScreen("MAIN")}>
				<IconBack/>
			</div>
			<h1>Портфель #{portfolioId}</h1>
			<p className="text-muted">Это реальный портфель пользователя, который сформирован вручную в соответствии с его инвестиционным профилем.<br/><b className="text-danger">Расчет бумаг - реальный, произведен на 4 сентября 2021 года.</b> Данные и котировки по тикерам получены с yahoo finance / naufor / мосбиржи.<br/>
			<b className="text-danger">Прогноз цены</b> реализован в рамках хакатона и заключается в регрессионном анализе (код расчета и прогноза написан на python и приложен в репозитории).</p>

			<div className="row">
				<div className="col-md-3 col-sm-12">
					<div className="form-group">
						<label className="mr-3">Выберите сценарий</label>
						<div>
							<select onChange={(e) => setScenario(e.target.value)} value={scenario} className="form-control custom-select mr-3">
								<option value="BASE">Базовый</option>
								<option value="POSITIVE">Позитивный</option>
							</select>
							{/*<a href="#" className="small">Подробнее про сценарии</a>*/}
						</div>
					</div>
				</div>
				<div className="col-md-3 col-sm-12">
					<div className="form-group">
						<label className="mr-3">Срок инвестирования, лет</label>
						<div>
							<select onChange={(e) => setYears(e.target.value)} value={years} className="form-control custom-select mr-3">
								<option value="1">1 год</option>
								<option value="5">5 лет</option>
							</select>
						</div>
					</div>
				</div>
				{/*<div className="col-md-3 col-sm-12">
					<div className="form-group">
						<label className="mr-3">Критерии подбора бумаг</label>
						<div>
							<select onChange={(e) => setSorting(e.target.value)} value={sorting} className="form-control custom-select mr-3">
								<option value="INCOME">Доходность</option>
								<option value="RATING">Рейтинг</option>
								<option value="INCOME_RATING">Доходность + рейтинг</option>
							</select>
						</div>
					</div>
				</div>*/}
			</div>

			<h3 className="mt-4">Аналитика и состав</h3>

			<PortfolioAnalytics portfolio={portfolio}/>

			<div className="row">
				{portfolio && <PortfolioItems portfolio={portfolio}/>}
			</div>

			<h3 className="mt-4">Рекомендации</h3>
			<p className="text-muted">В основе рекомендаций лежит сравнение реального портфеля с модельным (оба рассчитываются на текущую дату). В результате сравнения система предлагает инвестору произвести сделки, чтобы привести свой портфель к модельному. Подбор сделок осуществляется с учетом сценарного анализа, инвест профиля, горизонта инвестирования и суммы инвестирования.</p>
			<div>
				<button onClick={() => getRecs()} className="btn btn-primary btn-lg mt-2 mb-5">Подобрать рекомендации</button>

				{
					modelPortfolio &&
					<>
						<h3 className="mt-4">Как изменятся параметры:</h3>
						<div className="row">
							<PortfolioAnalytics portfolio={modelPortfolio}/>
						</div>
					</>
				}

				{
					recs &&
					<>
						<div className="row">
							<PortfolioRecs recs={recs}/>
						</div>
					</>
				}

			</div>
		</div>

	</div>
}
