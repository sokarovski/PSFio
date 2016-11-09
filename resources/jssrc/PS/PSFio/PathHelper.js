PS.PSFio.PathHelper = {
    
    getParentFolder: function(path) {
        if (!path)
            return '';

        if (path.substr(-1) == '/')
            path = path.substr(0, path.length-1);

        var parts = path.split('/');
        parts.pop();
        return parts.join('/');
    },

    getFileParts: function(path) {
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
        }
    }

}