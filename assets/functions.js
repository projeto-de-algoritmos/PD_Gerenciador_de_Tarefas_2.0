let taskDuration = [];
let tableCells = [];

function inicializeArrays(qtdtask) {
  for (let i = 0; i < qtdtask; i++) {
    tableCells[i] = [];
    taskDuration[i] = { duration: 0, startAt: null };
  }
}

//Pega as entradas passadas na index
function getInput() {
  let taskData = window.location.search;
  taskData = taskData.replace("?", "");
  taskData = taskData.split("&");
  let qtdtask = parseInt(taskData[0]);
  let qtdsched = parseInt(taskData[1]);
  return [qtdtask, qtdsched];
}

//Cria a tabela de tarefas
function createTable(qtdtask, qtdsched) {
  let table = document.getElementById("tableTask");
  let row = table.insertRow(0);
  let cell = row.insertCell(0);
  cell.style.backgroundColor = "rgba(25,120,255,1)";
  for (let i = 1; i < qtdsched + 1; i++) {
    let cell = row.insertCell(i);
    cell.style.backgroundColor = "rgba(25,120,255,1)";
    cell.innerHTML = `<strong>${i}ºHorário</strong>`;
  }

  for (let i = 1; i < qtdtask + 1; i++) {
    row = table.insertRow(i);
    for (let j = 0; j < qtdsched + 1; j++) {
      let cell = row.insertCell(j);
      if (j == 0) {
        cell.innerHTML = `<input type="text" placeholder="Tarefa ${i}"></input>`;
        cell.style.backgroundColor = "rgba(25,120,255,1)";
      } else {
     	tableCells[i-1][j-1] = cell;
        cell.style.backgroundColor = "white";
      }
    }
  }
}

//Cria as animações da tabela de tarefas
function animationSetup() {
  //Hover na célula da tabela
  let colorPrev;
  $("td").hover(
    function() {
      let coordx = $(this).parent(); //linha obj
      let coordy = $(this); //coluna obj
      coordx = coordx.index();
      coordy = coordy.index();
      colorPrev = this.style.backgroundColor;
      if (coordx > 0 && coordy > 0) {
        $(this).animate({ "background-color": "yellow" }, 50);
      }
    },
    function() {
      let coordx = $(this).parent();
      let coordy = $(this);
      coordx = coordx.index();
      coordy = coordy.index();
      if (coordx > 0 && coordy > 0) {
        $(this).animate({ "background-color": colorPrev }, 0);
      }
    }
  );

  //Click na célula da tabela
  $("td").click(function() {
    let coordx = $(this).parent();
    let coordy = $(this);
    coordx = coordx.index();
    coordy = coordy.index();

    if (coordx > 0 && coordy > 0) {
      $(this).css("border", "4px solid blue");

      taskDuration[coordx - 1].duration++;
      if (
   		taskDuration[coordx - 1].startAt === undefined ||
        taskDuration[coordx - 1].startAt === null
      ) {
        taskDuration[coordx - 1].startAt = coordy - 1;
      }
      else{
      	if(taskDuration[coordx - 1].startAt > (coordy -1)){
      		taskDuration[coordx - 1].startAt = coordy - 1;
      	}	
      }
    }
  });
}


function paintSelectedJobs(selectedJobs){
	$("td").off( "mouseenter mouseleave" );
  $("td").off( "click" );
	
  selectedJobs.forEach((task) => {
		for(let j = task.s;j <= task.f;j++){
			tableCells[task.i][j].style.backgroundColor = 'rgb(0,255,127)';
		}
	});
}

function weightedJobScheduling(j){
  if(dp[j] == undefined)
    dp[j] = Math.max(jobs.weight + weightedJobScheduling(next[j]),weightedJobScheduling(j-1)); 

  return dp[j];
}

function findNext(jobs){
  let next = [];
  for(let i = jobs.length;i >= 0;i--){
    let p = i-1;
    while(jobs[i].begin < jobs[p].end) p--;
    next[i] = p;
  }
  return next;
}

function findSolution(j,solution){
  if(j == 0) return; 

  if(jobs[j].weight + dp[next[j]] > dp[j-1]){
    solution.push(jobs[j].n);
    findSolution(next[j]);
  }
  else{
    findSolution(j-1);
  }

}

function solve(jobs){
  let solution = [];
  jobs = sort((jobA, jobB) => jobA.end > jobB.end);
  
  for(let i = 1;i <= jobs.length;i++) dp[i] = undefined;

  weightedJobScheduling(jobs.length);
  
  findSolution(jobs.length,solution);
}

let dp = [0];
let next = [];
let jobs = [0,{n: 8,begin: 8,end: 11,weight: 3},
              {n: 1,begin: 1,end: 4,weight: 5},
              {n: 7,begin: 6,end: 10,weight: 8},
              {n: 2,begin: 3,end: 5,weight: 2},
              {n: 6,begin: 5,end: 9,weight: 4},
              {n: 3,begin: 0,end: 5,weight: 4},
              {n: 5,begin: 3,end: 8,weight: 1},
              {n: 4,begin: 4,end: 7,weight: 8}];//{n: ,begin: end: ,weight: }

