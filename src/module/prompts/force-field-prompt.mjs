import { recursiveUpdate } from '../rolls/roll-helpers.mjs';
import { WeaponActionData } from '../rolls/action-data.mjs';

export class ForceFieldDialog extends FormApplication {

    constructor(forceFieldData = {}, options = {}) {
        super(forceFieldData, options);
        this.data = forceFieldData;
        this.initialized = false;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: 'Force Field',
            id: 'rt-force-field-dialog',
            template: 'systems/rogue-trader-3rd/templates/prompt/force-field-prompt.hbs',
            width: 500,
            closeOnSubmit: false,
            submitOnChange: true,
            classes: ['dialog'],
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('#roll-force-field').click(async (ev) => await this._rollForceField(ev));
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

    async _rollForceField(event) {
        if(!this.data.forceField.system.activated) {
            ui.notifications.warn(`Force Field not activated!`);
            return;
        }

        if(this.data.forceField.system.overloaded) {
            ui.notifications.warn(`Force Field currently overloaded!`);
            return;
        }

        await this.data.finalize();
        await this.data.performActionAndSendToChat();
        await this.close();
    }
}

export async function prepareForceFieldRoll(forceFieldData) {
    const prompt = new ForceFieldDialog(forceFieldData);
    prompt.render(true);
}
