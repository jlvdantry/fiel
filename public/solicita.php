<?php
if ($_SERVER['REQUEST_METHOD']!='POST') {
      die('Metodo no permitido');
}
require '../vendor/autoload.php';
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\FielRequestBuilder\Fiel;
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\FielRequestBuilder\FielRequestBuilder;
use PhpCfdi\SatWsDescargaMasiva\Service;
use PhpCfdi\SatWsDescargaMasiva\WebClient\GuzzleWebClient;
use PhpCfdi\SatWsDescargaMasiva\shared\Token;

$webClient = new GuzzleWebClient();

$service = new Service(null, $webClient);
 
$payload=file_get_contents('php://input');
$h=getallheaders();
error_log("header= ",3,$h,"/var/tmp/my-errors.log");
$t= new Token(Datetime('@'.$h['token_created']),Datetime('@'.$h['token_expired']),$h['token_value']);
echo json_encode($service->query_i($payload,$t));
