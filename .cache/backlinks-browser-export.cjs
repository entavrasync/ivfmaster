const fs = require('fs'), path = require('path'), http = require('http'), { createRequire } = require('module');
const roots = { ivf: process.cwd(), dental: path.resolve('../Aesthedent.clinic.website') };
const ts = require('typescript');
for (const ext of ['.ts','.tsx']) require.extensions[ext] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{ module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true }}).outputText,file);
const pages = {};
for(const [id,root] of Object.entries(roots)) {
  const req = createRequire(path.join(root,'package.json')), {createElement:h} = req('react'), {renderToStaticMarkup} = req('react-dom/server');
  const {resolveBacklinks} = req('./sanity/lib/backlinks.ts');
  const {BacklinkReferences} = req(id==='ivf'?'./components/SEO/BacklinkReferences.tsx':'./components/seo/BacklinkReferences.tsx');
  const cssDir=path.join(root,'.next/static/chunks');
  const css=fs.readdirSync(cssDir).filter(name=>name.endsWith('.css')).map(name=>'<link rel="stylesheet" href="/'+id+'/css/'+name+'">').join('');
  for(const state of ['populated','empty']) for(const locale of id==='ivf'?['en','mr']:['en']) {
    const entries=state==='empty'?[]:resolveBacklinks([{_key:'one',url:'https://example.org/clinic-profile'},{_key:'two',url:'https://example.org/clinic-recognition'},{_key:'three',url:'https://medical-directory.example/clinic'}],id==='ivf'?'https://www.ivfmaster.in':'https://www.aesthedentpune.com');
    pages['/'+id+'/'+state+'/'+locale]='<!doctype html><html lang="'+locale+'"><head><meta name="viewport" content="width=device-width, initial-scale=1">'+css+'</head><body style="margin:0;font-family:Arial,sans-serif">'+renderToStaticMarkup(h('div',null,h('main',{style:{padding:24}},h('h1',null,'Local page fixture')),h(BacklinkReferences,{entries,locale}),h('footer',{style:{padding:32,background:'#003d52',color:'white'}},'Footer fixture')))+'</body></html>';
  }
}

const postcss = require('postcss');
for(const [route,html] of Object.entries(pages)) {
 const id=route.split('/')[1],root=roots[id], classes=new Set([...html.matchAll(/class="([^"]*)"/g)].flatMap(match=>match[1].split(' ')));
 const css=fs.readdirSync(path.join(root,'.next/static/chunks')).filter(n=>n.endsWith('.css')).map(n=>fs.readFileSync(path.join(root,'.next/static/chunks',n),'utf8')).join('');
 const ast=postcss.parse(css);
 const escaped=[...classes].map(value=>'.'+value.replace(/[^a-zA-Z0-9_-]/g,'\\$&'));
 ast.walkRules(rule=>{if(rule.selector.includes('.')&&!escaped.some(value=>rule.selector.includes(value)))rule.remove()});
 ast.walkAtRules('font-face',rule=>rule.remove());
 pages[route]=html.replace(/<link[^>]+>/g,'').replace('</head>','<style>'+ast.toString()+'</style></head>');
}
console.log(JSON.stringify(pages));
