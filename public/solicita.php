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
$path='C:\Bitnami\wappstack-7.3.31-0\apache2\htdocs\fiel-dev\tmp\log';
 
$payload=file_get_contents('php://input');
$h=getallheaders();
error_log(__FUNCTION__.' header= '.print_r($h,true).PHP_EOL,3,$path);
error_log(__FUNCTION__.' created= '.print_r(date('Y-m-d H:i:s',$h['token_created']),true).' expired='.print_r(date('Y-m-d H:i:s',$h['token_expired']),true).PHP_EOL,3,$path);
$tc = new DateTime(date('Y-m-d H:i:s',$h['token_created']));
$te = new DateTime(date('Y-m-d H:i:s',$h['token_expired']));
error_log(__FUNCTION__.' tc= '.print_r($tc,true).PHP_EOL,3,$path);
error_log(__FUNCTION__.' te= '.print_r($te,true).PHP_EOL,3,$path);
error_log(__FUNCTION__.' token_valuee= '.print_r($h['token_value'],true).PHP_EOL,3,$path);
error_log(__FUNCTION__.' payload= '.print_r($payload,true).PHP_EOL,3,$path);
$t= new Token($tc,$te,$h['token_value']);
error_log(__FUNCTION__.' token= '.print_r($t,true).PHP_EOL,3,$path);
echo json_encode($service->query_i($payload,$t));
