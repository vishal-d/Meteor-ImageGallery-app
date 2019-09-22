import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
Router.configure({
	layoutTemplate: 'applicationLayout'
});

Router.route('/', function () {
  this.render('welcome',{
  	to:"main"
  });
});

Router.route('/images', function () {
  this.render('navbar',{
  	to:"navbar"
  });
  this.render('greet',{
  	to:"note"
  });
  this.render('insert_img',{
  	to:"insert"
  });
  this.render('hello',{
  	to:"main"
  });
});
Images=new Mongo.Collection("images");
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
})
Template.hello.helpers({
		img:function(){
			if(Session.get("userFilter")){
			 return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn:-1,rating:-1}});
			}
			else {
			 return Images.find({}, {sort:{createdOn:-1,rating:-1}});	
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
				var user = Meteor.users.findOne({_id:Session.get("userFilter")});
				return user.username;
			}
			else{
				return false;
			}							
		},
		getUser:function(user_id){
			var user = Meteor.users.findOne({_id: user_id});
			if(user){
				return user.username;
			}
			else {
				return "Anonymous";
			}
		}
					});


Template.greet.helpers({username:function(){
	if(Meteor.user()){
		return Meteor.user().username;
		//return Meteor.user().emails[0].address;
	}
	else {
		return "anonymous internet user";
	}
}});

Template.hello.events({
	'click .js-del-img':function(event){
		var image_id = this._id;
		console.log(image_id);
		
		$("#"+image_id).hide('slow', function(){
			Images.remove({"_id":image_id});//this is a mongofilter
		});
	},

	'click .js-stars-img':function(event){
		
		var user_rating = $(event.currentTarget).data("userrating");
		console.log(user_rating);
		var image_id = this.id;
		console.log(image_id);
		Images.update({_id:image_id},
						{$set: {rating:user_rating}});
	},

	'click .js-set-image-filter':function(event){
		Session.set('userFilter', this.createdBy);
	},
	'click .js-unset-image-filter':function(event){
		Session.set('userFilter', undefined);
	}
})


Template.insert_img.events({
	'submit .js-user-insert':function(event){
		var src = event.target.imgsrc.value;
		if(Meteor.user()){
		Images.insert({
			img_src: src,
			createdOn: new Date(),
			createdBy: Meteor.user()._id
		});			
		}

		return false;
	}
})
