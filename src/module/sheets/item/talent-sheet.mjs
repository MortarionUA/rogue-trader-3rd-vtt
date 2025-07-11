import { DarkHeresyItemSheet } from './item-sheet.mjs';

export class DarkHeresyTalentSheet extends DarkHeresyItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 820,
            height: 575,
            tabs: [{ navSelector: '.dh-navigation', contentSelector: '.dh-body', initial: 'stats' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/item/item-talent-sheet.hbs`;
    }
}
