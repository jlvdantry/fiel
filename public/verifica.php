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
error_log(date('Y-m-d H:i:s', time()).' '.__FILE__.' get the header= '.PHP_EOL,3,$path);
error_log(date('Y-m-d H:i:s', time()).' '.__FILE__.' created= '.print_r(date('Y-m-d H:i:s',$h['token_created']),true).' expired='.print_r(date('Y-m-d H:i:s',$h['token_expired']),true).PHP_EOL,3,$path);
$tc = new DateTime(date('Y-m-d H:i:s',$h['token_created']));
$te = new DateTime(date('Y-m-d H:i:s',$h['token_expired']));
$t= new Token($tc,$te,$h['token_value']);
error_log(date('Y-m-d H:i:s', time()).' '.__FILE__.' pas new token= '.PHP_EOL,3,$path);
echo json_encode($service->verify_i($payload,$t));
