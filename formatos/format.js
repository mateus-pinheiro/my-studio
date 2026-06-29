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
(function(){
  function isHome(url){
    try { const p = new URL(url, location.href).pathname; return p === '/' || p.endsWith('/index.html'); }
    catch(e){ return false; }
  }
  // Prefer the history-entry index (robust for both push and traverse);
  // fall back to a home-vs-deeper heuristic when indices aren't available.
  function dirFor(act){
    if (act && act.from && act.entry){
      const fi = act.from.index, ti = act.entry.index;
      if (typeof fi === 'number' && typeof ti === 'number' && fi !== ti) return ti < fi ? 'back' : 'forward';
      if (act.from.url && act.entry.url) return (isHome(act.entry.url) && !isHome(act.from.url)) ? 'back' : 'forward';
    }
    return 'forward';
  }
  window.addEventListener('pageswap', function(e){
    if (e.viewTransition && e.activation) e.viewTransition.types.add(dirFor(e.activation));
  });
  window.addEventListener('pagereveal', function(e){
    if (!e.viewTransition) return;
    document.documentElement.classList.add('vt-in');
    if (window.navigation && navigation.activation) e.viewTransition.types.add(dirFor(navigation.activation));
  });
})();

// Back rail: traverse history instead of loading a fresh page, so we return to
// the exact section/scroll we came from — and reuse bfcache for an instant,
// delay-free reverse transition. Falls back to the href on a direct entry.
(function(){
  const rail = document.querySelector('.back-rail');
  if (!rail || !window.navigation) return;
  rail.addEventListener('click', function(ev){
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    if (!navigation.canGoBack) return;                 // direct load → let the href handle it
    const prev = navigation.entries()[navigation.currentEntry.index - 1];
    if (!prev) return;
    try { if (new URL(prev.url).origin !== location.origin) return; } catch(e){ return; }
    ev.preventDefault();
    navigation.back();
  });
})();
