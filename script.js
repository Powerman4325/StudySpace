const periods = [
["1","7:45am-8:15am"],
["2","8:15am-8:55am"],
["3","8:55am-9:30am"],

["BREAK","9:30am-9:45am"],

["4","9:45am-10:15am"],
["5","10:15am-10:45am"],
["6","10:45am-11:15am"],
["7","11:15am-11:45am"],

["BREAK","11:45am-12:00pm"],

["8","12:00pm-12:30pm"],
["9","12:30pm-1:00pm"],
["10","1:00pm-1:30pm"],

["HOME",""]];

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

const subjects = {
mathematics:"#ADD8E6",
biology:"#000000",
english_literature:"#C19A6B",
games:"#ded5cb",
english_language:"#C19A6B",
chemistry:"#000000",
physics:"#000000",
library:"#dfe6d5",
music:"#d8e0e7",
art:"#d3e1e1",
history_and_civics:"#000080",
history:"#000080",
geography:"#000080",
hindi:"#808080",
marathi:"#808080",
supw:"#ead2c9",
value_education:"#f0d5ce",
general_knowledge:"#d5d0cf",
computers:"#e5c9c1"};

function createSubjectCell(name) {
const td = document.createElement("td");
const textarea = document.createElement("textarea");
textarea.name = name;
textarea.setAttribute("aria-label",name.replaceAll("_"," "));
textarea.addEventListener("input",function() {
applySubjectColor(this);
document.getElementById("savedLabel").textContent = "Unsaved changes";
});
td.appendChild(textarea);
return td;}

function buildTable() {
const tableBody = document.getElementById("tableBody");
tableBody.innerHTML = "";
periods.forEach(function(period) {
const number = period[0];
const time = period[1];
const row = document.createElement("tr");

if(number === "BREAK") {
row.className = "break-row";
row.innerHTML = `
<td>BREAK</td>
<td>${time}</td>
<td colspan="5">BREAK</td>`;}

else if(number === "HOME") {
row.className = "home-row";
row.innerHTML = `
<td></td>
<td></td>
<td colspan="5">HOME TIME</td>`;}

else {
row.innerHTML = `
<td>${number}</td>
<td>${time}</td>`;
days.forEach(function(day) {
const prefix = day.substring(0,3).toLowerCase();
const cell = createSubjectCell(`${prefix}_${number}`);
row.appendChild(cell);});}

tableBody.appendChild(row);});}

function applySubjectColor(textarea) {
const value = textarea.value.toLowerCase().trim().replace(/\s+/g,"_");
const color = subjects[value];

if(color) {
textarea.parentElement.style.backgroundColor = color;}
else {
textarea.parentElement.style.backgroundColor = "";}}

function getTimetableData() {
const data = {
studentName:document.getElementById("studentName").value,
studentClass:document.getElementById("studentClass").value,
subjects:{}};

document.querySelectorAll("textarea").forEach(function(textarea) {
data.subjects[textarea.name] = textarea.value;});

return data;}

function saveTable() {
const data = getTimetableData();

localStorage.setItem(
"schoolTimetable",
JSON.stringify(data));

document.getElementById("savedLabel").textContent = "Saved just now";}
function loadTable() {
const saved = localStorage.getItem("schoolTimetable");
if(!saved) {
return;}

try {
const data = JSON.parse(saved);

document.getElementById("studentName").value = data.studentName || "";
document.getElementById("studentClass").value = data.studentClass || "";

document.querySelectorAll("textarea").forEach(function(textarea) {
textarea.value = data.subjects?.[textarea.name] || "";
applySubjectColor(textarea);});

document.getElementById("savedLabel").textContent = "Saved";}

catch(error) {
console.error("Could not load timetable:",error);}}

function clearTable() {
const confirmed = confirm("Are you sure you want to clear your timetable?");

if(!confirmed) {
return;}

localStorage.removeItem("schoolTimetable");
location.reload();}


function updateToday() {
const today = new Date().toLocaleDateString("en-US",{
weekday:"long"});

document.getElementById("dayLabel").textContent = today;

document.querySelectorAll("[data-day]").forEach(function(header) {
header.classList.toggle(
"today-column",
header.dataset.day === today);});

if(!days.includes(today)) {
document.getElementById("periodLabel").textContent = "Weekend";
return;}

document.querySelectorAll(".current-period").forEach(function(cell) {
cell.classList.remove("current-period");});

const now = new Date();

const minutes =
now.getHours() * 60 +
now.getMinutes();

const schoolPeriods = [
{start:465,end:495,number:1},
{start:495,end:535,number:2},
{start:535,end:570,number:3},
{start:585,end:615,number:4},
{start:615,end:645,number:5},
{start:645,end:675,number:6},
{start:675,end:705,number:7},
{start:720,end:750,number:8},
{start:750,end:780,number:9},
{start:780,end:810,number:10}];

let currentPeriod = null;

schoolPeriods.forEach(function(period) {
if(minutes >= period.start && minutes < period.end) {
currentPeriod = period.number;}});

if(currentPeriod) {
document.getElementById("periodLabel").textContent =
`Period ${currentPeriod}`;}
else if(minutes < 465) {
document.getElementById("periodLabel").textContent =
"School hasn't started";}
else {
document.getElementById("periodLabel").textContent =
"School finished";}}


document.getElementById("saveBtn").addEventListener(
"click",
saveTable);

document.getElementById("clearBtn").addEventListener(
"click",
clearTable);

document.getElementById("todayBtn").addEventListener(
"click",
updateToday);

document.getElementById("printBtn").addEventListener(
"click",
function() {
window.print();});

document.getElementById("studentName").addEventListener(
"input",
function() {
document.getElementById("savedLabel").textContent =
"Unsaved changes";});

document.getElementById("studentClass").addEventListener(
"input",
function() {
document.getElementById("savedLabel").textContent =
"Unsaved changes";});
buildTable();
loadTable();
updateToday();

setInterval(
updateToday,
30000);