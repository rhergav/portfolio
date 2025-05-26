document.addEventListener("DOMContentLoaded", () => {
  // Inicializar tema
  initTheme()

  // Menú hamburguesa
  initMobileMenu()

  // Animaciones al hacer scroll
  initScrollAnimations()

  // Formulario de contacto
  initContactForm()

  // Actualizar año actual en el footer
  updateCurrentYear()
})

// Actualizar año actual en el footer
function updateCurrentYear() {
  const currentYearElement = document.getElementById("currentYear")
  if (currentYearElement) {
    const currentYear = new Date().getFullYear()
    currentYearElement.textContent = currentYear
  }
}

// Inicializar tema (claro/oscuro)
function initTheme() {
  const themeToggle = document.querySelector(".theme-toggle")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")

  // Comprobar si hay un tema guardado en localStorage
  const currentTheme = localStorage.getItem("theme")

  // Si hay un tema guardado, aplicarlo
  if (currentTheme) {
    document.body.setAttribute("data-theme", currentTheme)
  } else if (prefersDarkScheme.matches) {
    // Si el usuario prefiere el tema oscuro, aplicarlo
    document.body.setAttribute("data-theme", "dark")
    localStorage.setItem("theme", "dark")
  }

  // Cambiar tema al hacer clic en el botón
  themeToggle.addEventListener("click", () => {
    const theme = localStorage.getItem("theme")

    if (theme === "dark") {
      document.body.removeAttribute("data-theme")
      localStorage.setItem("theme", "light")
    } else {
      document.body.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
    }
  })
}

// Inicializar menú móvil
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navLinks.classList.toggle("active")
  })

  // Cerrar menú al hacer clic en un enlace
  const navItems = document.querySelectorAll(".nav-links a")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navLinks.classList.remove("active")
    })
  })
}

// Inicializar animaciones al hacer scroll
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-aos]")

  // Función para comprobar si un elemento está en el viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 && rect.bottom >= 0
  }

  // Función para animar elementos visibles
  function animateOnScroll() {
    animatedElements.forEach((element) => {
      if (isInViewport(element)) {
        element.classList.add("aos-animate")
      }
    })
  }

  // Ejecutar al cargar la página
  animateOnScroll()

  // Ejecutar al hacer scroll
  window.addEventListener("scroll", animateOnScroll)
}

// Inicializar formulario de contacto
function initContactForm() {
  const contactForm = document.getElementById("contactForm")
  const formSuccess = document.getElementById("formSuccess")

  if (!contactForm) return

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Obtener datos del formulario
    const formData = new FormData(contactForm)

    try {
      // Enviar formulario a Formspree
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        // Ocultar formulario
        contactForm.style.display = "none"

        // Mostrar mensaje de éxito
        formSuccess.style.display = "block"

        // Resetear formulario
        contactForm.reset()
      } else {
        throw new Error("Error al enviar el formulario")
      }
    } catch (error) {
      alert("Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.")
      console.error("Error:", error)
    }
  })
}
