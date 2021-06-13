import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: 200,
    padding: 0,
    margin: 5
  },
  chartDiv: {
    width: '100%',
    marginLeft: -20
  }
});

const StatsCard = ({ data }) => {

  const classes = useStyles();

  const {
    result,
    queryType,
    queryId
  } = data;

	const chartOptions = {
		chart: {
      type: 'column',
      height: 150
		},
		title: {
			text: `${queryType} ${queryId}`
		},
		xAxis: {
			categories: result.map(rec => rec.pcu)
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Result'
			}
		},
		tooltip: {
      headerFormat: '<table>',
      pointFormat: '<tr><td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      useHTML: true,
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [
			{
				data: result.map(rec => rec.queryResult)
			}
		],
		legend: {
			enabled: false
		}
	};

	// useEffect(
	// 	() => {
	// 		setWords([]);
	// 		setCounts([]);
	// 		const words = [],
	// 			counts = [];
	// 		Object.keys(wordsStats).forEach((word) => {
	// 			words.push(word);
	// 			counts.push(wordsStats[word].count);
	// 		});
	// 		setWords(words);
	// 		setCounts(counts);
	// 	},
	// 	[ data ]
	// );

  return (
    <Card className={classes.root}>
      <CardContent className={classes.chartDiv}>
        <HighchartsReact 
          options={chartOptions} 
          highcharts={Highcharts} 
          style={{ width: 100, height: 125 }}
        />
      </CardContent>
    </Card>
	);

};

export default StatsCard;
