(
	function($) 
	{
		var image_width;
		var image_height;
		var target_height = 128;
		var target_width = 128;
		var min_width;
		var sliders_loaded = 0;

		// Current Properties
		var width = 0;
		var height = 0;
		var left = 0;
		var topp = 0;
		var max_left = 0;
		var max_topp = 0;


		$.fn.sliderize = function(url, options) 
		{
			if(options.width > 0)
			{
				target_width = options.width;
			}
			if(options.height > 0)
			{
				target_height = options.height;
			}

			var slider_width = target_width - 20;

			// Build HTML to append
			var html = "";
			html += '<div id="sliderize-outter">';
				html += '<div id="sliderize-image-box" style="border:1px solid #000; width:'+target_width+'px; height:'+target_height+'px; overflow:hidden; background:#000; position:relative;">';
					html += '<img id="sliderize-image" src="' + url + '" style="display:none; position:absolute;">';
				html += '</div>';
				html += '<span style="font-size:12px; font-weight:bold; font-family:Arial; display:block; margin:5px; color:#666;">ZOOM:</span>';
				html += '<div id="sliderize-zoom" style="width:'+slider_width+'px; margin:10px;"></div>';
				html += '<span style="font-size:12px; font-weight:bold; font-family:Arial; display:block; margin:5px; color:#666;">X-AXIS:</span>';
				html += '<div id="sliderize-xaxis" style="width:'+slider_width+'px; margin:10px;"></div>';
				html += '<span style="font-size:12px; font-weight:bold; font-family:Arial; display:block; margin:5px; color:#666;">Y-AXIS:</span>';
				html += '<div id="sliderize-yaxis" style="width:'+slider_width+'px; margin:10px;"></div>';
			html += '</div>';
			html += '<form method=POST>';
				html += '<input type="hidden" id="sliderize-value-width" name="width" value="" />';
				html += '<input type="hidden" id="sliderize-value-target-width" name="target_width" value="'+target_width+'" />';
				html += '<input type="hidden" id="sliderize-value-image-width" name="image_width" value="" />';
				html += '<input type="hidden" id="sliderize-value-height" name="height" value="" />';
				html += '<input type="hidden" id="sliderize-value-target-height" name="target_height" value="'+target_height+'" />';
				html += '<input type="hidden" id="sliderize-value-image-height" name="image_height" value="" />';
				html += '<input type="hidden" id="sliderize-value-top" name="top" value="0" />';
				html += '<input type="hidden" id="sliderize-value-left" name="left" value="0" />';
				html += '<input type="hidden" id="sliderize-value-url" name="url" value="'+url+'" />';
				html += '<input type="submit" id="sliderize-value-save" name="save" value="Save" />';
			html += '</form>';

			$(this).append(html);


			// Now we're waiting for the image to load before
			// we do anything else
			$('#sliderize-image').attr('src', url).load(function() 
			{
				image_width = $("#sliderize-image").width();
				image_height = $("#sliderize-image").height();

				$("#sliderize-value-image-height").val(image_height);
				$("#sliderize-value-image-width").val(image_width);

				// min_width is the minimum width that the image can be set
				// to without going below the target height or width
				var ratio = image_width / image_height;
				if(ratio > 1)
				{
					min_width = Math.ceil((target_height / image_height) * image_width);
				}
				else
				{
					min_width = target_width;
				}

				if(min_width < target_width)
				{
					min_width = target_width;
				}


				$.set_image_width(min_width);
				$.set_image_height(Math.floor(width * (image_height / image_width)));
				$("#sliderize-image").show();

				$.load_sliders();
			});

		};


		$.load_sliders = function()
		{
			var disabled = false;

			// Initialize the zoom slider
			$("#sliderize-zoom").slider({
        		        min: min_width,
        		        max: image_width,
        		        value: min_width,
        		        slide: function(event, ui)
        		        {
					$.set_image_width(ui.value);
        		               	$.set_image_height(Math.floor(width * (image_height / image_width)));
        		        }
        		});
			if(image_width < min_width)
			{
				$("#sliderize-zoom").slider("option", "disabled", true);
			}

			// Initalize the left-right slider
			$("#sliderize-xaxis").slider({
                		min: 0,
                		max: max_left,
                		value:left,
                		slide: function(event, ui)
                		{
					$.set_image_left(ui.value);
                		}
        		});
			if(max_left == 0)
			{
				$("#sliderize-xaxis").slider("option", "disabled", true);
			}

			// Initialize the up-down slider
			$("#sliderize-yaxis").slider({
                		min: 0,
                		max: max_topp,
                		value:topp,
				disabled:disabled,
                		slide: function(event, ui)
                		{
					$.set_image_top(ui.value);
                		}
        		});
			if(max_topp == 0)
			{
				$("#sliderize-yaxis").slider("option", "disabled", true);
			}

			sliders_loaded = 1;				
		}


		$.set_image_width = function(val)
		{
			width = val;
			$("#sliderize-image").width(width);
			$("#sliderize-value-width").val(width);
			max_left = width - target_width;
			$.set_image_left(left);

			if(sliders_loaded)
			{
				$("#sliderize-xaxis").slider("option", "max", max_left);
				$("#sliderize-xaxis").slider("option", "value", left);
			
				if(max_left == 0)
				{
					$("#sliderize-xaxis").slider("option", "disabled", true);
				}
				else
				{
					$("#sliderize-xaxis").slider("option", "disabled", false);
				}
			}
		}

		$.set_image_height = function(val)
		{
			height = val;
			$("#sliderize-value-height").val(height);
			max_topp = height - target_height;
			$.set_image_top(topp);

			if(sliders_loaded)
			{
				$("#sliderize-yaxis").slider("option", "max", max_topp);
				$("#sliderize-yaxis").slider("option", "value", topp);
			
				if(max_topp == 0)
				{
					$("#sliderize-yaxis").slider("option", "disabled", true);
				}
				else
				{
					$("#sliderize-yaxis").slider("option", "disabled", false);
				}
			}
		}

		$.set_image_left = function(val)
		{
			if(val > max_left)
			{
				val = max_left;
			}
			left = val;
                        $("#sliderize-image").css('left', '-'+left+'px');
			$("#sliderize-value-left").val(left);
		}

		$.set_image_top = function(val)
		{
			if(val > max_topp)
			{
				val = max_topp;
			}
                        topp = val;
                        $("#sliderize-image").css('top', '-'+topp+'px');
			$("#sliderize-value-top").val(topp);
		}

	}
)
(jQuery);
