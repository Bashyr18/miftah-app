/* Pictures of the guide itself, for the README: its cover, and a walkthrough in progress, in the day theme.
     python -m http.server 5192 --directory docs/guide     (any static server on the guide folder)
     node tools/cdp.js tools/guide-preview.js build/preview
   then tools/readme_images.py frames them as docs/screens/guide.webp. */
module.exports = async (p) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  await p.size(1440, 900, 1.25);
  await p.send('Page.navigate', { url: (process.env.GUIDE_URL || 'http://localhost:5192/') });
  await wait(2500);
  await p.eval(`localStorage.setItem('miftah-guide-theme','light');localStorage.setItem('miftah-guide-lang','en');location.reload();1`);
  await wait(3000);
  await p.eval(`document.querySelectorAll('.rv').forEach(function(e){e.classList.add('in')});1`); await wait(1200);
  await p.shot('guide-cover');
  await p.eval(`(function(){document.documentElement.style.scrollBehavior='auto';var s=document.querySelector('#ch-day .spread');scrollTo(0,s.getBoundingClientRect().top+scrollY-84);s.querySelector('.walk').click();return 1})()`);
  await wait(4200);
  await p.shot('guide-walk');
};
