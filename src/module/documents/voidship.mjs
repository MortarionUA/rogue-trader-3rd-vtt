import { RogueTraderBaseActor } from './base-actor.mjs';
import { DHTargetedActionManager } from '../actions/targeted-action-manager.mjs';
import { SimpleSkillData } from '../rolls/action-data.mjs';
import { prepareCrewRoll, prepareTurretsRoll} from '../prompts/crew-prompt.mjs';
import { DHBasicActionManager } from '../actions/basic-action-manager.mjs';

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

    hasTalent(talent) {
        return !!this.items.filter((i) => i.type === 'talent').find((t) => t.name === talent);
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

    async rollItem(itemId) {
        game.rt.log('RollItem', itemId);
        const item = this.items.get(itemId);
        switch (item.type) {
            case 'shipWeapon':
                if (!item.system.isDestroyed) {
                    ui.notifications.warn('Weapon is Destroyed and cannot shoot!');
                    return;
                }
                await DHTargetedActionManager.performShipWeaponAttack(this, null, item);
                return;
            default:
                await DHBasicActionManager.sendItemVocalizeChat({
                    actor: this.name,
                    name: item.name,
                    type: item.type?.toUpperCase(),
                    description: await TextEditor.enrichHTML(item.system.benefit ?? item.system.description, {
                        rollData: {
                            actor: this,
                            item: item,
                            pr: this.psy.rating
                        }
                    }),
                });
        }
    }
}
