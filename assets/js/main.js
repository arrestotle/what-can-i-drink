

(function() {

	"use strict";

	var	$body = document.querySelector('body');

	// Methods/polyfills.

		// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
			!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

		// canUse
			window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

		// window.addEventListener
			(function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

	// Play initial animations on page load.
		window.addEventListener('load', function() {
			window.setTimeout(function() {
				$body.classList.remove('is-preload');
			}, 100);
		});

	// Slideshow Background.
		(function() {

			// Settings.
				var settings = {

					// Images (in the format of 'url': 'alignment').
						images: {
							'images/first.jpg': 'center',
							'images/second.jpg': 'center',
							'images/third.jpg': 'center'
						},

					// Delay.
						delay: 6000

				};

			// Vars.
				var	pos = 0, lastPos = 0,
					$wrapper, $bgs = [], $bg,
					k, v;

			// Create BG wrapper, BGs.
				$wrapper = document.createElement('div');
					$wrapper.id = 'bg';
					$body.appendChild($wrapper);

				for (k in settings.images) {

					// Create BG.
						$bg = document.createElement('div');
							$bg.style.backgroundImage = 'url("' + k + '")';
							$bg.style.backgroundPosition = settings.images[k];
							$wrapper.appendChild($bg);

					// Add it to array.
						$bgs.push($bg);

				}

			// Main loop.
				$bgs[pos].classList.add('visible');
				$bgs[pos].classList.add('top');

				// Bail if we only have a single BG or the client doesn't support transitions.
					if ($bgs.length == 1
					||	!canUse('transition'))
						return;

				window.setInterval(function() {

					lastPos = pos;
					pos++;

					// Wrap to beginning if necessary.
						if (pos >= $bgs.length)
							pos = 0;

					// Swap top images.
						$bgs[lastPos].classList.remove('top');
						$bgs[pos].classList.add('visible');
						$bgs[pos].classList.add('top');

					// Hide last image after a short delay.
						window.setTimeout(function() {
							$bgs[lastPos].classList.remove('visible');
						}, settings.delay / 2);

				}, settings.delay);

		})();

	// Signup Form.
		(function() {

			// Vars.
				var $form = document.querySelectorAll('#signup-form')[0],
					$submit = document.querySelectorAll('#signup-form input[type="submit"]')[0],
					$ingredientTextBox = document.querySelectorAll('#signup-form input[type="text"]')[0],
					$message;

			// Bail if addEventListener isn't supported.
				if (!('addEventListener' in $form))
					return;

			// Message.
				$message = document.createElement('span');
					$message.classList.add('message');
					$form.appendChild($message);

				$message._show = function(type, text) {

					$message.innerHTML = text;
					$message.classList.add(type);
					$message.classList.add('visible');

					window.setTimeout(function() {
						$message._hide();
					}, 3000);

				};

				$message._hide = function() {
					$message.classList.remove('visible');
				};

			// Events.
			// Note: If you're *not* using AJAX, get rid of this event listener.
				$form.addEventListener('submit', function(event) {

					event.stopPropagation();
					event.preventDefault();

//	//	//	//	// Insert drink fetch stuff here /////////////////////////////////	//	//	//	//	//	
					(function(){
						// Turns user-typed ingredients into array and formats for fetch
						const userType = $ingredientTextBox.value.split(', ').join(':').split(',').join(':').split(':')
						$ingredientTextBox.value = ''
						console.log(userType) // test
						const formUserType =  userType.join('-').toLowerCase().split(' ').join('_').split('-') // Format for fetch
						console.log(formUserType) // test

						// Clear any drink buttons
						document.querySelector('.perfectMatch')
						document.querySelector('.notPerfect')

						// Declare fetch URLs
						const ingListLink = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'	// List of ingredients
						const ingSearch = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='		// Search by ingredient
						const idSearch = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='		// Lookup drink by ID

						// Declare drink arrays and counter
						let fetchIngList = []
						let validIngredients = []
						let ingDrinkid = []
						let perfectDrinks = []
						let notPerfectDrinks = []
						let counter = 0

						// declare this thing for later
						const ingListed = document.querySelector('.ingListed') // Box with user variables
						ingListed.innerHTML = '' // clear selected ingredients 			////// CHANGE LATER??

						// Add user ingredients to ingListed - could probs add fetch in here too??
						userType.forEach(ing => {
							const newItem = document.createElement('li') // Make li for each ingredient
							newItem.innerText = ing // li text is ingredient
							// newItem.addEventListener('click', function(event){ 		////// ADD LATER??
							// 	event.target.remove()
							// })
							ingListed.appendChild(newItem) // add ingredient to box
						});

						// Fetch list of ingredients from CocktailDB, start fetch chain
						(function (){
							fetch(ingListLink)
								.then(res => res.json())
								.then(data => {
									data.drinks.forEach(ing => {
										fetchIngList.push(ing.strIngredient1)	// Make array of cocktailDB ingredient list
									})
								})
								.then(function(){	// Search drinks for each ingredient and make array of drinks
									console.log(fetchIngList)
									fetchIngList = fetchIngList.join(':').toLowerCase().split(' ').join('_').split(':')	// Format to match
									validIngredients = formUserType.filter(e => fetchIngList.includes(e))
									//
									validIngredients.forEach(ing => {	// Fetch search for each valid ingredient
										fetch(ingSearch + ing)
											.then(res => res.json())
											.then(data => {
												counter++
												data.drinks.forEach(drink =>{
													ingDrinkid.push(drink.idDrink)	// Push ID of every drink for each ingredient
												})
												if(counter === validIngredients.length){
													afterDrinkList();
												}
											})
											.catch(err => {
												console.log(`error ${err}`)
											})
									})
									
									//
								})
								.catch(err => {
									console.log(`error ${err}`)
								})
								
								function afterDrinkList(){
									console.log(ingDrinkid)
									ingDrinkid = [...new Set(ingDrinkid)]	// Remove duplicates from possible drinks array
									ingDrinkid.forEach(drink => {				// Fetch search for each valid ingredient
										fetch((idSearch + drink))
											.then(res => res.json())
											.then(data => {
												let drinkIngredients = findValueByPrefix(data.drinks[0], 'strIngredient')
												let drinkIngredientsFormatted = drinkIngredients.join(':').toLowerCase().split(' ').join('_').split(':')
												let drinkMeasurements = findValueByPrefix(data.drinks[0], 'strMeasure')
												if(drinkIngredientsFormatted.filter(e => !formUserType.includes(e)).length == 0){
													const drinkButton = document.createElement('input')
													drinkButton.type = 'submit'
													drinkButton.addEventListener('click',showMeTheDrink)
													function showMeTheDrink(){
														// Clear any drink that is already shown
														document.querySelector('.drinkImage').src = ''
														document.querySelector('.drinkImage').alt = ''
														document.querySelector('.drinkName').innerText = ''
														document.querySelector('.drinkInstructions').innerText = ''
														document.querySelector('.proportions').innerHTML = ''
														// Add new drink info
														document.querySelector('.giantTwo').classList.remove('hidden')
														document.querySelector('.drinkImage').src = data.drinks[0].strDrinkThumb
														document.querySelector('.drinkImage').alt = data.drinks[0].strDrink
														document.querySelector('.drinkName').innerText = data.drinks[0].strDrink
														document.querySelector('.drinkInstructions').innerText = data.drinks[0].strInstructions
														for(let i = 0; i < drinkIngredients.length; i++){
															const li = document.createElement('li')
															document.querySelector('.proportions').appendChild(li)
															li.innerText = `${drinkIngredients[i]} | ${drinkMeasurements}`
														}
													}
													document.querySelector('.perfectMatch').appendChild(drinkButton)
                        							drinkButton.value = data.drinks[0].strDrink
												}else if(drinkIngredientsFormatted.filter(e => !formUserType.includes(e)).length == 1 && document.querySelector('.notPerfect').childElementCount < 20){
													console.log(document.querySelector('.notPerfect').length)
													const drinkButton = document.createElement('input')
													drinkButton.type = 'submit'
													drinkButton.addEventListener('click',showMeTheDrink)
													function showMeTheDrink(){
														// Clear any drink that is already shown
														document.querySelector('.drinkImage').src = ''
														document.querySelector('.drinkImage').alt = ''
														document.querySelector('.drinkName').innerText = ''
														document.querySelector('.drinkInstructions').innerText = ''
														document.querySelector('.proportions').innerHTML = ''
														// Add new drink info
														document.querySelector('.giantTwo').classList.remove('hidden')
														document.querySelector('.drinkImage').src = data.drinks[0].strDrinkThumb
														document.querySelector('.drinkImage').alt = data.drinks[0].strDrink
														document.querySelector('.drinkName').innerText = data.drinks[0].strDrink
														document.querySelector('.drinkInstructions').innerText = data.drinks[0].strInstructions
														for(let i = 0; i < drinkIngredients.length; i++){
															const li = document.createElement('li')
															document.querySelector('.proportions').appendChild(li)
															li.innerText = `${drinkIngredients[i]} | ${drinkMeasurements}`
														}
													}
													document.querySelector('.notPerfect').appendChild(drinkButton)
                        							drinkButton.value = data.drinks[0].strDrink
												}else if(drinkIngredientsFormatted.filter(e => !formUserType.includes(e)).length == 2 && document.querySelector('.notPerfect').childElementCount < 20){
													const drinkButton = document.createElement('input')
													drinkButton.type = 'submit'
													drinkButton.addEventListener('click',showMeTheDrink)
													function showMeTheDrink(){
														// Clear any drink that is already shown
														document.querySelector('.drinkImage').src = ''
														document.querySelector('.drinkImage').alt = ''
														document.querySelector('.drinkName').innerText = ''
														document.querySelector('.drinkInstructions').innerText = ''
														document.querySelector('.proportions').innerHTML = ''
														// Add new drink info
														document.querySelector('.giantTwo').classList.remove('hidden')
														document.querySelector('.drinkImage').src = data.drinks[0].strDrinkThumb
														document.querySelector('.drinkImage').alt = data.drinks[0].strDrink
														document.querySelector('.drinkName').innerText = data.drinks[0].strDrink
														document.querySelector('.drinkInstructions').innerText = data.drinks[0].strInstructions
														for(let i = 0; i < drinkIngredients.length; i++){
															const li = document.createElement('li')
															document.querySelector('.proportions').appendChild(li)
															li.innerText = `${drinkIngredients[i]} | ${drinkMeasurements}`
														}
													}
													document.querySelector('.notPerfect').appendChild(drinkButton)
                        							drinkButton.value = data.drinks[0].strDrink
												}else if(drinkIngredientsFormatted.filter(e => !formUserType.includes(e)).length == 3 && document.querySelector('.notPerfect').childElementCount < 20){
													const drinkButton = document.createElement('input')
													drinkButton.type = 'submit'
													drinkButton.addEventListener('click',showMeTheDrink)
													function showMeTheDrink(){
														// Clear any drink that is already shown
														document.querySelector('.drinkImage').src = ''
														document.querySelector('.drinkImage').alt = ''
														document.querySelector('.drinkName').innerText = ''
														document.querySelector('.drinkInstructions').innerText = ''
														document.querySelector('.proportions').innerHTML = ''
														// Add new drink info
														document.querySelector('.giantTwo').classList.remove('hidden')
														document.querySelector('.drinkImage').src = data.drinks[0].strDrinkThumb
														document.querySelector('.drinkImage').alt = data.drinks[0].strDrink
														document.querySelector('.drinkName').innerText = data.drinks[0].strDrink
														document.querySelector('.drinkInstructions').innerText = data.drinks[0].strInstructions
														for(let i = 0; i < drinkIngredients.length; i++){
															const li = document.createElement('li')
															document.querySelector('.proportions').appendChild(li)
															li.innerText = `${drinkIngredients[i]} | ${drinkMeasurements}`
														}
													}
													document.querySelector('.notPerfect').appendChild(drinkButton)
                        							drinkButton.value = data.drinks[0].strDrink
												}
											})
											.catch(err => {
												console.log(`error ${err}`)
											})
									})
								};
								
						})();

						

						// Make array from object based on property prefix
						function findValueByPrefix(object, prefix) {
							let arr = []
							for (var property in object) {
							  if (object.hasOwnProperty(property) &&
								  property.toString().startsWith(prefix)) {
								  arr.push(object[property]);
							  }
							}
							arr = arr.filter(e => e != undefined)
							return arr.filter(e => e != "")
						}

						
					})()

// // //	//	//	//	//	//	//	//	//	//	//	//	//	//	//	//	///	//	//	//	//	///	//	//	/	/

					// Hide message.
						$message._hide();

					// Disable submit.
						$submit.disabled = true;

					// Process form.
					// Note: Doesn't actually do anything yet (other than report back with a "thank you"),
					// but there's enough here to piece together a working AJAX submission call that does.
						window.setTimeout(function() {

							// Reset form.
								$form.reset();

							// Enable submit.
								$submit.disabled = false;

							// Show message.
								$message._show('success', 'Updated!');
								//$message._show('failure', 'Something went wrong. Please try again.');

						}, 750);

				});

		})();

})();