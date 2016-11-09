<?php

Route::any('/', ['as' => 'connector', 'uses' => 'PSFio@connector' ]);
Route::any('/files', ['uses' => 'PSFio@files' ]);
Route::any('/newFolder', ['uses' => 'PSFio@newFolder' ]);     
Route::any('/upload', ['uses' => 'PSFio@upload' ]);     
Route::any('/delete', ['uses' => 'PSFio@delete' ]);     
Route::any('/rename', ['uses' => 'PSFio@rename' ]);     
Route::any('/move', ['uses' => 'PSFio@move' ]);  