export async function getMatchId() {
  
  try {
    const response = await fetch("https://sanwebinfo.github.io/api-id/one.json");
    if (!response.ok) throw new Error("Failed to fetch match ID");
    const data = await response.json();
    return data?.data_id || "12345";
  } catch (error) {
    console.error("Error fetching match ID");
    return "12345";
  }
}

export async function fetchPosts() {
  try {
    const matchId = await getMatchId();
    const apiUrl = process.env.MATCH_URL;
    const response = await fetch(`${apiUrl}/score?id=${matchId}`);

    if (!response.ok) throw new Error("Failed to fetch match data");

    const data = await response.json();

    if (!data?.title) return [];

    const noMatchDetails =
      data.livescore === "Data Not Found" || data.batterone === "Match Stats will Update Soon";

    if (noMatchDetails) {
      return [
        {
          id: matchId,
          title: data.title.replace("- Live Cricket Score", "").trim() || "Match Info Unavailable",
          content: `🏆 ${data.update || "Match status unavailable."}`,
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
        id: matchId,
        title: data.title.replace("- Live Cricket Score", "").trim() || "Match Info Unavailable",
        content: `
          🏆 ${data.update || "No updates available."}<br><br>
          🔴 ${data.livescore || "N/A"} <br><br>
          📊 ${data.runrate || "N/A"}<br><br>
          🏏 Batsmen:<br>
              ➡ ${formatBatsman(data.batterone, data.batsmanonerun, data.batsmanoneball, data.batsmanonesr)}<br><br>
          🥎 Bowler:<br>
              ➡ ${formatBowler(data.bowlerone, data.bowleroneover, data.bowleronerun, data.bowleronewickers, data.bowleroneeconomy)}<br>
        `,
      },
    ];
  } catch (error) {
    console.error("Error fetching match data");
    return [];
  }

}
