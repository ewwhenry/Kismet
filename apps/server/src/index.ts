import { PORT } from "./config.js";
import server from "./http.js";

server.listen(PORT, () => {
  console.log("Server on port %d", PORT);
});
