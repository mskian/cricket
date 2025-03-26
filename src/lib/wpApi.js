export async function fetchPosts(matchId = "114996") {

  try {
  
    const apiUrl = process.env.MATCH_URL;
    const response = await fetch(`${apiUrl}/score?id=${matchId}`);

    if (!response.ok) throw new Error("Failed to fetch match data");

    const data = await response.json();

    if (!data?.title) return [];

    const noMatchDetails =
      data.livescore === "Data Not Found" && data.batterone === "Data Not Found";

    if (noMatchDetails) {
      return [
        {
          id: "1",
          title: data.title || "Match Info Unavailable",
          content: `${data.update || "Match status unavailable."}`,
        },
      ];
    }

    const formatBatsman = (name, runs, balls, sr) =>
      name && name !== "Data Not Found"
        ? `${name} - ${runs} ${balls} SR: ${sr}`
        : "No data";

    const formatBowler = (name, overs, runs, wickets, econ) =>
      name
        ? `${name} - ${overs} Overs, ${runs} Runs, ${wickets} Wickets, Econ: ${econ}`
        : "No data";

    return [
      {
        id: "1",
        title: data.title || "Match Info Unavailable",
        content: `
          ${data.update || "No updates available."}<br><br>
          🔴 Score: ${data.livescore || "N/A"} <br><br>
          📊 ${data.runrate || "N/A"}<br><br>
          🏏 Batsmen:<br>
              ${formatBatsman(data.batterone, data.batsmanonerun, data.batsmanoneball, data.batsmanonesr)}<br><br>
          🥎 Bowler:<br>
              ${formatBowler(data.bowlerone, data.bowleroneover, data.bowleronerun, data.bowleronewickers, data.bowleroneeconomy)}<br><br>
        `,
      },
    ];
  } catch (error) {
    console.error("Error fetching match data:", error);
    return [];
  }

}