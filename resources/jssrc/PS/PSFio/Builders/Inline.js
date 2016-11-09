PS.PSFio.Builders.Inline = class {
    
    constructor(opts) {
        opts = opts || {};
        this.buttons = opts.appendButtonsTo;
        this.appendTo = jQuery(opts.appendTo);
        console.log(opts);
        this.build();
    }

    build() {
        console.log(this.appendTo);
        this.element = jQuery('<div class="psfio psfio-inline"></div>').appendTo(this.appendTo);
        
        if (!this.buttons) 
            this.buttons = jQuery('<div class="psfio-buttons"></div>').appendTo(this.element);

        this.pane = jQuery('<div class="psfio-pane"></div>').appendTo(this.element);
    }

    clean() {
        this.element.remove();
    }

}