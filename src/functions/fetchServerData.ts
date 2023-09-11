const SERVER_HOST = "play.blackpi.org"


function getServerData(server: String) {
  
  if (typeof server !== "string") {
    throw new Error("Server must be a string");
  }

  if (server.includes(" ")) {
    throw new Error("Server cannot contain spaces");
  }

  if (!server.includes(".")) {
    throw new Error("Server must be a domain or IP");
  }
  
  

  const response = fetch("https://api.mcsrvstat.us/3/" + server)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

    return response
}

export { getServerData, SERVER_HOST };
