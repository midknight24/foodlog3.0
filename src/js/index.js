import Food from './models/Food';
import {elements,fadeIn,fadeOut} from './views/base';
import * as logView from './views/logView';
import * as profileView from './views/profileView';
import * as headerView from './views/headerView';
import * as material from './materialize.min';
import * as foodDao from './foodDao';

var state = {
    //date obj of the current log
    date: getCurDateObj(),
    dayLog: null,
    sidebar: false
}
 
function getCurDateObj(){
    var today = new Date();
    var obj = {
        year: today.getFullYear(),
        month: today.getMonth()+1,
        day: today.getDate()
    }
    return obj;
}

//pasre '2047/01/01' into 2047 1 1
function parseDateObj(date){
    var arr = date.split("/");
    var dateObj = {
        year: arr[2],
        month: (arr[0][0]!='0')?arr[0]:arr[0][1],
        day: (arr[1][0]!='0')?arr[1]:arr[1][1]
    }
    return dateObj
}

function getCurDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  } 

  if(mm<10) {
      mm = '0'+mm
  }
  today = mm + '/' + dd + '/' + yyyy;
  return today;
}


//set up date picker
function datePickerInit() {
    var elems = document.querySelector('.datepicker');
    var options = {
        format: 'mm/dd/yyyy'
    }
    var instances = material.Datepicker.init(elems,options);
  }

//set up food type selector
function foodSelectorInit(){
    var elems = document.querySelectorAll('select');
    var options = {};
    var instances = material.FormSelect.init(elems, options);
}

function addOverlay(){
    document.querySelector('.dark_overlay').addEventListener('click',()=>{
        document.querySelector('.dark_overlay').nextElementSibling.outerHTML = '';
        document.querySelector('.dark_overlay').outerHTML = '';
    });
}

//set up img click event
function setUpImgDetailEvent(dayLog){
    dayLog.Breakfast.forEach(food => {
        document.getElementById(food.name).addEventListener('click',()=>{
            logView.renderDetail(food,'Breakfast',state.date);
            addOverlay();
        });
    });
    dayLog.Lunch.forEach(food => {
        document.getElementById(food.name).addEventListener('click',()=>{
            logView.renderDetail(food,'Lunch',state.date);
            addOverlay();
        });
    });
    dayLog.Dinner.forEach(food => {
        document.getElementById(food.name).addEventListener('click',()=>{
            logView.renderDetail(food,'Dinner',state.date);
            addOverlay();
        });
    });
    dayLog.Snacks.forEach(food => {
        document.getElementById(food.name).addEventListener('click',()=>{
            logView.renderDetail(food,'Snacks',state.date);
            addOverlay();
        });
    });
} 

function checkLoginInfo(){
    var email = sessionStorage.getItem('email');
    console.log(email);
    var password = sessionStorage.getItem('password');
    if(!email||!password){
        location.href = '/login.html';
    }else{
        //userLogin(email,password);
    }
}

function userLogout(){
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    firebase.auth().signOut();
    location.href = '/login.html';
}

firebase.auth().onAuthStateChanged(user=>{
    if(user){
        console.log("logged in");
        load();
    }else{
        console.log('no user found');
        userLogout();
    }
});

//takes in a date obj with ex: {year:2010,month:12,year:30}
async function load(date){
    checkLoginInfo();
    fadeIn(elements.mainContainer);
    if(window.innerWidth<1120){
        activateSideBar(true);
    }
    //check current date
    datePickerInit();
    if(date==undefined){
        date = getCurDate();
        elements.date.value = date;
    }
    logView.renderLoader();
    //fetch dayLog from database
    state.dayLog = await foodDao.getDayLog(date);
    console.log(state.dayLog);
    logView.clearLoader();
    await (function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    })(700);
    if(elements.logView){
        fadeIn(elements.logView);
    }
    //render views
    logView.renderMeals(state.dayLog);
    checkWidth();
    setUpImgDetailEvent(state.dayLog);


    profileView.renderWater(state.dayLog.Water);    
}


