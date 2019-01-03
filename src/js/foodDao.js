export const getDayLog = async (date)=>{
    var fb = firebase.auth();
    await (function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    })(350);
    var user_id = fb.currentUser.uid;
    //get the metadata of each meals of the date
    return getFoodMetaData(date,user_id);
}

export const updateWater = async (num,date)=>{
    var fb = firebase.auth();
    await (function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    })(350);
    var user_id = fb.currentUser.uid;
    var storageRef = firebase.storage().ref();
    var path = `${user_id}/${date.year}/${date.month}/${date.day}`;
    var fooRef = storageRef.child(path+'/foo.txt');
    return fooRef.getMetadata().then(async metadata=>{
        console.log(num);
        metadata.customMetadata.Water = num.toString();
        await fooRef.updateMetadata(metadata).then(metadata=>{
            console.log("water updated!");
        }).catch(error=>{
            console.log(error.code);
        });
    }).catch(error=>{
        //create new foo.txt of the day
        uploadNewMeta(path+'/foo.txt');
    });
}

var uploadNewMeta = (dayPath)=>{
    var storageRef = firebase.storage().ref();
    //create new foo.txt of the day
    var file = new File(["fooo"], "foo.txt", {
        type: "text/plain",
      });
      var metadata = {
          customMetadata:{
            'Breakfast': 'false',
            'Lunch': 'false',
            'Dinner': 'false',
            'Snacks': 'false',
            'Water': '0'
          }
      };
      const uploadTask = storageRef.child(dayPath).put(file,metadata);
      uploadTask.on('state_changed', function(snapshot){},function(error){
        console.log(error);
        console.log("can't upload new daylog for metadata");
      }, function(){
      });
}

//only get cups from db, or create new foo if non-exist
var getWaterMetaData = async (date,uid)=>{
    var storageRef = firebase.storage().ref();
    var path = `${uid}/${date.year}/${date.month}/${date.day}`;
    var pkg = {
        Breakfast:[],
        Lunch:[],
        Dinner:[],
        Snacks:[],
        Water: 0
    };
    var cups=0;
    var fooRef = storageRef.child(path+'/foo.txt');
    await fooRef.getMetadata().then(metadata=>{
        cups = parseInt(metadata.customMetadata.Water);
    }).catch(error=>{
        //create new foo.txt of the day
        uploadNewMeta(dayPath);
    });
    return cups;
}

//return metadata of each meals of the date
var getFoodMetaData = async (date,uid)=>{
    var storageRef = firebase.storage().ref();
    var path = `${uid}/${date.year}/${date.month}/${date.day}`;
    var types = ['Breakfast','Lunch','Dinner','Snacks'];
    var meals = [];
    var pkg = {
        Breakfast:[],
        Lunch:[],
        Dinner:[],
        Snacks:[],
        Water: 0
    };
    //get the metadata of the day to see what meals folder to look into
    var fooRef = storageRef.child(path+'/foo.txt');
    await fooRef.getMetadata().then(metadata=>{
        console.log(metadata.customMetadata);
        for(var i=0;i<4;i++){
            var j = types[i];
            var temp = metadata.customMetadata[j];
            if(temp=='true'){
                meals.push(j);
            }
        }
        console.log("water db:" + metadata.customMetadata.Water);
        pkg.Water = parseInt(metadata.customMetadata.Water);
    }).catch(error=>{
    });
    for(var i=0;i<meals.length;i++){
        var type = meals[i];
        var fooRef = storageRef.child(path+`/${type}/foo.txt`);
        await fooRef.getMetadata().then(function(metadata){
            var nameArr = metadata.customMetadata.names;
            nameArr = nameArr.split("+");
            var urlArr = metadata.customMetadata.urls;
            urlArr = urlArr.split(" ");
            //last element will always be empty
            for(var j=0;j<nameArr.length-1;j++){
                var temp = {
                    name: nameArr[j],
                    url: urlArr[j]
                };
                pkg[type].push(temp);
            }
        }).catch(function(error){
        });
    }
    return pkg;
}


