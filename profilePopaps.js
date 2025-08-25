// profilePopups.js

// Функции для работы с попапами профиля
function openPopup(popupType) {
    // Проверяем, существуют ли необходимые функции
    if (typeof getUserData !== 'function') {
        console.error('Функция getUserData не найдена!');
        return;
    }
    
    const userData = getUserData();
    if (!userData) {
        alert('Пожалуйста, сначала авторизуйтесь!');
        return;
    }

    if (popupType === 'phone') {
        document.getElementById('old-phone-input').value = userData.phone;
        document.getElementById('new-phone-input').value = '';
        document.getElementById('phonePopupOverlay').classList.remove('popup-overlay--hidden');
        document.body.style.overflow = 'hidden';
    } else if (popupType === 'password') {
        document.getElementById('old-password-input').value = '';
        document.getElementById('new-password-input').value = '';
        document.getElementById('repeat-password-input').value = '';
        document.getElementById('passwordPopupOverlay').classList.remove('popup-overlay--hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closePopup(popupType) {
    if (popupType === 'phonePopup') {
        document.getElementById('phonePopupOverlay').classList.add('popup-overlay--hidden');
    } else if (popupType === 'passwordPopup') {
        document.getElementById('passwordPopupOverlay').classList.add('popup-overlay--hidden');
    }
    document.body.style.overflow = 'auto';
}

function updatePhone() {
    if (typeof getUserData !== 'function' || typeof saveUserData !== 'function') {
        console.error('Необходимые функции не найдены!');
        return;
    }
    
    const userData = getUserData();
    const newPhone = document.getElementById('new-phone-input').value.trim();
    
    if (!newPhone) {
        alert('Введите новый номер телефона!');
        return;
    }
    
    if (newPhone === userData.phone) {
        alert('Новый номер телефона не должен совпадать со старым!');
        return;
    }
    
    userData.phone = newPhone;
    saveUserData(userData);
    document.getElementById('profile-phone').textContent = newPhone;
    alert('Номер телефона успешно изменен!');
    closePopup('phonePopup');
}

function updatePassword() {
    if (typeof getUserData !== 'function' || typeof saveUserData !== 'function' || typeof maskPassword !== 'function') {
        console.error('Необходимые функции не найдены!');
        return;
    }
    
    const userData = getUserData();
    const oldPassword = document.getElementById('old-password-input').value;
    const newPassword = document.getElementById('new-password-input').value;
    const repeatPassword = document.getElementById('repeat-password-input').value;
    
    if (oldPassword !== userData.password) {
        alert('Старый пароль введен неверно!');
        return;
    }
    
    if (!newPassword) {
        alert('Введите новый пароль!');
        return;
    }
    
    if (newPassword !== repeatPassword) {
        alert('Новые пароли не совпадают!');
        return;
    }
    
    if (newPassword === userData.password) {
        alert('Новый пароль не должен совпадать со старым!');
        return;
    }
    
    userData.password = newPassword;
    saveUserData(userData);
    document.getElementById('profile-password').textContent = maskPassword(newPassword);
    alert('Пароль успешно изменен!');
    closePopup('passwordPopup');
}

// Обработчики закрытия по клику вне попапа
document.addEventListener('DOMContentLoaded', function() {
    const popupOverlays = document.querySelectorAll('.popup-overlay');
    
    popupOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                const popupId = overlay.id;
                if (popupId === 'phonePopupOverlay') {
                    closePopup('phonePopup');
                } else if (popupId === 'passwordPopupOverlay') {
                    closePopup('passwordPopup');
                }
            }
        });
    });
});