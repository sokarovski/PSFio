if (!PS) var PS = {};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

PS.PSFio = function () {

    /**=============================================================================================
     * Constructing
     =============================================================================================*/

    function _class(opts) {
        _classCallCheck(this, _class);

        opts = opts || {};
        this.inline = !!opts.inline;
        this.buildWith = opts.builder;
        this.allowMultipleUploads = opts.multiple !== false;
        this.loadedDir = '';
        this.currentFolder = '';
        this.fileList = null;
        this.callback = opts.callback;
        this.destroyOnPick = opts.destroyOnPick;

        this.parseConnector(opts.connector);
        this.build(opts);
        this.buildElements();
        this.findDefaultRenderer(opts.renderer);
        this.refresh();
    }

    _class.prototype.parseConnector = function parseConnector(preferedConnector) {
        var headConnector;

        if (preferedConnector) {
            this.connector = preferedConnector;
        } else if (headConnector = $('meta[name="psfio-connector"]').attr('content')) {
            this.connector = headConnector;
        } else {
            this.connector = '/psfio';
        }

        if (this.connector && this.connector.substr(-1) != '/') this.connector += '/';
    };

    _class.prototype.setCallback = function setCallback(callback) {
        this.callback = callback;
    };

    _class.prototype.findDefaultRenderer = function findDefaultRenderer(preferedRenderer) {
        var sessionRenderer;

        if (preferedRenderer) this.setRenderer(preferedRenderer);else if (sessionRenderer = localStorage.getItem('psfio-renderer')) this.setRenderer(PS.PSFio.Renderers[sessionRenderer]);else this.setRenderer(PS.PSFio.Renderers.Grid);
    };

    _class.prototype.setRenderer = function setRenderer(renderer) {
        if (this.renderer) this.renderer.clear(this.fileList);

        this.builder.pane.empty();
        this.renderer = renderer;
        this.fileList = this.renderer.prepare(this.builder.pane);

        this.renderersGroup.find('.active').removeClass('active');
        this.renderersGroup.find('*[data-id=' + renderer.getIdentifier() + ']').addClass('active');

        this.render();
    };

    _class.prototype.build = function build(opts) {
        var builder = this.buildWith || this.inline ? PS.PSFio.Builders.Inline : PS.PSFio.Builders.Popup;

        this.builder = new builder(opts);
    };

    /**=============================================================================================
     * Navbar
     =============================================================================================*/

    _class.prototype.buildElements = function buildElements() {
        this.buildNewFolderButton();
        this.buildUploadButton();
        this.buildRenderersButtons();
    };

    _class.prototype.buildUploadButton = function buildUploadButton() {
        this.builder.buttons.append(document.createTextNode(' '));
        var uploadFile = jQuery('<div class="btn btn-xs btn-default"><i class="fa fa-upload"></i> Upload File</div>');
        this.builder.buttons.append(uploadFile);
        this.buildUpload(uploadFile);
    };

    _class.prototype.buildUpload = function buildUpload(inElement) {
        var upload = jQuery('<input type="file" name="uploads[]" />');
        upload.on('change', this.handleUpload.bind(this, inElement));
        if (this.allowMultipleUploads) upload.attr('multiple', '');

        var holder = inElement.find('.psfio-uploadholder');
        if (holder.length == 0) {
            holder = jQuery('<div class="psfio-uploadholder"></div>');
            inElement.css('position', 'relative');
            inElement.append(holder);
        }

        holder.empty().append(upload);
    };

    _class.prototype.handleUpload = function handleUpload(inElement) {
        var formData = this.getFormDataFromUpload(inElement);
        this.uploadFiles(formData);
        this.buildUpload(inElement);
    };

    _class.prototype.getFormDataFromUpload = function getFormDataFromUpload(input) {
        var form = jQuery('<form></form>');
        var folder = jQuery('<input type="text" name="folder" />').val(this.loadedDir);
        form.append(input.find('input[type=file]')).append(folder);
        return new FormData(form[0]);
    };

    _class.prototype.buildNewFolderButton = function buildNewFolderButton() {
        var newFolder = jQuery('<button class="btn btn-xs btn-default"><i class="fa fa-plus"></i>  New Folder</button>');
        newFolder.on('click', this.makeNewFolder.bind(this));
        this.builder.buttons.append(newFolder);
    };

    _class.prototype.makeNewFolder = function makeNewFolder() {
        var newFolderName = prompt('New folder name:');
        if (newFolderName) this.newFolder(newFolderName);
    };

    _class.prototype.buildRenderersButtons = function buildRenderersButtons() {
        var renderersGroup = jQuery('<div class="btn-group"></div>');
        this.renderersGroup = renderersGroup;

        var table = jQuery('<btn class="btn btn-xs btn-default"><i class="fa fa-th-list"></i></btn>');
        var renderers = 0;
        for (var x in PS.PSFio.Renderers) {
            var renderer = PS.PSFio.Renderers[x];
            if (renderer.getIcon && renderer.getIdentifier) {
                var rendererButton = jQuery('<btn class="btn btn-xs btn-default" ></btn>');
                rendererButton.attr('data-id', renderer.getIdentifier());
                rendererButton.on('click', this.pickRenderer.bind(this, renderer));
                jQuery('<i class="fa fa-th"></i>').addClass(renderer.getIcon()).appendTo(rendererButton);
                renderersGroup.append(rendererButton);
                renderers++;
            }
        }

        if (renderers > 0) {
            this.builder.buttons.append(document.createTextNode(' '));
            this.builder.buttons.append(renderersGroup);
        }
    };

    _class.prototype.pickRenderer = function pickRenderer(renderer) {
        localStorage.setItem('psfio-renderer', renderer.getIdentifier());
        this.setRenderer(renderer);
    };

    /**=============================================================================================
     * API
     =============================================================================================*/

    _class.prototype.goToFolder = function goToFolder(folder) {
        this.loadedDir = folder;
        this.refresh();
    };

    _class.prototype.refresh = function refresh() {
        this.files(this.loadedDir);
    };

    _class.prototype.files = function files(path) {
        this.request('files', {}, this.onFilesSuccess.bind(this), this.onFilesError.bind(this));
    };

    _class.prototype.onFilesSuccess = function onFilesSuccess(files) {
        this.parseFiles(files);
    };

    _class.prototype.onFilesError = function onFilesError() {};

    _class.prototype.rename = function rename(item, newName) {
        this.request('rename', { file: item, newName: newName }, this.onRenameSuccess.bind(this), this.onRenameError.bind(this));
    };

    _class.prototype.onRenameSuccess = function onRenameSuccess(files) {
        this.parseFiles(files);
    };

    _class.prototype.onRenameError = function onRenameError() {};

    _class.prototype.deleteItem = function deleteItem(item) {
        this.request('delete', { files: item }, this.onDeleteItemSuccess.bind(this), this.onDeleteItemError.bind(this));
    };

    _class.prototype.onDeleteItemSuccess = function onDeleteItemSuccess(files) {
        this.parseFiles(files);
    };

    _class.prototype.onDeleteItemError = function onDeleteItemError() {};

    _class.prototype.newFolder = function newFolder(name) {
        this.request('newFolder', { folderName: name }, this.onNewFolderSuccess.bind(this), this.onNewFolderError.bind(this));
    };

    _class.prototype.onNewFolderSuccess = function onNewFolderSuccess(files) {
        this.parseFiles(files);
    };

    _class.prototype.onNewFolderError = function onNewFolderError() {};

    _class.prototype.uploadFiles = function uploadFiles(formData) {
        jQuery.ajax(this.connector + 'upload', {
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: this.onUploadFilesSuccess.bind(this),
            error: this.onUploadFilesError.bind(this),
            processData: false,
            contentType: false
        });
    };

    _class.prototype.onUploadFilesSuccess = function onUploadFilesSuccess(files) {
        this.parseFiles(files);
    };

    _class.prototype.onUploadFilesError = function onUploadFilesError() {};

    _class.prototype.request = function request(action, data, success, error) {
        data = data || {};
        data.folder = this.loadedDir;

        jQuery.ajax(this.connector + action, {
            type: 'GET',
            data: data,
            dataType: 'json',
            success: success,
            error: error
        });
    };

    /**=============================================================================================
     * Binding
     =============================================================================================*/

    _class.prototype.parseFiles = function parseFiles(files) {
        this.structure = files;
        this.render();
    };

    _class.prototype.render = function render() {
        if (!this.structure) return;

        this.clearPane();
        if (this.loadedDir != '') {
            var upElement = this.renderer.getUP('UP');
            var parentFolder = PS.PSFio.PathHelper.getParentFolder(this.loadedDir);
            upElement.on('dblclick', this.goToFolder.bind(this, parentFolder));
            this.appendElement(upElement);
        }

        //List Folders
        for (var i = 0; i < this.structure.folders.length; i++) {
            var folder = this.structure.folders[i];
            var folderElement = this.renderer.getFolder(folder, this.loadedDir);
            this.consumeFolderElement(folderElement, folder);
        }

        //List Files
        for (var i = 0; i < this.structure.files.length; i++) {
            var file = this.structure.files[i];
            var fileElement = this.renderer.getFile(file, this.loadedDir);
            this.consumeFileElement(fileElement, file);
        }
    };

    _class.prototype.consumeFileElement = function consumeFileElement(fileElement, file) {
        this.appendElement(fileElement);
        this.armFileElement(fileElement, file);
    };

    _class.prototype.consumeFolderElement = function consumeFolderElement(folderElement, folder, isBack) {
        this.appendElement(folderElement);
        this.armFolderElement(folderElement, folder);
    };

    _class.prototype.appendElement = function appendElement(element) {
        this.fileList.append(element);
    };

    _class.prototype.clearPane = function clearPane() {
        this.renderer.clear(this.fileList);
    };

    _class.prototype.armFileElement = function armFileElement(fileElement, file) {
        this.armMutual(fileElement, file);
        fileElement.on('dblclick', this.pickFile.bind(this, file));
    };

    _class.prototype.armFolderElement = function armFolderElement(folderElement, folder) {
        this.armMutual(folderElement, folder);
        folderElement.on('dblclick', this.goToItem.bind(this, folder));
    };

    _class.prototype.armMutual = function armMutual(itemElement, item) {
        itemElement.find('.psfio-remove').on('click', this.deleteItemConfirm.bind(this, item));
        itemElement.find('.psfio-rename').on('click', this.renameItemPrompt.bind(this, item));
    };

    _class.prototype.pickFile = function pickFile(file) {
        //@TODO should be sanitized when sanitization function is created and this condition should be removed this.loadedDir ? : ...
        if (this.callback) this.callback([this.loadedDir ? this.loadedDir + '/' + file : file]);

        if (this.destroyOnPick) this.destroy();else if (!this.inline) this.hide();
    };

    _class.prototype.goToItem = function goToItem(item) {
        this.goToFolder(item);
    };

    _class.prototype.renameItemPrompt = function renameItemPrompt(item) {
        var newName = prompt('Rename file', item);
        if (newName) this.rename(item, newName);
    };

    _class.prototype.deleteItemConfirm = function deleteItemConfirm(item) {
        var isConfirmed = confirm('Are you sure you want to delete this file');
        if (isConfirmed) this.deleteItem([item]);
    };

    /**=============================================================================================
     * Binding
     =============================================================================================*/

    _class.prototype.reset = function reset() {
        this.clearPane();
        this.goToFolder('');
    };

    //Facaded for easier access


    _class.prototype.hide = function hide() {
        if (this.builder) this.builder.hide();
    };

    //Facaded for easier access


    _class.prototype.show = function show() {
        if (this.builder) this.builder.show();
    };

    _class.prototype.destroy = function destroy() {
        this.hide();

        this.builder.clean();
        this.builder = null;

        this.renderer.clean();
        this.renderer = null;

        this.structure = null;
    };

    _class.getShared = function getShared() {
        if (!this.sharedInstance) this.sharedInstance = new this({ show: false });

        return this.sharedInstance;
    };

    _class.getAssetPath = function getAssetPath(path) {
        if (!this.root) {
            var root = $('meta[name="psfio-root"]').attr('content');
            this.root = root ? root : '/files';
        }

        //@TODO Should be sanitized upon concatenation
        return this.root + '/' + path;
    };

    return _class;
}();

