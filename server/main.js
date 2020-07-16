import { Meteor } from 'meteor/meteor';

Images=new Mongo.Collection("Images");

Meteor.startup(() => {
if(Images.find().count()==0){
	for(var i=1; i<=7; i++){
		if(i==1 || i==6){
		 Images.insert({img_src:"img_"+i+".jpg", data:" "});
		}
		else{
		 Images.insert({img_src:"img_"+i+".png", data:" "});	
		}
	}
	console.log(Images.find().count());
}// code to run on server at startup
});
