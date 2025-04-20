import { createQueryBuilder, getConnection } from 'typeorm';
import { TournamentEntity } from '../database/entities/tournament.entity';
import { DaysEntity } from '../database/entities/day.entity';
import { MatchEntity } from '../database/entities/matches.entity';
import { MatchScores } from '../database/entities/match_scores';
import { TournamentRepository } from '../repository/tournament.repository';
import { DaysRepository } from '../repository/day.repository';
import { MatchRepository } from '../repository/matches.repository';
import { WrestlerRepository } from '../repository/wrestler.repository';
import { WrestlerEntity } from '../database/entities/wrestler.entity';
import { MatchScoreRepository } from '../repository/match_score.repository';
import { TechniqueRepository } from '../repository/techniques.repository';
import { TechniqueEntity } from '../database/entities/techniques.entity';
import { RankingsRepository } from '../repository/rankings.repository';
import { RankingsEntity } from '../database/entities/rankings.entity';
import Rank from '../ranks/rank.enum';
import dataSource from '../database/ormconfig';

export class MatchScoreService {
    private tournament_repository: TournamentRepository;
    private day_repository: DaysRepository;
    private match_repository: MatchRepository;
    private wrestler_repository: WrestlerRepository;
    private match_score_repository: MatchScoreRepository;
    private technique_repository: TechniqueRepository;
    private ranking_repository: RankingsRepository;

    constructor() {
        // this.tournament_repository = getConnection("default").getRepository(TournamentEntity);
        // this.day_repository = getConnection("default").getRepository(DaysEntity);
        // this.match_repository = getConnection("default").getRepository(MatchEntity);
        // this.wrestler_repository = getConnection("default").getRepository(WrestlerEntity);
        // this.match_score_repository = getConnection("default").getRepository(MatchScores);
        // this.technique_repository = getConnection("default").getRepository(TechniqueEntity);
        // this.ranking_repository = getConnection("default").getRepository(RankingsEntity);
        this.tournament_repository = dataSource.getRepository(TournamentEntity);
        this.day_repository = dataSource.getRepository(DaysEntity);
        this.match_repository = dataSource.getRepository(MatchEntity);
        this.wrestler_repository = dataSource.getRepository(WrestlerEntity);
        this.match_score_repository = dataSource.getRepository(MatchScores);
        this.technique_repository = dataSource.getRepository(TechniqueEntity);
        this.ranking_repository = dataSource.getRepository(RankingsEntity);
    }

    public index = async () => {
        const match_scores = await this.match_score_repository.find();
        return match_scores;
    }

    public get_tournament_match_scores = async (tournament_id: string) => {
        let res = await getConnection("default").createQueryBuilder()
            .relation(TournamentEntity, "tourament")
            .of(tournament_id)
            .loadMany();
        return res;
    }

    public get_day_match_scores = async (day_id: string) => {
        let res = await getConnection("default").createQueryBuilder()
            .relation(DaysEntity, "day")
            .of(day_id)
            .loadMany();

        return res;
    }

    public get_match_score = async (match_id: string) => {

        let match = await this.match_repository.findOne({
            where: {
                id: match_id
            }
        });
        let res = await this.match_score_repository.createQueryBuilder('match_scores')
            .leftJoinAndSelect('match_scores.match', 'match')
            .where("match_scores.match.id = :matchId ", { matchId: match_id })
            .getOne();

        return res;
    }

    public create_match_score = async (match_id: string) => {
        let match = await this.match_repository.findOne({
            where: {
                id: match_id
            }
        }) as MatchEntity;
        // let day = await this.day_repository.createQueryBuilder()
        //                 .relation(MatchEntity, "day")
        //                 .of(match)
        //                 .loadOne();
        let day = match.day;
        let tournament = await this.tournament_repository.createQueryBuilder()
            .relation(MatchEntity, "tournament")
            .of(match)
            .loadOne();
        let winning_wrestler = match.wrestler1;
        let winning_technique = match.winTechniqueId;
        if (match.win2 === true) {
            winning_wrestler = match.wrestler2;
        }
        let score = await this.calculate_score(match.wrestler1, match.wrestler2, match.win1, match.win2, winning_technique);
        let match_score = await this.match_score_repository.create();
        match_score.day = day;
        match_score.match = match;
        match_score.tournament = tournament;
        let winner = await this.wrestler_repository.findOne({
            where: {
                id: winning_wrestler.id
            }
        }) as WrestlerEntity;
        match_score.wrestler = winner;
        match_score.score = score;
        await this.match_score_repository.save(match_score).catch(err => {
            console.error(err);
        });
        return match_score;
    }

    public recalculate_match_score = async (match_id: string) => {
        let match = await this.match_repository.findOne({
            where: {
                id: match_id
            }
        });
        let match_score = match!.match_score;
        let original_score = match_score.score ?? 0;
        let wrestler1 = match!.wrestler1;
        let wrestler2 = match!.wrestler2;
        let win1 = match!.win1;
        let win2 = match!.win2;
        let winTechniqueId = match!.winTechniqueId;
        let update = false;
        let new_score = await this.calculate_score(wrestler1, wrestler2, win1, win2, winTechniqueId)
        // let new_score = await this.calculate_score(wrestler1, wrestler2, win1, win2, winTechniqueId).then(res => {
        //     console.log("original score: " + original_score + " new score: " + res);
        //     if (original_score !== res) {
        //         console.log("need to update the score");
        //         update = true;
        //         match_score.score = res;
        //     }
        // });
        console.log("original score: " + original_score + " new score: " + new_score);
        if (original_score !== new_score) {
            console.log("need to update the score");
            update = true;
            match_score.score = new_score;
        }

        if (update) {
            await this.match_score_repository.update(match_score.id, { score: new_score }).then(() => {
                console.log("successful update");
            }).catch(err => {
                console.log(err)
            })
        }

        return match;
    }

    private calculate_score = async (wrestler1: WrestlerEntity, wrestler2: WrestlerEntity, win1: boolean, win2: boolean, winTechniqueId: string) => {
        let rank1 = await this.ranking_repository.findOne({ where: { idWrestler: wrestler1.id } }) as RankingsEntity;
        let rank2 = await this.ranking_repository.findOne({ where: { idWrestler: wrestler2.id } }) as RankingsEntity;
        console.log("RANK 1: " + rank1?.rank + " RANK 2: " + rank2?.rank);
        let i1 = Rank.indexOf(rank1?.rank);
        let i2 = Rank.indexOf(rank2?.rank);
        console.log("RANK 1: " + i1 + " RANK 2: " + i2);
        let score = 0;
        let tech = await this.technique_repository.findOne({
            where: {
                id: winTechniqueId
            }
        });
        //0 means they won; i should change this to boolean
        if (win1 === true) {
            let diff = i1 - i2;
            if (diff > 0) {
                score = 1 + (diff / 10);
            } else {
                score = 1;
            }
            console.log("wrestler 1 gets a score of: " + score);
        } else {
            let diff = i2 - i1;
            if (diff > 0) {
                score = 1 + (diff / 10);
            } else {
                score = 1;
            }
            console.log("wrestler 2 gets a score of: " + score);
        }
        return score;
    }
}