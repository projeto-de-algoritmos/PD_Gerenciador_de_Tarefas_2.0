let taskDuration = [];
let tableCells = [];

let dp = [0];
let next = [0];
let jobs = [0];
/*
let jobs = [0,{n: 8,begin: 8,end: 11,weight: 3},
{n: 1,begin: 1,end: 4,weight: 5},
{n: 7,begin: 6,end: 10,weight: 8},
{n: 2,begin: 3,end: 5,weight: 2},
{n: 6,begin: 5,end: 9,weight: 4},
{n: 3,begin: 0,end: 5,weight: 4},
{n: 5,begin: 3,end: 8,weight: 1},
{n: 4,begin: 4,end: 7,weight: 8}];
*/

function inicializeArrays(qtdtask) {
  for (let i = 0; i <= qtdtask; i++) {
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
  
  let cellTaskLabel = row.insertCell(0);
  cellTaskLabel.style.backgroundColor = "rgba(25,120,255,1)";
  cellTaskLabel.innerHTML = `<strong>Tarefas</strong>`;
  
  for (let i = 1; i < qtdsched + 1; i++) {
    let cell = row.insertCell(i);
    cell.style.backgroundColor = "rgba(25,120,255,1)";
    cell.innerHTML = `<strong>${i}ºHorário</strong>`;
  }
  
  let cellWeightLabel = row.insertCell(qtdsched+1);
  cellWeightLabel.style.backgroundColor = "rgba(25,120,255,1)";
  cellWeightLabel.innerHTML = `<strong>Pesos</strong>`;
  
  for (let i = 1; i < qtdtask + 1; i++) {
    row = table.insertRow(i);
    for (let j = 0; j <= qtdsched + 1; j++){
      if (j == 0) {
        let cellTask = row.insertCell(j);
        cellTask.innerHTML = `<input type="text" placeholder="Tarefa ${i}" style='width: 10vw;'></input>`;
        cellTask.style.backgroundColor = "rgba(25,120,255,1)";
      }
      else {
        if(j == qtdsched + 1){
          let cellWeight = row.insertCell(j);
          cellWeight.innerHTML = `<input type="number" id="weight-${i}" placeholder="Peso ${i}" style='width: 7vw;'></input>`;
          cellWeight.style.backgroundColor = "rgba(25,120,255,1)";
        }
        else{
       	  let cell = row.insertCell(j);
          tableCells[i-1][j-1] = cell;
          cell.style.backgroundColor = "white";
        }
      }
    }
  }
}

//Cria as animações da tabela de tarefas
function animationSetup(qtdsched) {
  //Hover na célula da tabela
  let colorPrev;
  $("td").hover(
    function() {
      let coordx = $(this).parent(); //linha obj
      let coordy = $(this); //coluna obj
      coordx = coordx.index();
      coordy = coordy.index();
      colorPrev = this.style.backgroundColor;
      if (coordx > 0 && coordy > 0 && coordy < qtdsched + 1) {
        $(this).animate({ "background-color": "yellow" }, 0);
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

    if (coordx > 0 && coordy > 0 && coordy < qtdsched + 1) {
      $(this).css("border", "4px solid blue");

      taskDuration[coordx].duration++;
      if (
   		taskDuration[coordx].startAt === undefined ||
        taskDuration[coordx].startAt === null
      ) {
        taskDuration[coordx].startAt = coordy;
      }
      else{
      	if(taskDuration[coordx].startAt > (coordy)){
      		taskDuration[coordx].startAt = coordy;
      	}	
      }
      
    }
  });
}

function paintSelectedJobs(selectedJobs){
	$("td").off( "mouseenter mouseleave" );
  $("td").off( "click" );
	
  selectedJobs.forEach((task) => {
		for(let j = task.begin -1;j < task.end;j++){
			tableCells[task.n - 1][j].style.backgroundColor = 'rgb(0,255,127)';
		}
	});
}

function weightedJobScheduling(j){
  if(dp[j] == undefined)
    dp[j] = Math.max(jobs[j].weight + weightedJobScheduling(next[j]),weightedJobScheduling(j-1)); 

  return dp[j];
}

function findNext(jobs){
  for(let i = jobs.length - 1;i > 0;i--){
    let p = i-1;
    while(jobs[i].begin <= jobs[p].end) p--;
    next[i] = p;
  }
}

function findSolution(j,solution){
  if(j == 0) return; 

  if(jobs[j].weight + dp[next[j]] > dp[j-1]){
    solution.push(jobs[j].n);
    findSolution(next[j],solution);
  }
  else{
    findSolution(j-1,solution);
  }

}

function solve(){
  //Pegando Jobs
  for (let i = 0; i < taskDuration.length; i++) {
    if(taskDuration[i].startAt === undefined || taskDuration[i].startAt === null) {
      continue;
    }
    const begin = taskDuration[i].startAt;
    const end = begin + taskDuration[i].duration - 1;
    const weight = parseInt(document.getElementById(`weight-${i}`).value);
    jobs.push({ n: i, begin, end, weight: weight});
  }

  let solution = [];
  jobs.sort((A, B) => A.end - B.end);

  findNext(jobs);

  for(let i = 1;i <= jobs.length;i++) dp[i] = undefined;

  const sumWeight = weightedJobScheduling(jobs.length - 1);
  console.log("Peso total: ",sumWeight);

  findSolution(jobs.length - 1,solution);
  console.log("Tarefas escolhidas:",solution);
  
  for(let current = 0;current < solution.length; current++){
    jobs.forEach((task) => {
      if(solution[current] == task.n){
        solution[current] = task;
      }
    });  
  }
  
  paintSelectedJobs(solution);
  document.getElementById("spanSumWeight").innerHTML = ' ' + sumWeight;
  document.getElementById("labelsumWeight").style.visibility = 'visible';
}



