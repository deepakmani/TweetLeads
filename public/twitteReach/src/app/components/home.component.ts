import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TweetTemplate } from '../tweetTemplate';


@Component({
	template: `
  				<div style="width:60%">
			   	 <canvas baseChart
			            [datasets]="barChartData"
			            [labels]="barChartLabels"
			            [options]="barChartOptions"
			            [legend]="barChartLegend"
			            [chartType]="barChartType"
			            (chartHover)="chartHovered($event)"
			            (chartClick)="chartClicked($event)">
			        </canvas>
			        

			 	</div>
			 	
			 	`
})
export class HomeComponent {

     public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Tweets'},
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Tweets Sent'}
  ];

  public barChartLabels2:string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChartType2:string = 'bar';
  public barChartLegend2:boolean = true;
 
  public barChartData2:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Tweets Sent'},
  ];
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
 
}