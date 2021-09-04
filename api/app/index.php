<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: app-version, content-type, content-length");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');

IF ($_SERVER['REQUEST_METHOD'] === "OPTIONS")
{
	return 'ok';
}

require "shared.php";

function getDataFromFile ()
{
	$level = $_GET['level'];
	$reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader("Xlsx");
	$spreadsheet = $reader->load("data.xlsx");
	$universe = sheetToMap($spreadsheet->setActiveSheetIndex(0)->toArray());
	$limits = sheetToMap($spreadsheet->setActiveSheetIndex(1)->toArray());
	return [$limits, $universe];
}

function fetchActualDataForUniverse ($universe)
{
	$db = getDb();

	for ($i = 0, $max = sizeof($universe); $i < $max; $i++)
	{
		$row = $db -> get('predictors', '*', ['code' => $universe[$i]['code']]);
		var_dump($row);
		$volRow = $db -> get('vol_ret_table', '*', ['field' => 'volatility', 'code' => $universe[$i]['code']]);
		//var_dump($volRow);
		$universe[$i]['current_price'] = (float)$row['current_price'];
		$universe[$i]['price'] = (float)$row['price'];
		$universe[$i]['percent'] = (float)$row['percent'];
	}
	die;

	return $universe;
}

function sheetToMap ($data)
{
	$headers = $data[0];
	$data = array_slice($data, 1);
	for ($i = 0, $max = sizeof($data); $i < $max; $i++)
	{
		$map = [];
		for ($j = 0, $max2 = sizeof($data[$i]); $j < $max2; $j++)
		{
			if (trim($headers[$j]) === "")
			{
				continue;
			}
			$map[$headers[$j]] = $data[$i][$j];
		}
		$data[$i] = $map;
	}

	return $data;
}

function getAvailableLimits ($level, $years = null)
{
	$levelRu = ['LOW' => 'Консервативный', 'MEDIUM' => 'Умеренный', 'HIGH' => 'Агрессивный'][$level];
	list($limits, $universe) = getDataFromFile();

	$byAssetClasses = [];
	for ($i = 0, $max = sizeof($limits); $i < $max; $i++)
	{
		if ($limits[$i]['client_risk_tolerance'] !== $levelRu or (int)$limits[$i]['asset_class_max_weight'] === 0)
		{
			continue;
		}

		if ($years !== null and (int)$limits[$i]['client_max_duration'] !== $years)
		{
			continue;
		}

		$byAssetClasses[$limits[$i]['asset_class']] = $limits[$i];
	}

	return $byAssetClasses;
}

