/**
 * ---------- todos ----------
 * 1.create (automated at backend), update route to be made for frontend 
 * 2.find all 
 * 3.find one by creator
 * 4.find one by business
 * 5.find by date
 * 6.find by deal value
 * 7.find by business type
 * 8.find by creator type
 * 9.find by platform
 * 10.find by target customers
 * 11.find by location
 * 12.update partnership
 * 13.delete partnership
 * 14.Premium partnerships
 */

const express = require("express");
const router = new express.Router();
const partnershipController = require('../../Controllers/partnershipController');


// Add authenticate middle ware here please 

// Create a new partnership
router.post("/create_partnership", partnershipController.createPartnership);
router.get('/find_all', partnershipController.findAll);
router.get('/find_by_creator/:creator', partnershipController.findOneByCreator);
router.get('/find_by_business/:businessid', partnershipController.findOneByBusiness);
router.get('/find_by_date/:date', partnershipController.findByDate);
router.get('/find_by_deal_value/:dealvalue', partnershipController.findByDealValue);
router.get('/find_by_business_type/:businesstype', partnershipController.findByBusinessType);
router.get('/find_by_creator_type/:creatortype', partnershipController.findByCreatorType);
router.get('/find_by_platform/:platform', partnershipController.findByPlatform);
router.get('/find_by_target_audience/:targetaudience', partnershipController.findByTargetAudience);
router.get('/find_by_content_type/:contenttype', partnershipController.findByContentType);
router.get('/find_by_location/:location', partnershipController.findByLocation);
router.get('/find_in_premium_list', partnershipController.findInPremiumList);
router.put('/update_creator/:id', partnershipController.updateCreator);
router.put('/delete_creator/:id', partnershipController.deleteCreator);




module.exports = router

