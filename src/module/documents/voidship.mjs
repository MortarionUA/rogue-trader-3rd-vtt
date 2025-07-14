import { RogueTraderBaseActor } from './base-actor.mjs';
import { DHTargetedActionManager } from '../actions/targeted-action-manager.mjs';
import { SimpleSkillData } from '../rolls/action-data.mjs';
import { prepareSimpleRoll } from '../prompts/simple-prompt.mjs';
import { prepareCrewRoll } from '../prompts/crew-prompt.mjs';

export class RogueTraderVoidship extends RogueTraderBaseActor {

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);
        let initData = {
            "token.bar1": { "attribute": "hull" },
            "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "token.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "token.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,
            "token.name": data.name
        }
        this.updateSource(initData)
    }

    async prepareData() {
        await super.prepareData();
    }

    get faction() {
        return this.system.faction;
    }
    get subfaction() {
        return this.system.subfaction;
    }
    get subtype() {
        return this.system.type;
    }
    get threatLevel() {
        return this.system.threatLevel;
    }

    async rollItem(itemId) {
        const item = this.items.get(itemId);
        const character = game.user.character;
        if(!character) {
            ui.notifications.warn('Vehicle items are rolled using the current users\' character. However, no character found.');
            return;
        }

        game.rt.log(`Vehicle ${this.name} is rolling ${item.name} for character ${character.name}`);
        switch (item.type) {
            case 'weapon':
                await DHTargetedActionManager.performWeaponAttack(character, null, item);
                return;
            default:
                return ui.notifications.warn(`No actions implemented for item type: ${item.type}`);
        }
    }

    async rollCrew(crewActionName, opBonus) {
        const simpleSkillData = new SimpleSkillData();
        const rollData = simpleSkillData.rollData;
        rollData.actor = this;
        rollData.nameOverride = crewActionName;
        rollData.type = 'Skill';
        rollData.baseTarget = this.system.crewRating;
        rollData.modifiers.modifier = 0;
        rollData.modifiers.opBonus = opBonus ? opBonus : 0;
        await prepareCrewRoll(simpleSkillData);
    }
}
