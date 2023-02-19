import { Teams } from "../models";

import logger from "../../log";
import { response } from "../../core";
import { Buys, Products } from "../../market/models";

const path = "Game>Business>team>";

const GetTeamCard = async (lang: string, user_id: string) => {
  try {
    let _players: any =
      (await Teams.findOne({ user_id: user_id }))?.players ?? [];
    let _buys: any = await Buys.find({ user_id: user_id, soled: false });
    let _buys_ids: any = _buys.map((x: any) => x.product_id);

    let _cards = await Products.find({
      id: { $in: _buys_ids.filter((n: any) => !_players.includes(n)) },
    });

    let cards: any = [];
    for (let i = 0; i < _cards.length; i++) {
      cards.push({
        id: _cards[i].id,
        name: lang === "en" ? _cards[i].nameEn : _cards[i].nameFa,
        image: `${_cards[i].cardEn?.toLowerCase()}/${_cards[i].code}.png`,
        for_sale: _buys.find((n: any) => n.product_id === _cards[i].id)
          .for_sale,
      });
    }

    let _teams = await Products.find({ id: { $in: _players } });
    let teams: any = [];
    for (let i = 0; i < _teams.length; i++) {
      teams.push({
        id: _teams[i].id,
        name: lang === "en" ? _teams[i].nameEn : _teams[i].nameFa,
        image: `${_teams[i].cardEn?.toLowerCase()}/${_teams[i].code}.png`,
        for_sale: _buys.find((n: any) => n.product_id === _teams[i].id)
          .for_sale,
      });
    }

    return { ...response.success, data: { cards: cards, teams: teams } };
  } catch (e: any) {
    logger.error(`${path}GetTeamCard: ${e}`);
    return response.error;
  }
};

const SetTeam = async (user_id: string, teamName: string, teams: any) => {
  try {
    let _team = await Teams.findOne({ user_id: user_id });
    let _checkName = await CheckTeamName(user_id, teamName);
    if (_checkName.code !== 200) return _checkName;

    if (!_team) {
      _team = await Teams.create({
        user_id: user_id,
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

const CheckTeamName = async (user_id: string, teamName: string) => {
  try {
    let team: any = await Teams.findOne({
      name: teamName,
      user_id: { $ne: user_id },
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

const GetTeamName = async (user_id: string) => {
  try {
    let team: any = await Teams.findOne({ user_id: user_id });
    let teamName = team ? team.name : "";

    return { ...response.success, data: { teamName: teamName } };
  } catch (e: any) {
    logger.error(`${path}GetTeamName: ${e}`);
    return response.error;
  }
};

export { GetTeamCard, SetTeam, CheckTeamName, GetTeamName };
