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
    let { wallet, token } = req.cookies;
    let { params } = req.body;
    let { lang } = params;
    if (wallet === undefined) wallet = "";

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result: any = await GetTeamCard(lang, wallet);
    res.status(_result.code).send(_result);
  };

  saveTeam = async (req: any, res: any) => {
    let { wallet, token } = req.cookies;
    let { params } = req.body;
    let { name, teams } = params;
    if (wallet === undefined) wallet = "";

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result: any = await SetTeam(wallet, name, teams.slice(0, 5));
    res.status(_result.code).send(_result);
  };

  checkTeamName = async (req: any, res: any) => {
    let { wallet, token } = req.cookies;
    let { params } = req.body;
    let { name } = params;
    if (wallet === undefined) wallet = "";

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result = await CheckTeamName(wallet, name);
    res.status(_result.code).send(_result);
  };

  uploadImage = async (req: any, res: any) => {
    const { token, wallet } = req.cookies;
    const image = req.files.file;

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result: any = await uploadImage(image, "teams", wallet);
    res.status(_result.code).send(_result);
  };

  getTeamName = async (req: any, res: any) => {
    let { wallet, token } = req.cookies;
    if (wallet === undefined) wallet = "";

    let _verify = await verifyToken(token);
    if (_verify.code !== 200) res.status(_verify.code).send(_verify);

    let _result: any = await GetTeamName(wallet);
    res.status(_result.code).send(_result);
  };
}

export default new GameController();
