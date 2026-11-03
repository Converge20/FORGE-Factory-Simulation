import { test, expect } from '@playwright/test';
test('desktop: real WebGL, station inspection, controls, research and camera tour',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await expect(page.locator('.loading')).toHaveCount(0,{timeout:20000});
 await expect(page.getByText('Made to move.')).toBeVisible();
 for(const [i,name] of ['Can forming','Wash & finish','Beverage preparation','Fill & seal','Pack & palletise','Warehouse & dispatch'].entries()){
  await page.locator('.step').nth(i).click();await expect(page.locator('.inspector h2')).toHaveText(name);
 }
 await page.getByLabel('Reset camera').click();await expect(page.getByText('Made to move.')).toBeVisible();
 await page.getByLabel('Pause production flow').click();await expect(page.getByText('FLOW PAUSED',{exact:true})).toBeVisible();
 await page.getByLabel('Resume production flow').click();await page.getByLabel('Zoom in',{exact:true}).click();await page.getByLabel('Zoom out',{exact:true}).click();
 await page.getByRole('button',{name:'Hide station labels',exact:true}).click();await expect(page.getByRole('button',{name:'Show station labels',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Research & sources'}).click();await expect(page.locator('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();
 await page.getByRole('button',{name:'Take a guided tour'}).click();await expect(page.locator('.tour-progress')).toBeVisible();await expect(page.locator('.inspector h2')).toHaveText('Can forming');
 await page.waitForTimeout(6800);await expect(page.locator('.inspector h2')).toHaveText('Wash & finish');await page.getByLabel('End guided tour').click();
 expect(errors).toEqual([]);
});
test('reduced motion: no autoplay or timed tour; stations remain accessible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.getByText('FLOW PAUSED',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Explore the stations'})).toBeVisible();await page.getByRole('button',{name:'Explore the stations'}).click();await expect(page.locator('.inspector h2')).toHaveText('Can forming');await expect(page.locator('.tour-progress')).toHaveCount(0);
});
test('mobile: responsive layout has no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('canvas')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('.step').nth(4).click();await expect(page.locator('.inspector h2')).toHaveText('Pack & palletise');
});
test('WebGL fallback preserves research and station exploration',async({page})=>{
 await page.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=(()=>null) as typeof HTMLCanvasElement.prototype.getContext;});await page.goto('/');await expect(page.getByText('The factory needs WebGL')).toBeVisible();await expect(page.locator('.loading')).toHaveCount(0);await page.locator('.step').nth(3).click();await expect(page.locator('.inspector h2')).toHaveText('Fill & seal');
});
test('a lost WebGL context presents the readable fallback',async({page})=>{
 await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await expect(page.locator('.loading')).toHaveCount(0,{timeout:20000});
 await page.locator('canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());
 await expect(page.getByText('The factory needs WebGL')).toBeVisible();await page.locator('.step').nth(1).click();await expect(page.locator('.inspector h2')).toHaveText('Wash & finish');
});
