import { DarkHeresyItemSheet } from './item-sheet.mjs';

export class DarkHeresyGearSheet extends DarkHeresyItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 820,
            height: 575,
            tabs: [{ navSelector: '.rt-navigation', contentSelector: '.rt-body', initial: 'stats' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/item/item-gear-sheet.hbs`;
    }
}
