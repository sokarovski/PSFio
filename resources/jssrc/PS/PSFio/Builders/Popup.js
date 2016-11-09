PS.PSFio.Builders.Popup = class {
    
    constructor(opts) {
        opts = opts || {};
        this.appendTo = opts.appendTo ? jQuery(opts.appendTo) : 'body';
        this.closeOnEscape = opts.closeOnEscape !== false;
        this.shouldShow = opts.show !== false;
        this.build(opts);
    }
    
    build() {
        
        var html = 
        '<div class="modal fade psfio" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog modal-lg" role="document">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        '<div class="psfio-buttons"></div>' +
                    '</div>' +
                    '<div class="modal-body"><div class="psfio-pane"></div></div>' +
                    // '<div class="modal-footer"></div>' +
                '</div>' + 
            '</div>' +
        '</div>';
        var modal =  jQuery(html);

        modal.find('.modal-dialog').css('height', '85%');
        modal.find('.modal-content').css('height', '100%');

        modal.appendTo(this.appendTo);
        modal.modal({
            keyboard: this.closeOnEscape,
            show: this.shouldShow
        });
        this.modal = modal;
        this.buttons = modal.find('.psfio-buttons');
        this.pane = modal.find('.psfio-pane');
    }

    clean() {
        this.modal.remove();
        this.buttons = null;
        this.pane = null;
        this.appendTo = null;
    }

    show() {
        this.modal.modal('show');
    }

    hide() {
        this.modal.modal('hide')
    }

}