import { recursiveUpdate } from '../rolls/roll-helpers.mjs';
import { WeaponActionData } from '../rolls/action-data.mjs';

export class AssignDamageDialog extends FormApplication {

    constructor(assignDamageData = {}, options = {}) {
        super(assignDamageData, options);
        this.data = assignDamageData;
        this.initialized = false;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: 'Assign Damage',
            id: 'rt-assign-damage-dialog',
            template: 'systems/rogue-trader-3rd/templates/prompt/assign-damage-prompt.hbs',
            width: 500,
            closeOnSubmit: false,
            submitOnChange: true,
            classes: ['dialog'],
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('#assign-damage').click(async (ev) => await this._assignDamage(ev));
        html.find('#cancel-prompt').click(async (ev) => await this._cancelPrompt(ev));
    }

    async getData() {
        await this.data.update();
        return this.data;
    }

    async _updateObject(event, formData) {
        game.rt.log('_updateObject', { event, formData });
        recursiveUpdate(this.data, formData);
        game.rt.log('_updateObject complete', { 'data': this.data, formData });
        await this.data.update();
        this.render(true);
    }

    async _cancelPrompt(event) {
        await this.close();
    }

    async _assignDamage(event) {
        await this.data.finalize();
        await this.data.performActionAndSendToChat();
        await this.close();
    }
}

export async function prepareAssignDamageRoll(assignDamageData) {
    const prompt = new AssignDamageDialog(assignDamageData);
    prompt.render(true);
}
