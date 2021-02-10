function createAnalytics() {
   let counter = 0;
   destroyed = false;

   const listener = () => counter++;

   document.addEventListener('click', listener);

   return {
      destroy() {
         document.removeEventListener('click', listener)
         destroyed = true
      },

      getClicks() {
         if (destroyed) {
            return 'Is destroyed. Total clicks = ' + counter
         }
         return counter
      }
   }
}

window.analytic = createAnalytics();