PS.PSFio.Builders = {};

PS.PSFio.FileHelper = {
    getFaIconForFile: function (file) {
        var extension = PS.PSFio.PathHelper.getFileParts(file).extension;
        extension = extension.toLowerCase();
        switch (extension) {
            case 'jpg':
            case 'png':
            case 'gif':
            case 'jpeg':
                return true;
            case 'xls':
            case 'xlsx':
                return 'fa-file-excel-o';
            case 'pdf':
                return 'fa-file-pdf-o';
            case 'doc':
            case 'docx':
            case 'rtf':
            case 'txt':
                return 'fa-file-word-o';
            case 'zip':
            case 'bz':
            case 'gz':
            case 'tar':
                return 'fa-file-zip-o';
            case 'mpeg4':
            case 'mov':
            case 'mp4':
                return 'fa-file-movie-o';
            case 'mp3':
            case 'aiff':
                return 'fa-file-audio-o';
            case 'html':
            case 'css':
            case 'less':
            case 'sass':
            case 'js':
            case 'php':
                return 'fa-file-code-o';
            default:
                return 'fa-file-o';
        }
    }
};

PS.PSFio.PathHelper = {

    getParentFolder: function (path) {
        if (!path) return '';

        if (path.substr(-1) == '/') path = path.substr(0, path.length - 1);

        var parts = path.split('/');
        parts.pop();
        return parts.join('/');
    },

    getFileParts: function (path) {
        var extension = '';
        var name = '';

        if (path) {
            var parts = path.split('/');
            var fileName = parts.pop();

            var fileParts = fileName.split('.');
            extension = fileParts.pop();
            name = fileParts.join('.');
        }

        return {
            extension: extension,
            name: name
        };
    }

};

