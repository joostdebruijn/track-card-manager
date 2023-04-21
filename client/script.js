'use strict';
/*
 * ========================================
 * ========== Aqua Track Manager ==========
 * ========================================
 * = Creation of track cards. Reinvented. =
 * =         (c) AquaLabs V.O.F.          =
 * ========================================
 */

/*
 * Set variables
 */
let availableIntervals, availableLanes, availablePontoons;
let lanes, pontoons;

let startContainer;
let lanesContainer;
let pontoonsContainer;

/**
 * Initialization script
 */
(function() {
 getTrackById(64)
  .then(function(response) {
    return response.json();
  }).then(function(fetchResult) {
    // Set the variables
    let result = fetchResult.content;
    availableIntervals = result.availableIntervals;
    availableLanes = result.availableLanes;
    availablePontoons = result.availablePontoons;
    lanes = result.lanes;
    pontoons = result.pontoons;

    initializeBase();
    initializeLanes();
    initializePontoons();
    initializeLabels();
    initializeSideLanes();
  });
})();

/**
 * Initialize the base DOM nodes
 */
function initializeBase() {
  // Create map element
  let mapNode = document.createElement('div');
  mapNode.classList.add('map');
  let startContainerNode = document.createElement('div');
  startContainerNode.classList.add('start-container');
  mapNode.append(startContainerNode);
  startContainer = startContainerNode;
  let lanesContainerNode = document.createElement('div');
  lanesContainerNode.classList.add('lanes-container');
  mapNode.append(lanesContainerNode);
  lanesContainer = lanesContainerNode;
  let pontoonsContainerNode = document.createElement('div');
  pontoonsContainerNode.classList.add('pontoons-container');
  mapNode.append(pontoonsContainerNode);
  pontoonsContainer = pontoonsContainerNode;

  document.querySelector('body').prepend(mapNode);
  // Create labels container node
  let labelsContainerNode = document.createElement('div');
  labelsContainerNode.classList.add('labels-container');
  document.querySelector('body').prepend(labelsContainerNode);
  
}

/**
 * Initialize the labels in the DOM
 */
function initializeLabels() {
  let labelsContainerNode = document.querySelector('.labels-container');
  let lastInterval = 0;
  let intervalsVar = availableIntervals;
  intervalsVar.push(availableIntervals[availableIntervals.length - 1]);
  availableIntervals.forEach((interval, index) => {
    if (index != 0) {
      // Create a DOM node for the interval
      let intervalNode = document.createElement('div');
      // Set the interval properties
      intervalNode.classList.add('interval');
      intervalNode.setAttribute('interval', interval);
      intervalNode.style.flex = interval- lastInterval;
      let intervalLabelNode = document.createElement('span');
      if (lastInterval === 0) {
        intervalLabelNode.innerHTML = 'Start';
      } else if (lastInterval === 2000) {
        intervalLabelNode.innerHTML = 'Finish';
      } else {
        intervalLabelNode.innerHTML = lastInterval + 'm';
      }
      intervalNode.appendChild(intervalLabelNode);
      lastInterval = interval;
      labelsContainerNode.appendChild(intervalNode);
    }
  });
}

/**
 * Initialize the lanes in the DOM
 */
function initializeLanes() {
  // Loop through the lanes to be initialized
  availableLanes.forEach(createLane);
}
/**
 * Initialize the pontoons in the DOM
 */
