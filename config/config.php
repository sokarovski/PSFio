<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Root folder
    |--------------------------------------------------------------------------
    | The folder which will be the root of the file browser. This folder also 
    | Needs to be writeable and needs to resides inside the public dir. 
    */

    'root' => public_path('/files'),

    /*
    |--------------------------------------------------------------------------
    | Prefix 
    |--------------------------------------------------------------------------
    | The prefix that will be prepended for the routes that are used for the 
    | browser to connect to the Laravel backend. The routes start with /psfio 
    | prefix but if this is too global for you or you want to put it somewhere 
    | else fill free to prefix /psfio with anything
    | Ex: '/admin/supportpaths/'
    */

    'prefix' => '',

    /*
    |--------------------------------------------------------------------------
    | Middlewares 
    |--------------------------------------------------------------------------
    | The middlewares that are going to handle the routes. This is good to check
    | for authentication, groups, permissions or anythings else. For security
    | purposes is good to have at least ['auth'] so only authenticated users
    | can change files.
    */
   
   'middlewares' => [],

];