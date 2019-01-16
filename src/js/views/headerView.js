import {elements,fadeIn,fadeOut} from './base';
import * as foodDao from '../foodDao';
import { resolve } from 'path';
import { rejects } from 'assert';

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

var setUpImageUpload = dateObj => {
    var file;
    document.querySelector('.file_portal').addEventListener('change', async e=>{
        file = event.target.files[0];
        var img = URL.createObjectURL(file);
        var temp = await checkLandscape(img);
        console.log(temp);
        document.querySelector('.upload_img').src = temp ;
        console.log("showing update img");
        document.querySelector('.upload_img').classList.add('real_img');
        document.querySelector('.real_img').classList.remove('upload_img');
    });
    document.querySelector('.submit_btn').addEventListener('click', ()=>{
        if(file){
            var date="";
            date = date.concat(dateObj.year,"/",dateObj.month+1,"/",dateObj.month);
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

var checkLandscape = (url)=>{
    console.log("checking");
    return new Promise(resolve=>{
    var img = new Image();
    img.onload = function(){
        var width = img.width;
        var height = img.height;
        if(width>height){
            console.log("flipping");
            //picture is landscape mode
            //draw new img and flip it
            var c = document.createElement('canvas');
            c.width = height;
            c.height = width;


            // save the unrotated context of the canvas so we can restore it later
            // the alternative is to untranslate & unrotate after drawing
            
            var ctx = c.getContext('2d');
            //ctx.clearRect(0,0,c.width,c.height);
            //ctx.save();
            ctx.translate(c.width/2,c.height/2);

            // rotate the canvas to the specified degrees
            ctx.rotate(90*Math.PI/180);
        
            // draw the image
            // since the context is rotated, the image will be rotated also
            ctx.drawImage(img,-img.width/2,-img.height/2);
            //ctx.restore();
            console.log(c.toDataURL())
            resolve(c.toDataURL());
        }else{
            console.log("not flipping");
            resolve(url);
        }
    }
    img.src = url;
})
}