import { sendActionDataToChat } from '../rolls/roll-helpers.mjs';
import { ActionData } from '../rolls/action-data.mjs';

export async function prepareDamageRoll(rollData) {
    rollData.rt = CONFIG.rt;
    const html = await renderTemplate('systems/rogue-trader-3rd/templates/prompt/damage-roll-prompt.hbs', rollData);
    let dialog = new Dialog(
        {
            title: 'Damage Roll',
            content: html,
            buttons: {
                roll: {
                    icon: "<i class='rt-material'>casino</i>",
                    label: 'Roll',
                    callback: async (html) => {
                        const actionData = new ActionData();
                        actionData.template = 'systems/rogue-trader-3rd/templates/chat/damage-roll-chat.hbs';

                        rollData.damage = html.find('#damage')[0].value;
                        rollData.penetration = html.find('#penetration')[0].value;
                        rollData.damageType = html.find('[name=damageType] :selected').val();
                        rollData.pr = html.find('#pr')[0]?.value;
                        rollData.template = 'systems/rogue-trader-3rd/templates/chat/damage-roll-chat.hbs';
                        rollData.roll = new Roll(rollData.damage, rollData);
                        await rollData.roll.evaluate();

                        actionData.rollData = rollData;
                        await sendActionDataToChat(actionData);
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
