import { sendActionDataToChat } from '../rolls/roll-helpers.mjs';

export async function prepareCrewRoll(crewData) {
    const html = await renderTemplate('systems/rogue-trader-3rd/templates/prompt/crew-roll-prompt.hbs', crewData);
    let dialog = new Dialog(
        {
            title: 'Roll Modifier',
            content: html,
            buttons: {
                roll: {
                    icon: "<i class='rt-material'>casino</i>",
                    label: 'Roll',
                    callback: async (html) => {
                        const rollData = crewData.rollData;
                        rollData.modifiers['difficulty'] = parseInt(html.find('[id=difficulty] :selected').val());
                        rollData.modifiers['operator'] = html.find('#operator')[0].value;
                        rollData.modifiers['modifier'] = html.find('#modifier')[0].value;
                        await rollData.calculateTotalModifiers();
                        await crewData.calculateResultVoidship();
                        await sendActionDataToChat(crewData);
                    },
                },
                cancel: {
                    icon: "<i class='rt-material'>close</i>",
                    label: 'Cancel',
                    callback: () => {},
                },
            },
            default: 'roll',
            close: () => {},
        },
        {
            width: 300,
        },
    );
    dialog.render(true);
}

export async function prepareTurretsRoll(turretsData) {
    const html = await renderTemplate('systems/rogue-trader-3rd/templates/prompt/turrets-roll-prompt.hbs', turretsData);
    let dialog = new Dialog(
        {
            title: 'Roll Modifier',
            content: html,
            buttons: {
                roll: {
                    icon: "<i class='rt-material'>casino</i>",
                    label: 'Roll',
                    callback: async (html) => {
                        const rollData = turretsData.rollData;
                        rollData.modifiers['difficulty'] = parseInt(html.find('[id=difficulty] :selected').val());
                        rollData['turretsShot'] = parseInt(html.find('#turretsShot').val());
                        rollData.modifiers['modifier'] = html.find('#modifier')[0].value;
                        await rollData.calculateTotalModifiers();
                        await turretsData.calculateResultVoidship();
                        await sendActionDataToChat(turretsData);
                    },
                },
                cancel: {
                    icon: "<i class='rt-material'>close</i>",
                    label: 'Cancel',
                    callback: () => {},
                },
            },
            default: 'roll',
            close: () => {},
        },
        {
            width: 300,
        },
    );
    dialog.render(true);
}

export async function prepareShipWeaponsRoll(attackData) {
    const html = await renderTemplate('systems/rogue-trader-3rd/templates/prompt/ship-weapons-roll-prompt.hbs', attackData);
    let dialog = new Dialog(
        {
            title: 'Roll Modifier',
            content: html,
            buttons: {
                roll: {
                    icon: "<i class='rt-material'>casino</i>",
                    label: 'Roll',
                    callback: async (html) => {
                        const rollData = turretsData.rollData;
                        rollData.modifiers['difficulty'] = parseInt(html.find('[id=difficulty] :selected').val());
                        rollData['turretsShot'] = parseInt(html.find('#turretsShot').val());
                        rollData.modifiers['modifier'] = html.find('#modifier')[0].value;
                        await rollData.calculateTotalModifiers();
                        await turretsData.calculateResultVoidship();
                        await sendActionDataToChat(turretsData);
                    },
                },
                cancel: {
                    icon: "<i class='rt-material'>close</i>",
                    label: 'Cancel',
                    callback: () => {},
                },
            },
            default: 'roll',
            close: () => {},
        },
        {
            width: 300,
        },
    );
    dialog.render(true);
}