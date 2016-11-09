$(document).ready(function() {
    var browsers = jQuery('*[data-psfio="browse"]');
    for (var i=0; i<browsers.length; i++) {
        browsers.eq(i).on('click', function() {
            PS.PSFio.getShared().show();
        });
    }
});