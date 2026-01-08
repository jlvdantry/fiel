<?php
date_default_timezone_set('America/Mexico_City');
function getRealIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        // IP compartida de internet
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // IP pasada desde un proxy (puede ser una lista separada por comas)
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    } else {
        // Caso estándar
        return $_SERVER['REMOTE_ADDR'];
    }
}
function logData() {
	return 
                'ip=' .getRealIP().' fecha='.date('Y-m-d H:i:s');
}
if ($_SERVER['REQUEST_METHOD']!='POST') {
      die('Metodo no permitido');
}
$path='C:\Bitnami\wappstack-7.3.31-0\apache2\htdocs\fiel-dev\tmp\log';

$payload=file_get_contents('php://input');

$pl=json_decode($payload);
$url =  $pl->urlSAT;

$headers=json_decode($pl->headers);
$soapRequestXml = $pl->envelope;
error_log(logData().' url='.print_r($url,true).PHP_EOL,3,$path);


// 4. Initialize cURL session
$ch = curl_init();

// 5. Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true); // It's always a POST request for SOAP
curl_setopt($ch, CURLOPT_POSTFIELDS, $soapRequestXml); // The XML goes here
//error_log(logData().' payload='.print_r($soapRequestXml,true).PHP_EOL.' json_decode pl->headers='.print_r($pl->headers,true).PHP_EOL.PHP_EOL,3,$path);

//$headers['Content-Length']=strlen($soapRequestXml);
//
$curlHeaders = [];
$headersArray=json_decode($pl->headers);
foreach ($headersArray as $key => $value) {
    $curlHeaders[] = $key . ": " . $value;
}
//error_log(logData().' curlHeades='.print_r($curlHeaders,true).PHP_EOL,3,$path);
curl_setopt($ch, CURLOPT_HTTPHEADER, $curlHeaders);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return the response as a string
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For testing, avoid in production with real certificates
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // For testing, avoid in production
// Optional: For debugging, enable verbose output to error stream
curl_setopt($ch, CURLOPT_VERBOSE, true);
$verboseLog = fopen('php://temp', 'rw+');
curl_setopt($ch, CURLOPT_STDERR, $verboseLog);


// 6. Execute the cURL request
$response = curl_exec($ch);

