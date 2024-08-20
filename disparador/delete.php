<?php

$fileToDelete = __DIR__ . '/' . urldecode($_GET['file']);
$message = "";

if (file_exists($fileToDelete)) {
    if (unlink($fileToDelete)) {
        $message = "Arquivo excluído com sucesso.";
    } else {
        $message = "Falha ao excluir o arquivo.";
    }
} else {
    $message = "O arquivo não existe.";
}

?>

<div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="infoModalLabel">Informativo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body text-center">
                <?php echo $message; ?>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>

<script>
$(document).ready(function(){
    $('#infoModal').modal('show');
    setTimeout(function(){
        $('#infoModal').modal('hide');
    }, 2000); // Fecha o modal após 2 segundos
});
</script>

