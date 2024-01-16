const Adsboard = require('CANBO\\models\\AdsBoard.js');
require('dotenv').config({ path: '../.env' });
const connectDB = require('../CANBO/db/connect');
async function convertDatetoString() {
    await connectDB(process.env.MONGO_URI);

    // Traverse through all documents in the 'adsboards' collection and update 'contractEndDate' field
    const adsboards = await Adsboard.find({}).lean();

    adsboards.forEach(async (doc) => {
        // Check if the 'contractEndDate' field exists and is of type Date
        if (doc.contractEndDate instanceof Date) {
            // Convert the 'contractEndDate' date to a string in dd/mm/yyyy format
            const formattedDate = doc.contractEndDate.toLocaleDateString('en-GB');

            // Update the document with the formatted date
            try {
                await Adsboard.findByIdAndUpdate(
                    doc._id,
                    { contractEndDate: formattedDate },
                    { new: true }
                );
                console.log(`Document ${doc._id} updated successfully.`);
            } catch (updateError) {
                console.error(`Error updating document ${doc._id}: ${updateError}`);
            }
        }
    });
}
convertDatetoString();
