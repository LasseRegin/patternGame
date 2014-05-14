/*
* PatternGame source code
* @author Lasse Regin Nielsen
* @date May 14 2014
*/

function GameClass(targetElement){

	// Global settings
	this.gameWidth = 500;
	this.gameHeight = 500;
	this.currentLevel = 1;
	this.patternBlockColors = new Array();
	this.patternBlockColors[0] = '#fff';
	this.patternBlockColors[1] = '#000';
	this.clicks = 0;
	this.score = 0;

	// Append gameDiv
	this.createGameDiv(targetElement);

	// Append patternDiv
	this.createPatternDiv();

	// Append scoreDiv
	this.createScoreDiv();

	// Append blockDiv
	this.createBlockDiv();

	// Initialize level 1
	this.initializeLevel(1);

}

GameClass.prototype.initializeLevel = function(level){
	
	// Specific level specifications
	this.numberOfBlockTypes = 5;
	this.gridN = level + 2;
	this.blockDimension = this.gameWidth/this.gridN;
	this.clickChecker = false;
	this.score += this.clicks;
	this.clicks = 0;
	this.updateScore();
	this.patternCount = 0;

	// Initialize Grid
	this.grid = Create2DArray(this.gridN);
	this.patternGrid = Create2DArray(this.gridN);
	
	this.blockColors = new Array();

	for(var i = 0; i < this.numberOfBlockTypes; i++)
		this.blockColors[i] = getRandomColor();

	for(var i = 0; i < this.gridN; i++)
		for(var j = 0; j < this.gridN; j++){
			this.createBlock(i,j);
			this.createPatternBlock(i,j);
		}

	this.checkPatterns();
}

GameClass.prototype.updateScore = function(){
	this.levelSpan.innerHTML = this.currentLevel;
	this.stepCountSpan.innerHTML = this.clicks;
	this.scoreSpan.innerHTML = this.score;
}

GameClass.prototype.createPatternBlock = function(i,j){
	var patternBlockNumber = Math.floor(Math.random()*2);
	var patternBlock = createDiv('svg', 'patternBlock', 'patternBlock ' + patternBlockNumber);
	patternBlock.style.background = this.patternBlockColors[patternBlockNumber];
	patternBlock.style.width = this.blockDimension/5 + 'px';
	patternBlock.style.height = this.blockDimension/5 + 'px';
	patternBlock.setAttribute('x',j);
	patternBlock.setAttribute('y',i);
	this.patternDiv.appendChild(patternBlock);
	this.patternGrid[i][j] = patternBlock;
	if(patternBlockNumber == 1)
		this.patternCount++;
}

GameClass.prototype.createPatternDiv = function(){
	this.patternDiv = createDiv('div', 'patternDiv', 'patternDiv');
	this.patternDiv.style.width = this.gameWidth/5 + 'px';
	this.patternDiv.style.height = this.gameHeight/5 + 'px';
	this.patternDiv.style.marginLeft = this.gameWidth + 20 + 'px';
	this.parentDiv.appendChild( this.patternDiv );
}

GameClass.prototype.createScoreDiv = function(){
	this.scoreDiv = createDiv('div', 'scoreDiv', 'scoreDiv');
	this.scoreDiv.style.width = this.gameWidth/5 + 'px';
	this.scoreDiv.style.height = this.gameHeight/5 + 'px';
	this.scoreDiv.style.marginLeft = this.gameWidth + 20 + 'px';
	this.scoreDiv.style.marginTop = this.gameHeight/5 + 20 + 'px';
	this.parentDiv.appendChild( this.scoreDiv );

	this.levelSpan = createDiv('span', 'levelSpan', 'levelSpan');
	this.levelSpan.innerHTML = this.currentLevel;
	this.scoreDiv.appendChild(this.levelSpan);

	this.scoreSpan = createDiv('span', 'scoreSpan', 'scoreSpan');
	this.scoreSpan.innerHTML = this.score;
	this.scoreDiv.appendChild(this.scoreSpan);

	this.stepCountSpan = createDiv('span', 'stepCountSpan', 'stepCountSpan');
	this.stepCountSpan.innerHTML = this.clicks;
	this.scoreDiv.appendChild(this.stepCountSpan);
}

