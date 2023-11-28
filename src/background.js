const validUrl = "https://www.fiverr.com/";

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    if (tab.url?.startsWith(validUrl)) {
      await chrome.action.setPopup({
        tabId: tab.id,
        popup: "src/popupValid.html",
      });

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: downloadFiverrLinks,
      });
    } else {
      await chrome.action.setPopup({
        tabId: tab.id,
        popup: "src/popupInvalid.html",
      });
    }
  }
});

function extractFileName(url) {
  const parts = url.split("?")[0].split("/");
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }
  return null;
}

function downloadFiverrLinks() {
  console.clear();
  console.log("Downloading Files...");

  const linksToDownload = document.querySelectorAll(
    'a[href^="https://www.fiverr.com/download"]'
  );
  // console.log("Possible download links: ", linksToDownload);

  linksToDownload.forEach((link) => {
    try {
      const linkHref = link.getAttribute("href");
      const linkText = link.textContent;

      // console.log("linkHref: ", linkHref);
      // console.log("linkText: ", linkText);

      const fileName = extractFileName(linkHref);
      console.log(fileName);

      // Use the chrome.downloads API to trigger the download
      // chrome.downloads.download(
      //   {
      //     url: linkHref,
      //     filename: linkText,
      //   },
      //   (downloadId) => {
      //     if (chrome.runtime.lastError) {
      //       console.error(`Error downloading link: ${linkText}`);
      //       console.error(chrome.runtime.lastError);
      //     } else {
      //       console.log(`Download initiated: ${linkText}`);
      //     }
      //   }
      // );
    } catch (error) {
      console.error(`Error downloading link: ${link.textContent}`);
      console.error(error);
    }
  });
}

// sample links
// https://www.fiverr.com/download/attachment/message/65561171c437ea0017e3d3f2/65561156a8d877001cf253e2/FibSignal_doublej1.txt?order_id=FO3BCB7D5D41&signature=63194ca70c6e4a70f3ccdf1beb94f7e09e7ab0e5a4254d6e7703f4d638510e57

// https://www.fiverr.com/download/attachment/message/65561171c437ea0017e3d3f2/6556116a4f651f001aee5798/2023-11-16%2007-52-05.mp4?order_id=FO3BCB7D5D41&signature=d26213d5d662ed55acce12b1444e37b647af8033ec00fc8780f27448a8221300
