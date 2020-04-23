
new WOW().init();// Animations initialization
const elements = document.getElementsByClassName('markdownx');
for (element of elements) {
  element.addEventListener('markdownx.update', event => {
      for (const block of document.querySelectorAll('pre code')) {
          hljs.highlightBlock(block);
      }
  });
}
