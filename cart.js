// Singleton реализация корзины
const Cart = (function() {
    let instance;
    let eventListenersAttached = false;

    function createInstance() {
        const cart = {
            items: [],
            currentBonuses: 0,

            init() {
                this.loadCart();
                this.loadBonuses();
                if (!eventListenersAttached) {
                    this.setupEventListeners();
                    eventListenersAttached = true;
                }
                this.render();
                this.updateCounter();
                this.updateBonuses();
                this.updateProfileBonuses();
                this.setupCartPopup();
                return this;
            },

            loadCart() {
                try {
                    const cartData = localStorage.getItem('cart');
                    if (!cartData || cartData === '[]') {
                        this.items = [];
                        return this;
                    }
                    this.items = JSON.parse(cartData);
                } catch (e) {
                    console.error('Cart load error:', e);
                    this.items = [];
                    this.clearStorage();
                }
                return this;
            },

            loadBonuses() {
                try {
                    const bonuses = localStorage.getItem('userBonuses');
                    this.currentBonuses = bonuses ? parseInt(bonuses) : 0;
                } catch (e) {
                    console.error('Error loading bonuses:', e);
                    this.currentBonuses = 0;
                }
                return this;
            },

            saveCart() {
                localStorage.setItem('cart', JSON.stringify(this.items));
                return this;
            },

            saveBonuses() {
                localStorage.setItem('userBonuses', this.currentBonuses.toString());
                return this;
            },

            clearStorage() {
                localStorage.removeItem('cart');
                return this;
            },

            parsePrice(priceStr) {
                const price = parseFloat(priceStr.replace(/\D+/g, ''));
                return isNaN(price) ? 0 : price;
            },

            generateProductKey(product) {
                const cardElement = this.findCardElement(product);
                if (cardElement && cardElement.dataset.productId) {
                    return cardElement.dataset.productId;
                }
                return `${product.title}|${product.img}|${this.parsePrice(product.price)}`;
            },

            findCardElement(product) {
                const cards = document.querySelectorAll('.card-product');
                for (const card of cards) {
                    const title = card.querySelector('h3')?.textContent?.trim();
                    const img = card.querySelector('img')?.src;
                    if (title === product.title && img === product.img) {
                        return card;
                    }
                }
                return null;
            },

            add(product) {
                if (!product) return false;
                this.loadCart();

                const priceValue = this.parsePrice(product.price);
                const productKey = this.generateProductKey(product);

                const existingIndex = this.items.findIndex(item => {
                    const itemKey = this.generateProductKey(item);
                    return itemKey === productKey;
                });

                if (existingIndex >= 0) {
                    this.items[existingIndex].quantity++;
                    this.items[existingIndex].totalPrice = 
                        this.items[existingIndex].quantity * priceValue;
                } else {
                    this.items.push({
                        ...product,
                        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
                        priceValue: priceValue,
                        quantity: 1,
                        totalPrice: priceValue
                    });
                }

                this.saveCart();
                this.render();
                this.updateCounter();
                this.updateBonuses();
                this.updateProfileBonuses();
                return true;
            },

            updateQuantity(itemId, change) {
                const itemIndex = this.items.findIndex(item => item.id === itemId);
                if (itemIndex === -1) return false;

                this.items[itemIndex].quantity += change;

                if (this.items[itemIndex].quantity <= 0) {
                    this.items.splice(itemIndex, 1);
                } else {
                    this.items[itemIndex].totalPrice = 
                        this.items[itemIndex].quantity * this.items[itemIndex].priceValue;
                }

                this.saveCart();
                this.render();
                this.updateCounter();
                this.updateBonuses();
                this.updateProfileBonuses();
                return true;
            },

            removeItem(itemId) {
                const itemIndex = this.items.findIndex(item => item.id === itemId);
                if (itemIndex >= 0) {
                    this.items.splice(itemIndex, 1);
                    this.saveCart();
                    this.render();
                    this.updateCounter();
                    this.updateBonuses();
                    this.updateProfileBonuses();
                    return true;
                }
                return false;
            },

            clearCart(showAlert = false) {
                this.items = [];
                this.clearStorage();
                this.render();
                this.updateCounter();
                this.updateBonuses();
                this.updateProfileBonuses();
                
                if (showAlert) {
                    alert('Корзина очищена');
                }
                return true;
            },

            calculateBonusesToAdd() {
                const total = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
                return Math.floor(total / 100);
            },

            updateBonuses() {
                const currentBonusElement = document.querySelector('.current-bonus-count');
                const bonusToAddElement = document.querySelector('.bonus-to-add');
                
                if (currentBonusElement) {
                    currentBonusElement.textContent = this.currentBonuses;
                }
                
                if (bonusToAddElement) {
                    const bonusesToAdd = this.calculateBonusesToAdd();
                    bonusToAddElement.textContent = bonusesToAdd;
                }
                
                return this;
            },

            updateProfileBonuses() {
                const profileBonusElement = document.querySelector('.current-bonus-count-profile');
                if (profileBonusElement) {
                    profileBonusElement.textContent = this.currentBonuses;
                }
                return this;
            },

            render() {
                const container = document.querySelector('.basket-items-container');
                if (!container) return this;
                
                container.innerHTML = '';
                
                if (this.items.length === 0) {
                    container.innerHTML = '<div class="empty-cart-message">Корзина пуста</div>';
                    return this;
                }
                
                this.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'basket-item';
                    itemElement.dataset.id = item.id;
                    itemElement.innerHTML = `
                        <img src="${item.img}" class="basket-item-img" alt="${item.title}">
                        <div class="basket-item-info">
                            <span class="basket-item-title">${item.title}</span>
                            <div class="basket-item-controls">
                                <button class="quantity-decrease">
                                    <img src="assets/images/cart/minus_cart.svg" alt="Уменьшить" class="quantity-icon">
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-increase">
                                    <img src="assets/images/cart/plus_cart.svg" alt="Увеличить" class="quantity-icon">
                                </button>
                            </div>
                            <span class="item-total-price">${item.totalPrice.toFixed(2)} ₽</span>
                            <button class="basket-item-delete">
                                <img src="assets/images/cart/plus_cart.svg" alt="Удалить" class="delete-icon">
                            </button>
                        </div>
                    `;
                    container.appendChild(itemElement);
                });
                
                this.updateTotalPrice();
                this.updateBonuses();
                this.updateProfileBonuses();
                
                return this;
            },

            updateTotalPrice() {
                const totalElement = document.querySelector('.total-price');
                if (!totalElement) return;

                const total = this.items.reduce((sum, item) => sum + item.totalPrice, 0);

                const bonusInput = document.querySelector('.bonus-to-use');
                let bonusesToUse = bonusInput ? parseInt(bonusInput.value) : 0;

                if (isNaN(bonusesToUse) || bonusesToUse < 0) bonusesToUse = 0;
                if (bonusesToUse > this.currentBonuses) bonusesToUse = this.currentBonuses;
                if (bonusesToUse > total) bonusesToUse = Math.floor(total);

                const finalTotal = total - bonusesToUse;

                totalElement.textContent = `Итого: ${finalTotal.toFixed(2)} ₽`;
            },

            updateCounter() {
                const counter = document.querySelector('.cart-counter');
                if (counter) {
                    counter.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
                }
                return this;
            },

            handleItemClick(e) {
                const itemElement = e.target.closest('.basket-item');
                if (!itemElement) return;
                
                const itemId = itemElement.dataset.id;
                
                if (e.target.classList.contains('quantity-decrease') || 
                    e.target.closest('.quantity-decrease')) {
                    this.updateQuantity(itemId, -1);
                } else if (e.target.classList.contains('quantity-increase') || 
                           e.target.closest('.quantity-increase')) {
                    this.updateQuantity(itemId, 1);
                } else if (e.target.classList.contains('basket-item-delete') || 
                           e.target.closest('.basket-item-delete')) {
                    this.removeItem(itemId);
                }
            },

            handleDocumentClick(e) {
                if (e.target.classList.contains('add-to-cart')) {
                    const popup = document.querySelector('.product-popup');
                    if (popup) {
                        const product = {
                            title: popup.querySelector('.popup-title').textContent,
                            price: popup.querySelector('.popup-price').textContent,
                            img: popup.querySelector('.popup-image').src
                        };
                        
                        if (this.add(product)) {
                            alert('Товар добавлен в корзину!');
                            popup.style.display = 'none';
                            document.body.style.overflow = 'auto';
                        }
                    }
                }
                
                if (e.target.classList.contains('pay-button')) {
                    if (this.items.length === 0) {
                        alert('Корзина пуста!');
                        return;
                    }
                    
                    const total = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
                    const bonusesToAdd = this.calculateBonusesToAdd();

                    const bonusInput = document.querySelector('.bonus-to-use');
                    let bonusesToUse = bonusInput ? parseInt(bonusInput.value) : 0;

                    if (isNaN(bonusesToUse) || bonusesToUse < 0) bonusesToUse = 0;
                    if (bonusesToUse > this.currentBonuses) bonusesToUse = this.currentBonuses;
                    if (bonusesToUse > total) bonusesToUse = Math.floor(total);

                    const finalTotal = total - bonusesToUse;
                    const newTotalBonuses = this.currentBonuses - bonusesToUse + bonusesToAdd;
                    
                    if (confirm(
                        `Оформить заказ?\n` +
                        `Сумма: ${total.toFixed(2)} ₽\n` +
                        `Списывается бонусов: ${bonusesToUse}\n` +
                        `Итого к оплате: ${finalTotal.toFixed(2)} ₽\n` +
                        `Будет начислено: ${bonusesToAdd} бонусов`
                    )) {
                        this.currentBonuses = newTotalBonuses;
                        this.saveBonuses();
                        
                        alert(`Заказ успешно оформлен!\nНачислено бонусов: ${bonusesToAdd}, списано: ${bonusesToUse}`);
                        this.clearCart();
                        this.updateProfileBonuses();
                        
                        this.dispatchBonusesUpdate();
                        
                        setTimeout(() => location.reload(), 300);
                    }
                }
            },

            dispatchBonusesUpdate() {
                const event = new CustomEvent('bonusesUpdated', {
                    detail: { bonuses: this.currentBonuses }
                });
                window.dispatchEvent(event);
            },

            setupEventListeners() {
                document.removeEventListener('click', this.handleDocumentClick);
                document.querySelector('.basket-items-container')?.removeEventListener('click', this.handleItemClick);
                
                this.handleDocumentClick = this.handleDocumentClick.bind(this);
                this.handleItemClick = this.handleItemClick.bind(this);
                
                document.addEventListener('click', this.handleDocumentClick);
                document.querySelector('.basket-items-container')?.addEventListener('click', this.handleItemClick);
                
                const bonusInput = document.querySelector('.bonus-to-use');
                if (bonusInput) {
                    bonusInput.addEventListener('input', () => {
                        this.updateTotalPrice();
                    });
                }

                window.addEventListener('bonusesUpdated', (e) => {
                    this.currentBonuses = e.detail.bonuses;
                    this.updateBonuses();
                    this.updateProfileBonuses();
                    this.updateTotalPrice();
                });
            },

            // Функции для управления попапом корзины
            setupCartPopup() {
                const cartIcon = document.querySelector('.page-header__nav-link_image.cart');
                const cartPopup = document.querySelector('.cart-popup');
                const cartOverlay = document.querySelector('.cart-popup-overlay');
                const closeCartBtn = document.querySelector('.close-cart-popup');
                const clearCartBtn = document.querySelector('.clear-cart-button');
                
                // Открытие попапа при клике на иконку корзины
                if (cartIcon) {
                    cartIcon.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.openCartPopup();
                    });
                }
                
                // Закрытие попапа
                if (closeCartBtn) {
                    closeCartBtn.addEventListener('click', () => {
                        this.closeCartPopup();
                    });
                }
                
                if (cartOverlay) {
                    cartOverlay.addEventListener('click', () => {
                        this.closeCartPopup();
                    });
                }
                
                // Очистка корзины
                if (clearCartBtn) {
                    clearCartBtn.addEventListener('click', () => {
                        if (confirm('Вы уверены, что хотите очистить корзину?')) {
                            this.clearCart(true);
                            this.closeCartPopup();
                        }
                    });
                }
                
                // Закрытие по ESC
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && cartPopup.style.display === 'block') {
                        this.closeCartPopup();
                    }
                });
            },

            openCartPopup() {
                const cartPopup = document.querySelector('.cart-popup');
                const cartOverlay = document.querySelector('.cart-popup-overlay');
                
                if (cartPopup && cartOverlay) {
                    cartPopup.style.display = 'block';
                    cartOverlay.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            },

            closeCartPopup() {
                const cartPopup = document.querySelector('.cart-popup');
                const cartOverlay = document.querySelector('.cart-popup-overlay');
                
                if (cartPopup && cartOverlay) {
                    cartPopup.style.display = 'none';
                    cartOverlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        };
        
        return cart;
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    const cart = Cart.getInstance().init();
    window.debugCart = cart;
});