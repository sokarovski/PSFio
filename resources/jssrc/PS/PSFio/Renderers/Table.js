PS.PSFio.Renderers.Table = {
    getFile: function(file) {
        var parts = this.getMutual(file);
        parts.element.addClass('ps-fio-table-item-folder');
        var icon = PS.PSFio.FileHelper.getFaIconForFile(file);
        if (icon !== true)
            jQuery('<i class="fa"></i>').addClass(icon).appendTo(parts.icon);
        return parts.element;
    },

    getFolder: function(folder) {
        var parts = this.getMutual(folder);
        parts.element.addClass('ps-fio-table-item-folder');
        parts.icon.append('<i class="fa fa-folder"></i>');
        return parts.element;
    },

    getUP: function(text) {
        var parts = this.getRow();
        parts.name.text(text);
        parts.element.addClass('active ps-fio-table-item-back');
        parts.icon.append('<i class="fa fa-level-up"></i>');
        return parts.element;
    },

    getMutual: function(item) {
        var parts = this.getRow();
        var remove = jQuery('<a href="javascript:;" class="btn btn-xs btn-danger psfio-remove"><i class="fa fa-trash"></i></a>');
        var rename = jQuery('<a href="javascript:;" class="btn btn-xs btn-default psfio-rename"><i class="fa fa-edit"></i></a>');
        parts.btnGroup.append(rename).append(remove);
        parts.name.text(item);
        return parts;
    },

    getRow: function() {
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
        }
    },

    prepare: function(pane) {
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
        table.on('mousedown', function(e) {e.preventDefault()});
        return tbody;
    },

    createHeadColumn: function(row, name) {
        jQuery('<th></th>').text(name).appendTo(row);
    },

    clear: function(fileList) {
        fileList.empty();
    },

    getIcon: function() {
        return 'fa-th-list';
    },

    getIdentifier: function() {
        return 'Table';
    }
}