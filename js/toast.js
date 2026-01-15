// ========================================
// VarnWear - Toast Notification System
// ========================================

function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast if any
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Add styles dynamically
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--white);
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            min-width: 300px;
            border-left: 4px solid var(--gold);
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-icon {
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        .toast-message {
            flex: 1;
            font-weight: 500;
        }
        
        .toast-success {
            border-left-color: #28A745;
        }
        
        .toast-success .toast-icon {
            color: #28A745;
        }
        
        .toast-error {
            border-left-color: #DC3545;
        }
        
        .toast-error .toast-icon {
            color: #DC3545;
        }
        
        .toast-warning {
            border-left-color: #FFC107;
        }
        
        .toast-warning .toast-icon {
            color: #FFC107;
        }
        
        .toast-info {
            border-left-color: var(--gold);
        }
        
        .toast-info .toast-icon {
            color: var(--gold);
        }
        
        @media (max-width: 768px) {
            .toast {
                right: 10px;
                left: 10px;
                min-width: auto;
            }
        }
    `;
    document.head.appendChild(style);
}

// Confirmation modal
function showConfirmModal(title, message, onConfirm, onCancel) {
    // Remove existing modal if any
    const existingModal = document.getElementById('confirm-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <h3 style="margin-bottom: 1rem; color: var(--gold);">${title}</h3>
            <p style="margin-bottom: 2rem; color: var(--gray-dark);">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-outline" id="cancelBtn">Cancel</button>
                <button class="btn btn-primary" id="confirmBtn">Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirmBtn').onclick = () => {
        modal.remove();
        if (onConfirm) onConfirm();
    };
    
    document.getElementById('cancelBtn').onclick = () => {
        modal.remove();
        if (onCancel) onCancel();
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
            if (onCancel) onCancel();
        }
    };
}

// Export functions
if (typeof window !== 'undefined') {
    window.showToast = showToast;
    window.showConfirmModal = showConfirmModal;
}