function initializePontoons() {
  // Create pontoons holder node
  let pontoonsNode = document.createElement('div');
  pontoonsNode.classList.add('pontoons');
  // Create pontoons
  availablePontoons.forEach((pontoon) => {
    // Create pontoon node
    let pontoonNode = document.createElement('div');
    pontoonNode.classList.add('pontoon');
    pontoonNode.setAttribute('pontoon-number', pontoon.number);
    pontoonNode.setAttribute('status', pontoons[pontoon].status);
    pontoonNode.onclick = onPontoonClicked;
    // Create svg container
    let pontoonSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pontoonSVG.setAttribute('height', '100%');
    pontoonSVG.setAttribute('viewBox', '0 0 100 100');
    // Initialize outbound items
    let outBoundArrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outBoundArrow.setAttribute('d', 'M20,50 L50,80 L50,20 z')
    outBoundArrow.setAttribute('stroke', '#fff')
    outBoundArrow.setAttribute('fill', '#fff')
    outBoundArrow.classList.add('outbound');
    pontoonSVG.append(outBoundArrow);
    let outBoundArrowLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outBoundArrowLine.setAttribute('d', 'M50,50 L90,50')
    outBoundArrowLine.setAttribute('stroke', '#fff')
    outBoundArrowLine.setAttribute('stroke-width', '10px')
    outBoundArrowLine.classList.add('outbound');
    pontoonSVG.append(outBoundArrowLine);
    // Initialize inbound items
    let inBoundArrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    inBoundArrow.setAttribute('d', 'M80,50 L50,80 L50,20 z')
    inBoundArrow.setAttribute('stroke', '#fff')
    inBoundArrow.setAttribute('fill', '#fff')
    inBoundArrow.classList.add('inbound');
    pontoonSVG.append(inBoundArrow);
    let inBoundArrowLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    inBoundArrowLine.setAttribute('d', 'M10,50 L50,50')
    inBoundArrowLine.setAttribute('stroke', '#fff')
    inBoundArrowLine.setAttribute('stroke-width', '10px')
    inBoundArrowLine.classList.add('inbound');
    pontoonSVG.append(inBoundArrowLine);
    // Initialize closed items
    let closed = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    closed.setAttribute('d', 'M20,20 L80,80 M20,80 L80,20')
    closed.setAttribute('stroke', '#fff')
    closed.setAttribute('stroke-width', '10px')
    closed.classList.add('closed');
    pontoonSVG.append(closed);
    // Add the pontoon to the pontoon holder node
    pontoonNode.append(pontoonSVG);
    pontoonsNode.append(pontoonNode);
  });
  // Insert the pontoons in the DOM
  pontoonsContainer.prepend(pontoonsNode);
}
/**
 * Initialize the side lines in the track
 */
function initializeSideLanes() {
  // Create the first side lane nodes
  let firstStartSideLaneNode = document.createElement('div');
  let firstLaneSideLaneNode = document.createElement('div');
  let firstPontoonSideLaneNode = document.createElement('div');
  // Create the second side lane nodes
  let secondStartSideLaneNode = document.createElement('div');
  let secondLaneSideLaneNode = document.createElement('div');
  let secondPontoonSideLaneNode = document.createElement('div');
  // Set the side lane properties
  [
    firstStartSideLaneNode, firstLaneSideLaneNode, firstPontoonSideLaneNode,
    secondStartSideLaneNode, secondLaneSideLaneNode, secondPontoonSideLaneNode,
  ].forEach((element) => {
    element.classList.add('side-lane');
  });
  // Set interval nodes in the side lane inside the lanes container
  createIntervalsOnNode(firstLaneSideLaneNode);
  createIntervalsOnNode(secondLaneSideLaneNode);
  // Insert the side lanes in the DOM
  startContainer.prepend(firstStartSideLaneNode);
  lanesContainer.prepend(firstLaneSideLaneNode);
  pontoonsContainer.prepend(firstPontoonSideLaneNode);
  startContainer.append(secondStartSideLaneNode);
  lanesContainer.append(secondLaneSideLaneNode);
  pontoonsContainer.append(secondPontoonSideLaneNode);
}

/**
 * Create the pre-set intervals on a node (e.g. lanes or side lane)
 * @param {DOMNode} node The node to set the intervals on
 */
function createIntervalsOnNode(node) {
  // Loop over intervals
  if (availableIntervals[0] != 0) {
    availableIntervals.splice(0,0,0);
  }
  availableIntervals.forEach((interval, index) => {
    // First interval should be 0, and ommitted
    if (index != 0) {
      // Get last interval
      let lastInterval = availableIntervals[index - 1];
      // Create the interval on this node
      createIntervalOnNode(node, interval, lastInterval);
    }
  });
}

