// Сохраняем данные пользователя
function saveUserData(user) {
  localStorage.setItem('userData', JSON.stringify(user));
}

// Получаем данные пользователя
function getUserData() {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
}

// Регистрация
function registerUser() {
  const user = {
    name: document.getElementById('register-name').value.trim(),
    phone: document.getElementById('register-phone').value.trim(),
    password: document.getElementById('register-password').value
  };

  // Проверка паролей
  if (user.password !== document.getElementById('register-repeat-password').value) {
    alert('Пароли не совпадают!');
    return;
  }

  saveUserData(user);
  alert('Регистрация успешна!');
  
  // Закрываем попап и обновляем профиль если мы на странице профиля
  if (typeof closePopup === 'function') closePopup();
  if (window.location.pathname.endsWith('profile.html')) {
    loadProfileData();
  }
}

// Авторизация
function loginUser() {
  const phone = document.getElementById('login-phone').value.trim();
  const password = document.getElementById('login-password').value;
  const user = getUserData();

  if (user && user.phone === phone && user.password === password) {
    alert('Вход выполнен!');
    
    // Закрываем попап и обновляем профиль если мы на странице профиля
    if (typeof closePopup === 'function') closePopup();
    if (window.location.pathname.endsWith('profile.html')) {
      loadProfileData();
    }
    return true;
  } else {
    alert('Неверный телефон или пароль!');
    return false;
  }
}

// Показ пароля в виде звездочек
function maskPassword(password) {
  return '*'.repeat(password.length);
}

// Загрузка данных в профиль
function loadProfileData() {
  const user = getUserData();
  const nameElement = document.getElementById('profile-name');
  const phoneElement = document.getElementById('profile-phone');
  const passwordElement = document.getElementById('profile-password');
  
  if (user) {
    nameElement.textContent = user.name;
    phoneElement.textContent = user.phone;
    passwordElement.textContent = maskPassword(user.password);
  } else {
    nameElement.textContent = "Не указано";
    phoneElement.textContent = "Не указан";
    passwordElement.textContent = "Не указан";
  }
}

// Инициализация при загрузке страницы профиля
if (window.location.pathname.endsWith('profile.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    
    // Добавим кнопку выхода
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Выйти';
    logoutBtn.className = 'logout-btn';
    logoutBtn.onclick = function() {
      localStorage.removeItem('userData');
      window.location.href = 'firstpage_dontautoriz.html'; // Перенаправление
    };
    document.querySelector('.right-info').appendChild(logoutBtn);
  });
}