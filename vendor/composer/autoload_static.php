<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit45c8e2cc24046f8d8cac0ccc1cf7c7c9
{
    public static $files = array (
        '7b11c4dc42b3b3023073cb14e519683c' => __DIR__ . '/..' . '/ralouphie/getallheaders/src/getallheaders.php',
        'c964ee0ededf28c96ebd9db5099ef910' => __DIR__ . '/..' . '/guzzlehttp/promises/src/functions_include.php',
        '6e3fae29631ef280660b3cdad06f25a8' => __DIR__ . '/..' . '/symfony/deprecation-contracts/function.php',
        '37a3dc5111fe8f707ab4c132ef1dbc62' => __DIR__ . '/..' . '/guzzlehttp/guzzle/src/functions_include.php',
    );

    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'Psr\\Http\\Message\\' => 17,
            'Psr\\Http\\Client\\' => 16,
            'PhpCfdi\\SatWsDescargaMasiva\\' => 28,
            'PhpCfdi\\Rfc\\' => 12,
            'PhpCfdi\\Credentials\\' => 20,
        ),
        'G' => 
        array (
            'GuzzleHttp\\Psr7\\' => 16,
            'GuzzleHttp\\Promise\\' => 19,
            'GuzzleHttp\\' => 11,
        ),
        'E' => 
        array (
            'Eclipxe\\MicroCatalog\\' => 21,
            'Eclipxe\\Enum\\' => 13,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Psr\\Http\\Message\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/http-factory/src',
            1 => __DIR__ . '/..' . '/psr/http-message/src',
        ),
        'Psr\\Http\\Client\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/http-client/src',
        ),
        'PhpCfdi\\SatWsDescargaMasiva\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpcfdi/sat-ws-descarga-masiva/src',
        ),
        'PhpCfdi\\Rfc\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpcfdi/rfc/src',
        ),
        'PhpCfdi\\Credentials\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpcfdi/credentials/src',
        ),
        'GuzzleHttp\\Psr7\\' => 
        array (
            0 => __DIR__ . '/..' . '/guzzlehttp/psr7/src',
        ),
        'GuzzleHttp\\Promise\\' => 
        array (
            0 => __DIR__ . '/..' . '/guzzlehttp/promises/src',
        ),
        'GuzzleHttp\\' => 
        array (
            0 => __DIR__ . '/..' . '/guzzlehttp/guzzle/src',
        ),
        'Eclipxe\\MicroCatalog\\' => 
        array (
            0 => __DIR__ . '/..' . '/eclipxe/micro-catalog/src',
        ),
        'Eclipxe\\Enum\\' => 
        array (
            0 => __DIR__ . '/..' . '/eclipxe/enum/src',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit45c8e2cc24046f8d8cac0ccc1cf7c7c9::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit45c8e2cc24046f8d8cac0ccc1cf7c7c9::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