/**
 * Create the a interval on a node (e.g. lanes or side lane)
 * @param {DOMNode} node The node to set the intervals on
 * @param {Number} interval The meters of the current interval
 * @param {Number} lastInterval The meters of the last interval
 */
function createIntervalOnNode(node, interval, lastInterval) {
  // Create a DOM node for the interval
  let intervalNode = document.createElement('div');
  // Set the interval properties
  intervalNode.classList.add('interval');
  intervalNode.setAttribute('interval', interval);
  intervalNode.style.flex = interval- lastInterval;
  // Print interval status in interval if the node is a lane
  if (node.classList.contains('lane') && node.getAttribute('lane-number')) {
    // Create a DOM nodes for the interval status
    createIntervalStatusNode(intervalNode, node);
  }
  // Print lane number in interval if the node is a lane and interval is first
  if (node.classList.contains('lane') && node.getAttribute('lane-number') && lastInterval === availableIntervals[0] || interval === availableIntervals[availableIntervals.length-1]) {
    // Create a DOM node for the lane number
    let laneNumber = document.createElement('div');
    // Set the lane number properties
    laneNumber.classList.add('lane-number');
    laneNumber.textContent = node.getAttribute('lane-number');
    // Prepend or append lane number to interval node
    if (lastInterval === availableIntervals[0]) {
      intervalNode.prepend(laneNumber);
    } else {
      intervalNode.append(laneNumber);
    }
  }
  // Append interval to lane node
  node.appendChild(intervalNode);
}

