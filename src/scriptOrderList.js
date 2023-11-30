// runs when script is loaded from background.js
const encryptedIdsList = [];
getUsername()
  .then((fiverrUsername) => {
    const startUrl = `https://www.fiverr.com/users/${fiverrUsername}/manage_orders/type/completed?cmd=n`;
    fetchEncryptedIds(startUrl);
  })
  .catch((error) => {
    console.log("Error:", error);
  });

async function fetchEncryptedIds(startUrl) {
  console.log("Fetching Encrypted IDs from URL: ", startUrl);
  try {
    const response = await fetch(startUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();

    const encryptedIds = data.encrypted_ids;
    const nextUrl = data.load_more_url;

    if (encryptedIds.length > 0) {
      encryptedIds.forEach((id) => {
        if (!encryptedIdsList.includes(id)) {
          encryptedIdsList.push(id);
        }
      });
      console.log(encryptedIdsList);
    } else {
      console.log("No encrypted IDs found in the response.");
    }

    if (nextUrl) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await fetchEncryptedIds(nextUrl);
    } else {
      console.log("Sending Downloaded Order IDs: ", encryptedIdsList);

      chrome.runtime.sendMessage({
        action: "startDownloadingFiles",
        orderList: encryptedIdsList,
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getUsername() {
  return new Promise((resolve, reject) => {
    fetch("https://www.fiverr.com/my_profile", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => {
        if (response.redirected) {
          const redirectedUrl = new URL(response.url);
          const username = redirectedUrl.pathname.split("/")[1];
          resolve(username);
        } else {
          reject("No redirection occurred.");
        }
      })
      .catch((error) => reject(error));
  });
}
