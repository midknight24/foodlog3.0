import {elements} from './base';

export const renderWater = (numCups) => {
    //add class 'taken' to water element
    //given the number of cups of water drunk
    let firstRow = (numCups>4)?  4:numCups;
    let secondRow = (numCups>4)? numCups-4:0;
    for(let i=0;i<firstRow;i++){
        elements.waterView.children[0].children[i].classList.add('taken');
    }
    for(let i=0;i<secondRow;i++){
        elements.waterView.children[1].children[i].classList.add('taken');
    }
}

export const resetWater = () => {
    for(let i=0;i<2;i++){
        for(let j=0;j<4;j++){
            elements.waterView.children[i].children[j].classList.remove('taken');
        }
    }
}

export const addWater = (nth) => {
    const i = (nth>4)? 1:0;
    const j = (nth>4)? nth-5:nth-1;
    elements.waterView.children[i].children[j].classList.add('taken');
}

export const removeWater = (nth) => {
    const i = (nth>4)? 1:0;
    const j = (nth>4)? nth-5:nth-1;
    elements.waterView.children[i].children[j].classList.remove('taken');
}


export const toggleBtn = ()=>{
    var add = elements.addWater;
    var remove = elements.removeWater;
    add.disabled = !add.disabled;
    remove.disabled = !remove.disabled;
}

