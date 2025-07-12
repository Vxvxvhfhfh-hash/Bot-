// Configuration Socket.IO
const socket = io();

// Variables globales
let isWhatsAppConnected = false;
let messageLogs = [];
let currentImageUrl = null;

// Éléments DOM
const elements = {
    // Status
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('status-text'),
    
    // WhatsApp Connection
    connectBtn: document.getElementById('connect-btn'),
    qrSection: document.getElementById('qr-section'),
    qrCode: document.getElementById('qr-code'),
    connectionStatus: document.getElementById('connection-status'),
    
    // Message Form
    phoneNumber: document.getElementById('phone-number'),
    messagePrompt: document.getElementById('message-prompt'),
    aiContext: document.getElementById('ai-context'),
    includeImage: document.getElementById('include-image'),
    imageOptions: document.getElementById('image-options'),
    imageCategory: document.getElementById('image-category'),
    generateBtn: document.getElementById('generate-btn'),
    sendBtn: document.getElementById('send-btn'),
    
    // Generated Message
    generatedMessage: document.getElementById('generated-message'),
    aiMessage: document.getElementById('ai-message'),
    editMessage: document.getElementById('edit-message'),
    
    // Image Preview
    imagePreview: document.getElementById('image-preview'),
    previewImage: document.getElementById('preview-image'),
    analyzeImage: document.getElementById('analyze-image'),
    
    // Logs
    messageLogs: document.getElementById('message-logs'),
    clearLogs: document.getElementById('clear-logs'),
    
    // Notifications
    notifications: document.getElementById('notifications')
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkServerStatus();
});

// Initialisation de l'application
function initializeApp() {
    // Masquer les options d'image par défaut
    elements.imageOptions.style.display = 'none';
    
    // Charger les logs depuis le localStorage
    loadMessageLogs();
    
    // Vérifier le statut de connexion
    updateConnectionStatus(false);
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // WhatsApp Connection
    elements.connectBtn.addEventListener('click', handleConnectWhatsApp);
    
    // Message Form
    elements.includeImage.addEventListener('change', handleImageToggle);
    elements.generateBtn.addEventListener('click', handleGenerateMessage);
    elements.sendBtn.addEventListener('click', handleSendMessage);
    elements.editMessage.addEventListener('click', handleEditMessage);
    
    // Image Preview
    elements.previewImage.addEventListener('click', handlePreviewImage);
    elements.analyzeImage.addEventListener('click', handleAnalyzeImage);
    
    // Logs
    elements.clearLogs.addEventListener('click', handleClearLogs);
    
    // Form validation
    elements.phoneNumber.addEventListener('input', validateForm);
    elements.messagePrompt.addEventListener('input', validateForm);
}

// Socket.IO Event Listeners
socket.on('connect', () => {
    showNotification('Connexion établie avec le serveur', 'success');
    elements.statusDot.className = 'status-dot online';
    elements.statusText.textContent = 'Connecté';
});

socket.on('disconnect', () => {
    showNotification('Connexion perdue avec le serveur', 'error');
    elements.statusDot.className = 'status-dot offline';
    elements.statusText.textContent = 'Déconnecté';
});

socket.on('qr-code', (data) => {
    elements.qrCode.innerHTML = `<img src="${data.qrCode}" alt="QR Code WhatsApp">`;
    elements.qrSection.classList.remove('hidden');
    elements.connectBtn.textContent = 'Connexion en cours...';
    elements.connectBtn.disabled = true;
});

socket.on('whatsapp-ready', () => {
    isWhatsAppConnected = true;
    updateConnectionStatus(true);
    elements.qrSection.classList.add('hidden');
    elements.connectBtn.textContent = 'WhatsApp Connecté';
    elements.connectBtn.disabled = true;
    elements.connectBtn.style.background = '#28a745';
    showNotification('WhatsApp connecté avec succès!', 'success');
});

socket.on('whatsapp-authenticated', () => {
    showNotification('WhatsApp authentifié', 'info');
});

socket.on('auth-failure', (msg) => {
    showNotification(`Échec de l'authentification: ${msg}`, 'error');
    resetConnection();
});

socket.on('whatsapp-disconnected', (reason) => {
    showNotification(`WhatsApp déconnecté: ${reason}`, 'warning');
    resetConnection();
});

socket.on('message-sent', (data) => {
    if (data.success) {
        showNotification('Message envoyé avec succès!', 'success');
        addMessageToLog();
        resetForm();
    } else {
        showNotification(`Erreur d'envoi: ${data.error}`, 'error');
    }
});

