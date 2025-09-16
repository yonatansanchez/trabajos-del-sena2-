// auth.js
// Este script comprueba si el usuario ha iniciado sesión.
// Si no lo ha hecho, lo redirige a la página de login.
if (sessionStorage.getItem('isAdminAuthenticated') !== 'true') {
    alert('Acceso denegado. Debes iniciar sesión como administrador.');
    window.location.href = 'login.html';
}

// Función para actualizar la visibilidad del botón de cerrar sesión
function updateLogoutButtonVisibility() {
    const logoutNavItem = document.getElementById('logoutNavItem');
    if (logoutNavItem) {
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            logoutNavItem.style.display = 'block'; // Show the button
        } else {
            logoutNavItem.style.display = 'none'; // Hide the button
        }
    }
}

// Llama a la función cuando la página se carga
document.addEventListener('DOMContentLoaded', updateLogoutButtonVisibility);

// Opcional: Si hay un botón de cerrar sesión en login.html que redirige,
// asegúrate de que también limpie la sesión.
// Esto es un ejemplo, la lógica real de logout debería estar en login.html o un script específico de logout.
// document.getElementById('logoutButton').addEventListener('click', function() {
//     sessionStorage.removeItem('isAdminAuthenticated');
//     window.location.href = 'login.html';
// });