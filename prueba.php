<?php
$string = <<<XML
<?xml version='1.0'?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
	<s:Header>
           <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
	     <u:Timestamp u:Id="_0">
		    <u:Created>2025-06-12T02:11:40.138Z</u:Created>
		    <u:Expires>2025-06-12T02:16:40.138Z</u:Expires>
	     </u:Timestamp>
           </o:Security>
	</s:Header>
	<s:Body><AutenticaResponse xmlns="http://DescargaMasivaTerceros.gob.mx"><AutenticaResult>eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDk2OTQzMDAsImV4cCI6MTc0OTY5NDkwMCwiaWF0IjoxNzQ5Njk0MzAwLCJpc3MiOiJMb2FkU29saWNpdHVkRGVjYXJnYU1hc2l2YVRlcmNlcm9zIiwiYWN0b3J0IjoiMzAzMDMwMzAzMTMwMzAzMDMwMzAzMDM3MzAzMzM5MzIzODMwMzEzMCJ9.w_mOXhNraSKqLdNXk33SXkfACoFvUgxYCd4TMz2vJ7c%26wrap_subject%3d3030303031303030303030373033393238303130</AutenticaResult></AutenticaResponse>
	</s:Body>
</s:Envelope>
XML;
$stringR=str_replace('xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"','',$string);
$stringX=str_replace('xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"','',$stringR);
$stringO=str_replace('xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"','',$stringX);

$xml = simplexml_load_string($stringO);

print_r($xml);
echo json_encode($xml);
?>
