document.addEventListener('DOMContentLoaded', () => {
    // Grab them elements
    const editor = document.getElementById('no-cap-editor');
    const wordCount = document.querySelector('.word-count');
    const autosaveStatus = document.querySelector('.autosave-status');
    const fontDrip = document.querySelector('.font-drip');
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Format buttons no cap
    const boldBtn = document.querySelector('.bold-btn');
    const italicBtn = document.querySelector('.italic-btn');
    const underlineBtn = document.querySelector('.underline-btn');
    const highlightBtn = document.querySelector('.highlight-btn');
    
    // File operation buttons fr fr
    const yeetBtn = document.querySelector('.yeet-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const uploadBtn = document.querySelector('.upload-btn');

    // Load saved text (anti-L system)
    const savedText = localStorage.getItem('bussinText');
    if (savedText) {
        editor.innerHTML = savedText;
        updateWordCount();
    }

    // Autosave that text fr fr
    let autosaveTimeout;
    function autosave() {
        clearTimeout(autosaveTimeout);
        autosaveTimeout = setTimeout(() => {
            localStorage.setItem('bussinText', editor.innerHTML);
            autosaveStatus.textContent = 'Autosaved W';
            autosaveStatus.classList.add('saving');
            setTimeout(() => autosaveStatus.classList.remove('saving'), 1000);
        }, 1000);
    }

    // Word counter goes brr
    function updateWordCount() {
        const text = editor.innerText || editor.textContent;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = `Words: ${words.length}`;
    }

    // Text formatting that go crazy
    function formatText(command, value = null) {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            document.execCommand(command, false, value);
        }
    }

    // Event listeners fr fr
    editor.addEventListener('input', () => {
        autosave();
        updateWordCount();
    });

    // Font drip selector
    fontDrip.addEventListener('change', () => {
        document.execCommand('fontName', false, fontDrip.value);
    });

    // Theme toggle (eye reveal/unreveal)
    themeToggle.addEventListener('click', () => {
        document.body.setAttribute('data-theme', 
            document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
        );
        themeToggle.innerHTML = document.body.getAttribute('data-theme') === 'light' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    });

    // Format buttons event listeners
    boldBtn.addEventListener('click', () => {
        if (window.getSelection().toString().length > 0) {
            formatText('bold');
        }
        boldBtn.classList.toggle('active');
    });

    italicBtn.addEventListener('click', () => {
        if (window.getSelection().toString().length > 0) {
            formatText('italic');
        }
        italicBtn.classList.toggle('active');
    });

    underlineBtn.addEventListener('click', () => {
        if (window.getSelection().toString().length > 0) {
            formatText('underline');
        }
        underlineBtn.classList.toggle('active');
    });

    // Add after other const declarations
    const colorBtns = document.querySelectorAll('.color-btn');
    let currentHighlightColor = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color').trim();

    // Highlight color picker fr fr
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentHighlightColor = btn.dataset.color;
            if (window.getSelection().toString().length > 0) {
                formatText('backColor', currentHighlightColor);
            }
        });
    });

    // Update highlight button click handler
    highlightBtn.addEventListener('click', () => {
        formatText('backColor', currentHighlightColor);
        highlightBtn.classList.toggle('active');
    });

    // Set default highlight color button as active
    document.querySelector('.default-highlight').classList.add('active');

    // File operations fr fr
    yeetBtn.addEventListener('click', () => {
        if (confirm('Fr fr you wanna yeet this text?')) {
            editor.innerHTML = '';
            localStorage.removeItem('bussinText');
            updateWordCount();
        }
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([editor.innerText || editor.textContent], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bussin_text.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                editor.innerHTML = reader.result.replace(/\n/g, '<br>');
                autosave();
                updateWordCount();
            };
            reader.readAsText(file);
        };
        input.click();
    });

    // Initialize word count
    updateWordCount();
});
