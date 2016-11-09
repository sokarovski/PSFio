<?php
namespace PS\PSFio;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use Illuminate\Http\Request;
use File;

class PSFio extends BaseController {

    use DispatchesJobs, AuthorizesRequests, ValidatesRequests;
    /**=============================================================================================
     * Construction
     *============================================================================================*/

    private $root = '';
    private $dir = '';
    private $dirPath = '';

    function __construct(Request $request) {
        $root = config('psfio.roots');
        if ($root == null)
            $root = public_path('/files');

        $this->root = $this->sanitize($root);

        $dir = $request->input('folder', '');
        $this->dir = $this->sanitize($dir);
        $this->dirPath = $this->sanitize($this->root . '/' . $dir);
    }

    /**=============================================================================================
     * Actions
     *============================================================================================*/

    function files() {
        $result = [
            'files' => $this->basify(File::files($this->dirPath)),
            'folders' => $this->basify(File::directories($this->dirPath)),
        ];
        return $result;
    }

    function newFolder(Request $request) {
        $folderName = $request->input('folderName');
        $path = $this->sanitize($this->dirPath . '/' . $folderName);
        File::makeDirectory($path, 0755, true, true);
        return $this->files();
    }

    function upload(Request $request) {
        $files = $request->allFiles();

        //@TODO Filter only allowed files
        foreach($files as $file) {
            if (is_array($file)){
                foreach($file as $subfiles)
                    $subfiles->store($this->dirPath.'/');
            } else 
                $file->store($this->dirPath.'/');
        }
        
        return $this->files();
    }

    function delete(Request $request) {
        $files = $request->input('files', array());
        $absolute = $request->input('absolute', false);
        $prefix = $absolute ? $this->root . '/' : $this->dirPath . '/';
        foreach ($files as $file) {
            $path = $this->sanitize($prefix . $file);
            
            if (File::isFile($path))
                File::delete($path);
            
            if (File::isDirectory($path))
                File::deleteDirectory($path);
        }
        
        //@TODO Handle if absolute
        return $this->files();
    }

    function rename(Request $request) {
        $file = $request->input('file');
        $newName = $request->input('newName');
        $oldPath = $this->sanitize($this->dirPath . '/' . $file);
        $newPath = $this->sanitize($this->dirPath . '/' . $newName);

        File::move($oldPath, $newPath);

        return $this->files();
    }

    function move(Request $request) {
        $newPath = $request->input('newPath', '');
        $files = $request->input('files', array());
        foreach ($files as $file) {
            $oldPath = $this->sanitize($this->dirPath . '/' . $file);
            $newPath = $this->sanitize($this->root . ' / '  . $newPath . '/' . $file);

            File::move($oldPath, $newPath);
        }

        return $this->files();
    }

    /**=============================================================================================
     * Helpers
     *============================================================================================*/

    function connector() {
        return 'connected';
    }

    private function basify($input) {
        $output = array();
        foreach ($input as $path) {
            $output[] = File::basename($path);
        }
        return $output;
    }

    private function sanitize($path) {
        $output = preg_replace('/\.\/|\.\.\//', '', $path);
        $output = preg_replace('/\/+/', '/', $output);
        return rtrim($output, '/');
    }

    public static function head() {
        return 
        '<meta name="csrf-token" content="'. csrf_token() .'">' .
        '<meta name="psfio-connector" content="'. route('psfio.connector') .'">';
    }
}
