PS.PSFio.Renderers.Grid = {
    getFile: function(file) {
        var parts = this.getMutual(file);
        parts.element.addClass('ps-fio-grid-item-folder');
        var icon = PS.PSFio.FileHelper.getFaIconForFile(file);
        if (icon !== true)
            jQuery('<i class="fa"></i>').addClass(icon).appendTo(parts.image);
        return parts.element;
    },

    getFolder: function(folder) {
        var parts = this.getMutual(folder);
        parts.element.addClass('ps-fio-grid-item-folder');
        parts.image.append('<i class="fa fa-folder"></i>');
        return parts.element;
    },

    getUP: function(text) {
        var parts = this.getCol();
        parts.name.text(text);
        parts.element.addClass('ps-fio-grid-item-back');
        parts.image.append('<i class="fa fa-level-up"></i>');
        return parts.element;
    },

    getMutual: function(item) {
        var parts = this.getCol();
        var remove = jQuery('<a href="javascript:;" class="btn btn-xs btn-danger psfio-remove"><i class="fa fa-trash"></i></a>');
        var rename = jQuery('<a href="javascript:;" class="btn btn-xs btn-default psfio-rename"><i class="fa fa-edit"></i></a>');
        parts.btnGroup.append(rename).append(remove);
        parts.name.text(item);
        return parts;
    },

    getCol: function() {
        var element = jQuery('<div class="psfio-grid-item"></div>');
        var inner = jQuery('<div class="psfio-grid-item-inner"></div>');
        var name = jQuery('<p class="psfio-name"></p>');
        var imageSizer = jQuery('<div class="psfio-grid-item-image-sizer"></div>');
        var image = jQuery('<div class="psfio-grid-item-image"></div>');
        var btnGroup = jQuery('<div class="btn-group"></div>');

        element.append(inner);
        inner.append(imageSizer).append(name);
        imageSizer.append(image);
        inner.append(btnGroup);

        return {
            element: element,
            name: name,
            inner: inner,
            image: image,
            btnGroup: btnGroup
        }
    },

    prepare: function(pane) {
        var list = jQuery('<div class="psfio-grid-list"></div>');
        pane.append(list);
        list.on('mousedown', function(e) {e.preventDefault()});
        return list;
    },

    clear: function(fileList) {
        fileList.empty();
    },

    getIcon: function() {
        return 'fa-th';
    },

    getIdentifier: function() {
        return 'Grid';
    }
}