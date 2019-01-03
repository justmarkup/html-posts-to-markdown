const puppeteer = require('puppeteer');
const TurndownService = require('turndown');
const fs = require('fs');
const args = require('yargs').argv;

const turndownService = new TurndownService();

// check for line arguments and define default values 
const pageURL = args.url ? args.url : 'https://justmarkup.com';
const postsSelector = args.postSelector ? args.postSelector : '.main .article h2 a';
const titleSelector = args.titleSelector ? args.titleSelector : '.article h1';
const contentSelector = args.contentSelector ? args.contentSelector : '.article .entry-content';
const postsDirectory = args.dir ? __dirname + args.dir : __dirname + '/posts/';

(async() => {
    // start the browser
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    // open the main page url
    const page = await browser.newPage();
    try {
        await page.goto(pageURL);
        console.log('opened the page: ', pageURL);
    } catch (error) {
        console.log(error);
        console.log('failed to open the page: ', pageURL);
    }

    // Find all links to articles
    await page.waitForSelector(postsSelector, { timeout: 0 });
    const postUrls = await page.$$eval(postsSelector, postLinks => postLinks.map(link => link.href));

    // Visit each page one by one
    for (let postUrl of postUrls) {

        // open the page
        try {
            await page.goto(postUrl);
            console.log('opened the page: ', postUrl);
        } catch (error) {
            console.log(error);
            console.log('failed to open the page: ', postUrl);
        }

        // get the pathname
        let pagePathname = await page.evaluate(() => location.pathname);
        // this replaces all / with -
        pagePathname = pagePathname.replace(/\//g, "-");

        // my pathname starts with /log/ so I remove this and also remove the last -
        // pagePathname = pagePathname.substr(5);
        // pagePathname = pagePathname.slice(0, -1);



        // get the title of the post
        await page.waitForSelector(titleSelector);
        const pageTitle = await page.$eval(titleSelector, titleSelector => titleSelector.outerHTML);

        // get the content of the page
        await page.waitForSelector(contentSelector, { timeout: 0 });
        const pageContent = await page.$eval(contentSelector, contentSelector => contentSelector.innerHTML);

        // convert the html to markdown
        let pageContentMarkdown = turndownService.turndown(pageTitle + pageContent);

        // Check if folder exists before writing files there
        if (!fs.existsSync(postsDirectory)) {
            fs.mkdirSync(postsDirectory);
        }

        // save the file as pathname.md
        fs.writeFile(postsDirectory + pagePathname + '.md', pageContentMarkdown, (err) => {
            if (err) {
                console.log(err);
            }

            // success case, the file was saved
            console.log('Page saved!');
        });

    }

    // all done, close the browser
    await browser.close();

    process.exit()
})();