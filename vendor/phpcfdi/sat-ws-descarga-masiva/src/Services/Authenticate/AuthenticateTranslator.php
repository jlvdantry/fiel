<?php

declare(strict_types=1);

namespace PhpCfdi\SatWsDescargaMasiva\Services\Authenticate;

use PhpCfdi\SatWsDescargaMasiva\Internal\InteractsXmlTrait;
use PhpCfdi\SatWsDescargaMasiva\RequestBuilder\RequestBuilderInterface;
use PhpCfdi\SatWsDescargaMasiva\Shared\DateTime;
use PhpCfdi\SatWsDescargaMasiva\Shared\Token;

/** @internal */
class AuthenticateTranslator
{
    use InteractsXmlTrait;

    public function createTokenFromSoapResponse(string $content): Token
    {
        $path='C:\Bitnami\wappstack-7.3.31-0\apache2\htdocs\fiel-dev\tmp\log';
        $env = $this->readXmlElement($content);
        $created = DateTime::create($this->findContent($env, 'header', 'security', 'timestamp', 'created') ?: 0);
        $expires = DateTime::create($this->findContent($env, 'header', 'security', 'timestamp', 'expires') ?: 0);
        $value = $this->findContent($env, 'body', 'autenticaResponse', 'autenticaResult');
        error_log(__FUNCTION__.' created= '.print_r($created,true).' expires='.print_r($expires,true).PHP_EOL,3,$path);
        return new Token($created, $expires, $value);
    }

    public function createSoapRequest(RequestBuilderInterface $requestBuilder): string
    {
        $since = DateTime::now();
        $until = $since->modify('+ 5 minutes');
        return $this->createSoapRequestWithData($requestBuilder, $since, $until);
    }

    public function createSoapRequestWithData(
        RequestBuilderInterface $requestBuilder,
        DateTime $since,
        DateTime $until,
        string $securityTokenId = ''
    ): string {
        return $requestBuilder->authorization($since, $until, $securityTokenId);
    }
}