socket.on('message-received', (data) => {
    showNotification(`Message reçu de ${data.from}`, 'info');
    console.log('Message reçu:', data);
});

socket.on('error', (error) => {
    showNotification(`Erreur: ${error}`, 'error');
});

// Fonctions de gestion d'événements
function handleConnectWhatsApp() {
    if (!isWhatsAppConnected) {
        elements.connectBtn.textContent = 'Initialisation...';
        elements.connectBtn.disabled = true;
        socket.emit('start-whatsapp');
    }
}

function handleImageToggle() {
    const isChecked = elements.includeImage.checked;
    elements.imageOptions.style.display = isChecked ? 'block' : 'none';
    
    if (isChecked) {
        handlePreviewImage();
    } else {
        elements.imagePreview.innerHTML = '<p>Aucune image sélectionnée</p>';
        currentImageUrl = null;
    }
}

async function handleGenerateMessage() {
    const prompt = elements.messagePrompt.value.trim();
    const context = elements.aiContext.value.trim();
    
    if (!prompt) {
        showNotification('Veuillez entrer une demande pour l\'IA', 'warning');
        return;
    }
    
    try {
        elements.generateBtn.classList.add('loading');
        elements.generateBtn.disabled = true;
        
        const response = await fetch('/api/generate-ai-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, context })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            elements.aiMessage.textContent = data.message;
            elements.generatedMessage.classList.remove('hidden');
            elements.sendBtn.disabled = false;
            showNotification('Message IA généré avec succès!', 'success');
        } else {
            showNotification(`Erreur: ${data.error}`, 'error');
        }
    } catch (error) {
        showNotification('Erreur de génération IA', 'error');
        console.error('Erreur génération IA:', error);
    } finally {
        elements.generateBtn.classList.remove('loading');
        elements.generateBtn.disabled = false;
    }
}

function handleSendMessage() {
    const phoneNumber = elements.phoneNumber.value.trim();
    const message = elements.aiMessage.textContent || elements.messagePrompt.value.trim();
    const includeImage = elements.includeImage.checked;
    
    if (!phoneNumber || !message) {
        showNotification('Veuillez remplir tous les champs requis', 'warning');
        return;
    }
    
    if (!isWhatsAppConnected) {
        showNotification('WhatsApp n\'est pas connecté', 'error');
        return;
    }
    
    socket.emit('send-message', {
        number: phoneNumber,
        message,
        includeImage
    });
    
    elements.sendBtn.disabled = true;
    elements.sendBtn.classList.add('loading');
}

function handleEditMessage() {
    const currentMessage = elements.aiMessage.textContent;
    const newMessage = prompt('Modifier le message:', currentMessage);
    
    if (newMessage !== null && newMessage.trim() !== '') {
        elements.aiMessage.textContent = newMessage.trim();
        showNotification('Message modifié', 'info');
    }
}

async function handlePreviewImage() {
    const category = elements.imageCategory.value;
    
    try {
        elements.previewImage.classList.add('loading');
        
        const response = await fetch(`/api/random-image?category=${category}`);
        const data = await response.json();
        
        if (response.ok) {
            currentImageUrl = data.imageUrl;
            elements.imagePreview.innerHTML = `<img src="${currentImageUrl}" alt="Image preview">`;
            showNotification('Image chargée', 'success');
        } else {
            showNotification(`Erreur: ${data.error}`, 'error');
        }
    } catch (error) {
        showNotification('Erreur de chargement d\'image', 'error');
        console.error('Erreur image:', error);
    } finally {
        elements.previewImage.classList.remove('loading');
    }
}

async function handleAnalyzeImage() {
    if (!currentImageUrl) {
        showNotification('Aucune image à analyser', 'warning');
        return;
    }
    
    try {
        elements.analyzeImage.classList.add('loading');
        
        const response = await fetch('/api/analyze-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl: currentImageUrl })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            elements.aiMessage.textContent = data.analysis;
            elements.generatedMessage.classList.remove('hidden');
            elements.sendBtn.disabled = false;
            showNotification('Image analysée par l\'IA!', 'success');
        } else {
            showNotification(`Erreur: ${data.error}`, 'error');
        }
    } catch (error) {
        showNotification('Erreur d\'analyse d\'image', 'error');
        console.error('Erreur analyse:', error);
    } finally {
        elements.analyzeImage.classList.remove('loading');
    }
}

function handleClearLogs() {
    messageLogs = [];
    localStorage.removeItem('whatsapp-message-logs');
    elements.messageLogs.innerHTML = '<p class="no-messages">Aucun message envoyé</p>';
    showNotification('Historique effacé', 'info');
}

