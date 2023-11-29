const validUrl = "https://www.fiverr.com/orders";

chrome.tabs.onUpdated.addListener(async (tabID, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    if (tab.url?.startsWith(validUrl)) {
      console.log("Downloading from url: ", tab.url);
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/downloadScript.js"],
      });
    }
  }
});

// if (tab.id) {
//   if (tab.url?.startsWith(validUrl)) {
//     // await chrome.action.setPopup({
//     //   tabId: tab.id,
//     //   popup: "src/popupValid.html",
//     // });

//     await chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ["src/downloadScript.js"],
//     });
//   } else {
//     // await chrome.action.setPopup({
//     //   tabId: tab.id,
//     //   popup: "src/popupInvalid.html",
//     // });
//   }
// }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "downloadFile") {
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
