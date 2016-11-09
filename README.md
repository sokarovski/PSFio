# PSFio

PSFio is a File Browser and File Picker which is built with Bootstrap interface and has a Laravel 5.3 connector that allows it to work with any Laravel 5.3 applications. It is very usefull when you need to mock some Admin areas or just give users access to browse and manage files. The idea is to support many other backend frameworks so Laravel is just the begining that i need for now. 

![alt text](https://github.com/sokarovski/PSFio/blob/master/thumbs/inline_grid.png "Inline Browser with Grid Renderer")

![alt text](https://github.com/sokarovski/PSFio/blob/master/thumbs/popup_table.png "Popup Browser with Table Renderer")

## Requirements

- PHP >=5.4
- Laravel >= 5.3
- Bootstrap >= 3
- FontAwesome

## TODO

- Preview for images
- ~~Better ServiceProvider for Laravel and publishing of static files~~
- Add jQuery.fn.PSFioBrowse hook
- ~~Add jQuery.fn.PSFFioFileBrowser hook~~
- Add jQuery.fn.Upload hook
- Add multi user support so every Laravel user can have it's own files
- ~~Add Laravel config so you can configure the library options~~
- ~~Add support for Route prefix in Laravel~~
- ~~Add support for Middlewares in Laravel~~
- Multi file selection
- Move multiple files
- Delete multiple files
- ~~Create helper to expose all needed variables in blade (csrf, connector)~~

## Installation

First you need to add the git repository to your composer.json and lower the *minimum-stability* to **dev** since this package is not yet in stable version
```json
"minimum-stability": "dev",
```
and 
```json
"repositories": [
    {
        "type": "vcs",
        "url": "https://github.com/sokarovski/PSFio.git"
    }
]
```

Then you need to require the package with composer 
```bash
composer require ps/psfio
```

Register the plugin service provider inside your **config/app.php**
```php
    /*
     * Application Service Providers...
     */
    App\Providers\AppServiceProvider::class,
    App\Providers\AuthServiceProvider::class,
    // App\Providers\BroadcastServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    App\Providers\RouteServiceProvider::class,
    
    //Paste this line
    PS\PSFio\PSFioServiceProvider::class,
```

You will also need to publish the public files 
```bash
php artisan vendor:publish --tag=config
php artisan vendor:publish --tag=public
```

At this point you can go to **config/psfio.php** to setup some paths if you like but if you dont do it PSFio will work automatically in public/files/ folder.

Then you will need to add the jquery, fontawesome, bootstrap and PSFio to your project. 

You will also need to specify the connector which helps PSFio find the route to your Laravel installation. If you not provide one /psfio will be assumed. If your Laravel is working on root folder then you dont need to provide one but if you have installed Laravel in a subfolder or you have changed the config of the routes to be prefixed then this is required.

You will also need to provide the csrf_token in the head. For more information on csrf token read: https://laravel.com/docs/5.3/csrf

If you use any packager for assets you can just add the dependencies and **vendor/ps/psfio/css/psfio.css** and **vendor/ps/psfio/js/psfio.js** files to it.
```html
<head>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="psfio-connector" content="{{ route('psfio.connector') }}">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="{{ asset('vendor/ps/psfio/css/psfio.min.css') }}">
</head>
<body>
...
<script src="https://code.jquery.com/jquery-3.1.1.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="{{ asset('vendor/ps/psfio/js/psfio.min.js') }}"></script>
</body>
```

If you dont want to print the csrf token separately from the connector and want and easier code you can also do this instead of the two lines above 
```html
<head>
    <!-- replace this two lines -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="psfio-connector" content="{{ route('psfio.connector') }}">

    <!-- with this line -->
    {!! PS\PSFio\PSFio::head() !!}
</head>
...
```

You will also need to create the files folder where all the files will reside and add public permissions to it
```bash
mkdir public/files
chmod 777 public/files
```

## Usage

If you have completed the steps above you are all set to go. You can connect any button to open up the file browser like so:
```html
<button class="btn btn-default" onclick="PS.PSFio.getShared().show();"><i class="fa fa-folder"></i> Browse</button>
```

You can also show the file browser inline
```html
<div class="file-browser"></div>

...

<script src="https://code.jquery.com/jquery-3.1.1.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="{{ asset('vendor/ps/psfio/js/psfio.min.js') }}"></script>
<script>
    new PS.PSFio({
        inline: true,
        appendTo: '.file-browser'
    });
</script>
```
## Another Usage and jQuery hooks

### File Browser
Initiating inline file browser
```html
<div data-psfio="file-browser"></div>
```

Or if you want to do manually with custom options
```html
<div class="file-browser"></div>

...

<script src="https://code.jquery.com/jquery-3.1.1.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="{{ asset('vendor/ps/psfio/js/psfio.min.js') }}"></script>
<script>
    jQuery('.file-browser').PSFioFileBrowser({ /* options */ });
</script>
```

### Other hooks
PSFio **will** soon provide jQuery hooks for browse button and simple image picker.


## License

MediaParser is licensed under the [MIT License](http://opensource.org/licenses/MIT).

Copyright 2016 [Petar Sokarovski](http://github.com/sokarovski)