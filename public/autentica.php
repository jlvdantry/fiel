<?php
if ($_SERVER['REQUEST_METHOD']!='POST') {
      die('Metodo no permitido');
}
require '../vendor/autoload.php';
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\FielRequestBuilder\Fiel;
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\FielRequestBuilder\FielRequestBuilder;
use PhpCfdi\SatWsDescargaMasiva\Service;
use PhpCfdi\SatWsDescargaMasiva\WebClient\GuzzleWebClient;

$webClient = new GuzzleWebClient();

$service = new Service(null, $webClient);
 
$payload=file_get_contents('php://input');

##echo print_r($service->authenticate_i($payload),true);
##echo print_r($payload,true);
echo json_encode($service->authenticate_i($payload));
