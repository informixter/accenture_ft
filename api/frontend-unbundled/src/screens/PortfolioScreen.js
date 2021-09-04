import React, {useEffect, useState} from 'react';
import {useRequest} from "../helper";
import {LEVELS_INFO, setLevel, setScreen} from "../ducks/main";
import {shallowEqual, useSelector} from "react-redux";
import IconBack from "../components/icons/IconBack";
import {PortfolioItems} from "../components/PortfolioItems";
import {PortfolioAnalytics} from "../components/PortfolioAnalytics";
import {PortfolioRecs} from "../components/PortfolioRecs";
import AOS from 'aos';

export default function PortfolioScreen ({})
{
	const level = useSelector(state => state.main.level, shallowEqual);
	const portfolioId = useSelector(state => state.main.portfolioId, shallowEqual);
	const {requestLoading, request} = useRequest();

	const [recs, setRecs] = useState(null);
	const [modelPortfolio, setModelPortfolio] = useState(null);
	const [portfolio, setPortfolio] = useState(null);
	const [scenario, setScenario] = useState("BASE");
	const [years, setYears] = useState(level === "HIGH" ? 5 : (level === "MEDIUM" ? 3 : 1));
	const [sorting, setSorting] = useState("MAIN");
	const [infoVisible, setInfoVisible] = useState(false);
	const [availableLimits, setAvailableLimits] = useState([]);

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				const data = await request(`/availableLimits?level=${level}`);
				setAvailableLimits(data);
				console.log(data);
			}
			catch (e)
			{

			}
		})();
	}, [level]);

	useEffect(() =>
	{
		(async () =>
		{
			try
			{
				const data = await request(`/portfolio?level=${level}`);
				setPortfolio(data);
				console.log(data);
				//getRecs();
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
			AOS.init({duration: 1500});
		}
		catch (e)
		{

		}
	}

	return <div className={`screen`}>

		<div className="screen-body pt-0" style={{paddingBottom: 200}}>
			<div onClick={() => setScreen("MAIN")}>
				<IconBack/>
			</div>
			<h1>Портфель #{portfolioId}</h1>
			<p className="text-muted ">Это реальный портфель пользователя, который сформирован вручную в соответствии с его инвестиционным профилем.<br/><b className="text-danger">Расчет бумаг - реальный, произведен на 4 сентября 2021 года.</b> Данные и котировки по тикерам получены с yahoo finance / naufor / мосбиржи.<br/>
			<b className="text-danger">Прогноз цены</b> реализован в рамках хакатона и заключается в регрессионном анализе (код расчета и прогноза написан на python и приложен в репозитории).</p>

			<div className="row">
				<div className="col-md-3 col-sm-12">
					<div className="form-group">
						<label className="mr-3">Выберите сценарий</label>
						<div>
							<select onChange={(e) => setScenario(e.target.value)} value={scenario} className="form-control custom-select mr-3">
								<option value="BASE">Базовый</option>
								<option value="NEGATIVE">Негативный</option>
								<option value="POSITIVE">Позитивный</option>
							</select>
							<a onClick={() => setInfoVisible(!infoVisible)} href="#" className="small">Показать/скрыть информацию про сценарии</a>
						</div>
					</div>
				</div>
				<div className="col-md-3 col-sm-12">
					<div className="form-group">
						<label className="mr-3">Срок инвестирования, лет</label>
						<div>
							<select onChange={(e) => setYears(e.target.value)} value={years} className="form-control custom-select mr-3">
								<option value="1">1 год</option>
								<option value="3">3 года</option>
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
			{
				infoVisible &&
					<div className="text-muted">
						Сценарий – это ожидания аналитиков в отношении роста ключевых фондовых индексов (S&P, Московской биржи), а также курсов валюты, и ставок центральных банков в рублях и долларах
						Сценарий позволяет оценить направления движения рынка. Модель оценки каждого актива в портфеле предполагает регрессионный анализ зависимости цены актива от сценарных показателей. При подстановке в модель сценарных показателей, модель выдает прогнозную цену актива. Сценарий формируется на 1 год.

						<br/><br/><b>Базовый сценарий</b> -  Наиболее реалистичный сценарий. Ожидания роста основных индексов акций и облигаций на уровне среднегодовых темпов роста за последние 3 года. Ожидания по курсам валют и ставка ЦБ взяты из открытых источников (СМИ)
						<br/><br/><b>Позитивный сценарий</b> - Предполагает существенное повышение основных фондовых индексов, снижение курса доллара и снижение процентных ставок, более существенное, чем ожидается по базовому сценарию.
						<br/><br/><b>Негативный сценарий</b>. Предполагает снижение основных фондовых индексов, рост курса доллара и повышение процентных ставок.
					</div>
			}

			<h3 className="mt-4">Аналитика и состав</h3>

			<PortfolioAnalytics portfolio={portfolio} scenario={scenario.toLowerCase()}/>

			<div className="row">
				{portfolio && <PortfolioItems portfolio={portfolio} scenario={scenario.toLowerCase()}/>}
			</div>

			<h3 className="mt-4 animate__animated animate__flash ">Рекомендации</h3>
			<p className="text-muted">В основе рекомендаций лежит сравнение реального портфеля с модельным (оба рассчитываются на текущую дату). В результате сравнения система предлагает инвестору произвести сделки, чтобы привести свой портфель к модельному. Подбор сделок осуществляется с учетом сценарного анализа, инвест профиля, горизонта инвестирования и суммы инвестирования.</p>
			<div>
				<button onClick={() => getRecs()} className="btn btn-primary btn-lg mt-2 mb-5">Подобрать рекомендации</button>

				{
					recs &&
					<div data-aos="fade-right">
						<PortfolioRecs recs={recs}
						               portfolio={portfolio}
						               modelPortfolio={modelPortfolio}
						               availableLimits={availableLimits}
						               scenario={scenario}/>
					</div>
				}

				{
					modelPortfolio &&
					<div data-aos="fade-right">
						<h3 className="mt-4">Как изменится ваш портфель</h3>
						<PortfolioAnalytics portfolio={portfolio} modelPortfolio={modelPortfolio} scenario={scenario.toLowerCase()}/>
					</div>
				}

			</div>
		</div>

	</div>
}
