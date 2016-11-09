PS.PSFio.Widgets.Upload = class {
    
    constructor(files, opts) {
        this.arm(files);
    }

    arm(files) {
        for (var i=0; i<files.length; i++) {
            var fileElement = files.eq(i);
            this.build(fileElement);
        }

    }

    getTemplate(file) {
        
    }

    browse(fileSection) {
        var fio = PS.PSFio.getShared();
        fio.setCallback(this.onPick.bind(this, fileSection));
        fio.show();
    }

    onPick(fileSection, img, files) {
        if (files.length > 0) {
            var file = files[0];
            fileSection.find('input').val(file);
            fileSection.find('img').show().attr('src', file);
            fileSection.find('default').hide();
        }
    }

    clear(fileSection, img) {
        fileSection.find('input').val('');
        fileSection.find('img').hide();
        fileSection.find('default').show();
    }

}