const mainDir = "../tmp/Everything/";
const imgDir = mainDir + "images/";
const audioDir = mainDir + "audios/";

const width = window.innerWidth;
const height = window.innerHeight;

async function loadData() {
  const imageSceneData = await d3.json(mainDir + "imageSceneData.json");
  //   const audioSceneData = await d3.json(mainDir + "audioSceneData.json");

  console.log(imageSceneData);
  //   console.log(audioSceneData);

  const container = d3
    .select("body")
    .append("div")
    .attr("class", "preview-container");

  makeLayout(container, imageSceneData);
}

function makeLayout(container, imageSceneData) {
  const timeScale = d3.scaleLinear().domain();

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const radius = (width / imageSceneData.length) * 4;

  const nodes = imageSceneData.map((d, i) => ({
    id: i,
    x: width / 2,
    y: height / 2,
    radius: radius,
    ...d,
  }));
  console.log(nodes);

  const sim = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-0.4))
    .force(
      "collision",
      d3.forceCollide().radius((d) => d.radius + 5)
    )
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", () => ticked());

  function ticked() {
    node
      .attr("x", (d) => Math.max(d.radius, Math.min(width - d.radius, d.x)))
      .attr("y", (d) => Math.max(d.radius, Math.min(height - d.radius, d.y)));

    color_node
      .attr("x", (d) => Math.max(d.radius, Math.min(width - d.radius, d.x)))
      .attr("y", (d) => Math.max(d.radius, Math.min(height - d.radius, d.y)));
  }

  const node = svg
    .selectAll("image")
    .data(nodes)
    .enter()
    .append("image")
    .attr("xlink:href", (d) => imgDir + d["filename"])
    .attr("width", (d) => d.radius)
    .attr("height", (d) => d.radius)
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y);

  const color_node = svg
    .selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("width", (d) => d.radius)
    .attr("height", (d) => 1)
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("fill", (d) => {
      let [r, g, b] = d.colors[0];
      return `rgb(${r},${g},${b})`;
    });
}

loadData();
