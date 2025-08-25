document.addEventListener('DOMContentLoaded', function() {
    // Точно выбираем ТОЛЬКО блок "Добавить адрес" (с классом .peak)
    const addAddressBlock = document.querySelector('.adress-stroke.peak');
    
    // Создаем pop-up
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    
    const popupContent = document.createElement('div');
    popupContent.className = 'newaddress';
    popupContent.innerHTML = `
        <h1>Добавить адрес</h1>
        <h2>Новый адрес</h2>
        <input type="text" id="inputnewaddres" placeholder="Адрес">
        <button id="submitAddress">Добавить</button>
    `;
    
    // Стили для overlay (затемненного фона)
    Object.assign(popupOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
        display: 'none'
    });
    
    // Добавляем pop-up в DOM
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);

    // Делаем кликабельным ТОЛЬКО блок "Добавить адрес"
    if (addAddressBlock) {
        addAddressBlock.style.cursor = 'pointer';
        
        // Открываем pop-up при клике
        addAddressBlock.addEventListener('click', function() {
            popupOverlay.style.display = 'flex';
            document.getElementById('inputnewaddres').focus();
        });
    }
    
    // Закрываем pop-up при клике на фон
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });
    
    // Предотвращаем закрытие при клике внутри pop-up
    popupContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Обработчик кнопки "Добавить"
    document.getElementById('submitAddress').addEventListener('click', function() {
        const addressInput = document.getElementById('inputnewaddres');
        const address = addressInput.value.trim();
        
        if (address) {
            console.log('Добавлен новый адрес:', address);
            popupOverlay.style.display = 'none';
            addressInput.value = '';
        } else {
            alert('Пожалуйста, введите адрес');
        }
    });
});