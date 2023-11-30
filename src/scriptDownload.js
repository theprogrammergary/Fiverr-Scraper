downloadFiverrLinks();

function downloadFiverrLinks() {
  console.clear();

  const filteredArticles = filterArticles();
  if (!filteredArticles) return;

  const orderNumberElement = document.querySelector(
    "#__ZONE__main > div > div > section > div > div.grid-12.seller-grid > aside > div > div > div.wrap-box.m-b-16.p-0 > div > aside > article > div.collapsible-content > ul > li:nth-child(4) > span"
  );
  const deliveryDateElement = document.querySelector(
    "#__ZONE__main > div > div > section > div > div.grid-12.seller-grid > aside > div > div > div.wrap-box.m-b-16.p-0 > div > aside > article > div.collapsible-content > ul > li:nth-child(2) > span > i"
  );

  const orderNumber = cleanElementText(orderNumberElement);
  const deliveryDate = cleanElementText(deliveryDateElement);

  console.log("Downloading Files...");
  filteredArticles.forEach((article) => {
    try {
      const filteredDownloadLinks = filterDownloadLinks(article);

      if (filteredDownloadLinks.length > 0) {
        const deliveryContent = extractArticleMessageContent(article);

        if (deliveryContent) {
          const customDeliveryTextFilepath = `./fiverr/${deliveryDate}_${orderNumber}/delivery.txt`;
          chrome.runtime.sendMessage({
            action: "createMessageDeliveryFile",
            deliveryContent: deliveryContent,
            filename: customDeliveryTextFilepath,
          });
        }
      }

      filteredDownloadLinks.forEach((linkObj) => {
        const { linkHref, fileName } = linkObj;
        if (isVideoFile(fileName)) return;
        const customFilepath = `./fiverr/${deliveryDate}_${orderNumber}/${fileName}`;
        chrome.runtime.sendMessage({
          action: "downloadFiverrFile",
          url: linkHref,
          filename: customFilepath,
        });
      });
    } catch (error) {
      console.error(`Caught Error in article: ${article}`);
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

function cleanElementText(element) {
  const cleanedElement = element.textContent
    .replace(/,/g, "")
    .replace(/:/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  return cleanedElement;
}
1;

function filterArticles() {
  const articles = document.querySelectorAll("article");
  const filteredArticles = [];

  articles.forEach((article) => {
    const titleTextElement = article.querySelector("span.title-text");
    const downloadLinks = article.querySelectorAll(
      'a[href^="https://www.fiverr.com/download"]'
    );

    if (titleTextElement) {
      const titleText = titleTextElement.textContent.trim();
      const hasDownloadLink = downloadLinks.length > 0;
      const fromSeller =
        titleText.startsWith("You sent") ||
        titleText.startsWith("You delivered");
      if (fromSeller && hasDownloadLink) {
        filteredArticles.push(article);
      }
    }
  });
  return filteredArticles;
}

function filterDownloadLinks(article) {
  const downloadLinks = article.querySelectorAll(
    'a[href^="https://www.fiverr.com/download"]'
  );
  const filteredLinks = [];

  downloadLinks.forEach((link) => {
    try {
      const linkHref = link.getAttribute("href");
      const fileName = extractFileName(linkHref);
      if (!fileName) return;
      filteredLinks.push({ linkHref, fileName });
    } catch (error) {
      console.error(`Error processing download link: ${link.href}`);
      console.error(error);
    }
  });

  return filteredLinks;
}

function extractArticleMessageContent(article) {
  const userMessageDiv = article.querySelector(".user-message");
  if (userMessageDiv) {
    const messageContent = userMessageDiv.querySelector("p");
    if (messageContent) {
      const messageText = messageContent.textContent.trim();
      return messageText;
    }
  }

  const messageContentDiv = article.querySelector(".message-content");
  if (messageContentDiv) {
    const messageText = messageContentDiv.textContent.trim();
    return messageText;
  }

  return null;
}
