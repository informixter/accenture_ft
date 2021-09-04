<?php

use Medoo\Medoo;

require __DIR__ . '/vendor/autoload.php';

function getDb ()
{
	return new Medoo(['database_type' => 'pgsql', 'database_name' => 'main', 'server' => 'postgres', 'username' => 'accenture_ft', 'password' => 'accenture_ft_secret_pwsd']);
}

function sendResponse ($data, $errorMessage = '')
{
	$success = true;
	if ($errorMessage !== '')
	{
		$success = false;
	}

	$response = ['success' => $success, 'message' => $errorMessage, 'data' => $data];
	echo json_encode($response);
	die;
}

