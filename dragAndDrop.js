import addGlobalEventListener from "./addGlobalEventListener";

export default function setup(dragnDropCompleted) {
  addGlobalEventListener("mousedown", "[data-draggable]", (e) => {
    const element = e.target;
    const elementClone = element.cloneNode(true);
    elementClone.classList.add("dragging");

    const ghost = element.cloneNode();

    const offset = setUpDragItems(e, elementClone, element, ghost);

    setUpDragEvents(elementClone, element, offset, ghost, dragnDropCompleted);
  });
}

// add mouseDown {
// add mouseMove
// add mouseUp and remove mouseMove
// }

function setUpDragItems(e, elementClone, element, ghost) {
  const originalRect = element.getBoundingClientRect();

  const offset = {
    x: e.clientX - originalRect.x,
    y: e.clientY - originalRect.y,
  };

  elementClone.style.width = `${originalRect.width}px`;
  positionClone(elementClone, e, offset);
  document.body.append(elementClone);
  element.classList.add("hide");

  ghost.style.height = `${originalRect.height}px`;
  ghost.classList.add("ghost");
  ghost.innerHtML = "";
  element.parentElement.insertBefore(ghost, element);

  return offset;
}

function setUpDragEvents(elementClone, element, offset, ghost, dragnDropCompleted) {
  const mousemove = (e) => {
    ("mouse MOVINGggggg");
    e;
    positionClone(elementClone, e, offset);

    const dropZone = getDropZone(e.target);

    if (dropZone != null) {
      const closestChild = Array.from(dropZone.children).find((el) => {
        const taskRect = el.getBoundingClientRect();
        return e.clientY < taskRect.top + taskRect.height / 2;
      });
      if (closestChild != null) {
        dropZone.insertBefore(ghost, closestChild);
      } else {
        dropZone.append(ghost);
      }
    }
  };

  document.addEventListener("mousemove", mousemove);

  document.addEventListener(
    "mouseup",
    (e) => {
      document.removeEventListener("mousemove", mousemove);

      const dropZone = getDropZone(ghost);
      if (dropZone) {

        dragnDropCompleted({
          startZone: getDropZone(element),
          endZone: dropZone,
          index: [...dropZone.children].indexOf(ghost),
          draggedElement: element
        })

        dropZone.insertBefore(element, ghost);
      }

      stopDrag(element, elementClone, ghost);
    },
    { once: true }
  );
}

function stopDrag(element, elementClone, ghost) {
  element.classList.remove("hide");
  elementClone.remove();
  ghost.remove();
}

function getDropZone(element) {
  if (element.matches("[data-drop-zone]")) {
    return element;
  } else {
    return element.closest("[data-drop-zone]");
  }
}

function positionClone(itemClone, mousePosition, offset) {
  itemClone.style.top = `${mousePosition.clientY - offset.y}px`;
  itemClone.style.left = `${mousePosition.clientX - offset.x}px`;
}
