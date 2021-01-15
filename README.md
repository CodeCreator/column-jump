# column-jump README

* `column-jump.jumpUp`: Navigate cursor up to next non-empty row in the same column
* `column-jump.jumpDown`: Navigate cursor down to next non-empty row in the same column

# Demo
![Demo](/images/demo.gif)

# Usage

Recommend to remap to a convenient keybinding.

```
    {
        "key": "alt+up",
        "command": "column-jump.jumpUp",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+down",
        "command": "column-jump.jumpDown",
        "when": "editorTextFocus"
    }
```
