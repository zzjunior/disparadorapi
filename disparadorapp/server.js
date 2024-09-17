const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

const app = express();
const port = 3000;

// Define o diretório para uploads
const uploadDir = path.join(__dirname, 'planilhas');

// Certifique-se de que o diretório existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura o multer para salvar os arquivos temporariamente
const upload = multer({ dest: uploadDir });

app.use(express.static('public'));

// Middleware para parsing de JSON
app.use(express.json());

// Rota para upload e processamento da planilha
app.post('/upload', upload.single('planilha'), (req, res) => {
  console.log('Arquivo recebido:', req.file);
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }
  const tempPath = req.file.path;
  const newFilePath = path.join(uploadDir, req.file.originalname);

  // Renomeia o arquivo para o nome original
  fs.rename(tempPath, newFilePath, (err) => {
    if (err) {
      console.error('Erro ao salvar o arquivo:', err);
      return res.status(500).send('Erro ao salvar o arquivo');
    }

    // Processa a planilha
    const workbook = xlsx.readFile(newFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Converte a planilha em JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Extrai o header (primeira linha)
    const header = jsonData[0];

    // Retorna o header para o front-end
    res.json({ message: 'Upload bem-sucedido!', header });
  });
});

// Rota para listagem de arquivos
app.get('/list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).send('Erro ao ler diretório');
    res.json(files); // Deve retornar um JSON com a lista de arquivos
  });
});

// Rota para exclusão de arquivos
app.delete('/delete/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send('Erro ao excluir o arquivo');
    res.send('Arquivo excluído com sucesso!');
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


