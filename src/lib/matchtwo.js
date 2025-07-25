export async function getMatchId() {
  try {
    const response = await fetch("https://sanwebinfo.github.io/api-id/two.json");
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

    if (!data?.title) {
      return [{
        id: matchId,
        title: "No Active Match",
        content: "🏆 No live matches currently. Check back later for updates."
      }];
    }

    const noMatchDetails = 
      data.livescore === "Data Not Found" || 
      data.batterone === "Match Stats will Update Soon";

    if (noMatchDetails) {
      return [{
        id: matchId,
        title: data.title.replace("- Live Cricket Score", "").trim() || "Match Info Unavailable",
        content: `🏆 ${data.update || "Match not started or data unavailable."}`
      }];
    }

    const formatBatsman = (name, runs, balls, sr) =>
      name && name !== "Data Not Found"
        ? `${name} - ${runs} ${balls} SR: ${sr}`
        : "No batting data";

    const formatBowler = (name, overs, runs, wickets, econ) =>
      name && name !== "Data Not Found"
        ? `${name} - ${overs} Overs, ${runs} Runs, ${wickets} Wickets, Econ: ${econ}`
        : "No bowling data";

    return [{
      id: matchId,
      title: data.title.replace("- Live Cricket Score", "").trim() || "Live Match",
      content: `
        🏆 ${data.update || "Match in progress"}<br><br>
        🔴 ${data.livescore || "Score not available"}<br><br>
        📊 ${data.runrate ? `Run Rate: ${data.runrate}` : "Run rate not available"}<br><br>
        🏏 ${formatBatsman(data.batterone, data.batsmanonerun, data.batsmanoneball, data.batsmanonesr)}<br><br>
        🥎 ${formatBowler(data.bowlerone, data.bowleroneover, data.bowleronerun, data.bowleronewickers, data.bowleroneeconomy)}
      `
    }];
  } catch (error) {
    console.error("Error fetching match data:", error);
    return [{
      id: "error",
      title: "Connection Error",
      content: "🏆 Unable to fetch match data. Please check your connection."
    }];
  }
}