
document.addEventListener('DOMContentLoaded', () => {
  const homeImg = document.querySelector('.home__img');

  if (homeImg) {
    homeImg.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = homeImg.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateY = (x / width - 0.5) * 40; // 40 is the rotation factor
      const rotateX = (0.5 - y / height) * 40;

      homeImg.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    homeImg.addEventListener('mouseleave', () => {
      homeImg.style.transform = 'rotateY(0) rotateX(0)';
    });
  }
});