//moved from headerView
//upload food img, date and type to firebase
export const uploadFood = (foodFile)=>{
    var storageRef = firebase.storage().ref();
    //get current user id
    var user_id = firebase.auth().currentUser.uid;
    //get current date
    var date = foodFile.date;
    var path = `${user_id}/${date}/${foodFile.foodType}/${foodFile.name}`;
    var metadata = {
        name: foodFile.name
    }
    const uploadTask = storageRef.child(path).put(foodFile.file,metadata);
    uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
        switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              alert('no permission!');
              break;
        
            case 'storage/canceled':
              // User canceled the upload
              alert('upload canceled');
              break;
    
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              alert('unknown error during upload');
              break;
          }
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
          updateDayLog(`${user_id}/${date}/foo.txt`,foodFile.foodType);
          updateMealLog(`${user_id}/${date}/${foodFile.foodType}/foo.txt`,downloadURL,foodFile.name); 
        });
      });
}


var updateDayLog = (dayPath,foodType) => {
    var storageRef = firebase.storage().ref();
    var fileRef = storageRef.child(dayPath);
    fileRef.getDownloadURL().then(url=>{
        fileRef.getMetadata().then(metadata=>{
            metadata.customMetadata[foodType] = 'true';
            fileRef.updateMetadata(metadata).then(function(metadata){
                //do nothing 
            }).catch(function(error) {
                console.log("can't update metadata");
            });
        }).catch(error=>{
            console.log(error);
        });
    }).catch(error=>{
        switch(error.code){
            case 'storage/object-not-found':
              // File doesn't exist, create a new one
              var file = new File(["fooo"], "foo.txt", {
                type: "text/plain",
              });
              var metadata = {
                  customMetadata:{
                    'Breakfast': 'false',
                    'Lunch': 'false',
                    'Dinner': 'false',
                    'Snacks': 'false',
                    'Water': '0'
                  }
              };
              metadata.customMetadata[foodType] = 'True';
              const uploadTask = storageRef.child(dayPath).put(file,metadata);
              uploadTask.on('state_changed', function(snapshot){},function(error){
                console.log(error);
                console.log("can't upload new daylog for metadata");
              }, function(){
                updateDayLog(dayPath,foodType);
              });
        }
    });
}

//use firebase metadata to stores urls to each food object
var updateMealLog = (dayPath,imgUrl,foodName) =>{
    //check in firebase whether log was created for that day
    var storageRef = firebase.storage().ref();
    var fileRef = storageRef.child(dayPath);
    fileRef.getDownloadURL().then(url=>{
        //update its metadata
        fileRef.getMetadata().then(function(metadata){
            metadata.customMetadata.urls+=(imgUrl.toString()+' ');
            metadata.customMetadata.names+=(foodName+'+');
            console.log(metadata.customMetadata.names);
            fileRef.updateMetadata(metadata).then(function(metadata){
                //refresh the page
                location.href = '/index.html';
            }).catch(function(error) {
                console.log("can't update metadata");
              });
        }).catch(function(error){
            console.log("failed getting metadata: "+error);
        });
    }).catch(error=>{
        console.log('error code: '+error.code);
        switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist, create a new one
              var file = new File(["fooo"], "foo.txt", {
                type: "text/plain",
              });
              //should handle upload error too
              var metadata = {
                customMetadata:{
                    'urls': '',
                    'names': ''
                }
              };
              const uploadTask = storageRef.child(dayPath).put(file,metadata);
              uploadTask.on('state_changed', function(snapshot){},function(error){
                console.log(error);
                console.log("can't upload new daylog for metadata");
              }, function(){
                updateMealLog(dayPath,imgUrl,foodName);
              });
              break;
        
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
        
            case 'storage/canceled':
              // User canceled the upload
              break;
        }
    });
}