// Simple Content Editor - Loads all text elements for easy editing
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';
    
    if (isEditMode) {
        enableEditMode();
    }
    
    // Add edit button if admin key is pressed
    let editKeySequence = [];
    document.addEventListener('keydown', function(e) {
        editKeySequence.push(e.key);
        if (editKeySequence.length > 5) editKeySequence.shift();
        
        if (editKeySequence.join('') === 'edit') {
            toggleEditMode();
        }
    });
});

function enableEditMode() {
    // Make all text elements editable
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span:not([class*="icon"])');
    
    textElements.forEach(element => {
        // Skip buttons and special elements
        if (element.tagName === 'BUTTON' || element.closest('button') || 
            element.closest('.home-btn') || element.closest('nav') ||
            element.hasAttribute('contenteditable')) {
            return;
        }
        
        element.setAttribute('contenteditable', 'true');
        element.style.outline = '2px dashed #f1cdaf';
        element.style.padding = '2px';
        element.style.minHeight = '20px';
        element.style.cursor = 'text';
        
        // Add hover effect
        element.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#fff9f0';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // Add save button
    addSaveButton();
}

function toggleEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('edit') === 'true') {
        // Disable edit mode
        urlParams.delete('edit');
        window.location.search = urlParams.toString();
    } else {
        // Enable edit mode
        urlParams.set('edit', 'true');
        window.location.search = urlParams.toString();
    }
}

function addSaveButton() {
    // Remove existing save button if any
    const existingBtn = document.getElementById('save-edits-btn');
    if (existingBtn) existingBtn.remove();
    
    // Create save button
    const saveBtn = document.createElement('button');
    saveBtn.id = 'save-edits-btn';
    saveBtn.innerHTML = '💾 Save All Changes';
    saveBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 30px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    saveBtn.onclick = function() {
        saveAllEdits();
    };
    
    document.body.appendChild(saveBtn);
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.innerHTML = `
        <div style="position:fixed; top:20px; left:20px; background:white; padding:15px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.1); z-index:10000; max-width:300px;">
            <h3 style="margin:0 0 10px 0; color:#4c403b;">✏️ Edit Mode</h3>
            <p style="margin:0 0 10px 0; font-size:14px;">Click any text to edit it.</p>
            <p style="margin:0; font-size:14px;">Press <strong>ESC</strong> to exit edit mode.</p>
            <button onclick="toggleEditMode()" style="margin-top:10px; background:#f1cdaf; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">
                Exit Edit Mode
            </button>
        </div>
    `;
    
    document.body.appendChild(instructions);
    
    // ESC key to exit
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            toggleEditMode();
        }
    });
}

function saveAllEdits() {
    // Collect all edited content
    const allText = {};
    const textElements = document.querySelectorAll('[contenteditable="true"]');
    
    textElements.forEach((element, index) => {
        // Create a simple selector for the element
        let selector = element.tagName.toLowerCase();
        if (element.id) selector += '#' + element.id;
        if (element.className) selector += '.' + element.className.split(' ')[0];
        
        allText[selector + '_' + index] = {
            html: element.innerHTML,
            text: element.textContent,
            selector: generateSelector(element)
        };
    });
    
    // Create download
    const dataStr = JSON.stringify(allText, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'website-edits-' + new Date().toISOString().slice(0,10) + '.json';
    link.click();
    
    alert('All changes saved as JSON file! Send this file to your developer.');
}

function generateSelector(element) {
    if (element.id) return '#' + element.id;
    
    let selector = element.tagName.toLowerCase();
    if (element.className) {
        selector += '.' + element.className.split(' ').join('.');
    }
    
    // Add some context
    const parent = element.parentElement;
    if (parent && parent.tagName !== 'BODY') {
        selector = generateSelector(parent) + ' > ' + selector;
    }
    
    return selector;
}