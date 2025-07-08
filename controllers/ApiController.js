const ApiService = require('../services/ApiService');

const UfcApiController = {
  async root(req, res) {
    const resposta = await ApiService.consumirApi('get', '/', {}, '');
    res.json(resposta);
  },

  async ask(userQuery, token) {
    
    if (!userQuery) {
      return { sucesso: false, mensagem: 'Pergunta não fornecida.' };
    }

    if (!token) {
      return { sucesso: false, mensagem: 'Token não fornecido.' };
    }

    const endpoint = '/ask'; // Definindo o endpoint
    const method = 'POST';  // Método POST

     // Montando o corpo da requisição
    const body = {
      question: userQuery
    };

    try {
      // Chamada para a função consumirApi
      const response = await ApiService.consumirApi(method, endpoint, body, token);

      // Verifica se a resposta é válida
      if (!response || response.sucesso === false) {
        return { sucesso: false, mensagem: 'Erro ao obter resposta da API' };
      }

      return response;
    } catch (error) {
      console.error('Erro ao consumir a API:', error);
      return { sucesso: false, mensagem: 'Erro na comunicação com a API.' };
    }
  },

  async addUrls(req, res) {
    const { urls } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ sucesso: false, mensagem: 'URLs inválidas.' });
    }
    const resposta = await ApiService.consumirApi('post', '/add/urls', { urls }, token);
    res.json(resposta);
  },

  async addPdfs(req, res) {
    const { filepaths } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!filepaths || !Array.isArray(filepaths)) {
      return res.status(400).json({ sucesso: false, mensagem: 'PDFs inválidos.' });
    }
    const resposta = await ApiService.consumirApi('post', '/add/pdfs', { filepaths }, token);
    res.json(resposta);
  },

  async deleteBySource(req, res) {
    const { source } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!source) {
      return res.status(400).json({ sucesso: false, mensagem: 'Fonte não fornecida.' });
    }
    const resposta = await ApiService.consumirApi('delete', '/delete/by-source', { source }, token);
    res.json(resposta);
  },

  async listSources(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    const resposta = await ApiService.consumirApi('get', '/list-sources', {}, token);
    res.json(resposta);
  },

  async countDocuments(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    const { source } = req.query;
    const resposta = await ApiService.consumirApi('get', '/count-documents', source ? { source } : {}, token);
    res.json(resposta);
  },

  async reset(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    const resposta = await ApiService.consumirApi('post', '/reset', {}, token);
    res.json(resposta);
  }
};

module.exports = UfcApiController;
