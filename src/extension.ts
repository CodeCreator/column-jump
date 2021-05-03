'use strict';
import * as vscode from 'vscode';
import { TextLine, Selection, TextEditor, Range, Position } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('column-jump.jumpDown', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        editor.selections = editor.selections
            .map(sel => jumpDown(sel, editor, false))

        scrollFirstSelectionIntoView(editor);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('column-jump.jumpUp', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        editor.selections = editor.selections
            .map(sel => jumpUp(sel, editor, false))

        scrollFirstSelectionIntoView(editor);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('column-jump.jumpSelectDown', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        editor.selections = editor.selections
            .map(sel => jumpDown(sel, editor, true))

        scrollFirstSelectionIntoView(editor);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('column-jump.jumpSelectUp', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        editor.selections = editor.selections
            .map(sel => jumpUp(sel, editor, true))

        scrollFirstSelectionIntoView(editor);
    }));
}

function jumpUp(selection: Selection, editor: TextEditor, select: boolean): Selection {
    const cursorPos = selection.active,
        char = cursorPos.character;

    for (let i = cursorPos.line - 1; i >= 0; i--) {
        if (isLineBlocking(editor.document.lineAt(i), char)) {
            const newPos = new Position(i, char);
            return new Selection(select ? selection.anchor : newPos, newPos);
        }
    }

    const newPos = new Position(0, 0);
    return new Selection(select ? selection.anchor : newPos, newPos);
}

function jumpDown(selection: Selection, editor: TextEditor, select: boolean): Selection {
    const cursorPos = selection.active,
        lineCount = editor.document.lineCount,
        char = cursorPos.character;

    for (let i = cursorPos.line + 1; i < lineCount; i++) {
        if (isLineBlocking(editor.document.lineAt(i), char)) {
            const newPos = new Position(i, char);
            return new Selection(select ? selection.anchor : newPos, newPos);
        }
    }

    const newPos = editor.document.lineAt(lineCount - 1).range.end;
    return new Selection(select ? selection.anchor : newPos, newPos);
}

function isLineBlocking(line: TextLine, char: number): boolean {
    return (!line.isEmptyOrWhitespace &&
        line.firstNonWhitespaceCharacterIndex <= char);
}

function scrollFirstSelectionIntoView(editor: TextEditor) {
    if (editor.selections.length < 1) {
        return;
    }

    const pos = editor.selections[0].active;
    editor.revealRange(new Range(pos, pos));
}

export function deactivate() {
}
