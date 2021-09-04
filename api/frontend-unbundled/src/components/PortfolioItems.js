import React from 'react';

export const PortfolioItems = ({portfolio, scenario}) =>
{
	return portfolio.filter(row => row.price > 0).map(row => (
			<div className="col-md-6 col-sm-12 mb-3">
				<div className="card shadow rounded border-0 overflow-hidden">
					<div className="card-body d-flex">
						<div style={{height: 70}}>
							{
								row.logo &&
								<img onError={(e) => e.target.style.display = 'none'} style={{width: 70, maxHeight: 70, borderRadius: 70, marginRight: 50}} src={row.logo}/>
							}
						</div>
						<div className="w-100">
							<div className="d-flex justify-content-between">
								<span className="font-weight-bold card-title">{row.asset}</span>
								<span>{Math.round(row.count * row.price * 100) / 100} {row.currency}</span>
							</div>
							<p className="text-muted mb-0">{row.count} шт · {Math.round(row.price * 100) / 100} {row.currency}</p>
							<p className="text-muted mb-0">{row.asset_class} · {row.rating}</p>

							<div className="d-flex justify-content-between mt-3">
								<span className="card-title">Прогноз на год</span>
								<span className={(row['percent_' + scenario] > 0 ? 'text-success' : 'text-danger') + ' text-right'}>
											{Math.round(row['price_' + scenario] * row.count * 100) / 100} {row.currency}
									<br/>
											<span style={{fontSize: 12}}>{Math.round(row['price_' + scenario] * 100) / 100} {row.currency} / шт, {row['percent_' + scenario] > 0 ? '+' : '-'}{Math.abs(Math.round(row['percent_' + scenario] * 100) / 100)}%</span>
										</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		));
};
