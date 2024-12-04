const parkingSpot= require('../models/parkingSpot');

const controllers = {
    async getSpot(req,res){
        try {
            const spots = await parkingSpot.find();
            res.status(200).json({
                success: true,
                count: spots.length,
                data: spots
            });
        } catch (error) {
            res.status(500).json({message:error.message});
        }
    },
    async getSpotById(req,res){
        try {
            const spot = await parkingSpot.findById(req.params.id);
            if (!spot) {
                return res.status(404).json({
                    success: false,
                    message: 'Parking spot not found'
                });
            }
            res.status(200).json({
                success: true,
                data: spot
            });
        } catch (error) {
            res.status(500).json({message:error.message});
        }
    },
    async createSpot(req,res){
        try {
            const {spotNumber,level,type}= req.body;
            const spot = new parkingSpot({
                spotNumber,
                level,
                type
            });
            await spot.save();
            res.status(201).json({
                success: true,
                data: spot
            });
        } catch (error) {
            res.status(500).json({message:error.message});
        }
    },
    async updateSpot(req,res){
        try {
            const spot = await parkingSpot.findById(req.params.id);
            if (!spot) {
                return res.status(404).json({
                    success: false,
                    message: 'Parking spot not found'
                });
            }
            spot = await parkingSpot.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );
        
            res.status(200).json({
                success: true,
                data: spot
            });

        } catch (error) {
            res.status(500).json({message:error.message});
        }
    },
    async deleteSpot(req,res){
        try {
            const spot = await parkingSpot.findById(req.params.id);
            if (!spot) {
                return res.status(404).json({
                    success: false,
                    message: 'Parking spot not found'
                });
            }
            await spot.deleteOne();
            res.status(200).json({
                success: true,
                message: 'Parking spot deleted'
            });
        } catch (error) {
            res.status(500).json({message:error.message});
        }
    },
    async availableSpots(req,res){
        try {
            const spots = await parkingSpot.find({status:'available'});
            res.status(200).json({
                success: true,
                count: spots.length,
                data: spots
            });
        } catch (error) {
            res.status(500).json({message:error.message});
        }
    },
    async updateSpotStatus(req,res){
        try {
            const { status } = req.body;
    
            if (!['available', 'occupied', 'reserved', 'maintenance'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }
            const spot = await parkingSpot.findByIdAndUpdate(
                req.params.id,
                {
                    status,
                    lastUpdated: Date.now()
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        
            if (!spot) {
                return res.status(404).json({
                    success: false,
                    message: 'Parking spot not found'
                });
            }
        
            res.status(200).json({
                success: true,
                data: spot
            });
        }catch (error) {
            res.status(500).json({message:error.message});
        }
    }
}

module.exports = controllers;