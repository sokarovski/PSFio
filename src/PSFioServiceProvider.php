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

        if (! $this->app->routesAreCached()) {
            Route::group([
                'as' => 'psfio.',
                'middleware' => [],
                'namespace' => 'PS\PSFio',
                'prefix' => 'psfio',
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
}
