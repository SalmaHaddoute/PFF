import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Charts = () => {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const areaChartRef = useRef(null);
  const [chartData, setChartData] = useState({
    statuts: [],
    reclamations_par_mois: [],
    top_signaleurs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE_URL = 'http://localhost:8000/api';

  // Fetch chart data on component mount
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log('Chart API Response:', response.data); // Debug log

        setChartData(response.data.data.charts);
        setLoading(false);
      } catch (err) {
        console.error('Fetch chart data error:', err.response || err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Render charts when data is available
  useEffect(() => {
    if (loading || error) return;

    // Map status values to French labels
    const statusMap = {
      'accepter': 'Validées',
      'rejeter': 'Rejetées',
      'en_attente': 'En attente'
    };

    // Pie chart: Reclamations by status
    const statusData = {
      labels: chartData.statuts.map(item => statusMap[item.status] || item.status),
      datasets: [{
        data: chartData.statuts.map(item => item.count),
        backgroundColor: ['rgb(65, 126, 89)', '#f94144', '#ffc107']
      }]
    };

    // Bar chart: Reclamations by month
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const barData = {
      labels: chartData.reclamations_par_mois.map(item => {
        const [, month] = item.month.split('-');
        return monthNames[parseInt(month, 10) - 1];
      }),
      datasets: [{
        label: 'Réclamations',
        data: chartData.reclamations_par_mois.map(item => item.count),
        backgroundColor: '#454547'
      }]
    };

    // Area chart: Top signaleurs
    const areaData = {
      labels: chartData.top_signaleurs.map(item => item.nom_entreprise_post),
      datasets: [{
        label: 'Signalements',
        data: chartData.top_signaleurs.map(item => item.count),
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
  }, [chartData, loading, error]);

  if (loading) {
    return <div className="text-center py-5">Chargement des graphiques...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid px-4">
      <div className="card mb-4">
        <div className="card-body position-relative" style={{ height: '300px' }}>
          <h6 className="mb-3">Activité des Signalements (Top Signaleurs)</h6>
          <canvas ref={areaChartRef}></canvas>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-body position-relative" style={{ height: '400px' }}>
              <h6 className="mb-3">Réclamations par Mois</h6>
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-body position-relative" style={{ height: '400px' }}>
              <h6 className="mb-3">Statut des Réclamations</h6>
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;