function createIntervalStatusNode(intervalNode, laneNode) {
  // Step 1) Create DOM nodes for the interval status sections
  // Step 1.1) Create section left
  let intervalSectionLeft = document.createElement('div');
  intervalSectionLeft.classList.add('interval-section-left');
  let intervalSectionLeftStatus = 'NONE';
  if (laneNode.getAttribute('lane-number') && lanes[laneNode.getAttribute('lane-number')].intervals[intervalNode.getAttribute('interval')].left) {
    intervalSectionLeftStatus = lanes[laneNode.getAttribute('lane-number')].intervals[intervalNode.getAttribute('interval')].left;
  }
  intervalSectionLeft.setAttribute('status', intervalSectionLeftStatus);
  intervalSectionLeft.addEventListener('click', onIntervalSectionClicked);
  let intervalSectionLeftSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  intervalSectionLeftSVG.setAttribute('width', '44px');
  intervalSectionLeftSVG.setAttribute('height', '100%');
  intervalSectionLeftSVG.setAttribute('viewBox', '0 0 100 100');
  intervalSectionLeftSVG.setAttribute('status', status);
  // Step 1.2) Create section center
  let intervalSectionCenter = document.createElement('div');
  intervalSectionCenter.classList.add('interval-section-center');
  intervalSectionCenter.addEventListener('click', onIntervalSectionClicked);
  intervalSectionCenter.setAttribute('status', 'NONE');
  let intervalSectionCenterStatus = 'NONE';
  if (laneNode.getAttribute('lane-number') && lanes[laneNode.getAttribute('lane-number')].intervals[intervalNode.getAttribute('interval')].center) {
    intervalSectionCenterStatus = lanes[laneNode.getAttribute('lane-number')].intervals[intervalNode.getAttribute('interval')].center;
  }
  intervalSectionCenter.setAttribute('status', intervalSectionCenterStatus);
  let intervalSectionCenterSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  intervalSectionCenterSVG.setAttribute('width', '100%');
  intervalSectionCenterSVG.setAttribute('height', '100%');
  intervalSectionCenterSVG.setAttribute('viewBox', '0 0 100 100');
  intervalSectionCenterSVG.setAttribute('preserveAspectRatio', 'none');
  intervalSectionCenterSVG.setAttribute('status', status);
  // Step 1.3) Create section right
  let intervalSectionRight = document.createElement('div');
  intervalSectionRight.classList.add('interval-section-right');
  intervalSectionRight.addEventListener('click', onIntervalSectionClicked);
  let intervalSectionRightStatus = 'NONE';
  if (laneNode.getAttribute('lane-number') && lanes[laneNode.getAttribute('lane-number')].intervals[intervalNode.getAttribute('interval')].right) {
    intervalSectionRightStatus = lanes[laneNode.getAttribute('lane-number')].intervals[intervalNode.getAttribute('interval')].right;
  }
  intervalSectionRight.setAttribute('status', intervalSectionRightStatus);
  let intervalSectionRightSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  intervalSectionRightSVG.setAttribute('width', '44px');
  intervalSectionRightSVG.setAttribute('height', '100%');
  intervalSectionRightSVG.setAttribute('viewBox', '0 0 100 100');
  intervalSectionRightSVG.setAttribute('status', status);
  // Step 2) Setup the drawings
  // Step 2.1) Drawings section left
  // Create a DOM node for arrow left
  let arrowLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLeft.setAttribute('d', 'M10,50 L20,60 L20,40 z')
  arrowLeft.setAttribute('stroke', '#fff')
  arrowLeft.setAttribute('stroke-width', '5px');
  arrowLeft.setAttribute('fill', '#fff')
  arrowLeft.classList.add('arrow');
  intervalSectionLeftSVG.appendChild(arrowLeft);
  let arrowLineLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLineLeft.setAttribute('d', 'M100,50 L20,50')
  arrowLineLeft.setAttribute('stroke', '#fff')
  arrowLineLeft.setAttribute('stroke-width', '5px');
  arrowLineLeft.setAttribute('fill', '#fff')
  arrowLineLeft.classList.add('arrow-line');
  intervalSectionLeftSVG.appendChild(arrowLineLeft);
  // Create a DOM node for arrow up
  let arrowLeftUp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLeftUp.setAttribute('d', 'M25,10 L35,20 L15,20 z')
  arrowLeftUp.setAttribute('stroke', '#fff')
  arrowLeftUp.setAttribute('stroke-width', '5px');
  arrowLeftUp.setAttribute('fill', '#fff');
  arrowLeftUp.classList.add('arrow-up');
  intervalSectionLeftSVG.appendChild(arrowLeftUp);
  let arrowLineLeftUp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLineLeftUp.setAttribute('d', 'M100,50 Q25,50,25,20')
  arrowLineLeftUp.setAttribute('stroke', '#fff')
  arrowLineLeftUp.setAttribute('stroke-width', '5px');
  arrowLineLeftUp.setAttribute('fill', 'none')
  arrowLineLeftUp.classList.add('arrow-line-up');
  intervalSectionLeftSVG.appendChild(arrowLineLeftUp);
  // Create a DOM node for arrow down
  let arrowLeftDown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLeftDown.setAttribute('d', 'M25,90 L35,80 L15,80 z')
  arrowLeftDown.setAttribute('stroke', '#fff')
  arrowLeftDown.setAttribute('stroke-width', '5px');
  arrowLeftDown.setAttribute('fill', '#fff');
  arrowLeftDown.classList.add('arrow-down');
  intervalSectionLeftSVG.appendChild(arrowLeftDown);
  let arrowLineLeftDown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLineLeftDown.setAttribute('d', 'M100,50 Q25,50,25,80')
  arrowLineLeftDown.setAttribute('stroke', '#fff')
  arrowLineLeftDown.setAttribute('stroke-width', '5px');
  arrowLineLeftDown.setAttribute('fill', 'none')
  arrowLineLeftDown.classList.add('arrow-line-down');
  intervalSectionLeftSVG.appendChild(arrowLineLeftDown);
  // Create a DOM node for vertical base line
  let leftVerticalBaseLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  leftVerticalBaseLine.setAttribute('d', 'M25,90 L25,10')
  leftVerticalBaseLine.setAttribute('stroke', '#fff')
  leftVerticalBaseLine.setAttribute('stroke-width', '5px');
  leftVerticalBaseLine.setAttribute('fill', '#fff');
  leftVerticalBaseLine.classList.add('vertical-base-line');
  intervalSectionLeftSVG.appendChild(leftVerticalBaseLine);
  // Create a DOM node for arrow inverse
  let arrowInverse = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowInverse.setAttribute('d', 'M90,50 L80,60 L80,40 z')
  arrowInverse.setAttribute('stroke', '#fff')
  arrowInverse.setAttribute('stroke-width', '5px');
  arrowInverse.setAttribute('fill', '#fff')
  arrowInverse.classList.add('arrow-inverse');
  intervalSectionLeftSVG.appendChild(arrowInverse);
  let arrowLineInverseUp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLineInverseUp.setAttribute('d', 'M80,50 Q25,50,25,20')
  arrowLineInverseUp.setAttribute('stroke', '#fff')
  arrowLineInverseUp.setAttribute('stroke-width', '5px');
  arrowLineInverseUp.setAttribute('fill', 'none')
  arrowLineInverseUp.classList.add('arrow-line-inverse-up');
  intervalSectionLeftSVG.appendChild(arrowLineInverseUp);
  let arrowLineInverseDown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLineInverseDown.setAttribute('d', 'M80,50 Q25,50,25,80')
  arrowLineInverseDown.setAttribute('stroke', '#fff')
  arrowLineInverseDown.setAttribute('stroke-width', '5px');
  arrowLineInverseDown.setAttribute('fill', 'none')
  arrowLineInverseDown.classList.add('arrow-line-inverse-down');
  intervalSectionLeftSVG.appendChild(arrowLineInverseDown);
  // Step 2.2) Drawing section center
  // Create a DOM node for the base line
  let baseLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  baseLine.setAttribute('d', 'M0,50 L100,50')
  baseLine.setAttribute('stroke', '#fff')
  baseLine.setAttribute('stroke-width', '5px');
  baseLine.setAttribute('fill', '#fff');
  baseLine.classList.add('arrow-line');
  intervalSectionCenterSVG.appendChild(baseLine);
  // Step 2.3) Drawings section right
  // Create a DOM node for arrow left
  let arrowRight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowRight.setAttribute('d', 'M90,50 L80,60 L80,40 z')
  arrowRight.setAttribute('stroke', '#fff')
  arrowRight.setAttribute('stroke-width', '5px');
  arrowRight.setAttribute('fill', '#fff')
  arrowRight.classList.add('arrow');
  intervalSectionRightSVG.appendChild(arrowRight);
  let arrowLineRight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLineRight.setAttribute('d', 'M80,50 L0,50')
  arrowLineRight.setAttribute('stroke', '#fff')
  arrowLineRight.setAttribute('stroke-width', '5px');
  arrowLineRight.setAttribute('fill', '#fff')
  arrowLineRight.classList.add('arrow-line');
  intervalSectionRightSVG.appendChild(arrowLineRight);
  // Create a DOM node for arrow up
  let arrowRightUp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowRightUp.setAttribute('d', 'M75,10 L85,20 L65,20 z')
  arrowRightUp.setAttribute('stroke', '#fff')
  arrowRightUp.setAttribute('stroke-width', '5px');
  arrowRightUp.setAttribute('fill', '#fff');
  arrowRightUp.classList.add('arrow-up');
  intervalSectionRightSVG.appendChild(arrowRightUp);
  let arrowLineRightUp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLineRightUp.setAttribute('d', 'M0,50 Q75,50,75,20')
  arrowLineRightUp.setAttribute('stroke', '#fff')
  arrowLineRightUp.setAttribute('stroke-width', '5px');
  arrowLineRightUp.setAttribute('fill', 'none')
  arrowLineRightUp.classList.add('arrow-line-up');
  intervalSectionRightSVG.appendChild(arrowLineRightUp);
  // Create a DOM node for arrow down
  let arrowRightDown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowRightDown.setAttribute('d', 'M75,90 L85,80 L65,80 z')
  arrowRightDown.setAttribute('stroke', '#fff')
  arrowRightDown.setAttribute('stroke-width', '5px');
  arrowRightDown.setAttribute('fill', '#fff');
  arrowRightDown.classList.add('arrow-down');
  intervalSectionRightSVG.appendChild(arrowRightDown);
  let arrowLineRightDown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowLineRightDown.setAttribute('d', 'M0,50 Q75,50,75,80')
  arrowLineRightDown.setAttribute('stroke', '#fff')
  arrowLineRightDown.setAttribute('stroke-width', '5px');
  arrowLineRightDown.setAttribute('fill', 'none')
  arrowLineRightDown.classList.add('arrow-line-down');
  intervalSectionRightSVG.appendChild(arrowLineRightDown);
  // Create a DOM node for vertical line
  let rightVerticalBaseLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  rightVerticalBaseLine.setAttribute('d', 'M75,90 L75,10')
  rightVerticalBaseLine.setAttribute('stroke', '#fff')
  rightVerticalBaseLine.setAttribute('stroke-width', '5px');
  rightVerticalBaseLine.setAttribute('fill', '#fff');
  rightVerticalBaseLine.classList.add('vertical-base-line');
  intervalSectionRightSVG.appendChild(rightVerticalBaseLine);
  // Step 3) Save the elements in the DOM tree
  // Step 3.1) Save section SVG's
  intervalSectionLeft.appendChild(intervalSectionLeftSVG);
  intervalSectionCenter.appendChild(intervalSectionCenterSVG);
  intervalSectionRight.appendChild(intervalSectionRightSVG);
  // Step 3.2) Save sections
  intervalNode.appendChild(intervalSectionLeft);
  intervalNode.appendChild(intervalSectionCenter);
  intervalNode.appendChild(intervalSectionRight);
}

