import { DarkHeresyItemSheet } from './item-sheet.mjs';

export class DarkHeresyJournalEntrySheet extends DarkHeresyItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 800,
            height: 350,
            tabs: [{ navSelector: '.dh-navigation', contentSelector: '.dh-body', initial: 'stats' }],
        });
    }

    get template() {
        return `systems/rogue-trader-3rd/templates/item/item-journal-entry-sheet.hbs`;
    }
}
