PS.PSFio = class {

    /**=============================================================================================
     * Constructing
     =============================================================================================*/    

    constructor(opts) {
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

    parseConnector(preferedConnector) {
        var headConnector;

        if (preferedConnector) {
            this.connector = preferedConnector;
        } else if (headConnector = $('meta[name="psfio-connector"]').attr('content')) {
            this.connector = headConnector;
        } else {
            this.connector = '/psfio';
        }

        if (this.connector && this.connector.substr(-1) != '/')
            this.connector += '/';
    }

    setCallback(callback) {
        this.callback = callback;
    }

    findDefaultRenderer(preferedRenderer) {
        var sessionRenderer;

        if (preferedRenderer) 
            this.setRenderer(preferedRenderer);
        else if (sessionRenderer = localStorage.getItem('psfio-renderer')) 
            this.setRenderer(PS.PSFio.Renderers[sessionRenderer]);
        else 
            this.setRenderer(PS.PSFio.Renderers.Grid);
    }

    setRenderer(renderer) {
        if (this.renderer)
            this.renderer.clear(this.fileList);

        this.builder.pane.empty();
        this.renderer = renderer; 
        this.fileList = this.renderer.prepare(this.builder.pane);

        this.renderersGroup.find('.active').removeClass('active');
        this.renderersGroup.find('*[data-id='+renderer.getIdentifier()+']').addClass('active');

        this.render();
    }

    build(opts) {
        var builder = this.buildWith || this.inline ? 
                    PS.PSFio.Builders.Inline:
                    PS.PSFio.Builders.Popup;

        this.builder = new builder(opts)
    }

    /**=============================================================================================
     * Navbar
     =============================================================================================*/

    buildElements() {
        this.buildNewFolderButton();
        this.buildUploadButton();
        this.buildRenderersButtons();

    }

    buildUploadButton() {
        this.builder.buttons.append(document.createTextNode(' '));
        var uploadFile = jQuery('<div class="btn btn-xs btn-default"><i class="fa fa-upload"></i> Upload File</div>');
        this.builder.buttons.append(uploadFile);
        this.buildUpload(uploadFile);
    }

    buildUpload(inElement) {
        var upload = jQuery('<input type="file" name="uploads[]" />');
        upload.on('change', this.handleUpload.bind(this, inElement));
        if (this.allowMultipleUploads)
            upload.attr('multiple', '');
        
        var holder = inElement.find('.psfio-uploadholder');
        if (holder.length == 0) {
            holder = jQuery('<div class="psfio-uploadholder"></div>');
            inElement.css('position', 'relative');
            inElement.append(holder);
        }

        holder.empty().append(upload);
    }

    handleUpload(inElement) {
        var formData = this.getFormDataFromUpload(inElement);
        this.uploadFiles(formData);
        this.buildUpload(inElement);
    }

    getFormDataFromUpload(input) {
        var form = jQuery('<form></form>');
        var folder = jQuery('<input type="text" name="folder" />').val(this.loadedDir);
        form.append(input.find('input[type=file]')).append(folder);
        return new FormData(form[0]);
    }

    buildNewFolderButton() {
        var newFolder = jQuery('<button class="btn btn-xs btn-default"><i class="fa fa-plus"></i>  New Folder</button>');
        newFolder.on('click', this.makeNewFolder.bind(this));
        this.builder.buttons.append(newFolder);
    }

    makeNewFolder() {
        var newFolderName = prompt('New folder name:');
        if (newFolderName)
            this.newFolder(newFolderName);
        
    }

    buildRenderersButtons() {
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

        if (renderers > 0){
            this.builder.buttons.append(document.createTextNode(' '));
            this.builder.buttons.append(renderersGroup);
        }
    }

    pickRenderer(renderer) {
        localStorage.setItem('psfio-renderer', renderer.getIdentifier()); 
        this.setRenderer(renderer);
    }

    /**=============================================================================================
     * API
     =============================================================================================*/

    goToFolder(folder) {
        this.loadedDir = folder;
        this.refresh();
    }

    refresh() {
        this.files(this.loadedDir);
    }

    files(path) {
        this.request('files', {}, this.onFilesSuccess.bind(this), this.onFilesError.bind(this));
    }

    onFilesSuccess(files) {
        this.parseFiles(files);
    }

    onFilesError() {}

    rename(item, newName) {
        this.request('rename', {file: item, newName: newName}, this.onRenameSuccess.bind(this), this.onRenameError.bind(this));
    }

    onRenameSuccess(files) {
        this.parseFiles(files);
    }

    onRenameError() {}

    deleteItem(item) {
        this.request('delete', {files: item}, this.onDeleteItemSuccess.bind(this), this.onDeleteItemError.bind(this));
    }

    onDeleteItemSuccess(files) {
        this.parseFiles(files);
    }

    onDeleteItemError() {}

    newFolder(name) {
        this.request('newFolder', {folderName: name}, this.onNewFolderSuccess.bind(this), this.onNewFolderError.bind(this));
    }

    onNewFolderSuccess(files) {
        this.parseFiles(files);
    }

    onNewFolderError() {}

    uploadFiles(formData) {
        jQuery.ajax(this.connector+'upload', {
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: this.onUploadFilesSuccess.bind(this), 
            error: this.onUploadFilesError.bind(this),
            processData: false, 
            contentType: false
        });
    }

    onUploadFilesSuccess(files) {
        this.parseFiles(files);
    }

    onUploadFilesError() {}

    request(action, data, success, error) {
        data = data || {};
        data.folder = this.loadedDir;

        jQuery.ajax(this.connector+action, {
            type: 'GET',
            data: data,
            dataType: 'json',
            success: success, 
            error: error
        });
    }

    /**=============================================================================================
     * Binding
     =============================================================================================*/

    parseFiles(files) {
        this.structure = files;
        this.render();
    }

    render() {
        if (!this.structure)
            return;

        this.clearPane();
        if (this.loadedDir != '') {
            var upElement = this.renderer.getUP('UP');
            var parentFolder = PS.PSFio.PathHelper.getParentFolder(this.loadedDir);
            upElement.on('dblclick', this.goToFolder.bind(this, parentFolder));
            this.appendElement(upElement);
        }
        
        //List Folders
        for (var i=0; i<this.structure.folders.length; i++) {
            var folder = this.structure.folders[i];
            var folderElement = this.renderer.getFolder(folder);
            this.consumeFolderElement(folderElement, folder);
        }

        //List Files
        for (var i=0; i<this.structure.files.length; i++) {
            var file = this.structure.files[i];
            var fileElement = this.renderer.getFile(file);
            this.consumeFileElement(fileElement, file);
        }
    }

    consumeFileElement(fileElement, file) {
        this.appendElement(fileElement);
        this.armFileElement(fileElement, file);
    }

    consumeFolderElement(folderElement, folder, isBack) {
        this.appendElement(folderElement);
        this.armFolderElement(folderElement, folder);
    }

    appendElement(element) {
        this.fileList.append(element);
    }

    clearPane() {
        this.renderer.clear(this.fileList);
    }

    armFileElement(fileElement, file) {
        this.armMutual(fileElement, file);
        fileElement.on('dblclick', this.pickFile.bind(this, file));
    }

    armFolderElement(folderElement, folder) {
        this.armMutual(folderElement, folder);
        folderElement.on('dblclick', this.goToItem.bind(this, folder));
    }

    armMutual(itemElement, item) {
        itemElement.find('.psfio-remove').on('click', this.deleteItemConfirm.bind(this, item));
        itemElement.find('.psfio-rename').on('click', this.renameItemPrompt.bind(this, item));
    }

    pickFile(file) {
        //@TODO should be sanitized when sanitization function is created and this condition should be removed this.loadedDir ? : ...
        if (this.callback)
            this.callback([this.loadedDir ? this.loadedDir+'/'+file : file]);

        if (this.destroyOnPick)
            this.destroy();
        else if (!this.inline)
            this.hide();
    }

    goToItem(item) {
        this.goToFolder(item);
    }

    renameItemPrompt(item) {
        var newName = prompt('Rename file', item);
        if (newName)
            this.rename(item, newName)
    }

    deleteItemConfirm(item) {
        var isConfirmed = confirm('Are you sure you want to delete this file');
        if (isConfirmed)
            this.deleteItem([item]);
    }

    /**=============================================================================================
     * Binding
     =============================================================================================*/

    reset() {
        this.clearPane();
        this.goToFolder('');
    }

    //Facaded for easier access
    hide() {
        if (this.builder)
            this.builder.hide();
    }

    //Facaded for easier access
    show() {
        if (this.builder)
            this.builder.show();
    }

    destroy() {
        this.hide();

        this.builder.clean();
        this.builder = null;

        this.renderer.clean();
        this.renderer = null;

        this.structure = null;
    }

    static getShared() {
        if (!this.sharedInstance)
            this.sharedInstance = new this({show: false});

        return this.sharedInstance;
    }

    static getAssetPath(path) {
        if (!this.root) {
            var root = $('meta[name="psfio-root"]').attr('content');
            this.root = root ? root : '/files';
        }

        //@TODO Should be sanitized upon concatenation
        return this.root + '/' + path;
    }
}