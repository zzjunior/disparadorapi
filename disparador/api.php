<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Disparador Lojinha</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Font+Name">
</head>
<body>
    
    <main class="container">
    <h1 class="text-center">Disparador</h1>

    <form action="api.php" method="POST" enctype="multipart/form-data">
        <div class="mb-3">
        <label for="planilha" class="form-label">Faça o uploud da Planilha:</label>
        <input class="form-control" id="formFile" type="file" name="planilha" id="planilha" required>
        </div>
        <input type="submit" value="Upload"><br><br>
    </form>

    <div class="mb-3 text-center">
        <label for="mensagem" class="form-label">Mensagem:</label><br>
        <textarea class="form-control" type="text" name="mensagem" id="mensagem" rows="3" required></textarea><br><br>
    </div>
    </main>
    <section class="container">
    <h2>Planilhas:</h2>
    <?php
    $planilhaDir = 'planilhas/';
    $planilhas = scandir($planilhaDir);

    foreach ($planilhas as $planilha) {
        if ($planilha != '.' && $planilha != '..') {
            echo '<a href="' . $planilhaDir . $planilha . '">' . $planilha . '</a>';
            echo ' <a href="delete.php?file=' . urlencode($planilhaDir . $planilha) . '">Excluir</a><br>';
        }
    }

    // Verifica se a exclusão foi solicitada e inclui o modal
    if (isset($_GET['file'])) {
        include 'delete.php';
    }
    ?>
</section>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $targetDir = 'planilhas/';
        $targetFile = $targetDir . basename($_FILES['planilha']['name']);
        $uploadOk = 1;
        $fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Verifica se o arquivo é uma planilha
        if ($fileType != 'xlsx' && $fileType != 'xls') {
            echo 'Apenas arquivos do tipo Excel são permitidos.';
            $uploadOk = 0;
        }

        // Move o arquivo para a pasta de destino
        if ($uploadOk == 1 && move_uploaded_file($_FILES['planilha']['tmp_name'], $targetFile)) {
            echo '<p class="text-center">Planilha enviada com sucesso.</p>';
            echo '<script>setTimeout(function(){location.reload();}, 2000);</script>'; // Atualiza a página após 2 segundos
        } else {
            echo 'Ocorreu um erro ao enviar a planilha.';
        }

        // Processa a mensagem
        //$mensagem = $_POST['mensagem'];
        // Faça o que desejar com a mensagem...
    }
    ?>
</body>
</html>
