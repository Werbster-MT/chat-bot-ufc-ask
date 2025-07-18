const axios = require('axios');

async function consumirApi(method, endpoint, body = {}, token = '') {
  try {
    const config = {
      method,
      url: `https://ufc-ask.onrender.com${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    };

    if (['post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
      config.data = body;
    }

    if (method.toLowerCase() === 'get' && body && Object.keys(body).length) {
      const query = new URLSearchParams(body).toString();
      config.url += `?${query}`;
    }

    const response = await axios(config);
    
    // Verifica se a resposta tem sucesso
    if (response.status !== 200) {
      console.error('Erro no status da resposta:', response.status);
      return { sucesso: false, mensagem: `Erro ao acessar o serviço: ${response.status}` };
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao consumir API UFC Ask:');
    console.error('Status:', error.response?.status || 'sem status');
    console.error('Dados:', error.response?.data || 'sem dados');
    console.error('Mensagem:', error.message);
    return { sucesso: false, mensagem: 'Erro na comunicação com a API.' };
  }
}

async function consumirApiWithFile(method, endpoint, formData, token = '') {
  try {
    const config = {
      method,
      url: `https://ufc-ask.onrender.com${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders() // Inclui o Content-Type correto para multipart
      },
      data: formData,
      timeout: 60000
    };

    const response = await axios(config);
    
    if (response.status !== 200) {
      console.error('Erro no status da resposta:', response.status);
      return { sucesso: false, mensagem: `Erro ao acessar o serviço: ${response.status}` };
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao consumir API UFC Ask:', error);
    return { sucesso: false, mensagem: 'Erro na comunicação com a API.' };
  }
}

module.exports = {
  consumirApi,
  consumirApiWithFile
};
