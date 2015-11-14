(function() {

(function() {


})();
(function() {

/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/
if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);


})();
(function() {

(function ($) {

  /**
   * Augment jQuery prototype.
   */

  $.fn.antiscroll = function (options) {
    return this.each(function () {
      if ($(this).data('antiscroll')) {
        $(this).data('antiscroll').destroy();
      }

      $(this).data('antiscroll', new $.Antiscroll(this, options));
    });
  };

  /**
   * Expose constructor.
   */

  $.Antiscroll = Antiscroll;

  /**
   * Antiscroll pane constructor.
   *
   * @param {Element|jQuery} main pane
   * @parma {Object} options
   * @api public
   */

  function Antiscroll (el, opts) {
    this.el = $(el);
    this.options = opts || {};

    this.x = (false !== this.options.x) || this.options.forceHorizontal;
    this.y = (false !== this.options.y) || this.options.forceVertical;
    this.autoHide = false !== this.options.autoHide;
    this.padding = undefined == this.options.padding ? 2 : this.options.padding;

    this.inner = this.el.find('.antiscroll-inner');
    this.inner.css({
        'width':  '+=' + (this.y ? scrollbarSize() : 0)
      , 'height': '+=' + (this.x ? scrollbarSize() : 0)
    });

    this.refresh();
  };

  /**
   * refresh scrollbars
   *
   * @api public
   */

  Antiscroll.prototype.refresh = function() {
    var needHScroll = this.inner.get(0).scrollWidth > this.el.width() + (this.y ? scrollbarSize() : 0), 
	    needVScroll = this.inner.get(0).scrollHeight > this.el.height() + (this.x ? scrollbarSize() : 0);

    if (this.x) {
      if (!this.horizontal && needHScroll) {
        this.horizontal = new Scrollbar.Horizontal(this);
      } else if (this.horizontal && !needHScroll)  {
        this.horizontal.destroy();
        this.horizontal = null;
      } else if (this.horizontal) {
        this.horizontal.update();
      }
    }

    if (this.y) {
      if (!this.vertical && needVScroll) {
        this.vertical = new Scrollbar.Vertical(this);
      } else if (this.vertical && !needVScroll)  {
        this.vertical.destroy();
        this.vertical = null;
      } else if (this.vertical) {
        this.vertical.update();
      }
    }
  };

  /**
   * Cleans up.
   *
   * @return {Antiscroll} for chaining
   * @api public
   */

  Antiscroll.prototype.destroy = function () {
    if (this.horizontal) {
      this.horizontal.destroy();
      this.horizontal = null
    }
    if (this.vertical) {
      this.vertical.destroy();
      this.vertical = null
    }
    return this;
  };

  /**
   * Rebuild Antiscroll.
   *
   * @return {Antiscroll} for chaining
   * @api public
   */

  Antiscroll.prototype.rebuild = function () {
    this.destroy();
    this.inner.attr('style', '');
    Antiscroll.call(this, this.el, this.options);
    return this;
  };

  /**
   * Scrollbar constructor.
   *
   * @param {Element|jQuery} element
   * @api public
   */

  function Scrollbar (pane) {
    this.pane = pane;
    this.pane.el.append(this.el);
    this.innerEl = this.pane.inner.get(0);

    this.dragging = false;
    this.enter = false;
    this.shown = false;

    // hovering
    this.pane.el.mouseenter($.proxy(this, 'mouseenter'));
    this.pane.el.mouseleave($.proxy(this, 'mouseleave'));

    // dragging
    this.el.mousedown($.proxy(this, 'mousedown'));

    // scrolling
    this.innerPaneScrollListener = $.proxy(this, 'scroll');
    this.pane.inner.scroll(this.innerPaneScrollListener);

    // wheel -optional-
    this.innerPaneMouseWheelListener = $.proxy(this, 'mousewheel');
    this.pane.inner.bind('mousewheel', this.innerPaneMouseWheelListener);

    // show
    var initialDisplay = this.pane.options.initialDisplay;

    if (initialDisplay !== false) {
      this.show();
      if (this.pane.autoHide) {
          this.hiding = setTimeout($.proxy(this, 'hide'), parseInt(initialDisplay, 10) || 3000);
      }
    }
  };

  /**
   * Cleans up.
   *
   * @return {Scrollbar} for chaining
   * @api public
   */

  Scrollbar.prototype.destroy = function () {
    this.el.remove();
    this.pane.inner.unbind('scroll', this.innerPaneScrollListener);
    this.pane.inner.unbind('mousewheel', this.innerPaneMouseWheelListener);
    return this;
  };

  /**
   * Called upon mouseenter.
   *
   * @api private
   */

  Scrollbar.prototype.mouseenter = function () {
    this.enter = true;
    this.show();
  };

  /**
   * Called upon mouseleave.
   *
   * @api private
   */

  Scrollbar.prototype.mouseleave = function () {
    this.enter = false;

    if (!this.dragging) {
        if (this.pane.autoHide) {
            this.hide();
        }
    }
  };

  /**
   * Called upon wrap scroll.
   *
   * @api private
   */

  Scrollbar.prototype.scroll = function () {
    if (!this.shown) {
      this.show();
      if (!this.enter && !this.dragging) {
        if (this.pane.autoHide) {
            this.hiding = setTimeout($.proxy(this, 'hide'), 1500);
        }
      }
    }

    this.update();
  };

  /**
   * Called upon scrollbar mousedown.
   *
   * @api private
   */

  Scrollbar.prototype.mousedown = function (ev) {
    ev.preventDefault();

    this.dragging = true;

    this.startPageY = ev.pageY - parseInt(this.el.css('top'), 10);
    this.startPageX = ev.pageX - parseInt(this.el.css('left'), 10);

    // prevent crazy selections on IE
    this.el[0].ownerDocument.onselectstart = function () { return false; };

    var pane = this.pane,
	    move = $.proxy(this, 'mousemove'),
		self = this

    $(this.el[0].ownerDocument)
      .mousemove(move)
      .mouseup(function () {
        self.dragging = false;
        this.onselectstart = null;

        $(this).unbind('mousemove', move);

        if (!self.enter) {
          self.hide();
        }
      });
  };

  /**
   * Show scrollbar.
   *
   * @api private
   */

  Scrollbar.prototype.show = function (duration) {
    if (!this.shown && this.update()) {
      this.el.addClass('antiscroll-scrollbar-shown');
      if (this.hiding) {
        clearTimeout(this.hiding);
        this.hiding = null;
      }
      this.shown = true;
    }
  };

  /**
   * Hide scrollbar.
   *
   * @api private
   */

  Scrollbar.prototype.hide = function () {
    if (this.pane.autoHide !== false && this.shown) {
      // check for dragging
      this.el.removeClass('antiscroll-scrollbar-shown');
      this.shown = false;
    }
  };

  /**
   * Horizontal scrollbar constructor
   *
   * @api private
   */

  Scrollbar.Horizontal = function (pane) {
    this.el = $('<div class="antiscroll-scrollbar antiscroll-scrollbar-horizontal"/>', pane.el);
    Scrollbar.call(this, pane);
  };

  /**
   * Inherits from Scrollbar.
   */

  inherits(Scrollbar.Horizontal, Scrollbar);

  /**
   * Updates size/position of scrollbar.
   *
   * @api private
   */

  Scrollbar.Horizontal.prototype.update = function () {
    var paneWidth = this.pane.el.width(), 
	    trackWidth = paneWidth - this.pane.padding * 2,
		innerEl = this.pane.inner.get(0)

    this.el
      .css('width', trackWidth * paneWidth / innerEl.scrollWidth)
      .css('left', trackWidth * innerEl.scrollLeft / innerEl.scrollWidth);

    return paneWidth < innerEl.scrollWidth;
  };

  /**
   * Called upon drag.
   *
   * @api private
   */

  Scrollbar.Horizontal.prototype.mousemove = function (ev) {
    var trackWidth = this.pane.el.width() - this.pane.padding * 2, 
	    pos = ev.pageX - this.startPageX,
		barWidth = this.el.width(),
		innerEl = this.pane.inner.get(0)

    // minimum top is 0, maximum is the track height
    var y = Math.min(Math.max(pos, 0), trackWidth - barWidth);

    innerEl.scrollLeft = (innerEl.scrollWidth - this.pane.el.width())
      * y / (trackWidth - barWidth);
  };

  /**
   * Called upon container mousewheel.
   *
   * @api private
   */

  Scrollbar.Horizontal.prototype.mousewheel = function (ev, delta, x, y) {
    if ((x < 0 && 0 == this.pane.inner.get(0).scrollLeft) ||
        (x > 0 && (this.innerEl.scrollLeft + Math.ceil(this.pane.el.width())
          == this.innerEl.scrollWidth))) {
      ev.preventDefault();
      return false;
    }
  };

  /**
   * Vertical scrollbar constructor
   *
   * @api private
   */

  Scrollbar.Vertical = function (pane) {
    this.el = $('<div class="antiscroll-scrollbar antiscroll-scrollbar-vertical"/>', pane.el);
    Scrollbar.call(this, pane);
  };

  /**
   * Inherits from Scrollbar.
   */

  inherits(Scrollbar.Vertical, Scrollbar);

  /**
   * Updates size/position of scrollbar.
   *
   * @api private
   */

  Scrollbar.Vertical.prototype.update = function () {
    var paneHeight = this.pane.el.height(), 
	    trackHeight = paneHeight - this.pane.padding * 2,
		innerEl = this.innerEl;
      
    var scrollbarHeight = trackHeight * paneHeight / innerEl.scrollHeight;
    scrollbarHeight = scrollbarHeight < 20 ? 20 : scrollbarHeight;
    
    var topPos = trackHeight * innerEl.scrollTop / innerEl.scrollHeight;
    
    if((topPos + scrollbarHeight) > trackHeight) {
        var diff = (topPos + scrollbarHeight) - trackHeight;
        topPos = topPos - diff - 3;
    }

    this.el
      .css('height', scrollbarHeight)
      .css('top', topPos);
	  
	  return paneHeight < innerEl.scrollHeight;
  };

  /**
   * Called upon drag.
   *
   * @api private
   */

  Scrollbar.Vertical.prototype.mousemove = function (ev) {
    var paneHeight = this.pane.el.height(),
	    trackHeight = paneHeight - this.pane.padding * 2,
		pos = ev.pageY - this.startPageY,
		barHeight = this.el.height(),
		innerEl = this.innerEl

    // minimum top is 0, maximum is the track height
    var y = Math.min(Math.max(pos, 0), trackHeight - barHeight);

    innerEl.scrollTop = (innerEl.scrollHeight - paneHeight)
      * y / (trackHeight - barHeight);
  };

  /**
   * Called upon container mousewheel.
   *
   * @api private
   */

  Scrollbar.Vertical.prototype.mousewheel = function (ev, delta, x, y) {
    if ((y > 0 && 0 == this.innerEl.scrollTop) ||
        (y < 0 && (this.innerEl.scrollTop + Math.ceil(this.pane.el.height())
          == this.innerEl.scrollHeight))) {
      ev.preventDefault();
      return false;
    }
  };

  /**
   * Cross-browser inheritance.
   *
   * @param {Function} constructor
   * @param {Function} constructor we inherit from
   * @api private
   */

  function inherits (ctorA, ctorB) {
    function f() {};
    f.prototype = ctorB.prototype;
    ctorA.prototype = new f;
  };

  /**
   * Scrollbar size detection.
   */

  var size;

  function scrollbarSize () {
    if (size === undefined) {
      var div = $(
          '<div class="antiscroll-inner" style="width:50px;height:50px;overflow-y:scroll;'
        + 'position:absolute;top:-200px;left:-200px;"><div style="height:100px;width:100%"/>'
        + '</div>'
      );

      $('body').append(div);
      var w1 = $(div).innerWidth();
      var w2 = $('div', div).innerWidth();
      $(div).remove();

      size = w1 - w2;
    }

    return size;
  };

})(jQuery);


})();
(function() {

Ember.AddeparMixins = Ember.AddeparMixins || Ember.Namespace.create();

Ember.AddeparMixins.ResizeHandlerMixin = Ember.Mixin.create({
  resizeEndDelay: 200,
  resizing: false,
  onResizeStart: Ember.K,
  onResizeEnd: Ember.K,
  onResize: Ember.K,
  endResize: Ember.computed(function() {
    return function(event) {
      if (this.isDestroyed) {
        return;
      }
      this.set('resizing', false);
      return typeof this.onResizeEnd === "function" ? this.onResizeEnd(event) : void 0;
    };
  }),
  handleWindowResize: function(event) {
    if ((typeof event.target.id !== "undefined" && event.target.id !== null)
        && (event.target.id !== this.elementId)) {
      return;
    }
    if (!this.get('resizing')) {
      this.set('resizing', true);
      if (typeof this.onResizeStart === "function") {
        this.onResizeStart(event);
      }
    }
    if (typeof this.onResize === "function") {
      this.onResize(event);
    }
    return Ember.run.debounce(this, this.get('endResize'), event, this.get('resizeEndDelay'));
  },
  didInsertElement: function() {
    this._super();
    return this._setupDocumentHandlers();
  },
  willDestroyElement: function() {
    this._removeDocumentHandlers();
    return this._super();
  },
  _setupDocumentHandlers: function() {
    if (this._resizeHandler) {
      return;
    }
    this._resizeHandler = jQuery.proxy(this.get('handleWindowResize'), this);
    return jQuery(window).on("resize." + this.elementId, this._resizeHandler);
  },
  _removeDocumentHandlers: function() {
    jQuery(window).off("resize." + this.elementId, this._resizeHandler);
    return this._resizeHandler = null;
  }
});


})();
(function() {

Ember.AddeparMixins = Ember.AddeparMixins || Ember.Namespace.create();

Ember.AddeparMixins.StyleBindingsMixin = Ember.Mixin.create({
  concatenatedProperties: ['styleBindings'],
  attributeBindings: ['style'],
  unitType: 'px',
  createStyleString: function(styleName, property) {
    var value;
    value = this.get(property);
    if (Ember.isNone(value)) {
      return;
    }
    if (Ember.typeOf(value) === 'number') {
      value = value + this.get('unitType');
    }
    return Ember.String.dasherize("" + styleName) + ":" + value + ";";
  },
  applyStyleBindings: function() {
    var lookup, properties, styleBindings, styleComputed, styles,
      _this = this;
    styleBindings = this.styleBindings;
    if (!styleBindings) {
      return;
    }
    lookup = {};
    styleBindings.forEach(function(binding) {
      var property, style, tmp;
      tmp = binding.split(':');
      property = tmp[0];
      style = tmp[1];
      lookup[style || property] = property;
    });
    styles = Ember.keys(lookup);
    properties = styles.map(function(style) {
      return lookup[style];
    });
    styleComputed = Ember.computed(function() {
      var styleString, styleTokens;
      styleTokens = styles.map(function(style) {
        return _this.createStyleString(style, lookup[style]);
      });
      styleString = styleTokens.join('');
      if (styleString.length !== 0) {
        return styleString;
      }
    });
    styleComputed.property.apply(styleComputed, properties);
    return Ember.defineProperty(this, 'style', styleComputed);
  },
  init: function() {
    this.applyStyleBindings();
    return this._super();
  }
});


})();
(function() {

(function() {

var _ref;


})();
(function() {

Ember.TEMPLATES["body-container"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n        ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.LazyTableBlock", {hash:{
    'classNames': ("ember-table-left-table-block"),
    'contentBinding': ("controller.bodyContent"),
    'columnsBinding': ("controller.fixedColumns"),
    'widthBinding': ("controller._fixedBlockWidth"),
    'numItemsShowingBinding': ("controller._numItemsShowing"),
    'scrollTopBinding': ("controller._scrollTop"),
    'startIndexBinding': ("controller._startIndex")
  },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'numItemsShowingBinding': "STRING",'scrollTopBinding': "STRING",'startIndexBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'widthBinding': depth0,'numItemsShowingBinding': depth0,'scrollTopBinding': depth0,'startIndexBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n      ");
  return buffer;
  }

  data.buffer.push("<div class=\"antiscroll-box\">\n  <div class=\"antiscroll-inner\">\n    <div class=\"ember-table-table-scrollable-wrapper\">\n      ");
  stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.LazyTableBlock", {hash:{
    'classNames': ("ember-table-right-table-block"),
    'contentBinding': ("controller.bodyContent"),
    'columnsBinding': ("controller.tableColumns"),
    'scrollLeftBinding': ("controller._tableScrollLeft"),
    'widthBinding': ("controller._tableBlockWidth"),
    'numItemsShowingBinding': ("controller._numItemsShowing"),
    'scrollTopBinding': ("controller._scrollTop"),
    'startIndexBinding': ("controller._startIndex")
  },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'numItemsShowingBinding': "STRING",'scrollTopBinding': "STRING",'startIndexBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'numItemsShowingBinding': depth0,'scrollTopBinding': depth0,'startIndexBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    </div>\n  </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["components/ember-table"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.HeaderTableContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.FooterTableContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, "controller.hasHeader", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.BodyTableContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  stack1 = helpers['if'].call(depth0, "controller.hasFooter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.ScrollContainer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.ColumnSortableIndicator", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["footer-container"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.TableBlock", {hash:{
    'classNames': ("ember-table-left-table-block"),
    'contentBinding': ("controller.footerContent"),
    'columnsBinding': ("controller.fixedColumns"),
    'widthBinding': ("controller._fixedBlockWidth"),
    'heightBinding': ("controller.footerHeight")
  },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n  ");
  return buffer;
  }

  data.buffer.push("<div class=\"ember-table-table-fixed-wrapper\">\n  ");
  stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.TableBlock", {hash:{
    'classNames': ("ember-table-right-table-block"),
    'contentBinding': ("controller.footerContent"),
    'columnsBinding': ("controller.tableColumns"),
    'scrollLeftBinding': ("controller._tableScrollLeft"),
    'widthBinding': ("controller._tableBlockWidth"),
    'heightBinding': ("controller.footerHeight")
  },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["header-cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"ember-table-content-container\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortByColumn", "view.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n  <span class=\"ember-table-content\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.content.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </span>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["header-container"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.HeaderBlock", {hash:{
    'classNames': ("ember-table-left-table-block"),
    'columnsBinding': ("controller.fixedColumns"),
    'widthBinding': ("controller._fixedBlockWidth"),
    'heightBinding': ("controller.headerHeight")
  },hashTypes:{'classNames': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'columnsBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n  ");
  return buffer;
  }

  data.buffer.push("<div class=\"ember-table-table-fixed-wrapper\">\n  ");
  stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.HeaderBlock", {hash:{
    'classNames': ("ember-table-right-table-block"),
    'columnsBinding': ("controller.tableColumns"),
    'scrollLeftBinding': ("controller._tableScrollLeft"),
    'widthBinding': ("controller._tableBlockWidth"),
    'heightBinding': ("controller.headerHeight")
  },hashTypes:{'classNames': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["header-row"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.MultiItemViewCollectionView", {hash:{
    'contentBinding': ("view.content"),
    'itemViewClassField': ("headerCellViewClass"),
    'widthBinding': ("controller._tableColumnsWidth")
  },hashTypes:{'contentBinding': "STRING",'itemViewClassField': "STRING",'widthBinding': "STRING"},hashContexts:{'contentBinding': depth0,'itemViewClassField': depth0,'widthBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["scroll-container"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"antiscroll-wrap\">\n  <div class=\"antiscroll-inner\">\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Table.ScrollPanel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["table-cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<span class=\"ember-table-content\">\n  ");
  stack1 = helpers._triageMustache.call(depth0, "view.cellContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>");
  return buffer;
  
});

Ember.TEMPLATES["table-row"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.MultiItemViewCollectionView", {hash:{
    'rowBinding': ("view.row"),
    'contentBinding': ("view.columns"),
    'itemViewClassField': ("tableCellViewClass"),
    'widthBinding': ("controller._tableColumnsWidth")
  },hashTypes:{'rowBinding': "STRING",'contentBinding': "STRING",'itemViewClassField': "STRING",'widthBinding': "STRING"},hashContexts:{'rowBinding': depth0,'contentBinding': depth0,'itemViewClassField': depth0,'widthBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

})();
(function() {

Ember.Table = Ember.Namespace.create();

Ember.Table.VERSION = '0.4.1';

if ((_ref = Ember.libraries) != null) {
  _ref.register('Ember Table', Ember.Table.VERSION);
}


})();
(function() {

Ember.AddeparMixins = Ember.AddeparMixins || Ember.Namespace.create();

Ember.AddeparMixins.ResizeHandlerMixin = Ember.Mixin.create({
  resizeEndDelay: 200,
  resizing: false,
  onResizeStart: Ember.K,
  onResizeEnd: Ember.K,
  onResize: Ember.K,
  endResize: Ember.computed(function() {
    return function(event) {
      if (this.isDestroyed) {
        return;
      }
      this.set('resizing', false);
      return typeof this.onResizeEnd === "function" ? this.onResizeEnd(event) : void 0;
    };
  }),
  handleWindowResize: function(event) {
    if ((typeof event.target.id !== "undefined" && event.target.id !== null)
        && (event.target.id !== this.elementId)) {
      return;
    }
    if (!this.get('resizing')) {
      this.set('resizing', true);
      if (typeof this.onResizeStart === "function") {
        this.onResizeStart(event);
      }
    }
    if (typeof this.onResize === "function") {
      this.onResize(event);
    }
    return Ember.run.debounce(this, this.get('endResize'), event, this.get('resizeEndDelay'));
  },
  didInsertElement: function() {
    this._super();
    return this._setupDocumentHandlers();
  },
  willDestroyElement: function() {
    this._removeDocumentHandlers();
    return this._super();
  },
  _setupDocumentHandlers: function() {
    if (this._resizeHandler) {
      return;
    }
    this._resizeHandler = jQuery.proxy(this.get('handleWindowResize'), this);
    return jQuery(window).on("resize." + this.elementId, this._resizeHandler);
  },
  _removeDocumentHandlers: function() {
    jQuery(window).off("resize." + this.elementId, this._resizeHandler);
    return this._resizeHandler = null;
  }
});


})();
(function() {

Ember.AddeparMixins = Ember.AddeparMixins || Ember.Namespace.create();

Ember.AddeparMixins.StyleBindingsMixin = Ember.Mixin.create({
  concatenatedProperties: ['styleBindings'],
  attributeBindings: ['style'],
  unitType: 'px',
  createStyleString: function(styleName, property) {
    var value;
    value = this.get(property);
    if (Ember.isNone(value)) {
      return;
    }
    if (Ember.typeOf(value) === 'number') {
      value = value + this.get('unitType');
    }
    return Ember.String.dasherize("" + styleName) + ":" + value + ";";
  },
  applyStyleBindings: function() {
    var lookup, properties, styleBindings, styleComputed, styles,
      _this = this;
    styleBindings = this.styleBindings;
    if (!styleBindings) {
      return;
    }
    lookup = {};
    styleBindings.forEach(function(binding) {
      var property, style, tmp;
      tmp = binding.split(':');
      property = tmp[0];
      style = tmp[1];
      lookup[style || property] = property;
    });
    styles = Ember.keys(lookup);
    properties = styles.map(function(style) {
      return lookup[style];
    });
    styleComputed = Ember.computed(function() {
      var styleString, styleTokens;
      styleTokens = styles.map(function(style) {
        return _this.createStyleString(style, lookup[style]);
      });
      styleString = styleTokens.join('');
      if (styleString.length !== 0) {
        return styleString;
      }
    });
    styleComputed.property.apply(styleComputed, properties);
    return Ember.defineProperty(this, 'style', styleComputed);
  },
  init: function() {
    this.applyStyleBindings();
    return this._super();
  }
});


})();
(function() {

/*
jQuery.browser shim that makes HT working with jQuery 1.8+
*/

if (!jQuery.browser) {
  (function() {
    var browser, matched, res;
    matched = void 0;
    browser = void 0;
    jQuery.uaMatch = function(ua) {
      var match;
      ua = ua.toLowerCase();
      match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
      return {
        browser: match[1] || "",
        version: match[2] || "0"
      };
    };
    matched = jQuery.uaMatch(navigator.userAgent);
    browser = {};
    if (matched.browser) {
      browser[matched.browser] = true;
      browser.version = matched.version;
    }
    if (browser.chrome) {
      browser.webkit = true;
    } else {
      if (browser.webkit) {
        browser.safari = true;
      }
    }
    res = jQuery.browser = browser;
    return res;
  })();
}


})();
(function() {


Ember.LazyContainerView = Ember.ContainerView.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  classNames: 'lazy-list-container',
  styleBindings: ['height'],
  content: null,
  itemViewClass: null,
  rowHeight: null,
  scrollTop: null,
  startIndex: null,
  init: function() {
    this._super();
    return this.onNumChildViewsDidChange();
  },
  height: Ember.computed(function() {
    return this.get('content.length') * this.get('rowHeight');
  }).property('content.length', 'rowHeight'),
  numChildViews: Ember.computed(function() {
    return this.get('numItemsShowing') + 2;
  }).property('numItemsShowing'),
  onNumChildViewsDidChange: Ember.observer(function() {
    var itemViewClass, newNumViews, numViewsToInsert, oldNumViews, view, viewsToAdd, viewsToRemove, _i, _results;
    view = this;
    itemViewClass = this.get('itemViewClass');
    if (typeof itemViewClass === 'string') {
      if (/[A-Z]+/.exec(itemViewClass)) {
        itemViewClass = Ember.get(Ember.lookup, itemViewClass);
      } else {
        itemViewClass = this.container.lookupFactory("view:" + itemViewClass);
      }
    }
    newNumViews = this.get('numChildViews');
    if (!(itemViewClass && newNumViews)) {
      return;
    }
    oldNumViews = this.get('length');
    numViewsToInsert = newNumViews - oldNumViews;
    if (numViewsToInsert < 0) {
      viewsToRemove = this.slice(newNumViews, oldNumViews);
      return this.removeObjects(viewsToRemove);
    } else if (numViewsToInsert > 0) {
      viewsToAdd = (function() {
        _results = [];
        for (var _i = 0; 0 <= numViewsToInsert ? _i < numViewsToInsert : _i > numViewsToInsert; 0 <= numViewsToInsert ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function() {
        return view.createChildView(itemViewClass);
      });
      return this.pushObjects(viewsToAdd);
    }
  }, 'numChildViews', 'itemViewClass'),
  viewportDidChange: Ember.observer(function() {
    var clength, content, numShownViews, startIndex;
    content = this.get('content') || [];
    clength = content.get('length');
    numShownViews = Math.min(this.get('length'), clength);
    startIndex = this.get('startIndex');
    if (startIndex + numShownViews >= clength) {
      startIndex = clength - numShownViews;
    }
    if (startIndex < 0) {
      startIndex = 0;
    }
    return this.forEach(function(childView, i) {
      var item, itemIndex;
      if (i >= numShownViews) {
        childView = this.objectAt(i);
        childView.set('content', null);
        return;
      }
      itemIndex = startIndex + i;
      childView = this.objectAt(itemIndex % numShownViews);
      item = content.objectAt(itemIndex);
      if (item !== childView.get('content')) {
        childView.teardownContent();
        childView.set('itemIndex', itemIndex);
        childView.set('content', item);
        return childView.prepareContent();
      }
    }, this);
  }, 'content.length', 'length', 'startIndex')
});

/**
 * Lazy Item View
 * @class
 * @alias Ember.LazyItemView
*/


Ember.LazyItemView = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  itemIndex: null,
  prepareContent: Ember.K,
  teardownContent: Ember.K,
  rowHeightBinding: 'parentView.rowHeight',
  styleBindings: ['width', 'top', 'display'],
  top: Ember.computed(function() {
    return this.get('itemIndex') * this.get('rowHeight');
  }).property('itemIndex', 'rowHeight'),
  display: Ember.computed(function() {
    if (!this.get('content')) {
      return 'none';
    }
  }).property('content')
});


})();
(function() {


Ember.MultiItemViewCollectionView = Ember.CollectionView.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  styleBindings: 'width',
  itemViewClassField: null,
  createChildView: function(view, attrs) {
    var itemViewClass, itemViewClassField;
    itemViewClassField = this.get('itemViewClassField');
    itemViewClass = attrs.content.get(itemViewClassField);
    if (typeof itemViewClass === 'string') {
      if (/[A-Z]+/.exec(itemViewClass)) {
        itemViewClass = Ember.get(Ember.lookup, itemViewClass);
      } else {
        itemViewClass = this.container.lookupFactory("view:" + itemViewClass);
      }
    }
    return this._super(itemViewClass, attrs);
  }
});

Ember.MouseWheelHandlerMixin = Ember.Mixin.create({
  onMouseWheel: Ember.K,
  didInsertElement: function() {
    var _this = this;
    this._super();
    return this.$().bind('mousewheel', function(event, delta, deltaX, deltaY) {
      return Ember.run(_this, _this.onMouseWheel, event, delta, deltaX, deltaY);
    });
  },
  willDestroyElement: function() {
    var _ref;
    if ((_ref = this.$()) != null) {
      _ref.unbind('mousewheel');
    }
    return this._super();
  }
});

Ember.ScrollHandlerMixin = Ember.Mixin.create({
  onScroll: Ember.K,
  scrollElementSelector: '',
  didInsertElement: function() {
    var _this = this;
    this._super();
    return this.$(this.get('scrollElementSelector')).bind('scroll', function(event) {
      return Ember.run(_this, _this.onScroll, event);
    });
  },
  willDestroyElement: function() {
    var _ref;
    if ((_ref = this.$(this.get('scrollElementSelector'))) != null) {
      _ref.unbind('scroll');
    }
    return this._super();
  }
});

Ember.TouchMoveHandlerMixin = Ember.Mixin.create({
  onTouchMove: Ember.K,
  didInsertElement: function() {
    var startX, startY,
      _this = this;
    this._super();
    startX = startY = 0;
    this.$().bind('touchstart', function(event) {
      startX = event.originalEvent.targetTouches[0].pageX;
      startY = event.originalEvent.targetTouches[0].pageY;
    });
    return this.$().bind('touchmove', function(event) {
      var deltaX, deltaY, newX, newY;
      newX = event.originalEvent.targetTouches[0].pageX;
      newY = event.originalEvent.targetTouches[0].pageY;
      deltaX = -(newX - startX);
      deltaY = -(newY - startY);
      Ember.run(_this, _this.onTouchMove, event, deltaX, deltaY);
      startX = newX;
      startY = newY;
    });
  },
  willDestroyElement: function() {
    this.$().unbind('touchstart');
    this.$().unbind('touchmove');
    return this._super();
  }
});

Ember.Table.RowArrayController = Ember.ArrayController.extend({
  itemController: null,
  content: null,
  rowContent: Ember.computed(function() {
    return [];
  }).property(),
  controllerAt: function(idx, object, controllerClass) {
    var container, subController, subControllers;
    container = this.get('container');
    subControllers = this.get('_subControllers');
    subController = subControllers[idx];
    if (subController) {
      return subController;
    }
    subController = this.get('itemController').create({
      target: this,
      parentController: this.get('parentController') || this,
      content: object
    });
    subControllers[idx] = subController;
    return subController;
  }
});

Ember.Table.ShowHorizontalScrollMixin = Ember.Mixin.create({
  mouseEnter: function(event) {
    var $horizontalScroll, $tablesContainer;
    $tablesContainer = $(event.target).parents('.ember-table-tables-container');
    $horizontalScroll = $tablesContainer.find('.antiscroll-scrollbar-horizontal');
    return $horizontalScroll.addClass('antiscroll-scrollbar-shown');
  },
  mouseLeave: function(event) {
    var $horizontalScroll, $tablesContainer;
    $tablesContainer = $(event.target).parents('.ember-table-tables-container');
    $horizontalScroll = $tablesContainer.find('.antiscroll-scrollbar-horizontal');
    return $horizontalScroll.removeClass('antiscroll-scrollbar-shown');
  }
});

Ember.Table.RegisterTableComponentMixin = Ember.Mixin.create({
  tableComponent: null,
  init: function() {
    if (!this.get('tableComponent')) {
      this.set('tableComponent', this.nearestWithProperty('isEmberTable'));
    }
    return this._super();
  }
});


})();
(function() {


Ember.Table.ColumnDefinition = Ember.Object.extend({
  headerCellName: void 0,
  contentPath: void 0,
  minWidth: 25,
  maxWidth: void 0,
  savedWidth: 150,
  isResizable: true,
  isSortable: true,
  textAlign: 'text-align-right',
  canAutoResize: false,
  headerCellView: 'Ember.Table.HeaderCell',
  headerCellViewClass: Ember.computed.alias('headerCellView'),
  tableCellView: 'Ember.Table.TableCell',
  tableCellViewClass: Ember.computed.alias('tableCellView'),
  getCellContent: function(row) {
    var path;
    path = this.get('contentPath');
    Ember.assert("You must either provide a contentPath or override " + "getCellContent in your column definition", path != null);
    return Ember.get(row, path);
  },
  setCellContent: Ember.K,
  width: Ember.computed.oneWay('savedWidth'),
  resize: function(width) {
    this.set('savedWidth', width);
    return this.set('width', width);
  },
  nextColumn: null,
  prevColumn: null,
  isAtMinWidth: Ember.computed(function() {
    return this.get('width') === this.get('minWidth');
  }).property('width', 'minWidth'),
  isAtMaxWidth: Ember.computed(function() {
    return this.get('width') === this.get('maxWidth');
  }).property('width', 'maxWidth')
});


})();
(function() {


Ember.Table.Row = Ember.ObjectProxy.extend({
  content: null,
  isSelected: Ember.computed(function(key, val) {
    if (arguments.length > 1) {
      this.get('parentController').setSelected(this, val);
    }
    return this.get('parentController').isSelected(this);
  }).property('parentController.selection.[]'),
  isShowing: true,
  isHovered: false
});


})();
(function() {


Ember.Table.TableContainer = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  classNames: ['ember-table-table-container'],
  styleBindings: ['height', 'width']
});

Ember.Table.TableBlock = Ember.CollectionView.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.Table.RegisterTableComponentMixin, {
  classNames: ['ember-table-table-block'],
  styleBindings: ['width', 'height'],
  itemViewClass: Ember.computed.alias('tableComponent.tableRowViewClass'),
  columns: null,
  content: null,
  scrollLeft: null,
  onScrollLeftDidChange: Ember.observer(function() {
    return this.$().scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft'),
  height: Ember.computed(function() {
    return this.get('tableComponent._headerHeight');
  }).property('tableComponent._headerHeight')
});

Ember.Table.LazyTableBlock = Ember.LazyContainerView.extend(Ember.Table.RegisterTableComponentMixin, {
  classNames: ['ember-table-table-block'],
  styleBindings: ['width'],
  itemViewClass: Ember.computed.alias('tableComponent.tableRowViewClass'),
  rowHeight: Ember.computed.alias('tableComponent.rowHeight'),
  columns: null,
  content: null,
  scrollLeft: null,
  scrollTop: null,
  onScrollLeftDidChange: Ember.observer(function() {
    return this.$().scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft')
});

Ember.Table.TableRow = Ember.LazyItemView.extend(Ember.Table.RegisterTableComponentMixin, {
  templateName: 'table-row',
  classNames: 'ember-table-table-row',
  classNameBindings: ['row.isHovered:ember-table-hover', 'row.isSelected:ember-table-selected', 'row.rowStyle', 'isLastRow:ember-table-last-row'],
  styleBindings: ['width', 'height'],
  row: Ember.computed.alias('content'),
  columns: Ember.computed.alias('parentView.columns'),
  width: Ember.computed.alias('tableComponent._rowWidth'),
  height: Ember.computed.alias('tableComponent.rowHeight'),
  isLastRow: Ember.computed(function() {
    return this.get('row') === this.get('tableComponent.bodyContent.lastObject');
  }).property('tableComponent.bodyContent.lastObject', 'row'),
  mouseEnter: function(event) {
    var row;
    row = this.get('row');
    if (row) {
      return row.set('isHovered', true);
    }
  },
  mouseLeave: function(event) {
    var row;
    row = this.get('row');
    if (row) {
      return row.set('isHovered', false);
    }
  },
  teardownContent: function() {
    var row;
    row = this.get('row');
    if (row) {
      return row.set('isHovered', false);
    }
  }
});

Ember.Table.TableCell = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, {
  templateName: 'table-cell',
  classNames: ['ember-table-cell'],
  classNameBindings: 'column.textAlign',
  styleBindings: 'width',
  init: function() {
    this._super();
    this.contentPathDidChange();
    return this.contentDidChange();
  },
  row: Ember.computed.alias('parentView.row'),
  column: Ember.computed.alias('content'),
  width: Ember.computed.alias('column.width'),
  contentDidChange: function() {
    return this.notifyPropertyChange('cellContent');
  },
  contentPathWillChange: Ember.beforeObserver('column.contentPath', function() {
    var contentPath;
    contentPath = this.get('column.contentPath');
    if (contentPath) {
      return this.removeObserver("row." + contentPath, this, this.contentDidChange);
    }
  }),
  contentPathDidChange: Ember.beforeObserver('column.contentPath', function() {
    var contentPath;
    contentPath = this.get('column.contentPath');
    if (contentPath) {
      return this.addObserver("row." + contentPath, this, this.contentDidChange);
    }
  }),
  cellContent: Ember.computed(function(key, value) {
    var column, row;
    row = this.get('row');
    column = this.get('column');
    if (!(row && column)) {
      return;
    }
    if (arguments.length === 1) {
      value = column.getCellContent(row);
    } else {
      column.setCellContent(row, value);
    }
    return value;
  }).property('row.isLoaded', 'column')
});

Ember.Table.HeaderBlock = Ember.Table.TableBlock.extend({
  classNames: ['ember-table-header-block'],
  itemViewClass: 'Ember.Table.HeaderRow',
  content: Ember.computed(function() {
    return [this.get('columns')];
  }).property('columns')
});

Ember.Table.HeaderRow = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.Table.RegisterTableComponentMixin, {
  templateName: 'header-row',
  classNames: ['ember-table-table-row', 'ember-table-header-row'],
  styleBindings: ['width'],
  columns: Ember.computed.alias('content'),
  width: Ember.computed.alias('tableComponent._rowWidth'),
  scrollLeft: Ember.computed.alias('tableComponent._tableScrollLeft'),
  sortableOption: Ember.computed(function() {
    return {
      axis: 'x',
      containment: 'parent',
      cursor: 'move',
      helper: 'clone',
      items: ".ember-table-header-cell.sortable",
      opacity: 0.9,
      placeholder: 'ui-state-highlight',
      scroll: true,
      tolerance: 'intersect',
      update: jQuery.proxy(this.onColumnSortDone, this),
      stop: jQuery.proxy(this.onColumnSortStop, this),
      sort: jQuery.proxy(this.onColumnSortChange, this)
    };
  }),
  onScrollLeftDidChange: Ember.observer(function() {
    return this.$().scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft'),
  didInsertElement: function() {
    this._super();
    if (this.get('tableComponent.enableColumnReorder')) {
      return this.$('> div').sortable(this.get('sortableOption'));
    }
  },
  willDestroyElement: function() {
    var _ref;
    if (this.get('tableComponent.enableColumnReorder')) {
      if ((_ref = this.$('> div')) != null) {
        _ref.sortable('destroy');
      }
    }
    return this._super();
  },
  onScroll: function(event) {
    this.set('scrollLeft', event.target.scrollLeft);
    return event.preventDefault();
  },
  onColumnSortStop: function(event, ui) {
    return this.set('tableComponent._isShowingSortableIndicator', false);
  },
  onColumnSortChange: function(event, ui) {
    var left;
    left = this.$('.ui-state-highlight').offset().left - this.$().closest('.ember-table-tables-container').offset().left;
    this.set('tableComponent._isShowingSortableIndicator', true);
    return this.set('tableComponent._sortableIndicatorLeft', left);
  },
  onColumnSortDone: function(event, ui) {
    var column, newIndex, view;
    newIndex = ui.item.index();
    this.$('> div').sortable('cancel');
    view = Ember.View.views[ui.item.attr('id')];
    column = view.get('column');
    this.get('tableComponent').onColumnSort(column, newIndex);
    return this.set('tableComponent._isShowingSortableIndicator', false);
  }
});

Ember.Table.HeaderCell = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.Table.RegisterTableComponentMixin, {
  templateName: 'header-cell',
  classNames: ['ember-table-cell', 'ember-table-header-cell'],
  classNameBindings: ['column.isSortable:sortable', 'column.textAlign'],
  styleBindings: ['width', 'height'],
  column: Ember.computed.alias('content'),
  width: Ember.computed.alias('column.width'),
  minWidth: Ember.computed.alias('column.minWidth'),
  maxWidth: Ember.computed.alias('column.maxWidth'),
  nextResizableColumn: Ember.computed.alias('column.nextResizableColumn'),
  height: Ember.computed.alias('tableComponent._headerHeight'),
  effectiveMinWidth: Ember.computed(function() {
    var nextColumnMaxDiff;
    if (this.get('tableComponent.columnMode') === 'standard') {
      return this.get('minWidth');
    }
    nextColumnMaxDiff = this.get('nextResizableColumn.maxWidth') - this.get('nextResizableColumn.width');
    if (this.get('minWidth') && nextColumnMaxDiff) {
      return Math.min(this.get('minWidth'), this.get('width') - nextColumnMaxDiff);
    } else if (this.get('minWidth')) {
      return this.get('minWidth');
    } else {
      return this.get('width') - nextColumnMaxDiff;
    }
  }).property('width', 'minWidth', 'tableComponent.columnMode', 'nextResizableColumn.{width,maxWidth}'),
  effectiveMaxWidth: Ember.computed(function() {
    var nextColumnMaxDiff;
    if (this.get('tableComponent.columnMode') === 'standard') {
      return this.get('maxWidth');
    }
    nextColumnMaxDiff = this.get('nextResizableColumn.width') - this.get('nextResizableColumn.minWidth');
    if (this.get('maxWidth') && !Ember.isNone(nextColumnMaxDiff)) {
      return Math.min(this.get('maxWidth'), this.get('width') + nextColumnMaxDiff);
    } else if (this.get('maxWidth')) {
      return this.get('maxWidth');
    } else {
      return this.get('width') + nextColumnMaxDiff;
    }
  }).property('width', 'minWidth', 'tableComponent.columnMode', 'nextResizableColumn.{width,minWidth}'),
  resizableOption: Ember.computed(function() {
    return {
      handles: 'e',
      minWidth: Math.max(this.get('effectiveMinWidth') || 0, 10),
      maxWidth: this.get('effectiveMaxWidth'),
      grid: this.get('column.snapGrid'),
      resize: jQuery.proxy(this.onColumnResize, this),
      stop: jQuery.proxy(this.onColumnResize, this)
    };
  }).property('effectiveMinWidth', 'effectiveMaxWidth'),
  didInsertElement: function() {
    this.elementSizeDidChange();
    return this.recomputeResizableHandle();
  },
  willDestroyElement: function() {
    if (this.$().is('.ui-resizable')) {
      this.$().resizable('destroy');
    }
    return this._super();
  },
  _isResizable: Ember.computed(function() {
    if (this.get('tableComponent.columnMode') === 'standard') {
      return this.get('column.isResizable');
    } else {
      return this.get('column.isResizable') && this.get('nextResizableColumn');
    }
  }).property('column.isResizable', 'tableComponent.columnMode', 'nextResizableColumn'),
  onColumnResize: function(event, ui) {
    var diff, newWidth;
    newWidth = Math.round(ui.size.width);
    if (this.get('tableComponent.columnMode') === 'standard') {
      this.get('column').resize(newWidth);
      this.set('tableComponent.columnsFillTable', false);
    } else {
      diff = this.get('width') - newWidth;
      this.get('column').resize(newWidth);
      this.get('nextResizableColumn').resize(this.get('nextResizableColumn.width') + diff);
    }
    this.elementSizeDidChange();
    if (event.type === 'resizestop') {
      this.get('tableComponent').elementSizeDidChange();
    }
  },
  elementSizeDidChange: function() {
    var maxHeight;
    maxHeight = 0;
    $('.ember-table-header-block .ember-table-content').each(function() {
      var thisHeight;
      thisHeight = $(this).outerHeight();
      if (thisHeight > maxHeight) {
        return maxHeight = thisHeight;
      }
    });
    return this.set('tableComponent._contentHeaderHeight', maxHeight);
  },
  cellWidthDidChange: Ember.observer(function() {
    return Ember.run.schedule('afterRender', this, this.elementSizeDidChange);
  }, 'width'),
  resizableObserver: Ember.observer(function() {
    return this.recomputeResizableHandle();
  }, 'resizableOption', 'column.isResizable', 'tableComponent.columnMode', 'nextResizableColumn'),
  recomputeResizableHandle: function() {
    if (this.get('_isResizable')) {
      return this.$().resizable(this.get('resizableOption'));
    } else {
      if (this.$().is('.ui-resizable')) {
        return this.$().resizable('destroy');
      }
    }
  }
});

Ember.Table.ColumnSortableIndicator = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.Table.RegisterTableComponentMixin, {
  classNames: 'ember-table-column-sortable-indicator',
  classNameBindings: 'tableComponent._isShowingSortableIndicator:active',
  styleBindings: ['left', 'height'],
  left: Ember.computed.alias('tableComponent._sortableIndicatorLeft'),
  height: Ember.computed.alias('tableComponent._height')
});

Ember.Table.HeaderTableContainer = Ember.Table.TableContainer.extend(Ember.Table.ShowHorizontalScrollMixin, Ember.Table.RegisterTableComponentMixin, {
  templateName: 'header-container',
  classNames: ['ember-table-table-container', 'ember-table-fixed-table-container', 'ember-table-header-container'],
  height: Ember.computed.alias('tableComponent._headerHeight'),
  width: Ember.computed.alias('tableComponent._tableContainerWidth')
});

Ember.Table.BodyTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, Ember.TouchMoveHandlerMixin, Ember.ScrollHandlerMixin, Ember.Table.ShowHorizontalScrollMixin, Ember.Table.RegisterTableComponentMixin, {
  templateName: 'body-container',
  classNames: ['ember-table-table-container', 'ember-table-body-container', 'antiscroll-wrap'],
  height: Ember.computed.alias('tableComponent._bodyHeight'),
  width: Ember.computed.alias('tableComponent._width'),
  scrollTop: Ember.computed.alias('tableComponent._tableScrollTop'),
  scrollLeft: Ember.computed.alias('tableComponent._tableScrollLeft'),
  scrollElementSelector: '.antiscroll-inner',
  onScroll: function(event) {
    this.set('scrollTop', event.target.scrollTop);
    return event.preventDefault();
  },
  onMouseWheel: function(event, delta, deltaX, deltaY) {
    var scrollLeft;
    if (!(Math.abs(deltaX) > Math.abs(deltaY))) {
      return;
    }
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  },
  onTouchMove: function(event, deltaX, deltaY) {
    var scrollLeft;
    if (!(Math.abs(deltaX) > Math.abs(deltaY))) {
      return;
    }
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  }
});

Ember.Table.FooterTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, Ember.TouchMoveHandlerMixin, Ember.Table.ShowHorizontalScrollMixin, Ember.Table.RegisterTableComponentMixin, {
  templateName: 'footer-container',
  classNames: ['ember-table-table-container', 'ember-table-fixed-table-container', 'ember-table-footer-container'],
  styleBindings: 'top',
  height: Ember.computed.alias('tableComponent.footerHeight'),
  width: Ember.computed.alias('tableComponent._tableContainerWidth'),
  scrollLeft: Ember.computed.alias('tableComponent._tableScrollLeft'),
  top: Ember.computed(function() {
    var bodyHeight, contentHeight, headerHeight;
    headerHeight = this.get('tableComponent._headerHeight');
    contentHeight = this.get('tableComponent._tableContentHeight') + headerHeight;
    bodyHeight = this.get('tableComponent._bodyHeight') + headerHeight;
    if (contentHeight < bodyHeight) {
      return contentHeight;
    } else {
      return bodyHeight;
    }
  }).property('tableComponent._bodyHeight', 'tableComponent._headerHeight', 'tableComponent._tableContentHeight'),
  onMouseWheel: function(event, delta, deltaX, deltaY) {
    var scrollLeft;
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  },
  onTouchMove: function(event, deltaX, deltaY) {
    var scrollLeft;
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  }
});

Ember.Table.ScrollContainer = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.ScrollHandlerMixin, Ember.Table.RegisterTableComponentMixin, {
  templateName: 'scroll-container',
  classNames: ['ember-table-scroll-container'],
  styleBindings: ['left', 'width', 'height'],
  scrollElementSelector: '.antiscroll-inner',
  width: Ember.computed.alias('tableComponent._scrollContainerWidth'),
  height: 10,
  left: Ember.computed.alias('tableComponent._fixedColumnsWidth'),
  scrollTop: Ember.computed.alias('tableComponent._tableScrollTop'),
  scrollLeft: Ember.computed.alias('tableComponent._tableScrollLeft'),
  didInsertElement: function() {
    this._super();
    return this.onScrollLeftDidChange();
  },
  onScroll: function(event) {
    this.set('scrollLeft', event.target.scrollLeft);
    return event.preventDefault();
  },
  onScrollLeftDidChange: Ember.observer(function() {
    var selector;
    selector = this.get('scrollElementSelector');
    return this.$(selector).scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft', 'scrollElementSelector')
});

Ember.Table.ScrollPanel = Ember.View.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.Table.RegisterTableComponentMixin, {
  classNames: ['ember-table-scroll-panel'],
  styleBindings: ['width', 'height'],
  width: Ember.computed.alias('tableComponent._tableColumnsWidth'),
  height: Ember.computed.alias('tableComponent._tableContentHeight')
});


})();
(function() {


Ember.Table.EmberTableComponent = Ember.Component.extend(Ember.AddeparMixins.StyleBindingsMixin, Ember.AddeparMixins.ResizeHandlerMixin, {
  layoutName: 'components/ember-table',
  classNames: ['ember-table-tables-container'],
  classNameBindings: ['enableContentSelection:ember-table-content-selectable'],
  styleBindings: ['height'],
  content: null,
  columns: null,
  numFixedColumns: 0,
  numFooterRow: 0,
  rowHeight: 30,
  minHeaderHeight: 30,
  footerHeight: 30,
  hasHeader: true,
  hasFooter: true,
  enableColumnReorder: true,
  enableContentSelection: false,
  columnMode: 'standard',
  selectionMode: 'single',
  selection: Ember.computed(function(key, val) {
    var selection, selectionMode;
    selectionMode = this.get('selectionMode');
    if (arguments.length > 1 && val) {
      this.get('persistedSelection').clear();
      this.get('rangeSelection').clear();
      switch (selectionMode) {
        case 'single':
          this.get('persistedSelection').addObject(val);
          break;
        case 'multiple':
          this.get('persistedSelection').addObjects(val);
      }
    }
    selection = this.get('persistedSelection').copy().addObjects(this.get('rangeSelection'));
    switch (selectionMode) {
      case 'none':
        return null;
      case 'single':
        return selection[0] || null;
      case 'multiple':
        return selection;
    }
  }).property('persistedSelection.[]', 'rangeSelection.[]', 'selectionMode'),
  isEmberTable: true,
  columnsFillTable: true,
  init: function() {
    this._super();
    if (!$.ui) {
      throw 'Missing dependency: jquery-ui';
    }
    if (!$().mousewheel) {
      throw 'Missing dependency: jquery-mousewheel';
    }
    if (!$().antiscroll) {
      throw 'Missing dependency: antiscroll.js';
    }
    return this.prepareTableColumns();
  },
  actions: {
    addColumn: Ember.K,
    sortByColumn: Ember.K
  },
  height: Ember.computed.alias('_tablesContainerHeight'),
  tableRowView: 'Ember.Table.TableRow',
  tableRowViewClass: Ember.computed.alias('tableRowView'),
  onColumnSort: function(column, newIndex) {
    var columns, numFixedColumns;
    numFixedColumns = this.get('fixedColumns.length');
    columns = this.get('columns');
    columns.removeObject(column);
    columns.insertAt(numFixedColumns + newIndex, column);
    return this.prepareTableColumns();
  },
  bodyContent: Ember.computed(function() {
    return Ember.Table.RowArrayController.create({
      target: this,
      parentController: this,
      container: this.get('container'),
      itemController: Ember.Table.Row,
      content: this.get('content')
    });
  }).property('content'),
  footerContent: Ember.computed(function(key, value) {
    if (value) {
      return value;
    } else {
      return Ember.A();
    }
  }).property(),
  fixedColumns: Ember.computed(function() {
    var columns, numFixedColumns;
    columns = this.get('columns');
    if (!columns) {
      return Ember.A();
    }
    numFixedColumns = this.get('numFixedColumns') || 0;
    return columns.slice(0, numFixedColumns) || [];
  }).property('columns.@each', 'numFixedColumns'),
  tableColumns: Ember.computed(function() {
    var columns, numFixedColumns;
    columns = this.get('columns');
    if (!columns) {
      return Ember.A();
    }
    numFixedColumns = this.get('numFixedColumns') || 0;
    return columns.slice(numFixedColumns, columns.get('length')) || [];
  }).property('columns.@each', 'numFixedColumns'),
  prepareTableColumns: function() {
    var col, columns, i, _i, _len, _results;
    columns = this.get('columns') || Ember.A();
    columns.setEach('controller', this);
    _results = [];
    for (i = _i = 0, _len = columns.length; _i < _len; i = ++_i) {
      col = columns[i];
      _results.push(col.set('nextResizableColumn', this.getNextResizableColumn(columns, i)));
    }
    return _results;
  },
  getNextResizableColumn: function(columns, index) {
    var column;
    while (index < columns.length) {
      index += 1;
      column = columns.objectAt(index);
      if (column != null ? column.get('isResizable') : void 0) {
        return column;
      }
    }
    return null;
  },
  didInsertElement: function() {
    this._super();
    this.set('_tableScrollTop', 0);
    this.elementSizeDidChange();
    return this.doForceFillColumns();
  },
  onResizeEnd: function() {
    if (this.tableWidthNowTooSmall()) {
      this.set('columnsFillTable', true);
    }
    return Ember.run(this, this.elementSizeDidChange);
  },
  elementSizeDidChange: function() {
    if ((this.get('_state') || this.get('state')) !== 'inDOM') {
      return;
    }
    this.set('_width', this.$().parent().outerWidth());
    this.set('_height', this.$().parent().outerHeight());
    return Ember.run.next(this, this.updateLayout);
  },
  tableWidthNowTooSmall: function() {
    var newTableWidth, oldTableWidth, totalColumnWidth;
    if ((this.get('_state') || this.get('state')) !== 'inDOM') {
      return false;
    }
    oldTableWidth = this.get('_width');
    newTableWidth = this.$().parent().outerWidth();
    totalColumnWidth = this._getTotalWidth(this.get('tableColumns'));
    return (oldTableWidth > totalColumnWidth) && (newTableWidth < totalColumnWidth);
  },
  expandResizeableColumnsToFillTable: function() {
    var fixedColumnsWidth, tableColumns, totalResizableWidth, totalWidth, unresizableColumns, unresizableWidth;
    totalWidth = this.get('_width');
    fixedColumnsWidth = this.get('_fixedColumnsWidth');
    tableColumns = this.get('tableColumns');
    unresizableColumns = tableColumns.filterProperty('canAutoResize', false);
    unresizableWidth = this._getTotalWidth(unresizableColumns);
    return totalResizableWidth = totalWidth - unresizableWidth;
  },
  updateLayout: function() {
    if ((this.get('_state') || this.get('state')) !== 'inDOM') {
      return;
    }
    this.$('.antiscroll-wrap').antiscroll().data('antiscroll').rebuild();
    if (this.get('columnsFillTable')) {
      return this.doForceFillColumns();
    }
  },
  doForceFillColumns: function() {
    var allColumns, availableWidth, columnsToResize, doNextLoop, nextColumnsToResize, totalResizableWidth, unresizableColumns, _results,
      _this = this;
    allColumns = this.get('columns');
    columnsToResize = allColumns.filterProperty('canAutoResize');
    unresizableColumns = allColumns.filterProperty('canAutoResize', false);
    availableWidth = this.get('_width') - this._getTotalWidth(unresizableColumns);
    doNextLoop = true;
    _results = [];
    while (doNextLoop) {
      doNextLoop = false;
      nextColumnsToResize = [];
      totalResizableWidth = this._getTotalWidth(columnsToResize);
      columnsToResize.forEach(function(column) {
        var newWidth;
        newWidth = Math.floor((column.get('width') / totalResizableWidth) * availableWidth);
        if (newWidth < column.get('minWidth')) {
          doNextLoop = true;
          column.set('width', column.get('minWidth'));
          return availableWidth -= column.get('width');
        } else if (newWidth > column.get('maxWidth')) {
          doNextLoop = true;
          column.set('width', column.get('maxWidth'));
          return availableWidth -= column.get('width');
        } else {
          column.set('width', newWidth);
          return nextColumnsToResize.pushObject(column);
        }
      });
      _results.push(columnsToResize = nextColumnsToResize);
    }
    return _results;
  },
  onBodyContentLengthDidChange: Ember.observer(function() {
    return Ember.run.next(this, function() {
      return Ember.run.once(this, this.updateLayout);
    });
  }, 'bodyContent.length'),
  _tableScrollTop: 0,
  _tableScrollLeft: 0,
  _width: null,
  _height: null,
  _contentHeaderHeight: null,
  _hasVerticalScrollbar: Ember.computed(function() {
    var contentHeight, height;
    height = this.get('_height');
    contentHeight = this.get('_tableContentHeight') + this.get('_headerHeight') + this.get('_footerHeight');
    if (height < contentHeight) {
      return true;
    } else {
      return false;
    }
  }).property('_height', '_tableContentHeight', '_headerHeight', '_footerHeight'),
  _hasHorizontalScrollbar: Ember.computed(function() {
    var contentWidth, tableWidth;
    contentWidth = this.get('_tableColumnsWidth');
    tableWidth = this.get('_width') - this.get('_fixedColumnsWidth');
    if (contentWidth > tableWidth) {
      return true;
    } else {
      return false;
    }
  }).property('_tableColumnsWidth', '_width', '_fixedColumnsWidth'),
  _tablesContainerHeight: Ember.computed(function() {
    var contentHeight, height;
    height = this.get('_height');
    contentHeight = this.get('_tableContentHeight') + this.get('_headerHeight') + this.get('_footerHeight');
    if (contentHeight < height) {
      return contentHeight;
    } else {
      return height;
    }
  }).property('_height', '_tableContentHeight', '_headerHeight', '_footerHeight'),
  _fixedColumnsWidth: Ember.computed(function() {
    return this._getTotalWidth(this.get('fixedColumns'));
  }).property('fixedColumns.@each.width'),
  _tableColumnsWidth: Ember.computed(function() {
    var availableWidth, contentWidth;
    contentWidth = this._getTotalWidth(this.get('tableColumns')) + 3;
    availableWidth = this.get('_width') - this.get('_fixedColumnsWidth');
    if (contentWidth > availableWidth) {
      return contentWidth;
    } else {
      return availableWidth;
    }
  }).property('tableColumns.@each.width', '_width', '_fixedColumnsWidth'),
  _rowWidth: Ember.computed(function() {
    var columnsWidth, nonFixedTableWidth;
    columnsWidth = this.get('_tableColumnsWidth');
    nonFixedTableWidth = this.get('_tableContainerWidth') - this.get('_fixedColumnsWidth');
    if (columnsWidth < nonFixedTableWidth) {
      return nonFixedTableWidth;
    }
    return columnsWidth;
  }).property('_fixedColumnsWidth', '_tableColumnsWidth', '_tableContainerWidth'),
  _headerHeight: Ember.computed(function() {
    var contentHeaderHeight, minHeight;
    minHeight = this.get('minHeaderHeight');
    contentHeaderHeight = this.get('_contentHeaderHeight');
    if (contentHeaderHeight < minHeight) {
      return minHeight;
    } else {
      return contentHeaderHeight;
    }
  }).property('_contentHeaderHeight', 'minHeaderHeight'),
  _footerHeight: Ember.computed(function() {
    if (this.get('hasFooter')) {
      return this.get('footerHeight');
    } else {
      return 0;
    }
  }).property('footerHeight', 'hasFooter'),
  _bodyHeight: Ember.computed(function() {
    var bodyHeight;
    bodyHeight = this.get('_tablesContainerHeight');
    if (this.get('hasHeader')) {
      bodyHeight -= this.get('_headerHeight');
    }
    if (this.get('hasFooter')) {
      bodyHeight -= this.get('footerHeight');
    }
    return bodyHeight;
  }).property('_tablesContainerHeight', '_hasHorizontalScrollbar', '_headerHeight', 'footerHeight', 'hasHeader', 'hasFooter'),
  _tableBlockWidth: Ember.computed(function() {
    return this.get('_width') - this.get('_fixedColumnsWidth');
  }).property('_width', '_fixedColumnsWidth'),
  _fixedBlockWidthBinding: '_fixedColumnsWidth',
  _tableContentHeight: Ember.computed(function() {
    return this.get('rowHeight') * this.get('bodyContent.length');
  }).property('rowHeight', 'bodyContent.length'),
  _tableContainerWidth: Ember.computed(function() {
    return this.get('_width');
  }).property('_width'),
  _scrollContainerWidth: Ember.computed(function() {
    return this.get('_width') - this.get('_fixedColumnsWidth');
  }).property('_width', '_fixedColumnsWidth'),
  _numItemsShowing: Ember.computed(function() {
    return Math.floor(this.get('_bodyHeight') / this.get('rowHeight'));
  }).property('_bodyHeight', 'rowHeight'),
  _startIndex: Ember.computed(function() {
    var index, numContent, numViews, rowHeight, scrollTop;
    numContent = this.get('bodyContent.length');
    numViews = this.get('_numItemsShowing');
    rowHeight = this.get('rowHeight');
    scrollTop = this.get('_tableScrollTop');
    index = Math.floor(scrollTop / rowHeight);
    if (index + numViews >= numContent) {
      index = numContent - numViews;
    }
    if (index < 0) {
      return 0;
    } else {
      return index;
    }
  }).property('bodyContent.length', '_numItemsShowing', 'rowHeight', '_tableScrollTop'),
  _getTotalWidth: function(columns, columnWidthPath) {
    var widths;
    if (columnWidthPath == null) {
      columnWidthPath = 'width';
    }
    if (!columns) {
      return 0;
    }
    widths = columns.getEach(columnWidthPath) || [];
    return widths.reduce((function(total, w) {
      return total + w;
    }), 0);
  },
  lastSelected: null,
  isSelected: function(row) {
    switch (this.get('selectionMode')) {
      case 'none':
        return false;
      case 'single':
        return this.get('selection') === row.get('content');
      case 'multiple':
        return this.get('selection').contains(row.get('content'));
    }
  },
  setSelected: function(row, val) {
    var item;
    this.persistSelection();
    item = row.get('content');
    if (val) {
      return this.get('persistedSelection').addObject(item);
    } else {
      return this.get('persistedSelection').removeObject(item);
    }
  },
  persistedSelection: Ember.computed(function() {
    return Ember.A();
  }),
  rangeSelection: Ember.computed(function() {
    return Ember.A();
  }),
  click: function(event) {
    var curIndex, item, lastIndex, maxIndex, minIndex, row;
    row = this.getRowForEvent(event);
    item = row != null ? row.get('content') : void 0;
    if (!item) {
      return;
    }
    switch (this.get('selectionMode')) {
      case 'none':
        break;
      case 'single':
        this.get('persistedSelection').clear();
        return this.get('persistedSelection').addObject(item);
      case 'multiple':
        if (event.shiftKey) {
          this.get('rangeSelection').clear();
          lastIndex = this.rowIndex(this.get('lastSelected'));
          if (lastIndex === -1) {
            lastIndex = 0;
          }
          curIndex = this.rowIndex(this.getRowForEvent(event));
          minIndex = Math.min(lastIndex, curIndex);
          maxIndex = Math.max(lastIndex, curIndex);
          return this.get('rangeSelection').addObjects(this.get('bodyContent').slice(minIndex, maxIndex + 1).mapBy('content'));
        } else {
          if (!event.ctrlKey && !event.metaKey) {
            this.get('persistedSelection').clear();
            this.get('rangeSelection').clear();
          } else {
            this.persistSelection();
          }
          if (this.get('persistedSelection').contains(item)) {
            this.get('persistedSelection').removeObject(item);
          } else {
            this.get('persistedSelection').addObject(item);
          }
          return this.set('lastSelected', row);
        }
    }
  },
  findRow: function(content) {
    var row, _i, _len, _ref;
    _ref = this.get('bodyContent');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      if (row.get('content') === content) {
        return row;
      }
    }
  },
  rowIndex: function(row) {
    var _ref;
    return (_ref = this.get('bodyContent')) != null ? _ref.indexOf(row) : void 0;
  },
  persistSelection: function() {
    this.get('persistedSelection').addObjects(this.get('rangeSelection'));
    return this.get('rangeSelection').clear();
  },
  getRowForEvent: function(event) {
    var $rowView, view;
    $rowView = $(event.target).parents('.ember-table-table-row');
    view = Ember.View.views[$rowView.attr('id')];
    if (view) {
      return view.get('row');
    }
  }
});

Ember.Handlebars.helper('table-component', Ember.Table.EmberTableComponent);


})();

})();
(function() {

/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0));};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p;}}
return null;};Date.prototype.clone=function(){return new Date(this.getTime());};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}
if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0;}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0);};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime();};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000);};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000);};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000);};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000);};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000);};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this;};Date.prototype.addYears=function(value){return this.addMonths(value*12);};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds);}
if(x.second||x.seconds){this.addSeconds(x.second||x.seconds);}
if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes);}
if(x.hour||x.hours){this.addHours(x.hour||x.hours);}
if(x.month||x.months){this.addMonths(x.month||x.months);}
if(x.year||x.years){this.addYears(x.year||x.years);}
if(x.day||x.days){this.addDays(x.day||x.days);}
return this;};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}
return true;};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds");};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds");};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes");};Date.validateHour=function(n){return Date._validate(n,0,23,"hours");};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days");};Date.validateMonth=function(n){return Date._validate(n,0,11,"months");};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds");};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1;}
if(!x.second&&x.second!==0){x.second=-1;}
if(!x.minute&&x.minute!==0){x.minute=-1;}
if(!x.hour&&x.hour!==0){x.hour=-1;}
if(!x.day&&x.day!==0){x.day=-1;}
if(!x.month&&x.month!==0){x.month=-1;}
if(!x.year&&x.year!==0){x.year=-1;}
if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds());}
if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds());}
if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes());}
if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours());}
if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth());}
if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear());}
if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate());}
if(x.timezone){this.setTimezone(x.timezone);}
if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset);}
return this;};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0));};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun());};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth());};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1});};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()});};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000);};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1;}
var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53;}else{w=52;}}
return w;};Date.prototype.isDST=function(){console.log('isDST');return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D";};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST());};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this;};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s));};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()];};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()];};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s;};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return"";}}):this._toString();};
Date.now=function(){return new Date();};Date.today=function(){return Date.now().clearTime();};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this;};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this;};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this;};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c);};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c);};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
return this.moveToDayOfWeek(n,this._orient);};};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ");};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1));};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
if(this.now){return new Date();}
var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
if(this.unit=="week"){this.unit="day";this.value=this.value*7;}
this[this.unit+"s"]=this.value*orient;}
return today.add(this);}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour;}
if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate();}
if(this.month&&!this.day){this.day=1;}
return today.set(this);}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null;}
try{r=Date.Grammar.start.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s);};


})();
(function() {

d3 = function() {
  var d3 = {
    version: "3.2.7"
  };
  if (!Date.now) Date.now = function() {
    return +new Date();
  };
  var d3_document = document, d3_documentElement = d3_document.documentElement, d3_window = window;
  try {
    d3_document.createElement("div").style.setProperty("opacity", 0, "");
  } catch (error) {
    var d3_element_prototype = d3_window.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = d3_window.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
    d3_element_prototype.setAttribute = function(name, value) {
      d3_element_setAttribute.call(this, name, value + "");
    };
    d3_element_prototype.setAttributeNS = function(space, local, value) {
      d3_element_setAttributeNS.call(this, space, local, value + "");
    };
    d3_style_prototype.setProperty = function(name, value, priority) {
      d3_style_setProperty.call(this, name, value + "", priority);
    };
  }
  d3.ascending = function(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  };
  d3.descending = function(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  };
  d3.min = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    } else {
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }
    return a;
  };
  d3.max = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    } else {
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }
    return a;
  };
  d3.extent = function(array, f) {
    var i = -1, n = array.length, a, b, c;
    if (arguments.length === 1) {
      while (++i < n && !((a = c = array[i]) != null && a <= a)) a = c = undefined;
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    } else {
      while (++i < n && !((a = c = f.call(array, array[i], i)) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }
    return [ a, c ];
  };
  d3.sum = function(array, f) {
    var s = 0, n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (!isNaN(a = +array[i])) s += a;
    } else {
      while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;
    }
    return s;
  };
  function d3_number(x) {
    return x != null && !isNaN(x);
  }
  d3.mean = function(array, f) {
    var n = array.length, a, m = 0, i = -1, j = 0;
    if (arguments.length === 1) {
      while (++i < n) if (d3_number(a = array[i])) m += (a - m) / ++j;
    } else {
      while (++i < n) if (d3_number(a = f.call(array, array[i], i))) m += (a - m) / ++j;
    }
    return j ? m : undefined;
  };
  d3.quantile = function(values, p) {
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
    return e ? v + e * (values[h] - v) : v;
  };
  d3.median = function(array, f) {
    if (arguments.length > 1) array = array.map(f);
    array = array.filter(d3_number);
    return array.length ? d3.quantile(array.sort(d3.ascending), .5) : undefined;
  };
  d3.bisector = function(f) {
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (f.call(a, a[mid], mid) < x) lo = mid + 1; else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (x < f.call(a, a[mid], mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
      }
    };
  };
  var d3_bisector = d3.bisector(function(d) {
    return d;
  });
  d3.bisectLeft = d3_bisector.left;
  d3.bisect = d3.bisectRight = d3_bisector.right;
  d3.shuffle = function(array) {
    var m = array.length, t, i;
    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m], array[m] = array[i], array[i] = t;
    }
    return array;
  };
  d3.permute = function(array, indexes) {
    var permutes = [], i = -1, n = indexes.length;
    while (++i < n) permutes[i] = array[indexes[i]];
    return permutes;
  };
  d3.zip = function() {
    if (!(n = arguments.length)) return [];
    for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m; ) {
      for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n; ) {
        zip[j] = arguments[j][i];
      }
    }
    return zips;
  };
  function d3_zipLength(d) {
    return d.length;
  }
  d3.transpose = function(matrix) {
    return d3.zip.apply(d3, matrix);
  };
  d3.keys = function(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  };
  d3.values = function(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  };
  d3.entries = function(map) {
    var entries = [];
    for (var key in map) entries.push({
      key: key,
      value: map[key]
    });
    return entries;
  };
  d3.merge = function(arrays) {
    return Array.prototype.concat.apply([], arrays);
  };
  d3.range = function(start, stop, step) {
    if (arguments.length < 3) {
      step = 1;
      if (arguments.length < 2) {
        stop = start;
        start = 0;
      }
    }
    if ((stop - start) / step === Infinity) throw new Error("infinite range");
    var range = [], k = d3_range_integerScale(Math.abs(step)), i = -1, j;
    start *= k, stop *= k, step *= k;
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
    return range;
  };
  function d3_range_integerScale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }
  function d3_class(ctor, properties) {
    try {
      for (var key in properties) {
        Object.defineProperty(ctor.prototype, key, {
          value: properties[key],
          enumerable: false
        });
      }
    } catch (e) {
      ctor.prototype = properties;
    }
  }
  d3.map = function(object) {
    var map = new d3_Map();
    for (var key in object) map.set(key, object[key]);
    return map;
  };
  function d3_Map() {}
  d3_class(d3_Map, {
    has: function(key) {
      return d3_map_prefix + key in this;
    },
    get: function(key) {
      return this[d3_map_prefix + key];
    },
    set: function(key, value) {
      return this[d3_map_prefix + key] = value;
    },
    remove: function(key) {
      key = d3_map_prefix + key;
      return key in this && delete this[key];
    },
    keys: function() {
      var keys = [];
      this.forEach(function(key) {
        keys.push(key);
      });
      return keys;
    },
    values: function() {
      var values = [];
      this.forEach(function(key, value) {
        values.push(value);
      });
      return values;
    },
    entries: function() {
      var entries = [];
      this.forEach(function(key, value) {
        entries.push({
          key: key,
          value: value
        });
      });
      return entries;
    },
    forEach: function(f) {
      for (var key in this) {
        if (key.charCodeAt(0) === d3_map_prefixCode) {
          f.call(this, key.substring(1), this[key]);
        }
      }
    }
  });
  var d3_map_prefix = "\0", d3_map_prefixCode = d3_map_prefix.charCodeAt(0);
  d3.nest = function() {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;
      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
          values.push(object);
        } else {
          valuesByKey.set(keyValue, [ object ]);
        }
      }
      if (mapType) {
        object = mapType();
        setter = function(keyValue, values) {
          object.set(keyValue, map(mapType, values, depth));
        };
      } else {
        object = {};
        setter = function(keyValue, values) {
          object[keyValue] = map(mapType, values, depth);
        };
      }
      valuesByKey.forEach(setter);
      return object;
    }
    function entries(map, depth) {
      if (depth >= keys.length) return map;
      var array = [], sortKey = sortKeys[depth++];
      map.forEach(function(key, keyMap) {
        array.push({
          key: key,
          values: entries(keyMap, depth)
        });
      });
      return sortKey ? array.sort(function(a, b) {
        return sortKey(a.key, b.key);
      }) : array;
    }
    nest.map = function(array, mapType) {
      return map(mapType, array, 0);
    };
    nest.entries = function(array) {
      return entries(map(d3.map, array, 0), 0);
    };
    nest.key = function(d) {
      keys.push(d);
      return nest;
    };
    nest.sortKeys = function(order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    };
    nest.sortValues = function(order) {
      sortValues = order;
      return nest;
    };
    nest.rollup = function(f) {
      rollup = f;
      return nest;
    };
    return nest;
  };
  d3.set = function(array) {
    var set = new d3_Set();
    if (array) for (var i = 0; i < array.length; i++) set.add(array[i]);
    return set;
  };
  function d3_Set() {}
  d3_class(d3_Set, {
    has: function(value) {
      return d3_map_prefix + value in this;
    },
    add: function(value) {
      this[d3_map_prefix + value] = true;
      return value;
    },
    remove: function(value) {
      value = d3_map_prefix + value;
      return value in this && delete this[value];
    },
    values: function() {
      var values = [];
      this.forEach(function(value) {
        values.push(value);
      });
      return values;
    },
    forEach: function(f) {
      for (var value in this) {
        if (value.charCodeAt(0) === d3_map_prefixCode) {
          f.call(this, value.substring(1));
        }
      }
    }
  });
  d3.behavior = {};
  d3.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
  };
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  function d3_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.substring(1);
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
      var prefixName = d3_vendorPrefixes[i] + name;
      if (prefixName in object) return prefixName;
    }
  }
  var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
  var d3_array = d3_arraySlice;
  function d3_arrayCopy(pseudoarray) {
    var i = -1, n = pseudoarray.length, array = [];
    while (++i < n) array.push(pseudoarray[i]);
    return array;
  }
  function d3_arraySlice(pseudoarray) {
    return Array.prototype.slice.call(pseudoarray);
  }
  try {
    d3_array(d3_documentElement.childNodes)[0].nodeType;
  } catch (e) {
    d3_array = d3_arrayCopy;
  }
  function d3_noop() {}
  d3.dispatch = function() {
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    return dispatch;
  };
  function d3_dispatch() {}
  d3_dispatch.prototype.on = function(type, listener) {
    var i = type.indexOf("."), name = "";
    if (i >= 0) {
      name = type.substring(i + 1);
      type = type.substring(0, i);
    }
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
    if (arguments.length === 2) {
      if (listener == null) for (type in this) {
        if (this.hasOwnProperty(type)) this[type].on(name, null);
      }
      return this;
    }
  };
  function d3_dispatch_event(dispatch) {
    var listeners = [], listenerByName = new d3_Map();
    function event() {
      var z = listeners, i = -1, n = z.length, l;
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
      return dispatch;
    }
    event.on = function(name, listener) {
      var l = listenerByName.get(name), i;
      if (arguments.length < 2) return l && l.on;
      if (l) {
        l.on = null;
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
        listenerByName.remove(name);
      }
      if (listener) listeners.push(listenerByName.set(name, {
        on: listener
      }));
      return dispatch;
    };
    return event;
  }
  d3.event = null;
  function d3_eventPreventDefault() {
    d3.event.preventDefault();
  }
  function d3_eventSource() {
    var e = d3.event, s;
    while (s = e.sourceEvent) e = s;
    return e;
  }
  function d3_eventDispatch(target) {
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    dispatch.of = function(thiz, argumentz) {
      return function(e1) {
        try {
          var e0 = e1.sourceEvent = d3.event;
          e1.target = target;
          d3.event = e1;
          dispatch[e1.type].apply(thiz, argumentz);
        } finally {
          d3.event = e0;
        }
      };
    };
    return dispatch;
  }
  d3.requote = function(s) {
    return s.replace(d3_requote_re, "\\$&");
  };
  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  var d3_subclass = {}.__proto__ ? function(object, prototype) {
    object.__proto__ = prototype;
  } : function(object, prototype) {
    for (var property in prototype) object[property] = prototype[property];
  };
  function d3_selection(groups) {
    d3_subclass(groups, d3_selectionPrototype);
    return groups;
  }
  var d3_select = function(s, n) {
    return n.querySelector(s);
  }, d3_selectAll = function(s, n) {
    return n.querySelectorAll(s);
  }, d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")], d3_selectMatches = function(n, s) {
    return d3_selectMatcher.call(n, s);
  };
  if (typeof Sizzle === "function") {
    d3_select = function(s, n) {
      return Sizzle(s, n)[0] || null;
    };
    d3_selectAll = function(s, n) {
      return Sizzle.uniqueSort(Sizzle(s, n));
    };
    d3_selectMatches = Sizzle.matchesSelector;
  }
  d3.selection = function() {
    return d3_selectionRoot;
  };
  var d3_selectionPrototype = d3.selection.prototype = [];
  d3_selectionPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, group, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selector(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_select(selector, this);
    };
  }
  d3_selectionPrototype.selectAll = function(selector) {
    var subgroups = [], subgroup, node;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
          subgroup.parentNode = node;
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selectorAll(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_selectAll(selector, this);
    };
  }
  var d3_nsPrefix = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  d3.ns = {
    prefix: d3_nsPrefix,
    qualify: function(name) {
      var i = name.indexOf(":"), prefix = name;
      if (i >= 0) {
        prefix = name.substring(0, i);
        name = name.substring(i + 1);
      }
      return d3_nsPrefix.hasOwnProperty(prefix) ? {
        space: d3_nsPrefix[prefix],
        local: name
      } : name;
    }
  };
  d3_selectionPrototype.attr = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node();
        name = d3.ns.qualify(name);
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
      }
      for (value in name) this.each(d3_selection_attr(value, name[value]));
      return this;
    }
    return this.each(d3_selection_attr(name, value));
  };
  function d3_selection_attr(name, value) {
    name = d3.ns.qualify(name);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrConstant() {
      this.setAttribute(name, value);
    }
    function attrConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }
    function attrFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
    }
    function attrFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
    }
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
  }
  function d3_collapse(s) {
    return s.trim().replace(/\s+/g, " ");
  }
  d3_selectionPrototype.classed = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node(), n = (name = name.trim().split(/^|\s+/g)).length, i = -1;
        if (value = node.classList) {
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
        }
        return true;
      }
      for (value in name) this.each(d3_selection_classed(value, name[value]));
      return this;
    }
    return this.each(d3_selection_classed(name, value));
  };
  function d3_selection_classedRe(name) {
    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
  }
  function d3_selection_classed(name, value) {
    name = name.trim().split(/\s+/).map(d3_selection_classedName);
    var n = name.length;
    function classedConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }
    function classedFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }
    return typeof value === "function" ? classedFunction : classedConstant;
  }
  function d3_selection_classedName(name) {
    var re = d3_selection_classedRe(name);
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
      } else {
        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
      }
    };
  }
  d3_selectionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
        return this;
      }
      if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);
      priority = "";
    }
    return this.each(d3_selection_style(name, value, priority));
  };
  function d3_selection_style(name, value, priority) {
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleConstant() {
      this.style.setProperty(name, value, priority);
    }
    function styleFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
    }
    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
  }
  d3_selectionPrototype.property = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") return this.node()[name];
      for (value in name) this.each(d3_selection_property(value, name[value]));
      return this;
    }
    return this.each(d3_selection_property(name, value));
  };
  function d3_selection_property(name, value) {
    function propertyNull() {
      delete this[name];
    }
    function propertyConstant() {
      this[name] = value;
    }
    function propertyFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name]; else this[name] = x;
    }
    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
  }
  d3_selectionPrototype.text = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    } : value == null ? function() {
      this.textContent = "";
    } : function() {
      this.textContent = value;
    }) : this.node().textContent;
  };
  d3_selectionPrototype.html = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    } : value == null ? function() {
      this.innerHTML = "";
    } : function() {
      this.innerHTML = value;
    }) : this.node().innerHTML;
  };
  d3_selectionPrototype.append = function(name) {
    name = d3_selection_creator(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  };
  function d3_selection_creator(name) {
    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? function() {
      return d3_document.createElementNS(name.space, name.local);
    } : function() {
      return d3_document.createElementNS(this.namespaceURI, name);
    };
  }
  d3_selectionPrototype.insert = function(name, before) {
    name = d3_selection_creator(name);
    before = d3_selection_selector(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments));
    });
  };
  d3_selectionPrototype.remove = function() {
    return this.each(function() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    });
  };
  d3_selectionPrototype.data = function(value, key) {
    var i = -1, n = this.length, group, node;
    if (!arguments.length) {
      value = new Array(n = (group = this[0]).length);
      while (++i < n) {
        if (node = group[i]) {
          value[i] = node.__data__;
        }
      }
      return value;
    }
    function bind(group, groupData) {
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
      if (key) {
        var nodeByKeyValue = new d3_Map(), dataByKeyValue = new d3_Map(), keyValues = [], keyValue;
        for (i = -1; ++i < n; ) {
          keyValue = key.call(node = group[i], node.__data__, i);
          if (nodeByKeyValue.has(keyValue)) {
            exitNodes[i] = node;
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
          keyValues.push(keyValue);
        }
        for (i = -1; ++i < m; ) {
          keyValue = key.call(groupData, nodeData = groupData[i], i);
          if (node = nodeByKeyValue.get(keyValue)) {
            updateNodes[i] = node;
            node.__data__ = nodeData;
          } else if (!dataByKeyValue.has(keyValue)) {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
          dataByKeyValue.set(keyValue, nodeData);
          nodeByKeyValue.remove(keyValue);
        }
        for (i = -1; ++i < n; ) {
          if (nodeByKeyValue.has(keyValues[i])) {
            exitNodes[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0; ) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateNodes[i] = node;
          } else {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
        }
        for (;i < m; ++i) {
          enterNodes[i] = d3_selection_dataNode(groupData[i]);
        }
        for (;i < n; ++i) {
          exitNodes[i] = group[i];
        }
      }
      enterNodes.update = updateNodes;
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
      enter.push(enterNodes);
      update.push(updateNodes);
      exit.push(exitNodes);
    }
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
    if (typeof value === "function") {
      while (++i < n) {
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
      }
    } else {
      while (++i < n) {
        bind(group = this[i], value);
      }
    }
    update.enter = function() {
      return enter;
    };
    update.exit = function() {
      return exit;
    };
    return update;
  };
  function d3_selection_dataNode(data) {
    return {
      __data__: data
    };
  }
  d3_selectionPrototype.datum = function(value) {
    return arguments.length ? this.property("__data__", value) : this.property("__data__");
  };
  d3_selectionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i)) {
          subgroup.push(node);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_filter(selector) {
    return function() {
      return d3_selectMatches(this, selector);
    };
  }
  d3_selectionPrototype.order = function() {
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  };
  d3_selectionPrototype.sort = function(comparator) {
    comparator = d3_selection_sortComparator.apply(this, arguments);
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
    return this.order();
  };
  function d3_selection_sortComparator(comparator) {
    if (!arguments.length) comparator = d3.ascending;
    return function(a, b) {
      return !a - !b || comparator(a.__data__, b.__data__);
    };
  }
  d3_selectionPrototype.each = function(callback) {
    return d3_selection_each(this, function(node, i, j) {
      callback.call(node, node.__data__, i, j);
    });
  };
  function d3_selection_each(groups, callback) {
    for (var j = 0, m = groups.length; j < m; j++) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
        if (node = group[i]) callback(node, i, j);
      }
    }
    return groups;
  }
  d3_selectionPrototype.call = function(callback) {
    var args = d3_array(arguments);
    callback.apply(args[0] = this, args);
    return this;
  };
  d3_selectionPrototype.empty = function() {
    return !this.node();
  };
  d3_selectionPrototype.node = function() {
    for (var j = 0, m = this.length; j < m; j++) {
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  };
  d3_selectionPrototype.size = function() {
    var n = 0;
    this.each(function() {
      ++n;
    });
    return n;
  };
  function d3_selection_enter(selection) {
    d3_subclass(selection, d3_selection_enterPrototype);
    return selection;
  }
  var d3_selection_enterPrototype = [];
  d3.selection.enter = d3_selection_enter;
  d3.selection.enter.prototype = d3_selection_enterPrototype;
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
  d3_selection_enterPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, upgroup, group, node;
    for (var j = -1, m = this.length; ++j < m; ) {
      upgroup = (group = this[j]).update;
      subgroups.push(subgroup = []);
      subgroup.parentNode = group.parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
          subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  d3_selection_enterPrototype.insert = function(name, before) {
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
    return d3_selectionPrototype.insert.call(this, name, before);
  };
  function d3_selection_enterInsertBefore(enter) {
    var i0, j0;
    return function(d, i, j) {
      var group = enter[j].update, n = group.length, node;
      if (j != j0) j0 = j, i0 = 0;
      if (i >= i0) i0 = i + 1;
      while (!(node = group[i0]) && ++i0 < n) ;
      return node;
    };
  }
  d3_selectionPrototype.transition = function() {
    var id = d3_transitionInheritId || ++d3_transitionId, subgroups = [], subgroup, node, transition = d3_transitionInherit || {
      time: Date.now(),
      ease: d3_ease_cubicInOut,
      delay: 0,
      duration: 250
    };
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) d3_transitionNode(node, i, id, transition);
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, id);
  };
  d3.select = function(node) {
    var group = [ typeof node === "string" ? d3_select(node, d3_document) : node ];
    group.parentNode = d3_documentElement;
    return d3_selection([ group ]);
  };
  d3.selectAll = function(nodes) {
    var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
    group.parentNode = d3_documentElement;
    return d3_selection([ group ]);
  };
  var d3_selectionRoot = d3.select(d3_documentElement);
  d3_selectionPrototype.on = function(type, listener, capture) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof type !== "string") {
        if (n < 2) listener = false;
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
        return this;
      }
      if (n < 2) return (n = this.node()["__on" + type]) && n._;
      capture = false;
    }
    return this.each(d3_selection_on(type, listener, capture));
  };
  function d3_selection_on(type, listener, capture) {
    var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
    if (i > 0) type = type.substring(0, i);
    var filter = d3_selection_onFilters.get(type);
    if (filter) type = filter, wrap = d3_selection_onFilter;
    function onRemove() {
      var l = this[name];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[name];
      }
    }
    function onAdd() {
      var l = wrap(listener, d3_array(arguments));
      onRemove.call(this);
      this.addEventListener(type, this[name] = l, l.$ = capture);
      l._ = listener;
    }
    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
  }
  var d3_selection_onFilters = d3.map({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  });
  d3_selection_onFilters.forEach(function(k) {
    if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
  });
  function d3_selection_onListener(listener, argumentz) {
    return function(e) {
      var o = d3.event;
      d3.event = e;
      argumentz[0] = this.__data__;
      try {
        listener.apply(this, argumentz);
      } finally {
        d3.event = o;
      }
    };
  }
  function d3_selection_onFilter(listener, argumentz) {
    var l = d3_selection_onListener(listener, argumentz);
    return function(e) {
      var target = this, related = e.relatedTarget;
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
        l.call(target, e);
      }
    };
  }
  var d3_event_dragSelect = d3_vendorSymbol(d3_documentElement.style, "userSelect"), d3_event_dragId = 0;
  function d3_event_dragSuppress() {
    var name = ".dragsuppress-" + ++d3_event_dragId, touchmove = "touchmove" + name, selectstart = "selectstart" + name, dragstart = "dragstart" + name, click = "click" + name, w = d3.select(d3_window).on(touchmove, d3_eventPreventDefault).on(selectstart, d3_eventPreventDefault).on(dragstart, d3_eventPreventDefault), style = d3_documentElement.style, select = style[d3_event_dragSelect];
    style[d3_event_dragSelect] = "none";
    return function(suppressClick) {
      w.on(name, null);
      style[d3_event_dragSelect] = select;
      if (suppressClick) {
        function off() {
          w.on(click, null);
        }
        w.on(click, function() {
          d3_eventPreventDefault();
          off();
        }, true);
        setTimeout(off, 0);
      }
    };
  }
  d3.mouse = function(container) {
    return d3_mousePoint(container, d3_eventSource());
  };
  var d3_mouse_bug44083 = /WebKit/.test(d3_window.navigator.userAgent) ? -1 : 0;
  function d3_mousePoint(container, e) {
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      if (d3_mouse_bug44083 < 0 && (d3_window.scrollX || d3_window.scrollY)) {
        svg = d3.select("body").append("svg").style({
          position: "absolute",
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          border: "none"
        }, "important");
        var ctm = svg[0][0].getScreenCTM();
        d3_mouse_bug44083 = !(ctm.f || ctm.e);
        svg.remove();
      }
      if (d3_mouse_bug44083) {
        point.x = e.pageX;
        point.y = e.pageY;
      } else {
        point.x = e.clientX;
        point.y = e.clientY;
      }
      point = point.matrixTransform(container.getScreenCTM().inverse());
      return [ point.x, point.y ];
    }
    var rect = container.getBoundingClientRect();
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
  }
  d3.touches = function(container, touches) {
    if (arguments.length < 2) touches = d3_eventSource().touches;
    return touches ? d3_array(touches).map(function(touch) {
      var point = d3_mousePoint(container, touch);
      point.identifier = touch.identifier;
      return point;
    }) : [];
  };
  d3.behavior.drag = function() {
    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, "mousemove", "mouseup"), touchstart = dragstart(touchid, touchposition, "touchmove", "touchend");
    function drag() {
      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
    }
    function touchid() {
      return d3.event.changedTouches[0].identifier;
    }
    function touchposition(parent, id) {
      return d3.touches(parent).filter(function(p) {
        return p.identifier === id;
      })[0];
    }
    function dragstart(id, position, move, end) {
      return function() {
        var target = this, parent = target.parentNode, event_ = event.of(target, arguments), eventTarget = d3.event.target, eventId = id(), drag = eventId == null ? "drag" : "drag-" + eventId, origin_ = position(parent, eventId), dragged = 0, offset, w = d3.select(d3_window).on(move + "." + drag, moved).on(end + "." + drag, ended), dragRestore = d3_event_dragSuppress();
        if (origin) {
          offset = origin.apply(target, arguments);
          offset = [ offset.x - origin_[0], offset.y - origin_[1] ];
        } else {
          offset = [ 0, 0 ];
        }
        event_({
          type: "dragstart"
        });
        function moved() {
          if (!parent) return ended();
          var p = position(parent, eventId), dx = p[0] - origin_[0], dy = p[1] - origin_[1];
          dragged |= dx | dy;
          origin_ = p;
          event_({
            type: "drag",
            x: p[0] + offset[0],
            y: p[1] + offset[1],
            dx: dx,
            dy: dy
          });
        }
        function ended() {
          w.on(move + "." + drag, null).on(end + "." + drag, null);
          dragRestore(dragged && d3.event.target === eventTarget);
          event_({
            type: "dragend"
          });
        }
      };
    }
    drag.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return drag;
    };
    return d3.rebind(drag, event, "on");
  };
  d3.behavior.zoom = function() {
    var translate = [ 0, 0 ], translate0, scale = 1, scaleExtent = d3_behavior_zoomInfinity, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", event = d3_eventDispatch(zoom, "zoom"), x0, x1, y0, y1, touchtime;
    function zoom() {
      this.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on(mousemove, mousewheelreset).on("dblclick.zoom", dblclicked).on("touchstart.zoom", touchstarted);
    }
    zoom.translate = function(x) {
      if (!arguments.length) return translate;
      translate = x.map(Number);
      rescale();
      return zoom;
    };
    zoom.scale = function(x) {
      if (!arguments.length) return scale;
      scale = +x;
      rescale();
      return zoom;
    };
    zoom.scaleExtent = function(x) {
      if (!arguments.length) return scaleExtent;
      scaleExtent = x == null ? d3_behavior_zoomInfinity : x.map(Number);
      return zoom;
    };
    zoom.x = function(z) {
      if (!arguments.length) return x1;
      x1 = z;
      x0 = z.copy();
      translate = [ 0, 0 ];
      scale = 1;
      return zoom;
    };
    zoom.y = function(z) {
      if (!arguments.length) return y1;
      y1 = z;
      y0 = z.copy();
      translate = [ 0, 0 ];
      scale = 1;
      return zoom;
    };
    function location(p) {
      return [ (p[0] - translate[0]) / scale, (p[1] - translate[1]) / scale ];
    }
    function point(l) {
      return [ l[0] * scale + translate[0], l[1] * scale + translate[1] ];
    }
    function scaleTo(s) {
      scale = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
    }
    function translateTo(p, l) {
      l = point(l);
      translate[0] += p[0] - l[0];
      translate[1] += p[1] - l[1];
    }
    function rescale() {
      if (x1) x1.domain(x0.range().map(function(x) {
        return (x - translate[0]) / scale;
      }).map(x0.invert));
      if (y1) y1.domain(y0.range().map(function(y) {
        return (y - translate[1]) / scale;
      }).map(y0.invert));
    }
    function dispatch(event) {
      rescale();
      event({
        type: "zoom",
        scale: scale,
        translate: translate
      });
    }
    function mousedowned() {
      var target = this, event_ = event.of(target, arguments), eventTarget = d3.event.target, dragged = 0, w = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended), l = location(d3.mouse(target)), dragRestore = d3_event_dragSuppress();
      function moved() {
        dragged = 1;
        translateTo(d3.mouse(target), l);
        dispatch(event_);
      }
      function ended() {
        w.on(mousemove, d3_window === target ? mousewheelreset : null).on(mouseup, null);
        dragRestore(dragged && d3.event.target === eventTarget);
      }
    }
    function touchstarted() {
      var target = this, event_ = event.of(target, arguments), touches = d3.touches(target), locations = {}, distance0 = 0, scale0 = scale, now = Date.now(), name = "zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove." + name, touchend = "touchend." + name, w = d3.select(d3_window).on(touchmove, moved).on(touchend, ended), t = d3.select(target).on(mousedown, null), dragRestore = d3_event_dragSuppress();
      touches.forEach(function(t) {
        locations[t.identifier] = location(t);
      });
      if (touches.length === 1) {
        if (now - touchtime < 500) {
          var p = touches[0], l = location(touches[0]);
          scaleTo(scale * 2);
          translateTo(p, l);
          d3_eventPreventDefault();
          dispatch(event_);
        }
        touchtime = now;
      } else if (touches.length > 1) {
        var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
        distance0 = dx * dx + dy * dy;
      }
      function moved() {
        var touches = d3.touches(target), p0 = touches[0], l0 = locations[p0.identifier];
        if (p1 = touches[1]) {
          var p1, l1 = locations[p1.identifier], scale1 = d3.event.scale;
          if (scale1 == null) {
            var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1;
            scale1 = distance0 && Math.sqrt(distance1 / distance0);
          }
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
          scaleTo(scale1 * scale0);
        }
        touchtime = null;
        translateTo(p0, l0);
        dispatch(event_);
      }
      function ended() {
        w.on(touchmove, null).on(touchend, null);
        t.on(mousedown, mousedowned);
        dragRestore();
      }
    }
    function mousewheeled() {
      d3_eventPreventDefault();
      if (!translate0) translate0 = location(d3.mouse(this));
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * scale);
      translateTo(d3.mouse(this), translate0);
      dispatch(event.of(this, arguments));
    }
    function mousewheelreset() {
      translate0 = null;
    }
    function dblclicked() {
      var p = d3.mouse(this), l = location(p), k = Math.log(scale) / Math.LN2;
      scaleTo(Math.pow(2, d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1));
      translateTo(p, l);
      dispatch(event.of(this, arguments));
    }
    return d3.rebind(zoom, event, "on");
  };
  var d3_behavior_zoomInfinity = [ 0, Infinity ];
  var d3_behavior_zoomDelta, d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
    return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
  }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
    return d3.event.wheelDelta;
  }, "mousewheel") : (d3_behavior_zoomDelta = function() {
    return -d3.event.detail;
  }, "MozMousePixelScroll");
  function d3_Color() {}
  d3_Color.prototype.toString = function() {
    return this.rgb() + "";
  };
  d3.hsl = function(h, s, l) {
    return arguments.length === 1 ? h instanceof d3_Hsl ? d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : d3_hsl(+h, +s, +l);
  };
  function d3_hsl(h, s, l) {
    return new d3_Hsl(h, s, l);
  }
  function d3_Hsl(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
  }
  var d3_hslPrototype = d3_Hsl.prototype = new d3_Color();
  d3_hslPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return d3_hsl(this.h, this.s, this.l / k);
  };
  d3_hslPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return d3_hsl(this.h, this.s, k * this.l);
  };
  d3_hslPrototype.rgb = function() {
    return d3_hsl_rgb(this.h, this.s, this.l);
  };
  function d3_hsl_rgb(h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
      if (h > 360) h -= 360; else if (h < 0) h += 360;
      if (h < 60) return m1 + (m2 - m1) * h / 60;
      if (h < 180) return m2;
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
      return m1;
    }
    function vv(h) {
      return Math.round(v(h) * 255);
    }
    return d3_rgb(vv(h + 120), vv(h), vv(h - 120));
  }
  var π = Math.PI, ε = 1e-6, ε2 = ε * ε, d3_radians = π / 180, d3_degrees = 180 / π;
  function d3_sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  function d3_acos(x) {
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
  }
  function d3_asin(x) {
    return x > 1 ? π / 2 : x < -1 ? -π / 2 : Math.asin(x);
  }
  function d3_sinh(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  }
  function d3_cosh(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  }
  function d3_haversin(x) {
    return (x = Math.sin(x / 2)) * x;
  }
  d3.hcl = function(h, c, l) {
    return arguments.length === 1 ? h instanceof d3_Hcl ? d3_hcl(h.h, h.c, h.l) : h instanceof d3_Lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : d3_hcl(+h, +c, +l);
  };
  function d3_hcl(h, c, l) {
    return new d3_Hcl(h, c, l);
  }
  function d3_Hcl(h, c, l) {
    this.h = h;
    this.c = c;
    this.l = l;
  }
  var d3_hclPrototype = d3_Hcl.prototype = new d3_Color();
  d3_hclPrototype.brighter = function(k) {
    return d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.darker = function(k) {
    return d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.rgb = function() {
    return d3_hcl_lab(this.h, this.c, this.l).rgb();
  };
  function d3_hcl_lab(h, c, l) {
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    return d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
  }
  d3.lab = function(l, a, b) {
    return arguments.length === 1 ? l instanceof d3_Lab ? d3_lab(l.l, l.a, l.b) : l instanceof d3_Hcl ? d3_hcl_lab(l.l, l.c, l.h) : d3_rgb_lab((l = d3.rgb(l)).r, l.g, l.b) : d3_lab(+l, +a, +b);
  };
  function d3_lab(l, a, b) {
    return new d3_Lab(l, a, b);
  }
  function d3_Lab(l, a, b) {
    this.l = l;
    this.a = a;
    this.b = b;
  }
  var d3_lab_K = 18;
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
  var d3_labPrototype = d3_Lab.prototype = new d3_Color();
  d3_labPrototype.brighter = function(k) {
    return d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.darker = function(k) {
    return d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.rgb = function() {
    return d3_lab_rgb(this.l, this.a, this.b);
  };
  function d3_lab_rgb(l, a, b) {
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
    x = d3_lab_xyz(x) * d3_lab_X;
    y = d3_lab_xyz(y) * d3_lab_Y;
    z = d3_lab_xyz(z) * d3_lab_Z;
    return d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
  }
  function d3_lab_hcl(l, a, b) {
    return l > 0 ? d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : d3_hcl(NaN, NaN, l);
  }
  function d3_lab_xyz(x) {
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
  }
  function d3_xyz_lab(x) {
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
  }
  function d3_xyz_rgb(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
  }
  d3.rgb = function(r, g, b) {
    return arguments.length === 1 ? r instanceof d3_Rgb ? d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : d3_rgb(~~r, ~~g, ~~b);
  };
  function d3_rgbNumber(value) {
    return d3_rgb(value >> 16, value >> 8 & 255, value & 255);
  }
  function d3_rgbString(value) {
    return d3_rgbNumber(value) + "";
  }
  function d3_rgb(r, g, b) {
    return new d3_Rgb(r, g, b);
  }
  function d3_Rgb(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  var d3_rgbPrototype = d3_Rgb.prototype = new d3_Color();
  d3_rgbPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    var r = this.r, g = this.g, b = this.b, i = 30;
    if (!r && !g && !b) return d3_rgb(i, i, i);
    if (r && r < i) r = i;
    if (g && g < i) g = i;
    if (b && b < i) b = i;
    return d3_rgb(Math.min(255, ~~(r / k)), Math.min(255, ~~(g / k)), Math.min(255, ~~(b / k)));
  };
  d3_rgbPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return d3_rgb(~~(k * this.r), ~~(k * this.g), ~~(k * this.b));
  };
  d3_rgbPrototype.hsl = function() {
    return d3_rgb_hsl(this.r, this.g, this.b);
  };
  d3_rgbPrototype.toString = function() {
    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
  };
  function d3_rgb_hex(v) {
    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
  }
  function d3_rgb_parse(format, rgb, hsl) {
    var r = 0, g = 0, b = 0, m1, m2, name;
    m1 = /([a-z]+)\((.*)\)/i.exec(format);
    if (m1) {
      m2 = m1[2].split(",");
      switch (m1[1]) {
       case "hsl":
        {
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
        }

       case "rgb":
        {
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
        }
      }
    }
    if (name = d3_rgb_names.get(format)) return rgb(name.r, name.g, name.b);
    if (format != null && format.charAt(0) === "#") {
      if (format.length === 4) {
        r = format.charAt(1);
        r += r;
        g = format.charAt(2);
        g += g;
        b = format.charAt(3);
        b += b;
      } else if (format.length === 7) {
        r = format.substring(1, 3);
        g = format.substring(3, 5);
        b = format.substring(5, 7);
      }
      r = parseInt(r, 16);
      g = parseInt(g, 16);
      b = parseInt(b, 16);
    }
    return rgb(r, g, b);
  }
  function d3_rgb_hsl(r, g, b) {
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
    if (d) {
      s = l < .5 ? d / (max + min) : d / (2 - max - min);
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    } else {
      h = NaN;
      s = l > 0 && l < 1 ? 0 : h;
    }
    return d3_hsl(h, s, l);
  }
  function d3_rgb_lab(r, g, b) {
    r = d3_rgb_xyz(r);
    g = d3_rgb_xyz(g);
    b = d3_rgb_xyz(b);
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
  }
  function d3_rgb_xyz(r) {
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
  }
  function d3_rgb_parseNumber(c) {
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
  }
  var d3_rgb_names = d3.map({
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  });
  d3_rgb_names.forEach(function(key, value) {
    d3_rgb_names.set(key, d3_rgbNumber(value));
  });
  function d3_functor(v) {
    return typeof v === "function" ? v : function() {
      return v;
    };
  }
  d3.functor = d3_functor;
  function d3_identity(d) {
    return d;
  }
  d3.xhr = d3_xhrType(d3_identity);
  function d3_xhrType(response) {
    return function(url, mimeType, callback) {
      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, 
      mimeType = null;
      return d3_xhr(url, mimeType, response, callback);
    };
  }
  function d3_xhr(url, mimeType, response, callback) {
    var xhr = {}, dispatch = d3.dispatch("progress", "load", "error"), headers = {}, request = new XMLHttpRequest(), responseType = null;
    if (d3_window.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {
      request.readyState > 3 && respond();
    };
    function respond() {
      var status = request.status, result;
      if (!status && request.responseText || status >= 200 && status < 300 || status === 304) {
        try {
          result = response.call(xhr, request);
        } catch (e) {
          dispatch.error.call(xhr, e);
          return;
        }
        dispatch.load.call(xhr, result);
      } else {
        dispatch.error.call(xhr, request);
      }
    }
    request.onprogress = function(event) {
      var o = d3.event;
      d3.event = event;
      try {
        dispatch.progress.call(xhr, request);
      } finally {
        d3.event = o;
      }
    };
    xhr.header = function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers[name];
      if (value == null) delete headers[name]; else headers[name] = value + "";
      return xhr;
    };
    xhr.mimeType = function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return xhr;
    };
    xhr.responseType = function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return xhr;
    };
    xhr.response = function(value) {
      response = value;
      return xhr;
    };
    [ "get", "post" ].forEach(function(method) {
      xhr[method] = function() {
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));
      };
    });
    xhr.send = function(method, data, callback) {
      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
      request.open(method, url, true);
      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
      if (responseType != null) request.responseType = responseType;
      if (callback != null) xhr.on("error", callback).on("load", function(request) {
        callback(null, request);
      });
      request.send(data == null ? null : data);
      return xhr;
    };
    xhr.abort = function() {
      request.abort();
      return xhr;
    };
    d3.rebind(xhr, dispatch, "on");
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
  }
  function d3_xhr_fixCallback(callback) {
    return callback.length === 1 ? function(error, request) {
      callback(error == null ? request : null);
    } : callback;
  }
  d3.dsv = function(delimiter, mimeType) {
    var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
    function dsv(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var xhr = d3.xhr(url, mimeType, callback);
      xhr.row = function(_) {
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
      };
      return xhr.row(row);
    }
    function response(request) {
      return dsv.parse(request.responseText);
    }
    function typedResponse(f) {
      return function(request) {
        return dsv.parse(request.responseText, f);
      };
    }
    dsv.parse = function(text, f) {
      var o;
      return dsv.parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) {
          return f(a(row), i);
        } : a;
      });
    };
    dsv.parseRows = function(text, f) {
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;
      function token() {
        if (I >= N) return EOF;
        if (eol) return eol = false, EOL;
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.substring(j + 1, i).replace(/""/g, '"');
        }
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; else if (c === 13) {
            eol = true;
            if (text.charCodeAt(I) === 10) ++I, ++k;
          } else if (c !== delimiterCode) continue;
          return text.substring(j, I - k);
        }
        return text.substring(j);
      }
      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && !(a = f(a, n++))) continue;
        rows.push(a);
      }
      return rows;
    };
    dsv.format = function(rows) {
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
      var fieldSet = new d3_Set(), fields = [];
      rows.forEach(function(row) {
        for (var field in row) {
          if (!fieldSet.has(field)) {
            fields.push(fieldSet.add(field));
          }
        }
      });
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    };
    dsv.formatRows = function(rows) {
      return rows.map(formatRow).join("\n");
    };
    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }
    function formatValue(text) {
      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
    }
    return dsv;
  };
  d3.csv = d3.dsv(",", "text/csv");
  d3.tsv = d3.dsv("	", "text/tab-separated-values");
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 17);
  };
  d3.timer = function(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();
    var time = then + delay, timer = {
      callback: callback,
      time: time,
      next: null
    };
    if (d3_timer_queueTail) d3_timer_queueTail.next = timer; else d3_timer_queueHead = timer;
    d3_timer_queueTail = timer;
    if (!d3_timer_interval) {
      d3_timer_timeout = clearTimeout(d3_timer_timeout);
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  };
  function d3_timer_step() {
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
    if (delay > 24) {
      if (isFinite(delay)) {
        clearTimeout(d3_timer_timeout);
        d3_timer_timeout = setTimeout(d3_timer_step, delay);
      }
      d3_timer_interval = 0;
    } else {
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  }
  d3.timer.flush = function() {
    d3_timer_mark();
    d3_timer_sweep();
  };
  function d3_timer_replace(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();
    d3_timer_active.callback = callback;
    d3_timer_active.time = then + delay;
  }
  function d3_timer_mark() {
    var now = Date.now();
    d3_timer_active = d3_timer_queueHead;
    while (d3_timer_active) {
      if (now >= d3_timer_active.time) d3_timer_active.flush = d3_timer_active.callback(now - d3_timer_active.time);
      d3_timer_active = d3_timer_active.next;
    }
    return now;
  }
  function d3_timer_sweep() {
    var t0, t1 = d3_timer_queueHead, time = Infinity;
    while (t1) {
      if (t1.flush) {
        t1 = t0 ? t0.next = t1.next : d3_timer_queueHead = t1.next;
      } else {
        if (t1.time < time) time = t1.time;
        t1 = (t0 = t1).next;
      }
    }
    d3_timer_queueTail = t0;
    return time;
  }
  var d3_format_decimalPoint = ".", d3_format_thousandsSeparator = ",", d3_format_grouping = [ 3, 3 ], d3_format_currencySymbol = "$";
  var d3_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(d3_formatPrefix);
  d3.formatPrefix = function(value, precision) {
    var i = 0;
    if (value) {
      if (value < 0) value *= -1;
      if (precision) value = d3.round(value, d3_format_precision(value, precision));
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
      i = Math.max(-24, Math.min(24, Math.floor((i <= 0 ? i + 1 : i - 1) / 3) * 3));
    }
    return d3_formatPrefixes[8 + i / 3];
  };
  function d3_formatPrefix(d, i) {
    var k = Math.pow(10, Math.abs(8 - i) * 3);
    return {
      scale: i > 8 ? function(d) {
        return d / k;
      } : function(d) {
        return d * k;
      },
      symbol: d
    };
  }
  d3.round = function(x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
  };
  d3.format = function(specifier) {
    var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, suffix = "", integer = false;
    if (precision) precision = +precision.substring(1);
    if (zfill || fill === "0" && align === "=") {
      zfill = fill = "0";
      align = "=";
      if (comma) width -= Math.floor((width - 1) / 4);
    }
    switch (type) {
     case "n":
      comma = true;
      type = "g";
      break;

     case "%":
      scale = 100;
      suffix = "%";
      type = "f";
      break;

     case "p":
      scale = 100;
      suffix = "%";
      type = "r";
      break;

     case "b":
     case "o":
     case "x":
     case "X":
      if (symbol === "#") symbol = "0" + type.toLowerCase();

     case "c":
     case "d":
      integer = true;
      precision = 0;
      break;

     case "s":
      scale = -1;
      type = "r";
      break;
    }
    if (symbol === "#") symbol = ""; else if (symbol === "$") symbol = d3_format_currencySymbol;
    if (type == "r" && !precision) type = "g";
    if (precision != null) {
      if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
    }
    type = d3_format_types.get(type) || d3_format_typeDefault;
    var zcomma = zfill && comma;
    return function(value) {
      if (integer && value % 1) return "";
      var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign;
      if (scale < 0) {
        var prefix = d3.formatPrefix(value, precision);
        value = prefix.scale(value);
        suffix = prefix.symbol;
      } else {
        value *= scale;
      }
      value = type(value, precision);
      var i = value.lastIndexOf("."), before = i < 0 ? value : value.substring(0, i), after = i < 0 ? "" : d3_format_decimalPoint + value.substring(i + 1);
      if (!zfill && comma) before = d3_format_group(before);
      var length = symbol.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
      if (zcomma) before = d3_format_group(padding + before);
      negative += symbol;
      value = before + after;
      return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + suffix;
    };
  };
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
  var d3_format_types = d3.map({
    b: function(x) {
      return x.toString(2);
    },
    c: function(x) {
      return String.fromCharCode(x);
    },
    o: function(x) {
      return x.toString(8);
    },
    x: function(x) {
      return x.toString(16);
    },
    X: function(x) {
      return x.toString(16).toUpperCase();
    },
    g: function(x, p) {
      return x.toPrecision(p);
    },
    e: function(x, p) {
      return x.toExponential(p);
    },
    f: function(x, p) {
      return x.toFixed(p);
    },
    r: function(x, p) {
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
    }
  });
  function d3_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
  }
  function d3_format_typeDefault(x) {
    return x + "";
  }
  var d3_format_group = d3_identity;
  if (d3_format_grouping) {
    var d3_format_groupingLength = d3_format_grouping.length;
    d3_format_group = function(value) {
      var i = value.length, t = [], j = 0, g = d3_format_grouping[0];
      while (i > 0 && g > 0) {
        t.push(value.substring(i -= g, i + g));
        g = d3_format_grouping[j = (j + 1) % d3_format_groupingLength];
      }
      return t.reverse().join(d3_format_thousandsSeparator);
    };
  }
  d3.geo = {};
  function d3_adder() {}
  d3_adder.prototype = {
    s: 0,
    t: 0,
    add: function(y) {
      d3_adderSum(y, this.t, d3_adderTemp);
      d3_adderSum(d3_adderTemp.s, this.s, this);
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
    },
    reset: function() {
      this.s = this.t = 0;
    },
    valueOf: function() {
      return this.s;
    }
  };
  var d3_adderTemp = new d3_adder();
  function d3_adderSum(a, b, o) {
    var x = o.s = a + b, bv = x - a, av = x - bv;
    o.t = a - av + (b - bv);
  }
  d3.geo.stream = function(object, listener) {
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
      d3_geo_streamObjectType[object.type](object, listener);
    } else {
      d3_geo_streamGeometry(object, listener);
    }
  };
  function d3_geo_streamGeometry(geometry, listener) {
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
      d3_geo_streamGeometryType[geometry.type](geometry, listener);
    }
  }
  var d3_geo_streamObjectType = {
    Feature: function(feature, listener) {
      d3_geo_streamGeometry(feature.geometry, listener);
    },
    FeatureCollection: function(object, listener) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
    }
  };
  var d3_geo_streamGeometryType = {
    Sphere: function(object, listener) {
      listener.sphere();
    },
    Point: function(object, listener) {
      var coordinate = object.coordinates;
      listener.point(coordinate[0], coordinate[1]);
    },
    MultiPoint: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length, coordinate;
      while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1]);
    },
    LineString: function(object, listener) {
      d3_geo_streamLine(object.coordinates, listener, 0);
    },
    MultiLineString: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
    },
    Polygon: function(object, listener) {
      d3_geo_streamPolygon(object.coordinates, listener);
    },
    MultiPolygon: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
    },
    GeometryCollection: function(object, listener) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
    }
  };
  function d3_geo_streamLine(coordinates, listener, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    listener.lineStart();
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1]);
    listener.lineEnd();
  }
  function d3_geo_streamPolygon(coordinates, listener) {
    var i = -1, n = coordinates.length;
    listener.polygonStart();
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
    listener.polygonEnd();
  }
  d3.geo.area = function(object) {
    d3_geo_areaSum = 0;
    d3.geo.stream(object, d3_geo_area);
    return d3_geo_areaSum;
  };
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
  var d3_geo_area = {
    sphere: function() {
      d3_geo_areaSum += 4 * π;
    },
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_areaRingSum.reset();
      d3_geo_area.lineStart = d3_geo_areaRingStart;
    },
    polygonEnd: function() {
      var area = 2 * d3_geo_areaRingSum;
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
    }
  };
  function d3_geo_areaRingStart() {
    var λ00, φ00, λ0, cosφ0, sinφ0;
    d3_geo_area.point = function(λ, φ) {
      d3_geo_area.point = nextPoint;
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
      sinφ0 = Math.sin(φ);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      φ = φ * d3_radians / 2 + π / 4;
      var dλ = λ - λ0, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(dλ), v = k * Math.sin(dλ);
      d3_geo_areaRingSum.add(Math.atan2(v, u));
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
    }
    d3_geo_area.lineEnd = function() {
      nextPoint(λ00, φ00);
    };
  }
  function d3_geo_cartesian(spherical) {
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];
  }
  function d3_geo_cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function d3_geo_cartesianCross(a, b) {
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
  }
  function d3_geo_cartesianAdd(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
  }
  function d3_geo_cartesianScale(vector, k) {
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];
  }
  function d3_geo_cartesianNormalize(d) {
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l;
    d[1] /= l;
    d[2] /= l;
  }
  function d3_geo_spherical(cartesian) {
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];
  }
  function d3_geo_sphericalEqual(a, b) {
    return Math.abs(a[0] - b[0]) < ε && Math.abs(a[1] - b[1]) < ε;
  }
  d3.geo.bounds = function() {
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
    var bound = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        bound.point = ringPoint;
        bound.lineStart = ringStart;
        bound.lineEnd = ringEnd;
        dλSum = 0;
        d3_geo_area.polygonStart();
      },
      polygonEnd: function() {
        d3_geo_area.polygonEnd();
        bound.point = point;
        bound.lineStart = lineStart;
        bound.lineEnd = lineEnd;
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;
        range[0] = λ0, range[1] = λ1;
      }
    };
    function point(λ, φ) {
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);
      if (φ < φ0) φ0 = φ;
      if (φ > φ1) φ1 = φ;
    }
    function linePoint(λ, φ) {
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);
      if (p0) {
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);
        d3_geo_cartesianNormalize(inflection);
        inflection = d3_geo_spherical(inflection);
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = Math.abs(dλ) > 180;
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = inflection[1] * d3_degrees;
          if (φi > φ1) φ1 = φi;
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = -inflection[1] * d3_degrees;
          if (φi < φ0) φ0 = φi;
        } else {
          if (φ < φ0) φ0 = φ;
          if (φ > φ1) φ1 = φ;
        }
        if (antimeridian) {
          if (λ < λ_) {
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
          } else {
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
          }
        } else {
          if (λ1 >= λ0) {
            if (λ < λ0) λ0 = λ;
            if (λ > λ1) λ1 = λ;
          } else {
            if (λ > λ_) {
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
            } else {
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
            }
          }
        }
      } else {
        point(λ, φ);
      }
      p0 = p, λ_ = λ;
    }
    function lineStart() {
      bound.point = linePoint;
    }
    function lineEnd() {
      range[0] = λ0, range[1] = λ1;
      bound.point = point;
      p0 = null;
    }
    function ringPoint(λ, φ) {
      if (p0) {
        var dλ = λ - λ_;
        dλSum += Math.abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
      } else λ__ = λ, φ__ = φ;
      d3_geo_area.point(λ, φ);
      linePoint(λ, φ);
    }
    function ringStart() {
      d3_geo_area.lineStart();
    }
    function ringEnd() {
      ringPoint(λ__, φ__);
      d3_geo_area.lineEnd();
      if (Math.abs(dλSum) > ε) λ0 = -(λ1 = 180);
      range[0] = λ0, range[1] = λ1;
      p0 = null;
    }
    function angle(λ0, λ1) {
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
    }
    function compareRanges(a, b) {
      return a[0] - b[0];
    }
    function withinRange(x, range) {
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
    }
    return function(feature) {
      φ1 = λ1 = -(λ0 = φ0 = Infinity);
      ranges = [];
      d3.geo.stream(feature, bound);
      var n = ranges.length;
      if (n) {
        ranges.sort(compareRanges);
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
          b = ranges[i];
          if (withinRange(b[0], a) || withinRange(b[1], a)) {
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
          } else {
            merged.push(a = b);
          }
        }
        var best = -Infinity, dλ;
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
          b = merged[i];
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
        }
      }
      ranges = range = null;
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];
    };
  }();
  d3.geo.centroid = function(object) {
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
    d3.geo.stream(object, d3_geo_centroid);
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
    if (m < ε2) {
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
      m = x * x + y * y + z * z;
      if (m < ε2) return [ NaN, NaN ];
    }
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];
  };
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
  var d3_geo_centroid = {
    sphere: d3_noop,
    point: d3_geo_centroidPoint,
    lineStart: d3_geo_centroidLineStart,
    lineEnd: d3_geo_centroidLineEnd,
    polygonStart: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
    }
  };
  function d3_geo_centroidPoint(λ, φ) {
    λ *= d3_radians;
    var cosφ = Math.cos(φ *= d3_radians);
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
  }
  function d3_geo_centroidPointXYZ(x, y, z) {
    ++d3_geo_centroidW0;
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
  }
  function d3_geo_centroidLineStart() {
    var x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroid.point = nextPoint;
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_centroidLineEnd() {
    d3_geo_centroid.point = d3_geo_centroidPoint;
  }
  function d3_geo_centroidRingStart() {
    var λ00, φ00, x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ00 = λ, φ00 = φ;
      d3_geo_centroid.point = nextPoint;
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    d3_geo_centroid.lineEnd = function() {
      nextPoint(λ00, φ00);
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
      d3_geo_centroid.point = d3_geo_centroidPoint;
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
      d3_geo_centroidX2 += v * cx;
      d3_geo_centroidY2 += v * cy;
      d3_geo_centroidZ2 += v * cz;
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_true() {
    return true;
  }
  function d3_geo_clipPolygon(segments, compare, inside, interpolate, listener) {
    var subject = [], clip = [];
    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n];
      if (d3_geo_sphericalEqual(p0, p1)) {
        listener.lineStart();
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
        listener.lineEnd();
        return;
      }
      var a = {
        point: p0,
        points: segment,
        other: null,
        visited: false,
        entry: true,
        subject: true
      }, b = {
        point: p0,
        points: [ p0 ],
        other: a,
        visited: false,
        entry: false,
        subject: false
      };
      a.other = b;
      subject.push(a);
      clip.push(b);
      a = {
        point: p1,
        points: [ p1 ],
        other: null,
        visited: false,
        entry: false,
        subject: true
      };
      b = {
        point: p1,
        points: [ p1 ],
        other: a,
        visited: false,
        entry: true,
        subject: false
      };
      a.other = b;
      subject.push(a);
      clip.push(b);
    });
    clip.sort(compare);
    d3_geo_clipPolygonLinkCircular(subject);
    d3_geo_clipPolygonLinkCircular(clip);
    if (!subject.length) return;
    if (inside) for (var i = 1, e = !inside(clip[0].point), n = clip.length; i < n; ++i) {
      clip[i].entry = e = !e;
    }
    var start = subject[0], current, points, point;
    while (1) {
      current = start;
      while (current.visited) if ((current = current.next) === start) return;
      points = current.points;
      listener.lineStart();
      do {
        current.visited = current.other.visited = true;
        if (current.entry) {
          if (current.subject) {
            for (var i = 0; i < points.length; i++) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.point, current.next.point, 1, listener);
          }
          current = current.next;
        } else {
          if (current.subject) {
            points = current.prev.points;
            for (var i = points.length; --i >= 0; ) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.point, current.prev.point, -1, listener);
          }
          current = current.prev;
        }
        current = current.other;
        points = current.points;
      } while (!current.visited);
      listener.lineEnd();
    }
  }
  function d3_geo_clipPolygonLinkCircular(array) {
    if (!(n = array.length)) return;
    var n, i = 0, a = array[0], b;
    while (++i < n) {
      a.next = b = array[i];
      b.prev = a;
      a = b;
    }
    a.next = b = array[0];
    b.prev = a;
  }
  function d3_geo_clip(pointVisible, clipLine, interpolate, polygonContains) {
    return function(listener) {
      var line = clipLine(listener);
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
          listener.polygonStart();
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = d3.merge(segments);
          if (segments.length) {
            d3_geo_clipPolygon(segments, d3_geo_clipSort, null, interpolate, listener);
          } else if (polygonContains(polygon)) {
            listener.lineStart();
            interpolate(null, null, 1, listener);
            listener.lineEnd();
          }
          listener.polygonEnd();
          segments = polygon = null;
        },
        sphere: function() {
          listener.polygonStart();
          listener.lineStart();
          interpolate(null, null, 1, listener);
          listener.lineEnd();
          listener.polygonEnd();
        }
      };
      function point(λ, φ) {
        if (pointVisible(λ, φ)) listener.point(λ, φ);
      }
      function pointLine(λ, φ) {
        line.point(λ, φ);
      }
      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }
      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }
      var segments;
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygon, ring;
      function pointRing(λ, φ) {
        ringListener.point(λ, φ);
        ring.push([ λ, φ ]);
      }
      function ringStart() {
        ringListener.lineStart();
        ring = [];
      }
      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringListener.lineEnd();
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;
        ring.pop();
        polygon.push(ring);
        ring = null;
        if (!n) return;
        if (clean & 1) {
          segment = ringSegments[0];
          var n = segment.length - 1, i = -1, point;
          listener.lineStart();
          while (++i < n) listener.point((point = segment[i])[0], point[1]);
          listener.lineEnd();
          return;
        }
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
      }
      return clip;
    };
  }
  function d3_geo_clipSegmentLength1(segment) {
    return segment.length > 1;
  }
  function d3_geo_clipBufferListener() {
    var lines = [], line;
    return {
      lineStart: function() {
        lines.push(line = []);
      },
      point: function(λ, φ) {
        line.push([ λ, φ ]);
      },
      lineEnd: d3_noop,
      buffer: function() {
        var buffer = lines;
        lines = [];
        line = null;
        return buffer;
      },
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      }
    };
  }
  function d3_geo_clipSort(a, b) {
    return ((a = a.point)[0] < 0 ? a[1] - π / 2 - ε : π / 2 - a[1]) - ((b = b.point)[0] < 0 ? b[1] - π / 2 - ε : π / 2 - b[1]);
  }
  function d3_geo_pointInPolygon(point, polygon) {
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, polar = false, southPole = false, winding = 0;
    d3_geo_areaRingSum.reset();
    for (var i = 0, n = polygon.length; i < n; ++i) {
      var ring = polygon[i], m = ring.length;
      if (!m) continue;
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;
      while (true) {
        if (j === m) j = 0;
        point = ring[j];
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, antimeridian = Math.abs(dλ) > π, k = sinφ0 * sinφ;
        d3_geo_areaRingSum.add(Math.atan2(k * Math.sin(dλ), cosφ0 * cosφ + k * Math.cos(dλ)));
        if (Math.abs(φ) < ε) southPole = true;
        polarAngle += antimeridian ? dλ + (dλ >= 0 ? 2 : -2) * π : dλ;
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
          d3_geo_cartesianNormalize(arc);
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
          d3_geo_cartesianNormalize(intersection);
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
          if (parallel > φarc) {
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
          }
        }
        if (!j++) break;
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
      }
      if (Math.abs(polarAngle) > ε) polar = true;
    }
    return (!southPole && !polar && d3_geo_areaRingSum < 0 || polarAngle < -ε) ^ winding & 1;
  }
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, d3_geo_clipAntimeridianPolygonContains);
  function d3_geo_clipAntimeridianLine(listener) {
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;
    return {
      lineStart: function() {
        listener.lineStart();
        clean = 1;
      },
      point: function(λ1, φ1) {
        var sλ1 = λ1 > 0 ? π : -π, dλ = Math.abs(λ1 - λ0);
        if (Math.abs(dλ - π) < ε) {
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? π / 2 : -π / 2);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          listener.point(λ1, φ0);
          clean = 0;
        } else if (sλ0 !== sλ1 && dλ >= π) {
          if (Math.abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
          if (Math.abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          clean = 0;
        }
        listener.point(λ0 = λ1, φ0 = φ1);
        sλ0 = sλ1;
      },
      lineEnd: function() {
        listener.lineEnd();
        λ0 = φ0 = NaN;
      },
      clean: function() {
        return 2 - clean;
      }
    };
  }
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
    return Math.abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
  }
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
    var φ;
    if (from == null) {
      φ = direction * π / 2;
      listener.point(-π, φ);
      listener.point(0, φ);
      listener.point(π, φ);
      listener.point(π, 0);
      listener.point(π, -φ);
      listener.point(0, -φ);
      listener.point(-π, -φ);
      listener.point(-π, 0);
      listener.point(-π, φ);
    } else if (Math.abs(from[0] - to[0]) > ε) {
      var s = (from[0] < to[0] ? 1 : -1) * π;
      φ = direction * s / 2;
      listener.point(-s, φ);
      listener.point(0, φ);
      listener.point(s, φ);
    } else {
      listener.point(to[0], to[1]);
    }
  }
  var d3_geo_clipAntimeridianPoint = [ -π, 0 ];
  function d3_geo_clipAntimeridianPolygonContains(polygon) {
    return d3_geo_pointInPolygon(d3_geo_clipAntimeridianPoint, polygon);
  }
  function d3_geo_clipCircle(radius) {
    var cr = Math.cos(radius), smallRadius = cr > 0, point = [ radius, 0 ], notHemisphere = Math.abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
    return d3_geo_clip(visible, clipLine, interpolate, polygonContains);
    function visible(λ, φ) {
      return Math.cos(λ) * Math.cos(φ) > cr;
    }
    function clipLine(listener) {
      var point0, c0, v0, v00, clean;
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(λ, φ) {
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
          if (!point0 && (v00 = v0 = v)) listener.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
              point1[0] += ε;
              point1[1] += ε;
              v = visible(point1[0], point1[1]);
            }
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              listener.lineStart();
              point2 = intersect(point1, point0);
              listener.point(point2[0], point2[1]);
            } else {
              point2 = intersect(point0, point1);
              listener.point(point2[0], point2[1]);
              listener.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
              } else {
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
              }
            }
          }
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
            listener.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) listener.lineEnd();
          point0 = null;
        },
        clean: function() {
          return clean | (v00 && v0) << 1;
        }
      };
    }
    function intersect(a, b, two) {
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
      if (!determinant) return !two && a;
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
      d3_geo_cartesianAdd(A, B);
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
      if (t2 < 0) return;
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
      d3_geo_cartesianAdd(q, A);
      q = d3_geo_spherical(q);
      if (!two) return q;
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
      var δλ = λ1 - λ0, polar = Math.abs(δλ - π) < ε, meridian = polar || δλ < ε;
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (Math.abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
        d3_geo_cartesianAdd(q1, A);
        return [ q, d3_geo_spherical(q1) ];
      }
    }
    function code(λ, φ) {
      var r = smallRadius ? radius : π - radius, code = 0;
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;
      return code;
    }
    function polygonContains(polygon) {
      return d3_geo_pointInPolygon(point, polygon);
    }
  }
  var d3_geo_clipViewMAX = 1e9;
  function d3_geo_clipView(x0, y0, x1, y1) {
    return function(listener) {
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), segments, polygon, ring;
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          listener = bufferListener;
          segments = [];
          polygon = [];
        },
        polygonEnd: function() {
          listener = listener_;
          if ((segments = d3.merge(segments)).length) {
            listener.polygonStart();
            d3_geo_clipPolygon(segments, compare, inside, interpolate, listener);
            listener.polygonEnd();
          } else if (insidePolygon([ x0, y0 ])) {
            listener.polygonStart(), listener.lineStart();
            interpolate(null, null, 1, listener);
            listener.lineEnd(), listener.polygonEnd();
          }
          segments = polygon = ring = null;
        }
      };
      function inside(point) {
        var a = corner(point, -1), i = insidePolygon([ a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0 ]);
        return i;
      }
      function insidePolygon(p) {
        var wn = 0, n = polygon.length, y = p[1];
        for (var i = 0; i < n; ++i) {
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
            b = v[j];
            if (a[1] <= y) {
              if (b[1] > y && isLeft(a, b, p) > 0) ++wn;
            } else {
              if (b[1] <= y && isLeft(a, b, p) < 0) --wn;
            }
            a = b;
          }
        }
        return wn !== 0;
      }
      function isLeft(a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
      }
      function interpolate(from, to, direction, listener) {
        var a = 0, a1 = 0;
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
          do {
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
          } while ((a = (a + direction + 4) % 4) !== a1);
        } else {
          listener.point(to[0], to[1]);
        }
      }
      function visible(x, y) {
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
      }
      function point(x, y) {
        if (visible(x, y)) listener.point(x, y);
      }
      var x__, y__, v__, x_, y_, v_, first;
      function lineStart() {
        clip.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferListener.rejoin();
          segments.push(bufferListener.buffer());
        }
        clip.point = point;
        if (v_) listener.lineEnd();
      }
      function linePoint(x, y) {
        x = Math.max(-d3_geo_clipViewMAX, Math.min(d3_geo_clipViewMAX, x));
        y = Math.max(-d3_geo_clipViewMAX, Math.min(d3_geo_clipViewMAX, y));
        var v = visible(x, y);
        if (polygon) ring.push([ x, y ]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            listener.lineStart();
            listener.point(x, y);
          }
        } else {
          if (v && v_) listener.point(x, y); else {
            var a = [ x_, y_ ], b = [ x, y ];
            if (clipLine(a, b)) {
              if (!v_) {
                listener.lineStart();
                listener.point(a[0], a[1]);
              }
              listener.point(b[0], b[1]);
              if (!v) listener.lineEnd();
            } else if (v) {
              listener.lineStart();
              listener.point(x, y);
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }
      return clip;
    };
    function corner(p, direction) {
      return Math.abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : Math.abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : Math.abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
    }
    function compare(a, b) {
      return comparePoints(a.point, b.point);
    }
    function comparePoints(a, b) {
      var ca = corner(a, 1), cb = corner(b, 1);
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
    }
    function clipLine(a, b) {
      var dx = b[0] - a[0], dy = b[1] - a[1], t = [ 0, 1 ];
      if (Math.abs(dx) < ε && Math.abs(dy) < ε) return x0 <= a[0] && a[0] <= x1 && y0 <= a[1] && a[1] <= y1;
      if (d3_geo_clipViewT(x0 - a[0], dx, t) && d3_geo_clipViewT(a[0] - x1, -dx, t) && d3_geo_clipViewT(y0 - a[1], dy, t) && d3_geo_clipViewT(a[1] - y1, -dy, t)) {
        if (t[1] < 1) {
          b[0] = a[0] + t[1] * dx;
          b[1] = a[1] + t[1] * dy;
        }
        if (t[0] > 0) {
          a[0] += t[0] * dx;
          a[1] += t[0] * dy;
        }
        return true;
      }
      return false;
    }
  }
  function d3_geo_clipViewT(num, denominator, t) {
    if (Math.abs(denominator) < ε) return num <= 0;
    var u = num / denominator;
    if (denominator > 0) {
      if (u > t[1]) return false;
      if (u > t[0]) t[0] = u;
    } else {
      if (u < t[0]) return false;
      if (u < t[1]) t[1] = u;
    }
    return true;
  }
  function d3_geo_compose(a, b) {
    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }
    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
    return compose;
  }
  function d3_geo_conic(projectAt) {
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
    p.parallels = function(_) {
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
    };
    return p;
  }
  function d3_geo_conicEqualArea(φ0, φ1) {
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
    function forward(λ, φ) {
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = ρ0 - y;
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];
    };
    return forward;
  }
  (d3.geo.conicEqualArea = function() {
    return d3_geo_conic(d3_geo_conicEqualArea);
  }).raw = d3_geo_conicEqualArea;
  d3.geo.albers = function() {
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);
  };
  d3.geo.albersUsa = function() {
    var lower48 = d3.geo.albers();
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);
    var point, pointStream = {
      point: function(x, y) {
        point = [ x, y ];
      }
    }, lower48Point, alaskaPoint, hawaiiPoint;
    function albersUsa(coordinates) {
      var x = coordinates[0], y = coordinates[1];
      point = null;
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
      return point;
    }
    albersUsa.invert = function(coordinates) {
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
    };
    albersUsa.stream = function(stream) {
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
      return {
        point: function(x, y) {
          lower48Stream.point(x, y);
          alaskaStream.point(x, y);
          hawaiiStream.point(x, y);
        },
        sphere: function() {
          lower48Stream.sphere();
          alaskaStream.sphere();
          hawaiiStream.sphere();
        },
        lineStart: function() {
          lower48Stream.lineStart();
          alaskaStream.lineStart();
          hawaiiStream.lineStart();
        },
        lineEnd: function() {
          lower48Stream.lineEnd();
          alaskaStream.lineEnd();
          hawaiiStream.lineEnd();
        },
        polygonStart: function() {
          lower48Stream.polygonStart();
          alaskaStream.polygonStart();
          hawaiiStream.polygonStart();
        },
        polygonEnd: function() {
          lower48Stream.polygonEnd();
          alaskaStream.polygonEnd();
          hawaiiStream.polygonEnd();
        }
      };
    };
    albersUsa.precision = function(_) {
      if (!arguments.length) return lower48.precision();
      lower48.precision(_);
      alaska.precision(_);
      hawaii.precision(_);
      return albersUsa;
    };
    albersUsa.scale = function(_) {
      if (!arguments.length) return lower48.scale();
      lower48.scale(_);
      alaska.scale(_ * .35);
      hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    };
    albersUsa.translate = function(_) {
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(), x = +_[0], y = +_[1];
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      return albersUsa;
    };
    return albersUsa.scale(1070);
  };
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_pathAreaPolygon = 0;
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
      d3_geo_pathAreaSum += Math.abs(d3_geo_pathAreaPolygon / 2);
    }
  };
  function d3_geo_pathAreaRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathArea.point = function(x, y) {
      d3_geo_pathArea.point = nextPoint;
      x00 = x0 = x, y00 = y0 = y;
    };
    function nextPoint(x, y) {
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
      x0 = x, y0 = y;
    }
    d3_geo_pathArea.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
  var d3_geo_pathBounds = {
    point: d3_geo_pathBoundsPoint,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_pathBoundsPoint(x, y) {
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
  }
  function d3_geo_pathBuffer() {
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointCircle = d3_geo_pathBufferCircle(_);
        return stream;
      },
      result: function() {
        if (buffer.length) {
          var result = buffer.join("");
          buffer = [];
          return result;
        }
      }
    };
    function point(x, y) {
      buffer.push("M", x, ",", y, pointCircle);
    }
    function pointLineStart(x, y) {
      buffer.push("M", x, ",", y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      buffer.push("L", x, ",", y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      buffer.push("Z");
    }
    return stream;
  }
  function d3_geo_pathBufferCircle(radius) {
    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
  }
  var d3_geo_pathCentroid = {
    point: d3_geo_pathCentroidPoint,
    lineStart: d3_geo_pathCentroidLineStart,
    lineEnd: d3_geo_pathCentroidLineEnd,
    polygonStart: function() {
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
    }
  };
  function d3_geo_pathCentroidPoint(x, y) {
    d3_geo_centroidX0 += x;
    d3_geo_centroidY0 += y;
    ++d3_geo_centroidZ0;
  }
  function d3_geo_pathCentroidLineStart() {
    var x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
  }
  function d3_geo_pathCentroidLineEnd() {
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
  }
  function d3_geo_pathCentroidRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      z = y0 * x - x0 * y;
      d3_geo_centroidX2 += z * (x0 + x);
      d3_geo_centroidY2 += z * (y0 + y);
      d3_geo_centroidZ2 += z * 3;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
    d3_geo_pathCentroid.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  function d3_geo_pathContext(context) {
    var pointRadius = 4.5;
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointRadius = _;
        return stream;
      },
      result: d3_noop
    };
    function point(x, y) {
      context.moveTo(x, y);
      context.arc(x, y, pointRadius, 0, 2 * π);
    }
    function pointLineStart(x, y) {
      context.moveTo(x, y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      context.lineTo(x, y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      context.closePath();
    }
    return stream;
  }
  function d3_geo_resample(project) {
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
    function resample(stream) {
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
      var resample = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          stream.polygonStart();
          resample.lineStart = ringStart;
        },
        polygonEnd: function() {
          stream.polygonEnd();
          resample.lineStart = lineStart;
        }
      };
      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }
      function lineStart() {
        x0 = NaN;
        resample.point = linePoint;
        stream.lineStart();
      }
      function linePoint(λ, φ) {
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }
      function lineEnd() {
        resample.point = point;
        stream.lineEnd();
      }
      function ringStart() {
        lineStart();
        resample.point = ringPoint;
        resample.lineEnd = ringEnd;
      }
      function ringPoint(λ, φ) {
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resample.point = linePoint;
      }
      function ringEnd() {
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
        resample.lineEnd = lineEnd;
        lineEnd();
      }
      return resample;
    }
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
      if (d2 > 4 * δ2 && depth--) {
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = Math.abs(Math.abs(c) - 1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > δ2 || Math.abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
        }
      }
    }
    resample.precision = function(_) {
      if (!arguments.length) return Math.sqrt(δ2);
      maxDepth = (δ2 = _ * _) > 0 && 16;
      return resample;
    };
    return resample;
  }
  d3.geo.path = function() {
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;
    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
        d3.geo.stream(object, cacheStream);
      }
      return contextStream.result();
    }
    path.area = function(object) {
      d3_geo_pathAreaSum = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathArea));
      return d3_geo_pathAreaSum;
    };
    path.centroid = function(object) {
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];
    };
    path.bounds = function(object) {
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];
    };
    path.projection = function(_) {
      if (!arguments.length) return projection;
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
      return reset();
    };
    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return reset();
    };
    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };
    function reset() {
      cacheStream = null;
      return path;
    }
    return path.projection(d3.geo.albersUsa()).context(null);
  };
  function d3_geo_pathProjectStream(project) {
    var resample = d3_geo_resample(function(λ, φ) {
      return project([ λ * d3_degrees, φ * d3_degrees ]);
    });
    return function(stream) {
      stream = resample(stream);
      return {
        point: function(λ, φ) {
          stream.point(λ * d3_radians, φ * d3_radians);
        },
        sphere: function() {
          stream.sphere();
        },
        lineStart: function() {
          stream.lineStart();
        },
        lineEnd: function() {
          stream.lineEnd();
        },
        polygonStart: function() {
          stream.polygonStart();
        },
        polygonEnd: function() {
          stream.polygonEnd();
        }
      };
    };
  }
  d3.geo.projection = d3_geo_projection;
  d3.geo.projectionMutator = d3_geo_projectionMutator;
  function d3_geo_projection(project) {
    return d3_geo_projectionMutator(function() {
      return project;
    })();
  }
  function d3_geo_projectionMutator(projectAt) {
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {
      x = project(x, y);
      return [ x[0] * k + δx, δy - x[1] * k ];
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;
    function projection(point) {
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
      return [ point[0] * k + δx, δy - point[1] * k ];
    }
    function invert(point) {
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];
    }
    projection.stream = function(output) {
      if (stream) stream.valid = false;
      stream = d3_geo_projectionRadiansRotate(rotate, preclip(projectResample(postclip(output))));
      stream.valid = true;
      return stream;
    };
    projection.clipAngle = function(_) {
      if (!arguments.length) return clipAngle;
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
      return invalidate();
    };
    projection.clipExtent = function(_) {
      if (!arguments.length) return clipExtent;
      clipExtent = _;
      postclip = _ == null ? d3_identity : d3_geo_clipView(_[0][0], _[0][1], _[1][0], _[1][1]);
      return invalidate();
    };
    projection.scale = function(_) {
      if (!arguments.length) return k;
      k = +_;
      return reset();
    };
    projection.translate = function(_) {
      if (!arguments.length) return [ x, y ];
      x = +_[0];
      y = +_[1];
      return reset();
    };
    projection.center = function(_) {
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];
      λ = _[0] % 360 * d3_radians;
      φ = _[1] % 360 * d3_radians;
      return reset();
    };
    projection.rotate = function(_) {
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];
      δλ = _[0] % 360 * d3_radians;
      δφ = _[1] % 360 * d3_radians;
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
      return reset();
    };
    d3.rebind(projection, projectResample, "precision");
    function reset() {
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
      var center = project(λ, φ);
      δx = x - center[0] * k;
      δy = y + center[1] * k;
      return invalidate();
    }
    function invalidate() {
      if (stream) {
        stream.valid = false;
        stream = null;
      }
      return projection;
    }
    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return reset();
    };
  }
  function d3_geo_projectionRadiansRotate(rotate, stream) {
    return {
      point: function(x, y) {
        y = rotate(x * d3_radians, y * d3_radians), x = y[0];
        stream.point(x > π ? x - 2 * π : x < -π ? x + 2 * π : x, y[1]);
      },
      sphere: function() {
        stream.sphere();
      },
      lineStart: function() {
        stream.lineStart();
      },
      lineEnd: function() {
        stream.lineEnd();
      },
      polygonStart: function() {
        stream.polygonStart();
      },
      polygonEnd: function() {
        stream.polygonEnd();
      }
    };
  }
  function d3_geo_equirectangular(λ, φ) {
    return [ λ, φ ];
  }
  (d3.geo.equirectangular = function() {
    return d3_geo_projection(d3_geo_equirectangular);
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
  d3.geo.rotation = function(rotate) {
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
    function forward(coordinates) {
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    }
    forward.invert = function(coordinates) {
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    };
    return forward;
  };
  function d3_geo_rotation(δλ, δφ, δγ) {
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_equirectangular;
  }
  function d3_geo_forwardRotationλ(δλ) {
    return function(λ, φ) {
      return λ += δλ, [ λ > π ? λ - 2 * π : λ < -π ? λ + 2 * π : λ, φ ];
    };
  }
  function d3_geo_rotationλ(δλ) {
    var rotation = d3_geo_forwardRotationλ(δλ);
    rotation.invert = d3_geo_forwardRotationλ(-δλ);
    return rotation;
  }
  function d3_geo_rotationφγ(δφ, δγ) {
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
    function rotation(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];
    }
    rotation.invert = function(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];
    };
    return rotation;
  }
  d3.geo.circle = function() {
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;
    function circle() {
      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
      interpolate(null, null, 1, {
        point: function(x, y) {
          ring.push(x = rotate(x, y));
          x[0] *= d3_degrees, x[1] *= d3_degrees;
        }
      });
      return {
        type: "Polygon",
        coordinates: [ ring ]
      };
    }
    circle.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return circle;
    };
    circle.angle = function(x) {
      if (!arguments.length) return angle;
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
      return circle;
    };
    circle.precision = function(_) {
      if (!arguments.length) return precision;
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
      return circle;
    };
    return circle.angle(90);
  };
  function d3_geo_circleInterpolate(radius, precision) {
    var cr = Math.cos(radius), sr = Math.sin(radius);
    return function(from, to, direction, listener) {
      if (from != null) {
        from = d3_geo_circleAngle(cr, from);
        to = d3_geo_circleAngle(cr, to);
        if (direction > 0 ? from < to : from > to) from += direction * 2 * π;
      } else {
        from = radius + direction * 2 * π;
        to = radius;
      }
      var point;
      for (var step = direction * precision, t = from; direction > 0 ? t > to : t < to; t -= step) {
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);
      }
    };
  }
  function d3_geo_circleAngle(cr, point) {
    var a = d3_geo_cartesian(point);
    a[0] -= cr;
    d3_geo_cartesianNormalize(a);
    var angle = d3_acos(-a[1]);
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
  }
  d3.geo.distance = function(a, b) {
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
  };
  d3.geo.graticule = function() {
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
    function graticule() {
      return {
        type: "MultiLineString",
        coordinates: lines()
      };
    }
    function lines() {
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
        return Math.abs(x % DX) > ε;
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
        return Math.abs(y % DY) > ε;
      }).map(y));
    }
    graticule.lines = function() {
      return lines().map(function(coordinates) {
        return {
          type: "LineString",
          coordinates: coordinates
        };
      });
    };
    graticule.outline = function() {
      return {
        type: "Polygon",
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
      };
    };
    graticule.extent = function(_) {
      if (!arguments.length) return graticule.minorExtent();
      return graticule.majorExtent(_).minorExtent(_);
    };
    graticule.majorExtent = function(_) {
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
      X0 = +_[0][0], X1 = +_[1][0];
      Y0 = +_[0][1], Y1 = +_[1][1];
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
      return graticule.precision(precision);
    };
    graticule.minorExtent = function(_) {
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
      x0 = +_[0][0], x1 = +_[1][0];
      y0 = +_[0][1], y1 = +_[1][1];
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
      return graticule.precision(precision);
    };
    graticule.step = function(_) {
      if (!arguments.length) return graticule.minorStep();
      return graticule.majorStep(_).minorStep(_);
    };
    graticule.majorStep = function(_) {
      if (!arguments.length) return [ DX, DY ];
      DX = +_[0], DY = +_[1];
      return graticule;
    };
    graticule.minorStep = function(_) {
      if (!arguments.length) return [ dx, dy ];
      dx = +_[0], dy = +_[1];
      return graticule;
    };
    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = +_;
      x = d3_geo_graticuleX(y0, y1, 90);
      y = d3_geo_graticuleY(x0, x1, precision);
      X = d3_geo_graticuleX(Y0, Y1, 90);
      Y = d3_geo_graticuleY(X0, X1, precision);
      return graticule;
    };
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
  };
  function d3_geo_graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - ε, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [ x, y ];
      });
    };
  }
  function d3_geo_graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - ε, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [ x, y ];
      });
    };
  }
  function d3_source(d) {
    return d.source;
  }
  function d3_target(d) {
    return d.target;
  }
  d3.geo.greatArc = function() {
    var source = d3_source, source_, target = d3_target, target_;
    function greatArc() {
      return {
        type: "LineString",
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
      };
    }
    greatArc.distance = function() {
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
    };
    greatArc.source = function(_) {
      if (!arguments.length) return source;
      source = _, source_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.target = function(_) {
      if (!arguments.length) return target;
      target = _, target_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.precision = function() {
      return arguments.length ? greatArc : 0;
    };
    return greatArc;
  };
  d3.geo.interpolate = function(source, target) {
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
  };
  function d3_geo_interpolate(x0, y0, x1, y1) {
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);
    var interpolate = d ? function(t) {
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];
    } : function() {
      return [ x0 * d3_degrees, y0 * d3_degrees ];
    };
    interpolate.distance = d;
    return interpolate;
  }
  d3.geo.length = function(object) {
    d3_geo_lengthSum = 0;
    d3.geo.stream(object, d3_geo_length);
    return d3_geo_lengthSum;
  };
  var d3_geo_lengthSum;
  var d3_geo_length = {
    sphere: d3_noop,
    point: d3_noop,
    lineStart: d3_geo_lengthLineStart,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_lengthLineStart() {
    var λ0, sinφ0, cosφ0;
    d3_geo_length.point = function(λ, φ) {
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
      d3_geo_length.point = nextPoint;
    };
    d3_geo_length.lineEnd = function() {
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
    };
    function nextPoint(λ, φ) {
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = Math.abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
    }
  }
  function d3_geo_azimuthal(scale, angle) {
    function azimuthal(λ, φ) {
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
    }
    azimuthal.invert = function(x, y) {
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
    };
    return azimuthal;
  }
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {
    return Math.sqrt(2 / (1 + cosλcosφ));
  }, function(ρ) {
    return 2 * Math.asin(ρ / 2);
  });
  (d3.geo.azimuthalEqualArea = function() {
    return d3_geo_projection(d3_geo_azimuthalEqualArea);
  }).raw = d3_geo_azimuthalEqualArea;
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {
    var c = Math.acos(cosλcosφ);
    return c && c / Math.sin(c);
  }, d3_identity);
  (d3.geo.azimuthalEquidistant = function() {
    return d3_geo_projection(d3_geo_azimuthalEquidistant);
  }).raw = d3_geo_azimuthalEquidistant;
  function d3_geo_conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), t = function(φ) {
      return Math.tan(π / 4 + φ / 2);
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
    if (!n) return d3_geo_mercator;
    function forward(λ, φ) {
      var ρ = Math.abs(Math.abs(φ) - π / 2) < ε ? 0 : F / Math.pow(t(φ), n);
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - π / 2 ];
    };
    return forward;
  }
  (d3.geo.conicConformal = function() {
    return d3_geo_conic(d3_geo_conicConformal);
  }).raw = d3_geo_conicConformal;
  function d3_geo_conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
    if (Math.abs(n) < ε) return d3_geo_equirectangular;
    function forward(λ, φ) {
      var ρ = G - φ;
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = G - y;
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
    };
    return forward;
  }
  (d3.geo.conicEquidistant = function() {
    return d3_geo_conic(d3_geo_conicEquidistant);
  }).raw = d3_geo_conicEquidistant;
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / cosλcosφ;
  }, Math.atan);
  (d3.geo.gnomonic = function() {
    return d3_geo_projection(d3_geo_gnomonic);
  }).raw = d3_geo_gnomonic;
  function d3_geo_mercator(λ, φ) {
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
  }
  d3_geo_mercator.invert = function(x, y) {
    return [ x, 2 * Math.atan(Math.exp(y)) - π / 2 ];
  };
  function d3_geo_mercatorProjection(project) {
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
    m.scale = function() {
      var v = scale.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.translate = function() {
      var v = translate.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.clipExtent = function(_) {
      var v = clipExtent.apply(m, arguments);
      if (v === m) {
        if (clipAuto = _ == null) {
          var k = π * scale(), t = translate();
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
        }
      } else if (clipAuto) {
        v = null;
      }
      return v;
    };
    return m.clipExtent(null);
  }
  (d3.geo.mercator = function() {
    return d3_geo_mercatorProjection(d3_geo_mercator);
  }).raw = d3_geo_mercator;
  var d3_geo_orthographic = d3_geo_azimuthal(function() {
    return 1;
  }, Math.asin);
  (d3.geo.orthographic = function() {
    return d3_geo_projection(d3_geo_orthographic);
  }).raw = d3_geo_orthographic;
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / (1 + cosλcosφ);
  }, function(ρ) {
    return 2 * Math.atan(ρ);
  });
  (d3.geo.stereographic = function() {
    return d3_geo_projection(d3_geo_stereographic);
  }).raw = d3_geo_stereographic;
  function d3_geo_transverseMercator(λ, φ) {
    var B = Math.cos(φ) * Math.sin(λ);
    return [ Math.log((1 + B) / (1 - B)) / 2, Math.atan2(Math.tan(φ), Math.cos(λ)) ];
  }
  d3_geo_transverseMercator.invert = function(x, y) {
    return [ Math.atan2(d3_sinh(x), Math.cos(y)), d3_asin(Math.sin(y) / d3_cosh(x)) ];
  };
  (d3.geo.transverseMercator = function() {
    return d3_geo_mercatorProjection(d3_geo_transverseMercator);
  }).raw = d3_geo_transverseMercator;
  d3.geom = {};
  d3.svg = {};
  function d3_svg_line(projection) {
    var x = d3_svg_lineX, y = d3_svg_lineY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
    function line(data) {
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
      function segment() {
        segments.push("M", interpolate(projection(points), tension));
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
        } else if (points.length) {
          segment();
          points = [];
        }
      }
      if (points.length) segment();
      return segments.length ? segments.join("") : null;
    }
    line.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return line;
    };
    line.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return line;
    };
    line.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return line;
    };
    line.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      return line;
    };
    line.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return line;
    };
    return line;
  }
  d3.svg.line = function() {
    return d3_svg_line(d3_identity);
  };
  function d3_svg_lineX(d) {
    return d[0];
  }
  function d3_svg_lineY(d) {
    return d[1];
  }
  var d3_svg_lineInterpolators = d3.map({
    linear: d3_svg_lineLinear,
    "linear-closed": d3_svg_lineLinearClosed,
    step: d3_svg_lineStep,
    "step-before": d3_svg_lineStepBefore,
    "step-after": d3_svg_lineStepAfter,
    basis: d3_svg_lineBasis,
    "basis-open": d3_svg_lineBasisOpen,
    "basis-closed": d3_svg_lineBasisClosed,
    bundle: d3_svg_lineBundle,
    cardinal: d3_svg_lineCardinal,
    "cardinal-open": d3_svg_lineCardinalOpen,
    "cardinal-closed": d3_svg_lineCardinalClosed,
    monotone: d3_svg_lineMonotone
  });
  d3_svg_lineInterpolators.forEach(function(key, value) {
    value.key = key;
    value.closed = /-closed$/.test(key);
  });
  function d3_svg_lineLinear(points) {
    return points.join("L");
  }
  function d3_svg_lineLinearClosed(points) {
    return d3_svg_lineLinear(points) + "Z";
  }
  function d3_svg_lineStep(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
    if (n > 1) path.push("H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepBefore(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepAfter(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
    return path.join("");
  }
  function d3_svg_lineCardinalOpen(points, tension) {
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, points.length - 1), d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineCardinalClosed(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), 
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
  }
  function d3_svg_lineCardinal(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineHermite(points, tangents) {
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
      return d3_svg_lineLinear(points);
    }
    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
    if (quad) {
      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
      p0 = points[1];
      pi = 2;
    }
    if (tangents.length > 1) {
      t = tangents[1];
      p = points[pi];
      pi++;
      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      for (var i = 2; i < tangents.length; i++, pi++) {
        p = points[pi];
        t = tangents[i];
        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      }
    }
    if (quad) {
      var lp = points[pi];
      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
    }
    return path;
  }
  function d3_svg_lineCardinalTangents(points, tension) {
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
    while (++i < n) {
      p0 = p1;
      p1 = p2;
      p2 = points[i];
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
    }
    return tangents;
  }
  function d3_svg_lineBasis(points) {
    if (points.length < 3) return d3_svg_lineLinear(points);
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    points.push(points[n - 1]);
    while (++i <= n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    points.pop();
    path.push("L", pi);
    return path.join("");
  }
  function d3_svg_lineBasisOpen(points) {
    if (points.length < 4) return d3_svg_lineLinear(points);
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
    while (++i < 3) {
      pi = points[i];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
    --i;
    while (++i < n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBasisClosed(points) {
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
    while (++i < 4) {
      pi = points[i % n];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    --i;
    while (++i < m) {
      pi = points[i % n];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBundle(points, tension) {
    var n = points.length - 1;
    if (n) {
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
      while (++i <= n) {
        p = points[i];
        t = i / n;
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
      }
    }
    return d3_svg_lineBasis(points);
  }
  function d3_svg_lineDot4(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
  function d3_svg_lineBasisBezier(path, x, y) {
    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
  }
  function d3_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
  }
  function d3_svg_lineFiniteDifferences(points) {
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
    while (++i < j) {
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
    }
    m[i] = d;
    return m;
  }
  function d3_svg_lineMonotoneTangents(points) {
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
    while (++i < j) {
      d = d3_svg_lineSlope(points[i], points[i + 1]);
      if (Math.abs(d) < 1e-6) {
        m[i] = m[i + 1] = 0;
      } else {
        a = m[i] / d;
        b = m[i + 1] / d;
        s = a * a + b * b;
        if (s > 9) {
          s = d * 3 / Math.sqrt(s);
          m[i] = s * a;
          m[i + 1] = s * b;
        }
      }
    }
    i = -1;
    while (++i <= j) {
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
      tangents.push([ s || 0, m[i] * s || 0 ]);
    }
    return tangents;
  }
  function d3_svg_lineMonotone(points) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
  }
  d3.geom.hull = function(vertices) {
    var x = d3_svg_lineX, y = d3_svg_lineY;
    if (arguments.length) return hull(vertices);
    function hull(data) {
      if (data.length < 3) return [];
      var fx = d3_functor(x), fy = d3_functor(y), n = data.length, vertices, plen = n - 1, points = [], stack = [], d, i, j, h = 0, x1, y1, x2, y2, u, v, a, sp;
      if (fx === d3_svg_lineX && y === d3_svg_lineY) vertices = data; else for (i = 0, 
      vertices = []; i < n; ++i) {
        vertices.push([ +fx.call(this, d = data[i], i), +fy.call(this, d, i) ]);
      }
      for (i = 1; i < n; ++i) {
        if (vertices[i][1] < vertices[h][1] || vertices[i][1] == vertices[h][1] && vertices[i][0] < vertices[h][0]) h = i;
      }
      for (i = 0; i < n; ++i) {
        if (i === h) continue;
        y1 = vertices[i][1] - vertices[h][1];
        x1 = vertices[i][0] - vertices[h][0];
        points.push({
          angle: Math.atan2(y1, x1),
          index: i
        });
      }
      points.sort(function(a, b) {
        return a.angle - b.angle;
      });
      a = points[0].angle;
      v = points[0].index;
      u = 0;
      for (i = 1; i < plen; ++i) {
        j = points[i].index;
        if (a == points[i].angle) {
          x1 = vertices[v][0] - vertices[h][0];
          y1 = vertices[v][1] - vertices[h][1];
          x2 = vertices[j][0] - vertices[h][0];
          y2 = vertices[j][1] - vertices[h][1];
          if (x1 * x1 + y1 * y1 >= x2 * x2 + y2 * y2) {
            points[i].index = -1;
            continue;
          } else {
            points[u].index = -1;
          }
        }
        a = points[i].angle;
        u = i;
        v = j;
      }
      stack.push(h);
      for (i = 0, j = 0; i < 2; ++j) {
        if (points[j].index > -1) {
          stack.push(points[j].index);
          i++;
        }
      }
      sp = stack.length;
      for (;j < plen; ++j) {
        if (points[j].index < 0) continue;
        while (!d3_geom_hullCCW(stack[sp - 2], stack[sp - 1], points[j].index, vertices)) {
          --sp;
        }
        stack[sp++] = points[j].index;
      }
      var poly = [];
      for (i = sp - 1; i >= 0; --i) poly.push(data[stack[i]]);
      return poly;
    }
    hull.x = function(_) {
      return arguments.length ? (x = _, hull) : x;
    };
    hull.y = function(_) {
      return arguments.length ? (y = _, hull) : y;
    };
    return hull;
  };
  function d3_geom_hullCCW(i1, i2, i3, v) {
    var t, a, b, c, d, e, f;
    t = v[i1];
    a = t[0];
    b = t[1];
    t = v[i2];
    c = t[0];
    d = t[1];
    t = v[i3];
    e = t[0];
    f = t[1];
    return (f - b) * (c - a) - (d - b) * (e - a) > 0;
  }
  d3.geom.polygon = function(coordinates) {
    d3_subclass(coordinates, d3_geom_polygonPrototype);
    return coordinates;
  };
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
  d3_geom_polygonPrototype.area = function() {
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;
    while (++i < n) {
      a = b;
      b = this[i];
      area += a[1] * b[0] - a[0] * b[1];
    }
    return area * .5;
  };
  d3_geom_polygonPrototype.centroid = function(k) {
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;
    if (!arguments.length) k = -1 / (6 * this.area());
    while (++i < n) {
      a = b;
      b = this[i];
      c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    }
    return [ x * k, y * k ];
  };
  d3_geom_polygonPrototype.clip = function(subject) {
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;
    while (++i < n) {
      input = subject.slice();
      subject.length = 0;
      b = this[i];
      c = input[(m = input.length - closed) - 1];
      j = -1;
      while (++j < m) {
        d = input[j];
        if (d3_geom_polygonInside(d, a, b)) {
          if (!d3_geom_polygonInside(c, a, b)) {
            subject.push(d3_geom_polygonIntersect(c, d, a, b));
          }
          subject.push(d);
        } else if (d3_geom_polygonInside(c, a, b)) {
          subject.push(d3_geom_polygonIntersect(c, d, a, b));
        }
        c = d;
      }
      if (closed) subject.push(subject[0]);
      a = b;
    }
    return subject;
  };
  function d3_geom_polygonInside(p, a, b) {
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
  }
  function d3_geom_polygonIntersect(c, d, a, b) {
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [ x1 + ua * x21, y1 + ua * y21 ];
  }
  function d3_geom_polygonClosed(coordinates) {
    var a = coordinates[0], b = coordinates[coordinates.length - 1];
    return !(a[0] - b[0] || a[1] - b[1]);
  }
  d3.geom.delaunay = function(vertices) {
    var edges = vertices.map(function() {
      return [];
    }), triangles = [];
    d3_geom_voronoiTessellate(vertices, function(e) {
      edges[e.region.l.index].push(vertices[e.region.r.index]);
    });
    edges.forEach(function(edge, i) {
      var v = vertices[i], cx = v[0], cy = v[1];
      edge.forEach(function(v) {
        v.angle = Math.atan2(v[0] - cx, v[1] - cy);
      });
      edge.sort(function(a, b) {
        return a.angle - b.angle;
      });
      for (var j = 0, m = edge.length - 1; j < m; j++) {
        triangles.push([ v, edge[j], edge[j + 1] ]);
      }
    });
    return triangles;
  };
  d3.geom.voronoi = function(points) {
    var x = d3_svg_lineX, y = d3_svg_lineY, clipPolygon = null;
    if (arguments.length) return voronoi(points);
    function voronoi(data) {
      var points, polygons = data.map(function() {
        return [];
      }), fx = d3_functor(x), fy = d3_functor(y), d, i, n = data.length, Z = 1e6;
      if (fx === d3_svg_lineX && fy === d3_svg_lineY) points = data; else for (points = new Array(n), 
      i = 0; i < n; ++i) {
        points[i] = [ +fx.call(this, d = data[i], i), +fy.call(this, d, i) ];
      }
      d3_geom_voronoiTessellate(points, function(e) {
        var s1, s2, x1, x2, y1, y2;
        if (e.a === 1 && e.b >= 0) {
          s1 = e.ep.r;
          s2 = e.ep.l;
        } else {
          s1 = e.ep.l;
          s2 = e.ep.r;
        }
        if (e.a === 1) {
          y1 = s1 ? s1.y : -Z;
          x1 = e.c - e.b * y1;
          y2 = s2 ? s2.y : Z;
          x2 = e.c - e.b * y2;
        } else {
          x1 = s1 ? s1.x : -Z;
          y1 = e.c - e.a * x1;
          x2 = s2 ? s2.x : Z;
          y2 = e.c - e.a * x2;
        }
        var v1 = [ x1, y1 ], v2 = [ x2, y2 ];
        polygons[e.region.l.index].push(v1, v2);
        polygons[e.region.r.index].push(v1, v2);
      });
      polygons = polygons.map(function(polygon, i) {
        var cx = points[i][0], cy = points[i][1], angle = polygon.map(function(v) {
          return Math.atan2(v[0] - cx, v[1] - cy);
        }), order = d3.range(polygon.length).sort(function(a, b) {
          return angle[a] - angle[b];
        });
        return order.filter(function(d, i) {
          return !i || angle[d] - angle[order[i - 1]] > ε;
        }).map(function(d) {
          return polygon[d];
        });
      });
      polygons.forEach(function(polygon, i) {
        var n = polygon.length;
        if (!n) return polygon.push([ -Z, -Z ], [ -Z, Z ], [ Z, Z ], [ Z, -Z ]);
        if (n > 2) return;
        var p0 = points[i], p1 = polygon[0], p2 = polygon[1], x0 = p0[0], y0 = p0[1], x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1], dx = Math.abs(x2 - x1), dy = y2 - y1;
        if (Math.abs(dy) < ε) {
          var y = y0 < y1 ? -Z : Z;
          polygon.push([ -Z, y ], [ Z, y ]);
        } else if (dx < ε) {
          var x = x0 < x1 ? -Z : Z;
          polygon.push([ x, -Z ], [ x, Z ]);
        } else {
          var y = (x2 - x1) * (y1 - y0) < (x1 - x0) * (y2 - y1) ? Z : -Z, z = Math.abs(dy) - dx;
          if (Math.abs(z) < ε) {
            polygon.push([ dy < 0 ? y : -y, y ]);
          } else {
            if (z > 0) y *= -1;
            polygon.push([ -Z, y ], [ Z, y ]);
          }
        }
      });
      if (clipPolygon) for (i = 0; i < n; ++i) clipPolygon.clip(polygons[i]);
      for (i = 0; i < n; ++i) polygons[i].point = data[i];
      return polygons;
    }
    voronoi.x = function(_) {
      return arguments.length ? (x = _, voronoi) : x;
    };
    voronoi.y = function(_) {
      return arguments.length ? (y = _, voronoi) : y;
    };
    voronoi.clipExtent = function(_) {
      if (!arguments.length) return clipPolygon && [ clipPolygon[0], clipPolygon[2] ];
      if (_ == null) clipPolygon = null; else {
        var x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], y2 = +_[1][1];
        clipPolygon = d3.geom.polygon([ [ x1, y1 ], [ x1, y2 ], [ x2, y2 ], [ x2, y1 ] ]);
      }
      return voronoi;
    };
    voronoi.size = function(_) {
      if (!arguments.length) return clipPolygon && clipPolygon[2];
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);
    };
    voronoi.links = function(data) {
      var points, graph = data.map(function() {
        return [];
      }), links = [], fx = d3_functor(x), fy = d3_functor(y), d, i, n = data.length;
      if (fx === d3_svg_lineX && fy === d3_svg_lineY) points = data; else for (points = new Array(n), 
      i = 0; i < n; ++i) {
        points[i] = [ +fx.call(this, d = data[i], i), +fy.call(this, d, i) ];
      }
      d3_geom_voronoiTessellate(points, function(e) {
        var l = e.region.l.index, r = e.region.r.index;
        if (graph[l][r]) return;
        graph[l][r] = graph[r][l] = true;
        links.push({
          source: data[l],
          target: data[r]
        });
      });
      return links;
    };
    voronoi.triangles = function(data) {
      if (x === d3_svg_lineX && y === d3_svg_lineY) return d3.geom.delaunay(data);
      var points = new Array(n), fx = d3_functor(x), fy = d3_functor(y), d, i = -1, n = data.length;
      while (++i < n) {
        (points[i] = [ +fx.call(this, d = data[i], i), +fy.call(this, d, i) ]).data = d;
      }
      return d3.geom.delaunay(points).map(function(triangle) {
        return triangle.map(function(point) {
          return point.data;
        });
      });
    };
    return voronoi;
  };
  var d3_geom_voronoiOpposite = {
    l: "r",
    r: "l"
  };
  function d3_geom_voronoiTessellate(points, callback) {
    var Sites = {
      list: points.map(function(v, i) {
        return {
          index: i,
          x: v[0],
          y: v[1]
        };
      }).sort(function(a, b) {
        return a.y < b.y ? -1 : a.y > b.y ? 1 : a.x < b.x ? -1 : a.x > b.x ? 1 : 0;
      }),
      bottomSite: null
    };
    var EdgeList = {
      list: [],
      leftEnd: null,
      rightEnd: null,
      init: function() {
        EdgeList.leftEnd = EdgeList.createHalfEdge(null, "l");
        EdgeList.rightEnd = EdgeList.createHalfEdge(null, "l");
        EdgeList.leftEnd.r = EdgeList.rightEnd;
        EdgeList.rightEnd.l = EdgeList.leftEnd;
        EdgeList.list.unshift(EdgeList.leftEnd, EdgeList.rightEnd);
      },
      createHalfEdge: function(edge, side) {
        return {
          edge: edge,
          side: side,
          vertex: null,
          l: null,
          r: null
        };
      },
      insert: function(lb, he) {
        he.l = lb;
        he.r = lb.r;
        lb.r.l = he;
        lb.r = he;
      },
      leftBound: function(p) {
        var he = EdgeList.leftEnd;
        do {
          he = he.r;
        } while (he != EdgeList.rightEnd && Geom.rightOf(he, p));
        he = he.l;
        return he;
      },
      del: function(he) {
        he.l.r = he.r;
        he.r.l = he.l;
        he.edge = null;
      },
      right: function(he) {
        return he.r;
      },
      left: function(he) {
        return he.l;
      },
      leftRegion: function(he) {
        return he.edge == null ? Sites.bottomSite : he.edge.region[he.side];
      },
      rightRegion: function(he) {
        return he.edge == null ? Sites.bottomSite : he.edge.region[d3_geom_voronoiOpposite[he.side]];
      }
    };
    var Geom = {
      bisect: function(s1, s2) {
        var newEdge = {
          region: {
            l: s1,
            r: s2
          },
          ep: {
            l: null,
            r: null
          }
        };
        var dx = s2.x - s1.x, dy = s2.y - s1.y, adx = dx > 0 ? dx : -dx, ady = dy > 0 ? dy : -dy;
        newEdge.c = s1.x * dx + s1.y * dy + (dx * dx + dy * dy) * .5;
        if (adx > ady) {
          newEdge.a = 1;
          newEdge.b = dy / dx;
          newEdge.c /= dx;
        } else {
          newEdge.b = 1;
          newEdge.a = dx / dy;
          newEdge.c /= dy;
        }
        return newEdge;
      },
      intersect: function(el1, el2) {
        var e1 = el1.edge, e2 = el2.edge;
        if (!e1 || !e2 || e1.region.r == e2.region.r) {
          return null;
        }
        var d = e1.a * e2.b - e1.b * e2.a;
        if (Math.abs(d) < 1e-10) {
          return null;
        }
        var xint = (e1.c * e2.b - e2.c * e1.b) / d, yint = (e2.c * e1.a - e1.c * e2.a) / d, e1r = e1.region.r, e2r = e2.region.r, el, e;
        if (e1r.y < e2r.y || e1r.y == e2r.y && e1r.x < e2r.x) {
          el = el1;
          e = e1;
        } else {
          el = el2;
          e = e2;
        }
        var rightOfSite = xint >= e.region.r.x;
        if (rightOfSite && el.side === "l" || !rightOfSite && el.side === "r") {
          return null;
        }
        return {
          x: xint,
          y: yint
        };
      },
      rightOf: function(he, p) {
        var e = he.edge, topsite = e.region.r, rightOfSite = p.x > topsite.x;
        if (rightOfSite && he.side === "l") {
          return 1;
        }
        if (!rightOfSite && he.side === "r") {
          return 0;
        }
        if (e.a === 1) {
          var dyp = p.y - topsite.y, dxp = p.x - topsite.x, fast = 0, above = 0;
          if (!rightOfSite && e.b < 0 || rightOfSite && e.b >= 0) {
            above = fast = dyp >= e.b * dxp;
          } else {
            above = p.x + p.y * e.b > e.c;
            if (e.b < 0) {
              above = !above;
            }
            if (!above) {
              fast = 1;
            }
          }
          if (!fast) {
            var dxs = topsite.x - e.region.l.x;
            above = e.b * (dxp * dxp - dyp * dyp) < dxs * dyp * (1 + 2 * dxp / dxs + e.b * e.b);
            if (e.b < 0) {
              above = !above;
            }
          }
        } else {
          var yl = e.c - e.a * p.x, t1 = p.y - yl, t2 = p.x - topsite.x, t3 = yl - topsite.y;
          above = t1 * t1 > t2 * t2 + t3 * t3;
        }
        return he.side === "l" ? above : !above;
      },
      endPoint: function(edge, side, site) {
        edge.ep[side] = site;
        if (!edge.ep[d3_geom_voronoiOpposite[side]]) return;
        callback(edge);
      },
      distance: function(s, t) {
        var dx = s.x - t.x, dy = s.y - t.y;
        return Math.sqrt(dx * dx + dy * dy);
      }
    };
    var EventQueue = {
      list: [],
      insert: function(he, site, offset) {
        he.vertex = site;
        he.ystar = site.y + offset;
        for (var i = 0, list = EventQueue.list, l = list.length; i < l; i++) {
          var next = list[i];
          if (he.ystar > next.ystar || he.ystar == next.ystar && site.x > next.vertex.x) {
            continue;
          } else {
            break;
          }
        }
        list.splice(i, 0, he);
      },
      del: function(he) {
        for (var i = 0, ls = EventQueue.list, l = ls.length; i < l && ls[i] != he; ++i) {}
        ls.splice(i, 1);
      },
      empty: function() {
        return EventQueue.list.length === 0;
      },
      nextEvent: function(he) {
        for (var i = 0, ls = EventQueue.list, l = ls.length; i < l; ++i) {
          if (ls[i] == he) return ls[i + 1];
        }
        return null;
      },
      min: function() {
        var elem = EventQueue.list[0];
        return {
          x: elem.vertex.x,
          y: elem.ystar
        };
      },
      extractMin: function() {
        return EventQueue.list.shift();
      }
    };
    EdgeList.init();
    Sites.bottomSite = Sites.list.shift();
    var newSite = Sites.list.shift(), newIntStar;
    var lbnd, rbnd, llbnd, rrbnd, bisector;
    var bot, top, temp, p, v;
    var e, pm;
    while (true) {
      if (!EventQueue.empty()) {
        newIntStar = EventQueue.min();
      }
      if (newSite && (EventQueue.empty() || newSite.y < newIntStar.y || newSite.y == newIntStar.y && newSite.x < newIntStar.x)) {
        lbnd = EdgeList.leftBound(newSite);
        rbnd = EdgeList.right(lbnd);
        bot = EdgeList.rightRegion(lbnd);
        e = Geom.bisect(bot, newSite);
        bisector = EdgeList.createHalfEdge(e, "l");
        EdgeList.insert(lbnd, bisector);
        p = Geom.intersect(lbnd, bisector);
        if (p) {
          EventQueue.del(lbnd);
          EventQueue.insert(lbnd, p, Geom.distance(p, newSite));
        }
        lbnd = bisector;
        bisector = EdgeList.createHalfEdge(e, "r");
        EdgeList.insert(lbnd, bisector);
        p = Geom.intersect(bisector, rbnd);
        if (p) {
          EventQueue.insert(bisector, p, Geom.distance(p, newSite));
        }
        newSite = Sites.list.shift();
      } else if (!EventQueue.empty()) {
        lbnd = EventQueue.extractMin();
        llbnd = EdgeList.left(lbnd);
        rbnd = EdgeList.right(lbnd);
        rrbnd = EdgeList.right(rbnd);
        bot = EdgeList.leftRegion(lbnd);
        top = EdgeList.rightRegion(rbnd);
        v = lbnd.vertex;
        Geom.endPoint(lbnd.edge, lbnd.side, v);
        Geom.endPoint(rbnd.edge, rbnd.side, v);
        EdgeList.del(lbnd);
        EventQueue.del(rbnd);
        EdgeList.del(rbnd);
        pm = "l";
        if (bot.y > top.y) {
          temp = bot;
          bot = top;
          top = temp;
          pm = "r";
        }
        e = Geom.bisect(bot, top);
        bisector = EdgeList.createHalfEdge(e, pm);
        EdgeList.insert(llbnd, bisector);
        Geom.endPoint(e, d3_geom_voronoiOpposite[pm], v);
        p = Geom.intersect(llbnd, bisector);
        if (p) {
          EventQueue.del(llbnd);
          EventQueue.insert(llbnd, p, Geom.distance(p, bot));
        }
        p = Geom.intersect(bisector, rrbnd);
        if (p) {
          EventQueue.insert(bisector, p, Geom.distance(p, bot));
        }
      } else {
        break;
      }
    }
    for (lbnd = EdgeList.right(EdgeList.leftEnd); lbnd != EdgeList.rightEnd; lbnd = EdgeList.right(lbnd)) {
      callback(lbnd.edge);
    }
  }
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {
    var x = d3_svg_lineX, y = d3_svg_lineY, compat;
    if (compat = arguments.length) {
      x = d3_geom_quadtreeCompatX;
      y = d3_geom_quadtreeCompatY;
      if (compat === 3) {
        y2 = y1;
        x2 = x1;
        y1 = x1 = 0;
      }
      return quadtree(points);
    }
    function quadtree(data) {
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
      if (x1 != null) {
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
      } else {
        x2_ = y2_ = -(x1_ = y1_ = Infinity);
        xs = [], ys = [];
        n = data.length;
        if (compat) for (i = 0; i < n; ++i) {
          d = data[i];
          if (d.x < x1_) x1_ = d.x;
          if (d.y < y1_) y1_ = d.y;
          if (d.x > x2_) x2_ = d.x;
          if (d.y > y2_) y2_ = d.y;
          xs.push(d.x);
          ys.push(d.y);
        } else for (i = 0; i < n; ++i) {
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
          if (x_ < x1_) x1_ = x_;
          if (y_ < y1_) y1_ = y_;
          if (x_ > x2_) x2_ = x_;
          if (y_ > y2_) y2_ = y_;
          xs.push(x_);
          ys.push(y_);
        }
      }
      var dx = x2_ - x1_, dy = y2_ - y1_;
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
      function insert(n, d, x, y, x1, y1, x2, y2) {
        if (isNaN(x) || isNaN(y)) return;
        if (n.leaf) {
          var nx = n.x, ny = n.y;
          if (nx != null) {
            if (Math.abs(nx - x) + Math.abs(ny - y) < .01) {
              insertChild(n, d, x, y, x1, y1, x2, y2);
            } else {
              var nPoint = n.point;
              n.x = n.y = n.point = null;
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
              insertChild(n, d, x, y, x1, y1, x2, y2);
            }
          } else {
            n.x = x, n.y = y, n.point = d;
          }
        } else {
          insertChild(n, d, x, y, x1, y1, x2, y2);
        }
      }
      function insertChild(n, d, x, y, x1, y1, x2, y2) {
        var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, right = x >= sx, bottom = y >= sy, i = (bottom << 1) + right;
        n.leaf = false;
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
        if (right) x1 = sx; else x2 = sx;
        if (bottom) y1 = sy; else y2 = sy;
        insert(n, d, x, y, x1, y1, x2, y2);
      }
      var root = d3_geom_quadtreeNode();
      root.add = function(d) {
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
      };
      root.visit = function(f) {
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
      };
      i = -1;
      if (x1 == null) {
        while (++i < n) {
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
        }
        --i;
      } else data.forEach(root.add);
      xs = ys = data = d = null;
      return root;
    }
    quadtree.x = function(_) {
      return arguments.length ? (x = _, quadtree) : x;
    };
    quadtree.y = function(_) {
      return arguments.length ? (y = _, quadtree) : y;
    };
    quadtree.extent = function(_) {
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
      y2 = +_[1][1];
      return quadtree;
    };
    quadtree.size = function(_) {
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
      return quadtree;
    };
    return quadtree;
  };
  function d3_geom_quadtreeCompatX(d) {
    return d.x;
  }
  function d3_geom_quadtreeCompatY(d) {
    return d.y;
  }
  function d3_geom_quadtreeNode() {
    return {
      leaf: true,
      nodes: [],
      point: null,
      x: null,
      y: null
    };
  }
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
    if (!f(node, x1, y1, x2, y2)) {
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
    }
  }
  d3.interpolateRgb = d3_interpolateRgb;
  function d3_interpolateRgb(a, b) {
    a = d3.rgb(a);
    b = d3.rgb(b);
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
    return function(t) {
      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
    };
  }
  d3.interpolateObject = d3_interpolateObject;
  function d3_interpolateObject(a, b) {
    var i = {}, c = {}, k;
    for (k in a) {
      if (k in b) {
        i[k] = d3_interpolate(a[k], b[k]);
      } else {
        c[k] = a[k];
      }
    }
    for (k in b) {
      if (!(k in a)) {
        c[k] = b[k];
      }
    }
    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }
  d3.interpolateNumber = d3_interpolateNumber;
  function d3_interpolateNumber(a, b) {
    b -= a = +a;
    return function(t) {
      return a + b * t;
    };
  }
  d3.interpolateString = d3_interpolateString;
  function d3_interpolateString(a, b) {
    var m, i, j, s0 = 0, s1 = 0, s = [], q = [], n, o;
    a = a + "", b = b + "";
    d3_interpolate_number.lastIndex = 0;
    for (i = 0; m = d3_interpolate_number.exec(b); ++i) {
      if (m.index) s.push(b.substring(s0, s1 = m.index));
      q.push({
        i: s.length,
        x: m[0]
      });
      s.push(null);
      s0 = d3_interpolate_number.lastIndex;
    }
    if (s0 < b.length) s.push(b.substring(s0));
    for (i = 0, n = q.length; (m = d3_interpolate_number.exec(a)) && i < n; ++i) {
      o = q[i];
      if (o.x == m[0]) {
        if (o.i) {
          if (s[o.i + 1] == null) {
            s[o.i - 1] += o.x;
            s.splice(o.i, 1);
            for (j = i + 1; j < n; ++j) q[j].i--;
          } else {
            s[o.i - 1] += o.x + s[o.i + 1];
            s.splice(o.i, 2);
            for (j = i + 1; j < n; ++j) q[j].i -= 2;
          }
        } else {
          if (s[o.i + 1] == null) {
            s[o.i] = o.x;
          } else {
            s[o.i] = o.x + s[o.i + 1];
            s.splice(o.i + 1, 1);
            for (j = i + 1; j < n; ++j) q[j].i--;
          }
        }
        q.splice(i, 1);
        n--;
        i--;
      } else {
        o.x = d3_interpolateNumber(parseFloat(m[0]), parseFloat(o.x));
      }
    }
    while (i < n) {
      o = q.pop();
      if (s[o.i + 1] == null) {
        s[o.i] = o.x;
      } else {
        s[o.i] = o.x + s[o.i + 1];
        s.splice(o.i + 1, 1);
      }
      n--;
    }
    if (s.length === 1) {
      return s[0] == null ? (o = q[0].x, function(t) {
        return o(t) + "";
      }) : function() {
        return b;
      };
    }
    return function(t) {
      for (i = 0; i < n; ++i) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  }
  var d3_interpolate_number = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  d3.interpolate = d3_interpolate;
  function d3_interpolate(a, b) {
    var i = d3.interpolators.length, f;
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
    return f;
  }
  d3.interpolators = [ function(a, b) {
    var t = typeof b;
    return (t === "string" ? d3_rgb_names.has(b) || /^(#|rgb\(|hsl\()/.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_Color ? d3_interpolateRgb : t === "object" ? Array.isArray(b) ? d3_interpolateArray : d3_interpolateObject : d3_interpolateNumber)(a, b);
  } ];
  d3.interpolateArray = d3_interpolateArray;
  function d3_interpolateArray(a, b) {
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
    for (;i < na; ++i) c[i] = a[i];
    for (;i < nb; ++i) c[i] = b[i];
    return function(t) {
      for (i = 0; i < n0; ++i) c[i] = x[i](t);
      return c;
    };
  }
  var d3_ease_default = function() {
    return d3_identity;
  };
  var d3_ease = d3.map({
    linear: d3_ease_default,
    poly: d3_ease_poly,
    quad: function() {
      return d3_ease_quad;
    },
    cubic: function() {
      return d3_ease_cubic;
    },
    sin: function() {
      return d3_ease_sin;
    },
    exp: function() {
      return d3_ease_exp;
    },
    circle: function() {
      return d3_ease_circle;
    },
    elastic: d3_ease_elastic,
    back: d3_ease_back,
    bounce: function() {
      return d3_ease_bounce;
    }
  });
  var d3_ease_mode = d3.map({
    "in": d3_identity,
    out: d3_ease_reverse,
    "in-out": d3_ease_reflect,
    "out-in": function(f) {
      return d3_ease_reflect(d3_ease_reverse(f));
    }
  });
  d3.ease = function(name) {
    var i = name.indexOf("-"), t = i >= 0 ? name.substring(0, i) : name, m = i >= 0 ? name.substring(i + 1) : "in";
    t = d3_ease.get(t) || d3_ease_default;
    m = d3_ease_mode.get(m) || d3_identity;
    return d3_ease_clamp(m(t.apply(null, Array.prototype.slice.call(arguments, 1))));
  };
  function d3_ease_clamp(f) {
    return function(t) {
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
    };
  }
  function d3_ease_reverse(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
  function d3_ease_reflect(f) {
    return function(t) {
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
    };
  }
  function d3_ease_quad(t) {
    return t * t;
  }
  function d3_ease_cubic(t) {
    return t * t * t;
  }
  function d3_ease_cubicInOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var t2 = t * t, t3 = t2 * t;
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
  }
  function d3_ease_poly(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
  function d3_ease_sin(t) {
    return 1 - Math.cos(t * π / 2);
  }
  function d3_ease_exp(t) {
    return Math.pow(2, 10 * (t - 1));
  }
  function d3_ease_circle(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
  function d3_ease_elastic(a, p) {
    var s;
    if (arguments.length < 2) p = .45;
    if (arguments.length) s = p / (2 * π) * Math.asin(1 / a); else a = 1, s = p / 4;
    return function(t) {
      return 1 + a * Math.pow(2, 10 * -t) * Math.sin((t - s) * 2 * π / p);
    };
  }
  function d3_ease_back(s) {
    if (!s) s = 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
  function d3_ease_bounce(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
  }
  d3.interpolateHcl = d3_interpolateHcl;
  function d3_interpolateHcl(a, b) {
    a = d3.hcl(a);
    b = d3.hcl(b);
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
    };
  }
  d3.interpolateHsl = d3_interpolateHsl;
  function d3_interpolateHsl(a, b) {
    a = d3.hsl(a);
    b = d3.hsl(b);
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
    };
  }
  d3.interpolateLab = d3_interpolateLab;
  function d3_interpolateLab(a, b) {
    a = d3.lab(a);
    b = d3.lab(b);
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
    return function(t) {
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
    };
  }
  d3.interpolateRound = d3_interpolateRound;
  function d3_interpolateRound(a, b) {
    b -= a;
    return function(t) {
      return Math.round(a + b * t);
    };
  }
  d3.transform = function(string) {
    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
    return (d3.transform = function(string) {
      if (string != null) {
        g.setAttribute("transform", string);
        var t = g.transform.baseVal.consolidate();
      }
      return new d3_transform(t ? t.matrix : d3_transformIdentity);
    })(string);
  };
  function d3_transform(m) {
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
    if (r0[0] * r1[1] < r1[0] * r0[1]) {
      r0[0] *= -1;
      r0[1] *= -1;
      kx *= -1;
      kz *= -1;
    }
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
    this.translate = [ m.e, m.f ];
    this.scale = [ kx, ky ];
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
  }
  d3_transform.prototype.toString = function() {
    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
  };
  function d3_transformDot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function d3_transformNormalize(a) {
    var k = Math.sqrt(d3_transformDot(a, a));
    if (k) {
      a[0] /= k;
      a[1] /= k;
    }
    return k;
  }
  function d3_transformCombine(a, b, k) {
    a[0] += k * b[0];
    a[1] += k * b[1];
    return a;
  }
  var d3_transformIdentity = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };
  d3.interpolateTransform = d3_interpolateTransform;
  function d3_interpolateTransform(a, b) {
    var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;
    if (ta[0] != tb[0] || ta[1] != tb[1]) {
      s.push("translate(", null, ",", null, ")");
      q.push({
        i: 1,
        x: d3_interpolateNumber(ta[0], tb[0])
      }, {
        i: 3,
        x: d3_interpolateNumber(ta[1], tb[1])
      });
    } else if (tb[0] || tb[1]) {
      s.push("translate(" + tb + ")");
    } else {
      s.push("");
    }
    if (ra != rb) {
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
      q.push({
        i: s.push(s.pop() + "rotate(", null, ")") - 2,
        x: d3_interpolateNumber(ra, rb)
      });
    } else if (rb) {
      s.push(s.pop() + "rotate(" + rb + ")");
    }
    if (wa != wb) {
      q.push({
        i: s.push(s.pop() + "skewX(", null, ")") - 2,
        x: d3_interpolateNumber(wa, wb)
      });
    } else if (wb) {
      s.push(s.pop() + "skewX(" + wb + ")");
    }
    if (ka[0] != kb[0] || ka[1] != kb[1]) {
      n = s.push(s.pop() + "scale(", null, ",", null, ")");
      q.push({
        i: n - 4,
        x: d3_interpolateNumber(ka[0], kb[0])
      }, {
        i: n - 2,
        x: d3_interpolateNumber(ka[1], kb[1])
      });
    } else if (kb[0] != 1 || kb[1] != 1) {
      s.push(s.pop() + "scale(" + kb + ")");
    }
    n = q.length;
    return function(t) {
      var i = -1, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  }
  function d3_uninterpolateNumber(a, b) {
    b = b - (a = +a) ? 1 / (b - a) : 0;
    return function(x) {
      return (x - a) * b;
    };
  }
  function d3_uninterpolateClamp(a, b) {
    b = b - (a = +a) ? 1 / (b - a) : 0;
    return function(x) {
      return Math.max(0, Math.min(1, (x - a) * b));
    };
  }
  d3.layout = {};
  d3.layout.bundle = function() {
    return function(links) {
      var paths = [], i = -1, n = links.length;
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
      return paths;
    };
  };
  function d3_layout_bundlePath(link) {
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
    while (start !== lca) {
      start = start.parent;
      points.push(start);
    }
    var k = points.length;
    while (end !== lca) {
      points.splice(k, 0, end);
      end = end.parent;
    }
    return points;
  }
  function d3_layout_bundleAncestors(node) {
    var ancestors = [], parent = node.parent;
    while (parent != null) {
      ancestors.push(node);
      node = parent;
      parent = parent.parent;
    }
    ancestors.push(node);
    return ancestors;
  }
  function d3_layout_bundleLeastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
    while (aNode === bNode) {
      sharedNode = aNode;
      aNode = aNodes.pop();
      bNode = bNodes.pop();
    }
    return sharedNode;
  }
  d3.layout.chord = function() {
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
    function relayout() {
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
      chords = [];
      groups = [];
      k = 0, i = -1;
      while (++i < n) {
        x = 0, j = -1;
        while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(d3.range(n));
        k += x;
      }
      if (sortGroups) {
        groupIndex.sort(function(a, b) {
          return sortGroups(groupSums[a], groupSums[b]);
        });
      }
      if (sortSubgroups) {
        subgroupIndex.forEach(function(d, i) {
          d.sort(function(a, b) {
            return sortSubgroups(matrix[i][a], matrix[i][b]);
          });
        });
      }
      k = (2 * π - padding * n) / k;
      x = 0, i = -1;
      while (++i < n) {
        x0 = x, j = -1;
        while (++j < n) {
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
          subgroups[di + "-" + dj] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: (x - x0) / k
        };
        x += padding;
      }
      i = -1;
      while (++i < n) {
        j = i - 1;
        while (++j < n) {
          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? {
              source: target,
              target: source
            } : {
              source: source,
              target: target
            });
          }
        }
      }
      if (sortChords) resort();
    }
    function resort() {
      chords.sort(function(a, b) {
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
      });
    }
    chord.matrix = function(x) {
      if (!arguments.length) return matrix;
      n = (matrix = x) && matrix.length;
      chords = groups = null;
      return chord;
    };
    chord.padding = function(x) {
      if (!arguments.length) return padding;
      padding = x;
      chords = groups = null;
      return chord;
    };
    chord.sortGroups = function(x) {
      if (!arguments.length) return sortGroups;
      sortGroups = x;
      chords = groups = null;
      return chord;
    };
    chord.sortSubgroups = function(x) {
      if (!arguments.length) return sortSubgroups;
      sortSubgroups = x;
      chords = null;
      return chord;
    };
    chord.sortChords = function(x) {
      if (!arguments.length) return sortChords;
      sortChords = x;
      if (chords) resort();
      return chord;
    };
    chord.chords = function() {
      if (!chords) relayout();
      return chords;
    };
    chord.groups = function() {
      if (!groups) relayout();
      return groups;
    };
    return chord;
  };
  d3.layout.force = function() {
    var force = {}, event = d3.dispatch("start", "tick", "end"), size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, gravity = .1, theta = .8, nodes = [], links = [], distances, strengths, charges;
    function repulse(node) {
      return function(quad, x1, _, x2) {
        if (quad.point !== node) {
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dn = 1 / Math.sqrt(dx * dx + dy * dy);
          if ((x2 - x1) * dn < theta) {
            var k = quad.charge * dn * dn;
            node.px -= dx * k;
            node.py -= dy * k;
            return true;
          }
          if (quad.point && isFinite(dn)) {
            var k = quad.pointCharge * dn * dn;
            node.px -= dx * k;
            node.py -= dy * k;
          }
        }
        return !quad.charge;
      };
    }
    force.tick = function() {
      if ((alpha *= .99) < .005) {
        event.end({
          type: "end",
          alpha: alpha = 0
        });
        return true;
      }
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
      for (i = 0; i < m; ++i) {
        o = links[i];
        s = o.source;
        t = o.target;
        x = t.x - s.x;
        y = t.y - s.y;
        if (l = x * x + y * y) {
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
          x *= l;
          y *= l;
          t.x -= x * (k = s.weight / (t.weight + s.weight));
          t.y -= y * k;
          s.x += x * (k = 1 - k);
          s.y += y * k;
        }
      }
      if (k = alpha * gravity) {
        x = size[0] / 2;
        y = size[1] / 2;
        i = -1;
        if (k) while (++i < n) {
          o = nodes[i];
          o.x += (x - o.x) * k;
          o.y += (y - o.y) * k;
        }
      }
      if (charge) {
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
        i = -1;
        while (++i < n) {
          if (!(o = nodes[i]).fixed) {
            q.visit(repulse(o));
          }
        }
      }
      i = -1;
      while (++i < n) {
        o = nodes[i];
        if (o.fixed) {
          o.x = o.px;
          o.y = o.py;
        } else {
          o.x -= (o.px - (o.px = o.x)) * friction;
          o.y -= (o.py - (o.py = o.y)) * friction;
        }
      }
      event.tick({
        type: "tick",
        alpha: alpha
      });
    };
    force.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return force;
    };
    force.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return force;
    };
    force.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return force;
    };
    force.linkDistance = function(x) {
      if (!arguments.length) return linkDistance;
      linkDistance = typeof x === "function" ? x : +x;
      return force;
    };
    force.distance = force.linkDistance;
    force.linkStrength = function(x) {
      if (!arguments.length) return linkStrength;
      linkStrength = typeof x === "function" ? x : +x;
      return force;
    };
    force.friction = function(x) {
      if (!arguments.length) return friction;
      friction = +x;
      return force;
    };
    force.charge = function(x) {
      if (!arguments.length) return charge;
      charge = typeof x === "function" ? x : +x;
      return force;
    };
    force.gravity = function(x) {
      if (!arguments.length) return gravity;
      gravity = +x;
      return force;
    };
    force.theta = function(x) {
      if (!arguments.length) return theta;
      theta = +x;
      return force;
    };
    force.alpha = function(x) {
      if (!arguments.length) return alpha;
      x = +x;
      if (alpha) {
        if (x > 0) alpha = x; else alpha = 0;
      } else if (x > 0) {
        event.start({
          type: "start",
          alpha: alpha = x
        });
        d3.timer(force.tick);
      }
      return force;
    };
    force.start = function() {
      var i, j, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
        o.weight = 0;
      }
      for (i = 0; i < m; ++i) {
        o = links[i];
        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        ++o.source.weight;
        ++o.target.weight;
      }
      for (i = 0; i < n; ++i) {
        o = nodes[i];
        if (isNaN(o.x)) o.x = position("x", w);
        if (isNaN(o.y)) o.y = position("y", h);
        if (isNaN(o.px)) o.px = o.x;
        if (isNaN(o.py)) o.py = o.y;
      }
      distances = [];
      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
      strengths = [];
      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
      charges = [];
      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
      function position(dimension, size) {
        var neighbors = neighbor(i), j = -1, m = neighbors.length, x;
        while (++j < m) if (!isNaN(x = neighbors[j][dimension])) return x;
        return Math.random() * size;
      }
      function neighbor() {
        if (!neighbors) {
          neighbors = [];
          for (j = 0; j < n; ++j) {
            neighbors[j] = [];
          }
          for (j = 0; j < m; ++j) {
            var o = links[j];
            neighbors[o.source.index].push(o.target);
            neighbors[o.target.index].push(o.source);
          }
        }
        return neighbors[i];
      }
      return force.resume();
    };
    force.resume = function() {
      return force.alpha(.1);
    };
    force.stop = function() {
      return force.alpha(0);
    };
    force.drag = function() {
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
      if (!arguments.length) return drag;
      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
    };
    function dragmove(d) {
      d.px = d3.event.x, d.py = d3.event.y;
      force.resume();
    }
    return d3.rebind(force, event, "on");
  };
  function d3_layout_forceDragstart(d) {
    d.fixed |= 2;
  }
  function d3_layout_forceDragend(d) {
    d.fixed &= ~6;
  }
  function d3_layout_forceMouseover(d) {
    d.fixed |= 4;
    d.px = d.x, d.py = d.y;
  }
  function d3_layout_forceMouseout(d) {
    d.fixed &= ~4;
  }
  function d3_layout_forceAccumulate(quad, alpha, charges) {
    var cx = 0, cy = 0;
    quad.charge = 0;
    if (!quad.leaf) {
      var nodes = quad.nodes, n = nodes.length, i = -1, c;
      while (++i < n) {
        c = nodes[i];
        if (c == null) continue;
        d3_layout_forceAccumulate(c, alpha, charges);
        quad.charge += c.charge;
        cx += c.charge * c.cx;
        cy += c.charge * c.cy;
      }
    }
    if (quad.point) {
      if (!quad.leaf) {
        quad.point.x += Math.random() - .5;
        quad.point.y += Math.random() - .5;
      }
      var k = alpha * charges[quad.point.index];
      quad.charge += quad.pointCharge = k;
      cx += k * quad.point.x;
      cy += k * quad.point.y;
    }
    quad.cx = cx / quad.charge;
    quad.cy = cy / quad.charge;
  }
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1;
  d3.layout.hierarchy = function() {
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
    function recurse(node, depth, nodes) {
      var childs = children.call(hierarchy, node, depth);
      node.depth = depth;
      nodes.push(node);
      if (childs && (n = childs.length)) {
        var i = -1, n, c = node.children = [], v = 0, j = depth + 1, d;
        while (++i < n) {
          d = recurse(childs[i], j, nodes);
          d.parent = node;
          c.push(d);
          v += d.value;
        }
        if (sort) c.sort(sort);
        if (value) node.value = v;
      } else if (value) {
        node.value = +value.call(hierarchy, node, depth) || 0;
      }
      return node;
    }
    function revalue(node, depth) {
      var children = node.children, v = 0;
      if (children && (n = children.length)) {
        var i = -1, n, j = depth + 1;
        while (++i < n) v += revalue(children[i], j);
      } else if (value) {
        v = +value.call(hierarchy, node, depth) || 0;
      }
      if (value) node.value = v;
      return v;
    }
    function hierarchy(d) {
      var nodes = [];
      recurse(d, 0, nodes);
      return nodes;
    }
    hierarchy.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return hierarchy;
    };
    hierarchy.children = function(x) {
      if (!arguments.length) return children;
      children = x;
      return hierarchy;
    };
    hierarchy.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return hierarchy;
    };
    hierarchy.revalue = function(root) {
      revalue(root, 0);
      return root;
    };
    return hierarchy;
  };
  function d3_layout_hierarchyRebind(object, hierarchy) {
    d3.rebind(object, hierarchy, "sort", "children", "value");
    object.nodes = object;
    object.links = d3_layout_hierarchyLinks;
    return object;
  }
  function d3_layout_hierarchyChildren(d) {
    return d.children;
  }
  function d3_layout_hierarchyValue(d) {
    return d.value;
  }
  function d3_layout_hierarchySort(a, b) {
    return b.value - a.value;
  }
  function d3_layout_hierarchyLinks(nodes) {
    return d3.merge(nodes.map(function(parent) {
      return (parent.children || []).map(function(child) {
        return {
          source: parent,
          target: child
        };
      });
    }));
  }
  d3.layout.partition = function() {
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];
    function position(node, x, dx, dy) {
      var children = node.children;
      node.x = x;
      node.y = node.depth * dy;
      node.dx = dx;
      node.dy = dy;
      if (children && (n = children.length)) {
        var i = -1, n, c, d;
        dx = node.value ? dx / node.value : 0;
        while (++i < n) {
          position(c = children[i], x, d = c.value * dx, dy);
          x += d;
        }
      }
    }
    function depth(node) {
      var children = node.children, d = 0;
      if (children && (n = children.length)) {
        var i = -1, n;
        while (++i < n) d = Math.max(d, depth(children[i]));
      }
      return 1 + d;
    }
    function partition(d, i) {
      var nodes = hierarchy.call(this, d, i);
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
      return nodes;
    }
    partition.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return partition;
    };
    return d3_layout_hierarchyRebind(partition, hierarchy);
  };
  d3.layout.pie = function() {
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = 2 * π;
    function pie(data) {
      var values = data.map(function(d, i) {
        return +value.call(pie, d, i);
      });
      var a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle);
      var k = ((typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a) / d3.sum(values);
      var index = d3.range(data.length);
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {
        return values[j] - values[i];
      } : function(i, j) {
        return sort(data[i], data[j]);
      });
      var arcs = [];
      index.forEach(function(i) {
        var d;
        arcs[i] = {
          data: data[i],
          value: d = values[i],
          startAngle: a,
          endAngle: a += d * k
        };
      });
      return arcs;
    }
    pie.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return pie;
    };
    pie.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return pie;
    };
    pie.startAngle = function(x) {
      if (!arguments.length) return startAngle;
      startAngle = x;
      return pie;
    };
    pie.endAngle = function(x) {
      if (!arguments.length) return endAngle;
      endAngle = x;
      return pie;
    };
    return pie;
  };
  var d3_layout_pieSortByValue = {};
  d3.layout.stack = function() {
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
    function stack(data, index) {
      var series = data.map(function(d, i) {
        return values.call(stack, d, i);
      });
      var points = series.map(function(d) {
        return d.map(function(v, i) {
          return [ x.call(stack, v, i), y.call(stack, v, i) ];
        });
      });
      var orders = order.call(stack, points, index);
      series = d3.permute(series, orders);
      points = d3.permute(points, orders);
      var offsets = offset.call(stack, points, index);
      var n = series.length, m = series[0].length, i, j, o;
      for (j = 0; j < m; ++j) {
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
        for (i = 1; i < n; ++i) {
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
        }
      }
      return data;
    }
    stack.values = function(x) {
      if (!arguments.length) return values;
      values = x;
      return stack;
    };
    stack.order = function(x) {
      if (!arguments.length) return order;
      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
      return stack;
    };
    stack.offset = function(x) {
      if (!arguments.length) return offset;
      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
      return stack;
    };
    stack.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return stack;
    };
    stack.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return stack;
    };
    stack.out = function(z) {
      if (!arguments.length) return out;
      out = z;
      return stack;
    };
    return stack;
  };
  function d3_layout_stackX(d) {
    return d.x;
  }
  function d3_layout_stackY(d) {
    return d.y;
  }
  function d3_layout_stackOut(d, y0, y) {
    d.y0 = y0;
    d.y = y;
  }
  var d3_layout_stackOrders = d3.map({
    "inside-out": function(data) {
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {
        return max[a] - max[b];
      }), top = 0, bottom = 0, tops = [], bottoms = [];
      for (i = 0; i < n; ++i) {
        j = index[i];
        if (top < bottom) {
          top += sums[j];
          tops.push(j);
        } else {
          bottom += sums[j];
          bottoms.push(j);
        }
      }
      return bottoms.reverse().concat(tops);
    },
    reverse: function(data) {
      return d3.range(data.length).reverse();
    },
    "default": d3_layout_stackOrderDefault
  });
  var d3_layout_stackOffsets = d3.map({
    silhouette: function(data) {
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o > max) max = o;
        sums.push(o);
      }
      for (j = 0; j < m; ++j) {
        y0[j] = (max - sums[j]) / 2;
      }
      return y0;
    },
    wiggle: function(data) {
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
      y0[0] = o = o0 = 0;
      for (j = 1; j < m; ++j) {
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
          }
          s2 += s3 * data[i][j][1];
        }
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
        if (o < o0) o0 = o;
      }
      for (j = 0; j < m; ++j) y0[j] -= o0;
      return y0;
    },
    expand: function(data) {
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
      }
      for (j = 0; j < m; ++j) y0[j] = 0;
      return y0;
    },
    zero: d3_layout_stackOffsetZero
  });
  function d3_layout_stackOrderDefault(data) {
    return d3.range(data.length);
  }
  function d3_layout_stackOffsetZero(data) {
    var j = -1, m = data[0].length, y0 = [];
    while (++j < m) y0[j] = 0;
    return y0;
  }
  function d3_layout_stackMaxIndex(array) {
    var i = 1, j = 0, v = array[0][1], k, n = array.length;
    for (;i < n; ++i) {
      if ((k = array[i][1]) > v) {
        j = i;
        v = k;
      }
    }
    return j;
  }
  function d3_layout_stackReduceSum(d) {
    return d.reduce(d3_layout_stackSum, 0);
  }
  function d3_layout_stackSum(p, d) {
    return p + d[1];
  }
  d3.layout.histogram = function() {
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
    function histogram(data, i) {
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;
      while (++i < m) {
        bin = bins[i] = [];
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
        bin.y = 0;
      }
      if (m > 0) {
        i = -1;
        while (++i < n) {
          x = values[i];
          if (x >= range[0] && x <= range[1]) {
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
            bin.y += k;
            bin.push(data[i]);
          }
        }
      }
      return bins;
    }
    histogram.value = function(x) {
      if (!arguments.length) return valuer;
      valuer = x;
      return histogram;
    };
    histogram.range = function(x) {
      if (!arguments.length) return ranger;
      ranger = d3_functor(x);
      return histogram;
    };
    histogram.bins = function(x) {
      if (!arguments.length) return binner;
      binner = typeof x === "number" ? function(range) {
        return d3_layout_histogramBinFixed(range, x);
      } : d3_functor(x);
      return histogram;
    };
    histogram.frequency = function(x) {
      if (!arguments.length) return frequency;
      frequency = !!x;
      return histogram;
    };
    return histogram;
  };
  function d3_layout_histogramBinSturges(range, values) {
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
  }
  function d3_layout_histogramBinFixed(range, n) {
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];
    while (++x <= n) f[x] = m * x + b;
    return f;
  }
  function d3_layout_histogramRange(values) {
    return [ d3.min(values), d3.max(values) ];
  }
  d3.layout.tree = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
    function tree(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0];
      function firstWalk(node, previousSibling) {
        var children = node.children, layout = node._tree;
        if (children && (n = children.length)) {
          var n, firstChild = children[0], previousChild, ancestor = firstChild, child, i = -1;
          while (++i < n) {
            child = children[i];
            firstWalk(child, previousChild);
            ancestor = apportion(child, previousChild, ancestor);
            previousChild = child;
          }
          d3_layout_treeShift(node);
          var midpoint = .5 * (firstChild._tree.prelim + child._tree.prelim);
          if (previousSibling) {
            layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);
            layout.mod = layout.prelim - midpoint;
          } else {
            layout.prelim = midpoint;
          }
        } else {
          if (previousSibling) {
            layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);
          }
        }
      }
      function secondWalk(node, x) {
        node.x = node._tree.prelim + x;
        var children = node.children;
        if (children && (n = children.length)) {
          var i = -1, n;
          x += node._tree.mod;
          while (++i < n) {
            secondWalk(children[i], x);
          }
        }
      }
      function apportion(node, previousSibling, ancestor) {
        if (previousSibling) {
          var vip = node, vop = node, vim = previousSibling, vom = node.parent.children[0], sip = vip._tree.mod, sop = vop._tree.mod, sim = vim._tree.mod, som = vom._tree.mod, shift;
          while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
            vom = d3_layout_treeLeft(vom);
            vop = d3_layout_treeRight(vop);
            vop._tree.ancestor = node;
            shift = vim._tree.prelim + sim - vip._tree.prelim - sip + separation(vim, vip);
            if (shift > 0) {
              d3_layout_treeMove(d3_layout_treeAncestor(vim, node, ancestor), node, shift);
              sip += shift;
              sop += shift;
            }
            sim += vim._tree.mod;
            sip += vip._tree.mod;
            som += vom._tree.mod;
            sop += vop._tree.mod;
          }
          if (vim && !d3_layout_treeRight(vop)) {
            vop._tree.thread = vim;
            vop._tree.mod += sim - sop;
          }
          if (vip && !d3_layout_treeLeft(vom)) {
            vom._tree.thread = vip;
            vom._tree.mod += sip - som;
            ancestor = node;
          }
        }
        return ancestor;
      }
      d3_layout_treeVisitAfter(root, function(node, previousSibling) {
        node._tree = {
          ancestor: node,
          prelim: 0,
          mod: 0,
          change: 0,
          shift: 0,
          number: previousSibling ? previousSibling._tree.number + 1 : 0
        };
      });
      firstWalk(root);
      secondWalk(root, -root._tree.prelim);
      var left = d3_layout_treeSearch(root, d3_layout_treeLeftmost), right = d3_layout_treeSearch(root, d3_layout_treeRightmost), deep = d3_layout_treeSearch(root, d3_layout_treeDeepest), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2, y1 = deep.depth || 1;
      d3_layout_treeVisitAfter(root, nodeSize ? function(node) {
        node.x *= size[0];
        node.y = node.depth * size[1];
        delete node._tree;
      } : function(node) {
        node.x = (node.x - x0) / (x1 - x0) * size[0];
        node.y = node.depth / y1 * size[1];
        delete node._tree;
      });
      return nodes;
    }
    tree.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return tree;
    };
    tree.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null;
      return tree;
    };
    tree.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) != null;
      return tree;
    };
    return d3_layout_hierarchyRebind(tree, hierarchy);
  };
  function d3_layout_treeSeparation(a, b) {
    return a.parent == b.parent ? 1 : 2;
  }
  function d3_layout_treeLeft(node) {
    var children = node.children;
    return children && children.length ? children[0] : node._tree.thread;
  }
  function d3_layout_treeRight(node) {
    var children = node.children, n;
    return children && (n = children.length) ? children[n - 1] : node._tree.thread;
  }
  function d3_layout_treeSearch(node, compare) {
    var children = node.children;
    if (children && (n = children.length)) {
      var child, n, i = -1;
      while (++i < n) {
        if (compare(child = d3_layout_treeSearch(children[i], compare), node) > 0) {
          node = child;
        }
      }
    }
    return node;
  }
  function d3_layout_treeRightmost(a, b) {
    return a.x - b.x;
  }
  function d3_layout_treeLeftmost(a, b) {
    return b.x - a.x;
  }
  function d3_layout_treeDeepest(a, b) {
    return a.depth - b.depth;
  }
  function d3_layout_treeVisitAfter(node, callback) {
    function visit(node, previousSibling) {
      var children = node.children;
      if (children && (n = children.length)) {
        var child, previousChild = null, i = -1, n;
        while (++i < n) {
          child = children[i];
          visit(child, previousChild);
          previousChild = child;
        }
      }
      callback(node, previousSibling);
    }
    visit(node, null);
  }
  function d3_layout_treeShift(node) {
    var shift = 0, change = 0, children = node.children, i = children.length, child;
    while (--i >= 0) {
      child = children[i]._tree;
      child.prelim += shift;
      child.mod += shift;
      shift += child.shift + (change += child.change);
    }
  }
  function d3_layout_treeMove(ancestor, node, shift) {
    ancestor = ancestor._tree;
    node = node._tree;
    var change = shift / (node.number - ancestor.number);
    ancestor.change += change;
    node.change -= change;
    node.shift += shift;
    node.prelim += shift;
    node.mod += shift;
  }
  function d3_layout_treeAncestor(vim, node, ancestor) {
    return vim._tree.ancestor.parent == node.parent ? vim._tree.ancestor : ancestor;
  }
  d3.layout.pack = function() {
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
    function pack(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
        return radius;
      };
      root.x = root.y = 0;
      d3_layout_treeVisitAfter(root, function(d) {
        d.r = +r(d.value);
      });
      d3_layout_treeVisitAfter(root, d3_layout_packSiblings);
      if (padding) {
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
        d3_layout_treeVisitAfter(root, function(d) {
          d.r += dr;
        });
        d3_layout_treeVisitAfter(root, d3_layout_packSiblings);
        d3_layout_treeVisitAfter(root, function(d) {
          d.r -= dr;
        });
      }
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
      return nodes;
    }
    pack.size = function(_) {
      if (!arguments.length) return size;
      size = _;
      return pack;
    };
    pack.radius = function(_) {
      if (!arguments.length) return radius;
      radius = _ == null || typeof _ === "function" ? _ : +_;
      return pack;
    };
    pack.padding = function(_) {
      if (!arguments.length) return padding;
      padding = +_;
      return pack;
    };
    return d3_layout_hierarchyRebind(pack, hierarchy);
  };
  function d3_layout_packSort(a, b) {
    return a.value - b.value;
  }
  function d3_layout_packInsert(a, b) {
    var c = a._pack_next;
    a._pack_next = b;
    b._pack_prev = a;
    b._pack_next = c;
    c._pack_prev = b;
  }
  function d3_layout_packSplice(a, b) {
    a._pack_next = b;
    b._pack_prev = a;
  }
  function d3_layout_packIntersects(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
    return .999 * dr * dr > dx * dx + dy * dy;
  }
  function d3_layout_packSiblings(node) {
    if (!(nodes = node.children) || !(n = nodes.length)) return;
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;
    function bound(node) {
      xMin = Math.min(node.x - node.r, xMin);
      xMax = Math.max(node.x + node.r, xMax);
      yMin = Math.min(node.y - node.r, yMin);
      yMax = Math.max(node.y + node.r, yMax);
    }
    nodes.forEach(d3_layout_packLink);
    a = nodes[0];
    a.x = -a.r;
    a.y = 0;
    bound(a);
    if (n > 1) {
      b = nodes[1];
      b.x = b.r;
      b.y = 0;
      bound(b);
      if (n > 2) {
        c = nodes[2];
        d3_layout_packPlace(a, b, c);
        bound(c);
        d3_layout_packInsert(a, c);
        a._pack_prev = c;
        d3_layout_packInsert(c, b);
        b = a._pack_next;
        for (i = 3; i < n; i++) {
          d3_layout_packPlace(a, b, c = nodes[i]);
          var isect = 0, s1 = 1, s2 = 1;
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
            if (d3_layout_packIntersects(j, c)) {
              isect = 1;
              break;
            }
          }
          if (isect == 1) {
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
              if (d3_layout_packIntersects(k, c)) {
                break;
              }
            }
          }
          if (isect) {
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);
            i--;
          } else {
            d3_layout_packInsert(a, c);
            b = c;
            bound(c);
          }
        }
      }
    }
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
    for (i = 0; i < n; i++) {
      c = nodes[i];
      c.x -= cx;
      c.y -= cy;
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
    }
    node.r = cr;
    nodes.forEach(d3_layout_packUnlink);
  }
  function d3_layout_packLink(node) {
    node._pack_next = node._pack_prev = node;
  }
  function d3_layout_packUnlink(node) {
    delete node._pack_next;
    delete node._pack_prev;
  }
  function d3_layout_packTransform(node, x, y, k) {
    var children = node.children;
    node.x = x += k * node.x;
    node.y = y += k * node.y;
    node.r *= k;
    if (children) {
      var i = -1, n = children.length;
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
    }
  }
  function d3_layout_packPlace(a, b, c) {
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
    if (db && (dx || dy)) {
      var da = b.r + c.r, dc = dx * dx + dy * dy;
      da *= da;
      db *= db;
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
      c.x = a.x + x * dx + y * dy;
      c.y = a.y + x * dy - y * dx;
    } else {
      c.x = a.x + db;
      c.y = a.y;
    }
  }
  d3.layout.cluster = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
    function cluster(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;
      d3_layout_treeVisitAfter(root, function(node) {
        var children = node.children;
        if (children && children.length) {
          node.x = d3_layout_clusterX(children);
          node.y = d3_layout_clusterY(children);
        } else {
          node.x = previousNode ? x += separation(node, previousNode) : 0;
          node.y = 0;
          previousNode = node;
        }
      });
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
      d3_layout_treeVisitAfter(root, nodeSize ? function(node) {
        node.x = (node.x - root.x) * size[0];
        node.y = (root.y - node.y) * size[1];
      } : function(node) {
        node.x = (node.x - x0) / (x1 - x0) * size[0];
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
      });
      return nodes;
    }
    cluster.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return cluster;
    };
    cluster.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null;
      return cluster;
    };
    cluster.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) != null;
      return cluster;
    };
    return d3_layout_hierarchyRebind(cluster, hierarchy);
  };
  function d3_layout_clusterY(children) {
    return 1 + d3.max(children, function(child) {
      return child.y;
    });
  }
  function d3_layout_clusterX(children) {
    return children.reduce(function(x, child) {
      return x + child.x;
    }, 0) / children.length;
  }
  function d3_layout_clusterLeft(node) {
    var children = node.children;
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
  }
  function d3_layout_clusterRight(node) {
    var children = node.children, n;
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
  }
  d3.layout.treemap = function() {
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
    function scale(children, k) {
      var i = -1, n = children.length, child, area;
      while (++i < n) {
        area = (child = children[i]).value * (k < 0 ? 0 : k);
        child.area = isNaN(area) || area <= 0 ? 0 : area;
      }
    }
    function squarify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while ((n = remaining.length) > 0) {
          row.push(child = remaining[n - 1]);
          row.area += child.area;
          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
            remaining.pop();
            best = score;
          } else {
            row.area -= row.pop().area;
            position(row, u, rect, false);
            u = Math.min(rect.dx, rect.dy);
            row.length = row.area = 0;
            best = Infinity;
          }
        }
        if (row.length) {
          position(row, u, rect, true);
          row.length = row.area = 0;
        }
        children.forEach(squarify);
      }
    }
    function stickify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), remaining = children.slice(), child, row = [];
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while (child = remaining.pop()) {
          row.push(child);
          row.area += child.area;
          if (child.z != null) {
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
            row.length = row.area = 0;
          }
        }
        children.forEach(stickify);
      }
    }
    function worst(row, u) {
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
      while (++i < n) {
        if (!(r = row[i].area)) continue;
        if (r < rmin) rmin = r;
        if (r > rmax) rmax = r;
      }
      s *= s;
      u *= u;
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
    }
    function position(row, u, rect, flush) {
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
      if (u == rect.dx) {
        if (flush || v > rect.dy) v = rect.dy;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dy = v;
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
        }
        o.z = true;
        o.dx += rect.x + rect.dx - x;
        rect.y += v;
        rect.dy -= v;
      } else {
        if (flush || v > rect.dx) v = rect.dx;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dx = v;
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
        }
        o.z = false;
        o.dy += rect.y + rect.dy - y;
        rect.x += v;
        rect.dx -= v;
      }
    }
    function treemap(d) {
      var nodes = stickies || hierarchy(d), root = nodes[0];
      root.x = 0;
      root.y = 0;
      root.dx = size[0];
      root.dy = size[1];
      if (stickies) hierarchy.revalue(root);
      scale([ root ], root.dx * root.dy / root.value);
      (stickies ? stickify : squarify)(root);
      if (sticky) stickies = nodes;
      return nodes;
    }
    treemap.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return treemap;
    };
    treemap.padding = function(x) {
      if (!arguments.length) return padding;
      function padFunction(node) {
        var p = x.call(treemap, node, node.depth);
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [ p, p, p, p ] : p);
      }
      function padConstant(node) {
        return d3_layout_treemapPad(node, x);
      }
      var type;
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [ x, x, x, x ], 
      padConstant) : padConstant;
      return treemap;
    };
    treemap.round = function(x) {
      if (!arguments.length) return round != Number;
      round = x ? Math.round : Number;
      return treemap;
    };
    treemap.sticky = function(x) {
      if (!arguments.length) return sticky;
      sticky = x;
      stickies = null;
      return treemap;
    };
    treemap.ratio = function(x) {
      if (!arguments.length) return ratio;
      ratio = x;
      return treemap;
    };
    treemap.mode = function(x) {
      if (!arguments.length) return mode;
      mode = x + "";
      return treemap;
    };
    return d3_layout_hierarchyRebind(treemap, hierarchy);
  };
  function d3_layout_treemapPadNull(node) {
    return {
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    };
  }
  function d3_layout_treemapPad(node, padding) {
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
    if (dx < 0) {
      x += dx / 2;
      dx = 0;
    }
    if (dy < 0) {
      y += dy / 2;
      dy = 0;
    }
    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy
    };
  }
  d3.random = {
    normal: function(µ, σ) {
      var n = arguments.length;
      if (n < 2) σ = 1;
      if (n < 1) µ = 0;
      return function() {
        var x, y, r;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          r = x * x + y * y;
        } while (!r || r > 1);
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
      };
    },
    logNormal: function() {
      var random = d3.random.normal.apply(d3, arguments);
      return function() {
        return Math.exp(random());
      };
    },
    irwinHall: function(m) {
      return function() {
        for (var s = 0, j = 0; j < m; j++) s += Math.random();
        return s / m;
      };
    }
  };
  d3.scale = {};
  function d3_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
  }
  function d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
  }
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
    return function(x) {
      return i(u(x));
    };
  }
  function d3_scale_nice(domain, nice) {
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
    if (x1 < x0) {
      dx = i0, i0 = i1, i1 = dx;
      dx = x0, x0 = x1, x1 = dx;
    }
    domain[i0] = nice.floor(x0);
    domain[i1] = nice.ceil(x1);
    return domain;
  }
  function d3_scale_niceStep(step) {
    return step ? {
      floor: function(x) {
        return Math.floor(x / step) * step;
      },
      ceil: function(x) {
        return Math.ceil(x / step) * step;
      }
    } : d3_scale_niceIdentity;
  }
  var d3_scale_niceIdentity = {
    floor: d3_identity,
    ceil: d3_identity
  };
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
    if (domain[k] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }
    while (++j <= k) {
      u.push(uninterpolate(domain[j - 1], domain[j]));
      i.push(interpolate(range[j - 1], range[j]));
    }
    return function(x) {
      var j = d3.bisect(domain, x, 1, k) - 1;
      return i[j](u[j](x));
    };
  }
  d3.scale.linear = function() {
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
  };
  function d3_scale_linear(domain, range, interpolate, clamp) {
    var output, input;
    function rescale() {
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
      output = linear(domain, range, uninterpolate, interpolate);
      input = linear(range, domain, uninterpolate, d3_interpolate);
      return scale;
    }
    function scale(x) {
      return output(x);
    }
    scale.invert = function(y) {
      return input(y);
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(Number);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.rangeRound = function(x) {
      return scale.range(x).interpolate(d3_interpolateRound);
    };
    scale.clamp = function(x) {
      if (!arguments.length) return clamp;
      clamp = x;
      return rescale();
    };
    scale.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x;
      return rescale();
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      d3_scale_linearNice(domain, m);
      return rescale();
    };
    scale.copy = function() {
      return d3_scale_linear(domain, range, interpolate, clamp);
    };
    return rescale();
  }
  function d3_scale_linearRebind(scale, linear) {
    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
  }
  function d3_scale_linearNice(domain, m) {
    return d3_scale_nice(domain, d3_scale_niceStep(m ? d3_scale_linearTickRange(domain, m)[2] : d3_scale_linearNiceStep(domain)));
  }
  function d3_scale_linearNiceStep(domain) {
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0];
    return Math.pow(10, Math.round(Math.log(span) / Math.LN10) - 1);
  }
  function d3_scale_linearTickRange(domain, m) {
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
    extent[0] = Math.ceil(extent[0] / step) * step;
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
    extent[2] = step;
    return extent;
  }
  function d3_scale_linearTicks(domain, m) {
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
  }
  function d3_scale_linearTickFormat(domain, m, format) {
    var precision = -Math.floor(Math.log(d3_scale_linearTickRange(domain, m)[2]) / Math.LN10 + .01);
    return d3.format(format ? format.replace(d3_format_re, function(a, b, c, d, e, f, g, h, i, j) {
      return [ b, c, d, e, f, g, h, i || "." + (precision - (j === "%") * 2), j ].join("");
    }) : ",." + precision + "f");
  }
  d3.scale.log = function() {
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);
  };
  function d3_scale_log(linear, base, positive, domain) {
    function log(x) {
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
    }
    function pow(x) {
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
    }
    function scale(x) {
      return linear(log(x));
    }
    scale.invert = function(x) {
      return pow(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      positive = x[0] >= 0;
      linear.domain((domain = x.map(Number)).map(log));
      return scale;
    };
    scale.base = function(_) {
      if (!arguments.length) return base;
      base = +_;
      linear.domain(domain.map(log));
      return scale;
    };
    scale.nice = function() {
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
      linear.domain(niced);
      domain = niced.map(pow);
      return scale;
    };
    scale.ticks = function() {
      var extent = d3_scaleExtent(domain), ticks = [];
      if (extent.every(isFinite)) {
        var u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
        if (positive) {
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
          ticks.push(pow(i));
        } else {
          ticks.push(pow(i));
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
        }
        for (i = 0; ticks[i] < u; i++) {}
        for (j = ticks.length; ticks[j - 1] > v; j--) {}
        ticks = ticks.slice(i, j);
      }
      return ticks;
    };
    scale.tickFormat = function(n, format) {
      if (!arguments.length) return d3_scale_logFormat;
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== "function") format = d3.format(format);
      var k = Math.max(.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12, 
      Math.floor), e;
      return function(d) {
        return d / pow(f(log(d) + e)) <= k ? format(d) : "";
      };
    };
    scale.copy = function() {
      return d3_scale_log(linear.copy(), base, positive, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
    floor: function(x) {
      return -Math.ceil(-x);
    },
    ceil: function(x) {
      return -Math.floor(-x);
    }
  };
  d3.scale.pow = function() {
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);
  };
  function d3_scale_pow(linear, exponent, domain) {
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
    function scale(x) {
      return linear(powp(x));
    }
    scale.invert = function(x) {
      return powb(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      linear.domain((domain = x.map(Number)).map(powp));
      return scale;
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      return scale.domain(d3_scale_linearNice(domain, m));
    };
    scale.exponent = function(x) {
      if (!arguments.length) return exponent;
      powp = d3_scale_powPow(exponent = x);
      powb = d3_scale_powPow(1 / exponent);
      linear.domain(domain.map(powp));
      return scale;
    };
    scale.copy = function() {
      return d3_scale_pow(linear.copy(), exponent, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_scale_powPow(e) {
    return function(x) {
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
    };
  }
  d3.scale.sqrt = function() {
    return d3.scale.pow().exponent(.5);
  };
  d3.scale.ordinal = function() {
    return d3_scale_ordinal([], {
      t: "range",
      a: [ [] ]
    });
  };
  function d3_scale_ordinal(domain, ranger) {
    var index, range, rangeBand;
    function scale(x) {
      return range[((index.get(x) || index.set(x, domain.push(x))) - 1) % range.length];
    }
    function steps(start, step) {
      return d3.range(domain.length).map(function(i) {
        return start + step * i;
      });
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      index = new d3_Map();
      var i = -1, n = x.length, xi;
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
      return scale[ranger.t].apply(scale, ranger.a);
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      rangeBand = 0;
      ranger = {
        t: "range",
        a: arguments
      };
      return scale;
    };
    scale.rangePoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = (stop - start) / (Math.max(1, domain.length - 1) + padding);
      range = steps(domain.length < 2 ? (start + stop) / 2 : start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {
        t: "rangePoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {
        t: "rangeBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding)), error = stop - start - (domain.length - padding) * step;
      range = steps(start + Math.round(error / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {
        t: "rangeRoundBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeBand = function() {
      return rangeBand;
    };
    scale.rangeExtent = function() {
      return d3_scaleExtent(ranger.a[0]);
    };
    scale.copy = function() {
      return d3_scale_ordinal(domain, ranger);
    };
    return scale.domain(domain);
  }
  d3.scale.category10 = function() {
    return d3.scale.ordinal().range(d3_category10);
  };
  d3.scale.category20 = function() {
    return d3.scale.ordinal().range(d3_category20);
  };
  d3.scale.category20b = function() {
    return d3.scale.ordinal().range(d3_category20b);
  };
  d3.scale.category20c = function() {
    return d3.scale.ordinal().range(d3_category20c);
  };
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);
  d3.scale.quantile = function() {
    return d3_scale_quantile([], []);
  };
  function d3_scale_quantile(domain, range) {
    var thresholds;
    function rescale() {
      var k = 0, q = range.length;
      thresholds = [];
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
      return scale;
    }
    function scale(x) {
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.filter(function(d) {
        return !isNaN(d);
      }).sort(d3.ascending);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.quantiles = function() {
      return thresholds;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];
    };
    scale.copy = function() {
      return d3_scale_quantile(domain, range);
    };
    return rescale();
  }
  d3.scale.quantize = function() {
    return d3_scale_quantize(0, 1, [ 0, 1 ]);
  };
  function d3_scale_quantize(x0, x1, range) {
    var kx, i;
    function scale(x) {
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
    }
    function rescale() {
      kx = range.length / (x1 - x0);
      i = range.length - 1;
      return scale;
    }
    scale.domain = function(x) {
      if (!arguments.length) return [ x0, x1 ];
      x0 = +x[0];
      x1 = +x[x.length - 1];
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      y = y < 0 ? NaN : y / kx + x0;
      return [ y, y + 1 / kx ];
    };
    scale.copy = function() {
      return d3_scale_quantize(x0, x1, range);
    };
    return rescale();
  }
  d3.scale.threshold = function() {
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);
  };
  function d3_scale_threshold(domain, range) {
    function scale(x) {
      if (x <= x) return range[d3.bisect(domain, x)];
    }
    scale.domain = function(_) {
      if (!arguments.length) return domain;
      domain = _;
      return scale;
    };
    scale.range = function(_) {
      if (!arguments.length) return range;
      range = _;
      return scale;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return [ domain[y - 1], domain[y] ];
    };
    scale.copy = function() {
      return d3_scale_threshold(domain, range);
    };
    return scale;
  }
  d3.scale.identity = function() {
    return d3_scale_identity([ 0, 1 ]);
  };
  function d3_scale_identity(domain) {
    function identity(x) {
      return +x;
    }
    identity.invert = identity;
    identity.domain = identity.range = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(identity);
      return identity;
    };
    identity.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    identity.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    identity.copy = function() {
      return d3_scale_identity(domain);
    };
    return identity;
  }
  d3.svg.arc = function() {
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
    function arc() {
      var r0 = innerRadius.apply(this, arguments), r1 = outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) + d3_svg_arcOffset, a1 = endAngle.apply(this, arguments) + d3_svg_arcOffset, da = (a1 < a0 && (da = a0, 
      a0 = a1, a1 = da), a1 - a0), df = da < π ? "0" : "1", c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      return da >= d3_svg_arcMax ? r0 ? "M0," + r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + -r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + r1 + "M0," + r0 + "A" + r0 + "," + r0 + " 0 1,0 0," + -r0 + "A" + r0 + "," + r0 + " 0 1,0 0," + r0 + "Z" : "M0," + r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + -r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + r1 + "Z" : r0 ? "M" + r1 * c0 + "," + r1 * s0 + "A" + r1 + "," + r1 + " 0 " + df + ",1 " + r1 * c1 + "," + r1 * s1 + "L" + r0 * c1 + "," + r0 * s1 + "A" + r0 + "," + r0 + " 0 " + df + ",0 " + r0 * c0 + "," + r0 * s0 + "Z" : "M" + r1 * c0 + "," + r1 * s0 + "A" + r1 + "," + r1 + " 0 " + df + ",1 " + r1 * c1 + "," + r1 * s1 + "L0,0" + "Z";
    }
    arc.innerRadius = function(v) {
      if (!arguments.length) return innerRadius;
      innerRadius = d3_functor(v);
      return arc;
    };
    arc.outerRadius = function(v) {
      if (!arguments.length) return outerRadius;
      outerRadius = d3_functor(v);
      return arc;
    };
    arc.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return arc;
    };
    arc.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return arc;
    };
    arc.centroid = function() {
      var r = (innerRadius.apply(this, arguments) + outerRadius.apply(this, arguments)) / 2, a = (startAngle.apply(this, arguments) + endAngle.apply(this, arguments)) / 2 + d3_svg_arcOffset;
      return [ Math.cos(a) * r, Math.sin(a) * r ];
    };
    return arc;
  };
  var d3_svg_arcOffset = -π / 2, d3_svg_arcMax = 2 * π - 1e-6;
  function d3_svg_arcInnerRadius(d) {
    return d.innerRadius;
  }
  function d3_svg_arcOuterRadius(d) {
    return d.outerRadius;
  }
  function d3_svg_arcStartAngle(d) {
    return d.startAngle;
  }
  function d3_svg_arcEndAngle(d) {
    return d.endAngle;
  }
  d3.svg.line.radial = function() {
    var line = d3_svg_line(d3_svg_lineRadial);
    line.radius = line.x, delete line.x;
    line.angle = line.y, delete line.y;
    return line;
  };
  function d3_svg_lineRadial(points) {
    var point, i = -1, n = points.length, r, a;
    while (++i < n) {
      point = points[i];
      r = point[0];
      a = point[1] + d3_svg_arcOffset;
      point[0] = r * Math.cos(a);
      point[1] = r * Math.sin(a);
    }
    return points;
  }
  function d3_svg_area(projection) {
    var x0 = d3_svg_lineX, x1 = d3_svg_lineX, y0 = 0, y1 = d3_svg_lineY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
    function area(data) {
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {
        return x;
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {
        return y;
      } : d3_functor(y1), x, y;
      function segment() {
        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
        } else if (points0.length) {
          segment();
          points0 = [];
          points1 = [];
        }
      }
      if (points0.length) segment();
      return segments.length ? segments.join("") : null;
    }
    area.x = function(_) {
      if (!arguments.length) return x1;
      x0 = x1 = _;
      return area;
    };
    area.x0 = function(_) {
      if (!arguments.length) return x0;
      x0 = _;
      return area;
    };
    area.x1 = function(_) {
      if (!arguments.length) return x1;
      x1 = _;
      return area;
    };
    area.y = function(_) {
      if (!arguments.length) return y1;
      y0 = y1 = _;
      return area;
    };
    area.y0 = function(_) {
      if (!arguments.length) return y0;
      y0 = _;
      return area;
    };
    area.y1 = function(_) {
      if (!arguments.length) return y1;
      y1 = _;
      return area;
    };
    area.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return area;
    };
    area.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      interpolateReverse = interpolate.reverse || interpolate;
      L = interpolate.closed ? "M" : "L";
      return area;
    };
    area.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return area;
    };
    return area;
  }
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
  d3.svg.area = function() {
    return d3_svg_area(d3_identity);
  };
  d3.svg.area.radial = function() {
    var area = d3_svg_area(d3_svg_lineRadial);
    area.radius = area.x, delete area.x;
    area.innerRadius = area.x0, delete area.x0;
    area.outerRadius = area.x1, delete area.x1;
    area.angle = area.y, delete area.y;
    area.startAngle = area.y0, delete area.y0;
    area.endAngle = area.y1, delete area.y1;
    return area;
  };
  d3.svg.chord = function() {
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
    function chord(d, i) {
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
    }
    function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) + d3_svg_arcOffset, a1 = endAngle.call(self, subgroup, i) + d3_svg_arcOffset;
      return {
        r: r,
        a0: a0,
        a1: a1,
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
      };
    }
    function equals(a, b) {
      return a.a0 == b.a0 && a.a1 == b.a1;
    }
    function arc(r, p, a) {
      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
    }
    function curve(r0, p0, r1, p1) {
      return "Q 0,0 " + p1;
    }
    chord.radius = function(v) {
      if (!arguments.length) return radius;
      radius = d3_functor(v);
      return chord;
    };
    chord.source = function(v) {
      if (!arguments.length) return source;
      source = d3_functor(v);
      return chord;
    };
    chord.target = function(v) {
      if (!arguments.length) return target;
      target = d3_functor(v);
      return chord;
    };
    chord.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return chord;
    };
    chord.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return chord;
    };
    return chord;
  };
  function d3_svg_chordRadius(d) {
    return d.radius;
  }
  d3.svg.diagonal = function() {
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
    function diagonal(d, i) {
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
        x: p0.x,
        y: m
      }, {
        x: p3.x,
        y: m
      }, p3 ];
      p = p.map(projection);
      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
    }
    diagonal.source = function(x) {
      if (!arguments.length) return source;
      source = d3_functor(x);
      return diagonal;
    };
    diagonal.target = function(x) {
      if (!arguments.length) return target;
      target = d3_functor(x);
      return diagonal;
    };
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    return diagonal;
  };
  function d3_svg_diagonalProjection(d) {
    return [ d.x, d.y ];
  }
  d3.svg.diagonal.radial = function() {
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
    diagonal.projection = function(x) {
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
    };
    return diagonal;
  };
  function d3_svg_diagonalRadialProjection(projection) {
    return function() {
      var d = projection.apply(this, arguments), r = d[0], a = d[1] + d3_svg_arcOffset;
      return [ r * Math.cos(a), r * Math.sin(a) ];
    };
  }
  d3.svg.symbol = function() {
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;
    function symbol(d, i) {
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
    }
    symbol.type = function(x) {
      if (!arguments.length) return type;
      type = d3_functor(x);
      return symbol;
    };
    symbol.size = function(x) {
      if (!arguments.length) return size;
      size = d3_functor(x);
      return symbol;
    };
    return symbol;
  };
  function d3_svg_symbolSize() {
    return 64;
  }
  function d3_svg_symbolType() {
    return "circle";
  }
  function d3_svg_symbolCircle(size) {
    var r = Math.sqrt(size / π);
    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
  }
  var d3_svg_symbols = d3.map({
    circle: d3_svg_symbolCircle,
    cross: function(size) {
      var r = Math.sqrt(size / 5) / 2;
      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
    },
    diamond: function(size) {
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
    },
    square: function(size) {
      var r = Math.sqrt(size) / 2;
      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
    },
    "triangle-down": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
    },
    "triangle-up": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
    }
  });
  d3.svg.symbolTypes = d3_svg_symbols.keys();
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
  function d3_transition(groups, id) {
    d3_subclass(groups, d3_transitionPrototype);
    groups.id = id;
    return groups;
  }
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;
  d3_transitionPrototype.call = d3_selectionPrototype.call;
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
  d3_transitionPrototype.node = d3_selectionPrototype.node;
  d3_transitionPrototype.size = d3_selectionPrototype.size;
  d3.transition = function(selection) {
    return arguments.length ? d3_transitionInheritId ? selection.transition() : selection : d3_selectionRoot.transition();
  };
  d3.transition.prototype = d3_transitionPrototype;
  d3_transitionPrototype.select = function(selector) {
    var id = this.id, subgroups = [], subgroup, subnode, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          d3_transitionNode(subnode, i, id, node.__transition__[id]);
          subgroup.push(subnode);
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_transition(subgroups, id);
  };
  d3_transitionPrototype.selectAll = function(selector) {
    var id = this.id, subgroups = [], subgroup, subnodes, node, subnode, transition;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          transition = node.__transition__[id];
          subnodes = selector.call(node, node.__data__, i, j);
          subgroups.push(subgroup = []);
          for (var k = -1, o = subnodes.length; ++k < o; ) {
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, id, transition);
            subgroup.push(subnode);
          }
        }
      }
    }
    return d3_transition(subgroups, id);
  };
  d3_transitionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i)) {
          subgroup.push(node);
        }
      }
    }
    return d3_transition(subgroups, this.id);
  };
  d3_transitionPrototype.tween = function(name, tween) {
    var id = this.id;
    if (arguments.length < 2) return this.node().__transition__[id].tween.get(name);
    return d3_selection_each(this, tween == null ? function(node) {
      node.__transition__[id].tween.remove(name);
    } : function(node) {
      node.__transition__[id].tween.set(name, tween);
    });
  };
  function d3_transition_tween(groups, name, value, tween) {
    var id = groups.id;
    return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
      node.__transition__[id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
    } : (value = tween(value), function(node) {
      node.__transition__[id].tween.set(name, value);
    }));
  }
  d3_transitionPrototype.attr = function(nameNS, value) {
    if (arguments.length < 2) {
      for (value in nameNS) this.attr(value, nameNS[value]);
      return this;
    }
    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrTween(b) {
      return b == null ? attrNull : (b += "", function() {
        var a = this.getAttribute(name), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttribute(name, i(t));
        });
      });
    }
    function attrTweenNS(b) {
      return b == null ? attrNullNS : (b += "", function() {
        var a = this.getAttributeNS(name.space, name.local), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttributeNS(name.space, name.local, i(t));
        });
      });
    }
    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.attrTween = function(nameNS, tween) {
    var name = d3.ns.qualify(nameNS);
    function attrTween(d, i) {
      var f = tween.call(this, d, i, this.getAttribute(name));
      return f && function(t) {
        this.setAttribute(name, f(t));
      };
    }
    function attrTweenNS(d, i) {
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
      return f && function(t) {
        this.setAttributeNS(name.space, name.local, f(t));
      };
    }
    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.style(priority, name[priority], value);
        return this;
      }
      priority = "";
    }
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleString(b) {
      return b == null ? styleNull : (b += "", function() {
        var a = d3_window.getComputedStyle(this, null).getPropertyValue(name), i;
        return a !== b && (i = d3_interpolate(a, b), function(t) {
          this.style.setProperty(name, i(t), priority);
        });
      });
    }
    return d3_transition_tween(this, "style." + name, value, styleString);
  };
  d3_transitionPrototype.styleTween = function(name, tween, priority) {
    if (arguments.length < 3) priority = "";
    function styleTween(d, i) {
      var f = tween.call(this, d, i, d3_window.getComputedStyle(this, null).getPropertyValue(name));
      return f && function(t) {
        this.style.setProperty(name, f(t), priority);
      };
    }
    return this.tween("style." + name, styleTween);
  };
  d3_transitionPrototype.text = function(value) {
    return d3_transition_tween(this, "text", value, d3_transition_text);
  };
  function d3_transition_text(b) {
    if (b == null) b = "";
    return function() {
      this.textContent = b;
    };
  }
  d3_transitionPrototype.remove = function() {
    return this.each("end.transition", function() {
      var p;
      if (!this.__transition__ && (p = this.parentNode)) p.removeChild(this);
    });
  };
  d3_transitionPrototype.ease = function(value) {
    var id = this.id;
    if (arguments.length < 1) return this.node().__transition__[id].ease;
    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
    return d3_selection_each(this, function(node) {
      node.__transition__[id].ease = value;
    });
  };
  d3_transitionPrototype.delay = function(value) {
    var id = this.id;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node.__transition__[id].delay = value.call(node, node.__data__, i, j) | 0;
    } : (value |= 0, function(node) {
      node.__transition__[id].delay = value;
    }));
  };
  d3_transitionPrototype.duration = function(value) {
    var id = this.id;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node.__transition__[id].duration = Math.max(1, value.call(node, node.__data__, i, j) | 0);
    } : (value = Math.max(1, value | 0), function(node) {
      node.__transition__[id].duration = value;
    }));
  };
  d3_transitionPrototype.each = function(type, listener) {
    var id = this.id;
    if (arguments.length < 2) {
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
      d3_transitionInheritId = id;
      d3_selection_each(this, function(node, i, j) {
        d3_transitionInherit = node.__transition__[id];
        type.call(node, node.__data__, i, j);
      });
      d3_transitionInherit = inherit;
      d3_transitionInheritId = inheritId;
    } else {
      d3_selection_each(this, function(node) {
        var transition = node.__transition__[id];
        (transition.event || (transition.event = d3.dispatch("start", "end"))).on(type, listener);
      });
    }
    return this;
  };
  d3_transitionPrototype.transition = function() {
    var id0 = this.id, id1 = ++d3_transitionId, subgroups = [], subgroup, group, node, transition;
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if (node = group[i]) {
          transition = Object.create(node.__transition__[id0]);
          transition.delay += transition.duration;
          d3_transitionNode(node, i, id1, transition);
        }
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, id1);
  };
  function d3_transitionNode(node, i, id, inherit) {
    var lock = node.__transition__ || (node.__transition__ = {
      active: 0,
      count: 0
    }), transition = lock[id];
    if (!transition) {
      var time = inherit.time;
      transition = lock[id] = {
        tween: new d3_Map(),
        time: time,
        ease: inherit.ease,
        delay: inherit.delay,
        duration: inherit.duration
      };
      ++lock.count;
      d3.timer(function(elapsed) {
        var d = node.__data__, ease = transition.ease, delay = transition.delay, duration = transition.duration, tweened = [];
        if (delay <= elapsed) return start(elapsed);
        d3_timer_replace(start, delay, time);
        function start(elapsed) {
          if (lock.active > id) return stop();
          lock.active = id;
          transition.event && transition.event.start.call(node, d, i);
          transition.tween.forEach(function(key, value) {
            if (value = value.call(node, d, i)) {
              tweened.push(value);
            }
          });
          if (tick(elapsed)) return 1;
          d3_timer_replace(tick, 0, time);
        }
        function tick(elapsed) {
          if (lock.active !== id) return stop();
          var t = (elapsed - delay) / duration, e = ease(t), n = tweened.length;
          while (n > 0) {
            tweened[--n].call(node, e);
          }
          if (t >= 1) {
            stop();
            transition.event && transition.event.end.call(node, d, i);
            return 1;
          }
        }
        function stop() {
          if (--lock.count) delete lock[id]; else delete node.__transition__;
          return 1;
        }
      }, 0, time);
    }
  }
  d3.svg.axis = function() {
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, tickMajorSize = 6, tickMinorSize = 6, tickEndSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_, tickSubdivide = 0;
    function axis(g) {
      g.each(function() {
        var g = d3.select(this);
        var ticks = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments_) : scale.domain() : tickValues, tickFormat = tickFormat_ == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments_) : String : tickFormat_;
        var subticks = d3_svg_axisSubdivide(scale, ticks, tickSubdivide), subtick = g.selectAll(".tick.minor").data(subticks, String), subtickEnter = subtick.enter().insert("line", ".tick").attr("class", "tick minor").style("opacity", 1e-6), subtickExit = d3.transition(subtick.exit()).style("opacity", 1e-6).remove(), subtickUpdate = d3.transition(subtick).style("opacity", 1);
        var tick = g.selectAll(".tick.major").data(ticks, String), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick major").style("opacity", 1e-6), tickExit = d3.transition(tick.exit()).style("opacity", 1e-6).remove(), tickUpdate = d3.transition(tick).style("opacity", 1), tickTransform;
        var range = d3_scaleRange(scale), path = g.selectAll(".domain").data([ 0 ]), pathUpdate = (path.enter().append("path").attr("class", "domain"), 
        d3.transition(path));
        var scale1 = scale.copy(), scale0 = this.__chart__ || scale1;
        this.__chart__ = scale1;
        tickEnter.append("line");
        tickEnter.append("text");
        var lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text");
        switch (orient) {
         case "bottom":
          {
            tickTransform = d3_svg_axisX;
            subtickEnter.attr("y2", tickMinorSize);
            subtickUpdate.attr("x2", 0).attr("y2", tickMinorSize);
            lineEnter.attr("y2", tickMajorSize);
            textEnter.attr("y", Math.max(tickMajorSize, 0) + tickPadding);
            lineUpdate.attr("x2", 0).attr("y2", tickMajorSize);
            textUpdate.attr("x", 0).attr("y", Math.max(tickMajorSize, 0) + tickPadding);
            text.attr("dy", ".71em").style("text-anchor", "middle");
            pathUpdate.attr("d", "M" + range[0] + "," + tickEndSize + "V0H" + range[1] + "V" + tickEndSize);
            break;
          }

         case "top":
          {
            tickTransform = d3_svg_axisX;
            subtickEnter.attr("y2", -tickMinorSize);
            subtickUpdate.attr("x2", 0).attr("y2", -tickMinorSize);
            lineEnter.attr("y2", -tickMajorSize);
            textEnter.attr("y", -(Math.max(tickMajorSize, 0) + tickPadding));
            lineUpdate.attr("x2", 0).attr("y2", -tickMajorSize);
            textUpdate.attr("x", 0).attr("y", -(Math.max(tickMajorSize, 0) + tickPadding));
            text.attr("dy", "0em").style("text-anchor", "middle");
            pathUpdate.attr("d", "M" + range[0] + "," + -tickEndSize + "V0H" + range[1] + "V" + -tickEndSize);
            break;
          }

         case "left":
          {
            tickTransform = d3_svg_axisY;
            subtickEnter.attr("x2", -tickMinorSize);
            subtickUpdate.attr("x2", -tickMinorSize).attr("y2", 0);
            lineEnter.attr("x2", -tickMajorSize);
            textEnter.attr("x", -(Math.max(tickMajorSize, 0) + tickPadding));
            lineUpdate.attr("x2", -tickMajorSize).attr("y2", 0);
            textUpdate.attr("x", -(Math.max(tickMajorSize, 0) + tickPadding)).attr("y", 0);
            text.attr("dy", ".32em").style("text-anchor", "end");
            pathUpdate.attr("d", "M" + -tickEndSize + "," + range[0] + "H0V" + range[1] + "H" + -tickEndSize);
            break;
          }

         case "right":
          {
            tickTransform = d3_svg_axisY;
            subtickEnter.attr("x2", tickMinorSize);
            subtickUpdate.attr("x2", tickMinorSize).attr("y2", 0);
            lineEnter.attr("x2", tickMajorSize);
            textEnter.attr("x", Math.max(tickMajorSize, 0) + tickPadding);
            lineUpdate.attr("x2", tickMajorSize).attr("y2", 0);
            textUpdate.attr("x", Math.max(tickMajorSize, 0) + tickPadding).attr("y", 0);
            text.attr("dy", ".32em").style("text-anchor", "start");
            pathUpdate.attr("d", "M" + tickEndSize + "," + range[0] + "H0V" + range[1] + "H" + tickEndSize);
            break;
          }
        }
        if (scale.rangeBand) {
          var dx = scale1.rangeBand() / 2, x = function(d) {
            return scale1(d) + dx;
          };
          tickEnter.call(tickTransform, x);
          tickUpdate.call(tickTransform, x);
        } else {
          tickEnter.call(tickTransform, scale0);
          tickUpdate.call(tickTransform, scale1);
          tickExit.call(tickTransform, scale1);
          subtickEnter.call(tickTransform, scale0);
          subtickUpdate.call(tickTransform, scale1);
          subtickExit.call(tickTransform, scale1);
        }
      });
    }
    axis.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x;
      return axis;
    };
    axis.orient = function(x) {
      if (!arguments.length) return orient;
      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
      return axis;
    };
    axis.ticks = function() {
      if (!arguments.length) return tickArguments_;
      tickArguments_ = arguments;
      return axis;
    };
    axis.tickValues = function(x) {
      if (!arguments.length) return tickValues;
      tickValues = x;
      return axis;
    };
    axis.tickFormat = function(x) {
      if (!arguments.length) return tickFormat_;
      tickFormat_ = x;
      return axis;
    };
    axis.tickSize = function(x, y) {
      if (!arguments.length) return tickMajorSize;
      var n = arguments.length - 1;
      tickMajorSize = +x;
      tickMinorSize = n > 1 ? +y : tickMajorSize;
      tickEndSize = n > 0 ? +arguments[n] : tickMajorSize;
      return axis;
    };
    axis.tickPadding = function(x) {
      if (!arguments.length) return tickPadding;
      tickPadding = +x;
      return axis;
    };
    axis.tickSubdivide = function(x) {
      if (!arguments.length) return tickSubdivide;
      tickSubdivide = +x;
      return axis;
    };
    return axis;
  };
  var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  };
  function d3_svg_axisX(selection, x) {
    selection.attr("transform", function(d) {
      return "translate(" + x(d) + ",0)";
    });
  }
  function d3_svg_axisY(selection, y) {
    selection.attr("transform", function(d) {
      return "translate(0," + y(d) + ")";
    });
  }
  function d3_svg_axisSubdivide(scale, ticks, m) {
    subticks = [];
    if (m && ticks.length > 1) {
      var extent = d3_scaleExtent(scale.domain()), subticks, i = -1, n = ticks.length, d = (ticks[1] - ticks[0]) / ++m, j, v;
      while (++i < n) {
        for (j = m; --j > 0; ) {
          if ((v = +ticks[i] - j * d) >= extent[0]) {
            subticks.push(v);
          }
        }
      }
      for (--i, j = 0; ++j < m && (v = +ticks[i] + j * d) < extent[1]; ) {
        subticks.push(v);
      }
    }
    return subticks;
  }
  d3.svg.brush = function() {
    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, resizes = d3_svg_brushResizes[0], extent = [ [ 0, 0 ], [ 0, 0 ] ], clamp = [ true, true ], extentDomain;
    function brush(g) {
      g.each(function() {
        var g = d3.select(this), bg = g.selectAll(".background").data([ 0 ]), fg = g.selectAll(".extent").data([ 0 ]), tz = g.selectAll(".resize").data(resizes, String), e;
        g.style("pointer-events", "all").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
        bg.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
        fg.enter().append("rect").attr("class", "extent").style("cursor", "move");
        tz.enter().append("g").attr("class", function(d) {
          return "resize " + d;
        }).style("cursor", function(d) {
          return d3_svg_brushCursor[d];
        }).append("rect").attr("x", function(d) {
          return /[ew]$/.test(d) ? -3 : null;
        }).attr("y", function(d) {
          return /^[ns]/.test(d) ? -3 : null;
        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
        tz.style("display", brush.empty() ? "none" : null);
        tz.exit().remove();
        if (x) {
          e = d3_scaleRange(x);
          bg.attr("x", e[0]).attr("width", e[1] - e[0]);
          redrawX(g);
        }
        if (y) {
          e = d3_scaleRange(y);
          bg.attr("y", e[0]).attr("height", e[1] - e[0]);
          redrawY(g);
        }
        redraw(g);
      });
    }
    function redraw(g) {
      g.selectAll(".resize").attr("transform", function(d) {
        return "translate(" + extent[+/e$/.test(d)][0] + "," + extent[+/^s/.test(d)][1] + ")";
      });
    }
    function redrawX(g) {
      g.select(".extent").attr("x", extent[0][0]);
      g.selectAll(".extent,.n>rect,.s>rect").attr("width", extent[1][0] - extent[0][0]);
    }
    function redrawY(g) {
      g.select(".extent").attr("y", extent[0][1]);
      g.selectAll(".extent,.e>rect,.w>rect").attr("height", extent[1][1] - extent[0][1]);
    }
    function brushstart() {
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(), center, origin = mouse(), offset;
      var w = d3.select(d3_window).on("keydown.brush", keydown).on("keyup.brush", keyup);
      if (d3.event.changedTouches) {
        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
      } else {
        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
      }
      if (dragging) {
        origin[0] = extent[0][0] - origin[0];
        origin[1] = extent[0][1] - origin[1];
      } else if (resizing) {
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
        offset = [ extent[1 - ex][0] - origin[0], extent[1 - ey][1] - origin[1] ];
        origin[0] = extent[ex][0];
        origin[1] = extent[ey][1];
      } else if (d3.event.altKey) center = origin.slice();
      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
      d3.select("body").style("cursor", eventTarget.style("cursor"));
      event_({
        type: "brushstart"
      });
      brushmove();
      function mouse() {
        var touches = d3.event.changedTouches;
        return touches ? d3.touches(target, touches)[0] : d3.mouse(target);
      }
      function keydown() {
        if (d3.event.keyCode == 32) {
          if (!dragging) {
            center = null;
            origin[0] -= extent[1][0];
            origin[1] -= extent[1][1];
            dragging = 2;
          }
          d3_eventPreventDefault();
        }
      }
      function keyup() {
        if (d3.event.keyCode == 32 && dragging == 2) {
          origin[0] += extent[1][0];
          origin[1] += extent[1][1];
          dragging = 0;
          d3_eventPreventDefault();
        }
      }
      function brushmove() {
        var point = mouse(), moved = false;
        if (offset) {
          point[0] += offset[0];
          point[1] += offset[1];
        }
        if (!dragging) {
          if (d3.event.altKey) {
            if (!center) center = [ (extent[0][0] + extent[1][0]) / 2, (extent[0][1] + extent[1][1]) / 2 ];
            origin[0] = extent[+(point[0] < center[0])][0];
            origin[1] = extent[+(point[1] < center[1])][1];
          } else center = null;
        }
        if (resizingX && move1(point, x, 0)) {
          redrawX(g);
          moved = true;
        }
        if (resizingY && move1(point, y, 1)) {
          redrawY(g);
          moved = true;
        }
        if (moved) {
          redraw(g);
          event_({
            type: "brush",
            mode: dragging ? "move" : "resize"
          });
        }
      }
      function move1(point, scale, i) {
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], size = extent[1][i] - extent[0][i], min, max;
        if (dragging) {
          r0 -= position;
          r1 -= size + position;
        }
        min = clamp[i] ? Math.max(r0, Math.min(r1, point[i])) : point[i];
        if (dragging) {
          max = (min += position) + size;
        } else {
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
          if (position < min) {
            max = min;
            min = position;
          } else {
            max = position;
          }
        }
        if (extent[0][i] !== min || extent[1][i] !== max) {
          extentDomain = null;
          extent[0][i] = min;
          extent[1][i] = max;
          return true;
        }
      }
      function brushend() {
        brushmove();
        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
        d3.select("body").style("cursor", null);
        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
        dragRestore();
        event_({
          type: "brushend"
        });
      }
    }
    brush.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.clamp = function(z) {
      if (!arguments.length) return x && y ? clamp : x || y ? clamp[+!x] : null;
      if (x && y) clamp = [ !!z[0], !!z[1] ]; else if (x || y) clamp[+!x] = !!z;
      return brush;
    };
    brush.extent = function(z) {
      var x0, x1, y0, y1, t;
      if (!arguments.length) {
        z = extentDomain || extent;
        if (x) {
          x0 = z[0][0], x1 = z[1][0];
          if (!extentDomain) {
            x0 = extent[0][0], x1 = extent[1][0];
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
            if (x1 < x0) t = x0, x0 = x1, x1 = t;
          }
        }
        if (y) {
          y0 = z[0][1], y1 = z[1][1];
          if (!extentDomain) {
            y0 = extent[0][1], y1 = extent[1][1];
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
            if (y1 < y0) t = y0, y0 = y1, y1 = t;
          }
        }
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];
      }
      extentDomain = [ [ 0, 0 ], [ 0, 0 ] ];
      if (x) {
        x0 = z[0], x1 = z[1];
        if (y) x0 = x0[0], x1 = x1[0];
        extentDomain[0][0] = x0, extentDomain[1][0] = x1;
        if (x.invert) x0 = x(x0), x1 = x(x1);
        if (x1 < x0) t = x0, x0 = x1, x1 = t;
        extent[0][0] = x0 | 0, extent[1][0] = x1 | 0;
      }
      if (y) {
        y0 = z[0], y1 = z[1];
        if (x) y0 = y0[1], y1 = y1[1];
        extentDomain[0][1] = y0, extentDomain[1][1] = y1;
        if (y.invert) y0 = y(y0), y1 = y(y1);
        if (y1 < y0) t = y0, y0 = y1, y1 = t;
        extent[0][1] = y0 | 0, extent[1][1] = y1 | 0;
      }
      return brush;
    };
    brush.clear = function() {
      extentDomain = null;
      extent[0][0] = extent[0][1] = extent[1][0] = extent[1][1] = 0;
      return brush;
    };
    brush.empty = function() {
      return x && extent[0][0] === extent[1][0] || y && extent[0][1] === extent[1][1];
    };
    return d3.rebind(brush, event, "on");
  };
  var d3_svg_brushCursor = {
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  };
  var d3_svg_brushResizes = [ [ "n", "e", "s", "w", "nw", "ne", "se", "sw" ], [ "e", "w" ], [ "n", "s" ], [] ];
  d3.time = {};
  var d3_time = Date, d3_time_daySymbols = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
  function d3_time_utc() {
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
  }
  d3_time_utc.prototype = {
    getDate: function() {
      return this._.getUTCDate();
    },
    getDay: function() {
      return this._.getUTCDay();
    },
    getFullYear: function() {
      return this._.getUTCFullYear();
    },
    getHours: function() {
      return this._.getUTCHours();
    },
    getMilliseconds: function() {
      return this._.getUTCMilliseconds();
    },
    getMinutes: function() {
      return this._.getUTCMinutes();
    },
    getMonth: function() {
      return this._.getUTCMonth();
    },
    getSeconds: function() {
      return this._.getUTCSeconds();
    },
    getTime: function() {
      return this._.getTime();
    },
    getTimezoneOffset: function() {
      return 0;
    },
    valueOf: function() {
      return this._.valueOf();
    },
    setDate: function() {
      d3_time_prototype.setUTCDate.apply(this._, arguments);
    },
    setDay: function() {
      d3_time_prototype.setUTCDay.apply(this._, arguments);
    },
    setFullYear: function() {
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
    },
    setHours: function() {
      d3_time_prototype.setUTCHours.apply(this._, arguments);
    },
    setMilliseconds: function() {
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
    },
    setMinutes: function() {
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
    },
    setMonth: function() {
      d3_time_prototype.setUTCMonth.apply(this._, arguments);
    },
    setSeconds: function() {
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
    },
    setTime: function() {
      d3_time_prototype.setTime.apply(this._, arguments);
    }
  };
  var d3_time_prototype = Date.prototype;
  var d3_time_formatDateTime = "%a %b %e %X %Y", d3_time_formatDate = "%m/%d/%Y", d3_time_formatTime = "%H:%M:%S";
  var d3_time_days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ], d3_time_dayAbbreviations = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ], d3_time_months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ], d3_time_monthAbbreviations = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  function d3_time_interval(local, step, number) {
    function round(date) {
      var d0 = local(date), d1 = offset(d0, 1);
      return date - d0 < d1 - date ? d0 : d1;
    }
    function ceil(date) {
      step(date = local(new d3_time(date - 1)), 1);
      return date;
    }
    function offset(date, k) {
      step(date = new d3_time(+date), k);
      return date;
    }
    function range(t0, t1, dt) {
      var time = ceil(t0), times = [];
      if (dt > 1) {
        while (time < t1) {
          if (!(number(time) % dt)) times.push(new Date(+time));
          step(time, 1);
        }
      } else {
        while (time < t1) times.push(new Date(+time)), step(time, 1);
      }
      return times;
    }
    function range_utc(t0, t1, dt) {
      try {
        d3_time = d3_time_utc;
        var utc = new d3_time_utc();
        utc._ = t0;
        return range(utc, t1, dt);
      } finally {
        d3_time = Date;
      }
    }
    local.floor = local;
    local.round = round;
    local.ceil = ceil;
    local.offset = offset;
    local.range = range;
    var utc = local.utc = d3_time_interval_utc(local);
    utc.floor = utc;
    utc.round = d3_time_interval_utc(round);
    utc.ceil = d3_time_interval_utc(ceil);
    utc.offset = d3_time_interval_utc(offset);
    utc.range = range_utc;
    return local;
  }
  function d3_time_interval_utc(method) {
    return function(date, k) {
      try {
        d3_time = d3_time_utc;
        var utc = new d3_time_utc();
        utc._ = date;
        return method(utc, k)._;
      } finally {
        d3_time = Date;
      }
    };
  }
  d3.time.year = d3_time_interval(function(date) {
    date = d3.time.day(date);
    date.setMonth(0, 1);
    return date;
  }, function(date, offset) {
    date.setFullYear(date.getFullYear() + offset);
  }, function(date) {
    return date.getFullYear();
  });
  d3.time.years = d3.time.year.range;
  d3.time.years.utc = d3.time.year.utc.range;
  d3.time.day = d3_time_interval(function(date) {
    var day = new d3_time(2e3, 0);
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return day;
  }, function(date, offset) {
    date.setDate(date.getDate() + offset);
  }, function(date) {
    return date.getDate() - 1;
  });
  d3.time.days = d3.time.day.range;
  d3.time.days.utc = d3.time.day.utc.range;
  d3.time.dayOfYear = function(date) {
    var year = d3.time.year(date);
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
  };
  d3_time_daySymbols.forEach(function(day, i) {
    day = day.toLowerCase();
    i = 7 - i;
    var interval = d3.time[day] = d3_time_interval(function(date) {
      (date = d3.time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
      return date;
    }, function(date, offset) {
      date.setDate(date.getDate() + Math.floor(offset) * 7);
    }, function(date) {
      var day = d3.time.year(date).getDay();
      return Math.floor((d3.time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
    });
    d3.time[day + "s"] = interval.range;
    d3.time[day + "s"].utc = interval.utc.range;
    d3.time[day + "OfYear"] = function(date) {
      var day = d3.time.year(date).getDay();
      return Math.floor((d3.time.dayOfYear(date) + (day + i) % 7) / 7);
    };
  });
  d3.time.week = d3.time.sunday;
  d3.time.weeks = d3.time.sunday.range;
  d3.time.weeks.utc = d3.time.sunday.utc.range;
  d3.time.weekOfYear = d3.time.sundayOfYear;
  d3.time.format = function(template) {
    var n = template.length;
    function format(date) {
      var string = [], i = -1, j = 0, c, p, f;
      while (++i < n) {
        if (template.charCodeAt(i) === 37) {
          string.push(template.substring(j, i));
          if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
          if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
          string.push(c);
          j = i + 1;
        }
      }
      string.push(template.substring(j, i));
      return string.join("");
    }
    format.parse = function(string) {
      var d = {
        y: 1900,
        m: 0,
        d: 1,
        H: 0,
        M: 0,
        S: 0,
        L: 0
      }, i = d3_time_parse(d, template, string, 0);
      if (i != string.length) return null;
      if ("p" in d) d.H = d.H % 12 + d.p * 12;
      var date = new d3_time();
      if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("w" in d && ("W" in d || "U" in d)) {
        date.setFullYear(d.y, 0, 1);
        date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
      } else date.setFullYear(d.y, d.m, d.d);
      date.setHours(d.H, d.M, d.S, d.L);
      return date;
    };
    format.toString = function() {
      return template;
    };
    return format;
  };
  function d3_time_parse(date, template, string, j) {
    var c, p, i = 0, n = template.length, m = string.length;
    while (i < n) {
      if (j >= m) return -1;
      c = template.charCodeAt(i++);
      if (c === 37) {
        p = d3_time_parsers[template.charAt(i++)];
        if (!p || (j = p(date, string, j)) < 0) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }
    return j;
  }
  function d3_time_formatRe(names) {
    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
  }
  function d3_time_formatLookup(names) {
    var map = new d3_Map(), i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }
  function d3_time_formatPad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }
  var d3_time_dayRe = d3_time_formatRe(d3_time_days), d3_time_dayLookup = d3_time_formatLookup(d3_time_days), d3_time_dayAbbrevRe = d3_time_formatRe(d3_time_dayAbbreviations), d3_time_dayAbbrevLookup = d3_time_formatLookup(d3_time_dayAbbreviations), d3_time_monthRe = d3_time_formatRe(d3_time_months), d3_time_monthLookup = d3_time_formatLookup(d3_time_months), d3_time_monthAbbrevRe = d3_time_formatRe(d3_time_monthAbbreviations), d3_time_monthAbbrevLookup = d3_time_formatLookup(d3_time_monthAbbreviations), d3_time_percentRe = /^%/;
  var d3_time_formatPads = {
    "-": "",
    _: " ",
    "0": "0"
  };
  var d3_time_formats = {
    a: function(d) {
      return d3_time_dayAbbreviations[d.getDay()];
    },
    A: function(d) {
      return d3_time_days[d.getDay()];
    },
    b: function(d) {
      return d3_time_monthAbbreviations[d.getMonth()];
    },
    B: function(d) {
      return d3_time_months[d.getMonth()];
    },
    c: d3.time.format(d3_time_formatDateTime),
    d: function(d, p) {
      return d3_time_formatPad(d.getDate(), p, 2);
    },
    e: function(d, p) {
      return d3_time_formatPad(d.getDate(), p, 2);
    },
    H: function(d, p) {
      return d3_time_formatPad(d.getHours(), p, 2);
    },
    I: function(d, p) {
      return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
    },
    j: function(d, p) {
      return d3_time_formatPad(1 + d3.time.dayOfYear(d), p, 3);
    },
    L: function(d, p) {
      return d3_time_formatPad(d.getMilliseconds(), p, 3);
    },
    m: function(d, p) {
      return d3_time_formatPad(d.getMonth() + 1, p, 2);
    },
    M: function(d, p) {
      return d3_time_formatPad(d.getMinutes(), p, 2);
    },
    p: function(d) {
      return d.getHours() >= 12 ? "PM" : "AM";
    },
    S: function(d, p) {
      return d3_time_formatPad(d.getSeconds(), p, 2);
    },
    U: function(d, p) {
      return d3_time_formatPad(d3.time.sundayOfYear(d), p, 2);
    },
    w: function(d) {
      return d.getDay();
    },
    W: function(d, p) {
      return d3_time_formatPad(d3.time.mondayOfYear(d), p, 2);
    },
    x: d3.time.format(d3_time_formatDate),
    X: d3.time.format(d3_time_formatTime),
    y: function(d, p) {
      return d3_time_formatPad(d.getFullYear() % 100, p, 2);
    },
    Y: function(d, p) {
      return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
    },
    Z: d3_time_zone,
    "%": function() {
      return "%";
    }
  };
  var d3_time_parsers = {
    a: d3_time_parseWeekdayAbbrev,
    A: d3_time_parseWeekday,
    b: d3_time_parseMonthAbbrev,
    B: d3_time_parseMonth,
    c: d3_time_parseLocaleFull,
    d: d3_time_parseDay,
    e: d3_time_parseDay,
    H: d3_time_parseHour24,
    I: d3_time_parseHour24,
    j: d3_time_parseDayOfYear,
    L: d3_time_parseMilliseconds,
    m: d3_time_parseMonthNumber,
    M: d3_time_parseMinutes,
    p: d3_time_parseAmPm,
    S: d3_time_parseSeconds,
    U: d3_time_parseWeekNumberSunday,
    w: d3_time_parseWeekdayNumber,
    W: d3_time_parseWeekNumberMonday,
    x: d3_time_parseLocaleDate,
    X: d3_time_parseLocaleTime,
    y: d3_time_parseYear,
    Y: d3_time_parseFullYear,
    "%": d3_time_parseLiteralPercent
  };
  function d3_time_parseWeekdayAbbrev(date, string, i) {
    d3_time_dayAbbrevRe.lastIndex = 0;
    var n = d3_time_dayAbbrevRe.exec(string.substring(i));
    return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function d3_time_parseWeekday(date, string, i) {
    d3_time_dayRe.lastIndex = 0;
    var n = d3_time_dayRe.exec(string.substring(i));
    return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function d3_time_parseWeekdayNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 1));
    return n ? (date.w = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberSunday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i));
    return n ? (date.U = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberMonday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i));
    return n ? (date.W = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMonthAbbrev(date, string, i) {
    d3_time_monthAbbrevRe.lastIndex = 0;
    var n = d3_time_monthAbbrevRe.exec(string.substring(i));
    return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function d3_time_parseMonth(date, string, i) {
    d3_time_monthRe.lastIndex = 0;
    var n = d3_time_monthRe.exec(string.substring(i));
    return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function d3_time_parseLocaleFull(date, string, i) {
    return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
  }
  function d3_time_parseLocaleDate(date, string, i) {
    return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
  }
  function d3_time_parseLocaleTime(date, string, i) {
    return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
  }
  function d3_time_parseFullYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 4));
    return n ? (date.y = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
  }
  function d3_time_expandYear(d) {
    return d + (d > 68 ? 1900 : 2e3);
  }
  function d3_time_parseMonthNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
  }
  function d3_time_parseDay(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.d = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseDayOfYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));
    return n ? (date.j = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseHour24(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.H = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMinutes(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.M = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseSeconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.S = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMilliseconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));
    return n ? (date.L = +n[0], i + n[0].length) : -1;
  }
  var d3_time_numberRe = /^\s*\d+/;
  function d3_time_parseAmPm(date, string, i) {
    var n = d3_time_amPmLookup.get(string.substring(i, i += 2).toLowerCase());
    return n == null ? -1 : (date.p = n, i);
  }
  var d3_time_amPmLookup = d3.map({
    am: 0,
    pm: 1
  });
  function d3_time_zone(d) {
    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = ~~(Math.abs(z) / 60), zm = Math.abs(z) % 60;
    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
  }
  function d3_time_parseLiteralPercent(date, string, i) {
    d3_time_percentRe.lastIndex = 0;
    var n = d3_time_percentRe.exec(string.substring(i, i + 1));
    return n ? i + n[0].length : -1;
  }
  d3.time.format.utc = function(template) {
    var local = d3.time.format(template);
    function format(date) {
      try {
        d3_time = d3_time_utc;
        var utc = new d3_time();
        utc._ = date;
        return local(utc);
      } finally {
        d3_time = Date;
      }
    }
    format.parse = function(string) {
      try {
        d3_time = d3_time_utc;
        var date = local.parse(string);
        return date && date._;
      } finally {
        d3_time = Date;
      }
    };
    format.toString = local.toString;
    return format;
  };
  var d3_time_formatIso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
  d3.time.format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
  function d3_time_formatIsoNative(date) {
    return date.toISOString();
  }
  d3_time_formatIsoNative.parse = function(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  };
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
  d3.time.second = d3_time_interval(function(date) {
    return new d3_time(Math.floor(date / 1e3) * 1e3);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
  }, function(date) {
    return date.getSeconds();
  });
  d3.time.seconds = d3.time.second.range;
  d3.time.seconds.utc = d3.time.second.utc.range;
  d3.time.minute = d3_time_interval(function(date) {
    return new d3_time(Math.floor(date / 6e4) * 6e4);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
  }, function(date) {
    return date.getMinutes();
  });
  d3.time.minutes = d3.time.minute.range;
  d3.time.minutes.utc = d3.time.minute.utc.range;
  d3.time.hour = d3_time_interval(function(date) {
    var timezone = date.getTimezoneOffset() / 60;
    return new d3_time((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
  }, function(date) {
    return date.getHours();
  });
  d3.time.hours = d3.time.hour.range;
  d3.time.hours.utc = d3.time.hour.utc.range;
  d3.time.month = d3_time_interval(function(date) {
    date = d3.time.day(date);
    date.setDate(1);
    return date;
  }, function(date, offset) {
    date.setMonth(date.getMonth() + offset);
  }, function(date) {
    return date.getMonth();
  });
  d3.time.months = d3.time.month.range;
  d3.time.months.utc = d3.time.month.utc.range;
  function d3_time_scale(linear, methods, format) {
    function scale(x) {
      return linear(x);
    }
    scale.invert = function(x) {
      return d3_time_scaleDate(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
      linear.domain(x);
      return scale;
    };
    scale.nice = function(m) {
      return scale.domain(d3_scale_nice(scale.domain(), m));
    };
    scale.ticks = function(m, k) {
      var extent = d3_scaleExtent(scale.domain());
      if (typeof m !== "function") {
        var span = extent[1] - extent[0], target = span / m, i = d3.bisect(d3_time_scaleSteps, target);
        if (i == d3_time_scaleSteps.length) return methods.year(extent, m);
        if (!i) return linear.ticks(m).map(d3_time_scaleDate);
        if (target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target) --i;
        m = methods[i];
        k = m[1];
        m = m[0].range;
      }
      return m(extent[0], new Date(+extent[1] + 1), k);
    };
    scale.tickFormat = function() {
      return format;
    };
    scale.copy = function() {
      return d3_time_scale(linear.copy(), methods, format);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_time_scaleDate(t) {
    return new Date(t);
  }
  function d3_time_scaleFormat(formats) {
    return function(date) {
      var i = formats.length - 1, f = formats[i];
      while (!f[1](date)) f = formats[--i];
      return f[0](date);
    };
  }
  function d3_time_scaleSetYear(y) {
    var d = new Date(y, 0, 1);
    d.setFullYear(y);
    return d;
  }
  function d3_time_scaleGetYear(d) {
    var y = d.getFullYear(), d0 = d3_time_scaleSetYear(y), d1 = d3_time_scaleSetYear(y + 1);
    return y + (d - d0) / (d1 - d0);
  }
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
  var d3_time_scaleLocalMethods = [ [ d3.time.second, 1 ], [ d3.time.second, 5 ], [ d3.time.second, 15 ], [ d3.time.second, 30 ], [ d3.time.minute, 1 ], [ d3.time.minute, 5 ], [ d3.time.minute, 15 ], [ d3.time.minute, 30 ], [ d3.time.hour, 1 ], [ d3.time.hour, 3 ], [ d3.time.hour, 6 ], [ d3.time.hour, 12 ], [ d3.time.day, 1 ], [ d3.time.day, 2 ], [ d3.time.week, 1 ], [ d3.time.month, 1 ], [ d3.time.month, 3 ], [ d3.time.year, 1 ] ];
  var d3_time_scaleLocalFormats = [ [ d3.time.format("%Y"), d3_true ], [ d3.time.format("%B"), function(d) {
    return d.getMonth();
  } ], [ d3.time.format("%b %d"), function(d) {
    return d.getDate() != 1;
  } ], [ d3.time.format("%a %d"), function(d) {
    return d.getDay() && d.getDate() != 1;
  } ], [ d3.time.format("%I %p"), function(d) {
    return d.getHours();
  } ], [ d3.time.format("%I:%M"), function(d) {
    return d.getMinutes();
  } ], [ d3.time.format(":%S"), function(d) {
    return d.getSeconds();
  } ], [ d3.time.format(".%L"), function(d) {
    return d.getMilliseconds();
  } ] ];
  var d3_time_scaleLinear = d3.scale.linear(), d3_time_scaleLocalFormat = d3_time_scaleFormat(d3_time_scaleLocalFormats);
  d3_time_scaleLocalMethods.year = function(extent, m) {
    return d3_time_scaleLinear.domain(extent.map(d3_time_scaleGetYear)).ticks(m).map(d3_time_scaleSetYear);
  };
  d3.time.scale = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
  };
  var d3_time_scaleUTCMethods = d3_time_scaleLocalMethods.map(function(m) {
    return [ m[0].utc, m[1] ];
  });
  var d3_time_scaleUTCFormats = [ [ d3.time.format.utc("%Y"), d3_true ], [ d3.time.format.utc("%B"), function(d) {
    return d.getUTCMonth();
  } ], [ d3.time.format.utc("%b %d"), function(d) {
    return d.getUTCDate() != 1;
  } ], [ d3.time.format.utc("%a %d"), function(d) {
    return d.getUTCDay() && d.getUTCDate() != 1;
  } ], [ d3.time.format.utc("%I %p"), function(d) {
    return d.getUTCHours();
  } ], [ d3.time.format.utc("%I:%M"), function(d) {
    return d.getUTCMinutes();
  } ], [ d3.time.format.utc(":%S"), function(d) {
    return d.getUTCSeconds();
  } ], [ d3.time.format.utc(".%L"), function(d) {
    return d.getUTCMilliseconds();
  } ] ];
  var d3_time_scaleUTCFormat = d3_time_scaleFormat(d3_time_scaleUTCFormats);
  function d3_time_scaleUTCSetYear(y) {
    var d = new Date(Date.UTC(y, 0, 1));
    d.setUTCFullYear(y);
    return d;
  }
  function d3_time_scaleUTCGetYear(d) {
    var y = d.getUTCFullYear(), d0 = d3_time_scaleUTCSetYear(y), d1 = d3_time_scaleUTCSetYear(y + 1);
    return y + (d - d0) / (d1 - d0);
  }
  d3_time_scaleUTCMethods.year = function(extent, m) {
    return d3_time_scaleLinear.domain(extent.map(d3_time_scaleUTCGetYear)).ticks(m).map(d3_time_scaleUTCSetYear);
  };
  d3.time.scale.utc = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUTCMethods, d3_time_scaleUTCFormat);
  };
  d3.text = d3_xhrType(function(request) {
    return request.responseText;
  });
  d3.json = function(url, callback) {
    return d3_xhr(url, "application/json", d3_json, callback);
  };
  function d3_json(request) {
    return JSON.parse(request.responseText);
  }
  d3.html = function(url, callback) {
    return d3_xhr(url, "text/html", d3_html, callback);
  };
  function d3_html(request) {
    var range = d3_document.createRange();
    range.selectNode(d3_document.body);
    return range.createContextualFragment(request.responseText);
  }
  d3.xml = d3_xhrType(function(request) {
    return request.responseXML;
  });
  return d3;
}();

})();
(function() {

(function() {
  d3.horizon = function() {
    var bands = 1, // between 1 and 5, typically
        mode = "offset", // or mirror
        interpolate = "linear", // or basis, monotone, step-before, etc.
        x = d3_horizonX,
        y = d3_horizonY,
        w = 960,
        h = 40,
        duration = 0;

    var color = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(["#d62728", "#fff", "#1f77b4"]);

    // For each small multiple…
    function horizon(g) {
      g.each(function(d) {
        var g = d3.select(this),
            xMin = Infinity,
            xMax = -Infinity,
            yMax = -Infinity,
            x0, // old x-scale
            y0, // old y-scale
            t0,
            id; // unique id for paths

        // Compute x- and y-values along with extents.
        var data = d.map(function(d, i) {
          var xv = x.call(this, d, i),
              yv = y.call(this, d, i);
          if (xv < xMin) xMin = xv;
          if (xv > xMax) xMax = xv;
          if (-yv > yMax) yMax = -yv;
          if (yv > yMax) yMax = yv;
          return [xv, yv];
        });

        // Compute the new x- and y-scales, and transform.
        var x1 = d3.scale.linear().domain([xMin, xMax]).range([0, w]),
            y1 = d3.scale.linear().domain([0, yMax]).range([0, h * bands]),
            t1 = d3_horizonTransform(bands, h, mode);

        // Retrieve the old scales, if this is an update.
        if (this.__chart__) {
          x0 = this.__chart__.x;
          y0 = this.__chart__.y;
          t0 = this.__chart__.t;
          id = this.__chart__.id;
        } else {
          x0 = x1.copy();
          y0 = y1.copy();
          t0 = t1;
          id = ++d3_horizonId;
        }

        // We'll use a defs to store the area path and the clip path.
        var defs = g.selectAll("defs")
            .data([null]);

        // The clip path is a simple rect.
        defs.enter().append("defs").append("clipPath")
            .attr("id", "d3_horizon_clip" + id)
          .append("rect")
            .attr("width", w)
            .attr("height", h);

        defs.select("rect").transition()
            .duration(duration)
            .attr("width", w)
            .attr("height", h);

        // We'll use a container to clip all horizon layers at once.
        g.selectAll("g")
            .data([null])
          .enter().append("g")
            .attr("clip-path", "url(#d3_horizon_clip" + id + ")");

        // Instantiate each copy of the path with different transforms.
        var path = g.select("g").selectAll("path")
            .data(d3.range(-1, -bands - 1, -1).concat(d3.range(1, bands + 1)), Number);

        var d0 = d3_horizonArea
            .interpolate(interpolate)
            .x(function(d) { return x0(d[0]); })
            .y0(h * bands)
            .y1(function(d) { return h * bands - y0(d[1]); })
            (data);

        var d1 = d3_horizonArea
            .x(function(d) { return x1(d[0]); })
            .y1(function(d) { return h * bands - y1(d[1]); })
            (data);

        path.enter().append("path")
            .style("fill", color)
            .attr("transform", t0)
            .attr("d", d0);

        path.transition()
            .duration(duration)
            .style("fill", color)
            .attr("transform", t1)
            .attr("d", d1);

        path.exit().transition()
            .duration(duration)
            .attr("transform", t1)
            .attr("d", d1)
            .remove();

        // Stash the new scales.
        this.__chart__ = {x: x1, y: y1, t: t1, id: id};
      });
      d3.timer.flush();
    }

    horizon.duration = function(x) {
      if (!arguments.length) return duration;
      duration = +x;
      return horizon;
    };

    horizon.bands = function(x) {
      if (!arguments.length) return bands;
      bands = +x;
      color.domain([-bands, 0, bands]);
      return horizon;
    };

    horizon.mode = function(x) {
      if (!arguments.length) return mode;
      mode = x + "";
      return horizon;
    };

    horizon.colors = function(x) {
      if (!arguments.length) return color.range();
      color.range(x);
      return horizon;
    };

    horizon.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x + "";
      return horizon;
    };

    horizon.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return horizon;
    };

    horizon.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return horizon;
    };

    horizon.width = function(x) {
      if (!arguments.length) return w;
      w = +x;
      return horizon;
    };

    horizon.height = function(x) {
      if (!arguments.length) return h;
      h = +x;
      return horizon;
    };

    return horizon;
  };

  var d3_horizonArea = d3.svg.area(),
      d3_horizonId = 0;

  function d3_horizonX(d) {
    return d[0];
  }

  function d3_horizonY(d) {
    return d[1];
  }

  function d3_horizonTransform(bands, h, mode) {
    return mode == "offset"
        ? function(d) { return "translate(0," + (d + (d < 0) - bands) * h + ")"; }
        : function(d) { return (d < 0 ? "scale(1,-1)" : "") + "translate(0," + (d - bands) * h + ")"; };
  }
})();

})();
(function() {

  window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
  });


})();
(function() {

(function() {

  App.data = {};

  App.data["null"] = null;

  App.data.empty = [];


})();
(function() {

(function() {

  App.data.treedata = {
    "root": {
      "group_value": "Total",
      "level": 0,
      "values": [
        {
          "type": "money",
          "value": 60269996.24879856,
          "currency": "USD"
        }, {
          "type": "money",
          "value": 61494836.611845456,
          "currency": "USD"
        }, {
          "type": "money",
          "value": 60816540.19589533,
          "currency": "USD"
        }, {
          "type": "money",
          "value": -1039739.6313347403,
          "currency": "USD"
        }, {
          "type": "percent",
          "value": -0.016858920950260137
        }, {
          "type": "percent",
          "value": -0.01685892095026014
        }
      ],
      "children": [
        {
          "group_name": "Owner (Down)",
          "group_value": "Uncle Money Penny",
          "level": 1,
          "values": [
            {
              "type": "money",
              "value": 60269996.248798564,
              "currency": "USD"
            }, {
              "type": "money",
              "value": 61494836.61184546,
              "currency": "USD"
            }, {
              "type": "money",
              "value": 60816540.19589534,
              "currency": "USD"
            }, {
              "type": "money",
              "value": -1039739.6313347424,
              "currency": "USD"
            }, {
              "type": "percent",
              "value": -0.016858920950260176
            }, {
              "type": "percent",
              "value": -0.01685892095026018
            }
          ],
          "children": [
            {
              "group_name": "Owner (Down)",
              "group_value": "The Money Penny Trust",
              "level": 2,
              "values": [
                {
                  "type": "money",
                  "value": 18241432.089211173,
                  "currency": "USD"
                }, {
                  "type": "money",
                  "value": 19049191.44150407,
                  "currency": "USD"
                }, {
                  "type": "money",
                  "value": 18480088.281079322,
                  "currency": "USD"
                }, {
                  "type": "money",
                  "value": -549006.9566043427,
                  "currency": "USD"
                }, {
                  "type": "percent",
                  "value": -0.028841927979075494
                }, {
                  "type": "percent",
                  "value": -0.00890190640386938
                }
              ],
              "children": [
                {
                  "group_name": "Owner (Down)",
                  "group_value": "Sterling Holdings, LLC",
                  "level": 3,
                  "values": [
                    {
                      "type": "money",
                      "value": 6828594.139080001,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": 6840053.28,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": 6841431,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": 8502.119999999879,
                      "currency": "USD"
                    }, {
                      "type": "percent",
                      "value": 0.0012440650800411423
                    }, {
                      "type": "percent",
                      "value": 0.00013785813743159806
                    }
                  ],
                  "children": [
                    {
                      "group_name": "Holding Status",
                      "group_value": "Current Holding",
                      "level": 4,
                      "values": [
                        {
                          "type": "money",
                          "value": 6828594.139080001,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 6840053.28,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 6841431,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 8502.119999999879,
                          "currency": "USD"
                        }, {
                          "type": "percent",
                          "value": 0.0012440650800411423
                        }, {
                          "type": "percent",
                          "value": 0.00013785813743159806
                        }
                      ],
                      "children": [
                        {
                          "group_name": "Asset Class",
                          "group_value": "Fixed Income",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 6828594.139080001,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 6840053.28,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 6841431,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 8502.119999999879,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.0012440650800411423
                            }, {
                              "type": "percent",
                              "value": 0.00013785813743159806
                            }
                          ],
                          "children": [
                            {
                              "group_name": "Security",
                              "group_value": "Bay Area Toll Auth Calif Toll Rev BDS 3.50 % Due Apr 1, 2019",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38471.4,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38232.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38656.8,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 424.79999999999563,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.011111111111110995
                                }, {
                                  "type": "percent",
                                  "value": 0.000006887945216127635
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Bay Area Toll Auth Calif Toll Toll Bridge Rev 3.90 % Due Apr 1, 2014",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38471.4,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38232.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38656.8,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 424.79999999999563,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.011111111111110995
                                }, {
                                  "type": "percent",
                                  "value": 0.000006887945216127635
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Berkshire Hathaway Inc 3.20 % Due Feb 11, 2015",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38063.16,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38147.04,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 37989.36000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -157.67999999999302,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.0041334792948546735
                                }, {
                                  "type": "percent",
                                  "value": -0.0000025567118683591537
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Burlington Northern Santa Fe CP 4.30 % Due Jul 1, 2013",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 37758.600000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38019.96000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 37260.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -759.9599999999991,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.019988448173012256
                                }, {
                                  "type": "percent",
                                  "value": -0.000012322417246818278
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Burlington Northern Santa Fe CP 4.70 % Due Oct 1, 2019",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 39441.600000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 40383.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 40011.840000000004,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -371.1600000000035,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.009190996211277107
                                }, {
                                  "type": "percent",
                                  "value": -0.000006018196201548924
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "CA CNTY Calif Tob Sec Asset Backed BDS 5.00 % Due Jun 1, 2036",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 1423656.0000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1467460.8000000003,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1468519.2,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1058.399999999674,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.0007212458417967103
                                }, {
                                  "type": "percent",
                                  "value": 0.000017161490623228148
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Canadian Natl RY Co 7.62 % Due May 15, 2023",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 48960.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 50580.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 49207.50000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 0,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Comcast Corp 6.50 % Due Jan 15, 2015",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 40730.4,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 41179.32000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 40817.520000000004,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -361.8000000000029,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.008785963439901456
                                }, {
                                  "type": "percent",
                                  "value": -0.000005866427917125762
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "CSX Corp 5.75 % Due Mar 15, 2013",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38115.36000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38282.4,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38055.96000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -226.43999999999505,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.005914989655820822
                                }, {
                                  "type": "percent",
                                  "value": -0.0000036716250346985016
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Dell Inc 1.40 % Due Sep 10, 2013",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 36448.560000000005,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 36234.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 36241.560000000005,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 7.559999999997672,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.00020864381520112796
                                }, {
                                  "type": "percent",
                                  "value": 1.2258207588020108e-7
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Du Pont E I De Nemours & Co 3.25 % Due Jan 15, 2015",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38441.16,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38532.600000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38362.68000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -169.91999999999825,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.004409772504320971
                                }, {
                                  "type": "percent",
                                  "value": -0.0000027551780864510538
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Duke Energy 3.95 % Due Sep 15, 2014",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38405.520000000004,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38570.04000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38552.04000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -18,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.00046668346727148834
                                }, {
                                  "type": "percent",
                                  "value": -2.9186208542914004e-7
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Golden ST Tob Sec C Tobacco Settlement 5.12 % Due May 31, 2047",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 1350000.0000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1333087.2000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1326240.0000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -6847.199999999953,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.005136348169872123
                                }, {
                                  "type": "percent",
                                  "value": -0.00011102433729724412
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Golden ST Tob Sec C Tobacco Settlement 5.75 % Due Jun 1, 2047",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 1260000.0000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1243800,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1256778.0000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 12978.000000000233,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.010434153400868494
                                }, {
                                  "type": "percent",
                                  "value": 0.00021043256359441374
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Long Beach Calif HBR Rev Rev BDS 4.00 % Due May 15, 2019",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 40452.840000000004,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38716.560000000005,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 40452.840000000004,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 2456.279999999999,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.06402791155277268
                                }, {
                                  "type": "percent",
                                  "value": 0.00003982750017766043
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Menlo PK Calif City SCH Dist Go BDS 0.00 % Due Jul 1, 2040",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 1752192.0000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1752192.0000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1752192.0000000002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 0,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Midamerican Energy Co 5.30 % Due Mar 15, 2018",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 41422.339080000005,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 41973.840000000004,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 41568.12,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -405.72000000000116,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.009666020549942563
                                }, {
                                  "type": "percent",
                                  "value": -0.000006578571405572836
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Napa Calif Santn Dist CTFS Par Cops 5.00 % Due Aug 1, 2013",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38045.16,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38592.72,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38131.560000000005,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -461.1599999999962,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.011949403929031077
                                }, {
                                  "type": "percent",
                                  "value": -0.000007477506628694506
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "National Grid PLC 6.30 % Due Aug 1, 2016",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 41097.600000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 41767.920000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 41082.48,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -685.4400000000023,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.01641068073296449
                                }, {
                                  "type": "percent",
                                  "value": -0.000011114108213141692
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Norfolk Southern Corp 7.05 % Due May 1, 2037",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 46945.44,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 46945.44,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 45684.54000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 7.275957614183426e-12,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Pacific Gas & Elec Co 3.25 % Due Sep 15, 2021",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 36443.520000000004,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 36476.280000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 36115.920000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -360.3600000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.00987929690198673
                                }, {
                                  "type": "percent",
                                  "value": -0.000005843078950291393
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Pepsico Inc 3.75 % Due Mar 1, 2014",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38118.96000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38498.4,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38247.12,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -251.27999999999884,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.006527024499719439
                                }, {
                                  "type": "percent",
                                  "value": -0.0000040743947125907765
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Port Oakland CA Rev Inter Lien Rev Ref BDS 5.00 % Due Nov 1, 2017",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 41180.04000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39441.600000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39902.76,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1361.1599999999962,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.035288714560572254
                                }, {
                                  "type": "percent",
                                  "value": 0.000022070610900151507
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Reynolds R J Tob HLDGS Inc 9.25 % Due Aug 15, 2013",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 39547.8,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 41373.72000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39009.600000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -2364.1200000000026,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.05714061969772121
                                }, {
                                  "type": "percent",
                                  "value": -0.000038333166300263294
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Sac Calif City Fing Aut Ref Rev BDS 5.00 % Due Dec 1, 2014",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 39448.8,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39307.32000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39448.8,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 141.47999999999593,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.0035993295905189134
                                }, {
                                  "type": "percent",
                                  "value": 0.000002294035991472975
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "SD CNTY Calif WTR Auth Water Rev BDS 4.00 % Due May 1, 2014",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 38529.36000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38528.280000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 38529.36000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 721.0800000000017,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.01905993068485019
                                }, {
                                  "type": "percent",
                                  "value": 0.000011691995142291378
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "SF Calif City & CNT Lease Rev BDS 5.00 % Due Jun 15, 2022",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 40270.32000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39305.520000000004,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 40270.32000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 964.8000000000029,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.024546170614203878
                                }, {
                                  "type": "percent",
                                  "value": 0.000015643807779001955
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "SF Calif City & CNT Second Series 5.73 % Due Jun 11, 2031",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 39948.48,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39053.880000000005,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39825.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 771.1200000000026,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.01974502917507819
                                }, {
                                  "type": "percent",
                                  "value": 0.000012503371739784402
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "SF Calif City & CNT WTR Rev BDS 5.00 % Due Nov 1, 2015",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 41299.920000000006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 41536.44,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 41269.32000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 632.8800000000047,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.0155627256171805
                                }, {
                                  "type": "percent",
                                  "value": 0.00001026187092368864
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "SF Calif City & CNT WTR Rev BDS 6.95 % Due Nov 1, 2050",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 46688.40000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 45603.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 44352.00000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 0,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }, {
                  "group_name": "Owner (Down)",
                  "group_value": "Directly Owned",
                  "level": 3,
                  "values": [
                    {
                      "type": "money",
                      "value": 11412837.950131172,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": 12209138.16150407,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": 11638657.281079324,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": -557509.0766043423,
                      "currency": "USD"
                    }, {
                      "type": "percent",
                      "value": -0.04569464814997896
                    }, {
                      "type": "percent",
                      "value": -0.009039764541300975
                    }
                  ],
                  "children": [
                    {
                      "group_name": "Holding Status",
                      "group_value": "Current Holding",
                      "level": 4,
                      "values": [
                        {
                          "type": "money",
                          "value": 11412837.950131172,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 12209138.16150407,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 11638657.281079324,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": -557509.0766043423,
                          "currency": "USD"
                        }, {
                          "type": "percent",
                          "value": -0.04569464814997896
                        }, {
                          "type": "percent",
                          "value": -0.009039764541300975
                        }
                      ],
                      "children": [
                        {
                          "group_name": "Asset Class",
                          "group_value": "Equity",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 10752798.650131172,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 11545886.761504069,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 10982219.781079324,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -550695.1766043424,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.04773083747756965
                            }, {
                              "type": "percent",
                              "value": -0.008929280148861775
                            }
                          ],
                          "children": [
                            {
                              "group_name": "Security",
                              "group_value": "Aflac, Inc",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 773996.2160337,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 853079.6719863001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 821862.5183208,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -24973.72293150006,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.02939034020252622
                                }, {
                                  "type": "percent",
                                  "value": -0.00040493793642873026
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Amazon.Com, Inc",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 1218327.10971093,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1435093.353163305,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1292464.525688595,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -142628.82747471007,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.09938644559973776
                                }, {
                                  "type": "percent",
                                  "value": -0.0023126637238378837
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Apple, Inc.",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 1602345.684855546,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1702266.249319794,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1607308.06979106,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -94958.17952873395,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.05578338850733729
                                }, {
                                  "type": "percent",
                                  "value": -0.0015397051281006093
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Baidu, Inc",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 251366.97313778396,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 307689.681229956,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 287517.98647675803,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -20171.694753197953,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.06555856755599929
                                }, {
                                  "type": "percent",
                                  "value": -0.0003270751609615776
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Berkshire Hathaway Inc",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 1014984.9394992001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1056777.1081632,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1070783.132256,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 14006.024092799984,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.013253527148353981
                                }, {
                                  "type": "percent",
                                  "value": 0.00022710152223863236
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Boeing Co.",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 1137575.6496792,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1053951.5841768002,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 1100409.3983448,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 53186.187254399876,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.0506990429849482
                                }, {
                                  "type": "percent",
                                  "value": 0.0008623906404496608
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Chipotle Mexican Grill, Inc",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 3262295.080584,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 3443852.4575562007,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 3294672.1297506006,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -149180.32780560013,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.04331786266809476
                                }, {
                                  "type": "percent",
                                  "value": -0.0024188934210191766
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "General Electric Company",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 990873.7863488102,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 973398.0581945102,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 926796.1164497101,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -46601.941744800075,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.04787552363853986
                                }, {
                                  "type": "percent",
                                  "value": -0.0007556299945935915
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Green Mountain Coffee Roasters",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 501033.210282,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 719778.5977139999,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 580405.904001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -139372.69371299993,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.19363272839126414
                                }, {
                                  "type": "percent",
                                  "value": -0.0022598669466084974
                                }
                              ]
                            }
                          ]
                        }, {
                          "group_name": "Asset Class",
                          "group_value": "Fixed Income",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 660039.3,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 663251.4,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 656437.5000000001,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -6813.900000000023,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.01027348001074709
                            }, {
                              "type": "percent",
                              "value": -0.00011048439243920134
                            }
                          ],
                          "children": [
                            {
                              "group_name": "Security",
                              "group_value": "American Express Co 4.88 % Due Jul 15, 2013",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 94106.7,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 94784.40000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 94344.3,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -440.1000000000058,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.0046431691290972545
                                }, {
                                  "type": "percent",
                                  "value": -0.000007136027988742569
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "East Bay Calif Mun Util Dist W Rev BDS 4.00 % Due Jun 1, 2014",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 96615,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 95378.40000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 95378.40000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 0,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }, {
                                  "type": "percent",
                                  "value": 0
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "FPL Group Cap Inc 5.35 % Due Jun 15, 2013",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 95578.2,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 95585.40000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 95625,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 39.59999999999127,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.00041428921153221376
                                }, {
                                  "type": "percent",
                                  "value": 6.420965879439665e-7
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "JPMorgan Chase & Co Unsec. Notes 4.75 % Due Jul 15, 2013",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 90823.5,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 92850.3,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 91250.1,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -1600.199999999997,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.01723419310438412
                                }, {
                                  "type": "percent",
                                  "value": -0.000025946539394650502
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Metlife Inc 5.38 % Due Dec 15, 2012",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 93712.5,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 93150,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 93757.5,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 607.5,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": 0.006521739130434782
                                }, {
                                  "type": "percent",
                                  "value": 0.000009850345383233477
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Morgan Stanley 2.88 % Due Jul 28, 2014",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 85325.40000000001,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 88021.8,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 84289.5,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -3732.300000000003,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.04240199586920516
                                }, {
                                  "type": "percent",
                                  "value": -0.00006051760341373224
                                }
                              ]
                            }, {
                              "group_name": "Security",
                              "group_value": "Ohio PWR Co 5.38 % Due Oct 1, 2021",
                              "level": 6,
                              "values": [
                                {
                                  "type": "money",
                                  "value": 103878,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 103481.1,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": 101792.7,
                                  "currency": "USD"
                                }, {
                                  "type": "money",
                                  "value": -1688.4000000000087,
                                  "currency": "USD"
                                }, {
                                  "type": "percent",
                                  "value": -0.016316022925925686
                                }, {
                                  "type": "percent",
                                  "value": -0.000027376663613253477
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }, {
              "group_name": "Owner (Down)",
              "group_value": "Directly Owned",
              "level": 2,
              "values": [
                {
                  "type": "money",
                  "value": 42028564.1595874,
                  "currency": "USD"
                }, {
                  "type": "money",
                  "value": 42445645.1703414,
                  "currency": "USD"
                }, {
                  "type": "money",
                  "value": 42336451.914816,
                  "currency": "USD"
                }, {
                  "type": "money",
                  "value": -490732.6747303987,
                  "currency": "USD"
                }, {
                  "type": "percent",
                  "value": -0.011509297500501158
                }, {
                  "type": "percent",
                  "value": -0.007957014546390778
                }
              ],
              "children": [
                {
                  "group_name": "Holding Status",
                  "group_value": "Current Holding",
                  "level": 3,
                  "values": [
                    {
                      "type": "money",
                      "value": 42028564.1595874,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": 42445645.1703414,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": 42336451.914816,
                      "currency": "USD"
                    }, {
                      "type": "money",
                      "value": -490732.6747303987,
                      "currency": "USD"
                    }, {
                      "type": "percent",
                      "value": -0.011509297500501158
                    }, {
                      "type": "percent",
                      "value": -0.007957014546390778
                    }
                  ],
                  "children": [
                    {
                      "group_name": "Asset Class",
                      "group_value": "Cash & Cash Equivalents",
                      "level": 4,
                      "values": [
                        {
                          "type": "money",
                          "value": 4522893,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 3584496,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 4048725,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": -2,
                          "currency": "USD"
                        }, {
                          "type": "percent",
                          "value": 0
                        }, {
                          "type": "percent",
                          "value": -3.2429120603237784e-8
                        }
                      ],
                      "children": [
                        {
                          "group_name": "Security",
                          "group_value": "Cash",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 4522893,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 3584496,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 4048725,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -2,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": -3.2429120603237784e-8
                            }
                          ]
                        }
                      ]
                    }, {
                      "group_name": "Asset Class",
                      "group_value": "Equity",
                      "level": 4,
                      "values": [
                        {
                          "type": "money",
                          "value": 14354363.1840884,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 15577473.865274899,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 15033957.5173331,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": -507398.5953467991,
                          "currency": "USD"
                        }, {
                          "type": "percent",
                          "value": -0.03259330821114757
                        }, {
                          "type": "percent",
                          "value": -0.008227245121207396
                        }
                      ],
                      "children": [
                        {
                          "group_name": "Security",
                          "group_value": "Hewlett-Packard Company",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 492659.6758712,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 507340.32410729997,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 532888.4651935,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 25548.141086200078,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.05035700864336731
                            }, {
                              "type": "percent",
                              "value": 0.0004142518742364583
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Johnson & Johnson",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 994124.922925,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 995516.3886025001,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1000618.4294200001,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 13914.65677250002,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.013997949380945998
                            }, {
                              "type": "percent",
                              "value": 0.00022562004131403127
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Las Vegas Sands Corp.",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 2498796.6305316,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 2824909.747254,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 2810469.3140412,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -14440.433212799951,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.005111821086261964
                            }, {
                              "type": "percent",
                              "value": -0.00023414527511044503
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "McDonald's",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1552883.0833780998,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1478974.1952165,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1521503.6631888,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 53679.5157623,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.03630421027233325
                            }, {
                              "type": "percent",
                              "value": 0.0008703897452895151
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Microsoft",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 840064.62046,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 860420.0324172999,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 826494.3458218,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -17770.59774550004,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.020849854094320323
                            }, {
                              "type": "percent",
                              "value": -0.00028814242874022314
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Netflix, Inc",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1305534.7794962,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1534779.3569328,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1206619.2970623001,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -328160.0598704999,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.21381578947368413
                            }, {
                              "type": "percent",
                              "value": -0.005320971079353086
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Oracle Corporation",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1175452.7162349,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1318712.2735713,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1261569.4164314999,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -57142.85713980021,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.04333231614281371
                            }, {
                              "type": "percent",
                              "value": -0.0009265463029000841
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Procter & Gamble Company",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1065772.2510156,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1046956.8059946,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1056446.3347878,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 9489.52879319992,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.00906391623691194
                            }, {
                              "type": "percent",
                              "value": 0.00015386853685128886
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Salesforce.Com",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1430900.8288592002,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1779871.6923143999,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1582731.8900944002,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -197139.80221999972,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.11076068183524804
                            }, {
                              "type": "percent",
                              "value": -0.0031965352109454073
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Sysco Corp.",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1028469.7508289999,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 986476.8682691999,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1015658.3629293999,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 29181.494660200085,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.029581529581529674
                            }, {
                              "type": "percent",
                              "value": 0.00047316510485918394
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Vmware, Inc",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1969703.9244875999,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 2243516.180595,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 2218957.9983624,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -24558.182232599705,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.010946291560102172
                            }, {
                              "type": "percent",
                              "value": -0.0003982001267086336
                            }
                          ]
                        }
                      ]
                    }, {
                      "group_name": "Asset Class",
                      "group_value": "Alternatives",
                      "level": 4,
                      "values": [
                        {
                          "type": "money",
                          "value": 23151307.975499,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 23283675.3050665,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 23253769.3974829,
                          "currency": "USD"
                        }, {
                          "type": "money",
                          "value": 16667.920616400195,
                          "currency": "USD"
                        }, {
                          "type": "percent",
                          "value": 0.0007170712230973364
                        }, {
                          "type": "percent",
                          "value": 0.0002702630039372177
                        }
                      ],
                      "children": [
                        {
                          "group_name": "Security",
                          "group_value": "Accel Internet Venture Fund Vi LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1100000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1100000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1100000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Anything But The Usd, LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1597770,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1664190,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1616548,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -45288.60000000009,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.027250853198422898
                            }, {
                              "type": "percent",
                              "value": -0.0007343347356758988
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Apollo Investment Fund V",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1614907,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1614907,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1614907,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Blackstone Communications I",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1522387,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1522387,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1522387,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Blue Ridge",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1335005,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1335005,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1335005,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Brevan Howard Master Fund LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1652094,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1652094,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1652094,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Bridgewater All Weather 12% Strategy LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1012502,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1012502,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1012502,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Buckeye Partners LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1109712.230167,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1214928.0575004998,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1147482.014338,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -49010.79136249982,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.040775699586931786
                            }, {
                              "type": "percent",
                              "value": -0.0007946884319773157
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Citadel Kensington Global Strategies LTD",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 757000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 757000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 757000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Debt Collectors, LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1574468,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1594264,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1538404,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -48686.39999999991,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.0306673372406235
                            }, {
                              "type": "percent",
                              "value": -0.0007894285686687365
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Enterprise Products Partners LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1371708.5119359998,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1372627.0667430998,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1392835.2724993,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 20208.205756200245,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.014722284184697928
                            }, {
                              "type": "percent",
                              "value": 0.00032766717082143086
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "GS Capital Partners V LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 523468,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 523468,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 523468,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "GS Distressed Opportunities Fund III",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 305263,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 305263,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 305263,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Horseman Global Fund LTD",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 600000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 600000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 600000,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Kinder Morgan Energy Partners, LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1273574.2973384,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1220722.8917097,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1256224.899746,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 35502.008036300074,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.029082774049217063
                            }, {
                              "type": "percent",
                              "value": 0.000575649450133146
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Kinder Morgan Management, LLC",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1308675.3063251998,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1192224.6223487998,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1273758.0996923998,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 81533.47734360001,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.0683876811594203
                            }, {
                              "type": "percent",
                              "value": 0.00132202948498848
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "KKR 2006 Fund LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 823100,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 823100,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 823100,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Paulson Credit Opportunities",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 368500,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 368500,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 368500,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 0,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0
                            }, {
                              "type": "percent",
                              "value": 0
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Plains All American Pipeline, L.P.",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 1284629.6297324002,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1221666.6667644,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 1201111.1112072,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": -1943.9791572000831,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": -0.0016142062729210425
                            }, {
                              "type": "percent",
                              "value": -0.00003152076726951102
                            }
                          ]
                        }, {
                          "group_name": "Security",
                          "group_value": "Trading Places, LP",
                          "level": 5,
                          "values": [
                            {
                              "type": "money",
                              "value": 2016544,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 2188826,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 2213180,
                              "currency": "USD"
                            }, {
                              "type": "money",
                              "value": 24354,
                              "currency": "USD"
                            }, {
                              "type": "percent",
                              "value": 0.011126512568838271
                            }, {
                              "type": "percent",
                              "value": 0.00039488940158562645
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "grouping_factors": [
      {
        "display_name": "Owner (Down)",
        "is_time_series": false,
        "template_id": "down_factor"
      }, {
        "display_name": "Holding Status",
        "is_time_series": false,
        "template_id": "holding_period_factor"
      }, {
        "display_name": "Asset Class",
        "is_time_series": false,
        "template_id": "asset_class_factor"
      }, {
        "display_name": "Security",
        "is_time_series": false,
        "template_id": "security_factor"
      }
    ],
    "value_factors": [
      {
        "display_name": "Current Value (Native Currency)",
        "is_time_series": false,
        "template_id": "personal_value_factor"
      }, {
        "display_name": "Adjusted Value 11/1/2012 (USD)",
        "is_time_series": false,
        "template_id": "personal_value_factor"
      }, {
        "display_name": "Adjusted Value 11/30/2011 (USD)",
        "is_time_series": false,
        "template_id": "personal_value_factor"
      }, {
        "display_name": "Adjusted Total Return Nov. 2011 (USD)",
        "is_time_series": false,
        "template_id": "absolute_gain_factor"
      }, {
        "display_name": "Adjusted Total Return (%) Nov. 2011 (USD)",
        "is_time_series": false,
        "template_id": "percent_gain_factor"
      }, {
        "display_name": "Adjusted Performance Attribution Nov. 2011 (USD) ",
        "is_time_series": false,
        "template_id": "contribution_to_portfolio_factor"
      }
    ]
  };

}).call(this);


})();
(function() {

}).call(this);


})();
(function() {

(function() {

  App.EmberTableOverviewController = Ember.Controller.extend({
    data: Ember.computed(function() {
      return App.data.treedata;
    })
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableSimpleController = Ember.Controller.extend({
    numRows: 100,
    columns: Ember.computed(function() {
      var closeColumn, dateColumn, highColumn, lowColumn, openColumn;
      dateColumn = Ember.Table.ColumnDefinition.create({
        savedWidth: 150,
        textAlign: 'text-align-left',
        headerCellName: 'Date',
        getCellContent: function(row) {
          return row.get('date').toDateString();
        }
      });
      openColumn = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Open',
        getCellContent: function(row) {
          return row.get('open').toFixed(2);
        }
      });
      highColumn = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'High',
        getCellContent: function(row) {
          return row.get('high').toFixed(2);
        }
      });
      lowColumn = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Low',
        getCellContent: function(row) {
          return row.get('low').toFixed(2);
        }
      });
      closeColumn = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Close',
        getCellContent: function(row) {
          return row.get('close').toFixed(2);
        }
      });
      return [dateColumn, openColumn, highColumn, lowColumn, closeColumn];
    }),
    content: Ember.computed(function() {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(index) {
        var date;
        date = new Date();
        date.setDate(date.getDate() + index);
        return {
          date: date,
          open: Math.random() * 100 - 50,
          high: Math.random() * 100 - 50,
          low: Math.random() * 100 - 50,
          close: Math.random() * 100 - 50,
          volume: Math.random() * 1000000
        };
      });
    }).property('numRows')
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableAjaxLazyDataSource = Ember.ArrayProxy.extend({
    createGithubEvent: function(row, event) {
      row.set('type', event.type);
      row.set('createdAt', event.created_at);
      row.set('login', event.actor.login);
      row.set('avatar', event.actor.avatar_url);
      return row.set('isLoaded', true);
    },
    requestGithubEvent: function(page) {
      var content, end, start, url, _i, _results,
        _this = this;
      content = this.get('content');
      start = (page - 1) * 30;
      end = start + 30;
      url = "https://api.github.com/repos/emberjs/ember.js/events?page=" + page + "&per_page=30&callback=?";
      Ember.$.getJSON(url, function(json) {
        return json.data.forEach(function(event, index) {
          var row;
          row = content[start + index];
          return _this.createGithubEvent(row, event);
        });
      });
      return (function() {
        _results = [];
        for (var _i = start; start <= end ? _i < end : _i > end; start <= end ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).forEach(function(index) {
        return content[index] = Ember.Object.create({
          eventId: index,
          isLoaded: false
        });
      });
    },
    objectAt: function(index) {
      var content, row;
      content = this.get('content');
      row = content[index];
      if (row && !row.get('error')) {
        return row;
      }
      this.requestGithubEvent(Math.floor(index / 30 + 1));
      return content[index];
    }
  });

  App.EmberTableAjaxController = Ember.Controller.extend({
    numRows: 100,
    columns: Ember.computed(function() {
      var avatar, columnNames, columns;
      avatar = Ember.Table.ColumnDefinition.create({
        savedWidth: 80,
        headerCellName: 'avatar',
        tableCellViewClass: 'App.EmberTableAjaxImageTableCell',
        contentPath: 'avatar'
      });
      columnNames = ['login', 'type', 'createdAt'];
      columns = columnNames.map(function(key, index) {
        return Ember.Table.ColumnDefinition.create({
          savedWidth: 150,
          headerCellName: key.w(),
          contentPath: key
        });
      });
      columns.unshift(avatar);
      return columns;
    }),
    content: Ember.computed(function() {
      return App.EmberTableAjaxLazyDataSource.create({
        content: new Array(this.get('numRows'))
      });
    }).property('numRows')
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableBarsController = Ember.Controller.extend({
    numRows: 100,
    columns: Ember.computed(function() {
      var colors, column1, columns;
      colors = ['blue', 'teal', 'green', 'yellow', 'orange'];
      column1 = Ember.Table.ColumnDefinition.create({
        savedWidth: 50,
        headerCellName: 'Name',
        contentPath: 'key'
      });
      columns = colors.map(function(color, index) {
        return Ember.Table.ColumnDefinition.create({
          color: color,
          headerCellName: 'Bar',
          tableCellViewClass: 'App.BarTableCell',
          contentPath: "value" + (index + 1)
        });
      });
      columns.unshift(column1);
      return columns;
    }),
    content: Ember.computed(function() {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(num, index) {
        return {
          key: index,
          value1: Math.random() * 80 + 10,
          value2: Math.random() * 80 + 10,
          value3: Math.random() * 80 + 10,
          value4: Math.random() * 80 + 10,
          value5: Math.random() * 80 + 10
        };
      });
    }).property('numRows')
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableDynamicBarsController = Ember.Controller.extend({
    numRows: 100,
    getNextValue: function(current) {
      current = current + (Math.random() * 10 - 5);
      current = Math.min(100, current);
      current = Math.max(0, current);
      return current;
    },
    init: function() {
      var _this = this;
      return setInterval(function() {
        return _this.get('content').forEach(function(item) {
          item.set('value1', _this.getNextValue(item.get('value1')));
          item.set('value2', _this.getNextValue(item.get('value2')));
          item.set('value3', _this.getNextValue(item.get('value3')));
          item.set('value4', _this.getNextValue(item.get('value4')));
          return item.set('value5', _this.getNextValue(item.get('value5')));
        });
      }, 1500);
    },
    columns: Ember.computed(function() {
      var colors, column1, columns;
      colors = ['blue', 'teal', 'green', 'yellow', 'orange'];
      column1 = Ember.Table.ColumnDefinition.create({
        savedWidth: 50,
        headerCellName: 'Name',
        contentPath: 'key'
      });
      columns = colors.map(function(color, index) {
        return Ember.Table.ColumnDefinition.create({
          color: color,
          headerCellName: 'Bar',
          tableCellViewClass: 'App.BarTableCell',
          contentPath: "value" + (index + 1)
        });
      });
      columns.unshift(column1);
      return columns;
    }),
    content: Ember.computed(function() {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(num, index) {
        return Ember.Object.create({
          key: index,
          value1: Math.random() * 80 + 10,
          value2: Math.random() * 80 + 10,
          value3: Math.random() * 80 + 10,
          value4: Math.random() * 80 + 10,
          value5: Math.random() * 80 + 10
        });
      });
    }).property('numRows')
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableFinancialController = Ember.Controller.extend({
    data: Ember.computed(function() {
      return App.data.treedata;
    })
  });

  Number.prototype.toCurrency = function() {
    var value;
    if (isNaN(this) || !isFinite(this)) {
      return '-';
    }
    value = Math.abs(this).toFixed(2);
    value = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    return (this < 0 ? '-$' : '$') + value;
  };

  Number.prototype.toPercent = function() {
    if (isNaN(this) || !isFinite(this)) {
      return '-';
    }
    return Math.abs(this * 100).toFixed(2) + '%';
  };

  App.TreeTableExample = Ember.Namespace.create();

  App.TreeTableExample.TreeDataAdapter = Ember.Mixin.create({
    data: null,
    columns: Ember.computed(function() {
      var columns, data, names;
      data = this.get('data');
      if (!data) {
        return;
      }
      names = this.get('data.value_factors').getEach('display_name');
      columns = names.map(function(name, index) {
        return Ember.Table.ColumnDefinition.create({
          index: index,
          headerCellName: name,
          getCellContent: function(row) {
            var object;
            object = row.get('values')[this.get('index')];
            if (object.type === 'money') {
              return object.value.toCurrency();
            }
            if (object.type === 'percent') {
              return object.value.toPercent();
            }
            return "-";
          }
        });
      });
      columns.unshiftObject(this.get('groupingColumn'));
      return columns;
    }).property('data.valueFactors.@each', 'groupingColumn'),
    groupingColumn: Ember.computed(function() {
      var groupingFactors, name;
      groupingFactors = this.get('data.grouping_factors');
      name = groupingFactors.getEach('display_name').join(' ▸ ');
      return Ember.Table.ColumnDefinition.create({
        headerCellName: name,
        savedWidth: 400,
        isTreeColumn: true,
        isSortable: false,
        textAlign: 'text-align-left',
        headerCellViewClass: 'App.TreeTableExample.HeaderTreeCell',
        tableCellViewClass: 'App.TreeTableExample.TreeCell',
        contentPath: 'group_value'
      });
    }).property('data.grouping_factors.@each'),
    root: Ember.computed(function() {
      var data;
      data = this.get('data');
      if (!data) {
        return;
      }
      return this.createTree(null, data.root);
    }).property('data', 'sortAscending', 'sortColumn'),
    rows: Ember.computed(function() {
      var maxGroupingLevel, root, rows;
      root = this.get('root');
      if (!root) {
        return Ember.A();
      }
      rows = this.flattenTree(null, root, Ember.A());
      this.computeStyles(null, root);
      maxGroupingLevel = Math.max.apply(rows.getEach('groupingLevel'));
      rows.forEach(function(row) {
        return row.computeRowStyle(maxGroupingLevel);
      });
      return rows;
    }).property('root'),
    bodyContent: Ember.computed(function() {
      var rows;
      rows = this.get('rows');
      if (!rows) {
        return Ember.A();
      }
      rows = rows.slice(1, rows.get('length'));
      return rows.filterProperty('isShowing');
    }).property('rows'),
    footerContent: Ember.computed(function() {
      var rows;
      rows = this.get('rows');
      if (!rows) {
        return Ember.A();
      }
      return rows.slice(0, 1);
    }).property('rows'),
    orderBy: function(item1, item2) {
      var result, sortAscending, sortColumn, value1, value2;
      sortColumn = this.get('sortColumn');
      sortAscending = this.get('sortAscending');
      if (!sortColumn) {
        return 1;
      }
      value1 = sortColumn.getCellContent(item1);
      value2 = sortColumn.getCellContent(item2);
      result = Ember.compare(value1, value2);
      if (sortAscending) {
        return result;
      } else {
        return -result;
      }
    },
    createTree: function(parent, node) {
      var children, row,
        _this = this;
      row = App.TreeTableExample.TreeTableRow.create();
      children = (node.children || []).map(function(child) {
        return _this.createTree(row, child);
      });
      row.setProperties({
        isRoot: !parent,
        isLeaf: Ember.isEmpty(children),
        content: node,
        parent: parent,
        children: children,
        groupName: node.group_name,
        isCollapsed: false
      });
      return row;
    },
    flattenTree: function(parent, node, rows) {
      var _this = this;
      rows.pushObject(node);
      (node.children || []).forEach(function(child) {
        return _this.flattenTree(node, child, rows);
      });
      return rows;
    },
    computeStyles: function(parent, node) {
      var _this = this;
      node.computeStyles(parent);
      return node.get('children').forEach(function(child) {
        return _this.computeStyles(node, child);
      });
    }
  });

  App.TreeTableExample.TableComponent = Ember.Table.EmberTableComponent.extend(App.TreeTableExample.TreeDataAdapter, {
    numFixedColumns: 1,
    isCollapsed: false,
    isHeaderHeightResizable: true,
    rowHeight: 30,
    hasHeader: true,
    hasFooter: true,
    headerHeight: 70,
    sortAscending: false,
    sortColumn: null,
    toggleTableCollapse: function(event) {
      var children, isCollapsed;
      this.toggleProperty('isCollapsed');
      isCollapsed = this.get('isCollapsed');
      children = this.get('root.children');
      if (!(children && children.get('length') > 0)) {
        return;
      }
      children.forEach(function(child) {
        return child.recursiveCollapse(isCollapsed);
      });
      return this.notifyPropertyChange('rows');
    },
    toggleCollapse: function(row) {
      row.toggleProperty('isCollapsed');
      return Ember.run.next(this, function() {
        return this.notifyPropertyChange('rows');
      });
    },
    sortByColumn: function(column) {
      column.toggleProperty('sortAscending');
      this.set('sortColumn', column);
      return this.set('sortAscending', column.get('sortAscending'));
    }
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableFinancialController = Ember.Controller.extend({
    data: Ember.computed(function() {
      return App.data.treedata;
    })
  });

  Number.prototype.toCurrency = function() {
    var value;
    if (isNaN(this) || !isFinite(this)) {
      return '-';
    }
    value = Math.abs(this).toFixed(2);
    value = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    return (this < 0 ? '-$' : '$') + value;
  };

  Number.prototype.toPercent = function() {
    if (isNaN(this) || !isFinite(this)) {
      return '-';
    }
    return Math.abs(this * 100).toFixed(2) + '%';
  };

  App.FinancialTableTreeTableRow = Ember.Table.Row.extend({
    content: null,
    children: null,
    parent: null,
    isRoot: false,
    isLeaf: false,
    isCollapsed: false,
    isShowing: true,
    indentationSpacing: 20,
    groupName: null,
    computeStyles: function(parent) {
      var groupingLevel, indentType, indentation, isShowing, pGroupingLevel, spacing;
      groupingLevel = 0;
      indentation = 0;
      isShowing = true;
      if (parent) {
        isShowing = parent.get('isShowing') && !parent.get('isCollapsed');
        pGroupingLevel = parent.get('groupingLevel');
        groupingLevel = pGroupingLevel;
        if (parent.get('groupName') !== this.get('groupName')) {
          groupingLevel += 1;
        }
        indentType = groupingLevel === pGroupingLevel ? 'half' : 'full';
        spacing = this.get('indentationSpacing');
        if (!parent.get('isRoot')) {
          indentation = parent.get('indentation');
          indentation += (indentType === 'half' ? spacing / 2 : spacing);
        }
      }
      this.set('groupingLevel', groupingLevel);
      this.set('indentation', indentation);
      return this.set('isShowing', isShowing);
    },
    computeRowStyle: function(maxLevels) {
      var level;
      level = this.getFormattingLevel(this.get('groupingLevel'), maxLevels);
      return this.set('rowStyle', "ember-table-row-style-" + level);
    },
    recursiveCollapse: function(isCollapsed) {
      this.set('isCollapsed', isCollapsed);
      return this.get('children').forEach(function(child) {
        return child.recursiveCollapse(isCollapsed);
      });
    },
    getFormattingLevel: function(level, maxLevels) {
      switch (maxLevels) {
        case 1:
          return 5;
        case 2:
          if (level === 1) {
            return 2;
          }
          return 5;
        case 3:
          if (level === 1) {
            return 1;
          }
          if (level === 2) {
            return 3;
          }
          return 5;
        case 4:
          if (level === 1) {
            return 1;
          }
          if (level === 2) {
            return 2;
          }
          if (level === 4) {
            return 4;
          }
          return 5;
        case 5:
          return level;
        default:
          if (level === maxLevels) {
            return 5;
          }
          return Math.min(level, 4);
      }
    }
  });

  App.FinancialTableComponent = Ember.Table.EmberTableComponent.extend({
    numFixedColumns: 1,
    isCollapsed: false,
    isHeaderHeightResizable: true,
    rowHeight: 30,
    hasHeader: true,
    hasFooter: true,
    headerHeight: 70,
    sortAscending: false,
    sortColumn: null,
    actions: {
      toggleTableCollapse: function(event) {
        var children, isCollapsed;
        this.toggleProperty('isCollapsed');
        isCollapsed = this.get('isCollapsed');
        children = this.get('root.children');
        if (!(children && children.get('length') > 0)) {
          return;
        }
        children.forEach(function(child) {
          return child.recursiveCollapse(isCollapsed);
        });
        return this.notifyPropertyChange('rows');
      },
      toggleCollapse: function(row) {
        row.toggleProperty('isCollapsed');
        return Ember.run.next(this, function() {
          return this.notifyPropertyChange('rows');
        });
      }
    },
    data: null,
    columns: Ember.computed(function() {
      var columns, data, names;
      data = this.get('data');
      if (!data) {
        return;
      }
      names = this.get('data.value_factors').getEach('display_name');
      columns = names.map(function(name, index) {
        return Ember.Table.ColumnDefinition.create({
          index: index,
          headerCellName: name,
          headerCellViewClass: 'App.FinancialTableHeaderCell',
          tableCellViewClass: 'App.FinancialTableCell',
          getCellContent: function(row) {
            var object;
            object = row.get('values')[this.get('index')];
            if (object.type === 'money') {
              return object.value.toCurrency();
            }
            if (object.type === 'percent') {
              return object.value.toPercent();
            }
            return "-";
          }
        });
      });
      columns.unshiftObject(this.get('groupingColumn'));
      return columns;
    }).property('data.valueFactors.@each', 'groupingColumn'),
    groupingColumn: Ember.computed(function() {
      var groupingFactors, name;
      groupingFactors = this.get('data.grouping_factors');
      name = groupingFactors.getEach('display_name').join(' ▸ ');
      return Ember.Table.ColumnDefinition.create({
        headerCellName: name,
        savedWidth: 400,
        isTreeColumn: true,
        isSortable: false,
        textAlign: 'text-align-left',
        headerCellViewClass: 'App.FinancialTableHeaderTreeCell',
        tableCellViewClass: 'App.FinancialTableTreeCell',
        contentPath: 'group_value'
      });
    }).property('data.grouping_factors.@each'),
    root: Ember.computed(function() {
      var data;
      data = this.get('data');
      if (!data) {
        return;
      }
      return this.createTree(null, data.root);
    }).property('data', 'sortAscending', 'sortColumn'),
    rows: Ember.computed(function() {
      var maxGroupingLevel, root, rows;
      root = this.get('root');
      if (!root) {
        return Ember.A();
      }
      rows = this.flattenTree(null, root, Ember.A());
      this.computeStyles(null, root);
      maxGroupingLevel = Math.max.apply(rows.getEach('groupingLevel'));
      rows.forEach(function(row) {
        return row.computeRowStyle(maxGroupingLevel);
      });
      return rows;
    }).property('root'),
    bodyContent: Ember.computed(function() {
      var rows;
      rows = this.get('rows');
      if (!rows) {
        return Ember.A();
      }
      rows = rows.slice(1, rows.get('length'));
      return rows.filterProperty('isShowing');
    }).property('rows'),
    footerContent: Ember.computed(function() {
      var rows;
      rows = this.get('rows');
      if (!rows) {
        return Ember.A();
      }
      return rows.slice(0, 1);
    }).property('rows'),
    orderBy: function(item1, item2) {
      var result, sortAscending, sortColumn, value1, value2;
      sortColumn = this.get('sortColumn');
      sortAscending = this.get('sortAscending');
      if (!sortColumn) {
        return 1;
      }
      value1 = sortColumn.getCellContent(item1.get('content'));
      value2 = sortColumn.getCellContent(item2.get('content'));
      result = Ember.compare(value1, value2);
      if (sortAscending) {
        return result;
      } else {
        return -result;
      }
    },
    createTree: function(parent, node) {
      var children, row,
        _this = this;
      row = App.FinancialTableTreeTableRow.create({
        parentController: this
      });
      children = (node.children || []).map(function(child) {
        return _this.createTree(row, child);
      });
      row.setProperties({
        isRoot: !parent,
        isLeaf: Ember.isEmpty(children),
        content: node,
        parent: parent,
        children: children,
        groupName: node.group_name,
        isCollapsed: false
      });
      return row;
    },
    flattenTree: function(parent, node, rows) {
      var _this = this;
      rows.pushObject(node);
      (node.children || []).forEach(function(child) {
        return _this.flattenTree(node, child, rows);
      });
      return rows;
    },
    computeStyles: function(parent, node) {
      var _this = this;
      node.computeStyles(parent);
      return node.get('children').forEach(function(child) {
        return _this.computeStyles(node, child);
      });
    }
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableEditableController = Ember.Controller.extend({
    numRows: 100,
    columns: Ember.computed(function() {
      var columnNames, columns, dateColumn, ratingColumn;
      columnNames = ['open', 'close'];
      dateColumn = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Date',
        tableCellViewClass: 'App.DatePickerTableCell',
        getCellContent: function(row) {
          return row.get('date').toString('yyyy-MM-dd');
        },
        setCellContent: function(row, value) {
          return row.set('date', value);
        }
      });
      ratingColumn = Ember.Table.ColumnDefinition.create({
        savedWidth: 150,
        headerCellName: 'Analyst Rating',
        tableCellViewClass: 'App.RatingTableCell',
        contentPath: 'rating',
        setCellContent: function(row, value) {
          return row.set('rating', value);
        }
      });
      columns = columnNames.map(function(key, index) {
        var name;
        name = key.charAt(0).toUpperCase() + key.slice(1);
        return Ember.Table.ColumnDefinition.create({
          savedWidth: 100,
          headerCellName: name,
          tableCellViewClass: 'App.EditableTableCell',
          getCellContent: function(row) {
            return row.get(key).toFixed(2);
          },
          setCellContent: function(row, value) {
            return row.set(key, +value);
          }
        });
      });
      columns.unshift(ratingColumn);
      columns.unshift(dateColumn);
      return columns;
    }).property(),
    content: Ember.computed(function() {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(num, idx) {
        return {
          index: idx,
          date: Date.now().add({
            days: idx
          }),
          open: Math.random() * 100 - 50,
          close: Math.random() * 100 - 50,
          rating: Math.round(Math.random() * 4)
        };
      });
    }).property('numRows')
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableSparklineController = Ember.Controller.extend({
    numRows: 100,
    columns: Ember.computed(function() {
      var close, high, low, name, open, spark;
      name = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Name',
        getCellContent: function(row) {
          return 'Asset ' + row.get('name');
        }
      });
      open = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Open',
        getCellContent: function(row) {
          return row.get('open').toFixed(2);
        }
      });
      spark = Ember.Table.ColumnDefinition.create({
        savedWidth: 200,
        headerCellName: 'Sparkline',
        tableCellViewClass: 'App.SparkLineTableCellView',
        contentPath: 'timeseries'
      });
      close = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Close',
        getCellContent: function(row) {
          return row.get('close').toFixed(2);
        }
      });
      low = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Low',
        getCellContent: function(row) {
          return row.get('low').toFixed(2);
        }
      });
      high = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'High',
        getCellContent: function(row) {
          return row.get('high').toFixed(2);
        }
      });
      return [name, open, spark, close, low, high];
    }),
    content: Ember.computed(function() {
      var randomWalk, _i, _ref, _results;
      randomWalk = function(numSteps) {
        var lastValue, _i, _results;
        lastValue = 0;
        return (function() {
          _results = [];
          for (var _i = 0; 0 <= numSteps ? _i < numSteps : _i > numSteps; 0 <= numSteps ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function() {
          return lastValue = lastValue + d3.random.normal()();
        });
      };
      return (function() {
        _results = [];
        for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(num, index) {
        var data;
        data = randomWalk(100);
        return {
          name: index,
          timeseries: data,
          open: data[0],
          close: data[99],
          low: Math.min.apply(null, data),
          high: Math.max.apply(null, data)
        };
      });
    }).property('numRows')
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableHorizonController = Ember.Controller.extend({
    numRows: 100,
    columns: Ember.computed(function() {
      var horizon, name;
      name = Ember.Table.ColumnDefinition.create({
        savedWidth: 100,
        headerCellName: 'Name',
        getCellContent: function(row) {
          return 'Horizon ' + row.get('name');
        }
      });
      horizon = Ember.Table.ColumnDefinition.create({
        savedWidth: 600,
        headerCellName: 'Horizon',
        tableCellViewClass: 'App.HorizonTableCellView',
        getCellContent: Ember.K
      });
      return [name, horizon];
    }),
    content: Ember.computed(function() {
      var normal, _i, _ref, _results;
      normal = d3.random.normal(1.5, 3);
      return (function() {
        _results = [];
        for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(num, index) {
        var data, _i, _results;
        data = (function() {
          _results = [];
          for (_i = 0; _i < 100; _i++){ _results.push(_i); }
          return _results;
        }).apply(this).map(function(i) {
          return [i, normal()];
        });
        return {
          name: index,
          data: data
        };
      });
    }).property('numRows')
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableConfigurableColumnsController = Ember.Controller.extend({
    numRows: 100,
    isFluid: false,
    columnMode: Ember.computed(function() {
      if (this.get('isFluid')) {
        return 'fluid';
      } else {
        return 'standard';
      }
    }).property('isFluid'),
    showTable: true,
    columns: Ember.computed(function() {
      var closeColumn, dateColumn, highColumn, lowColumn, openColumn;
      dateColumn = App.ConfigurableColumnDefinition.create({
        textAlign: 'text-align-left',
        headerCellName: 'Date',
        minWidth: 150,
        getCellContent: function(row) {
          return row.get('date').toDateString();
        }
      });
      openColumn = App.ConfigurableColumnDefinition.create({
        headerCellName: 'Open',
        getCellContent: function(row) {
          return row.get('open').toFixed(2);
        }
      });
      highColumn = App.ConfigurableColumnDefinition.create({
        headerCellName: 'High',
        getCellContent: function(row) {
          return row.get('high').toFixed(2);
        }
      });
      lowColumn = App.ConfigurableColumnDefinition.create({
        headerCellName: 'Low',
        getCellContent: function(row) {
          return row.get('low').toFixed(2);
        }
      });
      closeColumn = App.ConfigurableColumnDefinition.create({
        headerCellName: 'Close',
        getCellContent: function(row) {
          return row.get('close').toFixed(2);
        }
      });
      return [dateColumn, openColumn, highColumn, lowColumn, closeColumn];
    }),
    content: Ember.computed(function() {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(index) {
        var date;
        date = new Date();
        date.setDate(date.getDate() + index);
        return {
          date: date,
          open: Math.random() * 100 - 50,
          high: Math.random() * 100 - 50,
          low: Math.random() * 100 - 50,
          close: Math.random() * 100 - 50,
          volume: Math.random() * 1000000
        };
      });
    }).property('numRows'),
    demoTableWidth: void 0,
    updateDemoTableWidth: function(newWidth) {
      return this.set('demoTableWidth', newWidth);
    },
    actions: {
      refreshTable: function() {
        var _this = this;
        this.set('showTable', false);
        return Ember.run.next(function() {
          return _this.set('showTable', true);
        });
      }
    }
  });

  App.ConfigurableColumnDefinition = Ember.Table.ColumnDefinition.extend({
    savedWidth: void 0,
    savedWidthValue: Ember.computed(function(key, value) {
      if (arguments.length === 1) {
        return this.get('savedWidth');
      } else {
        this.set('savedWidth', parseInt(value));
        return this.get('savedWidth');
      }
    }).property('savedWidth'),
    minWidthValue: Ember.computed(function(key, value) {
      if (arguments.length === 1) {
        return this.get('minWidth');
      } else {
        this.set('minWidth', parseInt(value));
        return this.get('minWidth');
      }
    }).property('minWidth'),
    atMinWidth: Ember.computed(function() {
      return this.get('width') === this.get('minWidth');
    }).property('width', 'minWidth'),
    atMaxWidth: Ember.computed(function() {
      return this.get('width') === this.get('maxWidth');
    }).property('width', 'maxWidth'),
    maxWidth: void 0,
    maxWidthValue: Ember.computed(function(key, value) {
      if (arguments.length === 1) {
        return this.get('maxWidth');
      } else {
        this.set('maxWidth', parseInt(value));
        return this.get('maxWidth');
      }
    }).property('maxWidth'),
    columnDefinitionDocumentation: Ember.computed(function() {
      var docString;
      docString = '';
      docString += '    ' + this.get('headerCellName').toLowerCase() + 'Column = Ember.Table.ColumnDefinition.create\n';
      if (this.get('textAlign') !== 'text-align-right') {
        docString += "      textAlign: '" + this.get('textAlign') + "'\n";
      }
      docString += "      headerCellName: '" + this.get('headerCellName') + "'\n";
      if (this.get('minWidth') !== 25) {
        docString += '      minWidth: ' + this.get('minWidth') + '\n';
      }
      if (this.get('maxWidth')) {
        docString += '      maxWidth: ' + this.get('maxWidth') + '\n';
      }
      if (!this.get('isSortable')) {
        docString += '      isSortable: no\n';
      }
      if (!this.get('isResizable')) {
        docString += '      isResizable: no\n';
      }
      if (this.get('canAutoResize')) {
        docString += '      canAutoResize: yes\n';
      }
      if (this.get('headerCellName') === 'Date') {
        docString += "      getCellContent: (row) -> row.get('date').toDateString()";
      } else {
        docString += "      getCellContent: (row) -> row.get('" + this.get('headerCellName').toLowerCase() + "').toFixed(2)";
      }
      return docString;
    }).property('headerCellName', 'textAlign', 'minWidth', 'maxWidth', 'isSortable', 'isResizable', 'canAutoResize')
  });

  App.ConfigurableTableComponent = Ember.Table.EmberTableComponent.extend({
    parentWidthObserver: Ember.observer(function() {
      return this.onResizeEnd();
    }, 'parentWidth')
  });

}).call(this);


})();
(function() {

(function() {

  App.CodePrettyPrintMixin = Ember.Mixin.create({
    didInsertElement: function() {
      this._super();
      return Ember.run.next(this, function() {
        return prettyPrint();
      });
    }
  });

  App.LargeHeroAffixMixin = Ember.Mixin.create({
    didInsertElement: function() {
      this._super();
      $('.sub-navigation-sidebar').affix({
        offset: {
          top: 500,
          bottom: 450
        }
      });
      return $('.sub-navigation-sidebar').data('bs.affix').options.offset.top = 500;
    }
  });

  App.SmallHeroAffixMixin = Ember.Mixin.create({
    didInsertElement: function() {
      this._super();
      $('.sub-navigation-sidebar').affix({
        offset: {
          top: 150,
          bottom: 450
        }
      });
      return $('.sub-navigation-sidebar').data('bs.affix').options.offset.top = 150;
    }
  });

  App.ResizableDemoMixin = Ember.Mixin.create({
    didInsertElement: function() {
      this._super();
      return this.$('.js-resizable-container').resizable({
        handles: 'e',
        minWidth: 100,
        alsoResize: 'ember-table-fixed-wrapper',
        resize: jQuery.proxy(this.onTableContainerResize, this),
        stop: jQuery.proxy(this.onTableContainerResize, this)
      });
    },
    willDestroyElement: function() {
      this._super();
      return this.$('.js-resizable-container').resizable('destroy');
    },
    onTableContainerResize: function(event, ui) {
      return this.get('controller').updateDemoTableWidth(ui.size.width);
    }
  });

}).call(this);


})();
(function() {

(function() {

  App.EmberTableOverviewView = Ember.View.extend(App.LargeHeroAffixMixin);

  App.EmberTableDocumentationView = Ember.View.extend(App.SmallHeroAffixMixin);

  App.EmberTableAjaxView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin);

  App.EmberTableBarsView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin);

  App.EmberTableDynamicBarsView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin);

  App.EmberTableEditableView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin);

  App.EmberTableFinancialView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin);

  App.EmberTableConfigurableColumnsView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin, App.ResizableDemoMixin);

  App.EmberTableHorizonView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin);

  App.EmberTableSimpleView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin);

  App.EmberTableSparklineView = Ember.View.extend(App.CodePrettyPrintMixin, App.SmallHeroAffixMixin);

}).call(this);


})();
(function() {

(function() {

  App.EmberTableAjaxImageTableCell = Ember.Table.TableCell.extend({
    templateName: 'ember_table/ajax_table/ajax_cell',
    classNames: 'img-table-cell'
  });

}).call(this);


})();
(function() {

(function() {

  App.BarTableCell = Ember.Table.TableCell.extend({
    templateName: 'ember_table/bar_table/bar',
    classNameBindings: ['column.color'],
    barWidth: Ember.computed(function() {
      var column, row, _ref;
      _ref = this.getProperties('column', 'row'), column = _ref.column, row = _ref.row;
      if (!(column && row)) {
        return 0;
      }
      return Math.round(+this.get('cellContent'));
    }).property('column', 'row', 'cellContent'),
    histogramStyle: Ember.computed(function() {
      return "width: " + (this.get('barWidth')) + "%;";
    }).property('barWidth')
  });

}).call(this);


})();
(function() {

(function() {

  App.FinancialTableCell = Ember.Table.TableCell.extend({
    templateName: 'ember_table/financial_table/financial_table_cell'
  });

  App.FinancialTableHeaderCell = Ember.Table.HeaderCell.extend({
    templateName: 'ember_table/financial_table/financial_table_header_cell'
  });

  App.FinancialTableTreeCell = Ember.Table.TableCell.extend({
    templateName: 'ember_table/financial_table/financial_table_tree_cell',
    classNames: 'ember-table-table-tree-cell',
    paddingStyle: Ember.computed(function() {
      return "padding-left:" + (this.get('row.indentation')) + "px;";
    }).property('row.indentation')
  });

  App.FinancialTableHeaderTreeCell = Ember.Table.HeaderCell.extend({
    templateName: 'ember_table/financial_table/financial_table_header_tree_cell',
    classNames: 'ember-table-table-header-tree-cell'
  });

}).call(this);


})();
(function() {

(function() {

  App.TreeTableExample.TreeTableRow = Ember.Table.Row.extend({
    content: null,
    children: null,
    parent: null,
    isRoot: false,
    isLeaf: false,
    isCollapsed: false,
    isShowing: true,
    indentationSpacing: 20,
    groupName: null,
    computeStyles: function(parent) {
      var groupingLevel, indentType, indentation, isShowing, pGroupingLevel, spacing;
      groupingLevel = 0;
      indentation = 0;
      isShowing = true;
      if (parent) {
        isShowing = parent.get('isShowing') && !parent.get('isCollapsed');
        pGroupingLevel = parent.get('groupingLevel');
        groupingLevel = pGroupingLevel;
        if (parent.get('groupName') !== this.get('groupName')) {
          groupingLevel += 1;
        }
        indentType = groupingLevel === pGroupingLevel ? 'half' : 'full';
        spacing = this.get('indentationSpacing');
        if (!parent.get('isRoot')) {
          indentation = parent.get('indentation');
          indentation += (indentType === 'half' ? spacing / 2 : spacing);
        }
      }
      this.set('groupingLevel', groupingLevel);
      this.set('indentation', indentation);
      return this.set('isShowing', isShowing);
    },
    computeRowStyle: function(maxLevels) {
      var level;
      level = this.getFormattingLevel(this.get('groupingLevel'), maxLevels);
      return this.set('rowStyle', "row-style-" + level);
    },
    recursiveCollapse: function(isCollapsed) {
      this.set('isCollapsed', isCollapsed);
      return this.get('children').forEach(function(child) {
        return child.recursiveCollapse(isCollapsed);
      });
    },
    getFormattingLevel: function(level, maxLevels) {
      switch (maxLevels) {
        case 1:
          return 5;
        case 2:
          if (level === 1) {
            return 2;
          }
          return 5;
        case 3:
          if (level === 1) {
            return 1;
          }
          if (level === 2) {
            return 3;
          }
          return 5;
        case 4:
          if (level === 1) {
            return 1;
          }
          if (level === 2) {
            return 2;
          }
          if (level === 4) {
            return 4;
          }
          return 5;
        case 5:
          return level;
        default:
          if (level === maxLevels) {
            return 5;
          }
          return Math.min(level, 4);
      }
    }
  });

  App.TreeTableExample.TreeCell = Ember.Table.TableCell.extend({
    templateName: 'ember_table/tree_table/table_tree_cell',
    classNames: 'ember-table-table-tree-cell',
    styleBindings: ['indentation:padding-left'],
    indentation: Ember.computed.alias('row.indentation')
  });

  App.TreeTableExample.HeaderTreeCell = Ember.Table.HeaderCell.extend({
    templateName: 'ember_table/tree_table/table_header_tree_cell',
    classNames: 'ember-table-table-header-tree-cell'
  });

}).call(this);


})();
(function() {

(function() {

  App.EditableTableCell = Ember.Table.TableCell.extend({
    className: 'editable-table-cell',
    templateName: 'ember_table/editable_table/editable_table_cell',
    isEditing: false,
    type: 'text',
    innerTextField: Ember.TextField.extend({
      typeBinding: 'parentView.type',
      valueBinding: 'parentView.cellContent',
      didInsertElement: function() {
        return this.$().focus();
      },
      focusOut: function(event) {
        return this.set('parentView.isEditing', false);
      }
    }),
    onRowContentDidChange: Ember.observer(function() {
      return this.set('isEditing', false);
    }, 'rowContent'),
    click: function(event) {
      this.set('isEditing', true);
      return event.stopPropagation();
    }
  });

  App.DatePickerTableCell = App.EditableTableCell.extend({
    type: 'date'
  });

  App.RatingTableCell = Ember.Table.TableCell.extend({
    classNames: 'rating-table-cell',
    templateName: 'ember_table/editable_table/rating_table_cell',
    onRowContentDidChange: Ember.observer(function() {
      return this.applyRating(this.get('cellContent'));
    }, 'cellContent'),
    didInsertElement: function() {
      this._super();
      return this.onRowContentDidChange();
    },
    applyRating: function(rating) {
      var span;
      this.$('.rating span').removeClass('active');
      span = this.$('.rating span').get(rating);
      return $(span).addClass('active');
    },
    click: function(event) {
      var rating;
      rating = this.$('.rating span').index(event.target);
      if (rating === -1) {
        return;
      }
      this.get('column').setCellContent(this.get('row'), rating);
      return this.applyRating(rating);
    }
  });

}).call(this);


})();
(function() {

(function() {

  App.SparkLineTableCellView = Ember.Table.TableCell.extend({
    template: Ember.Handlebars.compile(""),
    heightBinding: 'controller.rowHeight',
    onContentOrSizeDidChange: Ember.observer(function() {
      this.$('svg').remove();
      return this.renderD3View();
    }, 'row', 'width'),
    didInsertElement: function() {
      return this.renderD3View();
    },
    renderD3View: function() {
      var data, fill, g, h, len, line, max, min, p, svg, w, xscale, yscale;
      data = this.get('row.timeseries');
      if (!data) {
        return;
      }
      h = this.get('height');
      w = this.get('width');
      p = 2;
      min = Math.min.apply(null, data);
      max = Math.max.apply(null, data);
      len = data.length;
      fill = d3.scale.category10();
      xscale = d3.scale.linear().domain([0, len]).range([p, w - p]);
      yscale = d3.scale.linear().domain([min, max]).range([h - p, p]);
      line = d3.svg.line().x(function(d, i) {
        return xscale(i);
      }).y(function(d) {
        return yscale(d);
      });
      svg = d3.select("#" + (this.get('elementId'))).append('svg:svg').attr('height', h).attr('width', w);
      g = svg.append('svg:g');
      return g.append('svg:path').attr('d', line(data)).attr('stroke', function(d) {
        return fill(Math.round(Math.random()) * 10);
      }).attr('fill', 'none');
    }
  });

}).call(this);


})();
(function() {

(function() {

  App.HorizonTableCellView = Ember.Table.TableCell.extend({
    template: Ember.Handlebars.compile(""),
    heightBinding: 'controller.rowHeight',
    horizonContent: Ember.computed(function() {
      var normal, _i, _results;
      normal = d3.random.normal(1.5, 3);
      return (function() {
        _results = [];
        for (_i = 0; _i < 100; _i++){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(i) {
        return [i, normal()];
      });
    }).property(),
    onWidthDidChange: Ember.observer(function() {
      this.$('svg').remove();
      return this.renderD3View();
    }, 'width'),
    didInsertElement: function() {
      return this.onWidthDidChange();
    },
    renderD3View: function() {
      var chart, data, height, svg, width;
      width = this.get('width');
      height = this.get('height');
      data = this.get('horizonContent');
      chart = d3.horizon().width(width).height(height).bands(2).mode("mirror").interpolate("basis");
      svg = d3.select('#' + this.get('elementId')).append("svg").attr("width", width).attr("height", height);
      return svg.data([data]).call(chart);
    }
  });

}).call(this);


})();
(function() {

(function() {

  App.Router.map(function() {
    this.route('license');
    return this.resource('emberTable', {
      path: '/ember-table'
    }, function() {
      this.route('overview');
      this.route('documentation');
      this.route('migration-guides');
      this.route('simple');
      this.route('ajax');
      this.route('bars');
      this.route('dynamic-bars');
      this.route('financial');
      this.route('editable');
      this.route('sparkline');
      this.route('horizon');
      this.route('configurable-columns');
      return this.route('community-examples');
    });
  });

  App.IndexRoute = Ember.Route.extend({
    redirect: function() {
      return this.transitionTo('emberTable.overview');
    }
  });

  App.EmberTableIndexRoute = Ember.Route.extend({
    redirect: function() {
      return this.transitionTo('emberTable.overview');
    }
  });

  App.EmberTableOverviewRoute = Ember.Route.extend({
    activate: function() {
      var controller;
      controller = this.controllerFor('emberTable');
      return controller.set('showLargeHero', true);
    },
    deactivate: function() {
      var controller;
      controller = this.controllerFor('emberTable');
      return controller.set('showLargeHero', false);
    }
  });

}).call(this);


})();
(function() {

(function() {



}).call(this);


})();
(function() {

Ember.TEMPLATES["_footer"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("Overview &amp; Getting Started");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("API &amp; Documentation");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("Migration Guides");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("Community Examples");
  }

function program9(depth0,data) {
  
  
  data.buffer.push("Hello World table");
  }

function program11(depth0,data) {
  
  
  data.buffer.push("AJAX cells");
  }

function program13(depth0,data) {
  
  
  data.buffer.push("Bar cells");
  }

function program15(depth0,data) {
  
  
  data.buffer.push("Dynamic bar cells");
  }

function program17(depth0,data) {
  
  
  data.buffer.push("Tree &amp; financial table");
  }

function program19(depth0,data) {
  
  
  data.buffer.push("Editable cells");
  }

function program21(depth0,data) {
  
  
  data.buffer.push("Sparkline cells");
  }

function program23(depth0,data) {
  
  
  data.buffer.push("Horizon cells");
  }

function program25(depth0,data) {
  
  
  data.buffer.push("Configurable columns");
  }

function program27(depth0,data) {
  
  
  data.buffer.push("License");
  }

  data.buffer.push("\n<div class=\"footer\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Ember Table</h6></li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.overview", options) : helperMissing.call(depth0, "link-to", "emberTable.overview", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.documentation", options) : helperMissing.call(depth0, "link-to", "emberTable.documentation", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.migration-guides", options) : helperMissing.call(depth0, "link-to", "emberTable.migration-guides", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.community-examples", options) : helperMissing.call(depth0, "link-to", "emberTable.community-examples", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Examples</h6></li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.simple", options) : helperMissing.call(depth0, "link-to", "emberTable.simple", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.ajax", options) : helperMissing.call(depth0, "link-to", "emberTable.ajax", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.bars", options) : helperMissing.call(depth0, "link-to", "emberTable.bars", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.dynamic-bars", options) : helperMissing.call(depth0, "link-to", "emberTable.dynamic-bars", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.financial", options) : helperMissing.call(depth0, "link-to", "emberTable.financial", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.editable", options) : helperMissing.call(depth0, "link-to", "emberTable.editable", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(21, program21, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.sparkline", options) : helperMissing.call(depth0, "link-to", "emberTable.sparkline", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.horizon", options) : helperMissing.call(depth0, "link-to", "emberTable.horizon", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(25, program25, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.configurable-columns", options) : helperMissing.call(depth0, "link-to", "emberTable.configurable-columns", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>Addepar Open Source</h6></li>\n          <li><a target=\"_BLANK\" href=\"http://addepar.github.io/\">Home</a></li>\n          <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(27, program27, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "license", options) : helperMissing.call(depth0, "link-to", "license", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        </ul>\n      </div>\n      <div class=\"col-md-3\">\n        <ul class=\"list-unstyled\">\n          <li><h6>About Addepar</h6></li>\n          <li><a target=\"_BLANK\" href=\"http://www.addepar.com\">www.addepar.com</a></li>\n          <li>\n            <address>\n              <br>\n              <a target=\"_BLANK\" href=\"http://goo.gl/maps/446ui\"><strong>Addepar HQ</strong><br>\n              1215 Terra Bella Ave<br>\n              Mountain View, CA 94043</a><br><br>\n\n              <a target=\"_BLANK\" href=\"http://goo.gl/maps/xEiCM\"><strong>Addepar NY</strong><br>\n              335 Madison Ave Suite 880<br>\n              New York, NY 10017</a><br>\n            </address>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-md-12 center-align\">\n        <p>&copy; 2013 Addepar, Inc.</p>\n      </div>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["_navigation"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("\n<nav class=\"navbar navbar-transparent addepar-navbar\" role=\"navigation\">\n  <div class=\"navbar-header\">\n    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-ex1-collapse\">\n      <span class=\"sr-only\">Toggle navigation</span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n    </button>\n    <a class=\"navbar-brand\" href=\"http://addepar.github.io/\">\n      <img id=\"logo_dark\" class=\"logo\" src=\"img/addepar_logo_light.png\" /><span class=\"navbar-title\">Open Source</span>\n    </a>\n  </div>\n\n  <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n    <ul class=\"nav navbar-nav navbar-right\">\n      <li><a href=\"#\">Ember Table</a></li>\n      <li><a href=\"http://addepar.github.io/ember-charts\">Ember Charts</a></li>\n      <li><a href=\"http://addepar.github.io/ember-widgets\">Ember Widgets</a></li>\n    </ul>\n  </div><!-- /.navbar-collapse -->\n</nav>\n");
  return buffer;
  
});

Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "navigation", options) : helperMissing.call(depth0, "partial", "navigation", options))));
  data.buffer.push("\n\n");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "footer", options) : helperMissing.call(depth0, "partial", "footer", options))));
  return buffer;
  
});

Ember.TEMPLATES["ember_table"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n  \n  <div class=\"hero-container\">\n    <div class=\"hero table-hero\">\n      <div class=\"hero-overlay\"></div>\n    </div>\n    <div class=\"container hero-content-container\">\n      <div class=\"row\">\n        <div class=\"span12 hero-tagline center-align hidden-tablet\">\n          <h1 class=\"elevated\">Ember Table</h1>\n          <p class=\"elevated\">A fast, lazy rendered, easily extensible table built with Ember.js.<br><br><a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-table/releases\" class=\"addepar-btn addepar-btn-large addepar-btn-outline addepar-btn-white\">Download Ember-Table</a></p>\n        </div>\n      </div>\n    </div>\n  </div>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n  \n  <div class=\"hero-container small-hero-container\">\n    <div class=\"hero table-hero\">\n      <div class=\"hero-overlay\"></div>\n    </div>\n  </div>\n");
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, "showLargeHero", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n\n<div class=\"container\">\n  <div class=\"row\">\n\n    ");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "ember_table/sub_navigation", options) : helperMissing.call(depth0, "partial", "ember_table/sub_navigation", options))));
  data.buffer.push("\n\n    ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/_sub_navigation"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("Overview &amp; Getting Started");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("API &amp; Documentation");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("Migration Guides");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("Hello World table");
  }

function program9(depth0,data) {
  
  
  data.buffer.push("AJAX cells");
  }

function program11(depth0,data) {
  
  
  data.buffer.push("Bar cells");
  }

function program13(depth0,data) {
  
  
  data.buffer.push("Dynamic bar cells");
  }

function program15(depth0,data) {
  
  
  data.buffer.push("Tree &amp; financial table");
  }

function program17(depth0,data) {
  
  
  data.buffer.push("Editable cells");
  }

function program19(depth0,data) {
  
  
  data.buffer.push("Sparkline cells");
  }

function program21(depth0,data) {
  
  
  data.buffer.push("Horizon cells");
  }

function program23(depth0,data) {
  
  
  data.buffer.push("Configurable columns");
  }

function program25(depth0,data) {
  
  
  data.buffer.push("\n    <ul class=\"list-unstyled project-navigation\">\n      <li class=\"sub-title\">Community Examples</li>\n    </ul>\n  ");
  }

  data.buffer.push("\n<div class=\"col-md-2 sub-navigation-sidebar\">\n  <ul class=\"list-unstyled github-navigation\">\n    <li>\n      <a class=\"btn btn-default\" target=\"_BLANK\" href=\"https://github.com/addepar/ember-table\">\n        <i class=\"icon-github\"></i> View on GitHub\n      </a>\n    </li>\n    <li>\n      <iframe src=\"http://ghbtns.com/github-btn.html?user=addepar&amp;repo=ember-table&amp;type=watch&amp;count=true\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"0\" width=\"130\" height=\"30\"></iframe>\n    </li>\n  </ul>\n  <hr>\n  <ul class=\"list-unstyled project-navigation\">\n    <li class=\"sub-title\">Ember Table</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.overview", options) : helperMissing.call(depth0, "link-to", "emberTable.overview", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.documentation", options) : helperMissing.call(depth0, "link-to", "emberTable.documentation", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.migration-guides", options) : helperMissing.call(depth0, "link-to", "emberTable.migration-guides", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n  </ul>\n  <hr>\n  <ul class=\"list-unstyled project-navigation\">\n    <li class=\"sub-title\">Examples</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.simple", options) : helperMissing.call(depth0, "link-to", "emberTable.simple", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.ajax", options) : helperMissing.call(depth0, "link-to", "emberTable.ajax", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.bars", options) : helperMissing.call(depth0, "link-to", "emberTable.bars", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.dynamic-bars", options) : helperMissing.call(depth0, "link-to", "emberTable.dynamic-bars", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.financial", options) : helperMissing.call(depth0, "link-to", "emberTable.financial", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.editable", options) : helperMissing.call(depth0, "link-to", "emberTable.editable", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.sparkline", options) : helperMissing.call(depth0, "link-to", "emberTable.sparkline", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(21, program21, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.horizon", options) : helperMissing.call(depth0, "link-to", "emberTable.horizon", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li>");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.configurable-columns", options) : helperMissing.call(depth0, "link-to", "emberTable.configurable-columns", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n  </ul>\n  <hr>\n  ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(25, program25, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.community-examples", options) : helperMissing.call(depth0, "link-to", "emberTable.community-examples", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/ajax"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>Ajax Cells</small></h1>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container\">\n          ");
  data.buffer.push(escapeExpression((helper = helpers['table-component'] || (depth0 && depth0['table-component']),options={hash:{
    'hasHeader': (true),
    'hasFooter': (false),
    'numFixedColumns': (0),
    'numRows': (100),
    'rowHeight': (35),
    'columnsBinding': ("columns"),
    'contentBinding': ("content")
  },hashTypes:{'hasHeader': "BOOLEAN",'hasFooter': "BOOLEAN",'numFixedColumns': "INTEGER",'numRows': "INTEGER",'rowHeight': "INTEGER",'columnsBinding': "STRING",'contentBinding': "STRING"},hashContexts:{'hasHeader': depth0,'hasFooter': depth0,'numFixedColumns': depth0,'numRows': depth0,'rowHeight': depth0,'columnsBinding': depth0,'contentBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "table-component", options))));
  data.buffer.push("\n        </div>\n      </div>\n      <div class=\"example-description\">\n        <p class=\"reduced\">Ember-Table with ajax cells.</p>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n    hasHeader=true\n    hasFooter=false\n    numFixedColumns=0\n    numRows=100\n    rowHeight=35\n    columnsBinding=\"columns\"\n    contentBinding=\"content\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application_controller.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.EmberTableAjaxLazyDataSource = Ember.ArrayProxy.extend\n  createGithubEvent: (row, event) ->\n    row.set 'type',       event.type\n    row.set 'createdAt',  event.created_at\n    row.set 'login',      event.actor.login\n    row.set 'avatar',     event.actor.avatar_url\n    row.set 'isLoaded',   yes\n\n  requestGithubEvent: (page) ->\n    content = @get 'content'\n    start   = (page - 1) * 30\n    end     = start + 30\n    url = \"https://api.github.com/repos/emberjs/ember.js/events?page=#{page}&per_page=30&callback=?\"\n    Ember.$.getJSON url, (json) =>\n      json.data.forEach (event, index) =>\n        row = content[start + index]\n        @createGithubEvent row, event\n    [start...end].forEach (index) ->\n      content[index] = Ember.Object.create eventId: index, isLoaded: no\n\n  objectAt: (index) ->\n    content = @get 'content'\n    #if index is content.get('length') - 1\n    #  content.pushObjects(new Array(30))\n    row = content[index]\n    return row if row and not row.get('error')\n    @requestGithubEvent Math.floor(index / 30 + 1)\n    content[index]\n\nApp.ApplicationController = Ember.Controller.extend\n  numRows: 100\n\n  columns: Ember.computed ->\n    avatar = Ember.Table.ColumnDefinition.create\n      columnWidth: 80\n      headerCellName: 'avatar'\n      tableCellViewClass:  'App.EmberTableAjaxImageTableCell'\n      contentPath: 'avatar'\n    columnNames = ['login', 'type', 'createdAt']\n    columns = columnNames.map (key, index) ->\n      Ember.Table.ColumnDefinition.create\n        columnWidth: 150\n        headerCellName: key.w()\n        contentPath: key\n    columns.unshift avatar\n    columns\n\n  content: Ember.computed ->\n    App.EmberTableAjaxLazyDataSource.create\n      content: new Array(@get('numRows'))\n  .property 'numRows'\n</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/ajax_table/ajax_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n  <img width=\"30\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'src': ("view.cellContent")
  },hashTypes:{'src': "STRING"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n");
  return buffer;
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n  <img src=\"img/loading.gif\" style=\"padding: 8px;\">\n");
  }

  stack1 = helpers['if'].call(depth0, "view.row.isLoaded", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/bar_table/bar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"bar-cell\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'style': ("view.histogramStyle")
  },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/bars"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>D3 Chart Table Cells</small></h1>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container\">\n          ");
  data.buffer.push(escapeExpression((helper = helpers['table-component'] || (depth0 && depth0['table-component']),options={hash:{
    'hasHeader': (true),
    'hasFooter': (false),
    'rowHeight': (30),
    'columnsBinding': ("columns"),
    'contentBinding': ("content")
  },hashTypes:{'hasHeader': "BOOLEAN",'hasFooter': "BOOLEAN",'rowHeight': "INTEGER",'columnsBinding': "STRING",'contentBinding': "STRING"},hashContexts:{'hasHeader': depth0,'hasFooter': depth0,'rowHeight': depth0,'columnsBinding': depth0,'contentBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "table-component", options))));
  data.buffer.push("\n        </div>\n      </div>\n    </div>\n  </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n    hasHeader=true\n    hasFooter=false\n    rowHeight=30\n    columnsBinding=\"columns\"\n    contentBinding=\"content\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>bar_table_cell.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&lt;span class=&quot;bar-cell&quot; &#123;&#123;bind-attr style=&quot;view.histogramStyle&quot;&#125;&#125;&gt;&lt;/span&gt;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>bar_table_cell_view.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.BarTableCellView = Ember.Table.TableCell.extend\n  templateName:     'ember_table/bar_table/bar'\n  classNameBindings:['column.color']\n  barWidth: Ember.computed ->\n    {column, row} = @getProperties 'column', 'row'\n    return 0 unless column and row\n    Math.round(+@get('cellContent'))\n  .property 'column', 'row', 'cellContent'\n\n  histogramStyle: Ember.computed ->\n    \"width: #{@get('barWidth')}%;\"\n  .property 'barWidth'</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application_controller.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.ApplicationController = Ember.Controller.extend\n  numRows: 100\n\n  columns: Ember.computed ->\n    colors  = ['blue', 'teal', 'green', 'yellow', 'orange']\n    column1 = Ember.Table.ColumnDefinition.create\n      columnWidth:    50\n      headerCellName: 'Name'\n      contentPath: 'key'\n    columns = colors.map (color, index) ->\n      Ember.Table.ColumnDefinition.create\n        color: color\n        headerCellName: 'Bar'\n        tableCellViewClass: 'App.BarTableCell'\n        contentPath: \"value#{index + 1}\"\n    columns.unshift(column1)\n    columns\n\n  content: Ember.computed ->\n    [0...@get('numRows')].map (num, index) ->\n      key: index\n      value1: Math.random() * 80 + 10\n      value2: Math.random() * 80 + 10\n      value3: Math.random() * 80 + 10\n      value4: Math.random() * 80 + 10\n      value5: Math.random() * 80 + 10\n  .property 'numRows'\n</pre>\n      </div>\n    </div>\n\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/community-examples"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h1>Community Examples</h1>\n      <p class=\"elevated\">Many people have extended ember-table to add new features or customize the way the table works with their app. We hope this list of community-built examples helps to provide inspiration and share commonly used design patterns.<br><br>This is a new list, and we're looking for more examples to add.<br>If you're willing to share your work here, please <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-table/issues\">open a GitHub ticket!</a></p>\n      <div class=\"row ember-table-examples\">\n        <div class=\"col-md-4\">\n          <h4 class=\"byline\">Server-side Sorting</h4>\n          <p class=\"byline\">By <a target=\"_BLANK\" href=\"https://github.com/seriousben\">seriousben</a></p>\n          <a target=\"_BLANK\" href=\"http://jsbin.com/nefiwoco/15/edit\">\n            <img class=\"preview-box\" src=\"img/community_examples/preview_server_side_sorting.png\" />\n          </a>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/configurable-columns"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n              <tr>\n                <td>");
  stack1 = helpers._triageMustache.call(depth0, "headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                <td class=\"checkbox-cell\">");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'class': ("checkbox-input"),
    'type': ("checkbox"),
    'checked': ("isSortable")
  },hashTypes:{'class': "STRING",'type': "STRING",'checked': "ID"},hashContexts:{'class': depth0,'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("</td>\n                <td class=\"checkbox-cell\">");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'class': ("checkbox-input"),
    'type': ("checkbox"),
    'checked': ("isResizable")
  },hashTypes:{'class': "STRING",'type': "STRING",'checked': "ID"},hashContexts:{'class': depth0,'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("</td>\n                <td class=\"checkbox-cell\">");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'class': ("checkbox-input"),
    'type': ("checkbox"),
    'checked': ("canAutoResize")
  },hashTypes:{'class': "STRING",'type': "STRING",'checked': "ID"},hashContexts:{'class': depth0,'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("</td>\n                <td ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("atMinWidth:at-limit")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'value': ("minWidthValue"),
    'class': ("text-input"),
    'type': ("number"),
    'min': ("1")
  },hashTypes:{'value': "ID",'class': "STRING",'type': "STRING",'min': "STRING"},hashContexts:{'value': depth0,'class': depth0,'type': depth0,'min': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("</td>\n                <td ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': ("atMaxWidth:at-limit")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'value': ("maxWidthValue"),
    'class': ("text-input"),
    'type': ("number"),
    'min': ("1")
  },hashTypes:{'value': "ID",'class': "STRING",'type': "STRING",'min': "STRING"},hashContexts:{'value': depth0,'class': depth0,'type': depth0,'min': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("</td>\n                <td>");
  stack1 = helpers._triageMustache.call(depth0, "width", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n                <td>");
  stack1 = helpers._triageMustache.call(depth0, "savedWidth", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</td>\n              </tr>\n            ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n          <div class=\"ember-table-example-container-small\">\n            ");
  data.buffer.push(escapeExpression((helper = helpers['configurable-table'] || (depth0 && depth0['configurable-table']),options={hash:{
    'hasFooter': (false),
    'columnMode': ("columnMode"),
    'columns': ("columns"),
    'content': ("content"),
    'parentWidth': ("demoTableWidth")
  },hashTypes:{'hasFooter': "BOOLEAN",'columnMode': "ID",'columns': "ID",'content': "ID",'parentWidth': "ID"},hashContexts:{'hasFooter': depth0,'columnMode': depth0,'columns': depth0,'content': depth0,'parentWidth': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "configurable-table", options))));
  data.buffer.push("\n          </div>\n        ");
  return buffer;
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n  columnMode='fluid'");
  }

function program7(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n");
  stack1 = helpers._triageMustache.call(depth0, "columnDefinitionDocumentation", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    ");
  return buffer;
  }

  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>Configurable Column Demo</small></h1>\n\n  <p>Ember Table's column settings give you a lot of fine-grained control over\n  reordering and resizing behavior. Use this demo to play with the options and\n  find what works for your use!</p>\n\n  <p>You can drag the right border of the table container to see how the table\n  should respond to width changes. The refresh button is useful to see how the\n  table would be initialized given the settings you've selected.</p>\n\n  <p>When you're done configuring, check out the code below - it's updated live\n  with the settings you selected.</p>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"configuration-container\">\n        <div class=\"title-text\">Configure Demo</div>\n        <table class=\"table table-bordered table-condensed\">\n          <tbody>\n            <tr>\n              <th>Column</th>\n              <th class=\"checkbox-column\">Reorder</th>\n              <th class=\"checkbox-column\">Resize</th>\n              <th class=\"checkbox-column\">Auto-Resize</th>\n              <th class=\"width-column\">Min Width</th>\n              <th class=\"width-column\">Max Width</th>\n              <th class=\"width-column\">Actual Width</th>\n              <th class=\"width-column\">Saved Width</th>\n            </tr>\n            ");
  stack1 = helpers.each.call(depth0, "columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n          </tbody>\n        </table>\n        <div class=\"table-options-footer\">\n          <div class=\"fluid-mode-text\">Fluid Mode</div>\n          ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'class': ("checkbox-input"),
    'type': ("checkbox"),
    'checked': ("isFluid")
  },hashTypes:{'class': "STRING",'type': "STRING",'checked': "ID"},hashContexts:{'class': depth0,'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n          <button class=\"addepar-btn-primary refresh-btn\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "refreshTable", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Refresh Table</button>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container js-resizable-container\">\n        ");
  stack1 = helpers['if'].call(depth0, "showTable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n  hasFooter=false\n  columns=columns\n  content=content");
  stack1 = helpers['if'].call(depth0, "isFluid", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application_controller.coffee</h3>\n      <div class=\"highlight\">\n<pre>App.ApplicationController = Ember.Controller.extend\n  numRows: 100\n\n  columns: Ember.computed -> ");
  stack1 = helpers.each.call(depth0, "columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    [dateColumn, openColumn, highColumn, lowColumn, closeColumn]\n\n  content: Ember.computed ->\n    [0...@get('numRows')].map (index) ->\n      date = new Date()\n      date.setDate(date.getDate() + index)\n      date:  date\n      open:  Math.random() * 100 - 50\n      high:  Math.random() * 100 - 50\n      low:   Math.random() * 100 - 50\n      close: Math.random() * 100 - 50\n      volume: Math.random() * 1000000\n  .property 'numRows'</pre>\n      </div>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/documentation"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("configurable column\n          demo.");
  }

  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>API &amp; Documentation</h1>\n  <h2>Ember.Table.TableComponent Options</h2>\n\n  <table class=\"table ember-table-options\">\n    <tr>\n      <th style=\"min-width: 200px;\">Option</th>\n      <th style=\"min-width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>content <b>(required)</b></td>\n      <td>null</td>\n      <td>\n        <p>\n          An array of row objects. Usually a hash where the keys are column\n          names and the values are the rows's values. However, could be any\n          object, since each column can define a function to return the column\n          value given the row object. See\n          <code>Ember.Table.ColumnDefinition.getCellContent</code>.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>columns <b>(required)</b></td>\n      <td>null</td>\n      <td>\n        <p>\n          An array of column definitions: see\n          <code>Ember.Table.ColumnDefinition</code>.  Allows each column to\n          have its own configuration.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>numFixedColumns</td>\n      <td>0</td>\n      <td>\n        <p>\n          The number of fixed columns on the left side of the table. Fixed\n          columns are always visible, even when the table is scrolled\n          horizontally.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>numFooterRow</td>\n      <td>0</td>\n      <td>\n        <p>\n          The number of footer rows in the table. Footer rows appear at the\n          bottom of the table and are always visible.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>rowHeight</td>\n      <td>30</td>\n      <td>\n        <p>\n          The row height in pixels. A consistent row height is necessary to\n          calculate which rows are being shown, to enable lazy rendering.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>minHeaderHeight</td>\n      <td>30</td>\n      <td>\n        <p>\n          The minimum header height in pixels. Headers will grow in height if\n          given more content than they can display.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>footerHeight</td>\n      <td>30</td>\n      <td><p>The footer height in pixels.</p></td>\n    </tr>\n    <tr>\n      <td>hasHeader</td>\n      <td>true</td>\n      <td><p>Enables or disables the header block.</p></td>\n    </tr>\n    <tr>\n      <td>hasFooter</td>\n      <td>true</td>\n      <td><p>Enables or disables the footer block.</p></td>\n    </tr>\n    <tr>\n      <td>enableColumnReorder</td>\n      <td>true</td>\n      <td>\n        <p>\n          Allow the columns to be rearranged by drag-and-drop. Only columns\n          with <code>isSortable=true</code> (the default setting) will be\n          affected.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>enableContentSelection</td>\n      <td>false</td>\n      <td><p>Allow users to select the content of table cells.</p></td>\n    </tr>\n    <tr>\n      <td>styleBindings</td>\n      <td>'height'</td>\n      <td>\n        <p>\n          Values which are bound to the table's style attr. See\n          <code>Ember.StyleBindingsMixin</code> documentation for more details.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>columnMode</td>\n      <td>'standard'</td>\n      <td>\n        <p>\n          Sets which column resizing behavior to use. Possible values are\n          <code>'standard'</code> (resizing a column pushes or pulls all other\n          columns) and <code>'fluid'</code> (resizing a column steals width\n          from neighboring columns). You can experiment with this behavior in\n          the ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.configurable-columns", options) : helperMissing.call(depth0, "link-to", "emberTable.configurable-columns", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>selectionMode</td>\n      <td>'single'</td>\n      <td>\n        <p>\n          Sets which row selection behavior to follow. Possible values are\n          <code>'none'</code> (clicking on a row does nothing),\n          <code>'single'</code> (clicking on a row selects it and deselects\n          other rows), and <code>'multiple'</code> (multiple rows can be\n          selected through ctrl/cmd-click or shift-click).\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>selection (output)</td>\n      <td>undefined</td>\n      <td>\n        <p>\n          The currently selected elements. If <code>selectionMode</code> is set\n          to <code>'none'</code>, <code>selection</code> is null. If\n          <code>selectionMode</code> is set to <code>'single'</code>,\n          <code>selection</code> is the selected element. If\n          <code>selectionMode</code> is set to <code>'multiple'</code>,\n          <code>selection</code> is an array of the selected elements.\n        </p>\n      </td>\n    </tr>\n  </table>\n\n  <h2>Ember.Table.ColumnDefinition Options</h2>\n  <table class=\"table ember-table-options\">\n    <tr>\n      <th style=\"min-width: 200px;\">Option</th>\n      <th style=\"min-width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>headerCellName</td>\n      <td>undefined</td>\n      <td><p>Name of the column, to be displayed in the header.</p></td>\n    </tr>\n    <tr>\n      <td>contentPath</td>\n      <td>undefined</td>\n      <td>\n        <p>\n          Path of the content for this cell. If the row object is a hash of\n          keys and values to specify data for each column,\n          <code>contentPath</code> corresponds to the key. Use either this or\n          <code>getCellContent</code>.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>minWidth</td>\n      <td>25</td>\n      <td>\n        <p>\n          Minimum column width in pixels. Affects both manual resizing and\n          automatic resizing.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>maxWidth</td>\n      <td>undefined</td>\n      <td>\n        <p>\n          Maximum column width in pixels. Affects both manual resizing and\n          automatic resizing.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>savedWidth</td>\n      <td>150</td>\n      <td>\n        <p>\n          The initial column width in pixels. Updated whenever the column (not\n          window) is resized. Can be persisted.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>isResizable</td>\n      <td>true</td>\n      <td><p>Whether the column can be manually resized.</p></td>\n    </tr>\n    <tr>\n      <td>isSortable</td>\n      <td>true</td>\n      <td>\n        <p>\n          Whether the column can be rearranged with other columns. Only matters\n          if the table's <code>enableColumnReorder</code> property is set to\n          true (the default).\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>textAlign</td>\n      <td>'text-align-right'</td>\n      <td>\n        <p>\n          Alignment of the text in the cell. Possible values are\n          <code>'left'</code>, <code>'center'</code>, and <code>'right'</code>.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>canAutoResize</td>\n      <td>false</td>\n      <td>\n        <p>\n          Whether the column can automatically resize to fill space in the\n          table.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>headerCellView</td>\n      <td>'Ember.Table.HeaderCell'</td>\n      <td>\n        <p>\n          Override to use a custom view for the header cell. Specified as a\n          string.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>tableCellView</td>\n      <td>'Ember.Table.TableCell'</td>\n      <td>\n        <p>\n          Override to use a custom view for table cells. Specified as a string.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>getCellContent</td>\n      <td>(function)</td>\n      <td>\n        <p>\n          Override to customize how the column gets data from each row object.\n          Given a row, should return a formatted cell value, e.g. $20,000,000.\n          Use either this or <code>contentPath</code>.\n        </p>\n      </td>\n    </tr>\n    <tr>\n      <td>setCellContent</td>\n      <td>Ember.K</td>\n      <td>\n        <p>\n          Override to maintain a consistent path to update cell values.\n          Recommended to make this a function which takes (row, value) and\n          updates the row value.\n        </p>\n      </td>\n    </tr>\n  </table>\n\n  <h2>Ember.Table.TableCell Options</h2>\n  <table class=\"table ember-table-options\">\n    <tr>\n      <th style=\"min-width: 200px;\">Option</th>\n      <th style=\"min-width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>templateName</td>\n      <td>'table-cell'</td>\n      <td><p>The name of the template to be rendered into the cell.\n        Used for rendering custom templates.</p></td>\n    </tr>\n    <tr>\n      <td>classNames</td>\n      <td>['ember-table-cell']</td>\n      <td><p>The class names applied to the cell. Override to give\n        the cell custom styling (border, background color, etc).</p></td>\n    </tr>\n    <tr>\n      <td>classNameBindings</td>\n      <td>'column.textAlign'</td>\n      <td><p>A binding used to dynamically associate class names\n        with this table cell. E.g. you can bind to a column property\n        to have cell colors or styles vary across columns.</p></td>\n    </tr>\n    <tr>\n      <td>styleBindings</td>\n      <td>'width'</td>\n      <td>\n        <p>\n          Values which are bound to the cell's style attr. See\n          <code>Ember.StyleBindingsMixin</code> documentation for more details.\n        </p>\n      </td>\n    </tr>\n  </table>\n\n  <h2>Ember.Table.HeaderCell Options</h2>\n  <table class=\"table ember-table-options\">\n    <tr>\n      <th style=\"min-width: 200px;\">Option</th>\n      <th style=\"min-width: 150px;\">Default</th>\n      <th>Description</th>\n    </tr>\n    <tr>\n      <td>templateName</td>\n      <td>'header-cell'</td>\n      <td><p>See description in <code>Ember.Table.TableCell</code>.</p></td>\n    </tr>\n    <tr>\n      <td>classNames</td>\n      <td>['ember-table-cell', 'ember-table-header-cell']</td>\n      <td><p>See description in <code>Ember.Table.TableCell</code>.</p></td>\n    </tr>\n    <tr>\n      <td>classNameBindings</td>\n      <td>['column.isSortable:sortable', 'column.textAlign']</td>\n      <td><p>See description in <code>Ember.Table.TableCell</code>.</p></td>\n    </tr>\n    <tr>\n      <td>styleBindings</td>\n      <td>['width', 'height']</td>\n      <td><p>See description in <code>Ember.Table.TableCell</code>.</p></td>\n    </tr>\n  </table>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/dynamic-bars"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>Dynamic Bar</small></h1>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container\">\n          ");
  data.buffer.push(escapeExpression((helper = helpers['table-component'] || (depth0 && depth0['table-component']),options={hash:{
    'hasHeader': (true),
    'hasFooter': (false),
    'rowHeight': (30),
    'columnsBinding': ("columns"),
    'contentBinding': ("content")
  },hashTypes:{'hasHeader': "BOOLEAN",'hasFooter': "BOOLEAN",'rowHeight': "INTEGER",'columnsBinding': "STRING",'contentBinding': "STRING"},hashContexts:{'hasHeader': depth0,'hasFooter': depth0,'rowHeight': depth0,'columnsBinding': depth0,'contentBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "table-component", options))));
  data.buffer.push("\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n  hasFooter=false\n  columnsBinding=\"columns\"\n  contentBinding=\"content\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>bar_table_cell.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&lt;span class=&quot;bar-cell&quot; &#123;&#123;bind-attr style=&quot;view.histogramStyle&quot;&#125;&#125;&gt;&lt;/span&gt;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>bar_table_cell_view.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.BarTableCellView = Ember.Table.TableCell.extend\n  templateName:     'ember_table/bar_table/bar'\n  classNameBindings:['column.color']\n  barWidth: Ember.computed ->\n    {column, row} = @getProperties 'column', 'row'\n    return 0 unless column and row\n    Math.round(+@get('cellContent'))\n  .property 'column', 'row', 'cellContent'\n\n  histogramStyle: Ember.computed ->\n    \"width: #{@get('barWidth')}%;\"\n  .property 'barWidth'</pre>\n      </div>\n    </div>\n\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application_controller.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.ApplicationController = Ember.Controller.extend\n  numRows: 100\n\n  getNextValue: (current) ->\n    current = current + (Math.random() * 10 - 5)\n    current = Math.min(100, current)\n    current = Math.max(0, current)\n    current\n\n  init: ->\n    setInterval =>\n      @get('content').forEach (item) =>\n        item.set 'value1', @getNextValue(item.get('value1'))\n        item.set 'value2', @getNextValue(item.get('value2'))\n        item.set 'value3', @getNextValue(item.get('value3'))\n        item.set 'value4', @getNextValue(item.get('value4'))\n        item.set 'value5', @getNextValue(item.get('value5'))\n    , 1500\n\n  columns: Ember.computed ->\n    colors  = ['blue', 'teal', 'green', 'yellow', 'orange']\n    column1 = Ember.Table.ColumnDefinition.create\n      columnWidth:    50\n      headerCellName: 'Name'\n      contentPath: 'key'\n    columns = colors.map (color, index) ->\n      Ember.Table.ColumnDefinition.create\n        color: color\n        headerCellName: 'Bar'\n        tableCellViewClass: 'App.BarTableCell'\n        contentPath: \"value#{index + 1}\"\n    columns.unshift(column1)\n    columns\n\n  content: Ember.computed ->\n    [0...@get('numRows')].map (num, index) ->\n      Ember.Object.create\n        key: index\n        value1: Math.random() * 80 + 10\n        value2: Math.random() * 80 + 10\n        value3: Math.random() * 80 + 10\n        value4: Math.random() * 80 + 10\n        value5: Math.random() * 80 + 10\n  .property 'numRows'</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/editable"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>Editable</small></h1>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container\">\n          ");
  data.buffer.push(escapeExpression((helper = helpers['table-component'] || (depth0 && depth0['table-component']),options={hash:{
    'hasHeader': (true),
    'hasFooter': (false),
    'numFixedColumns': (0),
    'rowHeight': (30),
    'columnsBinding': ("columns"),
    'contentBinding': ("content")
  },hashTypes:{'hasHeader': "BOOLEAN",'hasFooter': "BOOLEAN",'numFixedColumns': "INTEGER",'rowHeight': "INTEGER",'columnsBinding': "STRING",'contentBinding': "STRING"},hashContexts:{'hasHeader': depth0,'hasFooter': depth0,'numFixedColumns': depth0,'rowHeight': depth0,'columnsBinding': depth0,'contentBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "table-component", options))));
  data.buffer.push("\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n  hasHeader=true\n  hasFooter=false\n  numFixedColumns=0\n  rowHeight=35\n  columnsBinding=\"columns\"\n  contentBinding=\"content\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>editable_table_cell.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&lt;span class=&quot;ember-table-content&quot;&gt;<br/>  &#123;&#123;#if view.isEditing&#125;&#125;<br/>    &#123;&#123;view view.innerTextField&#125;&#125;<br/>  &#123;&#123;else&#125;&#125;<br/>    &lt;span class='content'&gt;&#123;&#123;view.cellContent&#125;&#125;&lt;/span&gt;<br/>  &#123;&#123;/if&#125;&#125;<br/>&lt;/span&gt;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>rating_table_cell.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&lt;div class=&quot;rating&quot;&gt;<br/>  &lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;span&gt;&lt;/span&gt;<br/>&lt;/div&gt;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>editable_table_cell_views.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.EditableTableCell = Ember.Table.TableCell.extend\n  className: 'editable-table-cell'\n  templateName: 'ember_table/editable_table/editable_table_cell'\n  isEditing:  no\n  type:       'text'\n\n  innerTextField: Ember.TextField.extend\n    typeBinding:  'parentView.type'\n    valueBinding: 'parentView.cellContent'\n    didInsertElement: -> @$().focus()\n    focusOut: (event) -> @set 'parentView.isEditing', no\n\n  onRowContentDidChange: Ember.observer ->\n    @set 'isEditing', no\n  , 'rowContent'\n\n  click: (event) ->\n    @set 'isEditing', yes\n    event.stopPropagation()\n\nApp.DatePickerTableCell = App.EditableTableCell.extend\n  type: 'date'\n\nApp.RatingTableCell = Ember.Table.TableCell.extend\n  classNames: 'rating-table-cell'\n  templateName: 'ember_table/editable_table/rating_table_cell'\n\n  onRowContentDidChange: Ember.observer ->\n    @applyRating @get('cellContent')\n  , 'cellContent'\n\n  didInsertElement: ->\n    @_super()\n    @onRowContentDidChange()\n\n  applyRating: (rating) ->\n    @$('.rating span').removeClass('active')\n    span   = @$('.rating span').get(rating)\n    $(span).addClass('active')\n\n  click: (event) ->\n    rating = @$('.rating span').index(event.target)\n    return if rating is -1\n    @get('column').setCellContent(@get('rowContent'), rating)\n    @applyRating(rating)\n</pre>\n      </div>\n    </div>\n\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application_controller.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.EmberTableEditableController = Ember.Controller.extend\n  numRows: 100\n  columns: Ember.computed ->\n    columnNames = ['open', 'close']\n    dateColumn = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Date'\n      tableCellViewClass: 'App.DatePickerTableCell'\n      getCellContent: (row) -> row['date'].toString('yyyy-MM-dd')\n      setCellContent: (row, value) -> row['date'] = value\n    ratingColumn = Ember.Table.ColumnDefinition.create\n      columnWidth: 150\n      headerCellName: 'Analyst Rating'\n      tableCellViewClass: 'App.RatingTableCell'\n      contentPath: 'rating'\n      setCellContent: (row, value) -> row['rating'] = value\n    columns= columnNames.map (key, index) ->\n      name = key.charAt(0).toUpperCase() + key.slice(1)\n      Ember.Table.ColumnDefinition.create\n        columnWidth: 100\n        headerCellName: name\n        tableCellViewClass: 'App.EditableTableCell'\n        getCellContent: (row) -> row[key].toFixed(2)\n        setCellContent: (row, value) -> row[key] = +value\n    columns.unshift(ratingColumn)\n    columns.unshift(dateColumn)\n    columns\n  .property()\n\n  content: Ember.computed ->\n    [0...@get('numRows')].map (num, idx) ->\n      index: idx\n      date:  Date.now().add(days: idx)\n      open:  Math.random() * 100 - 50\n      close: Math.random() * 100 - 50\n      rating:Math.round(Math.random() * 4)\n  .property 'numRows'</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/editable_table/editable_table_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.innerTextField", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n  ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n    <span class='content'>");
  stack1 = helpers._triageMustache.call(depth0, "view.cellContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\n  ");
  return buffer;
  }

  data.buffer.push("<span class=\"ember-table-content\">\n  ");
  stack1 = helpers['if'].call(depth0, "view.isEditing", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/editable_table/rating_table_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<div class=\"rating\">\n  <span></span><span></span><span></span><span></span><span></span>\n</div>");
  
});

Ember.TEMPLATES["ember_table/financial"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>Financial Table</small></h1>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container ember-table-financial\">\n          ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.FinancialTableComponent", {hash:{
    'dataBinding': ("data")
  },hashTypes:{'dataBinding': "STRING"},hashContexts:{'dataBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n      </div>\n    </div>\n  </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n  hasHeader=true\n  hasFooter=false\n  numFixedColumns=0\n  rowHeight=35\n  columnsBinding=\"columns\"\n  contentBinding=\"content\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>financial_table_cell.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&lt;div class=&quot;ember-table-cell-container&quot;&gt;<br/>  &lt;span class=&quot;ember-table-content&quot;&gt;<br/>    &#123;&#123;view.cellContent&#125;&#125;<br/>  &lt;/span&gt;<br/>&lt;/div&gt;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>financial_table_tree_cell.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&lt;div class=&quot;ember-table-cell-container&quot; &#123;&#123;bind-attr style=&quot;view.paddingStyle&quot;&#125;&#125;&gt;<br/>  &lt;span &#123;&#123;bind-attr class=&quot;:ember-table-toggle-span view.row.isLeaf::ember-table-toggle<br/>    view.row.isCollapsed:ember-table-expand:ember-table-collapse&quot;&#125;&#125;<br/>    &#123;&#123;action toggleCollapse view.row&#125;&#125;&gt;<br/>    &lt;i class=&quot;icon-caret-down ember-table-toggle-icon&quot;&gt;&lt;/i&gt;<br/>  &lt;/span&gt;<br/>  &lt;span class=&quot;ember-table-content&quot;&gt;<br/>    &#123;&#123;view.cellContent&#125;&#125;<br/>  &lt;/span&gt;<br/>&lt;/div&gt;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>financial_table_header_cell.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&lt;div class=&quot;ember-table-cell-container&quot;&gt;<br/>  &lt;div class=&quot;ember-table-header-content-container&quot;&gt;<br/>    &lt;span class=&quot;ember-table-content&quot;&gt;<br/>      &#123;&#123;view.content.headerCellName&#125;&#125;<br/>    &lt;/span&gt;<br/>  &lt;/div&gt;<br/>&lt;/div&gt;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>financial_table_header_tree_cell.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&lt;div class=&quot;ember-table-cell-container&quot;&gt;<br/>  &lt;span &#123;&#123;bind-attr class=&quot;:ember-table-toggle-span :ember-table-toggle<br/>      isCollapsed:ember-table-expand:ember-table-collapse&quot;&#125;&#125;<br/>      &#123;&#123;action toggleTableCollapse&#125;&#125;&gt;<br/>    &lt;i class=&quot;icon-caret-down ember-table-toggle-icon&quot;&gt;&lt;/i&gt;<br/>  &lt;/span&gt;<br/>  &lt;div class=&quot;ember-table-header-content-container&quot;&gt;<br/>    &lt;span class=&quot;ember-table-content&quot;&gt;<br/>      &#123;&#123;view.column.headerCellName&#125;&#125;<br/>    &lt;/span&gt;<br/>  &lt;/div&gt;<br/>&lt;/div&gt;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>financial_table_cell_views.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.FinancialTableCell = Ember.Table.TableCell.extend\n  templateName: 'ember_table/financial_table/financial_table_cell'\n\nApp.FinancialTableHeaderCell = Ember.Table.HeaderCell.extend\n  templateName: 'ember_table/financial_table/financial_table_header_cell'\n\nApp.FinancialTableTreeCell = Ember.Table.TableCell.extend\n  templateName: 'ember_table/financial_table/financial_table_tree_cell'\n  classNames:   'ember-table-table-tree-cell'\n  paddingStyle: Ember.computed ->\n    \"padding-left:#{@get('row.indentation')}px;\"\n  .property 'row.indentation'\n\nApp.FinancialTableHeaderTreeCell = Ember.Table.HeaderCell.extend\n  templateName: 'ember_table/financial_table/financial_table_header_tree_cell'\n  classNames:   'ember-table-table-header-tree-cell'\n</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>financial_table_row.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.FinancialTableTreeTableRow = Ember.Table.Row.extend\n  content:  null\n  children: null\n  parent:   null\n  isRoot:   no\n  isLeaf:   no\n  isCollapsed: no\n  isShowing: yes\n  indentationSpacing: 20\n  groupName: null\n\n  # This may look ugly, but this is necessary. By doing the styles computation\n  # imperatively we made the initial table load 10-100x faster (certain cases)\n  computeStyles: (parent) ->\n    groupingLevel = 0\n    indentation   = 0\n    isShowing     = yes\n    if parent\n      isShowing = parent.get('isShowing') and not parent.get('isCollapsed')\n      pGroupingLevel = parent.get 'groupingLevel'\n      groupingLevel  = pGroupingLevel\n      groupingLevel  += 1 if parent.get('groupName') isnt @get('groupName')\n      indentType = if groupingLevel is pGroupingLevel then 'half' else 'full'\n      spacing    = @get 'indentationSpacing'\n      if not parent.get('isRoot')\n        indentation = parent.get('indentation')\n        indentation += (if indentType is 'half' then spacing / 2 else spacing)\n    @set 'groupingLevel', groupingLevel\n    @set 'indentation', indentation\n    @set 'isShowing', isShowing\n\n  computeRowStyle: (maxLevels) ->\n    level = @getFormattingLevel @get('groupingLevel'), maxLevels\n    @set 'rowStyle', \"ember-table-row-style-#{level}\"\n\n  recursiveCollapse: (isCollapsed) ->\n    @set 'isCollapsed', isCollapsed\n    @get('children').forEach (child) ->\n      child.recursiveCollapse isCollapsed\n\n  getFormattingLevel: (level, maxLevels) ->\n    switch maxLevels\n      when 1 then return 5\n      when 2\n        return 2 if level is 1\n        return 5\n      when 3\n        return 1 if level is 1\n        return 3 if level is 2\n        return 5\n      when 4\n        return 1 if level is 1\n        return 2 if level is 2\n        return 4 if level is 4\n        return 5\n      when 5\n        return level\n      else\n        return 5 if level is maxLevels\n        return Math.min(level, 4)</pre>\n      </div>\n    </div>\n\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>financial_table_component.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.FinancialTableComponent = Ember.Table.EmberTableComponent.extend\n  # overridding default properties\n  numFixedColumns: 1\n  isCollapsed: no\n  isHeaderHeightResizable: yes\n  rowHeight: 30\n  hasHeader: yes\n  hasFooter: yes\n  headerHeight: 70\n\n  # custom properties\n  sortAscending: no\n  sortColumn: null\n\n  actions:\n    toggleTableCollapse: (event) ->\n      @toggleProperty 'isCollapsed'\n      isCollapsed = @get 'isCollapsed'\n      children = @get('root.children')\n      return unless children and children.get('length') > 0\n      children.forEach (child) -> child.recursiveCollapse isCollapsed\n      @notifyPropertyChange 'rows'\n\n    toggleCollapse: (row) ->\n      row.toggleProperty 'isCollapsed'\n      Ember.run.next this, -> @notifyPropertyChange 'rows'\n\n  ##############################################################################\n  # Data Conversions\n  ##############################################################################\n  data: null\n\n  columns: Ember.computed ->\n    data = @get 'data'\n    return unless data\n    names = @get('data.value_factors').getEach('display_name')\n    columns = names.map (name, index) ->\n      Ember.Table.ColumnDefinition.create\n        index: index\n        headerCellName: name\n        headerCellViewClass:  'App.FinancialTableHeaderCell'\n        tableCellViewClass:   'App.FinancialTableCell'\n        getCellContent: (row) ->\n          object = row.values[@get('index')]\n          return object.value.toCurrency() if object.type is 'money'\n          return object.value.toPercent()  if object.type is 'percent'\n          \"-\"\n    columns.unshiftObject @get('groupingColumn')\n    columns\n  .property 'data.valueFactors.@each', 'groupingColumn'\n\n  groupingColumn: Ember.computed ->\n    groupingFactors = @get 'data.grouping_factors'\n    name = groupingFactors.getEach('display_name').join ' ▸ '\n    Ember.Table.ColumnDefinition.create\n      headerCellName: name\n      columnWidth: 400\n      isTreeColumn: yes\n      isSortable: no\n      textAlign: 'text-align-left'\n      headerCellViewClass:  'App.FinancialTableHeaderTreeCell'\n      tableCellViewClass:   'App.FinancialTableTreeCell'\n      contentPath: 'group_value'\n  .property 'data.grouping_factors.@each'\n\n  root: Ember.computed ->\n    data = @get 'data'\n    return unless data\n    @createTree(null, data.root)\n  .property 'data', 'sortAscending', 'sortColumn'\n\n  rows: Ember.computed ->\n    root = @get 'root'\n    return Ember.A() unless root\n    rows = @flattenTree null, root, Ember.A()\n    @computeStyles null, root\n    maxGroupingLevel = Math.max.apply rows.getEach('groupingLevel')\n    rows.forEach (row) -> row.computeRowStyle(maxGroupingLevel)\n    rows\n  .property 'root'\n\n  # OPTIMIZATION HACK\n  bodyContent: Ember.computed ->\n    rows = @get('rows')\n    return Ember.A() unless rows\n    rows = rows.slice(1, rows.get('length'))\n    rows.filterProperty('isShowing')\n  .property 'rows'\n\n  footerContent: Ember.computed ->\n    rows = @get('rows')\n    return Ember.A() unless rows\n    rows.slice(0, 1)\n  .property 'rows'\n\n  orderBy: (item1, item2) ->\n    sortColumn = @get 'sortColumn'\n    sortAscending = @get 'sortAscending'\n    return 1 unless sortColumn\n    value1 = sortColumn.getCellContent item1.get('content')\n    value2 = sortColumn.getCellContent item2.get('content')\n    result = Ember.compare value1, value2\n    if sortAscending then result else -result\n\n  createTree: (parent, node) ->\n    row = App.FinancialTableTreeTableRow.create()\n    children = (node.children || []).map (child) =>\n      @createTree row, child\n    # TODO(Peter): Hack... only collapse table if it should collapseByDefault\n    # and it is not the root. Currently the total row is the root, and if it\n    # is collapse, it causes nothing to show in the table and there is no way\n    # to get expand it.\n    row.setProperties\n      isRoot:     not parent\n      isLeaf:     Ember.isEmpty(children)\n      content:    node\n      parent:     parent\n      children:   children\n      groupName:  node.group_name\n      isCollapsed:no\n    row\n\n  flattenTree: (parent, node, rows) ->\n    rows.pushObject node\n    (node.children || []).forEach (child) =>\n      @flattenTree node, child, rows\n    rows\n\n  computeStyles: (parent, node) ->\n    node.computeStyles parent\n    node.get('children').forEach (child) =>\n      @computeStyles node, child</pre>\n      </div>\n    </div>\n\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/financial_table/financial_table_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<div class=\"ember-table-cell-container\">\n  <span class=\"ember-table-content\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.cellContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </span>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/financial_table/financial_table_header_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1;


  data.buffer.push("<div class=\"ember-table-cell-container\">\n  <div class=\"ember-table-header-content-container\">\n    <span class=\"ember-table-content\">\n      ");
  stack1 = helpers._triageMustache.call(depth0, "view.content.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </span>\n  </div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/financial_table/financial_table_header_tree_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"ember-table-cell-container\">\n  <span ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":ember-table-toggle-span :ember-table-toggle\n      isCollapsed:ember-table-expand:ember-table-collapse")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push("\n      ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleTableCollapse", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n    <i class=\"icon-caret-down ember-table-toggle-icon\"></i>\n  </span>\n  <div class=\"ember-table-header-content-container\">\n    <span class=\"ember-table-content\">\n      ");
  stack1 = helpers._triageMustache.call(depth0, "view.column.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </span>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/financial_table/financial_table_tree_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"ember-table-cell-container\" ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'style': ("view.paddingStyle")
  },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n  <span ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":ember-table-toggle-span view.row.isLeaf::ember-table-toggle\n    view.row.isCollapsed:ember-table-expand:ember-table-collapse")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleCollapse", "view.row", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n    <i class=\"icon-caret-down ember-table-toggle-icon\"></i>\n  </span>\n  <span class=\"ember-table-content\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.cellContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </span>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/horizon"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>Horizon</small></h1>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container\">\n          ");
  data.buffer.push(escapeExpression((helper = helpers['table-component'] || (depth0 && depth0['table-component']),options={hash:{
    'hasHeader': (true),
    'hasFooter': (false),
    'numFixedColumns': (0),
    'rowHeight': (30),
    'columnsBinding': ("columns"),
    'contentBinding': ("content")
  },hashTypes:{'hasHeader': "BOOLEAN",'hasFooter': "BOOLEAN",'numFixedColumns': "INTEGER",'rowHeight': "INTEGER",'columnsBinding': "STRING",'contentBinding': "STRING"},hashContexts:{'hasHeader': depth0,'hasFooter': depth0,'numFixedColumns': depth0,'rowHeight': depth0,'columnsBinding': depth0,'contentBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "table-component", options))));
  data.buffer.push("\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n  hasFooter=false\n  columnsBinding=\"columns\"\n  contentBinding=\"content\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>spark_line_table_cell_view.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.HorizonTableCellView = Ember.Table.TableCell.extend\n  template: Ember.Handlebars.compile(\"\")\n  heightBinding: 'controller.rowHeight'\n  horizonContent: Ember.computed ->\n    normal = d3.random.normal(1.5, 3)\n    [0...100].map (i) -> [i, normal()]\n  .property()\n  onWidthDidChange: Ember.observer ->\n    @$('svg').remove()\n    @renderD3View()\n  , 'width'\n  didInsertElement: ->\n    @onWidthDidChange()\n  renderD3View: ->\n    width  = @get 'width'\n    height = @get('height')\n    data   = @get('horizonContent')\n    chart = d3.horizon()\n      .width(width)\n      .height(height)\n      .bands(2)\n      .mode(\"mirror\")\n      .interpolate(\"basis\");\n    svg = d3.select('#' + @get('elementId')).append(\"svg\")\n      .attr(\"width\", width)\n      .attr(\"height\", height)\n    svg.data([data]).call(chart)</pre>\n      </div>\n    </div>\n\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application_controller.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.ApplicationController = Ember.Controller.extend\n  numRows: 100\n\n  columns: Ember.computed ->\n    name = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Name'\n      getCellContent: (row) -> 'Horizon ' + row['name']\n    horizon = Ember.Table.ColumnDefinition.create\n      columnWidth: 600\n      headerCellName: 'Horizon'\n      tableCellViewClass: 'App.HorizonTableCellView'\n      getCellContent: Ember.K\n    [name, horizon]\n\n  content: Ember.computed ->\n    normal = d3.random.normal(1.5, 3)\n    [0...@get('numRows')].map (num, index) ->\n      data = [0...100].map (i) -> [i, normal()]\n      name: index\n      data: data\n   .property 'numRows'</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/migration-guides"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("configurable column demo.");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("here");
  }

  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Migration Guides</h1>\n  <div class=\"row\">\n    <div class=\"col-md-9\">\n      <h2>Migrating to version 0.4.0</h2>\n      <p>\n        Version 0.4.0 contains major changes to column resizing.\n      </p>\n      <p>\n        In version 0.2, setting the table's <code>forceFillColumns</code>\n        property and configuring each column's <code>canAutoResize</code>\n        property let you configure the table to scale automatically when\n        rendered into containers of different sizes.\n      </p>\n      <p>\n        In version 0.4, the table-wide <code>forceFillColumns</code> setting\n        has been removed and each column defines its own resize behavior.  Use\n        <code>isResizable</code> to set whether the column can be resized at\n        all (manually or automatically), <code>canAutoResize</code> to set\n        whether the column will attempt to scale its width to different table\n        sizes, and <code>savedWidth</code> to set the column's initial width or\n        persist its width once resized.\n      </p>\n      <p>\n        It was previously possible to extend Ember Table so that it would\n        behave in a \"fluid\" way, meaning that resizing one column steals\n        width from its neighboring column. This is now supported in Ember Table\n        out of the box: just set <code>columnMode=\"fluid\"</code>.\n      </p>\n      <p>\n        To get a sense for the new column resizing changes, check out the\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.configurable-columns", options) : helperMissing.call(depth0, "link-to", "emberTable.configurable-columns", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </p>\n      <h3>API Changes</h3>\n      <ul class=\"styled\">\n        <li>Removed: <code>EmberTableComponent.forceFillColumns</code></li>\n        <li>Removed: <code>ColumnDefinition.columnWidth</code></li>\n        <li>Removed: <code>ColumnDefinition.defaultColumnWidth</code></li>\n        <li>Added: <code>EmberTableComponent.columnMode</code></li>\n        <li>Added: <code>ColumnDefinition.savedWidth</code></li>\n      </ul>\n      <h3>Upgrade steps</h3>\n      <ol class=\"styled styled-spacious\">\n        <li>\n          Replace <code>columnWidth</code> and\n          <code>defaultColumnWidth</code> with <code>savedWidth</code>. This\n          will set the column's initial width, and will change if the column is\n          manually resized. If you want to persist changes to column sizes,\n          simply bind to and persist <code>savedWidth</code>.\n        </li>\n        <li>\n          Do not use <code>forceFillColumns</code> as it no longer has any\n          effect. Columns will fill as before if their\n          <code>canAutoResize</code> property is <code>true</code>.\n        </li>\n        <li>\n          Make sure your columns have <code>canAutoResize</code> set correctly.\n          In version 0.2 this defaulted to <code>true</code>, but only made a\n          difference if <code>forceFillColumns</code> was enabled. Now it\n          defaults to <code>false</code>, but if a column sets it to\n          <code>true</code>, the force fill behavior is implicitly triggered.\n        </li>\n      </ol>\n\n      <h2>Migrating to version 0.3.0</h2>\n      <p>\n        Version 0.3.0 includes major column resizing changes, but with\n        <code>canAutoResize</code> defaulting to <code>true</code>.  We\n        recommend skipping this version and upgrading directly to 0.4.0; see\n        the 0.4.0 migration guide.\n      </p>\n\n      <h2>Migrating to version 0.2.0</h2>\n      <p>\n        A full migration step is not available for this version, but it\n        contains only minor API changes.\n      </p>\n      <p>\n        Version 0.2 uses row objects to wrap content in the table. Because of\n        this, change any accesses to row data (e.g. in\n        <code>getCellContent</code>) from <code>row['date']</code> to\n        <code>row.get('date')</code>.\n      </p>\n\n      <h2>Migrating from old versions to version 0.1.0</h2>\n      <p>\n        Version 0.1.0 of Ember Table is a bit of a restructure - we’re hoping\n        that the new organization will make it simpler and easier to set up,\n        but for existing users, you’ll have to make a few changes to upgrade to\n        the new Ember Table.\n      </p>\n      <h3>Upgrade steps</h3>\n      <ol class=\"styled styled-spacious\">\n        <li>\n          Upgrade <code>ember-table.js</code> and <code>ember-table.css</code>.\n          If you’re not on the latest version of <a target=\"_BLANK\"\n          href=\"http://emberjs.com/\">Ember.js</a>, now might be a good time to\n          upgrade that as well. This guide was written using Ember 1.0.0 and\n          Ember Table 0.1.0.\n        </li>\n        <li>\n          The major change is moving from separate table Views and Controllers\n          to a unified table Component. You can read up on Ember Components\n          <a target=\"_BLANK\"\n          href=\"http://emberjs.com/guides/components/\">here</a>. So instead of\n          having lines like this:\n          <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.MyTableController = Ember.Table.TableController.extend (...)\nApp.MyTableView = EmberTable.TableContainerView.extend (...)</pre>\n          </div>\n          You’ll have everything in one place:\n          <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.MyTableController = Ember.Controller.extend (...)</pre>\n          </div>\n          For starters, just change the type of your MyTableController from the old version to the new.\n        </li>\n        <li>\n          Update your handlebars file. Before, it might have looked like:\n          <br/>\n          <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;view Ember.Table.TablesContainer …&#125;&#125;</pre>\n          </div>\n          After the restructure, it should look like this:<br/>\n          <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component …&#125;&#125;</pre>\n          </div>\n        </li>\n        <li>\n          While you’re modifying that handlebars file, you may want to make\n          sure it looks like the structure of the new Ember Table examples. You\n          can see one ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.simple", options) : helperMissing.call(depth0, "link-to", "emberTable.simple", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(". In\n          particular, you might get errors if you don’t properly bind your\n          columns and content of the table, using <code>columnsBinding=</code>\n          and <code>contentBinding=</code>.\n          <br/><br/>\n          Both of these settings refer to variables in the corresponding\n          controller (which here should be <code>MyTableController</code>), such that if you\n          set <code>columnsBinding=exampleVariable</code>, then the columns will be bound\n          to <code>exampleVariable</code> in the controller. This gives you control over\n          the look and content of the table.\n          <br/><br/>\n          Before, you may have had\n          <code>controllerBinding=</code> here. You don’t need this any more: the\n          controller being used with this template will be used for the table\n          too, by default.\n        </li>\n        <li>\n          Move any properties you had defined in your\n          <code>TableContainerView</code> (if\n          you had one) into the controller. See the examples for more\n          information on how table properties should be set now.\n        </li>\n      </ol>\n      <h3>Troubleshooting</h3>\n      <ul class=\"styled styled-spacious\">\n        <li>\n          If you were using old Ember Table objects like the\n          <code>RowArrayProxy</code>,\n          take another look and consider whether you really need it. During my\n          migration I was able to remove it by changing the\n          <code>contentBinding=</code>\n          in my handlebars file to a more appropriate variable for content.\n        </li>\n        <li>\n          If you are having errors with template names not being found, it\n          may be due to a change with inferring names. For me, my old template\n          names used hyphens, and changing them to underscores automatically\n          connected them to the rest of my application.\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/overview"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Hello World Table</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_simple.png\" />\n          </div>\n        ");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>AJAX cells</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_ajax.png\" />\n          </div>\n        ");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Bar cells</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_bars.png\" />\n          </div>\n        ");
  }

function program7(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Dynamic bar cells</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_dynamic_bars.png\" />\n          </div>\n        ");
  }

function program9(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Tree & financial table</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_financial.png\" />\n          </div>\n        ");
  }

function program11(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Editable cell</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_editable.png\" />\n          </div>\n        ");
  }

function program13(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Sparkline cell using D3.js</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_sparkline.png\" />\n          </div>\n        ");
  }

function program15(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Horizon cell using D3.js</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_horizon.png\" />\n          </div>\n        ");
  }

function program17(depth0,data) {
  
  
  data.buffer.push("\n          <div class=\"col-md-4\">\n            <h4>Configurable Column Demo</h4>\n            <img class=\"preview-box\" src=\"img/preview_table_simple.png\" />\n          </div>\n        ");
  }

function program19(depth0,data) {
  
  
  data.buffer.push("Community Examples");
  }

  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <h1>Ember Table</h1>\n      <p class=\"elevated\">Ember table allows you to render very\n      large data sets by only rendering the rows that are being\n      displayed.<br />It is written as an ember component with an API that is\n      easy to understand and extend.</p>\n\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container ember-table-financial\">\n          ");
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "App.FinancialTableComponent", {hash:{
    'dataBinding': ("data")
  },hashTypes:{'dataBinding': "STRING"},hashContexts:{'dataBinding': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <h3>Features</h3>\n      <ul class=\"styled\">\n        <li>Lazy rendering and support for millions of rows</li>\n        <li>Support for column resizing and reordering</li>\n        <li>Configurable, customizable, and extendable</li>\n      </ul>\n    </div>\n    <div class=\"col-md-6\">\n      <h3>Dependencies</h3>\n      <ul class=\"styled\">\n        <li><a target=\"_BLANK\" href=\"http://emberjs.com/\">ember</a></li>\n        <li><a target=\"_BLANK\" href=\"http://jqueryui.com/download/#!components=1110001010000000000000000000000000\">\n          jquery-ui</a>\n          <br>\n          <small>(only core, widget, mouse, resizable, and sortable modules required)</small>\n        </li>\n        <li><a target=\"_BLANK\" href=\"https://github.com/brandonaaron/jquery-mousewheel\">jquery.mousewheel</a></li>\n        <li><a target=\"_BLANK\" href=\"https://github.com/LearnBoost/antiscroll\">antiscroll</a></li>\n      </ul>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <hr>\n      <h1>Examples</h1>\n      <p class=\"elevated\">The examples below demonstrate how you can extend and customize the table.</p>\n      <div class=\"row ember-table-examples\">\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.simple", options) : helperMissing.call(depth0, "link-to", "emberTable.simple", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.ajax", options) : helperMissing.call(depth0, "link-to", "emberTable.ajax", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.bars", options) : helperMissing.call(depth0, "link-to", "emberTable.bars", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.dynamic-bars", options) : helperMissing.call(depth0, "link-to", "emberTable.dynamic-bars", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.financial", options) : helperMissing.call(depth0, "link-to", "emberTable.financial", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.editable", options) : helperMissing.call(depth0, "link-to", "emberTable.editable", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.sparkline", options) : helperMissing.call(depth0, "link-to", "emberTable.sparkline", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.horizon", options) : helperMissing.call(depth0, "link-to", "emberTable.horizon", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.configurable-columns", options) : helperMissing.call(depth0, "link-to", "emberTable.configurable-columns", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </div>\n      <p>Looking for more ways to extend ember-table? Check out the ");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "emberTable.community-examples", options) : helperMissing.call(depth0, "link-to", "emberTable.community-examples", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(".</p>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Getting Started</h1>\n      <p>You will need <a target=\"_BLANK\" href=\"http://nodejs.org/\">node</a> installed as a development dependency.</p>\n      <p><a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-table/\">Clone it from Github</a> or <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-table/releases\">download the ZIP repo</a></p>\n      <div class=\"highlight\">\n<pre><code>$ npm install -g grunt-cli\n$ npm install\n$ grunt\n$ node examples.js</code></pre>\n      <p>Go to your browser and navigate to <a target=\"_BLANK\" href=\"http://localhost:8000/gh_pages\">localhost:8000/gh_pages</a></p>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Contributing</h1>\n      <p>You can contribute to this project in one of two ways:</p>\n      <ul class=\"styled\">\n        <li>Browse the ember-table <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-table/issues?state=open\">issues</a> and report bugs</li>\n        <li>Clone the ember-table repo, make some changes according to our development guidelines and issue a pull-request with your changes.</li>\n      </ul>\n      <p>We keep the ember-table.js code to the minimum necessary, giving users as much control as possible.</p>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <hr/>\n      <h1>Changelog</h1>\n      <p>The current version is 0.4.1.</p>\n      <p>For the full list of changes, please see <a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-table/blob/master/CHANGELOG.md\">CHANGELOG.md</a>.</p>\n    </div>\n    <div class=\"col-md-6\">\n      <hr>\n      <h1>Acknowledgements</h1>\n      <p><a target=\"_BLANK\" href=\"https://github.com/Addepar/ember-table/graphs/contributors\">List of Contributors on Github</a></p>\n      <p>With lots of help from the Ember.js team</p>\n      <p><a target=\"_BLANK\" href=\"https://twitter.com/ebryn\">ebryn</a>, <a target=\"_BLANK\" href=\"https://twitter.com/tomdale\">tomdale</a>, <a target=\"_BLANK\" href=\"https://twitter.com/wycats\">wycats</a></p>\n      <p>The original idea for lazy rendering was inspired by Erik Bryn.</p>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/simple"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>Simple</small></h1>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container\">\n          ");
  data.buffer.push(escapeExpression((helper = helpers['table-component'] || (depth0 && depth0['table-component']),options={hash:{
    'hasFooter': (false),
    'enableContentSelection': (true),
    'columnsBinding': ("columns"),
    'contentBinding': ("content")
  },hashTypes:{'hasFooter': "BOOLEAN",'enableContentSelection': "BOOLEAN",'columnsBinding': "STRING",'contentBinding': "STRING"},hashContexts:{'hasFooter': depth0,'enableContentSelection': depth0,'columnsBinding': depth0,'contentBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "table-component", options))));
  data.buffer.push("\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n  hasFooter=false\n  enableContentSelection=true\n  columnsBinding=\"columns\"\n  contentBinding=\"content\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application_controller.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.ApplicationController = Ember.Controller.extend\n  numRows: 100\n\n  columns: Ember.computed ->\n    dateColumn = Ember.Table.ColumnDefinition.create\n      columnWidth: 150\n      textAlign: 'text-align-left'\n      headerCellName: 'Date'\n      getCellContent: (row) -> row['date'].toDateString();\n    openColumn = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Open'\n      getCellContent: (row) -> row['open'].toFixed(2)\n    highColumn = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'High'\n      getCellContent: (row) -> row['high'].toFixed(2)\n    lowColumn = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Low'\n      getCellContent: (row) -> row['low'].toFixed(2)\n    closeColumn = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Close'\n      getCellContent: (row) -> row['close'].toFixed(2)\n    [dateColumn, openColumn, highColumn, lowColumn, closeColumn]\n\n  content: Ember.computed ->\n    [0...@get('numRows')].map (index) ->\n      date = new Date()\n      date.setDate(date.getDate() + index)\n      date:  date\n      open:  Math.random() * 100 - 50\n      high:  Math.random() * 100 - 50\n      low:   Math.random() * 100 - 50\n      close: Math.random() * 100 - 50\n      volume: Math.random() * 1000000\n  .property 'numRows'</pre>\n      </div>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/sparkline"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n<div class=\"col-md-10 col-md-offset-2 left-border main-content-container\">\n  <h1>Ember Table <small>Sparkline</small></h1>\n\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"example-container\">\n        <div class=\"ember-table-example-container\">\n          ");
  data.buffer.push(escapeExpression((helper = helpers['table-component'] || (depth0 && depth0['table-component']),options={hash:{
    'hasHeader': (true),
    'hasFooter': (false),
    'numFixedColumns': (1),
    'rowHeight': (30),
    'columnsBinding': ("columns"),
    'contentBinding': ("content")
  },hashTypes:{'hasHeader': "BOOLEAN",'hasFooter': "BOOLEAN",'numFixedColumns': "INTEGER",'rowHeight': "INTEGER",'columnsBinding': "STRING",'contentBinding': "STRING"},hashContexts:{'hasHeader': depth0,'hasFooter': depth0,'numFixedColumns': depth0,'rowHeight': depth0,'columnsBinding': depth0,'contentBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "table-component", options))));
  data.buffer.push("\n        </div>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application.hbs</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-html\">&#123;&#123;table-component\n  hasFooter=false\n  columnsBinding=\"columns\"\n  contentBinding=\"content\"\n&#125;&#125;</pre>\n      </div>\n    </div>\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>spark_line_table_cell_view.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.SparkLineTableCellView = Ember.Table.TableCell.extend\n  template: Ember.Handlebars.compile(\"\")\n  heightBinding: 'controller.rowHeight'\n\n  onContentOrSizeDidChange: Ember.observer ->\n    @$('svg').remove()\n    @renderD3View()\n  , 'row', 'width'\n\n  didInsertElement: -> @renderD3View()\n\n  renderD3View: ->\n    data  = @get 'row.timeseries'\n    return unless data\n    h     = @get 'height'\n    w     = @get 'width'\n    p     = 2\n    min   = Math.min.apply(null, data)\n    max   = Math.max.apply(null, data)\n    len   = data.length\n    fill  = d3.scale.category10()\n    xscale= d3.scale.linear().domain([0, len]).range([p, w - p])\n    yscale= d3.scale.linear().domain([min, max]).range([h - p, p])\n    line  = d3.svg.line().x((d, i) -> xscale(i)).y((d) -> yscale(d))\n    svg   = d3.select(\"##{@get('elementId')}\")\n              .append('svg:svg').attr('height', h).attr('width', w);\n    g = svg.append('svg:g')\n    g.append('svg:path')\n     .attr('d', line(data))\n     .attr('stroke', (d) -> fill(Math.round(Math.random()) * 10))\n     .attr('fill', 'none')</pre>\n      </div>\n    </div>\n\n\n    <div class=\"col-md-12 bumper-30\">\n      <h3>application_controller.coffee</h3>\n      <div class=\"highlight\">\n<pre class=\"prettyprint lang-coffee\">App.ApplicationController = Ember.Controller.extend\n  numRows: 100\n  columns: Ember.computed ->\n    name = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Name'\n      getCellContent: (row) -> 'Asset ' + row['name']\n    open = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Open'\n      getCellContent: (row) -> row['open'].toFixed(2)\n    spark = Ember.Table.ColumnDefinition.create\n      columnWidth: 200\n      headerCellName: 'Sparkline'\n      tableCellViewClass: 'App.SparklineTableExample.SparkCellView'\n      getCellContent: Ember.K\n    close = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Close'\n      getCellContent: (row) -> row['close'].toFixed(2)\n    low = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'Low'\n      getCellContent: (row) -> row['low'].toFixed(2)\n    high = Ember.Table.ColumnDefinition.create\n      columnWidth: 100\n      headerCellName: 'High'\n      getCellContent: (row) -> row['high'].toFixed(2)\n    [name, open, spark, close, low, high]\n\n  content: Ember.computed ->\n    randomWalk = (numSteps) ->\n      lastValue = 0\n      [0...numSteps].map ->\n        lastValue = lastValue + d3.random.normal()()\n\n    [0...@get('numRows')].map (num, index) ->\n      data = randomWalk(100)\n      name: index\n      timeseries: data\n      open:  data[0]\n      close: data[99]\n      low:   Math.min.apply(null, data)\n      high:  Math.max.apply(null, data)\n   .property 'numRows'\n</pre>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/tree_table/table_header_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"ember-table-content-container\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortByColumn", "view.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n  <span class=\"ember-table-content\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.content.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </span>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/tree_table/table_header_tree_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<span ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":ember-table-toggle-span view.row.isLeaf::ember-table-toggle\n    view.row.isCollapsed:ember-table-expand:ember-table-collapse")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleCollapse", "view.row", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n  <i class=\"icon-caret-down ember-table-toggle-icon\"></i>\n</span>\n<div class=\"ember-table-content-container\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortByColumn", "view.column", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n  <span class=\"ember-table-content\">\n    ");
  stack1 = helpers._triageMustache.call(depth0, "view.column.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </span>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_table/tree_table/table_tree_cell"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<span ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":ember-table-toggle-span view.row.isLeaf::ember-table-toggle\n    view.row.isCollapsed:ember-table-expand:ember-table-collapse")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleCollapse", "view.row", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
  data.buffer.push(">\n  <i class=\"icon-caret-down ember-table-toggle-icon\"></i>\n</span>\n<span class=\"ember-table-content\">\n  ");
  stack1 = helpers._triageMustache.call(depth0, "view.cellContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</span>\n");
  return buffer;
  
});

Ember.TEMPLATES["license"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "navigation", options) : helperMissing.call(depth0, "partial", "navigation", options))));
  data.buffer.push("\n\n\n<div class=\"hero-container small-hero-container\">\n  <div class=\"hero table-hero\">\n    <div class=\"hero-overlay\"></div>\n  </div>\n</div>\n\n\n<div class=\"section\">\n  <div class=\"container main-content-container\">\n    <div class=\"row\">\n      <div class=\"col-md-6 col-md-offset-3 section-title\">\n        <h1>Code &amp; Documentation Licensing</h1>\n      </div>\n      <div class=\"col-md-6 col-md-offset-3\">\n        <p>The majority of open source software exclusively developed by Addepar is licensed under the liberal terms of the Apache License, Version 2.0. The documentation is generally available under the Creative Commons Attribution 3.0 Unported License. In the end, you are free to use, modify and distribute any documentation, source code or examples within our open source projects as long as you adhere to the licensing conditions present within the projects.</p>\n        <p>Also note that our engineers like to hack on their own open source projects in their free time. For code provided by our engineers outside of our official repositories on GitHub, Addepar does not grant any type of license, whether express or implied, to such code.</p>\n     </div>\n    </div>\n  </div>\n</div>\n");
  return buffer;
  
});

})();
(function() {

  window['PR_SHOULD_USE_CONTINUATION'] = false;

}).call(this);


})();