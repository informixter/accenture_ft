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
			<div className="d-flex justify-content-between">
				<h1>???????????????? #{portfolioId}</h1>
				<a href="https://docs.google.com/document/d/1Hzl1A3EaWVm5j7UyyKnNDCIkNhXUMA-D8U-DT5nSQ1E/edit" target="_blank">???????????????????????? ?? ???????????????? ??????????????????</a>
			</div>
			<p className="text-muted ">?????? ???????????????? ???????????????? ????????????????????????, ?????????????? ?????????????????????? ?????????????? ?? ???????????????????????? ?? ?????? ???????????????????????????? ????????????????.<br/><b className="text-danger">???????????? ?????????? - ????????????????, ???????????????????? ???? 4 ???????????????? 2021 ????????.</b> ???????????? ?? ?????????????????? ???? ?????????????? ???????????????? ?? yahoo finance / naufor / ????????????????.<br/>
			<b className="text-danger">?????????????? ????????</b> ???????????????????? ?? ???????????? ???????????????? ?? ?????????????????????? ?? ?????????????????????????? ?????????????? (?????? ?????????????? ?? ???????????????? ?????????????? ???? python ?? ???????????????? ?? ??????????????????????).</p>

			<div className="row">
				<div className="col-md-3 col-sm-12">
					<div className="form-group">
						<label className="mr-3">???????????????? ????????????????</label>
						<div>
							<select onChange={(e) => setScenario(e.target.value)} value={scenario} className="form-control custom-select mr-3">
								<option value="BASE">??????????????</option>
								<option value="NEGATIVE">????????????????????</option>
								<option value="POSITIVE">????????????????????</option>
							</select>
							<a onClick={() => setInfoVisible(!infoVisible)} href="#" className="small">????????????????/???????????? ???????????????????? ?????? ????????????????</a>
						</div>
					</div>
				</div>
				<div className="col-md-3 col-sm-12">
					<div className="form-group">
						<label className="mr-3">???????? ????????????????????????????, ??????</label>
						<div>
							<select onChange={(e) => setYears(e.target.value)} value={years} className="form-control custom-select mr-3">
								<option value="1">1 ??????</option>
								<option value="3">3 ????????</option>
								<option value="5">5 ??????</option>
							</select>
						</div>
					</div>
				</div>
				{/*<div className="col-md-3 col-sm-12">
					<div className="form-group">
						<label className="mr-3">???????????????? ?????????????? ??????????</label>
						<div>
							<select onChange={(e) => setSorting(e.target.value)} value={sorting} className="form-control custom-select mr-3">
								<option value="INCOME">????????????????????</option>
								<option value="RATING">??????????????</option>
								<option value="INCOME_RATING">???????????????????? + ??????????????</option>
							</select>
						</div>
					</div>
				</div>*/}
			</div>
			{
				infoVisible &&
					<div className="text-muted">
						???????????????? ??? ?????? ???????????????? ???????????????????? ?? ?????????????????? ?????????? ???????????????? ???????????????? ???????????????? (S&P, ???????????????????? ??????????), ?? ?????????? ???????????? ????????????, ?? ???????????? ?????????????????????? ???????????? ?? ???????????? ?? ????????????????
						???????????????? ?????????????????? ?????????????? ?????????????????????? ???????????????? ??????????. ???????????? ???????????? ?????????????? ???????????? ?? ???????????????? ???????????????????????? ?????????????????????????? ???????????? ?????????????????????? ???????? ???????????? ???? ?????????????????? ??????????????????????. ?????? ?????????????????????? ?? ???????????? ?????????????????? ??????????????????????, ???????????? ???????????? ???????????????????? ???????? ????????????. ???????????????? ?????????????????????? ???? 1 ??????.

						<br/><br/><b>?????????????? ????????????????</b> -  ???????????????? ???????????????????????? ????????????????. ???????????????? ?????????? ???????????????? ???????????????? ?????????? ?? ?????????????????? ???? ???????????? ?????????????????????????? ???????????? ?????????? ???? ?????????????????? 3 ????????. ???????????????? ???? ???????????? ?????????? ?? ???????????? ???? ?????????? ???? ???????????????? ???????????????????? (??????)
						<br/><br/><b>???????????????????? ????????????????</b> - ???????????????????????? ???????????????????????? ?????????????????? ???????????????? ???????????????? ????????????????, ???????????????? ?????????? ?????????????? ?? ???????????????? ???????????????????? ????????????, ?????????? ????????????????????????, ?????? ?????????????????? ???? ???????????????? ????????????????.
						<br/><br/><b>???????????????????? ????????????????</b>. ???????????????????????? ???????????????? ???????????????? ???????????????? ????????????????, ???????? ?????????? ?????????????? ?? ?????????????????? ???????????????????? ????????????.
					</div>
			}

			<h3 className="mt-4">?????????????????? ?? ????????????</h3>

			<PortfolioAnalytics portfolio={portfolio} scenario={scenario.toLowerCase()}/>

			<div className="row">
				{portfolio && <PortfolioItems portfolio={portfolio} scenario={scenario.toLowerCase()}/>}
			</div>

			<h3 className="mt-4 animate__animated animate__flash ">????????????????????????</h3>
			<p className="text-muted">?? ???????????? ???????????????????????? ?????????? ?????????????????? ?????????????????? ???????????????? ?? ?????????????????? (?????? ???????????????????????????? ???? ?????????????? ????????). ?? ???????????????????? ?????????????????? ?????????????? ???????????????????? ?????????????????? ???????????????????? ????????????, ?????????? ???????????????? ???????? ???????????????? ?? ????????????????????. ???????????? ???????????? ???????????????????????????? ?? ???????????? ???????????????????? ??????????????, ???????????? ??????????????, ?????????????????? ???????????????????????????? ?? ?????????? ????????????????????????????.</p>
			<div>
				<button onClick={() => getRecs()} className="btn btn-primary btn-lg mt-2 mb-5">?????????????????? ????????????????????????</button>

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
						<h3 className="mt-4">?????? ?????????????????? ?????? ????????????????</h3>
						<PortfolioAnalytics portfolio={portfolio} modelPortfolio={modelPortfolio} scenario={scenario.toLowerCase()}/>
					</div>
				}

			</div>
		</div>

	</div>
}
