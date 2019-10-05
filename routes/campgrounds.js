var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
router.get("/",function(req,res){
	
	//Get all compgrounds from DB
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
})

router.post("/", middleware.isLoggedIn,function(req,res){
		 
	 //get data from form and add to campgrounds array
	 var name = req.body.name;
	 var image = req.body.image;
	 var desc = req.body.description;
	 var author = {
		 id: req.user._id,
		 username: req.user.username
	 }
	 var newCampground = {name: name, image: image, description: desc, author:author};
     console.log(req.user)
	 //Create a new Campground and save to DB
	 Campground.create(newCampground,function(err,newlyCreated){
		 if(err){
			 console.log(err);
		 }else{
			 console.log(newlyCreated);
			 res.redirect("/campgrounds");
		 }
	 })
})
	
router.get("/new",middleware.isLoggedIn,function(req,res){
	//find the campground by id
	res.render("campgrounds/new");
})


//Show- shows more info about one campground
router.get("/:id", function(req, res){
	//find the compground with the provided ID
	//render show template with that campground
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})
//Edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
				res.render("campgrounds/edit",{campground:foundCampground});
					
	}
)});


//update campground route 
router.put("/:id", middleware.checkCampgroundOwnership,function(req,res){
		   //find and update the correct campground
		   Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err, updatedCampground){
	if(err){
		res.redirect("/campgrounds");
	}else{
		res.redirect("/campgrounds/" + req.params.id);
	}
})
		   //redirect somewhere
		   })

//destroy campground router
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	})
})

module.exports = router;