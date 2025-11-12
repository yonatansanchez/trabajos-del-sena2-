/**
 * Acero JJ - Sistema de Gestión Web
 * Archivo principal de JavaScript con todas las funcionalidades
 */

class AceroJJ {
    constructor() {
        // Estado para la gestión de inventario
        this.inventoryData = [];
        this.filteredInventory = [];
        this.inventoryFilters = {
            search: '',
            stock: 'all',
            sort: 'name'
        };

        // Estado para la gestión de pedidos y resumenes
        this.ordersData = [];

        // Catálogo y carrito
        this.catalogFilters = {
            search: '',
            sort: 'name',
            category: 'all'
        };
        this.catalogProducts = [];
        this.cartItems = this.loadCart();
        this.taxRate = 0.19;
        this.cartTotals = this.calculateCartTotals();
        this.pendingOrderId = null;

        // Referencias a instancias de gráficos
        this.salesTrendChart = null;
        this.categoryBreakdownChart = null;

        // Gestión de usuarios
        this.usersData = [];

        this.init();
    }

    async init() {
        this.initializeEventListeners();
        this.initializeAuth();
        this.initializeForms();
        this.checkAuthState();
        await this.initializeCartUI();
        this.initializeUserManagement();
    }

    // ===== SISTEMA DE AUTENTICACIÓN =====
    initializeAuth() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            this.updateNavbar(JSON.parse(currentUser));
        } else {
            this.updateNavbar(null);
        }
    }

    login(email, password) {
        const baseUsers = [
            { id: 0, email: 'admin@acerojj.com', password: 'admin123', name: 'Administrador', role: 'admin', registeredAt: new Date().toISOString() },
            { id: 1, email: 'usuario@acerojj.com', password: 'user123', name: 'Usuario Cliente', role: 'user', registeredAt: new Date().toISOString() }
        ];

        let allUsers = this.getUsers();
        const users = [...baseUsers, ...allUsers];

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showNotification('¡Bienvenido! Has iniciado sesión correctamente', 'success');
            
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'bienvenida-usuario.html';
                }
            }, 1500);
            return true;
        } else {
            this.showNotification('Email o contraseña incorrectos', 'error');
            return false;
        }
    }

    register(userData) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.some(user => user.email === userData.email)) {
            this.showNotification('El email ya está registrado', 'error');
            return false;
        }

        const newUser = {
            ...userData,
            id: Date.now(),
            role: 'user',
            registeredAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        this.showNotification('¡Registro exitoso! Ya puedes iniciar sesión', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
        return true;
    }

    logout() {
        localStorage.removeItem('currentUser');
        
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'none';
        }

        this.updateNavbar(null);

        this.showNotification('Has cerrado sesión correctamente', 'info');
        setTimeout(() => {
            window.location.href = 'bienvenida.html';
        }, 1000);
    }

    checkAuthState() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const restrictedPages = ['dashboard.html', 'inventario.html', 'pedidos.html', 'productos.html', 'pago.html'];
        const currentPage = window.location.pathname.split('/').pop();
        const header = document.querySelector('header');

        if (currentUser) {
            if (header) {
                header.style.display = 'block';
            }
            this.updateNavbar(currentUser);
        } else {
            if (header) {
                header.style.display = 'none';
            }
            this.updateNavbar(null);
        }

        if (restrictedPages.includes(currentPage) && !currentUser) {
            this.showNotification('Necesitas iniciar sesión para acceder a esta página', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        if (currentUser && currentPage === 'login.html') {
            window.location.href = currentUser.role === 'admin' ? 'dashboard.html' : 'index.html';
        }
    }

    updateNavbar(user) {
        const userMenu = document.querySelector('#user-menu');
        const loginRegisterLinks = document.querySelector('#login-register-links');
        const adminUsersLink = document.querySelector('#admin-users-link');
        const adminDashboardLink = document.querySelector('#admin-dashboard-link');
        const adminInventoryLink = document.querySelector('#admin-inventory-link');
        const adminOrdersLink = document.querySelector('#admin-orders-link');

        if (user) {
            if (userMenu) {
                userMenu.style.display = 'block';
                const userDropdown = userMenu.querySelector('#userDropdown');
                if (userDropdown) {
                    userDropdown.innerHTML = `<i class="fas fa-user me-1"></i> ${user.name}`;
                }
            }
            if (loginRegisterLinks) loginRegisterLinks.style.display = 'none';

            const isAdmin = user.role === 'admin';
            if (adminUsersLink) adminUsersLink.style.display = isAdmin ? 'block' : 'none';
            if (adminDashboardLink) adminDashboardLink.style.display = isAdmin ? 'block' : 'none';
            if (adminInventoryLink) adminInventoryLink.style.display = isAdmin ? 'block' : 'none';
            if (adminOrdersLink) adminOrdersLink.style.display = isAdmin ? 'block' : 'none';

        } else {
            if (userMenu) userMenu.style.display = 'none';
            if (loginRegisterLinks) loginRegisterLinks.style.display = 'block';
            if (adminUsersLink) adminUsersLink.style.display = 'none';
            if (adminDashboardLink) adminDashboardLink.style.display = 'none';
            if (adminInventoryLink) adminInventoryLink.style.display = 'none';
            if (adminOrdersLink) adminOrdersLink.style.display = 'none';
        }
    }

    // ===== GESTIÓN DE USUARIOS =====
    initializeUserManagement() {
        const userListPage = document.querySelector('#user-list');
        if (userListPage) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || currentUser.role !== 'admin') {
                this.showNotification('Acceso denegado. Debes ser administrador.', 'error');
                setTimeout(() => window.location.href = 'index.html', 1500);
                return;
            }
            this.renderUsersTable();
        }
    }

    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    renderUsersTable() {
        const tableBody = document.querySelector('#user-list');
        if (!tableBody) return;

        const baseUsers = [
            { id: 0, email: 'admin@acerojj.com', name: 'Administrador', role: 'admin', registeredAt: new Date('2025-01-01').toISOString() },
        ];
        const registeredUsers = this.getUsers();
        this.usersData = [...baseUsers, ...registeredUsers].sort((a, b) => a.id - b.id);

        if (!this.usersData.length) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay usuarios registrados.</td></tr>';
            return;
        }

        tableBody.innerHTML = this.usersData.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-${user.role === 'admin' ? 'primary' : 'secondary'}">${user.role}</span></td>
                <td>${this.formatDate(user.registeredAt)}</td>
            </tr>
        `).join('');
    }


    // ===== VALIDACIÓN DE FORMULARIOS =====
    initializeForms() {
        const loginForm = document.querySelector('#loginForm, form[action="login"]');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        const registerForm = document.querySelector('#registerForm, form[action="register"]');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e.target);
            });
        }

        const contactForm = document.querySelector('#contactForm, #contacto form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContact(e.target);
            });
        }
    }

    handleLogin(form) {
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;

        if (!this.validateEmail(email)) {
            this.showNotification('Por favor ingresa un email válido', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        this.login(email, password);
    }

    handleRegister(form) {
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            phone: formData.get('phone')
        };

        if (!userData.name || userData.name.length < 2) {
            this.showNotification('El nombre debe tener al menos 2 caracteres', 'error');
            return;
        }

        if (!this.validateEmail(userData.email)) {
            this.showNotification('Por favor ingresa un email válido', 'error');
            return;
        }

        if (userData.password.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        this.register(userData);
    }

    handleContact(form) {
        const formData = new FormData(form);
        const contactData = {
            name: formData.get('nombre') || formData.get('name'),
            email: formData.get('email'),
            message: formData.get('mensaje') || formData.get('message')
        };

        if (!contactData.name || contactData.name.length < 2) {
            this.showNotification('El nombre debe tener al menos 2 caracteres', 'error');
            return;
        }

        if (!this.validateEmail(contactData.email)) {
            this.showNotification('Por favor ingresa un email válido', 'error');
            return;
        }

        if (!contactData.message || contactData.message.length < 10) {
            this.showNotification('El mensaje debe tener al menos 10 caracteres', 'error');
            return;
        }

        this.showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto', 'success');
        form.reset();
    }

    // ===== CATÁLOGO Y CARRITO =====
    async getCatalogMasterList() {
        const productCards = document.querySelectorAll('#catalogGrid .product-card');
        if (productCards.length > 0) {
            return Array.from(productCards).map((card, index) => {
                const name = card.querySelector('.card-title').textContent;
                const category = card.querySelector('.card-text.small.text-muted')?.textContent || 'General';
                const description = card.querySelector('.card-text.flex-grow-1').textContent;
                const priceText = card.querySelector('.h4.text-primary').textContent;
                const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));
                const unit = priceText.split('/')[1]?.trim() || 'unidad';
                const imageUrl = card.querySelector('img').src;

                return {
                    id: card.dataset.productId || (index + 1).toString(),
                    name,
                    category,
                    description,
                    price,
                    unit,
                    imageUrl
                };
            });
        }
        return [];
    }

    getCategoryList() {
        return [
            { id: 'all', label: 'Todo' },
            { id: 'galvanizado', label: 'Galvanizado' },
            { id: 'carbono', label: 'Acero al carbono' },
            { id: 'inoxidable', label: 'Inoxidable' },
            { id: 'cold-rolled', label: 'Cold Rolled' },
            { id: 'perforada', label: 'Perforada' },
            { id: 'especial', label: 'Especiales' }
        ];
    }

    loadCart() {
        const storedCart = localStorage.getItem('catalogCart');
        return storedCart ? JSON.parse(storedCart) : [];
    }

    saveCart() {
        localStorage.setItem('catalogCart', JSON.stringify(this.cartItems));
    }

    calculateCartTotals(cartItems = this.cartItems) {
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = subtotal * this.taxRate;
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }

    updateCartTotals() {
        this.cartTotals = this.calculateCartTotals();
    }

    getCartItemCount() {
        return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }

    updateCartBadges() {
        const badgeSelectors = ['#cartItemCount', '#cartFabCount'];
        const count = this.getCartItemCount();
        badgeSelectors.forEach(selector => {
            const badge = document.querySelector(selector);
            if (badge) {
                badge.textContent = count;
                const fab = badge.closest('.cart-fab');
                if (fab) {
                    fab.classList.toggle('d-none', count === 0);
                }
            }
        });
    }

    getProductById(productId) {
        return this.catalogProducts.find(item => item.id === productId);
    }

    addToCart(productId, quantity = 1) {
        const product = this.getProductById(productId);
        if (!product) {
            console.warn('Producto no encontrado:', productId);
            return;
        }

        const existingItem = this.cartItems.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                unit: product.unit,
                category: product.category,
                quantity
            });
        }

        this.onCartChange({ action: 'add', productId });
    }

    setCartItemQuantity(productId, quantity) {
        const item = this.cartItems.find(cartItem => cartItem.id === productId);
        if (!item) return;

        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        item.quantity = quantity;
        this.onCartChange({ action: 'update', productId });
    }

    removeFromCart(productId) {
        this.cartItems = this.cartItems.filter(item => item.id !== productId);
        this.onCartChange({ action: 'remove', productId });
    }

    clearCart(silent = false) {
        this.cartItems = [];
        this.onCartChange({ action: 'clear', silent });
    }

    onCartChange(options = {}) {
        this.saveCart();
        this.updateCartTotals();
        this.updateCartBadges();
        this.renderCartOffcanvas();
        this.renderCheckoutItems();
        this.renderPaymentSummary();

        if (!options.silent) {
            let message = 'Carrito actualizado';
            if (options.action === 'add' && options.productId) {
                const product = this.getProductById(options.productId);
                if (product) {
                    message = `"${product.name}" se ha añadido al carrito.`;
                }
            }
            this.showNotification(message, 'success');
        }
    }

    async initializeCartUI() {
        this.catalogProducts = await this.getCatalogMasterList();
        this.cartItems = this.loadCart();
        this.updateCartTotals();
        this.updateCartBadges();
        this.renderCartOffcanvas();
        this.renderCheckoutItems();
        this.renderPaymentSummary();
        this.initializeCatalog();
        this.initializeCheckout();
        this.initializePayment();
    }

    renderCategoryFilters() {
        const container = document.querySelector('#categoryFilters');
        if (!container) return;

        container.innerHTML = '';
        this.getCategoryList().forEach(category => {
            const button = document.createElement('button');
            button.className = `btn btn-outline-primary btn-sm${this.catalogFilters.category === category.id ? ' active' : ''}`;
            button.dataset.category = category.id;
            button.textContent = category.label;
            button.addEventListener('click', () => {
                this.catalogFilters.category = category.id;
                container.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.renderCatalogProducts();
            });
            container.appendChild(button);
        });
    }

    renderCatalogProducts() {
        const grid = document.querySelector('#catalogGrid');
        if (!grid) return;

        const searchTerm = this.catalogFilters.search.toLowerCase();
        const categoryFilter = this.catalogFilters.category;
        const productCards = grid.querySelectorAll('.product-card');
        let visibleProducts = 0;

        productCards.forEach(card => {
            const name = card.querySelector('.card-title').textContent.toLowerCase();
            const cardCategory = card.dataset.category || 'general';
            const description = card.querySelector('.card-text.flex-grow-1').textContent.toLowerCase();
            const matchesSearch = !searchTerm || name.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || cardCategory.toLowerCase() === categoryFilter.toLowerCase();

            if (matchesSearch && matchesCategory) {
                card.parentElement.style.display = 'block';
                visibleProducts++;
            } else {
                card.parentElement.style.display = 'none';
            }
        });

        const noResultsMessage = grid.querySelector('.no-results-message');
        if (noResultsMessage) noResultsMessage.remove();

        if (visibleProducts === 0) {
            grid.insertAdjacentHTML('beforeend', '<div class="col-12 text-center text-muted no-results-message">No hay productos que coincidan con la búsqueda.</div>');
        }
    }

    initializeCatalog() {
        const searchInput = document.querySelector('#catalogSearch');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                this.catalogFilters.search = event.target.value;
                this.renderCatalogProducts();
            });
        }

        const grid = document.querySelector('#catalogGrid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const button = e.target.closest('.add-to-cart-btn');
                if (button) {
                    const card = e.target.closest('.product-card');
                    const productId = card.dataset.productId;
                    const quantityInput = card.querySelector('.quantity-input');
                    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
                    this.addToCart(productId, quantity);
                }
            });
        }

        document.querySelectorAll('[data-bs-toggle="offcanvas"][data-bs-target="#cartOffcanvas"]').forEach(button => {
            button.addEventListener('click', () => this.renderCartOffcanvas());
        });

        const clearCartButton = document.querySelector('#clearCartButton');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => {
                if (this.cartItems.length === 0) {
                    this.showNotification('El carrito ya está vacío', 'info');
                    return;
                }
                this.clearCart();
            });
        }

        this.renderCategoryFilters();
        this.renderCatalogProducts();
    }

    renderCartOffcanvas() {
        const container = document.querySelector('#cartItemsList');
        const subtotalEl = document.querySelector('#cartSubtotal');
        const taxEl = document.querySelector('#cartTax');
        const totalEl = document.querySelector('#cartTotal');
        const checkoutButton = document.querySelector('#goToCheckoutButton');
        const emptyState = document.querySelector('#cartEmptyState');

        if (!container || !subtotalEl || !taxEl || !totalEl || !emptyState) return;

        container.innerHTML = '';

        if (!this.cartItems.length) {
            emptyState.style.display = 'block';
            if(checkoutButton) checkoutButton.classList.add('disabled');
        } else {
            emptyState.style.display = 'none';
            if(checkoutButton) checkoutButton.classList.remove('disabled');
            this.cartItems.forEach(item => {
                const row = document.createElement('div');
                row.className = 'cart-item mb-3';
                row.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${item.name}</h6>
                            <small class="text-muted text-uppercase">${item.category}</small>
                        </div>
                        <button class="btn btn-link btn-sm text-danger p-0" data-remove-item="${item.id}"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <div>
                            <span class="fw-semibold">${this.formatCurrency(item.price)}</span>
                            <small class="text-muted"> / ${item.unit}</small>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-outline-secondary btn-sm" data-quantity-decrease="${item.id}">-</button>
                            <input type="number" class="form-control form-control-sm text-center" style="width: 60px;" min="1" value="${item.quantity}" data-quantity-input="${item.id}">
                            <button class="btn btn-outline-secondary btn-sm" data-quantity-increase="${item.id}">+</button>
                        </div>
                    </div>
                `;
                container.appendChild(row);
            });
        }

        const { subtotal, tax, total } = this.calculateCartTotals();
        subtotalEl.textContent = this.formatCurrency(subtotal);
        taxEl.textContent = this.formatCurrency(tax);
        totalEl.textContent = this.formatCurrency(total);

        container.querySelectorAll('[data-remove-item]').forEach(button => {
            button.addEventListener('click', () => this.removeFromCart(button.dataset.removeItem));
        });

        container.querySelectorAll('[data-quantity-decrease]').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.quantityDecrease;
                const item = this.cartItems.find(cartItem => cartItem.id === productId);
                if (item) this.setCartItemQuantity(productId, item.quantity - 1);
            });
        });

        container.querySelectorAll('[data-quantity-increase]').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.quantityIncrease;
                const item = this.cartItems.find(cartItem => cartItem.id === productId);
                if (item) this.setCartItemQuantity(productId, item.quantity + 1);
            });
        });

        container.querySelectorAll('[data-quantity-input]').forEach(input => {
            input.addEventListener('change', event => {
                const productId = input.dataset.quantityInput;
                const value = parseInt(event.target.value, 10) || 1;
                this.setCartItemQuantity(productId, value);
            });
        });
    }

    renderCheckoutItems() {
        const tableBody = document.querySelector('#checkoutItemsTable tbody');
        const emptyState = document.querySelector('#checkoutEmptyState');
        const totalsEl = document.querySelector('#checkoutTotals');
        const subtotalEl = document.querySelector('#checkoutSubtotal');
        const taxEl = document.querySelector('#checkoutTax');
        const totalEl = document.querySelector('#checkoutTotal');
        const goToPaymentButton = document.querySelector('#goToPaymentButton');

        if (!tableBody || !emptyState || !totalsEl || !subtotalEl || !taxEl || !totalEl) return;

        tableBody.innerHTML = '';

        if (!this.cartItems.length) {
            emptyState.classList.remove('d-none');
            totalsEl.classList.add('d-none');
            if(goToPaymentButton) goToPaymentButton.classList.add('disabled');
            return;
        }

        emptyState.classList.add('d-none');
        totalsEl.classList.remove('d-none');
        if(goToPaymentButton) goToPaymentButton.classList.remove('disabled');

        this.cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="fw-semibold d-block">${item.name}</span>
                    <small class="text-muted text-uppercase">${item.category}</small>
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-end">${this.formatCurrency(item.price)}</td>
                <td class="text-end">${this.formatCurrency(item.price * item.quantity)}</td>
            `;
            tableBody.appendChild(row);
        });

        const { subtotal, tax, total } = this.calculateCartTotals();
        subtotalEl.textContent = this.formatCurrency(subtotal);
        taxEl.textContent = this.formatCurrency(tax);
        totalEl.textContent = this.formatCurrency(total);
    }

    getCustomerProfile() {
        const stored = localStorage.getItem('customerProfile');
        return stored ? JSON.parse(stored) : null;
    }

    saveCustomerProfile(profile) {
        localStorage.setItem('customerProfile', JSON.stringify(profile));
    }

    renderCustomerOrders(email = '') {
        const container = document.querySelector('#customerOrdersBody');
        if (!container) return;

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        container.innerHTML = '';

        if (!orders.length) {
            container.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay pedidos registrados.</td></tr>';
            return;
        }

        orders
            .filter(order => !email || order.customer?.email === email)
            .slice(-10)
            .reverse()
            .forEach(order => {
                const totalValue = order.totals?.total ?? order.totalAmount ?? 0;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id || '—'}</td>
                    <td>${order.customer?.name || order.customerName || 'Sin nombre'}</td>
                    <td>${this.formatCurrency(totalValue)}</td>
                    <td><span class="badge bg-${order.status === 'paid' ? 'success' : 'warning'}">${order.status === 'paid' ? 'Pagado' : 'Pendiente'}</span></td>
                `;
                container.appendChild(row);
            });
    }

    initializeCheckout() {
        const form = document.querySelector('#checkoutForm');
        if (!form) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const storedProfile = this.getCustomerProfile();
        
        if (currentUser) {
            form.querySelector('#checkoutName').value = currentUser.name || '';
            form.querySelector('#checkoutEmail').value = currentUser.email || '';
            form.querySelector('#checkoutPhone').value = currentUser.phone || '';
        } else if (storedProfile) {
            form.querySelector('#checkoutName').value = storedProfile.name || '';
            form.querySelector('#checkoutEmail').value = storedProfile.email || '';
            form.querySelector('#checkoutPhone').value = storedProfile.phone || '';
            form.querySelector('#checkoutCompany').value = storedProfile.company || '';
        }

        this.renderCheckoutItems();
        this.renderCustomerOrders(currentUser?.email || storedProfile?.email);

        form.addEventListener('submit', event => {
            event.preventDefault();
            if (this.cartItems.length === 0) {
                this.showNotification('Añade productos al carrito antes de generar el pedido.', 'warning');
                return;
            }
            this.submitCheckout(form);
        });

        const goToPaymentButton = document.querySelector('#goToPaymentButton');
        if (goToPaymentButton) {
            goToPaymentButton.addEventListener('click', () => {
                if (this.cartItems.length === 0) {
                    this.showNotification('Tu carrito está vacío.', 'warning');
                    return;
                }
                form.dispatchEvent(new Event('submit', { cancelable: true }));
            });
        }
    }

    submitCheckout(form) {
        const orderId = `PED-${Date.now().toString().slice(-6)}`;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const customer = {
            name: form.querySelector('#checkoutName').value,
            email: form.querySelector('#checkoutEmail').value,
            phone: form.querySelector('#checkoutPhone').value,
            company: form.querySelector('#checkoutCompany').value,
            notes: form.querySelector('#checkoutNotes').value
        };

        this.saveCustomerProfile(customer);

        const order = {
            id: orderId,
            userId: currentUser ? currentUser.id : null,
            createdAt: new Date().toISOString(),
            items: this.cartItems.map(item => ({ ...item })),
            totals: this.calculateCartTotals(),
            customer,
            status: 'pending'
        };

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.setItem('latestOrderId', orderId);

        this.showNotification('Pedido generado correctamente. Continúa con el pago.', 'success');
        this.renderCustomerOrders(customer.email);
        window.location.href = 'pago.html';
    }

    initializePayment() {
        const form = document.querySelector('#paymentForm');
        if (!form) return;

        this.renderPaymentSummary();

        const cardNumber = form.querySelector('#cardNumber');
        const cardExpiry = form.querySelector('#cardExpiry');
        const cardCvv = form.querySelector('#cardCvv');

        if (cardNumber) cardNumber.addEventListener('input', event => this.handleCardNumberInput(event));
        if (cardExpiry) cardExpiry.addEventListener('input', event => this.handleCardExpiryInput(event));
        if (cardCvv) cardCvv.addEventListener('input', event => this.handleCardCvvInput(event));

        form.addEventListener('submit', event => {
            event.preventDefault();
            this.processPayment(form);
        });
    }

    renderPaymentSummary(order) {
        const itemsContainer = document.querySelector('#paymentItemsList');
        const subtotalEl = document.querySelector('#paymentSubtotal');
        const taxEl = document.querySelector('#paymentTax');
        const totalEl = document.querySelector('#paymentTotal');
        const paymentForm = document.querySelector('#paymentForm');
        const paymentSuccess = document.querySelector('#paymentSuccess');

        if (!itemsContainer || !subtotalEl || !taxEl || !totalEl) return;

        let currentOrder = order;

        if (!currentOrder) {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const latestOrderId = localStorage.getItem('latestOrderId');
            currentOrder = orders.find(o => o.id === latestOrderId);
        }

        if (!currentOrder || currentOrder.status === 'paid') {
            itemsContainer.innerHTML = '<li class="list-group-item">No hay pedido pendiente de pago.</li>';
            subtotalEl.textContent = '$0.00';
            taxEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            if (paymentForm) paymentForm.classList.add('d-none');
            if (paymentSuccess && currentOrder?.status === 'paid') {
                paymentSuccess.classList.remove('d-none');
                const orderIdSpan = paymentSuccess.querySelector('#successOrderId');
                if(orderIdSpan) orderIdSpan.textContent = currentOrder.id;
            }
            return;
        }

        if (paymentForm) paymentForm.classList.remove('d-none');
        if (paymentSuccess) paymentSuccess.classList.add('d-none');

        const items = currentOrder.items || [];
        itemsContainer.innerHTML = '';

        if (!items.length) {
            itemsContainer.innerHTML = '<li class="list-group-item">No se encontraron artículos asociados al pedido.</li>';
        } else {
            items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.innerHTML = `
                    <div>
                        <div class="fw-semibold">${item.name}</div>
                        <small class="text-muted">Cantidad: ${item.quantity}</small>
                    </div>
                    <span class="fw-semibold">${this.formatCurrency(item.price * item.quantity)}</span>
                `;
                itemsContainer.appendChild(listItem);
            });
        }

        const { subtotal, tax, total } = currentOrder.totals || this.calculateCartTotals(items);
        subtotalEl.textContent = this.formatCurrency(subtotal);
        taxEl.textContent = this.formatCurrency(tax);
        totalEl.textContent = this.formatCurrency(total);
    }

    processPayment(form) {
        const latestOrderId = localStorage.getItem('latestOrderId');
        if (!latestOrderId) {
            this.showNotification('No se encontró un pedido pendiente de pago.', 'warning');
            return;
        }

        const cardData = {
            holder: form.querySelector('#cardHolder').value,
            number: form.querySelector('#cardNumber').value.replace(/\s/g, ''),
            expiry: form.querySelector('#cardExpiry').value,
            cvv: form.querySelector('#cardCvv').value,
            billingAddress: form.querySelector('#billingAddress').value
        };

        if (!cardData.holder || cardData.number.length < 16 || cardData.cvv.length < 3) {
            this.showNotification('Revisa los datos de la tarjeta.', 'warning');
            return;
        }

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = orders.findIndex(order => order.id === latestOrderId);

        if (orderIndex === -1) {
            this.showNotification('El pedido asociado no existe.', 'danger');
            return;
        }

        orders[orderIndex] = this.markOrderAsPaid(latestOrderId, { cardData });
        localStorage.setItem('orders', JSON.stringify(orders));
        this.clearCart(true);
        localStorage.removeItem('latestOrderId');

        const successState = document.querySelector('#paymentSuccess');
        if (successState) {
            successState.classList.remove('d-none');
            const orderIdSpan = successState.querySelector('#successOrderId');
            if(orderIdSpan) orderIdSpan.textContent = latestOrderId;
        }

        form.classList.add('d-none');
        this.showNotification('Pago procesado correctamente.', 'success');
    }

    markOrderAsPaid(orderId, paymentData = {}) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(item => item.id === orderId);
        if (!order) return null;

        return {
            ...order,
            status: 'paid',
            paidAt: new Date().toISOString(),
            payment: {
                method: 'credit-card',
                last4: paymentData.cardData?.number?.slice(-4),
                reference: `PAY-${Date.now().toString().slice(-8)}`
            }
        };
    }

    handleCardNumberInput(event) {
        let value = event.target.value.replace(/\D/g, '').slice(0, 16);
        value = value.replace(/(.{4})/g, '$1 ').trim();
        event.target.value = value;
    }

    handleCardExpiryInput(event) {
        let value = event.target.value.replace(/\D/g, '').slice(0, 4);
        if (value.length >= 3) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        event.target.value = value;
    }

    handleCardCvvInput(event) {
        event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4);
    }

    // ===== DASHBOARD =====
    initializeDashboard() {
        if (!document.querySelector('#dashboardTotalSales')) return;

        this.loadInventoryData();
        this.loadOrdersData();
        this.updateDashboardOverview();
        this.renderSalesTrend();
        this.renderCategoryBreakdown();
        this.renderRecentOrders();
    }

    loadOrdersData() {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        if (!Array.isArray(orders) || orders.length === 0) {
            orders = this.getDefaultOrders();
            localStorage.setItem('orders', JSON.stringify(orders));
        }

        this.ordersData = orders
            .map(order => ({
                ...order,
                totalAmount: order.totals?.total || Number(order.totalAmount) || this.calculateOrderTotal(order)
            }))
            .sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));
    }

    calculateOrderTotal(order) {
        if (!order || !Array.isArray(order.products)) {
            return 0;
        }
        return order.products.reduce((total, product) => {
            return total + (Number(product.quantity || 0) * Number(product.price || 0));
        }, 0);
    }

    getDefaultOrders() {
        const now = new Date();
        const makeDate = (offsetDays) => {
            const date = new Date(now);
            date.setDate(date.getDate() - offsetDays);
            return date.toISOString();
        };

        return [
            { id: 1254, code: '#1254', userId: 1, customerName: 'Constructora XYZ', customerEmail: 'compras@constructora.xyz', orderDate: makeDate(2), status: 'completado', products: [{ name: 'Varilla Corrugada', quantity: 200, price: 25.50 }, { name: 'Lámina Galvanizada', quantity: 80, price: 89.99 }] },
            { id: 1253, code: '#1253', userId: 2, customerName: 'Arq. Juan Pérez', customerEmail: 'juan.perez@proyectos.com', orderDate: makeDate(4), status: 'completado', products: [{ name: 'Perfil IPR (Viga)', quantity: 12, price: 125.00 }, { name: 'Varilla Corrugada', quantity: 50, price: 25.50 }] },
            { id: 1252, code: '#1252', userId: 3, customerName: 'Ing. Ana García', customerEmail: 'ana.garcia@infraestructura.com', orderDate: makeDate(7), status: 'pendiente', products: [{ name: 'Perfil IPR (Viga)', quantity: 60, price: 125.00 }, { name: 'Varilla Corrugada', quantity: 300, price: 25.50 }] },
            { id: 1251, code: '#1251', userId: 4, customerName: 'Proyectos Civiles S.A.', customerEmail: 'logistica@proyectosciviles.com', orderDate: makeDate(9), status: 'cancelado', products: [{ name: 'Lámina Galvanizada', quantity: 120, price: 89.99 }, { name: 'Malla Electrosoldada', quantity: 50, price: 45.00 }] }
        ].map(o => ({...o, totalAmount: this.calculateOrderTotal(o)}));
    }

    updateDashboardOverview() {
        const totalSalesEl = document.querySelector('#dashboardTotalSales');
        if (!totalSalesEl) return;

        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const ordersLast30Days = this.ordersData.filter(order => new Date(order.orderDate || order.createdAt) >= thirtyDaysAgo);
        const validOrders = ordersLast30Days.filter(order => order.status !== 'cancelado');
        const completedOrders = ordersLast30Days.filter(order => order.status === 'completado' || order.status === 'paid');

        const totalSales = validOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);
        const totalOrders = ordersLast30Days.length;
        const pendingOrders = ordersLast30Days.filter(order => order.status === 'pendiente').length;
        const completedTotal = completedOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);
        const averageTicket = completedOrders.length ? completedTotal / completedOrders.length : 0;

        totalSalesEl.textContent = this.formatCurrency(totalSales);
        document.querySelector('#dashboardTotalOrders').textContent = totalOrders;
        document.querySelector('#dashboardAverageTicket').textContent = this.formatCurrency(averageTicket);
        
        const salesDeltaEl = document.querySelector('#dashboardSalesDelta');
        if (salesDeltaEl) salesDeltaEl.textContent = `${validOrders.length} pedidos con ventas`;
        
        const ordersDeltaEl = document.querySelector('#dashboardOrdersDelta');
        if (ordersDeltaEl) ordersDeltaEl.textContent = `Pendientes: ${pendingOrders}`;

        const averageLineEl = document.querySelector('#dashboardAverageLine');
        if (averageLineEl) averageLineEl.textContent = `${completedOrders.length} pedidos completados`;
    }

    renderSalesTrend() {
        const canvas = document.querySelector('#salesTrendChart');
        if (!canvas) return;

        const now = new Date();
        const months = [];
        const totalsByMonth = new Map();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            months.push({ key, label: `${this.getMonthName(date.getMonth())} ${date.getFullYear()}` });
            totalsByMonth.set(key, 0);
        }

        this.ordersData.forEach(order => {
            if (order.status === 'cancelado') return;
            const orderDate = new Date(order.orderDate || order.createdAt);
            const key = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
            if (totalsByMonth.has(key)) {
                totalsByMonth.set(key, totalsByMonth.get(key) + Number(order.totalAmount || 0));
            }
        });

        const labels = months.map(month => month.label);
        const dataPoints = months.map(month => totalsByMonth.get(month.key) || 0);

        if (this.salesTrendChart) this.salesTrendChart.destroy();

        this.salesTrendChart = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Ventas',
                    data: dataPoints,
                    borderColor: '#2C5D92',
                    backgroundColor: 'rgba(44, 93, 146, 0.1)',
                    fill: true,
                    tension: 0.35,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { callback: value => this.formatCurrency(value) } } }
            }
        });
    }

    renderCategoryBreakdown() {
        const canvas = document.querySelector('#categoryBreakdownChart');
        if (!canvas) return;

        const inventoryMap = new Map(this.inventoryData.map(item => [item.name.toLowerCase(), item.category]));
        const categoryTotals = new Map();

        this.ordersData.forEach(order => {
            if (order.status === 'cancelado') return;
            (order.products || order.items || []).forEach(product => {
                const productName = (product.name || '').toLowerCase();
                const category = inventoryMap.get(productName) || 'Otros';
                const amount = Number(product.price || 0) * Number(product.quantity || 0);
                categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount);
            });
        });

        if (!categoryTotals.size) return;

        const sortedCategories = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1]);
        const labels = sortedCategories.map(([category]) => category);
        const values = sortedCategories.map(([, total]) => total);
        const totalCategoriesValue = values.reduce((acc, value) => acc + value, 0) || 1;

        if (this.categoryBreakdownChart) this.categoryBreakdownChart.destroy();

        const colors = labels.map((_, index) => {
            const palette = ['#2C5D92', '#FF8C00', '#68B684', '#F25F5C', '#4ECDC4', '#C7B42C'];
            return palette[index % palette.length];
        });

        this.categoryBreakdownChart = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{ data: values, backgroundColor: colors, borderColor: '#ffffff', borderWidth: 2 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const value = context.parsed;
                                const percent = (value / totalCategoriesValue) * 100;
                                return ` ${this.formatCurrency(value)} (${percent.toFixed(1)}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderRecentOrders() {
        const tableBody = document.querySelector('#recentOrdersBody');
        if (!tableBody) return;

        if (!this.ordersData.length) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay pedidos.</td></tr>`;
            return;
        }

        tableBody.innerHTML = this.ordersData.slice(0, 10).map(order => `
            <tr>
                <td>${order.code || `#${order.id}`}</td>
                <td>${order.customerName || order.customer?.name || 'Cliente'}</td>
                <td>${this.formatDate(order.orderDate || order.createdAt)}</td>
                <td>${this.formatCurrency(order.totalAmount)}</td>
                <td><span class="badge ${this.getOrderBadgeClass(order.status)}">${this.capitalize(order.status)}</span></td>
            </tr>
        `).join('');
    }

    // ===== GESTIÓN DE INVENTARIO =====
    initializeInventory() {
        if (!document.body.id === 'page-inventory') return;
        this.loadInventoryData();
        this.initializeInventoryControls();
        this.updateInventoryStats();
    }

    loadInventoryData() {
        let inventory = JSON.parse(localStorage.getItem('inventory'));
        if (!inventory) {
            inventory = this.getDefaultInventory();
            localStorage.setItem('inventory', JSON.stringify(inventory));
        }
        this.inventoryData = inventory;
        this.applyInventoryFilters();
    }

    getDefaultInventory() {
        return [
            { id: 1, name: 'Varilla Corrugada', category: 'Acero', stock: 1500, price: 25.50, lastUpdate: '2025-10-26', image: 'images/productos/varilla.jpg' },
            { id: 2, name: 'Perfil IPR (Viga)', category: 'Perfiles', stock: 300, price: 125.00, lastUpdate: '2025-10-26', image: 'images/productos/perfil_ipr.jpg' },
            { id: 3, name: 'Lámina Galvanizada', category: 'Láminas', stock: 350, price: 89.99, lastUpdate: '2025-10-25', image: 'images/productos/lamina_galvanizada.jpg' },
            { id: 4, name: 'Malla Electrosoldada', category: 'Mallas', stock: 800, price: 45.00, lastUpdate: '2025-10-24', image: 'images/productos/malla.jpg' },
            { id: 5, name: 'Tubo Estructural', category: 'Perfiles', stock: 600, price: 65.75, lastUpdate: '2025-10-23', image: 'images/productos/tubo_estructural.jpg' },
            { id: 6, name: 'Ángulo de Acero', category: 'Perfiles', stock: 1200, price: 15.20, lastUpdate: '2025-10-22', image: 'images/productos/angulo.jpg' },
            { id: 7, name: 'Placa de Acero A36', category: 'Láminas', stock: 200, price: 250.00, lastUpdate: '2025-10-21', image: 'images/productos/placa_a36.jpg' },
            { id: 8, name: 'Canal U', category: 'Perfiles', stock: 450, price: 78.50, lastUpdate: '2025-10-20', image: 'images/productos/canal_u.jpg' },
            { id: 9, name: 'Alambre Recocido', category: 'Acero', stock: 5000, price: 5.50, lastUpdate: '2025-10-19', image: 'images/productos/alambre.jpg' },
            { id: 10, name: 'Lámina Cold Rolled', category: 'Láminas', stock: 400, price: 95.00, lastUpdate: '2025-10-18', image: 'images/productos/cold_rolled.jpg' }
        ];
    }

    renderInventoryTable(inventory) {
        const tbody = document.querySelector('#inventoryTable tbody');
        if (!tbody) return;

        if (!inventory.length) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-5">No hay productos.</td></tr>`;
            return;
        }

        tbody.innerHTML = inventory.map(product => `
            <tr data-id="${product.id}">
                <td><img src="${product.image}" alt="${product.name}" class="img-thumbnail" style="width: 50px;"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td class="text-center"><span class="badge ${product.stock < 100 ? 'bg-danger' : product.stock < 500 ? 'bg-warning' : 'bg-success'}">${product.stock}</span></td>
                <td class="text-end">${this.formatCurrency(product.price)}</td>
                <td class="text-center">${this.formatDate(product.lastUpdate)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning" data-action="edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-info" data-action="view" data-id="${product.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-danger" data-action="delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    addProduct(productData) {
        let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const newProduct = {
            ...productData,
            id: Date.now(),
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock, 10),
            lastUpdate: new Date().toISOString().split('T')[0]
        };
        inventory.push(newProduct);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        this.inventoryData = inventory;
        this.applyInventoryFilters();
        this.showNotification('Producto agregado correctamente', 'success');
    }

    updateProduct(id, productData) {
        let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const index = inventory.findIndex(p => p.id === id);
        if (index > -1) {
            inventory[index] = {
                ...inventory[index],
                ...productData,
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock, 10),
                lastUpdate: new Date().toISOString().split('T')[0]
            };
            localStorage.setItem('inventory', JSON.stringify(inventory));
            this.inventoryData = inventory;
            this.applyInventoryFilters();
            this.showNotification('Producto actualizado correctamente', 'success');
        }
    }

    deleteProduct(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
            inventory = inventory.filter(p => p.id !== id);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            this.inventoryData = inventory;
            this.applyInventoryFilters();
            this.showNotification('Producto eliminado correctamente', 'success');
        }
    }

    initializeInventoryControls() {
        const searchInput = document.querySelector('#inventorySearch');
        if (searchInput) searchInput.addEventListener('input', (e) => this.setInventorySearch(e.target.value));

        document.querySelectorAll('[name="stockFilter"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.setInventoryStockFilter(e.target.value));
        });

        const sortSelect = document.querySelector('#inventorySort');
        if (sortSelect) sortSelect.addEventListener('change', (e) => this.setInventorySort(e.target.value));

        const addProductButton = document.querySelector('#addProductButton');
        if (addProductButton) addProductButton.addEventListener('click', () => this.showProductModal());

        const exportButton = document.querySelector('#exportInventory');
        if (exportButton) exportButton.addEventListener('click', () => this.exportInventory());

        const table = document.querySelector('#inventoryTable');
        if(table) {
            table.addEventListener('click', e => {
                const button = e.target.closest('button[data-action]');
                if(!button) return;

                const id = parseInt(button.dataset.id, 10);
                switch(button.dataset.action) {
                    case 'edit': this.showProductModal(this.inventoryData.find(p => p.id === id)); break;
                    case 'view': this.viewProduct(id); break;
                    case 'delete': this.deleteProduct(id); break;
                }
            });
        }
    }

    // ===== UTILIDADES =====
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) {
            console.error('El contenedor de notificaciones no se encontró.');
            return;
        }
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${this.getBootstrapAlertClass(type)} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        container.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
        bsToast.show();
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
    }

    getBootstrapAlertClass(type) {
        switch (type) {
            case 'success': return 'success';
            case 'error': return 'danger';
            case 'warning': return 'warning';
            case 'info':
            default:
                return 'primary';
        }
    }

    initializeEventListeners() {
        const logoutButton = document.querySelector('#logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        const pageId = document.body.id;
        switch (pageId) {
            case 'page-dashboard':
                this.initializeDashboard();
                break;
            case 'page-inventory':
                this.initializeInventory();
                break;
            case 'page-products':
                // this.initializeCatalog(); // Ya se llama en init
                break;
            case 'page-checkout':
                // this.initializeCheckout(); // Ya se llama en init
                break;
            case 'page-payment':
                // this.initializePayment(); // Ya se llama en init
                break;
        }
    }

    setInventorySearch(searchTerm) {
        this.inventoryFilters.search = searchTerm.toLowerCase();
        this.applyInventoryFilters();
    }

    setInventoryStockFilter(filter) {
        this.inventoryFilters.stock = filter;
        this.applyInventoryFilters();
    }

    setInventorySort(sort) {
        this.inventoryFilters.sort = sort;
        this.applyInventoryFilters();
    }

    matchesStockFilter(product) {
        const { stock } = this.inventoryFilters;
        if (stock === 'low') return product.stock < 100;
        if (stock === 'medium') return product.stock >= 100 && product.stock <= 500;
        if (stock === 'high') return product.stock > 500;
        return true;
    }

    sortInventoryData(data) {
        const sorted = [...data];
        switch (this.inventoryFilters.sort) {
            case 'stockDesc': return sorted.sort((a, b) => b.stock - a.stock);
            case 'stockAsc': return sorted.sort((a, b) => a.stock - b.stock);
            case 'priceDesc': return sorted.sort((a, b) => b.price - a.price);
            case 'priceAsc': return sorted.sort((a, b) => a.price - b.price);
            case 'name':
            default:
                return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        }
    }

    applyInventoryFilters() {
        if (!this.inventoryData) return;
        const searchTerm = this.inventoryFilters.search;
        let filtered = this.inventoryData.filter(product => {
            const matchesSearch = !searchTerm ||
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm);
            const matchesStock = this.matchesStockFilter(product);
            return matchesSearch && matchesStock;
        });

        filtered = this.sortInventoryData(filtered);
        this.filteredInventory = filtered;
        this.renderInventoryTable(filtered);
        this.updateInventoryStats();

        const summary = document.querySelector('#inventoryResultsSummary');
        if (summary) {
            summary.textContent = `Mostrando ${filtered.length} de ${this.inventoryData.length} productos`;
        }
    }

    updateInventoryStats() {
        const totalProductsEl = document.querySelector('#inventoryTotalProducts');
        const lowStockEl = document.querySelector('#inventoryLowStock');
        const inventoryValueEl = document.querySelector('#inventoryValue');

        if (!totalProductsEl || !lowStockEl || !inventoryValueEl) return;

        const totalProducts = this.inventoryData.length;
        const lowStockProducts = this.inventoryData.filter(product => product.stock < 100).length;
        const totalValue = this.inventoryData.reduce((total, product) => total + (product.stock * Number(product.price)), 0);

        totalProductsEl.textContent = totalProducts;
        lowStockEl.textContent = lowStockProducts;
        inventoryValueEl.textContent = this.formatCurrency(totalValue);
    }

    exportInventory() {
        if (!this.filteredInventory.length) {
            this.showNotification('No hay datos para exportar', 'warning');
            return;
        }

        const rows = [['Producto', 'Categoría', 'Stock', 'Precio', 'Última actualización']];
        this.filteredInventory.forEach(p => {
            rows.push([p.name, p.category, p.stock, p.price, p.lastUpdate]);
        });

        const csvContent = rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "inventario.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showNotification('Inventario exportado', 'success');
    }

    viewProduct(id) {
        const product = this.inventoryData.find(item => item.id === id);
        if (!product) return;

        const modalHTML = `
            <div class="modal fade" id="productDetailModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header"><h5 class="modal-title">Detalles del Producto</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                        <div class="modal-body">
                            <div class="text-center mb-3"><img src="${product.image}" alt="${product.name}" class="img-fluid rounded" style="max-width: 180px;"></div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between"><span>Producto:</span><strong>${product.name}</strong></li>
                                <li class="list-group-item d-flex justify-content-between"><span>Categoría:</span><strong>${product.category}</strong></li>
                                <li class="list-group-item d-flex justify-content-between"><span>Stock:</span><strong>${product.stock} unidades</strong></li>
                                <li class="list-group-item d-flex justify-content-between"><span>Precio:</span><strong>${this.formatCurrency(product.price)}</strong></li>
                                <li class="list-group-item d-flex justify-content-between"><span>Actualizado:</span><strong>${this.formatDate(product.lastUpdate)}</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`;
        
        const existingModal = document.getElementById('productDetailModal');
        if(existingModal) existingModal.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
        modal.show();
        document.getElementById('productDetailModal').addEventListener('hidden.bs.modal', e => e.target.remove());
    }

    showProductModal(product = null) {
        const modalId = 'productFormModal';
        const isEdit = product !== null;
        const title = isEdit ? 'Editar Producto' : 'Agregar Producto';

        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="productForm">
                    <input type="hidden" name="id" value="${isEdit ? product.id : ''}">
                    <div class="mb-3">
                        <label for="productName" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="productName" name="name" value="${isEdit ? product.name : ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="productCategory" class="form-label">Categoría</label>
                        <input type="text" class="form-control" id="productCategory" name="category" value="${isEdit ? product.category : ''}" required>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="productStock" class="form-label">Stock</label>
                            <input type="number" class="form-control" id="productStock" name="stock" value="${isEdit ? product.stock : '0'}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="productPrice" class="form-label">Precio</label>
                            <input type="number" step="0.01" class="form-control" id="productPrice" name="price" value="${isEdit ? product.price : '0.00'}" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="productImage" class="form-label">URL de Imagen</label>
                        <input type="text" class="form-control" id="productImage" name="image" value="${isEdit ? product.image : 'images/productos/default.jpg'}">
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${isEdit ? 'Guardar Cambios' : 'Agregar Producto'}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>`;

        const existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modalEl = document.getElementById(modalId);
        const modal = new bootstrap.Modal(modalEl);

        modalEl.querySelector('#productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            if (isEdit) {
                this.updateProduct(product.id, data);
            } else {
                this.addProduct(data);
            }
            modal.hide();
        });
        
        modal.show();
        modalEl.addEventListener('hidden.bs.modal', e => e.target.remove());
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    getMonthName(monthIndex) {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[monthIndex];
    }

    getOrderBadgeClass(status) {
        switch (status) {
            case 'paid':
            case 'completado':
                return 'bg-success';
            case 'pending':
            case 'pendiente':
                return 'bg-warning text-dark';
            case 'cancelled':
            case 'cancelado':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    capitalize(str) {
        if (typeof str !== 'string' || !str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.aceroJJ = new AceroJJ();
});