//change date obj when the datepicker value change
elements.date.addEventListener('input',()=>{
    console.log("date changed");
    var newDate = elements.date.value;
    var dateObj = parseDateObj(newDate);
    console.log(dateObj);
    state.date = dateObj;
});

//Init on page loaded
document.addEventListener('DOMContentLoaded',async ()=>{
    checkLoginInfo();
    var user = firebase.auth().currentUser;
    console.log(user);
});


elements.logout.addEventListener('click',()=>{
    userLogout();
});

//set up food upload btn
elements.uploadForm.addEventListener('click',()=>{
    headerView.renderUpload(state.date);
    foodSelectorInit();
    addOverlay();
    //set up EL for submit

});

//set up change date btn
elements.dateForm.addEventListener('click',()=>{
    logView.clearMeals();
    profileView.resetWater();
    checkWidth();
    load(state.date);
});

//set up add Water btn
elements.addWater.addEventListener('click',async ()=>{
    console.log("in"+state.dayLog.Water);
    if(state.dayLog.Water<8){
        //add 1 to Water count
        state.dayLog.Water++;
        //update UI
        profileView.addWater(state.dayLog.Water);
        profileView.toggleBtn();
        //update db
        await foodDao.updateWater(state.dayLog.Water,state.date);
        profileView.toggleBtn();
    }
});

//set up remove Water btn
elements.removeWater.addEventListener('click',async ()=>{
    if(state.dayLog.Water>0){
        //add 1 to Water count
        state.dayLog.Water--;
        //update UI
        profileView.removeWater(state.dayLog.Water+1);
        profileView.toggleBtn();
        //update db
        await foodDao.updateWater(state.dayLog.Water,state.date);
        profileView.toggleBtn();
    }
});


function checkWidth(){
    var w = window.innerWidth;
    if(w>=1120){
        logView.toggleScrollBar('big');
        activateSideBar(false);
    }else{
        logView.toggleScrollBar('small');
        activateSideBar(true);
    }
}

//set up listerner for resizing window
window.addEventListener('resize',checkWidth);


const sideBarCallback = async ()=>{
    var wrapper = elements.waterWrapper;
    if(!state.sidebar){
        //expand sidebar
        document.querySelector('.sidebar').style.width= "200px";
        //wait for animation
        await (function(ms){
            return new Promise(resolve => setTimeout(resolve, ms));
        })(300);
        //show water content
        fadeIn(wrapper);
        state.sidebar = !state.sidebar;
        //switch icon into return
        document.querySelector('.mobile_water_btn').innerHTML = 
        `<ion-icon name="arrow-forward" class="mobile_return"></ion-icon>`;
        
    }else{
        //hide water content
        fadeOut(wrapper);
        //wait for animation
        await (function(ms){
            return new Promise(resolve => setTimeout(resolve, ms));
        })(300);
        //hide sidebar
        document.querySelector('.sidebar').style.width=0;
        //wait for animation
        state.sidebar = !state.sidebar;
        document.querySelector('.mobile_water_btn').innerHTML = 
        `<ion-icon name="water" class="mobile_water"></ion-icon>`;
    }
}

//event listener for collapsable water section
//in mobile version
const activateSideBar = (activate)=>{
    if(activate){
        elements.mobileWater.style.display = 'block';
        elements.mobileWater.addEventListener('click',sideBarCallback);
        elements.mainContainer.classList.add('hiddenSidebar');
        elements.profileView.classList.add('sidebar');
        console.log('sidebar activated');
    }else{
        elements.mobileWater.style.display = 'none';
        elements.mobileWater.removeEventListener('click',sideBarCallback);
        elements.mainContainer.classList.remove('hiddenSidebar');
        elements.profileView.classList.remove('sidebar');
    }
}
