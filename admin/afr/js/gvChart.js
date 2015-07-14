/*
 * jQuery gvChart plugin
 * @name jquery.gvChart-1.0.1.min.js
 * @author Janusz Kamieński - http://www.ivellios.toron.pl/technikalia
 * @copyright (c) 2010 Janusz Kamieński (www.ivellios.toron.pl)
 * @license CC Attribution Works 3.0 Poland - http://creativecommons.org/licenses/by/3.0/pl/deed.en_US
 */

function gvChartInit() {
	gvChartCount = 0;
	google.load("visualization", "1", {
		packages: ["corechart"]
	})
}(function(jQuery) {
	jQuery.fn.gvChart = function(settings) {
		defaults = {
			hideTable: true,
			chartType: "AreaChart",
			chartDivID: "gvChartDiv",
			gvSettings: null,
			swap: false
		};
		var el = document.createElement("div");
		jQuery(el).insertBefore(this);
		gvChartCount++;
		gvChartID = defaults.chartDivID + gvChartCount;
		jQuery(el).attr("id", gvChartID);
		//ADDS CHARTTYPE AS CLASS
		jQuery(el).addClass("gvChart " + settings.chartType);
		jQuery(el).attr({
			dataType: theData,
			breakdown: theBreakdown,
			year: theYear
		});
		if (settings) {
			jQuery.extend(defaults, settings)
		}
		if (defaults.hideTable) $(this).hide();
		var data = new google.visualization.DataTable;
		data.addColumn("string", "X labels");
		var a = new Array;
		var headers = $(this).find("thead").find("th");
		var rows = $(this).find("tbody").find("tr");
		if (defaults.swap) {
			headers.each(function(a) {
				if (a) {
					data.addColumn("number", $(this).text())
				}
			});
			data.addRows(rows.length);
			rows.each(function(a) {
				data.setCell(a, 0, $(this).find("th").text())
			});
			rows.each(function(a) {
				$(this).find("td").each(function(b) {
					data.setCell(a, b + 1, parseFloat($(this).text()))
				})
			})
		} else {
			rows.each(function(a) {
				data.addColumn("number", $(this).find("th").text())
			});
			data.addRows(headers.length - 1);
			headers.each(function(a) {
				if (a) {
					data.setCell(a - 1, 0, $(this).text())
				}
			});
			rows.each(function(a) {
				$(this).find("td").each(function(b) {
					data.setCell(b, a + 1, parseFloat($(this).text()))
				})
			})
		}
		chartSettings = {
			title: $(this).find("caption").text()
		};
		if (defaults.gvSettings) {
			jQuery.extend(chartSettings, defaults.gvSettings)
		}
		eval("var chart = new google.visualization." + defaults.chartType + "(document.getElementById('" + gvChartID + "'))");
		var formatter = new google.visualization.NumberFormat({
			prefix: '$',
			suffix: 'M',
			fractionDigits: 0,
			negativeParens: true
		})
		formatter.format(data, 1);
		//FORMAT 2ND ROW IF STACKED CHART
		if (theData == 'netCost' || theData == 'netPosition') {
			formatter.format(data, 2);
		}
		chart.draw(data, chartSettings);
		google.visualization.events.addListener(chart, 'select', function() {
			//DOES THE CHART HAVE A SUB BREAKDOWN?
			//CLICK EVENT BRINGS UP SUB BREAKDOWN, BACK BUTTON WITH LABEL
			if (isFundBreakdown == true || $('#main > div').hasClass('PieChart') == false) {
				return false;
			} else {
				var selection = chart.getSelection()[0];
				var clickedLabel = data.getFormattedValue(selection.row, 0);
				theDataDisplay = theData.charAt(0).toUpperCase() + theData.substr(1).replace(/\s/g, "");
				$('#backNav a').html('Back to '+theDataDisplay);
				fundBreakdown = clickedLabel.charAt(0).toLowerCase() + clickedLabel.substr(1).replace(/\s/g, "");
				isFundBreakdown = true;
				gvRun();
				$('#chartApp #backNav').fadeIn(200);
			}
		});
	}
})(jQuery)