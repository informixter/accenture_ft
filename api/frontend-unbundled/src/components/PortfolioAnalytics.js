import React from 'react';

export const PortfolioAnalytics = ({portfolio, scenario}) =>
{

	function calcTotalSum ()
	{
		if (!portfolio)
		{
			return 0;
		}

		return portfolio.reduce((sum, row) => {
			return sum + Math.round(row.count * row.price * (row.currency === "RUB" ? 1 : 75));
		}, 0);
	}

	function calcVol ()
	{
		if (!portfolio)
		{
			return 0;
		}
		return Math.round(portfolio.reduce((sum, row) => {
			return sum + row.volatility * row.count * row.price * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum() * 100) / 100;
	}

	function calcRating ()
	{
		if (!portfolio)
		{
			return "NA";
		}

		const summaryRating = Math.round(portfolio.reduce((sum, row) => {
			return sum + row.credit_risk_score * row.count * row.price * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum());

		let nearestRating = '';
		let nearestRatingDif = 1000;
		portfolio.forEach((row) =>
		{
			if (row.credit_risk_score - summaryRating < nearestRatingDif)
			{
				nearestRatingDif = row.credit_risk_score - summaryRating;
				nearestRating = row.rating;
			}
		});

		return nearestRating;
	}

	function calcScenarioIncome ()
	{
		if (!portfolio)
		{
			return 0;
		}

		return Math.round(portfolio.reduce((sum, row) => {
			return sum + row['percent_' + scenario] * row.count * row['price_' + scenario] * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum() * 100) / 100;
	}

	function calcHistoryIncome ()
	{
		if (!portfolio)
		{
			return 0;
		}

		return Math.round(portfolio.reduce((sum, row) => {
			return sum + row['previousYearPercent'] * row.count * row['price'] * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum() * 100) / 100;
	}

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
					<h3 className="alert-heading mb-0">{calcRating()}</h3>
					<div className="mb-2">&nbsp;</div>
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Средняя надежность вложений портфеля</p>
				</div>
			</div>

			<div className="col-md-3 mb-3">
				<div className="alert alert-success mb-0" role="alert">
					<h3 className="alert-heading mb-0">{calcVol()}%</h3>
					<div className="mb-2">&nbsp;</div>
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Средняя волатильность</p>
				</div>
			</div>

			<div className="col-md-3 mb-3">
				<div className="alert alert-info mb-0" role="alert">
					<h3 className="alert-heading mb-0">{calcScenarioIncome()}%</h3>
					<div className="mb-2">({(Math.round(calcScenarioIncome() / 100 * calcTotalSum())).toLocaleString()} руб.)</div>
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Ожидаемый доход портфеля по сценарию на 1 год</p>
				</div>
			</div>

			<div className="col-md-3 mb-3">
				<div className="alert alert-info mb-0" role="alert">
					<h3 className="alert-heading mb-0">{calcHistoryIncome()}%</h3>
					<div className="mb-2">({(Math.round(calcHistoryIncome() / 100 * calcTotalSum())).toLocaleString()} руб.)</div>
					<p style={{minHeight: 60}} className="mb-0 border-top pt-3 small">Историческая доходность данной корзины за последний год</p>
				</div>
			</div>

		</div>
	);
};
