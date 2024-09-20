<?php
if ($_SERVER['REQUEST_METHOD']!='POST') {
      die('Metodo no permitido');
}
require '../vendor/autoload.php';
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\FielRequestBuilder\Fiel;
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\FielRequestBuilder\FielRequestBuilder;
use PhpCfdi\SatWsDescargaMasiva\Service;
use PhpCfdi\SatWsDescargaMasiva\WebClient\GuzzleWebClient;
$path='C:\Bitnami\wappstack-7.3.31-0\apache2\htdocs\fiel-dev\tmp\log';
$webClient = new GuzzleWebClient();

$service = new Service(null, $webClient);
 
$payload=file_get_contents('php://input');
error_log(__FUNCTION__.' payload= '.print_r($payload,true).PHP_EOL,3,$path);
echo json_encode($service->authenticate_i($payload));

