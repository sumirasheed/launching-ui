//animation on scroll
let animation = () =>{
  AOS.init();
}

//sticky header
let stickyHeader = () => {
    $(window).scroll(function(){
        var sticky = $('.sticky'),
            scroll = $(window).scrollTop();
      
        if (scroll >= 50) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
    });
}

//slider 
let slickCarousel = () =>{
  $('.slider').slick({
    slidesToShow: 3,
    arrows: false,
    dots: false,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
}

//scroll down function
let scrollDown = () => {
  $('.scroll-down').click(function(){
      var fuller = $(this).closest('.banner').next(),
          section = $(this).closest('.section');
      console.log(fuller);
      $('html,body').animate({
          scrollTop: section.scrollTop() + fuller.offset().top
      }, 100);
  });
}

//scroll top function
let scrollTop = () => {
  $(window).scroll(function() {
      if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
          $('#return-to-top').fadeIn(200);    // Fade in the arrow
      } else {
          $('#return-to-top').fadeOut(200);   // Else fade out the arrow
      }
  });
  $('#return-to-top').click(function() {      // When arrow is clicked
      $('body,html').animate({
          scrollTop : 0                       // Scroll to top of body
      }, 500);
  });
}