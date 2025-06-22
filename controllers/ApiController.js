const ApiService = require('../services/ApiService');

const UfcApiController = {
  async root(req, res) {
    const resposta = await ApiService.consumirApi('get', '/', {}, '');
    res.json(resposta);
  },

  async ask(req, res) {
    const { question } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!question || !token) {
      return res.status(400).json({ sucesso: false, mensagem: 'Pergunta ou token ausente.' });
    }
    const resposta = await ApiService.consumirApi('post', '/ask', { question }, token);
    res.json(resposta);
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