/**
 * Create a specific lane in the track
 */
function createLane(laneNumber) {
  // Create a DOM node for the lane
  let laneNode = document.createElement('div');
  // Set the lane properties
  laneNode.classList.add('lane');
  laneNode.setAttribute('lane-number', laneNumber);
  laneNode.setAttribute('lane-type', lanes[laneNumber].laneType || 'RACE');
  // Set interval nodes in the lane
  createIntervalsOnNode(laneNode);
  // Duplicate lane for starting area
  let startingLaneNode = laneNode.cloneNode();
  // Create start gate in start lane
  createStartGate(startingLaneNode);
  // Insert the lane in the DOM
  startContainer.appendChild(startingLaneNode);
  lanesContainer.appendChild(laneNode);
}

function createStartGate(startingLaneNode) {
  // Create a DOM node for the starting lane
  let startGateNode = document.createElement('div');
  // Set the starting lane properties
  startGateNode.classList.add('start-gate');
  // Set lane type selector
  startGateNode.addEventListener('click', laneTypeSelector);
  // Insert the side gate to the starting lane
  startingLaneNode.append(startGateNode);
};



function onIntervalSectionClicked(event) {
  let intervalSection = event.currentTarget;
  let intervalSectionStatus = intervalSection.getAttribute('status') || 'NONE';
  if (intervalSection.classList.contains('interval-section-left') || intervalSection.classList.contains('interval-section-right')) {
    if (intervalSectionStatus === 'NONE'){
      intervalSection.setAttribute('status', 'ARROW')
    } else if (intervalSectionStatus === 'ARROW'){
      intervalSection.setAttribute('status', 'ARROWLINE')
    } else if (intervalSectionStatus === 'ARROWLINE'){
      intervalSection.setAttribute('status', 'ARROWUP')
    } else if (intervalSectionStatus === 'ARROWUP'){
      intervalSection.setAttribute('status', 'ARROWLINEUP')
    } else if (intervalSectionStatus === 'ARROWLINEUP'){
      intervalSection.setAttribute('status', 'ARROWANDUP')
    } else if (intervalSectionStatus === 'ARROWANDUP'){
      intervalSection.setAttribute('status', 'ARROWLINEANDUP')
    } else if (intervalSectionStatus === 'ARROWLINEANDUP'){
      intervalSection.setAttribute('status', 'ARROWUPANDHORIZONTAL')
    } else if (intervalSectionStatus === 'ARROWUPANDHORIZONTAL'){
      intervalSection.setAttribute('status', 'ARROWLINEUPANDHORIZONTAL')
    } else if (intervalSectionStatus === 'ARROWLINEUPANDHORIZONTAL'){
      intervalSection.setAttribute('status', 'ARROWDOWN')
    } else if (intervalSectionStatus === 'ARROWDOWN'){
      intervalSection.setAttribute('status', 'ARROWLINEDOWN')
    } else if (intervalSectionStatus === 'ARROWLINEDOWN'){
      intervalSection.setAttribute('status', 'ARROWANDDOWN')
    } else if (intervalSectionStatus === 'ARROWANDDOWN'){
      intervalSection.setAttribute('status', 'ARROWLINEANDDOWN')
    } else if (intervalSectionStatus === 'ARROWLINEANDDOWN'){
      intervalSection.setAttribute('status', 'ARROWDOWNANDHORIZONTAL')
    } else if (intervalSectionStatus === 'ARROWDOWNANDHORIZONTAL'){
      intervalSection.setAttribute('status', 'ARROWLINEDOWNANDHORIZONTAL')
    } else if (intervalSectionStatus === 'ARROWLINEDOWNANDHORIZONTAL'){
      intervalSection.setAttribute('status', 'HORIZONTALUP')
    } else if (intervalSectionStatus === 'HORIZONTALUP'){
      intervalSection.setAttribute('status', 'HORIZONTALDOWN')
    } else if (intervalSectionStatus === 'HORIZONTALDOWN'){
      intervalSection.setAttribute('status', 'ARROWINVERSEUP')
    } else if (intervalSectionStatus === 'ARROWINVERSEUP'){
      intervalSection.setAttribute('status', 'ARROWINVERSEDOWN')
    } else if (intervalSectionStatus === 'ARROWINVERSEDOWN'){
      intervalSection.setAttribute('status', 'ARROWINVERSEUPANDHORIZONTAL')
    } else if (intervalSectionStatus === 'ARROWINVERSEUPANDHORIZONTAL'){
      intervalSection.setAttribute('status', 'ARROWINVERSEDOWNANDHORIZONTAL')
    } else if (intervalSectionStatus === 'ARROWINVERSEDOWNANDHORIZONTAL'){
      intervalSection.setAttribute('status', 'NONE')
    }
  } else if (intervalSection.classList.contains('interval-section-center')) {
    if (intervalSectionStatus === 'NONE'){
      intervalSection.setAttribute('status', 'ARROWLINE')
    } else if (intervalSectionStatus === 'ARROWLINE'){
      intervalSection.setAttribute('status', 'NONE')
    }
  }
}

