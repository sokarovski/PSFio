(function($, name) {

    $.fn[name] = function( methodOrOptions ) {

        var me = $(this);

        if (!me.length) 
            return me;

        var firstMe = $(this).eq(0);
        
        var instance = firstMe.data(name);
            
        // CASE: call method     
        if (instance && instance[ methodOrOptions ] && 
            typeof( instance[ methodOrOptions ] ) == 'function' ) {
            
            return instance[ methodOrOptions ]( Array.prototype.slice.call( arguments, 1 ) ); 
                
                
        // CASE: set options or initialize
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {

            methodOrOptions = methodOrOptions || {};
            methodOrOptions.inline = true;
            methodOrOptions.appendTo = firstMe;
            instance = new PS.PSFio( methodOrOptions );    // ok to overwrite if this is a re-init
            firstMe.data(name, instance);
            return me;
        
        // CASE: method called before init
        } else if ( !instance ) {
            $.error( 'Instance not created yet: ' + methodOrOptions );
        
        // CASE: invalid method
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist.' );
        }
    };

    $(document).ready(function() {
        var browsers = jQuery('*[data-psfio="file-browser"]');
        for (var i=0; i<browsers.length; i++)
            browsers.eq(i)[name]();
    });

})(jQuery, 'PSFFioFileBrowser');