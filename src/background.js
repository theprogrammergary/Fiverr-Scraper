const validStartUrl =
  /^https:\/\/www\.fiverr\.com\/users\/[^/]+\/manage_orders\?source=header_nav&search_type=completed/;
const validDownloadUrl = "https://www.fiverr.com/orders";

chrome.tabs.onUpdated.addListener(async (tabID, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    if (tab.url?.startsWith(validDownloadUrl)) {
      console.log("Downloading order url: ", tab.url);
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/scriptDownload.js"],
      });
    } else if (validStartUrl.test(tab.url)) {
      await chrome.action.setIcon({
        tabId: tab.id,
        path: {
          16: "../icons/icon16.png",
          48: "../icons/icon48.png",
          64: "../icons/icon64.png",
          128: "../icons/icon128.png",
        },
      });
      await chrome.action.setPopup({
        tabId: tab.id,
        popup: "src/popupValid.html",
      });
    } else {
      await chrome.action.setIcon({
        tabId: tab.id,
        path: {
          16: "../icons/icon16-disabled.png",
          48: "../icons/icon48-disabled.png",
          64: "../icons/icon64-disabled.png",
          128: "../icons/icon128-disabled.png",
        },
      });
      await chrome.action.setPopup({
        tabId: tab.id,
        popup: "src/popupInValid.html",
      });
    }
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    if (tab.url && validStartUrl.test(tab.url)) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/scriptOrderList.js"],
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "downloadFiverrFile") {
    const { url, filename, htmlFilename } = message;
    chrome.downloads.download(
      {
        url: url,
        filename: filename,
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error(`Error downloading: ${filename}`);
          console.error(chrome.runtime.lastError);
        } else {
          console.log(` Success: ${filename}`);
        }
      }
    );
  }
});
