import { Teams } from "../models";

import logger from "../../log";
import { response } from "../../core";
import { Buys, Products } from "../../market/models";

const path = "Game>Business>team>";

const GetTeamCard = async (lang: string, user: string) => {
  try {
    let _players: any = (await Teams.findOne({ user_id: user }))?.players ?? [];
    let _buys: any = (await Buys.find({ user_id: user })).map(
      (x: any) => x.product_id
    );

    let _cards = await Products.find({
      id: { $in: _buys.filter((n: any) => !_players.includes(n)) },
    });

    let cards: any = [];
    for (let i = 0; i < _cards.length; i++) {
      cards.push({
        id: _cards[i].id,
        name: lang === "en" ? _cards[i].nameEn : _cards[i].name,
        image: `${_cards[i].cardEn?.toLowerCase()}/${_cards[i].code}.png`,
      });
    }

    let _teams = await Products.find({ id: { $in: _players } });
    let teams: any = [];
    for (let i = 0; i < _teams.length; i++) {
      teams.push({
        id: _teams[i].id,
        name: lang === "en" ? _teams[i].nameEn : _teams[i].name,
        image: `${_teams[i].cardEn?.toLowerCase()}/${_teams[i].code}.png`,
      });
    }

    return { ...response.success, data: { cards: cards, teams: teams } };
  } catch (e: any) {
    logger.error(`${path}GetTeamCard: ${e}`);
    return response.error;
  }
};

const SetTeam = async (wallet: string, teamName: string, teams: any) => {
  try {
    let _team = await Teams.findOne({ user_id: wallet });
    let _checkName = await CheckTeamName(wallet, teamName);
    if (_checkName.code !== 200) return _checkName;

    if (!_team) {
      _team = await Teams.create({
        user_id: wallet,
        name: teamName,
        code: 1,
        players: teams,
        avatar: true,
      });
    } else {
      _team.name = teamName;
      _team.players = teams;
      _team.save();
    }
    return response.success;
  } catch (e: any) {
    logger.error(`${path}SetTeam: ${e}`);
    return response.error;
  }
};

const CheckTeamName = async (wallet: string, teamName: string) => {
  try {
    let team: any = await Teams.findOne({
      name: teamName,
      user_id: { $ne: wallet },
    });

    if (team) {
      return response.custom(300, "teamName Exist");
    } else {
      return response.success;
    }
  } catch (e: any) {
    logger.error(`${path}CheckTeamName: ${e}`);
    return response.error;
  }
};

const GetTeamName = async (wallet: string) => {
  try {
    let teamName = "";
    let team: any = await Teams.findOne({ user_id: wallet });
    if (team) teamName = team.name;

    return { ...response.success, data: teamName };
  } catch (e: any) {
    logger.error(`${path}GetTeamName: ${e}`);
    return response.error;
  }
};

export { GetTeamCard, SetTeam, CheckTeamName, GetTeamName };