PS.PSFio.Renderers = {};

PS.PSFio.Widgets = {};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

PS.PSFio.Builders.Inline = function () {
    function _class(opts) {
        _classCallCheck(this, _class);

        opts = opts || {};
        this.buttons = opts.appendButtonsTo;
        this.appendTo = jQuery(opts.appendTo);
        console.log(opts);
        this.build();
    }

    _class.prototype.build = function build() {
        console.log(this.appendTo);
        this.element = jQuery('<div class="psfio psfio-inline"></div>').appendTo(this.appendTo);

        if (!this.buttons) this.buttons = jQuery('<div class="psfio-buttons"></div>').appendTo(this.element);

        this.pane = jQuery('<div class="psfio-pane"></div>').appendTo(this.element);
    };

    _class.prototype.clean = function clean() {
        this.element.remove();
    };

    return _class;
}();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

PS.PSFio.Builders.Popup = function () {
    function _class(opts) {
        _classCallCheck(this, _class);

        opts = opts || {};
        this.appendTo = opts.appendTo ? jQuery(opts.appendTo) : 'body';
        this.closeOnEscape = opts.closeOnEscape !== false;
        this.shouldShow = opts.show !== false;
        this.build(opts);
    }

    _class.prototype.build = function build() {

        var html = '<div class="modal fade psfio" tabindex="-1" role="dialog">' + '<div class="modal-dialog modal-lg" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + '<div class="psfio-buttons"></div>' + '</div>' + '<div class="modal-body"><div class="psfio-pane"></div></div>' +
        // '<div class="modal-footer"></div>' +
        '</div>' + '</div>' + '</div>';
        var modal = jQuery(html);

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
    };

    _class.prototype.clean = function clean() {
        this.modal.remove();
        this.buttons = null;
        this.pane = null;
        this.appendTo = null;
    };

    _class.prototype.show = function show() {
        this.modal.modal('show');
    };

    _class.prototype.hide = function hide() {
        this.modal.modal('hide');
    };

    return _class;
}();

