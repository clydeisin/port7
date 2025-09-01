;
(function($) {
    "use strict";

    var Pxl_Cursor = function() {
        var cursor = $(".pxl-cursor"),
            follower = $(".pxl-cursor-follower"),
            cursor_drag = $(".pxl-cursor-drag");

        var posX = 0,
            posY = 0;
        var posX1 = 0,
            posY1 = 0;

        var mouseX = 0,
            mouseY = 0;

        if (cursor.length <= 0) return false;

        document.body.classList.add('pxl-cursor-init');

        $(document).on("mousemove", function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        initCursor();
        extraCursor();

        function initCursor() {
            var cursor_width = cursor.width();
            var cursor_follower_width = follower.width();
            var cursor_drag_width = cursor_drag.width();
            TweenMax.to({}, 0.01, {
                repeat: -1,
                onRepeat: function() {
                    posX += (mouseX - posX) / 9;
                    posY += (mouseY - posY) / 9;
                    posX1 += (mouseX - posX1);
                    posY1 += (mouseY - posY1);
                    if (follower.length > 0) {
                        TweenMax.set(follower, {
                            css: {
                                left: mouseX - (cursor_follower_width / 2) - 2,
                                top: mouseY - (cursor_follower_width / 2) - 2
                            }
                        });
                    }
                    if (cursor.length > 0) {
                        TweenMax.set(cursor, {
                            css: {
                                left: mouseX - (cursor_width / 2),
                                top: mouseY - (cursor_width / 2)
                            }
                        });
                    }
                    if (cursor_drag.length > 0) {
                        TweenMax.set(cursor_drag, {
                            css: {
                                left: posX1 - (cursor_drag_width / 2),
                                top: posY1 - (cursor_drag_width / 2)
                            }
                        });
                    }
                }
            });
        }

        function show_cursor(cur, bool) {
            cur.addClass("active");
            if (bool == true) {
                cursor.removeClass("active").addClass('hide');
                follower.removeClass("active").addClass('hide');
            }
        }

        function hide_cursor(cur, bool) {
            cur.removeClass("active");
            if (bool == true) {
                cursor.removeClass("hide");
                follower.removeClass("hide");
            }
        }

        function show_cursor_link(e) {
            if ($(e).parents('.pxl-drag-area').length > 0) {
                cursor_drag.removeClass("active");
                cursor.removeClass("hide");
                cursor.addClass("active");
                follower.removeClass("hide");
                follower.addClass("active");
            }
        }

        function show_cursor_inner(e) {
            if ($(e).parents('.pxl-drag-area').length > 0) {
                cursor_drag.removeClass("active");
                cursor.removeClass("hide");
                follower.removeClass("hide");
            }
        }

        function hide_cursor_inner(e) {
            if ($(e).parents('.pxl-drag-area').length > 0) {
                cursor_drag.addClass("active");
                cursor.addClass("hide");
                follower.addClass("hide");
            }
        }

        function manageCursorEvents(selector, show) {
            $(selector).on("mouseenter", function() {
                show_cursor(cursor, show);
                show_cursor(follower, show);

                if ($(this).is('a')) {
                    show_cursor_inner(this);
                }
                if ($(this).is('.woosw-btn, .woosq-btn, .woosc-btn, .pxl-swiper-pagination-bullet, .pxl-anchor')) {
                    show_cursor_link(this);
                }
                if ($(this).is('iframe')) {
                    cursor.addClass("hide");
                    follower.addClass("hide");
                    cursor_drag.removeClass("active");
                }
                if ($(this).attr('data-cursor-link') === 'show') {
                    show_cursor_inner(this);
                }
                if ($(this).attr('data-cursor-link') === 'hide') {
                    hide_cursor_inner(this);
                }
            }).on("mouseleave", function() {
                hide_cursor(cursor, show);
                hide_cursor(follower, show);

                if ($(this).is('a')) {
                    hide_cursor_inner(this);
                }
                if ($(this).is('.woosw-btn, .woosq-btn, .woosc-btn, .pxl-swiper-pagination-bullet')) {
                    hide_cursor_inner(this);
                }
                if ($(this).is('iframe')) {
                    cursor.removeClass("hide");
                    follower.removeClass("hide");
                }
            });
        }

        function extraCursor() {
            var elementSelector = 'button, .pxl-image-box, .btn-default, .pxl-clink';

            manageCursorEvents('a', false);
            manageCursorEvents('.pxl-anchor', false);
            manageCursorEvents('iframe', false);
            manageCursorEvents(elementSelector, true);

            $('.pxl-parent-cursor').on("mouseenter", function() {
                var $links = $(this).find('a');
                var $element = $(this).find(elementSelector);
                var $bullets = $(this).find('.pxl-swiper-pagination-bullet');
                manageCursorEvents($links, false);
                manageCursorEvents($element, true);
                manageCursorEvents($bullets, true);
            });

            $('.pxl-swiper-arrow').on("mouseenter", function() {
                cursor.addClass("active").removeClass('hide');
                follower.addClass("active").removeClass('hide');
                cursor_drag.addClass("hide");
            }).on("mouseleave", function() {
                cursor.removeClass("active").addClass('hide');
                follower.removeClass("active").addClass('hide');
                cursor_drag.removeClass("hide");
            });

            $('.pxl-drag-area').on("mouseenter", function() {
                show_cursor(cursor_drag, true);
            }).on("mouseleave", function() {
                hide_cursor(cursor_drag, true);
                cursor_drag.removeClass("clicked");
            }).on('mousedown', function() {
                cursor_drag.addClass("clicked");
            }).on('mouseup', function() {
                cursor_drag.removeClass("clicked");
            });
        }

    };

    function setupPxlCursor() {
        if ($(document).find('.pxl-cursor').length > 0) {
            if ($(window).innerWidth() >= 1200) {
                Pxl_Cursor();
            } else if ($(window).innerWidth() < 1200) {
                $(".pxl-cursor, .pxl-cursor-follower, .pxl-cursor-drag").remove();
                $("body").removeClass('pxl-enable-cursor');
            }
        }
    }

    setupPxlCursor();

    $(document).ajaxComplete(function() {
        setupPxlCursor();
    });

})(jQuery);