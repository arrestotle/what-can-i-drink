
// Page Load

document.querySelector('.original').value = ''


// Main variables

let userSelected = []
let ingList = []

let userSelectedLowerCase

const ingidLink = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?iid='

const ingListLink = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'



fetch(ingListLink)
    .then(res => res.json())
    .then(data => {
        data.drinks.forEach(ing => {
            ingList.push(ing.strIngredient1)
        })
    })
    .catch(err => {
        console.log(`error ${err}`)
    })


// Fetch all 615 ingredients and separate into alchoholic and non-alcoholic

alcoholicIngredients = []

nonAlcoholicIngredients = []

let everyPossibleIngredient = []

let forCounter1 = 1

for(let i = 1; i < 616; i++){
    
    fetch(ingidLink + i)
        .then(res => res.json())
        .then(data => {
            forCounter1++
            if(data.ingredients !== null){
                everyPossibleIngredient.push(data.ingredients[0].strIngredient)
            }
            if(data.ingredients !== null && data.ingredients[0].strAlcohol == 'Yes'){
                alcoholicIngredients.push(data.ingredients[0].strIngredient)
            }else if(data.ingredients !== null && data.ingredients[0].strAlcohol == null){
                nonAlcoholicIngredients.push(data.ingredients[0].strIngredient)
            }
            if(forCounter1 == 616){
                console.log(forCounter1)
                document.querySelector('.inputBox').classList.remove('hidden')
                document.querySelector('.seeAll').classList.remove('hidden')
                document.querySelector('.addIngredient').classList.remove('hidden')
                document.querySelector('.getDrinks').classList.remove('hidden')
            }
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}

// Add checkboxes to array

function boxChecked(evt){
    if(evt.target.checked){
        userSelected.push(evt.target.value)
    }else{
        userSelected.splice(userSelected.indexOf(evt.target.value),1)
    }
    userSelectedLowerCase = userSelected.join(':').toLowerCase().split(':')

    console.log(userSelected)
}

// Test button

document.querySelector('.getDrinks').addEventListener('click', goGet)

function goGet(){
    console.log(ingList)
    console.log(alcoholicIngredients.sort())
    console.log(nonAlcoholicIngredients.sort())
    console.log(alcoholicIngredients.length + nonAlcoholicIngredients.length)

        // Clears //////////////////////////

    document.querySelector('.seeAll').innerText = 'See All Ingredients'
    document.querySelector('.checkboxContainer1').innerHTML = ''
    document.querySelector('.checkboxContainer2').innerHTML = ''
    document.querySelector('.buttonContainer').innerHTML = ''
    document.querySelector('.drinkImage').src = ''
    document.querySelector('.drinkImage').alt = ''
    document.querySelector('.drinkName').innerText = ''
    document.querySelector('.drinkInstructions').innerText = ''
    document.querySelector('.drinkIngredients').innerHTML = ''


        // End Clears //////////////////////

    // Filter userselected by ingList

    let ingListFormatted = ingList.join(':').toLowerCase().split(' ').join('_').split(':')
    // .filter(e => ingListFormatted.includes(e))



    let allIngredients = alcoholicIngredients.concat(nonAlcoholicIngredients).join(':').toLowerCase().split(':')
    
    const typedIngredients = document.querySelectorAll('.inputBox')
    typedIngredients.forEach(e => {
        let formattedIng = e.value.toLowerCase().split(' ').join('_')
        if(allIngredients.includes(e.value.toLowerCase())){
            userSelected.push(formattedIng)
        }
        if(typedIngredients[0] !== e){
            e.remove()
        }
        e.value = ''
    });
    let ingDrinkList = []
    let ingDrinkid = []

    const ingSearch = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='

    const idSearch = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='

    let forEachCounter = 0

    if(userSelected.includes('absolut_vodka')){
        userSelected.push('vodka')
    }
    if(userSelected.includes('rum') || userSelected.includes('light_rum') || userSelected.includes('dark_rum')){
        userSelected.push('rum')
        userSelected.push('light_rum')
        userSelected.push('dark_rum')
    }

    console.log(userSelected.filter(e => ingListFormatted.includes(e)))

    userSelected.filter(e => ingListFormatted.includes(e)).forEach(ing => {
        fetch(ingSearch + ing)
            .then(res => res.json())
            .then(data => {
                data.drinks.forEach(drink =>{
                    ingDrinkList.push(drink.idDrink)
                })
                forEachCounter++
                if(forEachCounter === userSelected.filter(e => ingListFormatted.includes(e)).length){
                    afterForEach1()
                }
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
    })

    
    // Creates array of ingredients or measurements for given drink

    function findValueByPrefix(object, prefix) {
        let ingredients = []
        for (var property in object) {
          if (object.hasOwnProperty(property) &&
              property.toString().startsWith(prefix)) {
              ingredients.push(object[property]);
          }
        }
        // let slimIngredients = ingredients.filter(e => e != undefined).join(':').toLowerCase().split(':')
        ingredients = ingredients.filter(e => e != undefined)
        return ingredients.filter(e => e != "")
    }

    



    function afterForEach1(){
        ingDrinkid = [...new Set(ingDrinkList)]
        console.log(ingDrinkList)
        console.log(ingDrinkid)

        console.log(userSelected)
        console.log(allIngredients)

        let forEachCounter2 = 0

        ingDrinkid.forEach(drink =>{
            fetch(idSearch + drink)
                .then(res => res.json())
                .then(data => {
                    forEachCounter2++
                    let drinkIngredients = findValueByPrefix(data.drinks[0], 'strIngredient')
                    let drinkIngredientsFormatted = drinkIngredients.join(':').toLowerCase().split(' ').join('_').split(':')
                    let drinkMeasurements = findValueByPrefix(data.drinks[0], 'strMeasure')
                    // console.log(drinkIngredients)
                    if(drinkIngredientsFormatted.filter(e => !userSelected.includes(e)).length == 0){
                        // console.log(data.drinks[0])
                        const drinkButton = document.createElement('button')
                        drinkButton.addEventListener('click',showMeTheDrink)
                        function showMeTheDrink(){
                            // Clear any drink that is already shown
                            document.querySelector('.drinkImage').src = ''
                            document.querySelector('.drinkImage').alt = ''
                            document.querySelector('.drinkName').innerText = ''
                            document.querySelector('.drinkInstructions').innerText = ''
                            document.querySelector('.drinkIngredients').innerHTML = ''
                            // Add new drink info
                            document.querySelector('.drinkImage').src = data.drinks[0].strDrinkThumb
                            document.querySelector('.drinkImage').alt = data.drinks[0].strDrink
                            document.querySelector('.drinkName').innerText = data.drinks[0].strDrink
                            document.querySelector('.drinkInstructions').innerText = data.drinks[0].strInstructions
                            for(let i = 0; i < drinkIngredients.length; i++){
                                const li = document.createElement('li')
                                document.querySelector('.drinkIngredients').appendChild(li)
                                li.innerText = `${drinkIngredients[i]} | ${drinkMeasurements}`
                            }
                        }
                        document.querySelector('.buttonContainer').appendChild(drinkButton)
                        drinkButton.innerText = data.drinks[0].strDrink
                    }
                    if(forEachCounter2 == ingDrinkid.length){
                        userSelected = []
                        console.log(drinkIngredients)
                    }
                })
                .catch(err => {
                    console.log(`error ${err}`)
                })
        })
    }
}

// Add ingredient button

document.querySelector('.addIngredient').addEventListener('click', addIngredient)

function addIngredient(){
    const newInput = document.createElement('input')
    newInput.placeholder = 'Type Ingredient Here...'
    newInput.classList.add('inputBox')
    document.querySelector('.inputContainer').appendChild(newInput)
}

// Remove ingredient input

////////////////////////////////////////////////////////////////////////////////////////////////////

// Create checkbox for each ingredient

document.querySelector('.seeAll').addEventListener('click', seeAllIngredients)

function seeAllIngredients(){
    if(document.querySelector('.checkboxContainer1').innerHTML == ''){   
        document.querySelector('.seeAll').innerText = 'Hide Ingredients'
        const alcoholicHeader = document.createElement('h3')
        const nonAlcoholicHeader = document.createElement('h3')
        alcoholicHeader.innerText = `All Ingredients (${everyPossibleIngredient.length})`
        // nonAlcoholicHeader.innerText = 'Other Ingredients'
        document.querySelector('.checkboxContainer1').appendChild(alcoholicHeader)
        // document.querySelector('.checkboxContainer2').appendChild(nonAlcoholicHeader)

        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]')

        // allCheckboxes.forEach(cb => {
        //     cb.checked = false
        // })

        everyPossibleIngredient.sort().forEach(ing => {
            const checkbox = document.createElement('input')
            const label = document.createElement('label')
            checkbox.type = 'checkbox'
            checkbox.value = ing.split(' ').join('_').toLowerCase()
            checkbox.name = ing.split(' ').join('_').toLowerCase()
            checkbox.addEventListener('click', boxChecked)
            label.for = ing.split(' ').join('_').toLowerCase()
            label.innerText = ing
            document.querySelector('.checkboxContainer1').appendChild(checkbox)
            document.querySelector('.checkboxContainer1').appendChild(label)
        });
        // nonAlcoholicIngredients.sort().forEach(ing => {
        //     const checkbox = document.createElement('input')
        //     const label = document.createElement('label')
        //     checkbox.type = 'checkbox'
        //     checkbox.value = ing.split(' ').join('_').toLowerCase()
        //     checkbox.name = ing.split(' ').join('_').toLowerCase()
        //     checkbox.addEventListener('click', boxChecked)
        //     label.for = ing.split(' ').join('_').toLowerCase()
        //     label.innerText = ing
        //     document.querySelector('.checkboxContainer2').appendChild(checkbox)
        //     document.querySelector('.checkboxContainer2').appendChild(label)
        // });
    }else{
        document.querySelector('.seeAll').innerText = 'See All Ingredients'
        document.querySelector('.checkboxContainer1').innerHTML = ''
        document.querySelector('.checkboxContainer2').innerHTML = ''
    }
    
}
