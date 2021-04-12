import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id,sender_id, type, amount, description }: ICreateStatementDTO) {

    let user =  await this.usersRepository.findById(user_id);;
    if(sender_id){
      user = await this.usersRepository.findById(sender_id);
    }

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }


    if(type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id: user.id as string});

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
      amount = -amount;
    }

    if(sender_id){
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });
      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }

      await this.statementsRepository.create({
        user_id: sender_id,
        sender_id: user_id,
        type,
        amount,
        description
      });
    }

    if(type === 'transfer') {
      amount = -amount;
    }


    const statementOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }
}