function onPontoonClicked(event) {
  let pontoon = event.currentTarget;
  let pontoonStatus = pontoon.getAttribute('status') || 'CLOSED';
  if (pontoonStatus === 'CLOSED') {
    pontoon.setAttribute('status', 'OUTBOUND');
  } else if (pontoonStatus === 'OUTBOUND') {
    pontoon.setAttribute('status', 'INBOUND');
  } else if (pontoonStatus === 'INBOUND') {
    pontoon.setAttribute('status', 'CLOSED');
  }
}

function laneTypeSelector(event) {
  let laneNode = event.currentTarget.parentNode;
  let laneNumber = laneNode.getAttribute('lane-number');
  let laneType = laneNode.getAttribute('lane-type');
  if (laneType === 'FORBIDDEN') {
    document.querySelectorAll('[lane-number="' + laneNumber + '"]').forEach((element) => {
      element.setAttribute('lane-type', 'RACE');
    });
  } else if (laneType === 'RACE') {
    document.querySelectorAll('[lane-number="' + laneNumber + '"]').forEach((element) => {
      element.setAttribute('lane-type', 'WARMINGUP');
    });
  } else if (laneType === 'WARMINGUP') {
    document.querySelectorAll('[lane-number="' + laneNumber + '"]').forEach((element) => {
      element.setAttribute('lane-type', 'AVOID');
    });
  } else if (laneType === 'AVOID') {
    document.querySelectorAll('[lane-number="' + laneNumber + '"]').forEach((element) => {
      element.setAttribute('lane-type', 'NONE');
    });
  } else if (laneType === 'NONE') {
    document.querySelectorAll('[lane-number="' + laneNumber + '"]').forEach((element) => {
      element.setAttribute('lane-type', 'FORBIDDEN');
    });
  }
}


