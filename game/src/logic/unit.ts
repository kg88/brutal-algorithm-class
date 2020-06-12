import * as csp from "../lib/csp";
import { log } from "./logger";
import { Unit, CardInit, CombatState, Action } from "./interfaces";

export interface UserControlFunctions {
  getChoiceFromUser(): Promise<string>;
}

export interface UserCommunications {
  actions: csp.Channel<Action>;
}

export class MainCharactor extends Unit {
  readonly myTurn: csp.Channel<undefined> = new csp.UnbufferredChannel();
  constructor(
    public name: string,
    cards: CardInit,
    // public choiceChan: csp.Channel<string>,
    // public userControlFunctions: UserControlFunctions,
    private userCommunications: UserCommunications
  ) {
    super(name, cards);
  }

  async takeAction(combatState: CombatState): Promise<Action> {
    console.log("main charactor needs to take action");
    await this.myTurn.put(undefined);
    const action = await this.userCommunications.actions.pop();
    if (!action) {
      throw new Error("unreachable");
    }
    console.log("game logic received", action);
    return action;
  }

  waitForTurn() {
    return this.myTurn;
  }
}

export class AIUnit extends Unit {
  readonly chan = csp.chan<undefined>();
  constructor(public name: string, cards: CardInit) {
    super(name, cards);
  }
  async takeAction(combatState: CombatState): Promise<Action> {
    log("AI is taking actions");
    await csp.sleep(1000);
    await this.chan.put(undefined);
    return {
      from: this,
      to: combatState.opponent,
      card: this.cards.hand[0],
    };
  }

  // There is no need to wait for AI.
  waitForTurn() {
    return this.chan;
  }
}
