[jQuery Drink](http://github.com/elijahr/jquery-drink)
================================

Attach event handlers to DOM elements before they exist.

Examples
--------

	<script src="jquery.drink.js"></script>
	<script>

	$(function(){

		$('.foo')
			.drink(function(){
				$(this).text('bar');
			})
			.drink('click', function(event){
				alert('baz');
			});

		$(document.body).append('<div class="foo"></div>');
	});

	</script>


Questions?
----------

Please feel free to [contact the author](mailto:elijahr+jquerydrink@gmail.com) with questions.


Issues?
-------

Please submit bugs or feature requests using the issue tracker on [github](http://github.com/elijahr/jquery-drink/issues).


Credits
-------

Thanks to Brandon Aaron for creating the [Live Query](http://plugins.jquery.com/project/livequery) plugin which is the inspiration for Drink.
