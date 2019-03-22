/*learned from Justin Cohler's github*/

window.addEventListener("load", function () {

    new Promise(function (resolve, reject) {

        setTimeout(() => resolve(), 500);

    }).then(function () { 

        console.log("step 1");
        d3.select("#canvas-svg")
            .append("a")
            .classed("instruction", true)
            .append("span")
            .attr("top", 100)
            .attr("left", -600)
            .text("Mouse over different state to see the corresponding Index trends");

        setTimeout(() => {
            d3.select(".instruction").remove();
            
        }, 3000);
        return;
    });
});