window.onload = function () {
  var modalArea = document.getElementById("filesg-modal-container");
  modalArea.style.display = "none";
  modalArea.style.position = "fixed";
  modalArea.style.left = 0;
  modalArea.style.top = "100px";
  modalArea.style.width = "100%";
  modalArea.style.height = "100%";
  modalArea.style.overflow = "auto";
  modalArea.style.backgroundColor = "rgba(0,0,0,0.5)";

  var modalContent = document.createElement("div");
  modalContent.setAttribute("id", "filesg-modal-content");
  modalContent.style.position = "relative";
  modalContent.style.backgroundColor = "transparent";
  modalContent.style.margin = "auto";
  modalContent.style.padding = "0";
  modalContent.style.width = "50%";

  var modalHeader = document.createElement("div");
  modalHeader.setAttribute("id", "filesg-modal-header");
  modalHeader.style.color = "green";
  modalHeader.style.float = "right";
  modalHeader.style.fontSize = "50px";
  modalHeader.style.fontWeight = "bold";

  modalHeader.addEventListener(
    "mouseenter",
    function (event) {
      event.target.style.color = "purple";
    },
    false
  );

  modalHeader.addEventListener(
    "mouseover",
    function (event) {
      event.target.style.color = "purple";
    },
    false
  );

  var modalBody = document.createElement("div");
  modalBody.setAttribute("id", "filesg-modal-body");

  var modalSpan = document.createElement("span");
  modalSpan.setAttribute("id", "filesg-modal-close");
  modalSpan.setAttribute("onclick", "filesgCloseModal()");

  var fileSGiframe = document.createElement("iframe");
  fileSGiframe.src = "http://localhost:3000/";
  fileSGiframe.setAttribute("height", 533);
  fileSGiframe.setAttribute("width", "100%");

  modalSpan.append("x");
  modalHeader.appendChild(modalSpan);
  modalBody.appendChild(fileSGiframe);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalArea.appendChild(modalContent);
};

// eslint-disable-next-line no-unused-vars
function filesgShowModal() {
  var modal = document.getElementById("filesg-modal-container");
  modal.style.display = "block";
}

// eslint-disable-next-line no-unused-vars
function filesgCloseModal() {
  var modal = document.getElementById("filesg-modal-container");
  modal.style.display = "none";
}

window.addEventListener("message", (event) => {
  console.log("incoming message");
  console.log(event.data);
  document
    .getElementById("filesg-data-container")
    ?.setAttribute("data-uploadid", event.data);
});
