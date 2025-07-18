<?php

declare(strict_types=1);

namespace PhpCfdi\SatWsDescargaMasiva\Internal;

use PhpCfdi\SatWsDescargaMasiva\Shared\Token;
use PhpCfdi\SatWsDescargaMasiva\WebClient\Exceptions\HttpClientError;
use PhpCfdi\SatWsDescargaMasiva\WebClient\Exceptions\HttpServerError;
use PhpCfdi\SatWsDescargaMasiva\WebClient\Exceptions\SoapFaultError;
use PhpCfdi\SatWsDescargaMasiva\WebClient\Exceptions\WebClientException;
use PhpCfdi\SatWsDescargaMasiva\WebClient\Request;
use PhpCfdi\SatWsDescargaMasiva\WebClient\Response;
use PhpCfdi\SatWsDescargaMasiva\WebClient\WebClientInterface;
use Throwable;

/**
 * Method Service::consume extraction
 *
 * This class is internal, do not use it outside this project
 * @internal
 */
class ServiceConsumer
{
    public static function consume(WebClientInterface $webclient, string $soapAction, string $uri, string $body, ?Token $token): string
    {
        return (new self())->execute($webclient, $soapAction, $uri, $body, $token);
    }

    public function execute(WebClientInterface $webclient, string $soapAction, string $uri, string $body, ?Token $token): string
    {
        $path='C:\Bitnami\wappstack-7.3.31-0\apache2\htdocs\fiel-dev\tmp\log';
        $headers = $this->createHeaders($soapAction, $token);
        $request = $this->createRequest($uri, $body, $headers);
        $exception = null;
        try {
            $response = $this->runRequest($webclient, $request);
        } catch (WebClientException $webClientException) {
            $exception = $webClientException;
            $response = $webClientException->getResponse();
        }
        error_log(__METHOD__.' uri='.print_r($uri,true).PHP_EOL,3,$path);
        error_log(__METHOD__.' soapAction='.print_r($soapAction,true).PHP_EOL,3,$path);
        error_log(__METHOD__.' body='.print_r($body,true).PHP_EOL,3,$path);
        error_log(__METHOD__.' token='.print_r($token,true).PHP_EOL,3,$path);
        error_log(__FUNCTION__.' response='.print_r($response,true).PHP_EOL,3,$path);
        $this->checkErrors($request, $response, $exception);
        return $response->getBody();
    }

    /**
     * @param string $uri
     * @param string $body
     * @param array<string, string> $headers
     * @return Request
     */
    public function createRequest(string $uri, string $body, array $headers): Request
    {
        return new Request('POST', $uri, $body, $headers);
    }

    /**
     * @param string $soapAction
     * @param Token|null $token
     * @return array<string, string>
     */
    public function createHeaders(string $soapAction, ?Token $token): array
    {
        $headers = ['SOAPAction' => $soapAction];
        if (null !== $token) {
            $headers['Authorization'] = 'WRAP access_token="' . $token->getValue() . '"';
        }
        return $headers;
    }

    public function runRequest(WebClientInterface $webclient, Request $request): Response
    {
        $webclient->fireRequest($request);
        try {
            $response = $webclient->call($request);
        } catch (WebClientException $exception) {
            $webclient->fireResponse($exception->getResponse());
            throw $exception;
        }
        $webclient->fireResponse($response);
        return $response;
    }

    public function checkErrors(Request $request, Response $response, ?Throwable $exception = null): void
    {
        // evaluate SoapFaultInfo
        $fault = SoapFaultInfoExtractor::extract($response->getBody());
        if (null !== $fault) {
            throw new SoapFaultError($request, $response, $fault, $exception);
        }

        // evaluate response
        if ($response->statusCodeIsClientError()) {
            $message = sprintf('Unexpected client error status code %d', $response->getStatusCode());
            throw new HttpClientError($message, $request, $response, $exception);
        }
        if ($response->statusCodeIsServerError()) {
            $message = sprintf('Unexpected server error status code %d', $response->getStatusCode());
            throw new HttpServerError($message, $request, $response, $exception);
        }
        if ($response->isEmpty()) {
            throw new HttpServerError('Unexpected empty response from server', $request, $response, $exception);
        }
    }
}
