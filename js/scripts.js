(function ($) {
  "use strict";

  /* Preloader */
  $(window).on('load', function () {
    var preloaderFadeOutTime = 500;
    function hidePreloader() {
      var preloader = $('.spinner-wrapper');
      preloader.fadeOut(preloaderFadeOutTime);
    }
    hidePreloader();

    new WOW().init();

    $('img[data-lazy-image]').each(function (index, el) {
      $(el).attr('src', $(el).data('lazy-image'));
    });

    checkCounter();
  });


  /* Navbar Scripts */
  // jQuery to collapse the navbar on scroll
  $(window).on('scroll load', function () {
    if ($(".navbar").offset().top > 20) {
      $(".fixed-top").addClass("top-nav-collapse");
    } else {
      $(".fixed-top").removeClass("top-nav-collapse");
    }
  });

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $(function () {
    $(document).on('click', 'a.page-scroll', function (event) {
      event.preventDefault();
      setTimeout(() => {
        var $anchor = $(this);
        $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top
        }, 600, 'easeInOutExpo');
      }, 0);
    });
  });

  // closes the responsive menu on menu item click
  $(".navbar-nav li a").on("click", function (event) {
    if (!$(this).parent().hasClass('dropdown'))
      $(".navbar-collapse").collapse('hide');
  });

  /* Card Slider - Swiper */
  var cardSlider = new Swiper('.card-slider', {
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    slidesPerView: 4,
    spaceBetween: 20,
    breakpoints: {
      // when window is <= 1200px
      1200: {
        slidesPerView: 3
      },
      // when window is <= 992px
      992: {
        slidesPerView: 2
      },
      // when window is <= 768px
      768: {
        slidesPerView: 1
      }
    }
  });


  /* Lightbox - Magnific Popup */
  $('.popup-with-move-anim').magnificPopup({
    type: 'inline',
    fixedContentPos: false, /* keep it false to avoid html tag shift with margin-right: 17px */
    fixedBgPos: true,
    fixedContentPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-slide-bottom'
  });

  /* Filter - Isotope */
  var $grid = $('.filter-grid').isotope({
    // options
    itemSelector: '.element-item',
    layoutMode: 'fitRows'
  });

  // filter items on button click
  $('.filters-button-group').on('click', 'a', function () {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
  });

  // change is-checked class on buttons
  $('.button-group').each(function (i, buttonGroup) {
    var $buttonGroup = $(buttonGroup);
    $buttonGroup.on('click', 'a', function () {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $(this).addClass('is-checked');
    });
  });

  document.querySelector('.filters-button-group .button.is-checked').click();

  /* Counter - CountTo */
  var a = 0;
  $(window).scroll(checkCounter);

  function checkCounter() {
    if ($('#counter').length) { // checking if CountTo section exists in the page, if not it will not run the script and avoid errors	
      var oTop = $('#counter').offset().top - window.innerHeight;
      if (a == 0 && $(window).scrollTop() > oTop && $(window).scrollTop() < oTop + window.innerHeight) {
        $('.counter-value').each(function () {
          var $this = $(this),
            countTo = $this.attr('data-count');
          $({
            countNum: $this.text()
          }).animate({
            countNum: countTo
          },
            {
              duration: 1500,
              easing: 'swing',
              step: function () {
                $this.text(Math.floor(this.countNum));
              },
              complete: function () {
                $this.text(this.countNum);
                //alert('finished');
              }
            });
        });
        a = 1;
      }
    }
  }

  /* Back To Top Button */
  var amountScrolled = 700;
  $(window).scroll(function () {
    if ($(window).scrollTop() > amountScrolled) {
      document.querySelector('a.back-to-top').classList.add('show')
    } else {
      document.querySelector('a.back-to-top').classList.remove('show')
    }
  });


  /* Removes Long Focus On Buttons */
  $(".button, a, button").mouseup(function () {
    $(this).blur();
  });

  lightbox.option({
    resizeDuration: 400,
    wrapAround: true,
    alwaysShowNavOnTouchDevices: true,
    albumLabel: "圖片 %1 / %2",
    resizeDuration: 400,
    disableScrolling: true
  })

  let itemSwipers = [];
  document.querySelectorAll('.popup-with-move-anim').forEach(element => {
    element.addEventListener('click', e => {
      itemSwipers[element] = new Splide(`#${element.getAttribute('data-target')} .splide`);
      itemSwipers[element].mount();
      itemSwipers[element].root.querySelector('.splide__list').style = '';
    })
  })
})(jQuery);