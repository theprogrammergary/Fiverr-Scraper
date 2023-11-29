# Fiverr Order Scraper

If you need to retrieve all of your deliveries from your Fiverr account, I've built a scraper/chrome extension to help in a semi-automated fashion. I initially attempted to use a headless browser with Puppeteer but encountered bot detection issues. This solution is faster and served my needs well. Please note that I can't guarantee it will work flawlessly for everyone, and I haven't accounted for all possible edge cases. However, this should provide you with a solid starting point if you require a similar solution.

**Instructions:**

**Step 1:** Install the Chrome Extension.

**Step 2:** Visit [Fiverr Manage Orders](https://www.fiverr.com/users/{yourUsername}/manage_orders?source=header_nav&search_type=completed).

**Step 3:** Click on the Chrome Extension Icon to begin.

**Step 4:** Ensure you don't leave the page during the process.

**Step 5:** All your Order IDs will be downloaded in the background.

**Step 6:** Once your Order IDs are downloaded, it will start opening new tabs to download the delivery files, excluding any video files.

**Step 7:** There are pauses in place to avoid triggering any throttling measures.

**Step 8:** An alert will display when the process is finished!

**Step 9:** Enjoy!
