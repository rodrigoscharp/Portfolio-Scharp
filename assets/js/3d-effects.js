/*
 * 3D Effects for Portfolio - JS Interactivity
 * Handles mouse-based parallax and card tilt effects.
 * Respects prefers-reduced-motion media query.
 */
document.addEventListener("DOMContentLoaded", () => {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Run animations only if the user has not requested reduced motion
  if (!motionQuery.matches) {
    /**
     * Effect 1: Parallax Hero
     * Updates CSS variables based on mouse position over the hero section.
     */
    const hero = document.getElementById("home");
    if (hero) {
      hero.addEventListener(
        "mousemove",
        (e) => {
          const { clientX, clientY } = e;
          const { offsetWidth, offsetHeight } = hero;
          // Calculate mouse position from -0.5 to 0.5
          const x = clientX / offsetWidth - 0.5;
          const y = clientY / offsetHeight - 0.5;

          // Update CSS variables for the parallax effect
          hero.style.setProperty("--mouse-x", x);
          hero.style.setProperty("--mouse-y", y);
        },
        { passive: true }
      );
    }

    /**
     * Effect 2: 3D Card Tilt
     * Applies a 3D tilt transformation to cards on mouse move.
     */
    const cards = document.querySelectorAll(".portfolio__img");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { width, height } = rect;

        // Calculate rotation values based on mouse position inside the card
        const rotateX = (y / height - 0.5) * -16; // Max rotation 8deg
        const rotateY = (x / width - 0.5) * 16; // Max rotation 8deg

        // Apply a smooth, subtle transform
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
      });

      card.addEventListener("mouseleave", () => {
        // Reset transform when the mouse leaves the card
        card.style.transform =
          "perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      });
    });
  }
});