const ReportProcessing = require('CANBO/models/WardAndDistrict/ReportProcessing.js');
require('dotenv').config({ path: '../.env' });
const connectDB = require('../CANBO/db/connect');

async function addMethod() {
    await connectDB(process.env.MONGO_URI);

    // Traverse through all documents in the 'reportprocessings' collection and add 'processingMethod' field
    const reportprocessings = await ReportProcessing.find({}).lean();

    reportprocessings.forEach(async (doc) => {
        // Check if the 'processingMethod' field exists and is of type String
        if (typeof doc.processingMethod === 'undefined') {
            // Add the 'processingMethod' field to the document
            try {
                await ReportProcessing.findByIdAndUpdate(
                    doc._id,
                    { processingMethod: 'Chưa xử lý' },
                    { new: true }
                );
                console.log(`Document ${doc._id} updated successfully.`);
            } catch (updateError) {
                console.error(`Error updating document ${doc._id}: ${updateError}`);
            }
        }
    });
}
addMethod();
