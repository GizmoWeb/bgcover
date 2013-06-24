/** @preserve @author Daniele T. - http://www.oivavoi.it
 * @version 1.0
 *
 * This plugin create an internal <div> inside the element
 * with backgroun image in cover mode if browser support it.
 * If not place an image inside with emulation of cover mode.
 * The background is centered vertically and horizontally
 *
 * Require jQuery.
 */
$.fn.bgcover = function(options, callback) {
	var objects = [], return_data, defaults = {};
	$(this).each(function() {
		if ($(this).data("it.oivavoi.bgcover") === undefined) {
			var object = {};
			object.self = object.$this = $(this);
			object.settings = $.extend(defaults, options);

			object.destroy = function() {
				$(window).off("resize", _containerResizeHandler);
				$(window).off("resize", object.resize);
				if (object.container != null)
					object.container.remove();
				if (object.img != null)
					object.img.remove();
				object.$this.data("it.oivavoi.bgcover", null)
			};

			object.resize = function(e) {
				var iw, ih, ww, wh, iRatio, wRatio;
				if (object.img != null) {
					iw = object.img.width();
					ih = object.img.height();
					ww = object.container.width();
					wh = object.container.height();
					iRatio = iw / ih;
					wRatio = ww / wh;
					if (iRatio < wRatio) {
						object.img.width(ww);
						object.img.height("auto");
					} else {
						object.img.width("auto");
						object.img.height(wh)
					}
					object.img.css({
						'top' : (object.container.height() - object.img.height()) >> 1,
						'left' : (object.container.width() - object.img.width()) >> 1
					});
				}
			};

			_isBgSizeSupport = function() {
				return object.self.css('backgroundSize') != null
			};

			_containerResizeHandler = function(e) {
				var oldOverflow = object.self.css('overflow');
				object.self.css('overflow', 'hidden');
				object.container.css({
					'width' : 'auto',
					'height' : 'auto',
					'right' : 'auto',
					'bottom' : 'auto'
				}).css({
					'width' : object.self.outerWidth(true) > $(window).width() ? Math.max(object.self.outerWidth(true), $("html").outerWidth(true), $(window).width()) : 'auto',
					'height' : object.self.outerHeight(true) > $(window).height() ? Math.max(object.self.outerHeight(true), $("html").outerHeight(true), $(window).height()) : 'auto',
					'right' : object.self.outerWidth(true) > $(window).width() ? 'auto' : 0,
					'bottom' : object.self.outerHeight(true) > $(window).height() ? 'auto' : 0
				});
				object.self.css('overflow', oldOverflow);
			};

			if (null != object.settings.imgURL && null != object.settings.imgURL) {
				if (object.self.css("position") == "static" && !object.self.is("body")) {
					object.self.css("position", "relative");
				}
				//TODO
				//if (object.self.css("zIndex") == "auto") {
				//	object.self.css("zIndex", 0);
				//}
				object.container = $("<div />").css({
					'position' : 'absolute',
					'overflow' : 'hidden',
					'zIndex' : -9999,
					'top' : 0,
					'right' : 0,
					'bottom' : 0,
					'left' : 0
				}).appendTo(object.self);
				if (object.self.is("body")) {
					$(window).on("resize", _containerResizeHandler).resize();
				}
				object.isBgSizeSupport = _isBgSizeSupport();
				if (object.isBgSizeSupport) {
					object.container.css({
						'backgroundImage' : 'url(' + object.settings.imgURL + ')',
						'backgroundRepeat' : 'no-repeat',
						'backgroundSize' : 'cover',
						'backgroundPosition' : '50% 50%'
					});
				} else {
					object.img = $("<img/>").css({
						'display' : 'none',
						'position' : "absolute"
					}).attr("src", object.settings.imgURL).load(function() {
						$(this).appendTo(object.container);
						$(this).fadeIn();
						$(window).off("resize", object.resize).on("resize", object.resize).resize();
					}).each(function() {
						if (this.complete) {
							$(this).trigger("load")
						}
					})
				}
			}

			object.$this.data("it.oivavoi.bgcover", object);
		} else {
			object = $(this).data("it.oivavoi.bgcover");
		}
		objects.push(object)
	});
	if (objects.length === 1) {
		return_data = objects[0]
	} else {
		return_data = objects
	}
	return_data.all = function(callback) {
		$.each(objects, function() {
			callback.apply(this)
		})
	};
	return return_data
};
