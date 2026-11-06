import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import fs from 'node:fs';
const bundle = new URL('./.game-bundle.mjs',import.meta.url);
await build({entryPoints:[new URL('../src/game.jsx',import.meta.url).pathname],bundle:true,format:'esm',platform:'node',external:['react','react-dom'],outfile:bundle.pathname,logLevel:'silent'});
const {GameScreen,ResultScreen}=await import(bundle.href); fs.unlinkSync(bundle);
const dom = new JSDOM('<!doctype html><div id="root"></div>',{url:'https://example.test'});
globalThis.window=dom.window; globalThis.document=dom.window.document; Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true}); globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {setSoundEnabled}=await import('../src/audio.js'); setSoundEnabled(false);
const wait = ms => new Promise(r=>setTimeout(r,ms));
const deck=Array.from({length:10},(_,i)=>({id:String(i),name:`Player ${i}`,detail:`Club ${i} · 2010`,img:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',imgObj:null}));
const theme={primary:'#00D4FF',secondary:'#0066FF'};
async function run(mode) {
 const host=document.getElementById('root'), root=createRoot(host); let result; const props={item:{id:'test',name:'Worst Signings',criterion:'Worst signing'},theme,deck,settings:{mode,countdown:false,record:false},engine:{cancelRecording(){}},gameRef:{current:null},cardRef:{current:null},onDone:r=>result=r,camOn:false};
 await act(async()=>root.render(React.createElement(GameScreen,props)));
 const click=label=>{const b=[...host.querySelectorAll('button')].find(x=>x.textContent===label);assert.ok(b,label);b.click();};
 await act(async()=>{click('Start');await wait(720);});
 assert.ok(host.textContent.includes('#1 = Worst signing'));
 await act(async()=>{const b=host.querySelector('[aria-label="Rank 1"]'); b.click(); b.click(); await wait(720);});
 assert.equal(host.querySelectorAll('.slot.filled').length,1,'rapid clicks place only once');
 if(mode==='casual') {await act(async()=>click('Undo'));assert.equal(host.querySelectorAll('.slot.filled').length,0);await act(async()=>{host.querySelector('[aria-label="Rank 1"]').click();await wait(720);});}
 else assert.ok(![...host.querySelectorAll('button')].some(b=>b.textContent==='Undo'));
 for(let i=2;i<=10;i++) await act(async()=>{host.querySelector(`[aria-label="Rank ${i}"]`).click();await wait(720);});
 assert.equal(result.slots.length,10);assert.equal(new Set(result.slots.map(x=>x.id)).size,10);assert.deepEqual(result.slots.map(x=>x.id),deck.map(x=>x.id));
 await act(async()=>root.unmount());
}
test('Strict round locks all ten placements, shows correct question and blocks double taps',()=>run('strict'));
test('Casual round can undo and still finishes exactly once with ten unique picks',()=>run('casual'));
