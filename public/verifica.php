<?php
if ($_SERVER['REQUEST_METHOD']!='POST') {
      die('Metodo no permitido');
}
require '../vendor/autoload.php';
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\FielRequestBuilder\Fiel;
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\FielRequestBuilder\FielRequestBuilder;
use PhpCfdi\SatWsDescargaMasiva\Service;
use PhpCfdi\SatWsDescargaMasiva\WebClient\GuzzleWebClient;
use PhpCfdi\SatWsDescargaMasiva\Shared\Token;
use PhpCfdi\SatWsDescargaMasiva\Shared\DateTime;

$webClient = new GuzzleWebClient();

$service = new Service(null, $webClient);
 
$payload=file_get_contents('php://input');
$h=getallheaders();
error_log('verifica'.' header= '.print_r($h,true).PHP_EOL,3,'/var/tmp/firma_error.log');
error_log('verifica'.' created= '.print_r(date('Y-m-d H:i:s',$h['token_created']),true).' expired='.print_r(date('Y-m-d H:i:s',$h['token_expired']),true).PHP_EOL,3,'/var/tmp/firma_error.log');
$tc = new DateTime(date('Y-m-d H:i:s',$h['token_created']));
$te = new DateTime(date('Y-m-d H:i:s',$h['token_expired']));
error_log('verifica'.' tc= '.print_r($tc,true).PHP_EOL,3,'/var/tmp/firma_error.log');
error_log('verifica'.' te= '.print_r($te,true).PHP_EOL,3,'/var/tmp/firma_error.log');
error_log('verifica'.' token_valuee= '.print_r($h['token_value'],true).PHP_EOL,3,'/var/tmp/firma_error.log');
error_log('verifica'.' payload= '.print_r($payload,true).PHP_EOL,3,'/var/tmp/firma_error.log');
$t= new Token($tc,$te,$h['token_value']);
error_log('verifica'.' token= '.print_r($t,true).PHP_EOL,3,'/var/tmp/firma_error.log');
echo json_encode($service->verify_i($payload,$t));
