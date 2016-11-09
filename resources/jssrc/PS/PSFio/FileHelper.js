PS.PSFio.FileHelper = {
    getFaIconForFile: function(file) {
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
}