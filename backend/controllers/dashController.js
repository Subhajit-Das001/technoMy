// const TeamModel = require('../models/teamModel');
const Onlinereg=require('../models/onlineReg')

const dashController = {
    listTeam: async (req, res) => {
        try {
            // const teams = await TeamModel.find({ cityrepID: req.body.cityrepId }).sort({city:1}); 
            const teams = await Onlinereg.find({ cityrepID: req.body.cityrepId }).sort({city:1});          
         
            res.status(200).json(teams);
        } catch (error) {
            
            res.status(500).json({ error: error.message });
        }
    },

    searchTeam: async(req,res)=>{
      try {
        // const team = await TeamModel.find({ rollNumber: req.body.rollnumber});  
        const team = await Onlinereg.find({ rollNumber: req.body.rollnumber});          
        
        res.status(200).json(team);
    } catch (error) {
        
        res.status(500).json({ error: error.message });
    }
},
    
};

module.exports = dashController;
