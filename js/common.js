!function($){
  let defaults = {
    position: "top",
    time_limits: [3, 5, 10, 20, 30, 60],
    word_limits: [75, 150, 250, 500, 1667],
    type: "timed",
    limit: 5,
    hidden: false,
    hardcore: false
    };

  $.fn.write_button = function(options){
    let settings = $.extend({}, defaults, options),
        el = $(this);

    el.each(function() {

      let btn = $(this);
      let url = btn.attr("href").split("?")[0];

      let $wrapper = $("<div class='write_button_wrap'></div>")
      if (btn.hasClass("btn-small")) { $wrapper.addClass("small"); }
      btn.wrapAll($wrapper);

      let timed_radios = "", words_radios = "";

      for (let idx in settings.time_limits) {
        let checked = settings.type === 'timed' && settings.limit === settings.time_limits[idx] ? 'checked' : '';
        timed_radios += `<input ${checked} class='select_time' id='radio${idx}' type='radio' name='time' value='${settings.time_limits[idx]}min' /><label for='radio${idx}'>${settings.time_limits[idx]}</label>\n`;
      }

      for (let idx in settings.word_limits) {
        let checked = settings.type === 'words' && settings.limit === settings.word_limits[idx] ? 'checked' : '';
        words_radios += `<input ${checked} class='select_time' id='radio${idx + settings.time_limits.length}' type='radio' name='time' value='${settings.word_limits[idx]}words' /><label for='radio${idx  + settings.time_limits.length}'>${String(settings.word_limits[idx]).replace("000", "k")}</label>\n`;
      }

      let $chooser = $(`
      <div class="session_chooser ${settings.hidden ? 'hidden' : ''}">
            <div class="full ${settings.type}" style="display: none;">
                <div class="tabs">
                    <span class="timed">Minutes</span> / <span class="words">Words</span>
                </div>
                <div class="tab-timed">
                    <div class="radios">
                        ${timed_radios}
                    </div>
                </div>
                <div class="tab-words">
                    <div class="radios">
                        ${words_radios}
                    </div>
                </div>
                <div class="tab-hardcore">
                  <input type="checkbox" name="hardcore-check" id="hardcore-check" /><label for="hardcore-check">Hardcore mode</label>
                </div>
            </div>
            <div class="compact">
                Session length: <span class="choice">${settings.limit} ${settings.type == 'timed' ? 'minutes' : 'words'}</span> <i class="edit icon-pencil"></i>
            </div>
      </div>
      `);
      btn.parent().prepend($chooser);
      if (settings.hidden) {
        let chooserExpireTimer = null;
        let closeChooserAfterDelay = function () {
            clearTimeout(chooserExpireTimer);
            chooserExpireTimer = setTimeout(function () {
                $chooser.fadeOut();
            }, 5000);
        };
        btn.on("mouseenter", function() {
          $chooser.fadeIn();
          closeChooserAfterDelay()
        });
        $chooser.on("mouseenter mousemove mouseleave", function () {
            closeChooserAfterDelay()
        });
      }
      let set_url = function() {
        let limit = $chooser.find("input[type=radio]:checked").val()
        let hardcore = $chooser.find("#hardcore-check")[0].checked ? "&hardcore=true" : "";
        btn.attr('href', `${url}?limit=${limit}${hardcore}`)
      }
      $chooser.find("input").on('change', set_url);
      $chooser.find(".tabs .words").bind('click', function () {
          $(this).parents('.full').removeClass("timed").addClass("words");
      });
      $chooser.find(".tabs .timed").bind('click', function () {
          $(this).parents('.full').removeClass("words").addClass("timed");
      });
      $chooser.find(".compact").bind('click', function () {
          $(this).hide();
          $(this).parents('.session_chooser').find('.full').show();
      });

    });

  }
}(window.jQuery);



