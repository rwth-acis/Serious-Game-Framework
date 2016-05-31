<?php

// SECURITY CHECK
// if $_POST['path'] is not inside the assertions folder, someone is trying to troll us

if (strpos(realpath(dirname($_POST['path'])), 'data/badges/assertions') !== false) {
  if($_POST['action'] == 'create') {
    $file = fopen($_POST['path'], 'w');
    fwrite($file, $_POST['assertion']);
    fclose($file);
  }
  elseif($_POST['action'] == 'delete') {
    unlink($_POST['path']);
  }
}

?>
