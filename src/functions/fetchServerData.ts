const SERVER_HOST = "play.blackpi.org";
import { type apiServerResponse } from "../types/apiServerResponse";


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
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Aquí puedes manejar la respuesta exitosa
      return data;
    })
    .catch((error) => {
      // Aquí puedes manejar errores
      console.error("Hubo un error en la solicitud:", error);
      const json: apiServerResponse = {
        ip: "3.145.101.233",
        port: 25565,
        debug: {
          ping: true,
          query: false,
          srv: false,
          querymismatch: false,
          ipinsrv: false,
          cnameinsrv: false,
          animatedmotd: false,
          cachehit: true,
          cachetime: 1694405593,
          cacheexpire: 1694405893,
          apiversion: 3,
          dns: {
            a: [
              {
                name: "play.blackpi.org",
                type: "A",
                class: "IN",
                ttl: 300,
                rdlength: 0,
                rdata: "",
                address: "3.145.101.233",
              },
            ],
          },
          error: { query: "Failed to read from socket." },
        },
        motd: {
          raw: [
            "CentralCraft",
            "\u00a7r\u00a79c\u00a7r\u00a79e\u00a7r\u00a79n\u00a7r\u00a79t\u00a7r\u00a79r\u00a7r\u00a79a\u00a7r\u00a79l\u00a7r\u00a79c\u00a7r\u00a7dr\u00a7r\u00a7da\u00a7r\u00a7df\u00a7r\u00a7dt\u00a7r\u00a7d.\u00a7r\u00a7db\u00a7r\u00a7dl\u00a7r\u00a7da\u00a7r\u00a7cc\u00a7r\u00a7ck\u00a7r\u00a7cp\u00a7r\u00a7ci\u00a7r\u00a7c.\u00a7r\u00a7co\u00a7r\u00a7cr\u00a7r\u00a7cg\u00a7r",
          ],
          clean: ["CentralCraft", "centralcraft.blackpi.org"],
          html: [
            "CentralCraft",
            '<span style="color: #5555FF">c</span><span style="color: #5555FF">e</span><span style="color: #5555FF">n</span><span style="color: #5555FF">t</span><span style="color: #5555FF">r</span><span style="color: #5555FF">a</span><span style="color: #5555FF">l</span><span style="color: #5555FF">c</span><span style="color: #FF55FF">r</span><span style="color: #FF55FF">a</span><span style="color: #FF55FF">f</span><span style="color: #FF55FF">t</span><span style="color: #FF55FF">.</span><span style="color: #FF55FF">b</span><span style="color: #FF55FF">l</span><span style="color: #FF55FF">a</span><span style="color: #FF5555">c</span><span style="color: #FF5555">k</span><span style="color: #FF5555">p</span><span style="color: #FF5555">i</span><span style="color: #FF5555">.</span><span style="color: #FF5555">o</span><span style="color: #FF5555">r</span><span style="color: #FF5555">g</span>',
          ],
        },
        players: { online: 0, max: 69, list: [] },
        version: "1.20.1",
        online: true,
        protocol: { version: 763, name: "1.20.1" },
        hostname: "play.blackpi.org",
        software: "Paper",
        eula_blocked: false,
      };
      return json;
    });

  return response;
}

export { getServerData, SERVER_HOST };
