const Product = require('../models/Product');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    async index(req, res) {

        var perPage = process.env.REGISTERS
            , page = Math.max(0, (req.query['page'] - 1))

        const products = await Product.find()
                                      .limit(perPage)
                                      .skip(perPage * page)
                                      .catch(err => { res.status(501).send(err)});
                                                                                    
        return res.status(200).json(products);
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
            for (let i = 0; i < 3; i++) {                
                const products = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('.s-result-item'));
                
                return links.map(link => {
                    if (link.querySelector(".a-price-whole")) {
                        let avgElement = link.querySelector('.a-icon-star-small > span');
                        let avg = 0;
                        if (avgElement != null) {
                            avg =  avgElement.textContent.match(/([0-9,.]+) .*/)[1];
                        }
                        return {
                            title: link.querySelector(".a-size-medium.a-color-base.a-text-normal").textContent,
                            url: link.querySelector(".a-link-normal.a-text-normal").href,                
                            avg: parseFloat(avg),
                            price: parseFloat(link.querySelector(".a-price-whole").textContent.replace(/[,.]/g, m => (m === ',' ? '.' : ''))),
                        };
                    }
                });
                });
                  
                products.forEach(async element => { 
                    if (element != null) {
                        console.log(element)
                        await Product.create(element).catch(err => { res.status(400).send(err)});
                    }
                }); 

                await page.waitForSelector('.a-normal');
                await page.click('.a-normal');
                await page.waitForSelector('.s-image');
            }

            await browser.close();
            return res.status(201).json({loaded : true});
        } catch (error) {
            return res.status(501).send(error);
        }    
    } 
};