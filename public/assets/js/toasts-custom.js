function showToast(message, type = 'success', title = '', time = '') {
    const toast = document.getElementById('toast');
    const toastBody = document.getElementById('toast-body');
    const toastTitle = document.getElementById('toast-title');
    const toastTime = document.getElementById('toast-time');
    const toastIcon = document.getElementById('toast-icon');

    // Limpa classes antigas
    toast.classList.remove('toast-success', 'toast-error', 'toast-warning');

    // Define classe e ícone conforme o tipo
    switch(type) {
      case 'success':
        toast.classList.add('toast-success');
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-check text-success"></i>';
        toastTitle.textContent = title || 'Sucesso';
        break;
      case 'error':
        toast.classList.add('toast-error');
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-xmark text-danger"></i>';
        toastTitle.textContent = title || 'Erro';
        break;
      case 'warning':
        toast.classList.add('toast-warning');
        toastIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-warning"></i>';
        toastTitle.textContent = title || 'Atenção';
        break;
      default:
        toastTitle.textContent = title || '';
        toastIcon.innerHTML = '';
    }

    toastBody.textContent = message;
    toastTime.textContent = time || '5';

    // Exibe o toast (usando Bootstrap 5)
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

window.showToast = showToast;