PS.PSFio.Renderers.Grid = {
    getFile: function (file, path) {
        var parts = this.getMutual(file);
        parts.element.addClass('ps-fio-grid-item-folder');
        var icon = PS.PSFio.FileHelper.getFaIconForFile(file);
        if (icon === true) parts.image.css('background-image', 'url("' + PS.PSFio.getAssetPath(path + '/' + file) + '")');else jQuery('<i class="fa"></i>').addClass(icon).appendTo(parts.image);
        return parts.element;
    },

    getFolder: function (folder) {
        var parts = this.getMutual(folder);
        parts.element.addClass('ps-fio-grid-item-folder');
        parts.image.append('<i class="fa fa-folder"></i>');
        return parts.element;
    },

    getUP: function (text) {
        var parts = this.getCol();
        parts.name.text(text);
        parts.element.addClass('ps-fio-grid-item-back');
        parts.image.append('<i class="fa fa-level-up"></i>');
        return parts.element;
    },

    getMutual: function (item) {
        var parts = this.getCol();
        var remove = jQuery('<a href="javascript:;" class="btn btn-xs btn-danger psfio-remove"><i class="fa fa-trash"></i></a>');
        var rename = jQuery('<a href="javascript:;" class="btn btn-xs btn-default psfio-rename"><i class="fa fa-edit"></i></a>');
        parts.btnGroup.append(rename).append(remove);
        parts.name.text(item);
        return parts;
    },

    getCol: function () {
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
        };
    },

    prepare: function (pane) {
        var list = jQuery('<div class="psfio-grid-list"></div>');
        pane.append(list);
        list.on('mousedown', function (e) {
            e.preventDefault();
        });
        return list;
    },

    clear: function (fileList) {
        fileList.empty();
    },

    getIcon: function () {
        return 'fa-th';
    },

    getIdentifier: function () {
        return 'Grid';
    }
};

