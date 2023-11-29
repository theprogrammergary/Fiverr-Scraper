# Fiverr-Order-Scraper

I needed to get all of my deliveries from my fiverr. So I built a scraper/chrome-extension to help in a semi-automated fashion. I first tried with a headless browser/puppeteer, but kept running into bot detection. This was the fastest solution, and accomplished the job for me. I don't guarantee it will work for everyone out of the box, and have not thought about edge cases; however, this should give you a substantial start if you need a similar solution.

Step 1 - Install Chrome Extension
Step 2 - Visit "https://www.fiverr.com/users/{yourUsername}/manage_orders?source=header_nav&search_type=completed"
Step 3 - Click the Chrome Extension Icon to begin.
Step 4 - Don't leave the page.
Step 5 - All your Order IDs are downloaded in the background.
Step 6 - After your Order IDs are downloaded it will begin opening new tabs to download the delivery files except for any video files.
Step 7 - There are pauses to not trigger any throttling.
Step 8 - An alert will display when finished!
Step 9 - Enjoy!
