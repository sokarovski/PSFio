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

- ~~Preview for images~~ Maybe cached thumbnails in future originals are shown for now
- ~~Better ServiceProvider for Laravel and publishing of static files~~
- ~~Add browse button helper hook~~
- ~~Add jQuery.fn.PSFioFileBrowser hook~~
- ~~Add jQuery.fn.PSFioImage hook~~
- Add multi user support so every Laravel user can have it's own files
- ~~Add Laravel config so you can configure the library options~~
- ~~Add support for Route prefix in Laravel~~
- ~~Add support for Middlewares in Laravel~~
- Multi file selection
- Move multiple files
- Delete multiple files
- ~~Create helper to expose all needed variables in blade (csrf, connector)~~
- Better Design
- Error Handling (permissions errors also)
- Add support for file sizes and creaton dates to the list
- Upload progress
- Filter files by type 

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

Then you will need to add the jquery, fontawesome, bootstrap and PSFio to your project and call the **PS\PSFio\PSFio::head()** method to generate connection variables. 

If you use any packager for assets you can just add the dependencies and **vendor/ps/psfio/css/psfio.css** and **vendor/ps/psfio/js/psfio.js** files to it.
```html
<head>
    {!! PS\PSFio\PSFio::head() !!}

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

### Browse button
You can also create a button that will allow browing files in popup with the following syntax. 
Note that you only need to add **data-psfio="browse"** to any element that you want to open a browser.
```html
<button class="btn btn-default" data-psfio="browse"><i class="fa fa-folder"></i> Browse my files</button>
```

### Image Widget

![alt text](https://github.com/sokarovski/PSFio/blob/master/thumbs/image_preview.jpg "Example if Image Widget")

If you are using the **laravelcollective/html** package you can use this code to create the widget
```html
<div class="form-group">
    {!! Form::label('image', 'Video') !!}
    {!! Form::hidden('image', NULL, ['data-psfio'=>'image']) !!}
</div> 
```

If you are not using it, it's pretty simple also
```html
<div class="form-group">
    <label>Video</label>
    <input type="hidden" value="{{ $model->myImage }}" name="myImage" data-psfio="image" />
</div> 
```

## License

Copyright 2016 [Petar Sokarovski](http://github.com/sokarovski)
