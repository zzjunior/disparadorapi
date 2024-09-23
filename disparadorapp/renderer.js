// Função para carregar os selects com o header da planilha
function preencherSelects(header) {
  const nomeSelect = document.getElementById('nomeCampo');
  const telefoneSelect = document.getElementById('telefoneCampo');

  // Limpa os selects
  nomeSelect.innerHTML = '';
  telefoneSelect.innerHTML = '';

  // Preenche os selects com os valores do header
  header.forEach(campo => {
    const optionNome = document.createElement('option');
    optionNome.value = campo;
    optionNome.textContent = campo;
    nomeSelect.appendChild(optionNome);

    const optionTelefone = document.createElement('option');
    optionTelefone.value = campo;
    optionTelefone.textContent = campo;
    telefoneSelect.appendChild(optionTelefone);
  });

  // Mostra o formulário de seleção de campos
  document.getElementById('headerSelection').style.display = 'block';
}
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

    // Verifica se o header foi retornado e preenche os selects
    if (data.header && data.header.length > 0) {
      preencherSelects(data.header);
    }
    })
    .catch(error => console.error('Erro ao fazer upload:', error));
  });
  
  // Carrega a lista de planilhas ao carregar a página
  document.addEventListener('DOMContentLoaded', carregarPlanilhas);



// Variável global para armazenar os dados da planilha selecionada
let planilhaData = [];

// Função para carregar a lista de planilhas no select
function carregarPlanilhasNoSelect() {
  fetch('http://localhost:3000/list') // Rota que lista as planilhas
    .then(response => response.json())
    .then(files => {
      const planilhaSelecionada = document.getElementById('planilhaSelecionada');
      planilhaSelecionada.innerHTML = '<option value="">Selecione uma planilha</option>'; // Limpa e adiciona a opção padrão

      files.forEach(file => {
        const option = document.createElement('option');
        option.value = file; // O valor deve ser o nome do arquivo
        option.textContent = file; // O texto exibido
        planilhaSelecionada.appendChild(option);
      });
    })
    .catch(error => console.error('Erro ao carregar planilhas:', error));
}

// Função para processar a planilha selecionada e preencher as opções de colunas
document.getElementById('planilhaSelecionada').addEventListener('change', function() {
  const planilha = this.value;

  if (planilha) {
    fetch(`http://localhost:3000/process/${planilha}`) // Modifique conforme sua rota
      .then(response => response.json())
      .then(data => {
        if (data.header && data.header.length > 0) {
          preencherSelects(data.header); // Função para preencher os selects com as colunas da planilha
        }
        planilhaData = data.planilha; // Armazena os dados da planilha processada
      })
      .catch(error => console.error('Erro ao processar a planilha:', error));
  }
});

// Função para preencher os selects de nome e telefone com as colunas da planilha
function preencherSelects(headers) {
  const nomeCampoSelect = document.getElementById('nomeCampo');
  const telefoneCampoSelect = document.getElementById('telefoneCampo');

  nomeCampoSelect.innerHTML = '<option value="">Selecione a coluna de nome</option>';
  telefoneCampoSelect.innerHTML = '<option value="">Selecione a coluna de telefone</option>';

  headers.forEach(header => {
    const optionNome = document.createElement('option');
    optionNome.value = header;
    optionNome.textContent = header;
    nomeCampoSelect.appendChild(optionNome);

    const optionTelefone = document.createElement('option');
    optionTelefone.value = header;
    optionTelefone.textContent = header;
    telefoneCampoSelect.appendChild(optionTelefone);
  });
}

// Função para enviar a mensagem usando os dados da planilha selecionada
document.getElementById("apiForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const apiUrl = document.getElementById("apiUrl").value;
  const apiToken = document.getElementById("apiToken").value;
  const mensagem = document.getElementById("mensagem").value;
  const nomeCampo = document.getElementById("nomeCampo").value;
  const telefoneCampo = document.getElementById("telefoneCampo").value;
  const delayMinutos = parseInt(document.getElementById("delay").value) || 0; // Pega o valor do delay em minutos
  const delayMilissegundos = delayMinutos * 60 * 1000; // Converte para milissegundos

  if (!planilhaData || planilhaData.length === 0) {
    console.error('Nenhuma planilha foi processada ou selecionada.');
    return;
  }

  planilhaData.forEach((contato, index) => {
    setTimeout(() => {
      const payload = {
        body: mensagem,
        number: `55${String(contato[telefoneCampo])}`, // Usa DDI +55
        externalKey: "ID_UNICA_DO_CLIENTE",
        note: {
          body: "Nota interna opcional",
          mediaUrl: ""
        }
      };

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`Mensagem enviada para ${contato[nomeCampo]} com sucesso!`);
        alert(`Mensagem enviada para ${contato[nomeCampo]} com sucesso!`);
      })
      .catch(error => {
        alert(`Erro ao enviar mensagem para ${contato[nomeCampo]}. Verifique o console para mais detalhes.`);
        console.error(`Erro ao enviar mensagem para ${contato[nomeCampo]}:`, error);
      });
    }, index * delayMilissegundos); // Delay multiplicado pelo índice para espaçar cada envio
  });
});



// Carrega a lista de planilhas ao carregar a página
document.addEventListener('DOMContentLoaded', carregarPlanilhasNoSelect);



