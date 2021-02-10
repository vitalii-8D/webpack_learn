function createAnalytics() {
   let counter = 0;
   isDestroyed = false;

   const listener = () => counter++;

   document.addEventListener('click', listener);

   return {
      destroy() {
         document.removeEventListener('click', listener)
         isDestroyed = true
      },

      getClicks() {
         if (isDestroyed) {
            return 'Is destroyed'
         }
         return counter
      }
   }
}

window.analytic = createAnalytics();
