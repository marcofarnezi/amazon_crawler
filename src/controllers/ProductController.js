const Product = require('../models/Product');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    async index(req, res) {

        var perPage = process.env.REGISTERS
            , page = Math.max(0, req.param('page'))

        const products = await Product.find()
                                      .limit(perPage)
                                      .skip(perPage * page);

        return res.json(products);
    },

    async store(req, res) {
        const { search } = req.body;
        const domain = "https://www.amazon.com";
        
        try {    
            const browser = await puppeteer.launch({headless: true});    
            const page = await browser.newPage();    
            await page.setViewport({ width: 1280, height: 800 });
            await page.goto(domain, {
            timeout: 3000000
            });
            
            await page.type('#twotabsearchtextbox', search);
            await page.click('input.nav-input');
            await page.waitForSelector('.s-image');
            for (let i = 0; i < 2; i++) {                
                const products = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('.s-result-item'));
                
                return links.map(link => {
                    if (link.querySelector(".a-price-whole")) {
                        return {
                            title: link.querySelector(".a-size-medium.a-color-base.a-text-normal").textContent,
                            url: link.querySelector(".a-link-normal.a-text-normal").href,                
                            avg: parseFloat(link.querySelector('.a-icon-star-small > span').textContent.match(/([0-9,.]+) .*/)[1]),
                            price: parseFloat(link.querySelector(".a-price-whole").textContent.replace(/[,.]/g, m => (m === ',' ? '.' : ''))),
                        };
                    }
                });
                });
                  
                products.forEach(async element => { 
                if (element != null) {
                    await Product.create(element);
                }
                }); 
                
                await page.waitForSelector('.a-normal');
                await page.click('.a-normal');
                await page.waitForSelector('.s-image');
            }

            await browser.close();
            return res.json({loaded : true});
        } catch (error) {
            return res.json(error);
        }    
    } 
};