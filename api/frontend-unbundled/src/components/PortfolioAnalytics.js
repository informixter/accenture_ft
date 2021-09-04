import React from 'react';

export const PortfolioAnalytics = ({portfolio, modelPortfolio = null, scenario}) =>
{

	function calcTotalSum (port)
	{
		if (!port)
		{
			return 0;
		}

		return port.reduce((sum, row) => {
			return sum + Math.round(row.count * row.price * (row.currency === "RUB" ? 1 : 75));
		}, 0);
	}

	function calcVol (port)
	{
		if (!port)
		{
			return 0;
		}
		return Math.round(port.reduce((sum, row) => {
			return sum + row.volatility * row.count * row.price * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum(port) * 100) / 100;
	}

	function calcRating (port)
	{
		if (!port)
		{
			return "NA";
		}

		const summaryRating = Math.round(port.reduce((sum, row) => {
			return sum + row.credit_risk_score * row.count * row.price * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum(port));

		let nearestRating = '';
		let nearestRatingDif = 1000;
		port.forEach((row) =>
		{
			if (row.credit_risk_score - summaryRating < nearestRatingDif)
			{
				nearestRatingDif = row.credit_risk_score - summaryRating;
				nearestRating = row.rating;
			}
		});

		return nearestRating;
	}

	function calcScenarioIncome (port)
	{
		if (!port)
		{
			return 0;
		}

		return Math.round(port.reduce((sum, row) => {
			return sum + row['percent_' + scenario] * row.count * row['price_' + scenario] * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum(port) * 100) / 100;
	}

	function calcHistoryIncome (port)
	{
		if (!port)
		{
			return 0;
		}

		return Math.round(port.reduce((sum, row) => {
			return sum + row['previousYearPercent'] * row.count * row['price'] * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum(port) * 100) / 100;
	}

	const volDif = modelPortfolio ? (calcVol(modelPortfolio) - calcVol(portfolio)) : 0;
	const scenarioIncomeDif = modelPortfolio ? (calcScenarioIncome(modelPortfolio) - calcScenarioIncome(portfolio)) : 0;
	const historyIncomeDif = modelPortfolio ? (calcHistoryIncome(modelPortfolio) - calcHistoryIncome(portfolio)) : 0;

	console.log(volDif);
	return (
		<div className="row">

			{/*<div className="col-md-3 mb-3">
				<div className="alert alert-success mb-0" role="alert">
					<h3 className="alert-heading mb-0">{calcTotalSum()} RUB</h3>
					<div className="mb-2">&nbsp;</div>
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Суммарная стоимость</p>
				</div>
			</div>*/}

			<div className="col-md-3 mb-3">
				<div className="alert alert-success mb-0" role="alert">
					<h3 className="alert-heading mb-0">{calcRating(modelPortfolio || portfolio)}</h3>
					<div className="mb-2 text-muted">&nbsp;{modelPortfolio && (calcRating(modelPortfolio) === calcRating(portfolio) ? 'без изменений' : "изменился с " + calcRating(portfolio))}</div>
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Средняя надежность вложений портфеля</p>
				</div>
			</div>

			<div className="col-md-3 mb-3">
				<div className="alert alert-success mb-0" role="alert">
					<h3 className="alert-heading mb-0">{calcVol(modelPortfolio || portfolio)}%</h3>
					<div className={`mb-2 text-warning`}>&nbsp;{modelPortfolio ? ((volDif > 0 ? '+' : '') + ' ' + (volDif.toFixed(2)) + '%') : ''}</div>
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Средняя волатильность</p>
				</div>
			</div>

			<div className="col-md-3 mb-3">
				<div className="alert alert-info mb-0" role="alert">
					<h3 className="alert-heading mb-0">{calcScenarioIncome(modelPortfolio || portfolio)}%</h3>
					{
						!modelPortfolio &&
						<div className="mb-2">({(Math.round(calcScenarioIncome(modelPortfolio || portfolio) / 100 * calcTotalSum(modelPortfolio || portfolio))).toLocaleString()} руб.)</div>
					}
					{
						modelPortfolio &&
						<div className={`mb-2 text-warning`}>{(scenarioIncomeDif > 0 ? '+' : '') + ' ' + (scenarioIncomeDif.toFixed(2)) + '%'}</div>
					}
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Ожидаемый доход портфеля по сценарию на 1 год</p>
				</div>
			</div>

			<div className="col-md-3 mb-3">
				<div className="alert alert-info mb-0" role="alert">
					<h3 className="alert-heading mb-0">{calcHistoryIncome(modelPortfolio || portfolio)}%</h3>
					{
						!modelPortfolio &&
						<div className="mb-2">({(Math.round(calcHistoryIncome(modelPortfolio || portfolio) / 100 * calcTotalSum(modelPortfolio || portfolio))).toLocaleString()} руб.)</div>
					}
					{
						modelPortfolio &&
						<div className={`mb-2 text-warning`}>{(historyIncomeDif > 0 ? '+' : '') + ' ' + (historyIncomeDif.toFixed(2)) + '%'}</div>
					}
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Историческая доходность данной корзины за последний год</p>
				</div>
			</div>

		</div>
	);
};
