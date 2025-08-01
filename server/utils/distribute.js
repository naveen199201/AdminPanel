export default function distribute(data, agents) {
  const result = [];
  const totalAgents = agents.length;

  data.forEach((item, index) => {
    const agentIndex = index % totalAgents;
    result.push({
      agentId: agents[agentIndex]._id,
      FirstName: item.FirstName,
      Phone: item.Phone,
      Notes: item.Notes,
    });
  });

  return result;
}

