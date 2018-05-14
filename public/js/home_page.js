window.onscroll = function() {
  navbarSticky()
};

// Get navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function navbarSticky() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

// Sign in and sign up modals
$(document).ready(function() {
  $('.modal').modal();



  // Scroll Magic
  var controller = new ScrollMagic.Controller();
  // build a scene for section02
  var ourScene = new ScrollMagic.Scene({
      triggerElement: '#section02'
    })
    .setClassToggle('#section02', 'fade-in') // add class to project01
    /*.addIndicators({
      name: 'fade scene',
      colorTrigger: 'black',
      colorStart: '#75C695'
    })*/ // this requires the debug plugin
    .addTo(controller);

    // build a scene for section03
    var ourScene = new ScrollMagic.Scene({
        triggerElement: '#section03',
        triggerHook: 0.65
      })
      .setClassToggle('#section03', 'fade-in') // add class to project01
      /*.addIndicators({
        name: 'fade scene',
        colorTrigger: 'black',
        indent: 200,
        colorStart: '#75C695'
      })*/ // this requires the debug plugin
      .addTo(controller);
});
