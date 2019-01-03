import {elements,fadeIn,fadeOut} from './base';

//render all four types of meals throughout the date of
//the given user
//dayLog = {
// meals:{breakfast:[...],lunch:[...],...},
// user:user,date:date,etc.    
//}


export const renderLoader = ()=>{
    elements.logView.insertAdjacentHTML('afterbegin',
    `<div class="loader log_loader"></div>`);
}

export const clearLoader = ()=>{
    fadeOut(document.querySelector('.log_loader'));
}

export const renderMeals = dayLog => {
    console.log(dayLog);
    var markups = ``;
    if(dayLog.Breakfast.length!=0){
        markups += renderMeal(dayLog.Breakfast,'Breakfast');
    }
    if(dayLog.Lunch.length!=0){
        markups += renderMeal(dayLog.Lunch,'Lunch');
    }
    if(dayLog.Dinner.length!=0){
        markups += renderMeal(dayLog.Dinner,'Dinner');
    }
    if(dayLog.Snacks.length!=0){
        markups += renderMeal(dayLog.Snacks,'Snacks');
    }
    //insert html here
    elements.logView.insertAdjacentHTML('afterbegin',markups);
}

//foods of one specific meal
const renderMeal = (foods,mealType) => {
    var markups = `
        <div class="meal">
            <div class="time">
                <h3>${mealType}</h3>
            </div>`;
    //scrollbar class for overflown foods img
    markups += (foods.length<=4)? 
            `<div class="meal_container ${mealType}">`: `<div class="meal_container ${mealType} scrollbar">`;        
    foods.forEach(food => {
        markups += `
                <div class="food_container">
                    <img src="${food.url}" alt="${food.name}" id="${food.name}">
                </div>`;
    });
    markups += 
            `</div>
        </div>`;
    return markups;
}

export const renderDetail = (food,mealType,date) => {
    var markups = `
    <div class="dark_overlay"></div>
	<div class="food_card">	
		<div class="detail_img">
			<img src="${food.url}" alt="${food.name}" class="real_img">
		</div>
		<div class="detail">
			<h2>${food.name}</h2>
			<h4>${mealType} ${date}</h4>
		</div>
    </div>`;
    elements.mainContainer.insertAdjacentHTML('beforebegin',markups);
}   

export const clearMeals = ()=>{
    elements.logView.innerHTML = "";
}

//add scrollbar class to meals according to window sizes
//mealType class use Uppercase to start
export const toggleScrollBar = (size)=>{
    var threshold;
    if(size=='small'){
        threshold=2;
    }else if(size=='big'){
        threshold=4;
    }
    var classes = ['Breakfast','Lunch','Dinner','Snacks']
    //iterate through classes
    for(var i=0;i<4;i++){
        var c = classes[i];
        var el = document.querySelector(`.${c}`);
        if(el){
            //*TODO*--check vaildity--//
            var count = el.children.length;
            if(count>threshold){
                el.classList.add('scrollbar');
            }else if(count<=threshold){
                el.classList.remove('scrollbar');
            }
        }
    }

}