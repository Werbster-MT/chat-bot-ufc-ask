const { render } = require('ejs');
const ApiService = require('../services/ApiService');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Salva arquivos em /uploads

class DashboardController {
  async index(req, res) {
    try {
      const user = req.session.user;
      const token = req.session.token;
      
      // Buscar as fontes da API
      let sources = [];
      if (token) {
        const sourcesResponse = await ApiService.consumirApi('get', '/list-sources', {}, token);
        if (sourcesResponse && sourcesResponse.fontes) {
          sources = sourcesResponse.fontes;
        }
      }
      
      res.render("dashboard", {
        message: null,
        type: null,
        title: "Home Admin",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        sources: sources
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      const user = req.session.user;
      res.render("dashboard", {
        message: "Erro ao carregar dados",
        type: "error",
        title: "Home Admin",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        sources: []
      });
    }
  }

  async addSource(req, res) {
    const { documentLink } = req.body;
    const token = req.session.token;

    let resposta;
    if (req.file) {
      // Criar FormData para enviar o arquivo
      const FormData = require('form-data');
      const fs = require('fs');
      const form = new FormData();
      
      // Adicionar o arquivo ao FormData
      form.append('files', fs.createReadStream(req.file.path), req.file.originalname);
      
      // Enviar para a API
      resposta = await ApiService.consumirApiWithFile('post', '/add/pdfs', form, token);
      
      // Limpar arquivo temporário após envio
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao deletar arquivo temporário:', err);
      });
    } else if (documentLink) {
      resposta = await ApiService.consumirApi('post', '/add/urls', { urls: [documentLink] }, token);
    } else {
      const sources = await this.getSources(token);
      return res.render('dashboard', {
        message: 'Preencha um link ou envie um PDF.',
        type: "error",
        title: "Home Admin",
        userName: req.session.user.name,
        userEmail: req.session.user.email,
        userRole: req.session.user.role,
        sources
      });
    }

    const sources = await this.getSources(token);

    // Mensagem de erro/sucesso
    let message = "Fonte adicionada com sucesso.";
    let type = "success";
    if (req.file) {
      if (!resposta || !resposta.results || !resposta.results.some(r => r.status === "adicionado")) {
        message = resposta?.results?.[0]?.status || resposta?.mensagem || 'Erro ao adicionar PDF.';
        type = "error";
      }
    } else {
      if (!resposta || !resposta.results || !resposta.results.some(r => r.status === "success")) {
        message = resposta?.results?.[0]?.status || resposta?.mensagem || 'Erro ao adicionar URL.';
        type = "error";
      }
    }

    return res.render('dashboard', {
      message: message,
      type: type,
      title: "Home Admin",
      userName: req.session.user.name,
      userEmail: req.session.user.email,
      userRole: req.session.user.role,
      sources
    });
  }

  async deleteBySource(req, res) {
    const { source } = req.body;
    const token = req.session.token;
    
    if (!source) {
      const sources = await this.getSources(token);
      return res.render('dashboard', {
        message: 'Fonte não fornecida.',
        type: "error",
        title: "Home Admin",
        userName: req.session.user.name,
        userEmail: req.session.user.email,
        userRole: req.session.user.role,
        sources
      });
    }
    
    if (!token) {
      const sources = await this.getSources(token);
      return res.render('dashboard', {
        message: 'Token não encontrado.',
        type: "error",
        title: "Home Admin",
        userName: req.session.user.name,
        userEmail: req.session.user.email,
        userRole: req.session.user.role,
        sources
      });
    }
    
    const resposta = await ApiService.consumirApi('delete', '/delete/by-source', [source], token);
    const sources = await this.getSources(token);

    // Sempre renderiza o dashboard após a operação
    if (resposta && resposta.message) {
      return res.render('dashboard', {
        message: "Fonte excluída com sucesso.",
        type: "success",
        title: "Home Admin",
        userName: req.session.user.name,
        userEmail: req.session.user.email,
        userRole: req.session.user.role,
        sources
      });
    } else {
      return res.render('dashboard', {
        message: resposta?.message || resposta?.error || 'Erro ao excluir documento.',
        type: "error",
        title: "Home Admin",
        userName: req.session.user.name,
        userEmail: req.session.user.email,
        userRole: req.session.user.role,
        sources
      });
    }
  }

  async listSources(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    const resposta = await ApiService.consumirApi('get', '/list-sources', {}, token);
    res.json(resposta);
  }

  async getSources(token) {
    const sourcesResponse = await ApiService.consumirApi('get', '/list-sources', {}, token);
    return sourcesResponse && sourcesResponse.fontes ? sourcesResponse.fontes : [];
  }
}

module.exports = new DashboardController();
