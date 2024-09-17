// Função para carregar a lista de planilhas
function carregarPlanilhas() {
    fetch('http://localhost:3000/list')
      .then(response => response.json())
      .then(files => {
        const planilhaList = document.getElementById('planilhaList').querySelector('tbody');
        planilhaList.innerHTML = ''; // Limpa a tabela antes de adicionar novas planilhas
  
        files.forEach(file => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${file}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deletarPlanilha('${file}')">Excluir</button>
            </td>
          `;
          planilhaList.appendChild(row);
        });
      })
      .catch(error => console.error('Erro ao carregar planilhas:', error));
  }
  
  // Função para deletar uma planilha
  function deletarPlanilha(filename) {
    fetch(`http://localhost:3000/delete/${filename}`, { method: 'DELETE' })
      .then(response => response.text())
      .then(message => {
        console.log(message);
        carregarPlanilhas(); // Recarrega a lista após exclusão
      })
      .catch(error => console.error('Erro ao excluir planilha:', error));
  }
  
  // Função para enviar o formulário de upload
  document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
  
    const formData = new FormData(this);
    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      carregarPlanilhas(); // Recarrega a lista após upload
    })
    .catch(error => console.error('Erro ao fazer upload:', error));
  });
  
  // Carrega a lista de planilhas ao carregar a página
  document.addEventListener('DOMContentLoaded', carregarPlanilhas);
  


