// sample links
// https://www.fiverr.com/download/attachment/message/65561171c437ea0017e3d3f2/65561156a8d877001cf253e2/FibSignal_doublej1.txt?order_id=FO3BCB7D5D41&signature=63194ca70c6e4a70f3ccdf1beb94f7e09e7ab0e5a4254d6e7703f4d638510e57

// https://www.fiverr.com/download/attachment/message/65561171c437ea0017e3d3f2/6556116a4f651f001aee5798/2023-11-16%2007-52-05.mp4?order_id=FO3BCB7D5D41&signature=d26213d5d662ed55acce12b1444e37b647af8033ec00fc8780f27448a8221300
downloadFiverrLinks();

function downloadFiverrLinks() {
  console.clear();

  const linksToDownload = document.querySelectorAll(
    'a[href^="https://www.fiverr.com/download"]'
  );

  if (!linksToDownload) return;

  const orderNumberElement = document.querySelector(
    "#__ZONE__main > div > div > section > div > div.grid-12.seller-grid > aside > div > div > div.wrap-box.m-b-16.p-0 > div > aside > article > div.collapsible-content > ul > li:nth-child(4) > span"
  );
  const deliveryDateElement = document.querySelector(
    "#__ZONE__main > div > div > section > div > div.grid-12.seller-grid > aside > div > div > div.wrap-box.m-b-16.p-0 > div > aside > article > div.collapsible-content > ul > li:nth-child(2) > span > i"
  );

  const orderNumber = cleanElement(orderNumberElement);
  const deliveryDate = cleanElement(deliveryDateElement);

  console.log("Downloading Files...");
  return;

  linksToDownload.forEach((link) => {
    try {
      const linkHref = link.getAttribute("href");
      const fileName = extractFileName(linkHref);

      if (!fileName) return;
      if (isVideoFile(fileName)) return;

      const customPath = `./fiverr/tradingview/${deliveryDate}_${orderNumber}/`;
      const fullPath = customPath + fileName;
      chrome.runtime.sendMessage({
        action: "downloadFiverrFile",
        url: linkHref,
        filename: fullPath,
      });
    } catch (error) {
      console.error(`Caught Error downloading link: ${link.textContent}`);
      console.error(error);
    }
  });
}

function extractFileName(url) {
  const parts = url.split("?")[0].split("/");
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }
  return null;
}

function isVideoFile(fileName) {
  const videoExtensions = [".mp4", ".avi", ".mkv", ".mov"];
  return videoExtensions.some((ext) => fileName.endsWith(ext));
}

function cleanElement(element) {
  const cleanedElement = element.textContent
    .replace(/,/g, "")
    .replace(/:/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  return cleanedElement;
}
