import React, {useEffect, useState} from 'react';
import {useRequest} from "../helper";
import {LEVELS_INFO, setLevel, setPortfolioId, setScreen} from "../ducks/main";
import {shallowEqual, useSelector} from "react-redux";

const alina = require('../assets/avatar.png');

export default function MainScreen ({})
{
    const {requestLoading, request} = useRequest();
	const level = useSelector(state => state.main.level, shallowEqual);
	const [portfolio, setPortfolio] = useState(null);
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
			}
			catch (e)
			{

			}
		})();
	}, [level])

    return <div className={`screen`}>

        <div className="screen-body pt-0">

	        <>
		        <div className="d-flex text-center flex-column align-items-center mt-3">
			        <div>
				        <img src={alina} className="img-fluid avatar avatar-medium mt-3 mt-sm-0 rounded-circle" alt=""/>
			        </div>
			        <div>
				        <h1 className="mb-0">Частный инвестор</h1>
				        {
				        	!level &&
					        <>
						        <p className="text-muted mb-0">
							        Инвест-профиль не определен. Для продолжения пройдите тестирование.<br/>
							        В случае использования системы брокером, брокер будет заранее передавать профиль,<br/>тогда прохождение теста не будет обязательным.
						        </p>
						        <button onClick={() => setScreen("TEST")} className="btn btn-primary mt-3">Пройти тест</button>
					        </>
				        }
				        {
				        	level &&
					        <>
						        <p className="text-muted mb-0">{LEVELS_INFO[level].ru + ' профиль' }</p>
						        <a onClick={() => {setLevel(null);setPortfolio(null);setAvailableLimits(null);}} href="#">сбросить профиль (есть демонстрация агрессивного и консервативного профиля)</a>
					        </>
				        }
			        </div>
		        </div>

		        {
			        portfolio &&
			        <div className="mt-5">
				        <h3>Ваши портфели</h3>
				        <p className="text-muted">Выберите портфель, чтобы увидеть аналитику и рекомендации.</p>
				        <div className="row">

					        <div className="col-md-6 col-sm-12 mb-3">
						        <div onClick={() => {setScreen("PORTFOLIO"); setPortfolioId(1)}} className="card shadow rounded border-0 overflow-hidden hover-background">
							        <div style={{borderLeft: "3px solid blue"}} className="card-body">
								        <h5 className="card-title">Портфель #1</h5>
								        <p className="text-muted mb-0">{portfolio.filter(_ => _.logo !== null).map(_ => _.asset).slice(0, 3).join(", ") + ' и др.'}</p>
								        {/*<p className="text-muted mb-0">{portfolio.filter(_ => _.logo !== null).map(_ => <img key={_.logo} style={{width: 50, height: 50}} src={_.logo}/>)}</p>*/}
							        </div>
						        </div>
					        </div>

				        </div>
			        </div>
		        }

		        {
		        	availableLimits && level &&
			        <div className="mt-5">
				        <h3>Ваша лимитная ведомость на основе риск-профиля</h3>
				        <p className="text-muted">
					        Это набор классов активов с ограничениями по долям и рейтингам, подобранный в соответствии с инвестиционным профилем.
					        Он используется для подбора модельного портфеля к какому-либо реальному портфелю. Модельный портфель - идеальный набор бумаг на заданную сумму, горизонт инвестирования, сценарий, при котором инвестор получит максимальную доходность при минимальных рисках.
				        </p>
				        <div className="table-responsive bg-white shadow rounded">
					        <table className="table mb-0">
						        <thead>
						        <tr>
							        <th className="border-bottom-0">Класс актива</th>
							        <th className="border-bottom-0">Макс. доля класса актива</th>
							        <th className="border-bottom-0">Макс. доля эмитента</th>
							        <th className="border-bottom-0">Макс. доля актива</th>
							        <th className="border-bottom-0">Доступные рейтинги</th>
							        <th className="border-bottom-0">Горизонт инвестирования</th>
						        </tr>
						        </thead>
						        <tbody>
						        {
						        	availableLimits.filter(_ => Boolean(_.asset_class_base_weight)).map((item, i) =>

								        <tr key={i}>
									        <td>{item.asset_class}</td>
									        <td>{item.asset_class_base_weight || 0}%</td>
									        <td>{item.issuer_max_weight || 0}%</td>
									        <td>{item.asset_max_weight || 0}%</td>
									        <td>{item.ratings_limits}</td>
									        <td>{item.client_max_duration} {item.client_max_duration > 1 ? 'лет' : 'год '}</td>
								        </tr>
							        )
						        }
						        </tbody>
					        </table>
				        </div>
			        </div>
		        }
	        </>

        </div>

    </div>
}
