import {test} from 'node:test';
import assert from 'node:assert/strict';
import {match} from './match.mjs';
import {programs} from './programs.mjs';
const p=[{id:'psych',tags:['psych'],cost:51000,months:24,format:'campus'},{id:'change',tags:['change','deal'],cost:1095,months:1,format:'online'},{id:'grad',tags:['change'],cost:8500,months:6,format:'online'}];
test('ranks for career intent without hiding alternatives',()=>assert.deepEqual(match(p,{goal:'deal'}).map(x=>x.id),['change','psych','grad']));
test('combines spending, duration and delivery limits',()=>assert.deepEqual(match(p,{goal:'psych',budget:10000,time:3,format:'online'}).map(x=>x.id),['change']));
test('budget does not silently admit options with no published price',()=>assert.deepEqual(match([{...p[0],cost:null}],{budget:60000}),[]));
// the real data: all five programs, with a price, a source link and a fees link each
test('all five programs are present and complete',()=>{
  assert.deepEqual(programs.map(x=>x.id),['miop','ubc','rru','diploma','msc']);
  for(const x of programs){assert.ok(x.cost>0&&x.price&&x.url.startsWith('https://')&&x.fees.startsWith('https://'),x.id)}
});
test('the budget filter uses the full per-course cost at Saint Mary’s',()=>{
  assert.ok(!match(programs,{budget:10000}).some(x=>x.id==='diploma'),'the diploma is about $10.9k with fees');
  assert.ok(match(programs,{budget:20000}).some(x=>x.id==='msc'));
});
