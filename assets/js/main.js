/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};
showMenu("nav-toggle", "nav-menu");

/*===== REMOVE MENU MOBILE =====*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", scrollActive);

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 58;
    const sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2000,
  delay: 200,
  // reset: true,
});

/*SCROLL HOME*/
sr.reveal(".home__data", {});
sr.reveal(".home__img", { delay: 400, origin: "bottom", distance: "0px" });

/*SCROLL SECTIONS*/
sr.reveal(".section-title", {});
sr.reveal(".glass-card", { interval: 200, origin: "bottom", distance: "100px" });
sr.reveal(".timeline__item", { interval: 200, origin: "left", distance: "50px" });

/*===== 3D TILT EFFECT =====*/
const tiltElements = document.querySelectorAll('.glass-card, .timeline__content, .home__img');

tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateY = (x / width - 0.5) * 15;
    const rotateX = (0.5 - y / height) * 15;

    // Preserve centering translate for home__title
    if (el.classList.contains('home__title')) {
      el.style.transform = `perspective(1000px) translate(-50%, -50%) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    } else {
      el.style.transform = `perspective(1000px) scale(1.02) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    }
  });

  el.addEventListener('mouseleave', () => {
    if (el.classList.contains('home__title')) {
      el.style.transform = `perspective(1000px) translate(-50%, -50%) rotateY(0) rotateX(0)`;
    } else {
      el.style.transform = `perspective(1000px) scale(1) rotateY(0) rotateX(0)`;
    }
  });
});
