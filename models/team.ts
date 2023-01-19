import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teamsSchema = new Schema({
  id: { type: Number },
  user_id: { type: String },
  name: { type: String },
  code: { type: Number },
  avatar: { type: Boolean },
  players: { type: Array },
});

export default mongoose.model("Teams", teamsSchema);
