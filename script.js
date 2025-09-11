document.addEventListener('DOMContentLoaded', function () {

    // === Попап продукта ===
    const cards = document.querySelectorAll('.card-product');
    const productPopup = document.querySelector('.product-popup');
    const productCloseBtn = document.querySelector('.close-popup');
    const popupImage = document.querySelector('.popup-image');
    const popupTitle = document.querySelector('.popup-title');
    const popupPrice = document.querySelector('.popup-price');
    const addToCartBtn = document.querySelector('.add-to-cart');

    if (cards.length && productPopup) {
        cards.forEach(card => {
            card.addEventListener('click', function () {
                const imgSrc = this.querySelector('img')?.src;
                const title = this.querySelector('h3')?.textContent;
                const price = this.querySelector('h1')?.textContent;
                
                const composition = this.dataset.composition || 'Состав не указан';
                const calories = this.dataset.calories || '0';
                const protein = this.dataset.protein || '0';
                const fat = this.dataset.fat || '0';
                const carbs = this.dataset.carbs || '0';
                const weight = this.dataset.weight || '0';

                if (imgSrc && title && price) {
                    popupImage.src = imgSrc;
                    popupTitle.textContent = title;
                    popupPrice.textContent = price;
                    document.querySelector('.popup-composition').textContent = composition;
                    document.querySelector('.popup-calories').textContent = calories;
                    document.querySelector('.popup-protein').textContent = protein;
                    document.querySelector('.popup-fat').textContent = fat;
                    document.querySelector('.popup-carbs').textContent = carbs;
                    document.querySelector('.popup-weight').textContent = `${weight} г`;

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

    // === Попап сброса пароля ===
    const resetPasswordPopup = document.querySelector('.reset-password-popup');
    const resetPasswordOverlay = document.querySelector('.reset-password-popup-overlay');
    const resetPasswordCloseBtn = document.querySelector('.reset-password-close-btn');

    if (resetPasswordPopup && resetPasswordOverlay) {
        function openResetPasswordPopup() {
            closeLoginPopup();
            resetPasswordPopup.classList.remove('reset-password-popup--hidden');
            resetPasswordOverlay.classList.remove('reset-password-popup-overlay--hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeResetPasswordPopup() {
            resetPasswordPopup.classList.add('reset-password-popup--hidden');
            resetPasswordOverlay.classList.add('reset-password-popup-overlay--hidden');
            document.body.style.overflow = 'auto';
        }

        if (resetPasswordCloseBtn) {
            resetPasswordCloseBtn.addEventListener('click', closeResetPasswordPopup);
        }

        resetPasswordOverlay.addEventListener('click', function (e) {
            if (e.target === resetPasswordOverlay) {
                closeResetPasswordPopup();
            }
        });

        const forgotPasswordLink = document.getElementById('forgot-password-link');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openResetPasswordPopup();
            });
            forgotPasswordLink.style.cursor = 'pointer';
            forgotPasswordLink.style.color = '#3B1D07';
        }

        // Добавьте обработчик для кнопки отправки
        const resetPasswordSubmitBtn = resetPasswordPopup.querySelector('button:not(.reset-password-close-btn)');
        if (resetPasswordSubmitBtn) {
            resetPasswordSubmitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const phoneInput = document.getElementById('inputnewpassword');
                if (phoneInput && phoneInput.value) {
                    closeResetPasswordPopup();
                }
            });
        }
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
            return;
        }

        const agreementChecked = document.getElementById('checkboxregister1').checked;
        if (!agreementChecked) {
            return;
        }

        const userData = { name, phone, password };
        localStorage.setItem('userData', JSON.stringify(userData));

        closeRegisterPopup();

        setTimeout(() => {
            openLoginPopup();
            const phoneInput = document.getElementById('login-phone');
            if (phoneInput) phoneInput.value = phone;
            const passInput = document.getElementById('login-password');
            if (passInput) passInput.focus();
        }, 150);
    }

    // ===== Авторизация =====
    function loginUser() {
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;
        const savedData = JSON.parse(localStorage.getItem('userData'));

        if (savedData && savedData.phone === phone && savedData.password === password) {
            closeLoginPopup();
            window.location.href = 'profile.html';
        }
    }

    window.registerUser = registerUser;
    window.loginUser = loginUser;

    // ===== Загрузка профиля =====
    function loadProfile() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            document.getElementById('profile-name').textContent = `${userData.name}`;
            document.getElementById('profile-phone').textContent = `${userData.phone}`;
        } else {
            window.location.href = 'firstpage_dontautoriz.html';
        }
    }

    if (window.location.pathname.includes('profile.html')) {
        window.addEventListener('DOMContentLoaded', loadProfile);
    }

    // === Функции для управления попапами авторизации ===
    function openAuthPopup() {
        const authPopup = document.querySelector('.auth-popup');
        const authOverlay = document.querySelector('.auth-popup-overlay');
        
        if (authPopup && authOverlay) {
            authPopup.classList.remove('auth-popup--hidden');
            authOverlay.classList.remove('auth-popup-overlay--hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAuthPopup() {
        const authPopup = document.querySelector('.auth-popup');
        const authOverlay = document.querySelector('.auth-popup-overlay');
        
        if (authPopup && authOverlay) {
            authPopup.classList.add('auth-popup--hidden');
            authOverlay.classList.add('auth-popup-overlay--hidden');
            document.body.style.overflow = 'auto';
        }
    }

    function openLoginPopup() {
        closeAuthPopup();
        const loginPopup = document.querySelector('.login-popup');
        const loginOverlay = document.querySelector('.login-popup-overlay');
        
        if (loginPopup && loginOverlay) {
            loginPopup.classList.remove('login-popup--hidden');
            loginOverlay.classList.remove('login-popup-overlay--hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLoginPopup() {
        const loginPopup = document.querySelector('.login-popup');
        const loginOverlay = document.querySelector('.login-popup-overlay');
        
        if (loginPopup && loginOverlay) {
            loginPopup.classList.add('login-popup--hidden');
            loginOverlay.classList.add('login-popup-overlay--hidden');
            document.body.style.overflow = 'auto';
        }
    }

    function openRegisterPopup() {
        closeAuthPopup();
        const registerPopup = document.querySelector('.register-popup');
        const registerOverlay = document.querySelector('.register-popup-overlay');
        
        if (registerPopup && registerOverlay) {
            registerPopup.classList.remove('register-popup--hidden');
            registerOverlay.classList.remove('register-popup-overlay--hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeRegisterPopup() {
        const registerPopup = document.querySelector('.register-popup');
        const registerOverlay = document.querySelector('.register-popup-overlay');
        
        if (registerPopup && registerOverlay) {
            registerPopup.classList.add('register-popup--hidden');
            registerOverlay.classList.add('register-popup-overlay--hidden');
            document.body.style.overflow = 'auto';
        }
    }

    // === Обработчики для корзины и профиля ===
    const cartBtn = document.querySelector('.cart');
    const profileBtn = document.querySelector('.profile2');
    const loginBtn = document.getElementById('login-btn');
    const authOverlay = document.querySelector('.auth-popup-overlay');

    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                openAuthPopup();
            } else {
                openAuthPopup();
            }
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                openAuthPopup();
            } else {
                window.location.href = 'profile.html';
            }
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            openLoginPopup();
        });
    }

    const authPopupElement = document.querySelector('.auth-popup');
    if (authPopupElement) {
        const noAccountText = authPopupElement.querySelector('p');
        if (noAccountText) {
            noAccountText.addEventListener('click', function() {
                openRegisterPopup();
            });
        }
    }

    if (authOverlay) {
        authOverlay.addEventListener('click', function(e) {
            if (e.target === authOverlay) {
                closeAuthPopup();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const authPopup = document.querySelector('.auth-popup');
            if (authPopup && !authPopup.classList.contains('auth-popup--hidden')) {
                closeAuthPopup();
            }
            const loginPopup = document.querySelector('.login-popup');
            if (loginPopup && !loginPopup.classList.contains('login-popup--hidden')) {
                closeLoginPopup();
            }
            const registerPopup = document.querySelector('.register-popup');
            if (registerPopup && !registerPopup.classList.contains('register-popup--hidden')) {
                closeRegisterPopup();
            }
            const resetPasswordPopup = document.querySelector('.reset-password-popup');
            if (resetPasswordPopup && !resetPasswordPopup.classList.contains('reset-password-popup--hidden')) {
                closeResetPasswordPopup();
            }
            const supportPopup = document.querySelector('.contact-popup');
            if (supportPopup && !supportPopup.classList.contains('contact-popup--hidden')) {
                closeSupportPopup();
            }
            if (productPopup && productPopup.style.display === 'flex') {
                productPopup.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });

    document.querySelector('.login-popup-overlay')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLoginPopup();
        }
    });

    document.querySelector('.register-popup-overlay')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeRegisterPopup();
        }
    });

    // --- Биндим формы и отменяем submit ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            registerUser();
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            loginUser();
        });
    }

    // === Обработчик для кнопки "Добавить в корзину" на конкретных страницах ===
    const targetPages = [
        'about_bagets.html',
        'about_breads.html',
        'about_cakes.html',
        'about_catalog.html',
        'about_croissants.html',
        'about_donuts.html',
        'about_littlepies.html',
        'about_pies.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();
    const isTargetPage = targetPages.includes(currentPage);

    if (isTargetPage && addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                productPopup.style.display = 'none';
                document.body.style.overflow = 'auto';
                setTimeout(function() {
                    openAuthPopup();
                }, 50);
            } else {
                const productData = {
                    title: popupTitle.textContent,
                    price: popupPrice.textContent,
                    image: popupImage.src,
                    composition: document.querySelector('.popup-composition').textContent,
                    weight: document.querySelector('.popup-weight').textContent
                };
                productPopup.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Функции для работы с попапами профиля
function openPopup(popupType) {
    const userData = getUserData();
    if (!userData) {
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
        return;
    }
    if (newPhone === userData.phone) {
        return;
    }
    userData.phone = newPhone;
    saveUserData(userData);
    document.getElementById('profile-phone').textContent = newPhone;
    closePopup('phonePopup');
}

function updatePassword() {
    const userData = getUserData();
    const oldPassword = document.getElementById('old-password-input').value;
    const newPassword = document.getElementById('new-password-input').value;
    const repeatPassword = document.getElementById('repeat-password-input').value;
    if (oldPassword !== userData.password) {
        return;
    }
    if (!newPassword) {
        return;
    }
    if (newPassword !== repeatPassword) {
        return;
    }
    if (newPassword === userData.password) {
        return;
    }
    userData.password = newPassword;
    saveUserData(userData);
    document.getElementById('profile-password').textContent = maskPassword(newPassword);
    closePopup('passwordPopup');
}

function maskPassword(password) {
    return '*'.repeat(password.length);
}

function getUserData() {
    return JSON.parse(localStorage.getItem('userData'));
}

function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

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