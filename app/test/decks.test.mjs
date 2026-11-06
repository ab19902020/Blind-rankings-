import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU_DATA } from '../src/data.js';
globalThis.localStorage = {getItem:()=>null,setItem:()=>{}};
globalThis.fetch = async () => ({ok:true,json:async()=>({results:[],query:{pages:[]}})});
class MockImage { crossOrigin=''; decoding=''; naturalWidth=600; set src(value) { this.value=value; queueMicrotask(()=>value?.startsWith('data:')?this.onload?.():this.onerror?.()); } get src(){return this.value;} }
globalThis.Image = MockImage;
const {loadDeck,preload} = await import('../src/api.js');
test('every static category completes ten unique picks with failed image services',async()=>{
  let count=0;
  for (const it of Object.values(MENU_DATA).flat().filter(x=>!['nav','game'].includes(x.type))) {
    const progress=[]; const deck=await loadDeck(it,n=>progress.push(n));
    assert.equal(deck.length,10,it.id); assert.equal(new Set(deck.map(p=>p.id)).size,10,it.id); assert.ok(deck.every(p=>p.imgObj && p.img.startsWith('data:')),it.id);
    assert.equal(progress.at(-1),10); count++;
  }
  assert.ok(count>350); console.log(`Verified ${count} static categories offline`);
});
test('a stalled image settles at its timeout',async()=>{
  const Original=globalThis.Image; globalThis.Image=class {set src(v){} }; try {assert.equal(await preload('https://image.tmdb.org/hang',15),null);}finally{globalThis.Image=Original;}
});
test('friend challenge keeps its exact order even when every picture fails',async()=>{
  const picks=Array.from({length:10},(_,i)=>({id:String(i),name:'Pick '+i,detail:'Club '+i,img:'https://image.tmdb.org/missing'}));
  const d=await loadDeck({type:'challenge',id:'friend',picks}); assert.deepEqual(d.map(p=>p.name),picks.map(p=>p.name));
});
