import { getConnection, getCustomRepository } from "typeorm";
import { UserEntity } from "../database/entities/user.entity";
import { UserRepository } from "../repository/user.repository";
import dataSource from "../database/ormconfig";

export class UserService {
    private user_repository: UserRepository;

    constructor() {
        //this.user_repository = getConnection("default").getRepository(UserEntity);
        this.user_repository = dataSource.getRepository(UserEntity);
    }

    public index = async() => {
        const users = await this.user_repository.find();
        return users;
    }

    public get_user = async(id: string) => {
        let user = await this.user_repository.findOne({
            where: {
                id: id
            }
        });
        return user;
    }

    public create_user = async(user: UserEntity) => {
        const new_user = await this.user_repository.create(user);
        await this.user_repository.save(new_user);
        return new_user;
    }

    public update = async(user: UserEntity, id: string) => {
        const updated_user = await this.user_repository.update(id, user);
        return updated_user;
    }

    public delete = async (id: string) => {
        const deleted_user = await this.user_repository.delete(id);
        return deleted_user;
    }
}