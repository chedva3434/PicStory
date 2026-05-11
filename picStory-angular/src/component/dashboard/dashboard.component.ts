import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  users: any[] = [];
  photos: any[] = [];
  today = new Date();

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {

    this.usersService.getUsers().subscribe(users => {
      this.users = users;

      this.usersService.getPhotos().subscribe(photos => {
        this.photos = photos;

        this.createChart();
      });

    });
  }

  createChart() {

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const usersByMonth = new Array(12).fill(0);
    const photosByMonth = new Array(12).fill(0);
  
    this.users.forEach(u => {
      if (!u.createdAt) return;
      const month = new Date(u.createdAt).getMonth();
      usersByMonth[month]++;
    });
  
    this.photos.forEach(p => {
      if (!p.createdAt) return;
      const month = new Date(p.createdAt).getMonth();
      photosByMonth[month]++;
    });
  
    new Chart("statsChart", {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Users Growth',
            data: usersByMonth,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.15)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#6366f1',
            pointRadius: 5,
            pointHoverRadius: 8
          },
          {
            label: 'Photos Uploads',
            data: photosByMonth,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.15)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#10b981',
            pointRadius: 5,
            pointHoverRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
  
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
  
        interaction: {
          mode: 'nearest',
          intersect: false
        },
  
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}