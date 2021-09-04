import React from 'react';

export const PortfolioRecs = ({recs, portfolio, scenario, modelPortfolio, availableLimits}) =>
{
	function calcTotalSum (port)
	{
		if (!port)
		{
			return 0;
		}

		return port.reduce((sum, row) => {
			return sum + Math.round(row.count * row['price_' + scenario.toLowerCase()] * (row.currency === "RUB" ? 1 : 75));
		}, 0);
	}

	function calcPartInPortfolio (port, asset_class)
	{
		return Math.round(port.filter(_ => _.asset_class === asset_class).reduce((sum, row) => {
			return sum + row.count * row['price_' + scenario.toLowerCase()] * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum(port) * 100);
	}

	function calcPartInPortfolioIncome (port, asset_class)
	{
		return Math.round(port.filter(_ => _.asset_class === asset_class).reduce((sum, row) => {
			return sum + parseFloat(row["percent_" + scenario.toLowerCase()]) * row.count * row['price_' + scenario.toLowerCase()] * (row.currency === "RUB" ? 1 : 75);
		}, 0) / calcTotalSum(port) * 100) / 100;
	}

	const filteredLimits = availableLimits.filter(_ => Boolean(_.asset_class_base_weight) && (calcPartInPortfolio(portfolio, _.asset_class) !== 0 || calcPartInPortfolio(modelPortfolio, _.asset_class) !== 0));
	return  (
		<>
			<h3 className="mt-4">Сравнительный анализ</h3>
			<div className="table-responsive bg-white shadow rounded">
				<table className="table mb-0">
					<thead>
					<tr>
						<th className="border-bottom-0"></th>
						<th className="border-bottom-0" colSpan="2">Доля</th>
						<th className="border-bottom-0" colSpan="2">Ожидаемая прогнозная доходность</th>
						<th className="border-bottom-0" colSpan="2">Вклад в доходность</th>
						<th className="border-bottom-0"></th>
					</tr>
					<tr>
						<th className="border-bottom-0"></th>
						<th className="border-bottom-0">Ваш</th>
						<th className="border-bottom-0">Целевой</th>
						<th className="border-bottom-0">Ваш</th>
						<th className="border-bottom-0">Целевой</th>
						<th className="border-bottom-0">Ваш</th>
						<th className="border-bottom-0">Целевой</th>
					</tr>
					</thead>
					<tbody>
					{
						filteredLimits.map((row, i) =>
							<tr key={i}>
								<td>{row.asset_class}</td>
								<td>{calcPartInPortfolio(portfolio, row.asset_class)}%</td>
								<td>{calcPartInPortfolio(modelPortfolio, row.asset_class)}%</td>
								<td>{calcPartInPortfolioIncome(portfolio, row.asset_class)}%</td>
								<td>{calcPartInPortfolioIncome(modelPortfolio, row.asset_class)}%</td>
								<td>{Math.round(calcPartInPortfolio(portfolio, row.asset_class) * calcPartInPortfolioIncome(portfolio, row.asset_class)) / 100}%</td>
								<td>{Math.round(calcPartInPortfolio(modelPortfolio, row.asset_class) * calcPartInPortfolioIncome(modelPortfolio, row.asset_class)) / 100}%</td>
							</tr>
						)
					}
					<tr>
						<td>Итого</td>
						<td>{Math.round(filteredLimits.reduce((sum, row) => sum + calcPartInPortfolio(portfolio, row.asset_class), 0) * 100) / 100}%</td>
						<td>{Math.round(filteredLimits.reduce((sum, row) => sum + calcPartInPortfolio(modelPortfolio, row.asset_class), 0) * 100) / 100}%</td>
						<td></td>
						<td></td>
						<td>{Math.round(filteredLimits.reduce((sum, row) => sum + Math.round(calcPartInPortfolio(portfolio, row.asset_class) * calcPartInPortfolioIncome(portfolio, row.asset_class)), 0)) / 100}%</td>
						<td>{Math.round(filteredLimits.reduce((sum, row) => sum + Math.round(calcPartInPortfolio(modelPortfolio, row.asset_class) * calcPartInPortfolioIncome(modelPortfolio, row.asset_class)), 0)) / 100}%</td>
					</tr>
					</tbody>
				</table>
			</div>
			<h3 className="mt-4">Рекомендуемые сделки</h3>
			<div className="table-responsive bg-white shadow rounded">
				<table className="table mb-0">
					<thead>
					<tr>
						<th className="border-bottom-0">Актив</th>
						<th className="border-bottom-0">Класс</th>
						<th className="border-bottom-0">У вас в портфеле</th>
						<th className="border-bottom-0">В модельном портфеле</th>
						<th className="border-bottom-0">Сделка</th>
					</tr>
					</thead>
					<tbody>
					{
						recs.filter(_ => _.old !== _.new).map((item, i) =>

							<tr key={i}>
								<td>
									<div className="d-flex align-items-center">
										<div>
											<img onError={(e) => e.target.style.display = 'none'} style={{width: 70, maxHeight: 70, borderRadius: 70, marginRight: 50}} src={item.logo}/>
										</div>
										<div>
											{item.asset}
										</div>
									</div>
								</td>
								<td>{item.asset_class}</td>
								<td>{item.old} шт</td>
								<td>{item.new} шт</td>
								<td className={item.act === "sell" ? 'text-danger' : "text-success"}>{item.act === "sell" ? "Продать" : "Купить"} {item.count} шт.</td>
							</tr>
						)
					}
					</tbody>
				</table>
			</div>
		</>
	);
};
