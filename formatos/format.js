// Formatos de trabalho — comportamento compartilhado
document.documentElement.classList.add('js');

const LK = 'mfhome_lang';
function setLang(l){
  document.body.classList.remove('lang-pt','lang-en');
  document.body.classList.add('lang-' + l);
  document.documentElement.lang = (l === 'pt') ? 'pt-BR' : 'en';
  document.querySelectorAll('#langToggle button').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  const wa = document.getElementById('waFab');
  if (wa){ wa.href = 'https://wa.me/' + wa.dataset.phone + '?text=' + encodeURIComponent(l === 'en' ? wa.dataset.en : wa.dataset.pt); }
  try { localStorage.setItem(LK, l); } catch(e){}
}
document.querySelectorAll('#langToggle button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
try { setLang(localStorage.getItem(LK) || 'pt'); } catch(e){ setLang('pt'); }

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
