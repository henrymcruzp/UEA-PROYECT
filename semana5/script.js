// Galería de Imágenes Interactiva - Semana 5
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const imageUrlInput = document.getElementById('image-url');
    const addBtn = document.getElementById('add-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const deselectBtn = document.getElementById('deselect-btn');
    const clearBtn = document.getElementById('clear-btn');
    const gallery = document.getElementById('gallery');
    const errorMessage = document.getElementById('error-message');
    const totalImagesSpan = document.getElementById('total-images');
    const selectedStatusSpan = document.getElementById('selected-status');
    const exampleLinks = document.querySelectorAll('.example-link');
    
    let selectedImage = null;
    let imageCounter = 0;
    
    // URLs de ejemplo
    const sampleImages = [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=500&h=500&fit=crop'
    ];
    
    // Mostrar mensaje de error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
    
    // Validar URL de imagen
    function isValidImageUrl(url) {
        if (!url) return false;
        
        try {
            // Verificar que sea una URL válida
            new URL(url);
            
            // Verificar extensiones comunes de imágenes
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
            const urlLower = url.toLowerCase();
            
            // Verificar si la URL termina con extensión de imagen
            if (imageExtensions.some(ext => urlLower.includes(ext))) {
                return true;
            }
            
            // Verificar si contiene palabras clave de imágenes
            const imageKeywords = ['image', 'img', 'photo', 'picture', 'unsplash', 'pexels', 'pixabay'];
            if (imageKeywords.some(keyword => urlLower.includes(keyword))) {
                return true;
            }
            
            // Para URLs que no tienen extensión pero son imágenes (como Unsplash)
            // Permitir si pasa la validación básica
            return url.startsWith('http://') || url.startsWith('https://');
            
        } catch (error) {
            return false;
        }
    }
    
    // Agregar imagen a la galería
    function addImage(imageUrl, isSample = false) {
        // Validar URL
        if (!isValidImageUrl(imageUrl)) {
            showError('URL no válida. Usa una URL directa a una imagen (jpg, png, gif, etc.)');
            return false;
        }
        
        // Crear contenedor de imagen
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item new';
        galleryItem.dataset.url = imageUrl;
        
        // Crear elemento de imagen
        const img = document.createElement('img');
        img.className = 'gallery-img';
        img.src = imageUrl;
        img.alt = 'Imagen de la galería';
        img.loading = 'lazy';
        
        // Manejar error de carga
        img.onerror = function() {
            showError('Error al cargar la imagen. Verifica que la URL sea accesible.');
            galleryItem.remove();
            updateStats();
        };
        
        // Manejar carga exitosa
        img.onload = function() {
            galleryItem.classList.remove('new');
        };
        
        // Crear indicador de selección
        const selectionIndicator = document.createElement('div');
        selectionIndicator.className = 'selection-indicator';
        selectionIndicator.innerHTML = '<i class="fas fa-check"></i>';
        
        // Crear número de imagen
        const itemNumber = document.createElement('div');
        itemNumber.className = 'item-number';
        itemNumber.textContent = `#${++imageCounter}`;
        
        // Agregar elementos al contenedor
        galleryItem.appendChild(img);
        galleryItem.appendChild(selectionIndicator);
        galleryItem.appendChild(itemNumber);
        
        // Evento para seleccionar la imagen
        galleryItem.addEventListener('click', function(e) {
            e.stopPropagation();
            selectImage(this);
        });
        
        // Remover estado vacío si existe
        const emptyState = gallery.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Agregar a la galería
        gallery.appendChild(galleryItem);
        
        // Si no es muestra, actualizar input
        if (!isSample) {
            imageUrlInput.value = '';
            imageUrlInput.focus();
        }
        
        // Actualizar estadísticas
        updateStats();
        
        // Seleccionar automáticamente
        setTimeout(() => {
            selectImage(galleryItem);
        }, 100);
        
        return true;
    }
    
    // Seleccionar una imagen
    function selectImage(imageElement) {
        // Si ya está seleccionada, deseleccionar
        if (selectedImage === imageElement) {
            imageElement.classList.remove('selected');
            selectedImage = null;
            deleteBtn.disabled = true;
            selectedStatusSpan.textContent = 'Ninguna';
            return;
        }
        
        // Deseleccionar imagen anterior
        if (selectedImage) {
            selectedImage.classList.remove('selected');
        }
        
        // Seleccionar nueva imagen
        imageElement.classList.add('selected');
        selectedImage = imageElement;
        deleteBtn.disabled = false;
        
        // Actualizar estado
        const imageNumber = imageElement.querySelector('.item-number').textContent;
        selectedStatusSpan.textContent = `Imagen ${imageNumber}`;
    }
    
    // Eliminar imagen seleccionada
    function deleteSelectedImage() {
        if (!selectedImage) return;
        
        // Animación de eliminación
        selectedImage.classList.add('removing');
        
        setTimeout(() => {
            selectedImage.remove();
            selectedImage = null;
            deleteBtn.disabled = true;
            selectedStatusSpan.textContent = 'Ninguna';
            updateStats();
            
            // Mostrar estado vacío si no hay imágenes
            if (gallery.children.length === 0) {
                showEmptyState();
                imageCounter = 0;
            }
        }, 300);
    }
    
    // Limpiar toda la galería
    function clearGallery() {
        const galleryItems = gallery.querySelectorAll('.gallery-item');
        
        if (galleryItems.length === 0) return;
        
        // Confirmar eliminación
        if (!confirm(`¿Eliminar todas las imágenes (${galleryItems.length})?`)) {
            return;
        }
        
        // Animar eliminación
        galleryItems.forEach(item => {
            item.classList.add('removing');
        });
        
        setTimeout(() => {
            gallery.innerHTML = '';
            selectedImage = null;
            deleteBtn.disabled = true;
            imageCounter = 0;
            showEmptyState();
            updateStats();
        }, 500);
    }
    
    // Agregar imágenes de ejemplo
    function addSampleImages() {
        // Deshabilitar botón temporalmente
        const originalText = sampleBtn.innerHTML;
        sampleBtn.disabled = true;
        sampleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        
        // Remover estado vacío
        const emptyState = gallery.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Agregar imágenes con delay
        sampleImages.forEach((url, index) => {
            setTimeout(() => {
                addImage(url, true);
                
                // Restaurar botón después de la última imagen
                if (index === sampleImages.length - 1) {
                    setTimeout(() => {
                        sampleBtn.disabled = false;
                        sampleBtn.innerHTML = originalText;
                    }, 500);
                }
            }, index * 200);
        });
    }
    
    // Deseleccionar imagen actual
    function deselectImage() {
        if (selectedImage) {
            selectedImage.classList.remove('selected');
            selectedImage = null;
            deleteBtn.disabled = true;
            selectedStatusSpan.textContent = 'Ninguna';
        }
    }
    
    // Mostrar estado vacío
    function showEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `
            <i class="fas fa-image"></i>
            <h3>Galería Vacía</h3>
            <p>Agrega tu primera imagen usando una URL de internet</p>
        `;
        gallery.appendChild(emptyDiv);
    }
    
    // Actualizar estadísticas
    function updateStats() {
        const imageCount = gallery.querySelectorAll('.gallery-item').length;
        totalImagesSpan.textContent = imageCount;
    }
    
    // Manejar el evento de agregar imagen
    function handleAddImage() {
        const url = imageUrlInput.value.trim();
        
        if (!url) {
            showError('Por favor, ingresa una URL');
            imageUrlInput.focus();
            return;
        }
        
        if (addImage(url)) {
            // Feedback visual
            addBtn.innerHTML = '<i class="fas fa-check"></i> ¡Agregada!';
            setTimeout(() => {
                addBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar';
            }, 1000);
        }
    }
    
    // Event Listeners
    addBtn.addEventListener('click', handleAddImage);
    
    deleteBtn.addEventListener('click', deleteSelectedImage);
    
    sampleBtn.addEventListener('click', addSampleImages);
    
    deselectBtn.addEventListener('click', deselectImage);
    
    clearBtn.addEventListener('click', clearGallery);
    
    // Agregar imagen con Enter
    imageUrlInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddImage();
        }
    });
    
    // Ejemplos de URLs
    exampleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('data-url');
            imageUrlInput.value = url;
            imageUrlInput.focus();
        });
    });
    
    // Atajos de teclado globales
    document.addEventListener('keydown', function(e) {
        // Solo si no estamos escribiendo en el input
        if (document.activeElement !== imageUrlInput) {
            // Delete - Eliminar imagen seleccionada
            if (e.key === 'Delete' && selectedImage) {
                e.preventDefault();
                deleteSelectedImage();
            }
            
            // Escape - Deseleccionar imagen
            if (e.key === 'Escape' && selectedImage) {
                e.preventDefault();
                deselectImage();
            }
            
            // A - Agregar imagen (focus en input)
            if (e.key === 'a' && e.ctrlKey) {
                e.preventDefault();
                imageUrlInput.focus();
            }
        }
    });
    
    // Click fuera de las imágenes para deseleccionar
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.gallery-item') && selectedImage) {
            deselectImage();
        }
    });
    
    // Inicializar galería vacía
    showEmptyState();
    updateStats();
});