PS.PSFio.Renderers.Table = {
    getFile: function (file, path) {
        var parts = this.getMutual(file, path);
        parts.element.addClass('ps-fio-table-item-folder');
        var icon = PS.PSFio.FileHelper.getFaIconForFile(file);
        if (icon === true) jQuery('<img class="img-responsive" />').attr('src', PS.PSFio.getAssetPath(path + '/' + file)).appendTo(parts.icon);else jQuery('<i class="fa"></i>').addClass(icon).appendTo(parts.icon);
        return parts.element;
    },

    getFolder: function (folder) {
        var parts = this.getMutual(folder);
        parts.element.addClass('ps-fio-table-item-folder');
        parts.icon.append('<i class="fa fa-folder"></i>');
        return parts.element;
    },

    getUP: function (text) {
        var parts = this.getRow();
        parts.name.text(text);
        parts.element.addClass('active ps-fio-table-item-back');
        parts.icon.append('<i class="fa fa-level-up"></i>');
        return parts.element;
    },

    getMutual: function (item) {
        var parts = this.getRow();
        var remove = jQuery('<a href="javascript:;" class="btn btn-xs btn-danger psfio-remove"><i class="fa fa-trash"></i></a>');
        var rename = jQuery('<a href="javascript:;" class="btn btn-xs btn-default psfio-rename"><i class="fa fa-edit"></i></a>');
        parts.btnGroup.append(rename).append(remove);
        parts.name.text(item);
        return parts;
    },

    getRow: function () {
        var element = jQuery('<tr></tr>');
        var btnGroup = jQuery('<div class="btn-group"></div>');

        return {
            element: element,
            btnGroup: btnGroup,
            icon: jQuery('<td></td>').appendTo(element),
            name: jQuery('<td class="col-xs-6"></td>').appendTo(element),
            size: jQuery('<td class="col-xs-1"></td>').appendTo(element),
            dateCreated: jQuery('<td class="col-xs-2"></td>').appendTo(element),
            dateModified: jQuery('<td class="col-xs-2"></td>').appendTo(element),
            actions: jQuery('<td class="col-xs-1"></td>').appendTo(element).append(btnGroup)
        };
    },

    prepare: function (pane) {
        var table = jQuery('<table class="table table-hover table-condensed"></table>');
        var thead = jQuery('<thead></thead>');
        var tbody = jQuery('<tbody></tbody>');
        var thRow = jQuery('<tr></tr>');

        this.createHeadColumn(thRow, '');
        this.createHeadColumn(thRow, 'Name');
        this.createHeadColumn(thRow, 'Size');
        this.createHeadColumn(thRow, 'Date created');
        this.createHeadColumn(thRow, 'Date updated');
        this.createHeadColumn(thRow, 'Actions');

        thead.append(thRow);
        table.append(thead).append(tbody);

        pane.append(table);
        table.on('mousedown', function (e) {
            e.preventDefault();
        });
        return tbody;
    },

    createHeadColumn: function (row, name) {
        jQuery('<th></th>').text(name).appendTo(row);
    },

    clear: function (fileList) {
        fileList.empty();
    },

    getIcon: function () {
        return 'fa-th-list';
    },

    getIdentifier: function () {
        return 'Table';
    }
};

