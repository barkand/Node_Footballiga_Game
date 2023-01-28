import {
  GetTeamCard,
  SetTeam,
  CheckTeamName,
  GetTeamName,
} from "../business/team";

import { uploadImage } from "../../core";
import { verifyToken } from "../../admin";

class GameController {
  teamCard = async (req: any, res: any) => {
    let { user_id, token } = req.cookies;
    let { params } = req.body;
    let { lang } = params;
    if (user_id === undefined) user_id = "";

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result: any = await GetTeamCard(lang, user_id);
    res.status(_result.code).send(_result);
  };

  saveTeam = async (req: any, res: any) => {
    let { user_id, token } = req.cookies;
    let { params } = req.body;
    let { name, teams } = params;
    if (user_id === undefined) user_id = "";

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result: any = await SetTeam(user_id, name, teams.slice(0, 5));
    res.status(_result.code).send(_result);
  };

  checkTeamName = async (req: any, res: any) => {
    let { user_id, token } = req.cookies;
    let { params } = req.body;
    let { name } = params;
    if (user_id === undefined) user_id = "";

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result = await CheckTeamName(user_id, name);
    res.status(_result.code).send(_result);
  };

  uploadImage = async (req: any, res: any) => {
    const { user_id, token } = req.cookies;
    const image = req.files.file;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result: any = await uploadImage(image, "teams", user_id);
    res.status(_result.code).send(_result);
  };

  getTeamName = async (req: any, res: any) => {
    let { user_id, token } = req.cookies;
    if (user_id === undefined) user_id = "";

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) {
      res.status(_verify.code).send(_verify);
      return;
    }

    let _result: any = await GetTeamName(user_id);
    res.status(_result.code).send(_result);
  };
}

export default new GameController();
