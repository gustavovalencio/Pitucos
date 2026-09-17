const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
window.matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);

// Keep the same photograph crops when opening the accessible gallery.
const gallery = document.createElement('dialog');
gallery.className = 'gallery';
gallery.setAttribute('aria-label', 'Galeria de fotos do Pitucos');
gallery.innerHTML = '<button class="gallery-close" aria-label="Fechar galeria">Fechar ×</button><div class="gallery-stage"></div><p class="gallery-caption"></p><div class="gallery-navigation"><button class="gallery-prev" aria-label="Foto anterior">← Anterior</button><span class="gallery-count" aria-live="polite"></span><button class="gallery-next" aria-label="Próxima foto">Próxima →</button></div>';
document.body.append(gallery);
const photos = [...document.querySelectorAll('main .photo')];
let photoIndex = 0;
let lastTrigger;
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const photo = photos[photoIndex];
  const enlarged = photo.cloneNode(true);
  enlarged.querySelector('img').loading = 'eager';
  gallery.querySelector('.gallery-stage').replaceChildren(enlarged);
  gallery.querySelector('.gallery-caption').textContent = photo.querySelector('img').alt;
  gallery.querySelector('.gallery-count').textContent = `${photoIndex + 1} / ${photos.length}`;
}
photos.forEach((photo, index) => {
  const trigger = document.createElement('button');
  trigger.className = 'image-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', `Ampliar foto: ${photo.querySelector('img').alt}`);
  trigger.setAttribute('aria-haspopup', 'dialog');
  photo.before(trigger);
  trigger.append(photo);
  trigger.addEventListener('click', () => {
    lastTrigger = trigger;
    showPhoto(index);
    gallery.showModal();
    document.body.classList.add('gallery-open');
    gallery.querySelector('.gallery-close').focus();
  });
});
gallery.querySelector('.gallery-close').addEventListener('click', () => gallery.close());
gallery.querySelector('.gallery-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
gallery.querySelector('.gallery-next').addEventListener('click', () => showPhoto(photoIndex + 1));
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(photoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});
gallery.addEventListener('click', event => { if (event.target === gallery) gallery.close(); });
gallery.addEventListener('close', () => {
  document.body.classList.remove('gallery-open');
  lastTrigger?.focus({ preventScroll: true });
});
