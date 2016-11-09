PS.PSFio.Widgets.Image = class {
    
    constructor(file, opts) {
        this.input = file;
        this.build(file);
        this.displayFile(file.val());
    }

    build(file) {
        var wrapper = jQuery('<div class="psfio-image-widget"></div>').insertAfter(file);
        var formGroup = jQuery('<div class="form-group"></div>').appendTo(wrapper);
        this.noImage = jQuery('<div>No image selected</div>').appendTo(formGroup);
        this.image = jQuery('<img class="img-responsive" />').appendTo(formGroup);

        var buttonGroup = jQuery('<div class="btn-group">').appendTo(wrapper);
        var browse = jQuery('<button type="button" class="btn btn-xs btn-default"><i class="fa fa-folder"></i> Browse</button>').appendTo(buttonGroup);
        var clear = jQuery('<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-remove"></i> Remove</button>').appendTo(buttonGroup);

        browse.on('click', this.browse.bind(this));
        clear.on('click', this.clear.bind(this));
        file.detach().appendTo(wrapper);
    }

    browse() {
        var fio = PS.PSFio.getShared();
        fio.setCallback(this.onPick.bind(this));
        fio.show();
    }

    onPick(files) {
        if (files.length > 0)
            this.displayFile(files[0]);
        
    }

    displayFile(file) {
        if (file == '')
            this.clear();
        else {
            this.input.val(file);
            this.image.show().attr('src', PS.PSFio.getAssetPath(file));
            this.noImage.hide();
        }
        
    }

    clear() {
        this.input.val('');
        this.image.hide();
        this.noImage.show();
    }

}