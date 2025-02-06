const { render } = require('ejs');
const Listing = require('../models/listing');

const index  =async(req,res)=>{

    try{
    const listings = await Listing.find().populate('owner')//find all the owner properties
    console.log(listings);
    res.render('listings/index.ejs',{
        title:"listing",listings
    });

}
    catch (error) {
        console.log(error);
        res.redirect('/')
    }



}


const newListing= (req,res)=>{

try{
    
    res.render('listings/new.ejs',{
        title:"Add listing",
    });

}
    catch (error) {
        console.log(error);
        res.redirect('/')
    }



}

const addList = async(req,res)=>{
    try {
        req.body.owner=req.session.user._id
        await Listing.create(req.body);
        res.redirect('/listings');





        
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }

}

const show =async(req,res)=>{
try {

    const listing= await Listing.findById(req.params.listingId).populate('owner');
    console.log(listing);
    res.render('listings/show.ejs',{title:"Listing",listing})



} catch (error) {
    console.log(error);
    res.redirect('/');
}

}


const deleteListing =async (req,res)=>{
    try {
        const listing = await Listing.findById(req.params.listingId)
        if(listing.owner.equals(req.params.userId)){

            await listing.deleteOne()
            res.redirect('/listings')
        }
        else{

            res.send("You dont have permission to do that");
        }




    } catch (error) {
       console.log(error); 
       res.redirect('/')
    }

}


const edit =async(req,res)=>{
try {
    const listing= await Listing.findById(req.params.listingId).populate('owner');
    if(listing.owner.equals(req.params.userId)){
        res.render('listings/edit.ejs',{
            title:`Edit ${listing.streetAddress}`, listing
        })
         
    }
    else{

        res.send('You dont have permission to do that');
    }
    

} catch (error) {
    
    console.log(error);
    res.redirect('/');
}


}


const update  =async(req,res)=>{
    try {

        const listing= await Listing.findByIdAndUpdate(
            req.params.listingId,
            req.body,
            {new:true}
        );
        
        res.redirect(`/listings/${req.params.listingId}`);
        
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }


}



module.exports ={

    index,
    newListing,
    addList,
    show,
    deleteListing,
    edit,
    update,
}