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
      timeout: 5000
    };

    if (['post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
      config.data = body;
    }

    if (method.toLowerCase() === 'get' && body && Object.keys(body).length) {
      const query = new URLSearchParams(body).toString();
      config.url += `?${query}`;
    }

    const response = await axios(config);
    return response.data;

  } catch (error) {
    console.error('Erro ao consumir API UFC Ask:');
    console.error('Status:', error.response?.status || 'sem status');
    console.error('Dados:', error.response?.data || 'sem dados');
    console.error('Mensagem:', error.message);
    throw error;
  }
}

module.exports = {
  consumirApi
};
