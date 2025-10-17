/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}


/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName('skills__content'),
    skillsHeader = document.querySelectorAll(".skills__header")

function toggleSkills() {
    let itemClass = this.parentNode.className

    for (i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = 'skills__content skills__close'
    }
    if (itemClass === 'skills__content skills__close') {
        this.parentNode.className = 'skills__content skills__open'
    }
}

skillsHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills)
})

/*==================== QUALIFICATION TABS ====================*/
const tabs = document.querySelectorAll('[data-target]'),
    tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach(tabContent => {
            tabContent.classList.remove('qualification__active')
        })
        target.classList.add('qualification__active')

        // remove active class from all tabs and add to current
        tabs.forEach(t => t.classList.remove('qualification__active'))
        tab.classList.add('qualification__active')
    })
})

// keyboard accessibility for qualification tabs (left/right/enter/space)
tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab')
    tab.setAttribute('tabindex', index === 0 ? '0' : '-1')
    tab.addEventListener('keydown', (e) => {
        const key = e.key
        if (key === 'ArrowRight') {
            const next = tabs[(index + 1) % tabs.length]
            next.focus(); next.click()
        } else if (key === 'ArrowLeft') {
            const prev = tabs[(index - 1 + tabs.length) % tabs.length]
            prev.focus(); prev.click()
        } else if (key === 'Enter' || key === ' ') {
            e.preventDefault(); tab.click()
        }
    })
})

/*==================== SERVICES MODAL (accessible) ====================*/
const modalViews = document.querySelectorAll('.services__modal')
const modalBtns = document.querySelectorAll('.services__button')
const modalCloseBtns = document.querySelectorAll('.services__modal-close')

function openModal(modalEl) {
    if (!modalEl) return
    modalEl.classList.add('active-modal')
    modalEl.setAttribute('aria-hidden', 'false')
    // focus first focusable element
    const focusable = modalEl.querySelector('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])')
    if (focusable) focusable.focus()
    trapFocus(modalEl)
}

function closeModal(modalEl) {
    if (!modalEl) return
    // start closing animation by removing active class
    modalEl.classList.remove('active-modal')
    // wait for animation/transition to finish before hiding for screen readers
    const onEnd = () => {
        modalEl.setAttribute('aria-hidden', 'true')
        modalEl.removeEventListener('transitionend', onEnd)
        releaseFocus()
    }
    // If no transition detected, fallback after short timeout
    let called = false
    modalEl.addEventListener('transitionend', function te(e) {
        if (e.target === modalEl.querySelector('.services__modal-content')) {
            if (!called) { called = true; onEnd() }
        }
    })
    setTimeout(() => { if (!called) onEnd() }, 350)
}

modalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('aria-controls')
        const modalEl = targetId ? document.getElementById(targetId) : btn.closest('.services__content')?.querySelector('.services__modal')
        openModal(modalEl)
    })
})

modalCloseBtns.forEach((b) => b.addEventListener('click', (e) => {
    const modalEl = b.closest('.services__modal')
    closeModal(modalEl)
}))

// close modal on overlay click
modalViews.forEach(m => {
    m.addEventListener('click', (e) => {
        if (e.target === m) closeModal(m)
    })
})

// close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalViews.forEach(m => {
            if (m.classList.contains('active-modal')) closeModal(m)
        })
    }
})

// Simple focus trap implementation
let lastFocusedBeforeModal = null
let trapListener = null
function trapFocus(modalEl) {
    lastFocusedBeforeModal = document.activeElement
    const focusable = Array.from(modalEl.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])')).filter(Boolean)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    trapListener = function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus()
            }
        }
    }
    document.addEventListener('keydown', trapListener)
}

function releaseFocus() {
    if (trapListener) document.removeEventListener('keydown', trapListener)
    if (lastFocusedBeforeModal) lastFocusedBeforeModal.focus()
}

