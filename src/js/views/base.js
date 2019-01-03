export const elements = {
    mainContainer: document.querySelector('.container'),
    searchView: document.querySelector('.search'),
    uploadForm: document.querySelector('.foodUpload_btn'),
    dateForm: document.querySelector('.changeDate_btn'),
    logView: document.querySelector('.log'),
    profileView: document.querySelector('.profile'),
    waterWrapper: document.querySelector('.water_wrapper'),
    waterView: document.querySelector('.water_tracker'),
    addWater: document.querySelector('.addWater_btn'),
    removeWater: document.querySelector('.removeWater_btn'),
    logout: document.querySelector('.logout'),
    date: document.getElementById('date'),
    mobileWater: document.querySelector('.mobile_water_btn')
};

export function fadeIn(el){
    el.classList.remove('hidden');
    el.classList.add('visible');
}

export function fadeOut(el){
    el.classList.remove('visible');
    el.classList.add('hidden');
}