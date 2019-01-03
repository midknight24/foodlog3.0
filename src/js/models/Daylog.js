export default class Daylog{
	constructor(date,user){
		this.date = date;
        this.user = user;
        this.meals = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        };
    }

    addFood(food){
        switch(food.type){
            case breakfast:
                this.meals.breakfast.push(food);
                break;
            case lunch:
                this.meals.lunch.push(food);
                break;
            case dinner:
                this.meals.dinner.push(food);
                break;
            case snacks:
                this.meals.snacks.push(food);
                break;
        }
    }


}