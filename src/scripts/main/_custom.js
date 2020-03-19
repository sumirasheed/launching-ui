let animation = () =>{
    AOS.init();
}

let stickyHeader = () => {
    $(window).scroll(function(){
        var sticky = $('.sticky'),
            scroll = $(window).scrollTop();
      
        if (scroll >= 50) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
      });
}

let slickCarousel = () =>{
  $('.slider').slick({
    slidesToShow: 3,
    arrows: false,
    dots: false,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  });
}