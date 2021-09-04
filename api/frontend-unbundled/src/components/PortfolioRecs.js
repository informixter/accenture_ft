import React from 'react';

export const PortfolioRecs = ({recs}) =>
{
	return  (
		<div className="table-responsive bg-white shadow rounded">
			<table className="table mb-0">
				<thead>
				<tr>
					<th className="border-bottom-0">Актив</th>
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
							<td>{item.old} шт</td>
							<td>{item.new} шт</td>
							<td className={item.act === "sell" ? 'text-danger' : "text-success"}>{item.act === "sell" ? "Продать" : "Купить"} {item.count} шт.</td>
						</tr>
					)
				}
				</tbody>
			</table>
		</div>
	);
};
