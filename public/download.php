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
error_log('download'.' header= '.print_r($h,true).PHP_EOL,3,'/var/tmp/firma_error.log');
error_log('download'.' created= '.print_r(date('Y-m-d H:i:s',$h['token_created']),true).' expired='.print_r(date('Y-m-d H:i:s',$h['token_expired']),true).PHP_EOL,3,'/var/tmp/firma_error.log');
$tc = new DateTime(date('Y-m-d H:i:s',$h['token_created']));
$te = new DateTime(date('Y-m-d H:i:s',$h['token_expired']));
$t= new Token($tc,$te,$h['token_value']);
error_log('download'.' token= '.print_r($t,true).PHP_EOL,3,'/var/tmp/firma_error.log');
$download=$service->download_i($payload,$t);
if (! $download->getStatus()->isAccepted()) {
        $msg=["msg"=>"El paquete no se ha podido descargar: ".$download->getStatus()->getMessage()];
        echo json_encode($msg);
} else {
	$archivo=["msg"=>"El paquete se descargo",'xml'=>base64_encode($download->getPackageContent())];
	echo json_encode($archivo);
	error_log('download'.' archivo= '.print_r($archivo,true).PHP_EOL,3,'/var/tmp/firma_error.log');
}
##echo json_encode($service->download_i($payload,$t));
