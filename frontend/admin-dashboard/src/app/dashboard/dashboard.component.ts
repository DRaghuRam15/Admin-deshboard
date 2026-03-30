import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard">
      <h1>Admin Dashboard</h1>
      <div class="metrics">
        <div class="metric">
          <h3>Active Users</h3>
          <p>{{ analytics?.activeUsers }}</p>
        </div>
        <div class="metric">
          <h3>Sign-ups</h3>
          <p>{{ analytics?.signUps }}</p>
        </div>
        <div class="metric">
          <h3>Sales</h3>
          <p>\${{ analytics?.sales }}</p>
        </div>
      </div>
      <div class="charts">
        <div class="chart">
          <h3>User Growth</h3>
          <canvas baseChart [data]="userGrowthData" [type]="lineChartType" [options]="lineChartOptions"></canvas>
        </div>
        <div class="chart">
          <h3>Sales Data</h3>
          <canvas baseChart [data]="salesData" [type]="barChartType" [options]="barChartOptions"></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; }
    .metrics { display: flex; justify-content: space-around; margin-bottom: 30px; }
    .metric { text-align: center; border: 1px solid #ccc; padding: 20px; border-radius: 5px; }
    .charts { display: flex; justify-content: space-around; }
    .chart { width: 45%; }
  `]
})
export class DashboardComponent implements OnInit {
  analytics: any;

  public lineChartType: ChartType = 'line';
  public barChartType: ChartType = 'bar';

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  public userGrowthData: ChartData<'line'> = {
    labels: [],
    datasets: [{ data: [], label: 'Users' }]
  };

  public salesData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Sales' }]
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.http.get('http://localhost:5000/api/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.analytics = data;
        this.userGrowthData.labels = data.charts.userGrowth.map((item: any) => item.month);
        this.userGrowthData.datasets[0].data = data.charts.userGrowth.map((item: any) => item.users);
        this.salesData.labels = data.charts.salesData.map((item: any) => item.month);
        this.salesData.datasets[0].data = data.charts.salesData.map((item: any) => item.sales);
      },
      error: (err) => {
        console.error('Error fetching analytics', err);
      }
    });
  }
}