function generatePortfolio ($level, $years, $real)
{
	list($limits, $universe) = getDataFromFile();
	$limitsByAssetClasses = getAvailableLimits($level, $years);
	$availableAssetClasses = array_keys($limitsByAssetClasses);

	for ($i = 0, $max = sizeof($universe); $i < $max; $i++)
	{
		if (!in_array($universe[$i]['asset_class'], $availableAssetClasses) or in_array($universe[$i]['asset_class'], ['Облигации корпоративные', 'ОФЗ', 'Облигации высокодоходные']))
		{
			unset($universe[$i]);
		}
	}

	$universe = array_values($universe);
	$universe = fetchActualDataForUniverse($universe);
	usort($universe, function ($a, $b) {
		return $a['percent'] <=> $b['percent'];
	});
	$universe = array_reverse($universe);
	//array_map(function ($item) {echo print_r($item, true) . "<br><br>";}, $universe);
	$sumsByAssetClasses = [];
	$sumsByIssuers = [];
	$sumsByAssets = [];
	$modelPortfolio = [];
	$modelPortfolioTotalSum = 0;
	$totalSum = 50000;
	for ($i = 0, $max = sizeof($universe); $i < $max; $i++)
	{
		$assetClass = $universe[$i]['asset_class'];
		$curPrice = $universe[$i]['current_price'] * ($universe[$i]['currency'] === "RUB" ? 1 : 85);
		$code = $universe[$i]['code'];
		$assetClassMaxWeight = $limitsByAssetClasses[$assetClass]['asset_class_max_weight'] + ($real ? random_int(-10, 10) : 0);
		$issuerMaxWeight = $limitsByAssetClasses[$assetClass]['issuer_max_weight'] + ($real ? random_int(-5, 5) : 0);
		$assetMaxWeight = $limitsByAssetClasses[$assetClass]['asset_max_weight'] + ($real ? random_int(-2, 102) : 0);

		if (!isset($sumsByAssetClasses[$assetClass]))
		{
			$sumsByAssetClasses[$assetClass] = 0;
		}

		if (!isset($sumsByIssuers[$universe[$i]['issuer']]))
		{
			$sumsByIssuers[$universe[$i]['issuer']] = 0;
		}

		if (!isset($sumsByAssets[$universe[$i]['asset']]))
		{
			$sumsByAssets[$universe[$i]['asset']] = 0;
		}

		$tries = 0;
		while ($tries < 1000)
		{
			$tries++;
			if ($modelPortfolioTotalSum + $curPrice > $totalSum)
			{
				break;
			}

			if (($sumsByAssetClasses[$assetClass] + $curPrice) / $totalSum * 100 > $assetClassMaxWeight)
			{
				break;
			}

			if (($sumsByIssuers[$universe[$i]['issuer']] + $curPrice) / $totalSum * 100 > $issuerMaxWeight)
			{
				break;
			}

			if (($sumsByAssets[$universe[$i]['asset']] + $curPrice) / $totalSum * 100 > $assetMaxWeight)
			{
				break;
			}

			$modelPortfolioTotalSum += $curPrice;
			$sumsByAssetClasses[$assetClass] += $curPrice;
			$sumsByIssuers[$universe[$i]['issuer']] += $curPrice;
			$sumsByAssets[$universe[$i]['asset']] += $curPrice;

			$found = false;
			for ($j = 0, $max2 = sizeof($modelPortfolio); $j < $max2; $j++)
			{
				if ($modelPortfolio[$j]['code'] === $code)
				{
					$found = true;
					$modelPortfolio[$j]['count'] += 1;
				}
			}

			if (!$found)
			{
				$modelPortfolio[] = array_merge($universe[$i], ['count' => 1]);
			}
		}

	}

	return $modelPortfolio;
}

Flight::route('GET /portfolio', function () {
	//$db = getDb();
	$level = $_GET['level'];

	sendResponse(json_decode(file_get_contents("portfolio_$level.json"), true));
});

Flight::route('GET /availableLimits', function () {
	//$db = getDb();
	$level = $_GET['level'];
	sendResponse(array_values(getAvailableLimits($level)));
});

Flight::route('GET /generateRandomRealPortfolios', function () {

	$modelPortfolio = generatePortfolio("HIGH", 5, true);
	file_put_contents('portfolio_HIGH.json', json_encode($modelPortfolio));

	$modelPortfolio = generatePortfolio("LOW", 1, true);
	file_put_contents('portfolio_LOW.json', json_encode($modelPortfolio));
});


Flight::route('GET /recs', function () {
	$db = getDb();
	$level = $_GET['level'];
	$years = (int)$_GET['years'];
	$scenario = (int)$_GET['scenario'];
	$sorting = (int)$_GET['sorting'];

	$modelPortfolio = generatePortfolio($level, $years, false);
	var_dump($modelPortfolio);
	die;
	$portfolio = json_decode(file_get_contents("portfolio_$level.json"), true);
	$recs = [];

	for ($i = 0, $max = sizeof($portfolio); $i < $max; $i++)
	{
		$itemFound = false;
		for ($j = 0, $max2 = sizeof($modelPortfolio); $j < $max2; $j++)
		{
			if ($modelPortfolio[$j]['code'] === $portfolio[$i]['code'])
			{
				$itemFound = $modelPortfolio[$j];
				break;
			}
		}

		if ($itemFound === false)
		{
			$recs[] = array_merge($portfolio[$i], ['act' => 'sell', 'count' => $portfolio[$i]['count']]);
			continue;
		}

		if ($itemFound['count'] > $portfolio[$i]['count'])
		{
			$recs[] = array_merge($portfolio[$i], ['act' => 'buy', 'count' => $itemFound['count'] - $portfolio[$i]['count']]);
		}
		else if ($itemFound['count'] < $portfolio[$i]['count'])
		{
			$recs[] = array_merge($portfolio[$i], ['act' => 'sell', 'count' => $portfolio[$i]['count'] - $itemFound['count']]);
		}
	}

	sendResponse(['model' => $modelPortfolio, 'recs' => $recs]);
});

Flight::start();
