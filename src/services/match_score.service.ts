import { getConnection } from 'typeorm';
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

export class MatchScoreService {
    private tournament_repository: TournamentRepository;
    private day_repository: DaysRepository;
    private match_repository: MatchRepository;
    private wrestler_repository: WrestlerRepository;
    private match_score_repository: MatchScoreRepository;
    private technique_repository: TechniqueRepository;
    private ranking_repository: RankingsRepository;

    constructor() {
        this.tournament_repository = getConnection("default").getRepository(TournamentEntity);
        this.day_repository = getConnection("default").getRepository(DaysEntity);
        this.match_repository = getConnection("default").getRepository(MatchEntity);
        this.wrestler_repository = getConnection("default").getRepository(WrestlerEntity);
        this.match_score_repository = getConnection("default").getRepository(MatchScores);
        this.technique_repository = getConnection("default").getRepository(TechniqueEntity)
        this.ranking_repository = getConnection("default").getRepository(RankingsEntity);
    }

    public index = async() => {
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

    public get_match_score = async(match_id: string) => {
        let res = await getConnection("default").createQueryBuilder()
            .relation(MatchEntity, "match")
            .of(match_id)
            .loadOne();
        return res;
    }

    public create_match_score = async(match_id: string) => {
        let match = await this.match_repository.findOne(match_id) as MatchEntity;
        let day = match.day as DaysEntity;
        let tournament = day.tournament as TournamentEntity;
        let winning_wrestler = "";
        if (match.win1 === 1) {
            winning_wrestler = match.idWrestler1;
        } else {
            winning_wrestler = match.idWrestler2;
        }
        this.calculate_score(match.idWrestler1, match.idWrestler2, match.win1, match.win2);
    }

    private calculate_score = async(wrestler1: string, wrestler2: string, win1: number, win2: number) => {
        let rank1 = await this.ranking_repository.findOne({ idWrestler: wrestler1 }) as RankingsEntity;
        let rank2 = await this.ranking_repository.findOne({ idWrestler: wrestler2 }) as RankingsEntity;
        console.log("RANK 1: " + rank1 + " RANK 2: " + rank2);
    }
}