import {elements,fadeIn,fadeOut} from './base';
import * as foodDao from '../foodDao';

//since uploadForm pops up only after date
//is selected, we can pass in date
export const renderUpload = (dateObj) => {
    var markups = `
    <div class="dark_overlay"></div>
    <div class="food_card">
            <div class="detail_img">
                <!--<div>Icon made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> is licensed by CC BY 3.0</div>-->
                <label>   
                    <img src="img/upload icon.png" class="upload_img">
                <label>
                <input type="file" class="file_portal" accept="image/*"/>
            </div>
            <div class="detail">
                <div class="input-field name_input">
                    <input placeholder="What did you have?" id="Food_name" type="text" required>
                </div>
                <div class="row">
                    <div class="input-field col s6 type_input">
                        <select id = "food_type_select" required>
                            <!--<option value="" disabled selected>Which meal?</option>-->
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snacks">Snacks</option>
                        </select>
                    </div>
                    <button class="btn col s3 submit_btn" type="submit">
                        <ion-icon name="checkmark-circle-outline" class="icon-submit"></ion-icon>
                    </button>
                </div>
            </div>
    </div>`;
    elements.mainContainer.insertAdjacentHTML('afterbegin',markups);
    guessMeal();
    setUpImageUpload(dateObj);
}

var clearUpload = ()=>{
    document.querySelector('.dark_overlay').nextElementSibling.outerHTML = '';
    document.querySelector('.dark_overlay').outerHTML = '';
}

//TODO: guess which meal it is by current time
var guessMeal = ()=>{
    var date = new Date();
    var currentTime = date.getHours();
    var index;
    if(5<currentTime&&currentTime<12){
        //breakfast
        index = 0;
    }else if(12<=currentTime&&currentTime<15){
        //lunch
        index = 1;
    }else if(18<=currentTime&&currentTime<23){
        //dinner
        index = 2;
    }else{
        //snacks
        index = 3;
    }
    document.querySelector('#food_type_select').selectedIndex = index;
}

var setUpImageUpload = (dateObj)=> {
    var file;
    document.querySelector('.file_portal').addEventListener('change', e=>{
        file = event.target.files[0];
        var img = URL.createObjectURL(file);
        document.querySelector('.upload_img').src = img;
        document.querySelector('.upload_img').classList.add('real_img');
        document.querySelector('.real_img').classList.remove('upload_img');
    });
    document.querySelector('.submit_btn').addEventListener('click', ()=>{
        if(file){
            var date="";
            date = date.concat(dateObj.year,"/",dateObj.month,"/",dateObj.day);
            var foodFile = {
                file,
                date,
                name: document.querySelector('#Food_name').value,
                foodType: document.querySelector('#food_type_select').value
            }
            console.log(foodFile);
            renderLoading();
            foodDao.uploadFood(foodFile);
            //clearUpload();
        }else{
            alert("image is empty!");   
        }
    });
}

//only called when food_card class exists
var renderLoading = ()=>{
    var wr = document.querySelector('.detail_img');
    fadeOut(wr);
    document.querySelector('.food_card').innerHTML = `<div class="loader upload_loader"></div>`;
}