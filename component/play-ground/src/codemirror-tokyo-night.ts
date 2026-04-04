import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const bg = "#1a1b26";
const fg = "#9aa5ce";
const selection = "#364A82";
const gutter = "#565f89";
const gutterBg = "#1a1b26";
const lineHighlight = "#1e202e";

const tokyoNightTheme = EditorView.theme(
  {
    "&": {
      color: fg,
      backgroundColor: bg,
    },
    ".cm-content": {
      caretColor: "#c0caf5",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#c0caf5",
    },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: selection,
      },
    ".cm-panels": {
      backgroundColor: bg,
      color: fg,
    },
    ".cm-searchMatch": {
      backgroundColor: "#3d59a1",
      outline: "1px solid #3d59a166",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#3d59a1aa",
    },
    ".cm-activeLine": {
      backgroundColor: lineHighlight,
    },
    ".cm-selectionMatch": {
      backgroundColor: "#3d59a144",
    },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: "#3d59a166",
    },
    ".cm-gutters": {
      backgroundColor: gutterBg,
      color: gutter,
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: lineHighlight,
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#565f89",
    },
    ".cm-tooltip": {
      border: "none",
      backgroundColor: "#24283b",
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: "#24283b",
      borderBottomColor: "#24283b",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "#364A82",
        color: fg,
      },
    },
  },
  { dark: true },
);

const tokyoNightHighlighting = HighlightStyle.define([
  { tag: tags.keyword, color: "#bb9af7" },
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: "#c0caf5" },
  { tag: [tags.function(tags.variableName)], color: "#7aa2f7" },
  { tag: [tags.labelName], color: "#7dcfff" },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: "#ff9e64" },
  { tag: [tags.definition(tags.name), tags.separator], color: "#c0caf5" },
  { tag: [tags.brace], color: "#c0caf5" },
  { tag: [tags.annotation], color: "#e0af68" },
  { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: "#ff9e64" },
  { tag: [tags.typeName, tags.className], color: "#2ac3de" },
  { tag: [tags.operator, tags.operatorKeyword], color: "#bb9af7" },
  { tag: [tags.tagName], color: "#f7768e" },
  { tag: [tags.squareBracket], color: "#c0caf5" },
  { tag: [tags.angleBracket], color: "#89ddff" },
  { tag: [tags.attributeName], color: "#bb9af7" },
  { tag: [tags.regexp], color: "#f7768e" },
  { tag: [tags.quote], color: "#9ece6a" },
  { tag: [tags.string], color: "#9ece6a" },
  { tag: tags.link, color: "#73daca", textDecoration: "underline", textUnderlinePosition: "under" },
  { tag: [tags.url, tags.escape, tags.special(tags.string)], color: "#ff9e64" },
  { tag: [tags.meta], color: "#565f89" },
  { tag: [tags.comment], color: "#565f89", fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold", color: "#e0af68" },
  { tag: tags.emphasis, fontStyle: "italic", color: "#e0af68" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: tags.heading, fontWeight: "bold", color: "#7dcfff" },
  { tag: tags.special(tags.heading1), fontWeight: "bold", color: "#7dcfff" },
  { tag: tags.heading1, fontWeight: "bold", color: "#7dcfff" },
  { tag: [tags.heading2, tags.heading3, tags.heading4], fontWeight: "bold", color: "#7dcfff" },
  { tag: [tags.heading5, tags.heading6], color: "#7dcfff" },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: "#ff9e64" },
  { tag: [tags.processingInstruction, tags.inserted], color: "#73daca" },
  { tag: [tags.contentSeparator], color: "#7aa2f7" },
  { tag: tags.invalid, color: "#ff5370", borderBottom: "1px dotted #ff5370" },
]);

export const tokyoNight = [tokyoNightTheme, syntaxHighlighting(tokyoNightHighlighting)];
