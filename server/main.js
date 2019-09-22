import { Meteor } from 'meteor/meteor';
Images = new Mongo.Collection("images");
console.log(Images.find().count());
Meteor.startup(() => {
	if(Images.find().count()==0){
		for(var i=1; i<=10; i++){
			Images.insert(
				{
					img_src:"img"+i+".jpg",
					alt:"img"+i
				}
			);//end of insert			
		}//end of for loop

	}//end of if statement
console.log(Images.find().count());// code to run on server at startup
});
