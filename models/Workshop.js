import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  // will be added later
});
const Workshop = mongoose.model("Workshop", workshopSchema);
export default Workshop;
