
function d3PieChartController($scope, $element) {

  var self = this;

  var d3Data = [
      {label: "X", value: 10},
      {label: "Y", value: 15},
      {label: "Z", value: 3},
  ]

  change(d3Data);

  function change(data) {
    setTimeout(function () {
      // margin
      var margin = { top: 20, right: 20, bottom: 20, left: 20 },
        width = 500 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom,
        radius = width / 2;

      // color range
      var color = d3.scaleOrdinal()
        .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

      // pie chart arc. Need to create arcs before generating pie
      var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      // donut chart arc
      var arc2 = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

      // arc for the labels position
      var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

      // generate pie chart and donut chart
      var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.value; });

      // define the svg for pie chart
      //var elm = $element.find(".pieChart");
      var svg = d3.select(".pieChart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      // define the svg donut chart
      var svg2 = d3.select(".pieChart2").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // parse data
        data.forEach(function (d) {
          d.value = +d.value;
          d.label = d.label;
        })

        // "g element is a container used to group other SVG elements"
        var g = svg.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
          .attr("class", "arc");

        // append path 
        g.append("path")
          .attr("d", arc)
          .style("fill", function (d) { return color(d.data.label); })
          // transition 
          .transition()
          .ease(d3.easeLinear)
          .duration(2000)
          .attrTween("d", tweenPie);

        // append text
        g.append("text")
          .transition()
          .ease(d3.easeLinear)
          .duration(2000)
          .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .text(function (d) { return d.data.label; });


        // "g element is a container used to group other SVG elements"
        var g2 = svg2.selectAll(".arc2")
          .data(pie(data))
          .enter().append("g")
          .attr("class", "arc2");

        // append path 
        g2.append("path")
          .attr("d", arc2)
          .style("fill", function (d) { return color(d.data.label); })
          .transition()
          .ease(d3.easeLinear)
          .duration(2000)
          .attrTween("d", tweenDonut);

        // append text
        g2.append("text")
          .transition()
          .ease(d3.easeLinear)
          .duration(2000)
          .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .text(function (d) { return d.data.label; });

          // Helper function for animation of pie chart and donut chart
          function tweenPie(b) {
            b.innerRadius = 0;
            var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b);
            return function (t) { return arc(i(t)); };
          }

          function tweenDonut(b) {
            b.innerRadius = 0;
            var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b);
            return function (t) { return arc2(i(t)); };
          }
    });
  }


  


}
angular.module('myapp').component('d3PieChart', {
  templateUrl: 'app/d3PieChart/d3piechart.html',
  controller: d3PieChartController,
  bindings: {
    data: '='
  }
});