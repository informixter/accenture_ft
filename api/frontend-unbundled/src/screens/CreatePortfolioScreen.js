import React, {useEffect, useState} from 'react';
import {useRequest} from "../helper";
import {LEVELS_INFO, setLevel} from "../ducks/main";
import {shallowEqual, useSelector} from "react-redux";
import {Doughnut, Line} from "react-chartjs-2";

const data = {
	labels: ['1', '2', '3', '4', '5', '6'],
	datasets: [
		{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			fill: false,
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgba(255, 99, 132, 0.2)',
		},
	],
};

const options = {
	scales: {
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
				},
			},
		],
	},
};

const pieData = {
	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
	datasets: [
		{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
			borderWidth: 1,
		},
	],
};

export default function CreatePortfolioScreen ({})
{
	const level = useSelector(state => state.main.level, shallowEqual);
    const {requestLoading, request} = useRequest();
    const [showTable, setShowTable] = useState(true);

    useEffect(() =>
    {
    	//setLevel(null);
    }, []);

    return <div className={`screen`}>

        <div className="screen-body pt-0">
	        <h1>Анализ портфеля</h1>
	        <p className="text-muted mb-0">Вы{LEVELS_INFO[level].title}</p>
	        {
	        	!showTable &&
		        <a href="#" onClick={() => setShowTable(true)}>Показать доступный набор активов</a>
	        }
	        {
	        	showTable &&
		        <>
			        <h4 className="mt-5">Доступный набор инструментов (инвестиционная деларация)</h4>
			        <div className="table-responsive bg-white shadow rounded">
				        <table className="table mb-0">
					        <thead>
					        <tr>
						        <th className="border-bottom-0">1</th>
						        <th className="border-bottom-0">2</th>
						        <th className="border-bottom-0">3</th>
					        </tr>
					        </thead>
					        <tbody>
					        <tr>
						        <td>3</td>
						        <td>4</td>
						        <td>5</td>
					        </tr>
					        </tbody>
				        </table>
			        </div>
		        </>
	        }
	        <h4 className="mt-5">Соберите портфель</h4>
	        <p className="text-muted">Соберите свой портфель, уточнив долю каждого инструмента. Но основе сценария мы оценим историческую и потенциальную доходность портфеля на основе сценарного анализа на интересующий вас срок. Сценарий - это предположение о развитии экономии...</p>
	        <div>
		        <div className="row">
			        <div className="col-md-6 col-sm-12">
				        <div className="form-group">
					        <label className="mr-3">Сумма инвестиций, руб</label>
					        <div>
						        <input name="name" id="name" type="text" className="form-control"
						               placeholder="500 000"/>
					        </div>
				        </div>
			        </div>
			        <div className="col-md-6 col-sm-12">
				        <div className="form-group">
					        <label className="mr-3">Горизонт инвестирования, лет</label>
					        <div>
						        <input name="name" id="name" type="text" className="form-control"
						               placeholder="3"/>
					        </div>
				        </div>
			        </div>
		        </div>
		        <div className="form-group">
			        <label className="mr-3">Выберите сценарий (на 1 год)</label>
			        <div>
				        <select style={{maxWidth: 300}} className="form-control custom-select mr-3">
					        <option value="BASE">Базовый</option>
					        <option value="POSITIVE">Позитивный</option>
					        <option value="NEGATIVE">Негативный</option>
				        </select>
				        <a href="#" className="small">Подробнее про сценарии</a>
			        </div>
		        </div>
	        </div>

	        <div className="row">

		        <div className="col-md-3 mb-3">
			        <div className="alert alert-success mb-0" role="alert">
				        <h3 className="alert-heading mb-0">5.0</h3>
				        <div className="mb-2">&nbsp;</div>
				        <p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Средняя надежность вложений портфеля</p>
			        </div>
		        </div>

		        <div className="col-md-3 mb-3">
			        <div className="alert alert-success mb-0" role="alert">
				        <h3 className="alert-heading mb-0">1.0%</h3>
				        <div className="mb-2">&nbsp;</div>
				        <p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Средняя волатильность</p>
			        </div>
		        </div>

		        <div className="col-md-3 mb-3">
			        <div className="alert alert-info mb-0" role="alert">
				        <h3 className="alert-heading mb-0">5.5%</h3>
				        <div className="mb-2">(218.3 руб.)</div>
				        <p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Ожидаемый доход портфеля по сценарию на 1 год</p>
			        </div>
		        </div>

		        <div className="col-md-3 mb-3">
			        <div className="alert alert-info mb-0" role="alert">
				        <h3 className="alert-heading mb-0">5.5%</h3>
				        <div className="mb-2">(218.3 руб.)</div>
				        <p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Историческая доходность данной корзины за последний год</p>
			        </div>
		        </div>

	        </div>

	        <div className="table-responsive bg-white">
		        <table className="table table-borderless mb-0">
			        <thead>
			        <tr>
				        <th className="border-bottom-0">Актив</th>
				        <th className="border-bottom-0">Уточните долю инструмента в портфеле</th>
				        <th className="border-bottom-0">Вы заработаете (в случае реализации сценария)</th>
				        <th className="border-bottom-0">Историческая дохоность</th>
			        </tr>
			        </thead>
			        <tbody>
			        <tr>
				        <td>
					        <div className="card shadow rounded border-0 overflow-hidden">
					        <div className="card-body">
						        <h5 className="card-title">ОФЗ</h5>
						        <p className="text-muted mb-0">БПИФ Сбер - Индекс МосБиржи государственных облигаций </p>
					        </div>
	                        </div>
				        </td>
				        <td>шкала</td>
				        <td>5%, 50 рубл</td>
				        <td>3%</td>
			        </tr>
			        <tr>
				        <td>
					        <div className="card shadow rounded border-0 overflow-hidden">
						        <div className="card-body">
							        <h5 className="card-title">ОФЗ</h5>
							        <p className="text-muted mb-0">БПИФ Сбер - Индекс МосБиржи государственных облигаций </p>
						        </div>
					        </div>
				        </td>
				        <td>шкала</td>
				        <td>5%, 50 рубл</td>
				        <td>3%</td>
			        </tr>
			        </tbody>
		        </table>
	        </div>

	        <Line data={data} options={options} />
			<Doughnut data={pieData}/>
        </div>

    </div>
}
