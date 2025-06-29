document.addEventListener('DOMContentLoaded', function() {
            // --- Lógica del Menú de Navegación ---
            const menuToggle = document.querySelector('.menu-toggle');
            const mainHeader = document.querySelector('.main-header'); // Aunque no se usa directamente en esta parte, se mantiene.
            const mainNav = document.querySelector('.main-nav');
            const navLinks = document.querySelectorAll('.main-nav a');
            const menuIcon = document.querySelector('.menu-toggle .material-symbols-outlined');
            const headerContainer = document.querySelector('.main-header .container');
            const body = document.body;
            const menuBackdrop = document.querySelector('.menu-backdrop'); // Asegúrate de que este elemento esté en tu HTML

            if (!menuToggle || !mainHeader || !mainNav || !menuIcon || !headerContainer || !body || !menuBackdrop) {
                console.error('Error: Uno o más elementos necesarios para el menú de navegación no fueron encontrados.');
            } else {
                function openMenu() {
                    body.classList.add('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'true');
                    menuIcon.textContent = 'close'; // Cambia el icono a 'close' (la X)
                    // body.style.overflow = 'hidden'; // Ya se maneja con la clase body.menu-open en CSS
                }

                function closeMenu() {
    body.classList.add('menu-closing');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuIcon.textContent = 'menu';

    setTimeout(() => {
        body.classList.remove('menu-open', 'menu-closing');
    }, 300); // ⏱ mismo tiempo que la animación CSS slideOutMenu
}


                function toggleMenu() {
                    if (body.classList.contains('menu-open')) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
                }

                function handleResize() {
                    const desktopBreakpoint = 768; // Mantén este valor en sintonía con tu @media query

                    if (window.innerWidth >= desktopBreakpoint) {
                        // Si estamos en escritorio, asegúrate de que el menú esté cerrado
                        if (body.classList.contains('menu-open')) {
                            closeMenu();
                        }
                    }
                }

                menuToggle.addEventListener('click', toggleMenu);

                navLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault(); // Previene el comportamiento de anclaje por defecto
                        const targetId = this.getAttribute('href'); // Obtiene el ID del elemento de destino (ej. #inicio)
                        const targetElement = document.querySelector(targetId);

                        if (targetElement) {
                            // Desplaza suavemente a la sección
                            targetElement.scrollIntoView({
                                behavior: 'smooth'
                            });
                            // Pequeño retraso para que el scroll inicie antes de cerrar el menú
                            setTimeout(() => {
                                closeMenu(); // Cierra el menú después de iniciar el scroll
                            }, 300);
                        } else {
                            closeMenu(); // Asegura que el menú se cierre incluso si el enlace no es a una sección
                        }
                    });
                });

                menuBackdrop.addEventListener('click', closeMenu); // Cierra el menú al hacer clic en el fondo
                handleResize(); // Ejecuta al cargar para establecer el estado inicial correcto
                window.addEventListener('resize', handleResize); // Escucha cambios de tamaño de ventana
            }

            // --- Lógica del Calculador de Precios ---
            const numDiasSlider = document.getElementById('numDias');
            const diasValueSpan = document.getElementById('diasValue');
            const juegosToggle = document.getElementById('juegosToggle');
            const juegosStatusSpan = document.getElementById('juegosStatus');
            const precioTotalSpan = document.getElementById('precioTotal');
            const horaPaseoCheckboxes = document.querySelectorAll('input[name="horaPaseo"]');
            const comidaCheckboxes = document.querySelectorAll('input[name="comida"]');

            const descuentoInfoLine = document.querySelector('.descuento-info-line');
            const porcentajeDescuentoSpan = document.getElementById('porcentaje-descuento');
            const cantidadAhorradaSpan = document.getElementById('cantidad-ahorrada');

            if (numDiasSlider && diasValueSpan) {
                numDiasSlider.addEventListener('input', function() {
                    diasValueSpan.textContent = this.value + ' día' + (this.value === '1' ? '' : 's');
                    calcularPrecioTotal();
                });
                diasValueSpan.textContent = numDiasSlider.value + ' día' + (numDiasSlider.value === '1' ? '' : 's');
            }

            if (juegosToggle && juegosStatusSpan) {
                juegosToggle.addEventListener('change', function() {
                    juegosStatusSpan.textContent = this.checked ? 'Incluido' : 'No incluido';
                    calcularPrecioTotal();
                });
                juegosStatusSpan.textContent = juegosToggle.checked ? 'Incluido' : 'No incluido';
            }

            horaPaseoCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', calcularPrecioTotal);
            });

            comidaCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', calcularPrecioTotal);
            });

            function calcularPrecioTotal() {
                let precioBasePorDia = 0;
                let numPaseosSeleccionados = 0;
                let numComidasSeleccionadas = 0;
                let ahorroPorPrimeraComida = 0;

                horaPaseoCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        numPaseosSeleccionados++;
                    }
                });

                comidaCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        numComidasSeleccionadas++;
                    }
                });

                // Precios por paseos
                if (numPaseosSeleccionados > 0) {
                    precioBasePorDia += 3; // Primer paseo
                    if (numPaseosSeleccionados > 1) {
                        precioBasePorDia += (numPaseosSeleccionados - 1) * 2; // Paseos adicionales
                    }
                }

                // Precio por juegos
                if (juegosToggle.checked) {
                    precioBasePorDia += 5;
                }

                // Precios por comidas y ahorro
                if (numComidasSeleccionadas > 0) {
                    const costoPrimeraComida = 2;
                    const costoBaseSoloServicios = precioBasePorDia;

                    // Si ya hay un costo base por otros servicios que supera el costo de la primera comida,
                    // se considera que la primera comida es "gratis" (ahorro).
                    if (costoBaseSoloServicios >= costoPrimeraComida) {
                        ahorroPorPrimeraComida = costoPrimeraComida;
                    } else {
                        precioBasePorDia += costoPrimeraComida;
                    }

                    if (numComidasSeleccionadas > 1) {
                        precioBasePorDia += (numComidasSeleccionadas - 1) * 2;
                    }
                }

                const numDias = parseInt(numDiasSlider.value);
                let precioAntesDescuento = precioBasePorDia * numDias;

                const descuentoPorDia = 0.02;
                let porcentajeDescuentoDecimal = numDias * descuentoPorDia;

                if (porcentajeDescuentoDecimal > 0.5) { // Límite el descuento al 50%
                    porcentajeDescuentoDecimal = 0.5;
                }

                let precioFinal = precioAntesDescuento * (1 - porcentajeDescuentoDecimal);

                let cantidadAhorrada = (precioAntesDescuento * porcentajeDescuentoDecimal) + (ahorroPorPrimeraComida * numDias);

                if (precioFinal < 0) {
                    precioFinal = 0;
                }

                precioTotalSpan.textContent = precioFinal.toFixed(2) + '€';

                if (porcentajeDescuentoDecimal > 0 || ahorroPorPrimeraComida > 0) {
                    const porcentajeVisible = (porcentajeDescuentoDecimal * 100).toFixed(0);
                    porcentajeDescuentoSpan.textContent = porcentajeVisible;
                    cantidadAhorradaSpan.textContent = cantidadAhorrada.toFixed(2) + '€';

                    if (descuentoInfoLine) {
                        descuentoInfoLine.style.display = 'flex';
                    }
                } else {
                    if (descuentoInfoLine) {
                        descuentoInfoLine.style.display = 'none';
                    }
                }
            }

            calcularPrecioTotal(); // Calcula el precio inicial al cargar la página

            // --- Lógica del Toggle de Contacto ---
            const contactMethodToggle = document.getElementById('contactMethodToggle');
            const contactMethodLabel = document.getElementById('contactMethodLabel');
            const subjectInputDefault = document.querySelector('input[name="_subject"][data-default-subject]');

            if (contactMethodToggle && contactMethodLabel && subjectInputDefault) {
                contactMethodToggle.addEventListener('change', function() {
                    if (this.checked) {
                        contactMethodLabel.textContent = 'Teléfono';
                        // Cambia el valor del input hidden _subject cuando se selecciona teléfono
                        this.value = 'Contacto por Teléfono - Tu Peludo Amigo';
                    } else {
                        contactMethodLabel.textContent = 'Email';
                        // Restaura el valor predeterminado cuando se selecciona email
                        this.value = subjectInputDefault.value;
                    }
                });
                // Establece el estado inicial al cargar la página
                contactMethodLabel.textContent = contactMethodToggle.checked ? 'Teléfono' : 'Email';
                // Asegura que el valor del subject se establezca correctamente al inicio
                contactMethodToggle.value = contactMethodToggle.checked ? 'Contacto por Teléfono - Tu Peludo Amigo' : subjectInputDefault.value;
            }

            // --- Lógica: Ventana de "Enviando" y Envío con Fetch API ---
            const contactForm = document.getElementById('contactFormElement');
            const submitButton = document.querySelector('.btn-submit');
            const loadingOverlay = document.getElementById('loading-overlay');
            const loadingDots = document.getElementById('loading-dots');
            let dotInterval;

            if (contactForm && submitButton && loadingOverlay && loadingDots) {
                submitButton.addEventListener('click', function(event) {
                    event.preventDefault(); // Previene el envío por defecto del formulario

                    // Validar el formulario antes de mostrar el overlay
                    if (!contactForm.checkValidity()) {
                        contactForm.reportValidity(); // Muestra los mensajes de error del navegador
                        return; // Detiene la función si el formulario no es válido
                    }

                    loadingOverlay.style.display = 'flex'; // Muestra el overlay de carga

                    let dots = '.';
                    dotInterval = setInterval(() => {
                        dots += '.';
                        if (dots.length > 4) { // Limita los puntos a 3 (es decir, ., .., ...)
                            dots = '.';
                        }
                        loadingDots.textContent = dots;
                    }, 300);

                    const formAction = contactForm.action;
                    const formData = new FormData(contactForm);

                    // Verifica y ajusta el campo _subject basado en el toggle
                    const isPhoneContact = document.getElementById('contactMethodToggle').checked;
                    if (isPhoneContact) {
                        formData.set('_subject', 'Contacto por Teléfono - Tu Peludo Amigo');
                    } else {
                        formData.set('_subject', subjectInputDefault.value);
                    }

                    const urlEncodedData = new URLSearchParams(formData).toString();

                    fetch(formAction, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: urlEncodedData
                    })
                    .then(response => {
                        if (response.ok || response.redirected) {
                            console.log('Formulario enviado a Formsubmit.co. Redirigiendo...');
                            const nextUrlInput = contactForm.querySelector('input[name="_next"]');
                            const nextUrl = nextUrlInput ? nextUrlInput.value : 'gracias.html';

                            clearInterval(dotInterval); // Detiene la animación de los puntos
                            loadingOverlay.style.display = 'none'; // Oculta el overlay

                            window.location.href = nextUrl; // Redirige a la página de agradecimiento
                        } else {
                            console.error('Error al enviar el formulario a Formsubmit.co:', response.status, response.statusText);
                            clearInterval(dotInterval);
                            loadingOverlay.style.display = 'none';
                            alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo. Código: ' + response.status);
                        }
                    })
                    .catch(error => {
                        console.error('Error de red al enviar el formulario:', error);
                        clearInterval(dotInterval);
                        loadingOverlay.style.display = 'none';
                        alert('Hubo un problema de conexión. Por favor, verifica tu internet o inténtalo más tarde.');
                    });
                });
            } else {
                console.error('Error: No se encontró el formulario de contacto o sus elementos. Asegúrate de que el ID "contactFormElement" esté correctamente asignado y los elementos del formulario existan.');
            }
        });