import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const Charts = () => {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const areaChartRef = useRef(null);
  const [chartData, setChartData] = useState({
    statusData: null,
    barData: null,
    areaData: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/entreprise/statistiques');
        const apiData = response.data.data;

        // Préparer les données pour les graphiques
        const statusData = {
          labels: ['accepté', 'rejeté', 'En attente'],
          datasets: [{
            data: [
              apiData.statuts?.find(s => s.status === 'accepté')?.count || 0,
              apiData.statuts?.find(s => s.status === 'rejeté')?.count || 0,
              apiData.statuts?.find(s => s.status === 'en attente')?.count || 0
            ],
            backgroundColor: ['rgb(65, 126, 89)', '#f94144', '#ffc107']
          }]
        };

        const barData = {
          labels: apiData.top_reclamants?.map(item => item.nom_entreprise_post) || ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'Réclamations',
            data: apiData.top_reclamants?.map(item => item.count) || [12, 19, 3, 5, 2],
            backgroundColor: '#454547'
          }]
        };

        const areaData = {
          labels: apiData.reclamations_par_mois?.map(item => item.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Activité',
            data: apiData.reclamations_par_mois?.map(item => item.count) || [0, 10, 5, 2, 20, 30],
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)'
          }]
        };

        setChartData({ statusData, barData, areaData });
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        // Utiliser les données par défaut en cas d'erreur
        setChartData({
          statusData: {
            labels: ['Validées', 'Rejetées', 'En attente'],
            datasets: [{
              data: [30, 10, 5],
              backgroundColor: ['rgb(65, 126, 89)', '#f94144', '#ffc107']
            }]
          },
          barData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
              label: 'Réclamations',
              data: [12, 19, 3, 5, 2],
              backgroundColor: '#454547'
            }]
          },
          areaData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Activité',
              data: [0, 10, 5, 2, 20, 30],
              fill: true,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgb(75, 192, 192)'
            }]
          }
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!chartData.statusData || !chartData.barData || !chartData.areaData) return;

    let pieChart, barChart, areaChart;

    if (pieChartRef.current) {
      pieChart = new Chart(pieChartRef.current, {
        type: 'pie',
        data: chartData.statusData,
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
        data: chartData.barData,
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
        data: chartData.areaData,
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

    return () => {
      if (pieChart) pieChart.destroy();
      if (barChart) barChart.destroy();
      if (areaChart) areaChart.destroy();
    };
  }, [chartData]);

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