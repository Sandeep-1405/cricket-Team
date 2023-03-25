const express = require("express");
const { open } = require("sqlite");
const sqllite3 = require("sqlite3");

const app = express();
app.use(express.json());
const path = require("path");

const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initalisedbnconnect = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqllite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running at http://CricketTeam:3000/`);
    });
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};

initalisedbnconnect();

/*API 1 get Details*/

app.get("/players/", async (request, response) => {
  const dbquery = `SELECT * from cricket_team;`;
  playersArray = await db.all(dbquery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

/*API 2 Add player*/

app.post("/players/", async (request, response) => {
  const playerdetails = request.body;
  const { player_name, jersey_number, role } = playerdetails;

  const dbaddquery = `
    INSERT INTO
        cricket_team (player_name,jersey_number,role)
    VALUES
    (
        '${player_name}',
        '${jersey_number}',
        '${role}'
    );`;
  const dbResponse = await db.run(dbaddquery);
  /*const playerId = dbResponse.lastID;
  response.send({ playerId: playerId });*/
  response.send("Player Added to Team");
});

/* API 3 Returns a player based on a player ID*/

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const dbquery = `
    SELECT 
        * 
    FROM 
        cricket_team 
    WHERE
        player_id = ${playerId};`;

  const player1 = await db.get(dbquery);
  response.send(player1);
});

/* API 4 Updates the details of a player in the team*/

app.put("/players/:playerId/",async (request, response) =>{
    const {playerId} = request.params;
    const playerdetails = request.body;
    const { player_name, jersey_number, role } = playerdetails;

    const updatequerry = `
    UPDATE 
        cricket_team
    SET
        player_name ='${player_name}',
        jersey_number = '${jersey_number}',
        role = '${role}'
    WHERE
         player_id = ${playerId};`;


    const updaterresponse = await db.run(updatequerry);
    response.send("Player Details Updated");
    /*response.send(updaterresponse)*/

})

module.exports = app;
