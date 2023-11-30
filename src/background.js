const validStartUrl =
  /^https:\/\/www\.fiverr\.com\/users\/[^/]+\/manage_orders\?source=header_nav&search_type=completed/;
const validDownloadUrl = "https://www.fiverr.com/orders";

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "downloadFiverrFile") {
    const { url, filename } = message;
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
  } else if (message.action === "createMessageDeliveryFile") {
    const { deliveryContent, filename } = message;
    const blob = new Blob([deliveryContent], {
      type: "text;charset=utf-8",
    });

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;
      const blobUrl = `data:${blob.type};base64,${btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`;
      chrome.downloads.download({
        url: blobUrl,
        filename: filename,
      });
    };
    reader.readAsArrayBuffer(blob);
  } else if (message.action === "startDownloadingFiles") {
    const orderList = message.orderList;
    console.log("Received Downloaded Order IDs: ", orderList);

    async function processOrderList(orderList) {
      for (const order of orderList) {
        try {
          const downloadLink = `https://www.fiverr.com/orders/${order}/activities`;
          const tab = await chrome.tabs.create({ url: downloadLink });
          const randomTimeout = Math.floor(Math.random() * 11000) + 5000;
          await new Promise((resolve) => setTimeout(resolve, randomTimeout));
          await chrome.tabs.remove(tab.id);
        } catch (error) {
          console.error(`Error processing order: ${order.url}`, error);
        }
      }
    }

    if (orderList.length > 0) {
      processOrderList(orderList)
        .then(() => {
          console.log("Finished processing orders");
          alert("Finished processing orders");
        })
        .catch((error) => {
          console.error("Error processing orders: ", error);
        });
    }
  }
});
