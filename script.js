// Wishlist functionality
function addToWishlist(event, productId) {
    event.stopPropagation();
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please log in to add items to wishlist!');
        window.location.href = 'login.html';
        return;
    }
    
    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.price').textContent;

    let wishlist = JSON.parse(localStorage.getItem('luxeWishlist')) || [];
    
    const exists = wishlist.find(item => item.id === productId.toString());
    if (!exists) {
        wishlist.push({
            id: productId.toString(),
            name: productName,
            price: productPrice
        });
        localStorage.setItem('luxeWishlist', JSON.stringify(wishlist));
        alert(`${productName} added to wishlist!`);
    } else {
        alert(`${productName} is already in your wishlist!`);
    }
}

// Cart functionality
let cart = [];
let cartCount = 0;

// DOM elements
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartIcon = document.querySelector('.cart-icon');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const ctaBtn = document.querySelector('.cta-btn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    setupEventListeners();
    setupProfileDropdown();
    updateAuthUI();
});

// Update auth UI for all pages
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authLink = document.getElementById('authLink');
    const profileLink = document.getElementById('profileLink');
    
    if (authLink && profileLink) {
        if (isLoggedIn) {
            authLink.textContent = 'Log Out';
            authLink.href = '#';
            authLink.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                alert('Logged out successfully!');
                window.location.reload();
            };
            profileLink.style.display = 'block';
            profileLink.href = 'profile.html';
        } else {
            authLink.textContent = 'Log In';
            authLink.href = 'login.html';
            authLink.onclick = null;
            profileLink.style.display = 'none';
        }
    }
}

// Event listeners
function setupEventListeners() {
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Cart icon click
    cartIcon.addEventListener('click', showCart);

    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);

    // CTA button
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            window.location.href = 'products.html';
        });
    }

    // Product card clicks
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                const productId = card.dataset.id;
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    });
}

// Add to cart functionality
function handleAddToCart(e) {
    e.stopPropagation();
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please log in to add items to cart!');
        window.location.href = 'login.html';
        return;
    }
    
    const productCard = e.target.closest('.product-card');
    const productId = productCard.dataset.id;
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.price').textContent;

    const product = {
        id: productId,
        name: productName,
        price: productPrice
    };

    addToCart(product);
    showAddedToCartMessage(productName);
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    cartCount++;
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartDisplay() {
    cartCountElement.textContent = cartCount;
}

function showCart() {
    window.location.href = 'cart.html';
}

function showAddedToCartMessage(productName) {
    const message = document.createElement('div');
    message.textContent = `${productName} added to cart!`;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4af37;
        color: #000;
        padding: 15px 20px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    
    if (navMenu.style.display === 'flex') {
        navMenu.style.cssText = `
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: #fff;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
    }
}

// Local storage functions
function saveCartToStorage() {
    localStorage.setItem('luxeCart', JSON.stringify(cart));
    localStorage.setItem('luxeCartCount', cartCount.toString());
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('luxeCart');
    const savedCount = localStorage.getItem('luxeCartCount');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedCount) {
        cartCount = parseInt(savedCount);
    }
}

// Load cart on page load
loadCartFromStorage();

// Profile dropdown functionality
function setupProfileDropdown() {
    const profileIcon = document.querySelector('.profile-icon');
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileIcon) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', function() {
            profileDropdown.classList.remove('active');
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS animation for cart message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);