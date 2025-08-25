document.addEventListener('DOMContentLoaded', function () {

    // === Попап продукта ===
    const cards = document.querySelectorAll('.card-product');
    const productPopup = document.querySelector('.product-popup');
    const productCloseBtn = document.querySelector('.close-popup');
    const popupImage = document.querySelector('.popup-image');
    const popupTitle = document.querySelector('.popup-title');
    const popupPrice = document.querySelector('.popup-price');
    const addToCartBtn = document.querySelector('.add-to-cart-btn'); // кнопка в попапе

    if (cards.length && productPopup) {
        cards.forEach(card => {
            card.addEventListener('click', function () {
                const imgSrc = this.querySelector('img')?.src;
                const title = this.querySelector('h3')?.textContent;
                const price = this.querySelector('h1')?.textContent;

                if (imgSrc && title && price) {
                    popupImage.src = imgSrc;
                    popupTitle.textContent = title;
                    popupPrice.textContent = price;

                    productPopup.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        if (productCloseBtn) {
            productCloseBtn.addEventListener('click', function () {
                productPopup.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        productPopup.addEventListener('click', function (e) {
            if (e.target === productPopup) {
                productPopup.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // === Добавление в корзину ===
// Обновленная функция добавления в корзину
// === Добавление в корзину ===
/*function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(p => p.title === product.title);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ 
            img: product.img,
            title: product.title,
            price: product.price,
            quantity: 1 
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Инициализация счетчика при загрузке
updateCartCounter()*/

// Обновление счетчика корзины при загрузке
document.addEventListener('DOMContentLoaded', function() {
    Cart.init(); // Инициализируем корзину из cart.js
});

    // === Попап техподдержки ===
    const helpBtn = document.querySelector('.page-header__nav-link_image.help');
    const supportPopup = document.querySelector('.contact-popup');
    const supportOverlay = document.querySelector('.contact-popup-overlay');
    const supportCloseBtn = document.querySelector('.contact-close-btn');

    if (helpBtn && supportPopup && supportOverlay) {
        helpBtn.addEventListener('click', function (e) {
            e.preventDefault();
            supportPopup.classList.remove('contact-popup--hidden');
            supportOverlay.classList.remove('contact-popup-overlay--hidden');
            document.body.style.overflow = 'hidden';
        });

        function closeSupportPopup() {
            supportPopup.classList.add('contact-popup--hidden');
            supportOverlay.classList.add('contact-popup-overlay--hidden');
            document.body.style.overflow = 'auto';
        }

        if (supportCloseBtn) {
            supportCloseBtn.addEventListener('click', closeSupportPopup);
        }

        supportOverlay.addEventListener('click', closeSupportPopup);
    }

    // === Тултипы для map_point ===
    const mapPoints = document.querySelectorAll('.map_point');
    let currentTooltip = null;
    let timeout = null;

    mapPoints.forEach(point => {
        point.addEventListener('mouseenter', function () {
            if (currentTooltip) {
                currentTooltip.remove();
                currentTooltip = null;
            }

            let lines = this.getAttribute('data-lines');
            let icons = this.getAttribute('data-icons');
            if (!lines) {
                const tooltipText = this.getAttribute('data-tooltip');
                const iconSrc = this.getAttribute('data-icon');
                if (tooltipText) {
                    lines = tooltipText;
                    icons = iconSrc || '';
                } else {
                    return;
                }
            }

            const linesArray = lines.split('|').map(line => line.trim());
            const iconsArray = icons ? icons.split('|').map(icon => icon.trim()) : [];

            if (linesArray.length > 0) {
                const tooltip = document.createElement('div');
                tooltip.className = 'map-tooltip';

                let content = '';
                linesArray.forEach((text, index) => {
                    const iconSrc = iconsArray[index] || '';
                    content += '<div class="tooltip-line">';
                    if (iconSrc) {
                        content += `<img src="${iconSrc}" alt="Иконка строки ${index + 1}" onerror="this.style.display='none';">`;
                    }
                    content += `<span>${text}</span>`;
                    content += '</div>';
                });
                tooltip.innerHTML = content;

                const rect = this.getBoundingClientRect();
                const containerRect = document.querySelector('.page-map-container').getBoundingClientRect();

                tooltip.style.left = `${rect.left - containerRect.left + rect.width - 27}px`;
                tooltip.style.top = `${rect.top - containerRect.top}px`;

                tooltip.style.display = 'block';
                tooltip.style.visibility = 'hidden';
                document.querySelector('.page-map-container').appendChild(tooltip);

                if (parseFloat(tooltip.style.left) + tooltip.offsetWidth > containerRect.width) {
                    tooltip.style.left = `${rect.left - containerRect.left - tooltip.offsetWidth - 5}px`;
                }

                tooltip.style.visibility = 'visible';

                currentTooltip = tooltip;

                tooltip.addEventListener('mouseenter', () => {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                });

                tooltip.addEventListener('mouseleave', () => {
                    if (currentTooltip) {
                        currentTooltip.remove();
                        currentTooltip = null;
                    }
                });
            }
        });

        point.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                if (currentTooltip) {
                    currentTooltip.remove();
                    currentTooltip = null;
                }
            }, 100);
        });
    });

    // ===== Регистрация =====
    function registerUser() {
        const name = document.getElementById('register-name').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const repeatPassword = document.getElementById('register-repeat-password').value;

        if (password !== repeatPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        const agreementChecked = document.getElementById('checkboxregister').checked;
        if (!agreementChecked) {
            alert('Необходимо согласие с обработкой данных!');
            return;
        }

        const userData = { name, phone, password };
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Регистрация успешна!');
        window.location.href = 'profile.html';
    }

    // ===== Авторизация =====
    function loginUser() {
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;
        const savedData = JSON.parse(localStorage.getItem('userData'));

        if (savedData && savedData.phone === phone && savedData.password === password) {
            alert('Вход выполнен!');
            window.location.href = 'profile.html';
        } else {
            alert('Неверный телефон или пароль!');
        }
    }

    // ===== Загрузка профиля =====
    function loadProfile() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            document.getElementById('profile-name').textContent = `${userData.name}`;
            document.getElementById('profile-phone').textContent = `${userData.phone}`;
        } else {
            alert('Пожалуйста, сначала зарегистрируйтесь!');
            window.location.href = 'index.html';
        }
    }

    if (window.location.pathname.includes('profile.html')) {
        window.addEventListener('DOMContentLoaded', loadProfile);
    }

    // ===== Отображение корзины в попапе =====
    /*function renderBasketPopup() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const basket = document.querySelector('.buy-basket');
        if (!basket) return;

        const bonusesParagraph = basket.querySelector('p');
        basket.querySelectorAll('.basket-item').forEach(item => item.remove());

        cart.forEach(product => {
            const item = document.createElement('div');
            item.className = 'basket-item';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.marginBottom = '10px';

            item.innerHTML = `
                <img src="${product.img}" style="width:50px;height:50px;margin-right:10px;">
                <span style="flex:1;">${product.title}</span>
                <span>${product.price}</span>
                <span style="margin:0 10px;">x${product.quantity}</span>
            `;

            basket.insertBefore(item, bonusesParagraph);
        });
    }

    renderBasketPopup(); // отрисовать корзину при загрузке*/
});


// Функции для работы с попапами
function openPopup(popupType) {
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
    
    // Обновляем данные пользователя
    userData.phone = newPhone;
    saveUserData(userData);
    
    // Обновляем отображение в профиле
    document.getElementById('profile-phone').textContent = newPhone;
    
    alert('Номер телефона успешно изменен!');
    closePopup('phonePopup');
}

function updatePassword() {
    const userData = getUserData();
    const oldPassword = document.getElementById('old-password-input').value;
    const newPassword = document.getElementById('new-password-input').value;
    const repeatPassword = document.getElementById('repeat-password-input').value;
    
    // Проверки
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
    
    // Обновляем данные пользователя
    userData.password = newPassword;
    saveUserData(userData);
    
    // Обновляем отображение в профиле
    document.getElementById('profile-password').textContent = maskPassword(newPassword);
    
    alert('Пароль успешно изменен!');
    closePopup('passwordPopup');
}

// Функция для маскировки пароля
function maskPassword(password) {
    return '*'.repeat(password.length);
}

// Закрытие попапов по клику вне области
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