/*==================== PORTFOLIO SWIPER  ====================*/
let swiperP = new Swiper('.portfolio__container', {
    cssMode: true,
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

/*==================== TESTIMONIAL ====================*/
let swiperT = new Swiper('.testimonial__container', {
    loop: true,
    grabCursor: true,
    spaceBetween: 48,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        568: {
            slidesPerView: 2,
        }
    }
});

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)
/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const nav = document.getElementById('header')
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if (this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    // selectedIcon stores the icon name from getCurrentIcon()
    if (selectedIcon) {
        if (selectedIcon === 'uil-moon') themeButton.classList.add(iconTheme)
        else themeButton.classList.remove(iconTheme)
    }
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== REVEAL ON SCROLL & SKILL ANIMATIONS ====================*/
// add .reveal to elements we want to animate in HTML by default
const revealElements = document.querySelectorAll('.section, .home__data, .about__data, .services__content, .portfolio__content, .testimonial__content, .contact__container')

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active')
            entry.target.classList.add('reveal')
            // if it's skills section, animate individual skill bars
            if (entry.target.classList.contains('skills') || entry.target.querySelectorAll) {
                const skills = entry.target.querySelectorAll('.skills__percentage')
                skills.forEach(s => {
                    const parent = s.closest('[class*="skills__"]')
                    // read width from CSS custom property on the corresponding classname
                    const classes = Array.from(s.classList)
                    let w = null
                    classes.forEach(cn => {
                        if (cn.startsWith('skills__') && cn !== 'skills__percentage') {
                            try {
                                const el = document.querySelector('.' + cn)
                                const val = getComputedStyle(el).getPropertyValue('--w')
                                if (val) w = val.trim()
                            } catch (e) { }
                        }
                    })
                    if (!w) {
                        // fallback: read data-width attribute
                        w = s.dataset.width || '60%'
                    }
                    // apply width after short delay for stagger
                    setTimeout(() => { s.style.width = w }, 200)
                })
            }
            revealObserver.unobserve(entry.target)
        }
    })
}, { threshold: 0.12 })

revealElements.forEach(el => {
    el.classList.add('reveal')
    revealObserver.observe(el)
})

/* Animate blob image if present */
const blob = document.querySelector('.home__blob')
if (blob) blob.classList.add('home__blob-animate')

/* Simple contact form handler */
const contactForm = document.querySelector('.contact__form')
if (contactForm) {
    const nameEl = document.getElementById('contact-name')
    const emailEl = document.getElementById('contact-email')
    const msgEl = document.getElementById('contact-message')
    const errName = document.getElementById('error-name')
    const errEmail = document.getElementById('error-email')
    const errMsg = document.getElementById('error-message')
    const toast = document.getElementById('contact-toast')

    function validate() {
        let ok = true
        // name
        if (!nameEl.value.trim()) { errName.textContent = 'Please enter your name'; ok = false } else { errName.textContent = '' }
        // email
        const emailVal = emailEl.value.trim()
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailVal) { errEmail.textContent = 'Please enter your email'; ok = false }
        else if (!emailRe.test(emailVal)) { errEmail.textContent = 'Enter a valid email'; ok = false } else { errEmail.textContent = '' }
        // message
        if (!msgEl.value.trim() || msgEl.value.trim().length < 10) { errMsg.textContent = 'Please enter a message (min 10 chars)'; ok = false } else { errMsg.textContent = '' }
        return ok
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!validate()) return
        const btn = contactForm.querySelector('.contact__send')
        if (!btn) return
        const original = btn.innerHTML
        btn.disabled = true
        btn.innerHTML = 'Sending...'
        // fake a send delay
        setTimeout(() => {
            btn.innerHTML = 'Sent ✔'
            btn.classList.add('button--sent')
            // show toast
            if (toast) { toast.textContent = 'Message sent — I will reply soon!'; toast.classList.add('show') }
            setTimeout(() => {
                if (toast) toast.classList.remove('show')
                btn.disabled = false
                btn.innerHTML = original
                btn.classList.remove('button--sent')
                contactForm.reset()
            }, 2000)
        }, 900)
    })
}