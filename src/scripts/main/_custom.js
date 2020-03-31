//animation on scroll
let animation = () =>{
  AOS.init();
}

//sticky header
let stickyHeader = () => {
    if($(window).width() > 992){
      $(window).scroll(function(){
        var sticky = $('.sticky'),
            scroll = $(window).scrollTop();
      
        if (scroll >= 50) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
      });
    }
    
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
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
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
      if ($(this).scrollTop() >= 50) {        
          $('#return-to-top').fadeIn(200);    
      } else {
          $('#return-to-top').fadeOut(200);   
      }
  });
  $('#return-to-top').click(function() {     
      $('body,html').animate({
          scrollTop : 0                      
      }, 500);
  });
}

let clickIcon = () =>{
  //hamgurger open click
  $('.header__hammburger').click(function(){
    $(this).toggleClass('open');
  });
}

let playVideo = () =>{
    //video play function
    $('.video__link').on('click',function(e){
    e.preventDefault();
      $('#video')[0].src = $(this).attr('href');
      $(this).find('i').css('display','none');
     
  });
}