// 7. Check for cURL errors
if (curl_errno($ch)) {
    echo 'cURL Error: ' . curl_error($ch);
} else {
    try {

        rewind($verboseLog);
        $verboseOutput = stream_get_contents($verboseLog);
        fclose($verboseLog);

	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	libxml_use_internal_errors(true);

        //echo json_encode($xml);
	$regresa=[ "status"=>$httpCode, "xml"=>$response ];
	$stringR1=str_replace('xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"','',$response);
	$stringR=str_replace('xmlns:h="http://DescargaMasivaTerceros.sat.gob.mx"','',$stringR1);
        $stringX=str_replace('xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"','',$stringR);
        $stringO=str_replace('xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"','',$stringX);

        $xml = simplexml_load_string($stringO);
        $res=json_decode(json_encode($xml));
        error_log(logData().' response='.print_r($response,true).' '.PHP_EOL,3,$path);
        //error_log(logData().PHP_EOL.' verbose='.$verboseOutput.' '.PHP_EOL,3,$path);
        //error_log(logData().PHP_EOL,3,$path);
	$regresa=[ "status"=>$httpCode, "xml"=>json_encode($xml) ];
	if (isset($res->{'s:Body'})) {
		if (isset($res->{'s:Body'}->{'AutenticaResponse'})) {
			$Created=$res->{'s:Header'}->{'o:Security'}->{'u:Timestamp'}->{'u:Created'};
			$Expires=$res->{'s:Header'}->{'o:Security'}->{'u:Timestamp'}->{'u:Expires'};
			$dt=new DateTime($Created);
			$Created=$dt->getTimestamp();
			$dt=new DateTime($Expires);
			$Expires=$dt->getTimestamp();
			$regresa=[ "status"=>$httpCode, 'Created'=>$Created,'Expires'=>$Expires
				,'token'=>$res->{'s:Body'}->{'AutenticaResponse'}->AutenticaResult];
			 echo json_encode($regresa);
		}
		if (isset($res->{'s:Body'}->{'SolicitaDescargaRecibidosResponse'})) {
			$SDRR=$res->{'s:Body'}->{'SolicitaDescargaRecibidosResponse'}->{'SolicitaDescargaRecibidosResult'}->{'@attributes'};
                        //error_log(logData().' SDRR='.print_r($SDRR,true).' '.PHP_EOL,3,$path);
			$regresa=[ "status"=>$httpCode,"CodEstatus"=>$SDRR->CodEstatus,"Mensaje"=>$SDRR->Mensaje,"IdSolicitud"=>$SDRR->IdSolicitud ];
			 echo json_encode($regresa);
		}
                if (isset($res->{'s:Body'}->{'SolicitaDescargaEmitidosResponse'})) {
                        $SDRR=$res->{'s:Body'}->{'SolicitaDescargaEmitidosResponse'}->{'SolicitaDescargaEmitidosResult'}->{'@attributes'};
                        //error_log(logData().' SDRR='.print_r($SDRR,true).' '.PHP_EOL,3,$path);
                        $regresa=[ "status"=>$httpCode,"CodEstatus"=>$SDRR->CodEstatus,"Mensaje"=>$SDRR->Mensaje,"IdSolicitud"=>$SDRR->IdSolicitud ];
                         echo json_encode($regresa);
                }
                if (isset($res->{'s:Body'}->{'SolicitaDescargaFolioResponse'})) {
                        $SDRR=$res->{'s:Body'}->{'SolicitaDescargaFolioResponse'}->{'SolicitaDescargaFolioResult'}->{'@attributes'};
                        //error_log(logData().' SDRR='.print_r($SDRR,true).' '.PHP_EOL,3,$path);
                        $regresa=[ "status"=>$httpCode,"CodEstatus"=>$SDRR->CodEstatus,"Mensaje"=>$SDRR->Mensaje,"IdSolicitud"=>$SDRR->IdSolicitud ];
                         echo json_encode($regresa);
                }
		if (isset($res->{'s:Body'}->{'VerificaSolicitudDescargaResponse'})) {
			$SDRR=$res->{'s:Body'}->{'VerificaSolicitudDescargaResponse'}->{'VerificaSolicitudDescargaResult'}->{'@attributes'};
			$IdsPaquetes=$res->{'s:Body'}->{'VerificaSolicitudDescargaResponse'}->{'VerificaSolicitudDescargaResult'}->{'IdsPaquetes'};
                        //error_log(logData().' SDRR='.print_r($SDRR,true).' '.PHP_EOL,3,$path);
			$regresa=[ "status"=>$httpCode,"CodEstatus"=>$SDRR->CodEstatus,"Mensaje"=>$SDRR->Mensaje,"EstadoSolicitud"=>$SDRR->EstadoSolicitud, "CodigoEstadoSolicitud"=>$SDRR->CodigoEstadoSolicitud,"NumeroCFDIs"=>$SDRR->NumeroCFDIs,"IdsPaquetes"=>$IdsPaquetes];
                        //error_log(logData().' regresa='.print_r($SDRR,true).' '.PHP_EOL,3,$path);
			 echo json_encode($regresa);
		}
                if (isset($res->{'s:Body'}->{'RespuestaDescargaMasivaTercerosSalida'})) {
                        $SDRR=$res->{'s:Header'}->{'h:respuesta'}->{'@attributes'};
                        $respuesta=$res->{'s:Header'};
                        $Paquete=$res->{'s:Body'}->{'RespuestaDescargaMasivaTercerosSalida'}->{'Paquete'};
                        //error_log(logData().' download SDRR='.print_r($SDRR,true).' '.PHP_EOL,3,$path);
                        //error_log(logData().' download s:header='.print_r($respuesta,true).' '.PHP_EOL,3,$path);
                        $regresa=[ "status"=>$httpCode,"CodEstatus"=>$SDRR->CodEstatus,"Mensaje"=>$SDRR->Mensaje,"Paquete"=>$Paquete];
                        echo json_encode($regresa);
                }
	}

    } catch (Exception $e) {
        echo "Error parsing XML response: " . $e->getMessage() . "\n";
    }
}

// 9. Close cURL session
curl_close($ch);
