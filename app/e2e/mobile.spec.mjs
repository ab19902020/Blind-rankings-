import {test,expect} from '@playwright/test';
test('mobile Strict/Casual, favourites, report, same-ten challenge and layout',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:8123')?route.continue():route.abort());
  await page.addInitScript(()=>{localStorage.setItem('blindrank.onboarded','true');localStorage.setItem('blindrank.settings',JSON.stringify({countdown:false,sound:false,haptics:false,record:false,mode:'strict',tracking:false,region:'uk'}));window.BlindRankNative={shareText(title,text){window.__shared=text;},haptic(){}};});
  await page.goto('/');await expect(page.getByRole('button',{name:'Let’s rank'})).toBeVisible();
  await page.screenshot({animations:'disabled',path:testInfo.outputPath('01-home.png')});
  await page.getByRole('button',{name:/Sports \d+ challenges/}).click();
  await expect(page.getByRole('heading',{name:'The sporting debate'})).toBeVisible();
  await page.screenshot({animations:'disabled',path:testInfo.outputPath('02-sports.png')});
  await page.getByPlaceholder('Find a challenge').fill('Worst Premier League Signings');
  await page.getByRole('button',{name:/Football Debates Worst Premier League Signings/}).click();
  await expect(page.getByRole('heading',{name:'Worst Premier League Signings'})).toBeVisible();
  await page.getByRole('button',{name:'♡ Save challenge'}).click();
  await expect(page.getByRole('button',{name:'♥ Saved'})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button',{name:'Start challenge',exact:true})).toBeEnabled({timeout:30000});
  await page.screenshot({animations:'disabled',path:testInfo.outputPath('03-ready.png')});
  await page.getByRole('button',{name:'Start challenge',exact:true}).click();await page.getByRole('button',{name:'Start',exact:true}).click();
  const order=[];
  for(let i=1;i<=10;i++){const rank=page.getByRole('button',{name:`Rank ${i}`,exact:true});await expect(rank).toBeEnabled();order.push(await page.locator('.fc-name').innerText());if(i===3)await page.screenshot({animations:'disabled',path:testInfo.outputPath('04-game.png')});await rank.click();}
  await expect(page.getByRole('button',{name:'↗ Challenge a mate',exact:true})).toBeVisible();
  await page.screenshot({animations:'disabled',path:testInfo.outputPath('05-results.png')});
  await page.getByRole('button',{name:'↗ Challenge a mate',exact:true}).click();const code=await page.evaluate(()=>window.__shared);
  expect(code).toContain('BR1.');
  await page.getByRole('button',{name:'Report a wrong picture or pick'}).click();await page.getByLabel('What’s wrong?').selectOption('Doesn’t belong in this category');await page.getByRole('button',{name:'Save report',exact:true}).click();await expect(page.getByRole('button',{name:'Saved on phone'})).toBeVisible();await page.getByRole('button',{name:'Close dialog'}).click();
  await page.locator('.res-actions').getByRole('button',{name:'Home',exact:true}).click();
  await page.getByRole('button',{name:/Challenge a mate Same ten/}).click();await page.getByLabel('Challenge code').fill(code);await page.getByRole('button',{name:'Join challenge'}).click();
  await expect(page.getByRole('button',{name:'Start challenge',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Start challenge',exact:true}).click();await page.getByRole('button',{name:'Start',exact:true}).click();
  for(let i=1;i<=10;i++){const rank=page.getByRole('button',{name:`Rank ${i}`,exact:true});await expect(rank).toBeEnabled();expect(await page.locator('.fc-name').innerText()).toBe(order[i-1]);await rank.click();}
  await expect(page.getByRole('button',{name:'Play again'})).toBeVisible();
  expect(errors).toEqual([]);
  const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('blindrank.history')));expect(records).toHaveLength(2);expect(records[0].picks.map(x=>x.id)).toEqual(records[1].picks.map(x=>x.id));
  await page.locator('.res-actions').getByRole('button',{name:'Home',exact:true}).click();
  await page.locator('.saved-strip button').first().click();await page.getByRole('button',{name:'Casual Undo your last placement'}).click();await expect(page.getByRole('button',{name:'Start challenge',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Start challenge',exact:true}).click();await page.getByRole('button',{name:'Start',exact:true}).click();await expect(page.getByRole('button',{name:'Rank 1',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Rank 1',exact:true}).click();await expect(page.getByRole('button',{name:'Undo',exact:true})).toBeVisible();await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(page.locator('.slot.filled')).toHaveCount(0);
  await page.setViewportSize({width:320,height:640});await page.screenshot({animations:'disabled',path:testInfo.outputPath('06-small-phone.png')});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
