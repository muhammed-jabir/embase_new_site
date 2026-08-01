const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const icon = item.querySelector(".faq-icon");

    item.addEventListener("toggle", () => {

        if(item.open){

            icon.src = icon.dataset.minus;

        }else{

            icon.src = icon.dataset.plus;

        }

    });

});