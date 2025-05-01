import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Charts = () => {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const areaChartRef = useRef(null);

  useEffect(() => {
    // Données des graphiques
    const statusData = {
      labels: ['Validées', 'Rejetées', 'En attente'],
      datasets: [{
        data: [30, 10, 5],
        backgroundColor: ['rgb(65, 126, 89)', '#f94144', '#ffc107']
      }]
    };
    
    const barData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Réclamations',
        data: [12, 19, 3, 5, 2],
        backgroundColor: '#454547'
      }]
    };
    
    const areaData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Activité',
        data: [0, 10, 5, 2, 20, 30],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)'
      }]
    };

    // Détruire les graphiques existants avant de créer de nouveaux
    let pieChart, barChart, areaChart;

    if (pieChartRef.current) {
      pieChart = new Chart(pieChartRef.current, {
        type: 'pie',
        data: statusData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    if (barChartRef.current) {
      barChart = new Chart(barChartRef.current, {
        type: 'bar',
        data: barData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    if (areaChartRef.current) {
      areaChart = new Chart(areaChartRef.current, {
        type: 'line',
        data: areaData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { 
              beginAtZero: true 
            },
            x: { 
              grid: { 
                color: 'rgba(0, 0, 0, 0.1)' 
              } 
            }
          }
        }
      });
    }

    // Nettoyage
    return () => {
      if (pieChart) pieChart.destroy();
      if (barChart) barChart.destroy();
      if (areaChart) areaChart.destroy();
    };
  }, []);

  return (
    <div className="container-fluid px-4">
      <div className="card mb-4">
        <div className="card-body position-relative" style={{ height: '300px' }}>
          <canvas ref={areaChartRef}></canvas>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-body position-relative" style={{ height: '400px' }}>
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-body position-relative" style={{ height: '400px' }}>
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;