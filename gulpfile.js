/* global require */
var elixir = require('laravel-elixir');
             require('laravel-elixir-imagemin');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir.config.images = {
    folder: 'img',
    outputFolder: 'img'
};

elixir(function(mix) {
    mix.sass('master.scss', 'resources/assets/css');
    mix.stylesIn("resources/assets/css/", "public/css");
    mix.scriptsIn("resources/assets/js/", 'public/js/');
    mix.imagemin();

    mix.scripts([
        'jquery/dist/jquery.js'
    ], 'public/js/dependencies.js', 'vendor/bower_components');
});
