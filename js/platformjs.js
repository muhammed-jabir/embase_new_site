const data = {

admission:{

dashboardTitle:"Admission Master",

dashboardSubTitle:"Empower your admissions team with a unified platform",

dashboardImage:"assets/images/chart.png",

title:"Admission Management System",

description:" Complete admission process: CRM, campaigns, lead tracking, applications, verification, ranking, allotments, fee collection, seat reservation, enrollment, onboarding.",

points:[
"Campaign Management",
"Mobile Admission Portal",
"Merit & Rank Lists",
"WhatsApp & Email Automation",
"Admission Analytics",
"Lead CRM"
]

},

academic:{

dashboardTitle:"Academic Overview",

dashboardSubTitle:"Streamline academic planning teaching and monitoring",

dashboardImage:"assets/images/academic-chart.png",

title:"Academic Management System",

description:"Curriculum planning, CBCS/NEP compliance,course management,time table scheduling,attendence lesson plans,teacher diary,internal assessment ,and LMS Integration",

points:[
"Faculty Digital Portfolio",
"Research & Publications",
"Attendance Automation",
"Faculty Performance Dashboard",
"Smart Timetable"
]

},
examination:{
    dashboardTitle:""

}

};

const tabs=document.querySelectorAll(".tab");

tabs.forEach(tab=>{

tab.addEventListener("click",function(){

tabs.forEach(btn=>btn.classList.remove("active"));

this.classList.add("active");

const item = data[this.dataset.tab];

if (!item) return;

document.getElementById("dashboardHeading").textContent=item.dashboardTitle;

document.getElementById("dashboardSubHeading").textContent=item.dashboardSubTitle;

document.getElementById("dashboardImage").src=item.dashboardImage;

document.getElementById("platformTitle").textContent=item.title;

document.getElementById("platformDescription").textContent=item.description;

const list=document.getElementById("platformList");

list.innerHTML="";

item.points.forEach(point=>{

list.innerHTML+=`
<li>
<img src="assets/star.svg" alt="">
${point}
</li>
`;

});

});

});