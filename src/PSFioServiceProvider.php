<?php

namespace PS\PSFio;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class PSFioServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->publishes([
            __DIR__.'/../resources/css/' => public_path('vendor/ps/psfio/css/'),
            __DIR__.'/../resources/js/' => public_path('vendor/ps/psfio/js/')
        ], 'public');

        $this->publishes([
            __DIR__.'/../config/config.php' => config_path('psfio.php'),
        ], 'config');

        if (! $this->app->routesAreCached()) {
            $prefix = $this->getPrefix();

            Route::group([
                'as' => 'psfio.',
                'middleware' => config('psfio.middlewares', []),
                'namespace' => 'PS\PSFio',
                'prefix' => $prefix,
            ], function ($router) {
                require __DIR__.'/../routes.php';   
            });
        }
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        
    }

    public function getPrefix() {
        $prefix = config('psfio.prefix', '');
        if ($prefix == '')
            return 'psfio';

        if (substr($prefix, -1, 1) == '/')
            $prefix = substr($prefix, 0, -1);

        return $prefix.'/psfio';
    }
}