$(document).ready(function () {
    var browsers = jQuery('*[data-psfio="browse"]');
    for (var i = 0; i < browsers.length; i++) {
        browsers.eq(i).on('click', function () {
            PS.PSFio.getShared().show();
        });
    }
});

(function ($, name) {

    $.fn[name] = function (methodOrOptions) {

        var me = $(this);

        if (!me.length) return me;

        var firstMe = $(this).eq(0);

        var instance = firstMe.data(name);

        // CASE: call method     
        if (instance && instance[methodOrOptions] && typeof instance[methodOrOptions] == 'function') {

            return instance[methodOrOptions](Array.prototype.slice.call(arguments, 1));

            // CASE: set options or initialize
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {

            methodOrOptions = methodOrOptions || {};
            methodOrOptions.inline = true;
            methodOrOptions.appendTo = firstMe;
            instance = new PS.PSFio(methodOrOptions); // ok to overwrite if this is a re-init
            firstMe.data(name, instance);
            return me;

            // CASE: method called before init
        } else if (!instance) {
            $.error('Instance not created yet: ' + methodOrOptions);

            // CASE: invalid method
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist.');
        }
    };

    $(document).ready(function () {
        var browsers = jQuery('*[data-psfio="file-browser"]');
        for (var i = 0; i < browsers.length; i++) browsers.eq(i)[name]();
    });
})(jQuery, 'PSFioFileBrowser');

(function ($, name) {

    $.fn[name] = function (methodOrOptions) {
        var me = $(this);
        if (!me.length) return me;

        var firstMe = me.eq(0);

        var instance = firstMe.data(name);

        // CASE: call method     
        if (instance && instance[methodOrOptions] && typeof instance[methodOrOptions] == 'function') {

            return instance[methodOrOptions](Array.prototype.slice.call(arguments, 1));

            // CASE: set options or initialize
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {

            instance = new PS.PSFio.Widgets.Image(firstMe, methodOrOptions); // ok to overwrite if this is a re-init
            firstMe.data(name, instance);
            return me;

            // CASE: method called before init
        } else if (!instance) {
            $.error('Instance not created yet: ' + methodOrOptions);

            // CASE: invalid method
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist.');
        }
    };

    $(document).ready(function () {
        var inputs = $('input[data-psfio="image"]');
        for (var i = 0; i < inputs.length; i++) inputs.eq(i)[name]();
    });
})(jQuery, 'PSFioImage');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

PS.PSFio.Widgets.Image = function () {
    function _class(file, opts) {
        _classCallCheck(this, _class);

        this.input = file;
        this.build(file);
        this.displayFile(file.val());
    }

    _class.prototype.build = function build(file) {
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
    };

    _class.prototype.browse = function browse() {
        var fio = PS.PSFio.getShared();
        fio.setCallback(this.onPick.bind(this));
        fio.show();
    };

    _class.prototype.onPick = function onPick(files) {
        if (files.length > 0) this.displayFile(files[0]);
    };

    _class.prototype.displayFile = function displayFile(file) {
        if (file == '') this.clear();else {
            this.input.val(file);
            this.image.show().attr('src', PS.PSFio.getAssetPath(file));
            this.noImage.hide();
        }
    };

    _class.prototype.clear = function clear() {
        this.input.val('');
        this.image.hide();
        this.noImage.show();
    };

    return _class;
}();
//# sourceMappingURL=psfio.js.map
