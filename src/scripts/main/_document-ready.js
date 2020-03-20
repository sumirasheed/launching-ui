(function($) {
    $(document).ready(function() {
        stickyHeader();
        slickCarousel();
        animation();
        scrollDown();
        scrollTop();
        $('.header__hammburger').click(function(){
            $(this).toggleClass('open');
        });
        $('.video-link').on('click',function(e){
            $('#video')[0].src = $(this).attr('href');
            $(this).find('i').css('display','none');
            e.preventDefault();
        });
    });
})(jQuery);
    