!function($){

  let defaults = {
    position: "top",
    animationTime: 500,
    easing: "ease-in-out",
    offset: 20,
    hidePlaceholderOnFocus: true
    };

  $.fn.animateLabel = function(settings) {
    let posx = 0, posy = 0;


    $(this).css({
      "left": "auto",
      "right": "auto",
      "position": "absolute",
      "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
      "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
      "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
      "transition": "all " + settings.animationTime + "ms " + settings.easing
    });

    posx = 0;
    posy = ($(this).height() + settings.offset) * -1;

    $(this).css({
      "top": "0",
      "opacity": "1",
      "font-size": "60%",
      "-webkit-transform": "translate3d(" + posx + ", " + posy + "px, 0)",
      "-moz-transform": "translate3d(" + posx + ", " + posy + "px, 0)",
      "-ms-transform": "translate3d(" + posx + ", " + posy + "px, 0)",
      "transform": "translate3d(" + posx + ", " + posy + "px, 0)"
    });
  }

  $.fn.removeAnimate = function() {
    let posx = 0, posy = 0;

    $(this).css({
      "top": "0",
      "opacity": "0",
      "font-size": "100%",
      "-webkit-transform": "translate3d(" + posx + ", " + posy + "px, 0)",
      "-moz-transform": "translate3d(" + posx + ", " + posy + "px, 0)",
      "-ms-transform": "translate3d(" + posx + ", " + posy + "px, 0)",
      "transform": "translate3d(" + posx + ", " + posy + "px, 0)"
    });

  }

  $.fn.label_better = function(options){
    let settings = $.extend({}, defaults, options),
        el = $(this),
        triggerIn = "focus",  // noqa
        triggerOut = "blur";  // noqa
    if(settings.easing == "bounce") settings.easing = "cubic-bezier(0.175, 0.885, 0.420, 1.310)"

    el.each(function() {
      let btn = $(this),
          position = btn.data("position")  || settings.position;
      btn.wrapAll("<div class='lb_wrap' style='position:relative; display: inline;'></div>")

      if( btn.val().length > 0) {
        let text = btn.data("new-placeholder")  || btn.attr("placeholder");
        $("<div class='lb_label " + position + "'>"+ text + "</div>").css("opacity", "0").insertAfter(btn).animateLabel(settings, btn);
      }

      btn.bind(triggerIn, function() {
        if(btn.val().length < 1) {
          let text = btn.data("new-placeholder")  || btn.attr("placeholder"),
           position = btn.data("position")  || settings.position;
          $("<div class='lb_label " + position + "'>"+ text + "</div>").css("opacity", "0").insertAfter(btn).animateLabel(settings, btn);
        }
        if (settings.hidePlaceholderOnFocus == true) {
          btn.data("default-placeholder", btn.attr("placeholder"))
          btn.attr("placeholder", "")
        }
        btn.parent().find(".lb_label").addClass("active");
      }).bind(triggerOut, function() {

        if(btn.val().length < 1) {
          btn.parent().find(".lb_label").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ $(this).remove(); }).removeAnimate(settings, btn)
        }
        if (settings.hidePlaceholderOnFocus == true) {
          btn.attr("placeholder", btn.data("default-placeholder"))
          btn.data("default-placeholder", "")
        }
        btn.parent().find(".lb_label").removeClass("active");
      });
    });

  }
}(window.jQuery);

jQuery.fn.focus_end = function() {

  return this.each(function() {

    // Cache references
    let $el = $(this),
        el = this;

    // Only focus if input isn't already
    if (!$el.is(":focus")) {
     $el.focus();
    }

    // If this function exists... (IE 9+)
    if (el.setSelectionRange) {

      // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
      let len = $el.val().length * 2;

      // Timeout seems to be required for Blink
      setTimeout(function() {
        el.setSelectionRange(len, len);
      }, 1);

    } else {

      // As a fallback, replace the contents with itself
      // Doesn't work in Chrome, but Chrome supports setSelectionRange
      $el.val($el.val());

    }

    // Scroll to the bottom, in case we're in a tall textarea
    // (Necessary for Firefox and Chrome)
    this.scrollTop = 999999;

  });

};
