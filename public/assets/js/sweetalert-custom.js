// ========================================
// SWEETALERT2 PERSONALIZADO - UFC ASK
// ========================================

// Configuração global do SweetAlert2
const SwalConfig = {
  // Configurações padrão
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar',
  allowOutsideClick: false,
  allowEscapeKey: false,
  backdrop: true,
  customClass: {
    popup: 'swal2-popup-custom',
    title: 'swal2-title-custom',
    htmlContainer: 'swal2-html-custom',
    confirmButton: 'swal2-confirm-custom',
    cancelButton: 'swal2-cancel-custom'
  }
};

// Função para alerta de sucesso
function showSuccessAlert(title, message, callback = null) {
  Swal.fire({
    ...SwalConfig,
    icon: 'success',
    title: title,
    text: message,
    showConfirmButton: true,
    confirmButtonText: 'OK'
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result);
    }
  });
}

// Função para alerta de erro
function showErrorAlert(title, message, callback = null) {
  Swal.fire({
    ...SwalConfig,
    icon: 'error',
    title: title,
    text: message,
    showConfirmButton: true,
    confirmButtonText: 'OK'
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result);
    }
  });
}

// Função para alerta de aviso
function showWarningAlert(title, message, callback = null) {
  Swal.fire({
    ...SwalConfig,
    icon: 'warning',
    title: title,
    text: message,
    showConfirmButton: true,
    confirmButtonText: 'OK'
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result);
    }
  });
}

// Função para alerta de informação
function showInfoAlert(title, message, callback = null) {
  Swal.fire({
    ...SwalConfig,
    icon: 'info',
    title: title,
    text: message,
    showConfirmButton: true,
    confirmButtonText: 'OK'
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result);
    }
  });
}

// Função para confirmação
function showConfirmAlert(title, message, callback = null) {
  Swal.fire({
    ...SwalConfig,
    icon: 'question',
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não'
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result.isConfirmed);
    }
  });
}

// Função para input
function showInputAlert(title, message, inputType = 'text', callback = null) {
  Swal.fire({
    ...SwalConfig,
    title: title,
    text: message,
    input: inputType,
    inputPlaceholder: 'Digite aqui...',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Por favor, preencha este campo!';
      }
    }
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result.value);
    }
  });
}

// Função para loading
function showLoadingAlert(title = 'Carregando...') {
  Swal.fire({
    title: title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

// Função para fechar loading
function closeLoadingAlert() {
  Swal.close();
}

// Função para alerta de sucesso no login
function showLoginSuccessAlert() {
  Swal.fire({
    ...SwalConfig,
    icon: 'success',
    title: 'Login realizado com sucesso!',
    text: 'Bem-vindo ao UFC ASK',
    showConfirmButton: true,
    confirmButtonText: 'Continuar',
    timer: 2000,
    timerProgressBar: true
  });
}

// Função para alerta de erro no login
function showLoginErrorAlert(message) {
  Swal.fire({
    ...SwalConfig,
    icon: 'error',
    title: 'Erro no login',
    text: message || 'Verifique suas credenciais e tente novamente.',
    showConfirmButton: true,
    confirmButtonText: 'Tentar novamente'
  });
}

// Função para alerta de sucesso no envio de pergunta
function showQuestionSentAlert() {
  Swal.fire({
    ...SwalConfig,
    icon: 'success',
    title: 'Pergunta enviada!',
    text: 'A IA está processando sua pergunta...',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  });
}

// Função para alerta de erro no envio de pergunta
function showQuestionErrorAlert(message) {
  Swal.fire({
    ...SwalConfig,
    icon: 'error',
    title: 'Erro ao enviar pergunta',
    text: message || 'Tente novamente em alguns instantes.',
    showConfirmButton: true,
    confirmButtonText: 'Tentar novamente'
  });
}

// Função para confirmar exclusão
function showDeleteConfirmAlert(itemName, callback = null) {
  Swal.fire({
    ...SwalConfig,
    icon: 'warning',
    title: 'Confirmar exclusão',
    text: `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`,
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result.isConfirmed);
    }
  });
}

// Função para confirmar exclusão de conversas
function showDeleteConversationsAlert(callback = null) {
  Swal.fire({
    ...SwalConfig,
    icon: 'warning',
    title: 'Confirmar exclusão de conversas',
    text: 'Tem certeza que deseja apagar todas as conversas? Esta ação não pode ser desfeita e todas as conversas serão perdidas permanentemente.',
    showCancelButton: true,
    confirmButtonText: 'Sim, apagar todas',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result.isConfirmed);
    }
  });
}

// Função para confirmar exclusão de conta
function showDeleteAccountAlert(callback = null) {
  Swal.fire({
    ...SwalConfig,
    icon: 'warning',
    title: 'Confirmar exclusão de conta',
    text: 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente.',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir conta',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (callback && typeof callback === 'function') {
      callback(result.isConfirmed);
    }
  });
}

// Exportar funções para uso global
window.SwalCustom = {
  success: showSuccessAlert,
  error: showErrorAlert,
  warning: showWarningAlert,
  info: showInfoAlert,
  confirm: showConfirmAlert,
  input: showInputAlert,
  loading: showLoadingAlert,
  closeLoading: closeLoadingAlert,
  loginSuccess: showLoginSuccessAlert,
  loginError: showLoginErrorAlert,
  questionSent: showQuestionSentAlert,
  questionError: showQuestionErrorAlert,
  deleteConfirm: showDeleteConfirmAlert,
  deleteConversations: showDeleteConversationsAlert,
  deleteAccount: showDeleteAccountAlert
}; 