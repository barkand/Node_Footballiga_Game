import express from "express";

import gameController from "../controllers/team";

const GameRouters = express.Router();
GameRouters.use(express.json());

GameRouters.get("/", (req: any, res: any) => {
  res.send(
    `
      /team-card
      /save-team
      /check-team
      /upload
      /get-team-name
    `
  );
});

GameRouters.post(`/team-card`, gameController.teamCard);
GameRouters.post(`/save-team`, gameController.saveTeam);
GameRouters.post(`/check-team`, gameController.checkTeamName);
GameRouters.post(`/upload`, gameController.uploadImage);
GameRouters.post(`/get-team-name`, gameController.getTeamName);

export default GameRouters;
