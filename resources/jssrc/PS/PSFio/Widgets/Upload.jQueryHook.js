(function($, name) {

    $.fn[name] = function( methodOrOptions ) {

        if (!$(this).length) 
            return $(this);
        
        var instance = $(this).data(name);
            
        // CASE: call method     
        if (instance && instance[ methodOrOptions ] && 
            typeof( instance[ methodOrOptions ] ) == 'function' ) {
            
            return instance[ methodOrOptions ]( Array.prototype.slice.call( arguments, 1 ) ); 
                
                
        // CASE: set options or initialize
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {

            instance = new PS.PSFio.Widgets.Upload( $(this), methodOrOptions );    // ok to overwrite if this is a re-init
            $(this).data(name, instance);
            return $(this);
        
        // CASE: method called before init
        } else if ( !instance ) {
            $.error( 'Instance not created yet: ' + methodOrOptions );
        
        // CASE: invalid method
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist.' );
        }
    };

    $(document).ready(function() {
        jQuery('input[data-psfio]')[name]();
    });

})(jQuery, 'PSFioUpload');