// Fonctions utilitaires
function validateForm() {
    const phoneNumber = elements.phoneNumber.value.trim();
    const hasMessage = elements.messagePrompt.value.trim() || elements.aiMessage.textContent;
    
    const isValid = phoneNumber && hasMessage && isWhatsAppConnected;
    elements.sendBtn.disabled = !isValid;
}

function updateConnectionStatus(connected) {
    isWhatsAppConnected = connected;
    
    if (connected) {
        elements.statusDot.className = 'status-dot online';
        elements.statusText.textContent = 'WhatsApp Connecté';
    } else {
        elements.statusDot.className = 'status-dot offline';
        elements.statusText.textContent = 'WhatsApp Déconnecté';
    }
    
    validateForm();
}

function resetConnection() {
    isWhatsAppConnected = false;
    updateConnectionStatus(false);
    elements.qrSection.classList.add('hidden');
    elements.connectBtn.textContent = 'Connecter WhatsApp';
    elements.connectBtn.disabled = false;
    elements.connectBtn.style.background = '';
}

function resetForm() {
    elements.messagePrompt.value = '';
    elements.aiContext.value = '';
    elements.generatedMessage.classList.add('hidden');
    elements.sendBtn.disabled = true;
    elements.sendBtn.classList.remove('loading');
    
    if (elements.includeImage.checked) {
        handlePreviewImage();
    }
}

function addMessageToLog() {
    const logEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        phoneNumber: elements.phoneNumber.value,
        message: elements.aiMessage.textContent || elements.messagePrompt.value,
        includeImage: elements.includeImage.checked,
        imageCategory: elements.includeImage.checked ? elements.imageCategory.value : null
    };
    
    messageLogs.unshift(logEntry);
    
    // Garder seulement les 50 derniers messages
    if (messageLogs.length > 50) {
        messageLogs = messageLogs.slice(0, 50);
    }
    
    saveMessageLogs();
    updateMessageLogsDisplay();
}

function saveMessageLogs() {
    localStorage.setItem('whatsapp-message-logs', JSON.stringify(messageLogs));
}

function loadMessageLogs() {
    const saved = localStorage.getItem('whatsapp-message-logs');
    if (saved) {
        messageLogs = JSON.parse(saved);
        updateMessageLogsDisplay();
    }
}

function updateMessageLogsDisplay() {
    if (messageLogs.length === 0) {
        elements.messageLogs.innerHTML = '<p class="no-messages">Aucun message envoyé</p>';
        return;
    }
    
    const logsHtml = messageLogs.map((log, index) => `
        <div class="message-log-item">
            <div class="message-log-header">
                <span class="message-log-number">${log.phoneNumber}</span>
                <span class="message-log-time">${log.timestamp}</span>
            </div>
            <div class="message-log-content">
                ${log.message}
                ${log.includeImage ? `<br><small><i class="fas fa-image"></i> Image: ${log.imageCategory}</small>` : ''}
            </div>
        </div>
    `).join('');
    
    elements.messageLogs.innerHTML = logsHtml;
}

async function checkServerStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        if (data.whatsapp) {
            updateConnectionStatus(true);
            elements.connectBtn.textContent = 'WhatsApp Connecté';
            elements.connectBtn.disabled = true;
            elements.connectBtn.style.background = '#28a745';
        }
    } catch (error) {
        console.error('Erreur vérification statut:', error);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    elements.notifications.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Permettre de fermer en cliquant
    notification.addEventListener('click', () => {
        notification.remove();
    });
}

// Formatage du numéro de téléphone
elements.phoneNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 2) {
            value = value;
        } else if (value.length <= 4) {
            value = value.substring(0, 2) + ' ' + value.substring(2);
        } else if (value.length <= 6) {
            value = value.substring(0, 2) + ' ' + value.substring(2, 4) + ' ' + value.substring(4);
        } else if (value.length <= 8) {
            value = value.substring(0, 2) + ' ' + value.substring(2, 4) + ' ' + value.substring(4, 6) + ' ' + value.substring(6);
        } else {
            value = value.substring(0, 2) + ' ' + value.substring(2, 4) + ' ' + value.substring(4, 6) + ' ' + value.substring(6, 8) + ' ' + value.substring(8, 10);
        }
    }
    
    e.target.value = value;
});

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
    // Ctrl + Enter pour envoyer
    if (e.ctrlKey && e.key === 'Enter') {
        if (!elements.sendBtn.disabled) {
            handleSendMessage();
        }
    }
    
    // Ctrl + G pour générer avec IA
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        handleGenerateMessage();
    }
});

// Gestion de la visibilité de la page
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        checkServerStatus();
    }
});