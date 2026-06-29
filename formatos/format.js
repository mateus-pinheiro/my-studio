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

// Directional cross-document view transitions (progressive enhancement).
// "Forward" = going deeper (into a format page); "back" = returning home.
(function(){
  function isHome(url){
    try { const p = new URL(url, location.href).pathname; return p === '/' || p.endsWith('/index.html'); }
    catch(e){ return false; }
  }
  function classify(fromUrl, toUrl){
    return (isHome(toUrl) && !isHome(fromUrl)) ? 'back' : 'forward';
  }
  // Leaving this page: tag the outgoing transition with its direction.
  window.addEventListener('pageswap', function(e){
    if (!e.viewTransition || !e.activation) return;
    const from = e.activation.from && e.activation.from.url;
    const to = e.activation.entry && e.activation.entry.url;
    if (from && to) e.viewTransition.types.add(classify(from, to));
  });
  // Arriving on this page: tag direction and keep content visible during the slide.
  window.addEventListener('pagereveal', function(e){
    if (!e.viewTransition) return;
    document.documentElement.classList.add('vt-in');
    const nav = (window.navigation && navigation.activation) || null;
    if (nav && nav.from && nav.entry) e.viewTransition.types.add(classify(nav.from.url, nav.entry.url));
  });
})();
