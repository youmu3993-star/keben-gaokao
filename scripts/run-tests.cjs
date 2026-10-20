// In-process TypeScript loader also works on Windows hosts that block child pipes.
const path=require('node:path');
const ts=require('typescript');
require.extensions['.ts']=(mod,file)=>{
 const source=require('node:fs').readFileSync(file,'utf8');
 const js=ts.transpile(source,{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},file);
 mod._compile(js,file);
};
for(const file of process.argv.slice(2))require(path.resolve(file));

