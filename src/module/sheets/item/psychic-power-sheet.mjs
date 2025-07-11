import { DarkHeresyItemContainerSheet } from './item-container-sheet.mjs';

export class DarkHeresyPsychicPowerSheet extends DarkHeresyItemContainerSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 820,
            height: 575,
            tabs: [{ navSelector: '.rt-navigation', contentSelector: '.rt-body', initial: 'stats' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/item/item-psychic-power-sheet.hbs`;
    }
}
