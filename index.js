/*   simple-scraper/index.js
       ____     __           _           _____        __
      / __/_ __/ /  ___ ____(_)__  ___  / ___/__  ___/ /__
 --- _\ \/ // / _ \/ -_) __/ / _ `/ _ \/ /__/ _ \/ _  / -_)---------------------
|   /___/\_, /_.__/\__/_/ /_/\_,_/_//_/\___/\___/\_,_/\__/                      |
| Shorlo/___/                                                                   |
|                                                                               |
|   Copyright © 2022-2023 Javier Sainz de Baranda Goñi.                         |
|   Released under the terms of the GNU Lesser General Public License v3.       |
|                                                                               |
|   This program is free software: you can redistribute it and/or modify it     |
|   under the terms of the GNU General Public License as published by the Free  |
|   Software Foundation, either version 3 of the License, or (at your option)   |
|   any later version.                                                          |
|   This program is distributed in the hope that it will be useful, but         |
|   WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY  |
|   or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License     |
|   for more details.                                                           |
|                                                                               |
|   You should have received a copy of the GNU General Public License along     |
|   with this program. If not, see <http://www.gnu.org/licenses/>.              |
|                                                                               |
'==============================================================================*/

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

var $ = '';
var html = '';

(async () =>
{
    const h2array = [];
    const browser = await puppeteer.launch
    ({
        headless: "new",
        devtools: false,
        args: [`--window-size=1920,1080`],
        defaultViewport:
        {
             width:1920,
             height:1080
        }
    });

    // Crear una nueva página
    const page = await browser.newPage();

    // Navegar a una URL
    await page.goto('https://www.amazon.es/');

    await page.waitForSelector('#sp-cc-accept');
    await page.click('#sp-cc-accept');
    await page.waitForSelector('#twotabsearchtextbox');
    await page.type('#twotabsearchtextbox', 'tartas');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.click('#nav-search-submit-button');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    html = await page.content();
    $ = cheerio.load(html);

    $('h2').each((index, element) =>
    {
        const linkText = $(element).text().trim();
        const aElement = $(element).find('a').get(0);

        if(aElement)
        {
            h2array.push({index: index, h2: linkText, href: $(aElement).attr('href')});
        }
        else
        {
            h2array.push({index: index, h2: linkText});
        } 
    });
    
    console.log(h2array);

    // Cerrar el navegador
    await browser.close();
})();