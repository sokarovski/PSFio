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
        
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        Route::group([
            'as' => 'psfio.',
            'middleware' => [],
            'namespace' => 'PS\PSFio',
            'prefix' => 'psfio',
        ], function ($router) {
            Route::any('/', ['as' => 'connector', 'uses' => 'PSFio@connector' ]);
            Route::any('/files', ['uses' => 'PSFio@files' ]);
            Route::any('/newFolder', ['uses' => 'PSFio@newFolder' ]);     
            Route::any('/upload', ['uses' => 'PSFio@upload' ]);     
            Route::any('/delete', ['uses' => 'PSFio@delete' ]);     
            Route::any('/rename', ['uses' => 'PSFio@rename' ]);     
            Route::any('/move', ['uses' => 'PSFio@move' ]);     
        });
        
    }
}
