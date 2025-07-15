import { RogueTraderBaseActor } from './base-actor.mjs';
import { SimpleSkillData } from '../rolls/action-data.mjs';
import { prepareCrewRoll, prepareTurretsRoll} from '../prompts/crew-prompt.mjs';

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

    async rollCrew(crewActionName, operator) {
        const simpleSkillData = new SimpleSkillData();
        const rollData = simpleSkillData.rollData;
        rollData.actor = this;
        rollData.nameOverride = crewActionName;
        rollData.type = 'Check';
        rollData.baseTarget = this.system.crewRating;
        switch (crewActionName){
            case "Maneuver": {
                rollData.baseTarget = rollData.baseTarget + (this.system.maneuverability ? this.system.maneuverability : 0);
                break;
            }
            case "Detection": {
                rollData.baseTarget = rollData.baseTarget + (this.system.detection ? this.system.detection : 0);
                break;
            }
        }
        rollData.modifiers.modifier = 0;
        rollData.modifiers.operator = operator ? operator : 0;
        await prepareCrewRoll(simpleSkillData);
    }

    async rollTurrets() {
        const simpleSkillData = new SimpleSkillData();
        const rollData = simpleSkillData.rollData;
        rollData.actor = this;
        rollData.nameOverride = "Turrets";
        rollData.voidshipTurrets = true;
        rollData.type = 'Check';
        rollData.baseTarget = this.system.crewRating;
        rollData.turretsShot = this.system.turrets;
        rollData.modifiers.modifier = 0;
        await prepareTurretsRoll(simpleSkillData);
    }

    async rollWeapons(operator, weapon) {
        if (!weapon) {
            ui.notifications.warn("No weapon selected.");
            return;
        }
        const targetingData = this.createSourceAndTargetData(source, target);

        const simpleSkillData = new SimpleSkillData();
        const rollData = simpleSkillData.rollData;
        rollData.actor = this;
        rollData.nameOverride = "Turrets";
        rollData.voidshipTurrets = true;
        rollData.type = 'Check';
        rollData.baseTarget = this.system.crewRating;
        rollData.turretsShot = this.system.turrets;
        rollData.modifiers.modifier = 0;
        await prepareWeaponsRoll(simpleSkillData);
    }
}
