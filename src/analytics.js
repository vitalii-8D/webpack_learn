import * as $ from 'jquery';

function createAnalytics() {
   let counter = 0;
   let destroyed = false;

   const listener = () => counter++;

   $(document).on('click', listener);

   return {
      destroy() {
         $(document).off('click', listener)
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
