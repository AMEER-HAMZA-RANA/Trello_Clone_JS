import setupDragAndDrop from "./dragAndDrop";
import { v4 as uuid } from "uuid";

const DEFAULT_LANES = {
  backlog: [
    { id: uuid(), text: "Do Laundry" },
    { id: uuid(), text: "Edit Video" },
  ],
  doing: [{ id: uuid(), text: "Record Video" }],
  done: [{ id: uuid(), text: "Plan trello clone video" }],
};

const lanes = loadLanes();
renderLanes();

setupDragAndDrop(dragnDropCompleted);
function dragnDropCompleted(dragInfo) {
  updateLanes(dragInfo);
}

function updateLanes(dragInfo) {
  const { startZone, endZone, index, draggedElement } = dragInfo;

  const startLaneName = startZone.dataset.laneName;
  const endLaneName = endZone.dataset.laneName;

  let startLaneTasks = lanes[startLaneName];
  let endLaneTasks = lanes[endLaneName];

  const task = startLaneTasks.find((t) => t.id == draggedElement.id);

  startLaneTasks.splice(startLaneTasks.indexOf(task), 1);
  endLaneTasks.splice(index, 0, task);

  saveLanes();
}

function loadLanes() {
  const lanesJson = localStorage.getItem("Lanes");
  return JSON.parse(lanesJson) || DEFAULT_LANES;
}

function saveLanes() {
  localStorage.setItem("Lanes", JSON.stringify(lanes));
}

function renderLanes() {
  Object.entries(lanes).forEach((index) => {
    const laneName = index[0];
    const tasks = index[1];
    const htmlLane = document.querySelector(`[data-lane-name="${laneName}"]`);
    tasks.forEach((task) => {
      const taskHTML = renderTask(task);
      htmlLane.append(taskHTML);
    });
  });
}

function renderTask(task) {
  const element = document.createElement("div");
  element.innerText = task.text;
  element.classList.add("task");
  element.dataset.draggable = true;
  element.id = task.id;
  return element;
}
