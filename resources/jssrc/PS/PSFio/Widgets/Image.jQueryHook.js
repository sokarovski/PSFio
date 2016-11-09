(function($, name) {

    $.fn[name] = function( methodOrOptions ) {
        var me = $(this);
        if (!me.length) 
            return me;

        var firstMe = me.eq(0);
        
        var instance = firstMe.data(name);
            
        // CASE: call method     
        if (instance && instance[ methodOrOptions ] && 
            typeof( instance[ methodOrOptions ] ) == 'function' ) {
            
            return instance[ methodOrOptions ]( Array.prototype.slice.call( arguments, 1 ) ); 
                
                
        // CASE: set options or initialize
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {

            instance = new PS.PSFio.Widgets.Image( firstMe, methodOrOptions );    // ok to overwrite if this is a re-init
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
        var inputs = $('input[data-psfio="image"]');
        for (var i=0; i<inputs.length; i++)
            inputs.eq(i)[name]();
    });

})(jQuery, 'PSFioImage');