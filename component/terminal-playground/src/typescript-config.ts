import { autocompletion } from "@codemirror/autocomplete";
// import {
//   createDefaultMapFromCDN,
//   createSystem,
//   createVirtualTypeScriptEnvironment,
// } from "@typescript/vfs";
// import ts from "typescript";
import {
  tsLinter,
  tsHover,
  tsAutocomplete,
  tsSync,
} from "@valtown/codemirror-ts";

// const fsMap = await createDefaultMapFromCDN(
//   { target: ts.ScriptTarget.ES2022 },
//   "3.7.3",
//   true,
//   ts,
// );
//
// const system = createSystem(fsMap);
// const compilerOpts = {};
// const env = createVirtualTypeScriptEnvironment(system, [], ts, compilerOpts);

export const typescriptConfig = [
  tsSync(),
  tsLinter(),
  autocompletion({
    override: [tsAutocomplete()],
  }),
  tsHover(),
];
