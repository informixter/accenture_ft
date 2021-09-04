import React from 'react';

export const PortfolioRecs = ({recs}) =>
{
	return recs.map(row => (
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
							<div>
								<span className="font-weight-bold card-title">{row.asset}</span><br/>
								<span className={row.act === "sell" ? "text-danger" : "text-success"}>{row.act === "sell" ? "ПРОДАТЬ" : "КУПИТЬ"} {row.count} шт.</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		));
};