GameClass.prototype.createBlockDiv = function(){
	this.blockDiv = createDiv('div', 'blockDiv', 'blockDiv');
	this.parentDiv.appendChild( this.blockDiv );
}

GameClass.prototype.createGameDiv = function(targetElement){
	this.parentDiv = createDiv('div', 'gameDiv', 'gameDiv');
	targetElement.appendChild( this.parentDiv );
}

GameClass.prototype.createBlock = function(i,j){
	var blockNumber = Math.floor(Math.random()*this.numberOfBlockTypes);
	var block = createDiv('svg', 'block', 'block ' + blockNumber);
	block.style.background = this.blockColors[blockNumber];
	block.style.width = this.blockDimension + 'px';
	block.style.height = this.blockDimension + 'px';
	block.setAttribute('x',j);
	block.setAttribute('y',i);
	this.blockDiv.appendChild(block);
	this.grid[i][j] = block;

	block.addEventListener("click", this.blockClicked.bind(this), false);

};

GameClass.prototype.deleteBlock = function(i,j){
	var time = 250; // ms
	var element = this.grid[i][j];
	element.classList.add("hide");
	var object = this;
	setTimeout(function(){
		element.remove();
		object.updateGrid(i,j);
		object.createBlock(object.gridN - 1, object.gridN - 1);
		object.checkPatterns();
	}, time);
}

GameClass.prototype.checkPatterns = function(){
	reqPositives = this.patternCount;
	reqNegatives = this.gridN*this.gridN - this.patternCount;
	for(var k = 0; k < this.numberOfBlockTypes; k++){
		var truePositives = 0;
		var trueNegatives = 0;
		for(var i = 0; i < this.gridN; i++)
			for(var j = 0; j < this.gridN; j++)
			{
				if(rgb2hex(this.grid[i][j].style.background).toLowerCase() == this.blockColors[k].toLowerCase() &&
				   hasClass(this.patternGrid[i][j], '1'))
					truePositives++;
				else if(rgb2hex(this.grid[i][j].style.background).toLowerCase() != this.blockColors[k].toLowerCase() &&
				   hasClass(this.patternGrid[i][j], '0'))
					trueNegatives++;
			}

		if(truePositives == reqPositives && 
		   trueNegatives == reqNegatives)
			this.levelComplete();
	}
}

GameClass.prototype.blockClicked = function(e) {

	if(!this.clickChecker)
	{
		this.clickChecker = true;
		var xValue = parseInt(e.target.getAttribute('x'));
		var yValue = parseInt(e.target.getAttribute('y'));
		this.deleteBlock(yValue,xValue);
		this.clicks++;
		this.updateScore();	
	}
}

GameClass.prototype.updateGrid = function(i,j){

	var childNodes = this.blockDiv.childNodes;
	var i = parseInt(i);
	var j = parseInt(j);
	var newXEnd = this.gridN - 1;
	var childNodesCount = childNodes.length;
	var childNodeNumberDeleted = (i*this.gridN) + j;
	for(var k = childNodeNumberDeleted; k < childNodesCount; k++)
	{
		var xValue = parseInt(childNodes[k].getAttribute('x'));
		var yValue = parseInt(childNodes[k].getAttribute('y'));
		if(xValue == 0)
		{
			var newY = parseInt(childNodes[k].getAttribute('y')) - 1;
			childNodes[k].setAttribute('x', newXEnd);
			childNodes[k].setAttribute('y', newY);
			this.grid[newY][newXEnd] = childNodes[k];
		}
		else
		{
			var newX = xValue - 1;
			childNodes[k].setAttribute('x', newX);
			this.grid[yValue][newX] = childNodes[k];
		}
	}
	this.clickChecker = false;	
}

GameClass.prototype.levelComplete = function(){
	alert('You have completede level ' + this.currentLevel);
	this.currentLevel++;
	this.clearLevel();
	this.initializeLevel(this.currentLevel);
}

GameClass.prototype.clearLevel = function(){
	this.patternDiv.innerHTML = "";
	this.blockDiv.innerHTML = "";
}

function createDiv(type, idName, className){
	var Div = document.createElement(type);
	Div.id = idName;
	Div.className = className;
	return Div;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function Create2DArray(rows) {
	var arr = [];

	for (var i=0;i<rows;i++) {
		arr[i] = [];
	}

	return arr;
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}