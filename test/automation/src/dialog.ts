/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';

export class Dialog {

	private static DIALOG_BOX = '.monaco-dialog-box';
	private static DIALOG_PRIMARY_BUTTON = '.dialog-buttons .monaco-button:not(.secondary)';
	private static DIALOG_SECONDARY_BUTTONS = '.dialog-buttons .monaco-button.secondary';

	constructor(private code: Code) { }

	async waitForDialog(): Promise<void> {
		await this.code.waitForElement(Dialog.DIALOG_BOX);
	}

	async waitForDialogToClose(): Promise<void> {
		await this.code.waitForElement(Dialog.DIALOG_BOX, result => !result);
	}

	async clickPrimaryButton(): Promise<void> {
		await this.code.waitAndClick(Dialog.DIALOG_PRIMARY_BUTTON);
	}

	async clickSecondaryButton(buttonText?: string): Promise<void> {
		if (!buttonText) {
			// If no specific text provided, click the first secondary button
			await this.code.waitAndClick(Dialog.DIALOG_SECONDARY_BUTTONS);
		} else {
			// Find the specific secondary button by text
			const secondaryButtons = await this.code.waitForElements(Dialog.DIALOG_SECONDARY_BUTTONS, false);
			const targetButton = secondaryButtons.find(button => button.textContent === buttonText);

			if (!targetButton) {
				const availableSecondaryButtons = secondaryButtons.map(b => b.textContent).join(', ');
				throw new Error(`Secondary button with text "${buttonText}" not found. Available secondary buttons: ${availableSecondaryButtons}`);
			}

			const buttonIndex = secondaryButtons.indexOf(targetButton);
			await this.code.waitAndClick(`${Dialog.DIALOG_SECONDARY_BUTTONS}:nth-child(${buttonIndex + 1})`);
		}
	}
}
