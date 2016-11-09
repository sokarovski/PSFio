# PSFio

PSFio is a File Browser and File Picker which is built with Bootstrap interface and has a Laravel 5.3 connector that allows it to work with any Laravel 5.3 applications. It is very usefull when you need to mock some Admin areas or just give users access to browse and manage files. The idea is to support many other backend frameworks so Laravel is just the begining that i need for now. 

## Requirements

- PHP >=5.4
- Laravel >= 5.3
- Bootstrap >= 3
- FontAwesome

## TODO

- Preview for images
- ~~Better ServiceProvider for Laravel and publishing of static files~~
- Add multi user support so every Laravel user can have it's own files
- Add Laravel config so you can configure the library options
- Add support for Route prefix in Laravel
- Add support for Middlewares in Laravel
- Multi file selection
- Move multiple files
- Delete multiple files
- Create helper to expose all needed variables in blade (csrf, connector)

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

You will also need to publish the public files 
```bash
php artisan vendor:publish --tag=public
```

Then you will need to add the jquery, fontawesome, bootstrap and PSFio to your project. 

You will also need to specify the connector which helps PSFio find the route to your Laravel installation if you not provide one /psfio will be assumed. So if your laravel is working on root folder then you dont need to provide one but if you have installed laravel in a subfolder or you have changed the config of the routes to be prefixed then this is required.

You will also need to provide the csrf_token in the head. For more information on csrf token read: https://laravel.com/docs/5.3/csrf

If you use any packager for frontend files you can just add the dependencies and **vendor/ps/psfio/css/psfio.min.css** and **vendor/ps/psfio/js/psfio.min.js** files to it.
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
## Another Usage

PSFio **will** soon provide jQuery hooks for inline file browser, browse button and simple image picker.

## License

MediaParser is licensed under the [MIT License](http://opensource.org/licenses/MIT).

Copyright 2016 [Petar Sokarovski](http://github.com/sokarovski)