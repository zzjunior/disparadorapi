<?php

$fileToDelete = __DIR__ . '/' . urldecode($_GET['file']);

?>
<html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Font+Name">
    </head>
    <body>
        <main class="container">
            <div class="text-center">
                <?php
                if (file_exists($fileToDelete)) {
                    if (unlink($fileToDelete)) {
                        echo "<h1 class='text-center'>Arquivo excluído com sucesso.<h1><br>";
                    } else {
                        echo "Falha ao excluir o arquivo.";
                    }
                } else {
                    echo "O arquivo não existe.";
                } 
                ?>
            </div>
        </main>
        <div class="text-center">
            <a href="api.php" class="btn btn-dark w-50">Voltar</a>
        </div>
</html>