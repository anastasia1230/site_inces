// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
});

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            // Анимация иконки меню
            this.textContent = navMenu.classList.contains('show') ? '✕' : '☰';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                menuToggle.textContent = '☰';
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(event) {
            const isClickInsideNav = event.target.closest('nav') || event.target.closest('.menu-toggle');
            if (!isClickInsideNav && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                menuToggle.textContent = '☰';
            }
        });
    }
}

// Плавная прокрутка к якорям (только для кликов по навигации)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Обработка формы обратной связи
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const interest = document.getElementById('interest').value;
            
            // Валидация
            if (!name || !email || !message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            // Имитация отправки
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Имитация задержки сети
            setTimeout(() => {
                showNotification(
                    `Спасибо, ${name}! Ваша заявка на направление "${getInterestText(interest)}" отправлена. Мы свяжемся с вами в ближайшее время.`, 
                    'success'
                );
                
                // Очищаем форму
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Получение текста направления
function getInterestText(value) {
    const interests = {
        'japan': 'Япония',
        'norway': 'Норвегия',
        'bali': 'Бали',
        'other': 'Другое направление',
        '': 'не указано'
    };
    return interests[value] || 'не указано';
}

// Уведомления
function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Анимация появления элементов при прокрутке
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами с анимацией
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Изменение шапки при прокрутке
function initHeaderScroll() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        }
    });
}

// Добавляем стили для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Улучшения для Mac */
    body {
        -webkit-overflow-scrolling: touch;
    }
    
    /* Оптимизация для Retina дисплеев */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .feature, .destination-card, .gallery-item {
            -webkit-font-smoothing: subpixel-antialiased;
        }
    }
`;
document.head.appendChild(style);

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});