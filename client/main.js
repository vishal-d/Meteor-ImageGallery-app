import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';

Images=new Mongo.Collection("Images");
//var post_data={data:"Hello"};
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});
Session.set("imageLimit", 8);
lastScrollTop=0;
$(window).scroll(function(event){
 //test if we are near to the bottom of the window
 if($(window).scrollTop()+$(window).height()>$(document).height()-100){
 	//test if we are going down
 	var scrollTop = $(this).scrollTop();
 	if(scrollTop>lastScrollTop){
 		Session.set("imageLimit", Session.get("imageLimit")+4);
 	}
 	lastScrollTop=scrollTop;
 }
});
Template.hello.helpers({
	                   //name:Images.find({},{sort:{createdOn:-1}})
	                   name:function(){
	                   	if(Session.get("userFilter")){
	                   		return Images.find({createdBy:Session.get("userFilter")});
	                   	}
	                   	else{
	                   		return Images.find({},{limit:Session.get("imageLimit")});	
	                   	}
	                   	
	                   },
	                   getUser:function(user_id){
	                   	var user = Meteor.users.findOne({"_id":user_id});
	                    if(user){
	                    	return user.username;
	                    }
	                    else{
	                    	return "Anonymous";
	                    }
	                   },
	                   filtering_images:function(){
	                   	if(Session.get("userFilter")){
	                   		return true;
	                   	}
	                   	else{
	                   		return false;
	                   	}
	                   },
	                   getFilterUser:function(){
	                   	if(Session.get("userFilter")){
	                   		var user = Meteor.users.findOne({"_id":Session.get("userFilter")});
	                   		return user.username;
	                   	}
	                   	else{
	                   		return false;
	                   	}
	                   },
	                  });
Template.hello.events({
	'click .js-del-image':function(event){
		var image_id = this._id;
		console.log(image_id);
		$("#"+image_id).hide('slow',function(){
			Images.remove({"_id":image_id});
		});
	},
	'submit .js-post-content':function(event){
		var data_content = event.target.val.value;
		console.log(data_content);
		Images.update({"_id":this._id},{$set:{data:data_content}});
		return false;
		//Data.insert({data:value});
	},
	'click .js-show-form':function(event){
		$("#image_form_modal").modal('show')
	},
	'click .js-set-filter':function(event){
		Session.set("userFilter", this.createdBy);
	},
	'click .js-unset-filter':function(event){
		Session.set("userFilter", undefined);
	}
});

Template.insert.events({
'submit .js-insert':function(event){
	var img_src = event.target.add_img_src.value;
	var img_content = event.target.add_img_content.value;
	if(Meteor.user()){
		Images.insert({img_src:img_src,
		 			data:img_content,
		  			createdOn:new Date(),
		  			createdBy:Meteor.user()._id});	
	}
	else{
	  Images.insert({img_src:img_src, data:img_content, createdOn:new Date()});	  	
	}
	
    return false;
},
});

Template.body.helpers({username:function(){

	if(Meteor.user()){

		return Meteor.user().username;
	}
	else{
		return "Anonymous person";
	}
}
});