/**
 * Returns a JSON-document containing all lane settings.
 * @returns {Object} - An object containing all lane settings.
 */
function getTrackInfo() {
  // Preformat the document.
  let doc = {
    availableLanes: [],
    availableIntervals: [],
    availablePontoons: [],
    lanes: {},
    pontoons: {}
  };

  let intervalContainer = document.querySelector('.labels-container');

  // Get all intervals.
  intervalContainer.querySelectorAll('.interval').forEach((element) => {
    let interval = element.getAttribute('interval');

    if (!doc.availableIntervals.includes(interval)) {
      doc.availableIntervals.push(interval);
    }
  });

  let lanesContainer = document.querySelector('.lanes-container');

  // Get all lanes.
  lanesContainer.querySelectorAll('.lane').forEach((lane) => {
    let laneNumber = lane.getAttribute('lane-number');
    let laneType = lane.getAttribute('lane-type');

    // Add the lane number to the doc.
    doc.availableLanes.push(laneNumber);
    doc.lanes[laneNumber] = {}
    let laneDoc = doc.lanes[laneNumber];

    // Add the lane properties.
    laneDoc.laneType = laneType;
    laneDoc.intervals = {};

    // Add the interval information.
    doc.availableIntervals.forEach((availableInterval) => {
      laneDoc.intervals[availableInterval] = {};
      let laneIntervalDoc = laneDoc.intervals[availableInterval];

      let laneInterval = lane.querySelector(`[interval='${availableInterval}']`);

      // Add the sections for that laneInterval.
      if (laneInterval) {
        let left = laneInterval.querySelector('.interval-section-left');
        if (left) laneIntervalDoc.left = left.getAttribute('status');
        let center = laneInterval.querySelector('.interval-section-center');
        if (center) laneIntervalDoc.center = center.getAttribute('status');
        let right = laneInterval.querySelector('.interval-section-right');
        if (right) laneIntervalDoc.right = right.getAttribute('status');
      }
    });
  });

  let pontoonsContainer = document.querySelector('.pontoons-container');

  // Get all lanes.
  pontoonsContainer.querySelectorAll('.pontoon').forEach((pontoon) => {
    let pontoonNumber = pontoon.getAttribute('pontoon-number');

    // Add the lane number to the doc.
    doc.availablePontoons.push(pontoonNumber);
    doc.pontoons[pontoonNumber] = {}
    let pontoonDoc = doc.pontoons[pontoonNumber];

    pontoonDoc.status = pontoon.getAttribute('status');
  });

  return doc;
}

/**
 * Save the current track to the server.
 * @param {String} name - The name of the current track.
 */
function saveCurrentTrack(name = 'Baankaart') {
  return fetch('http://localhost:3000/api/tracks', {
    body: JSON.stringify({
      description: name,
      content: getTrackInfo()
    }),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    mode: 'cors'
  });
}

/**
 * Save the current track to the server.
 * @param {String} name - The name of the current track.
 */
function getTrackById(id) {
  return fetch(`http://localhost:3000/api/tracks/${id}`);
}
