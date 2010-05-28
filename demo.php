<?


// This is executed when the user clicks the save button...
if(!empty($_POST['save']))
{
	// $filename is where you want to save the filename to
	// If you leave the filename NULL, the image will load in your 
	// browser instead of save on the server
	$filename = NULL;
	//$filename = "test.jpg";
	save_resized_image($filename, $_POST);
	exit;
}

function save_resized_image($filename, $values)
{
	$url = $values['url'];
	$width = $values['width'];
	$height = $values['height'];
	$target_height = $values['target_height'];
	$target_width = $values['target_width'];
	$image_height = $values['image_height'];
	$image_width = $values['image_width'];
	$top = $values['top'];
	$left = $values['left'];

	 // create an image of the given filetype
	if (strpos($url,".jpg") !== false or strpos($url,".jpeg") !== false) 
	{
       		$original = ImageCreateFromJpeg($url);
       		$extension = ".jpg";
   	} 
	elseif (strpos($url,".png") !== false) 
	{
       		$original = ImageCreateFromPng($url);
       		$extension = ".png";
   	}
	else
	{
		// don't want to support GIF's because they suck
		return FALSE;
	}

	$resized = imagecreatetruecolor($target_width, $target_height);
	imagecopyresampled ($resized, $original, 0, 0, $left*($image_width/$width) , $top*($image_width/$width), $width , $height , $image_width , $image_height );

	switch ($extension)
   	{
       		case ".jpg":
       		{
			if($filename == "") 
			{
				header('Content-Type: image/jpeg');
			}
           		return imagejpeg($resized, $filename, 100);
       		}
      		case ".png":
           	{
			if($filename == "") 
			{
				header('Content-Type: image/png');
			}
          		return imagepng($resized, $filename);
       		}
  	}

	// If we got here, something didn't go right
	return FALSE;
}


?>
<html>
	<head>
		<title>Sliderize Demo</title>
		<!-- JQUERY and JQUERY UI ARE REQUIRED FOR SLIDERIZE -->
		<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" media="screen" rel="stylesheet" type="text/css" /> 
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script> 
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script> 
		<!-- SLIDERIZE -->
		<script type="text/javascript" src="jquery.sliderize.js"></script> 
		<!-- HOW TO USE SLIDERIZE -->
		<script>
			$(document).ready(function() 
			{
				var image = 'http://ecx.images-amazon.com/images/I/81j7eo3SSiS._AdidasShoesSports_.jpg';
				$("#sliderize").sliderize(image, {height:300, width:500});
			});
		</script>
	</head>
<body>
	<div id="sliderize"></div>
</body>
</html>
